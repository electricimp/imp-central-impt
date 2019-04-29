// MIT License
//
// Copyright 2018-2019 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

'use strict';

require('jasmine-expect');
const config = require('../config');
const Shell = require('shelljs');
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');

const PRODUCT_NAME = `__impt_bld_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_bld_device_group${config.suffix}`;
const PRODUCT2_NAME = `__impt_bld_product_2${config.suffix}`;
const DEVICE_GROUP2_NAME = `__impt_bld_device_group_2${config.suffix}`;
const DEVICE_GROUP3_NAME = `__impt_bld_device_group_3${config.suffix}`;
const BUILD_TAG = `build_tag${config.suffix}`;
const BUILD2_TAG = `build2_tag${config.suffix}`;
const BUILD3_TAG = `build3_tag${config.suffix}`;
const BUILD4_TAG = `build4_tag${config.suffix}`;
const BUILD_ORIGIN = `build_origin${config.suffix}`;

const outputMode = '-z json';

// Test suite for 'impt build list' command.
// Runs 'impt build list' command with different combinations of options,
describe(`impt build list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let dg_id = null;
    let product_id = null;
    let build_id = null;
    let build2_id = null;
    let build2_sha = null;
    let build3_id = null;
    let email = null;
    let userid = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(_testSuiteCleanUp).
            then(_testSuiteInit).
            then(() => jasmine.addMatchers(customMatcher)).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        _testSuiteCleanUp().
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // custom matcher for search Build with expected properties in Build array
    let customMatcher = {
        toContainBuild: function (util, customEqualityTesters) {
            return {
                compare: function (commandOut, expected = {}) {
                    let result = { pass: false };
                    const BuildArray = JSON.parse(commandOut.output);
                    if (!Array.isArray(BuildArray)) return result;
                    lodash.map(BuildArray, function (BuildItem) {
                        lodash.map(BuildItem, function (BuildProperties) {
                            let compareFlag = true;
                            lodash.map(BuildProperties, function (value, key) {
                                if (typeof (value) === 'object' && typeof (expected[key]) === 'object') {
                                    lodash.map(value, function (subval, subkey) {
                                        compareFlag = compareFlag && (expected[key][subkey] === undefined ? true : util.equals(subval, expected[key][subkey], customEqualityTesters));
                                    });
                                }
                                else
                                    compareFlag = compareFlag && (expected[key] === undefined ? true : value == expected[key]);
                            });
                            // all properties matched
                            if (compareFlag) result.pass = true;
                        });
                    });
                    return result;
                }
            };
        },
        toHaveBuildCountEqual: function () {
            return {
                compare: function (commandOut, expected) {
                    let result = { pass: false };
                    const BuildArray = JSON.parse(commandOut.output);
                    if (Array.isArray(BuildArray) && BuildArray.length === expected) result.pass = true;
                    return result;
                }
            };
        },
        toHaveBuildCountGreaterThan: function () {
            return {
                compare: function (commandOut, expected) {
                    let result = { pass: false };
                    const BuildArray = JSON.parse(commandOut.output);
                    if (Array.isArray(BuildArray) && BuildArray.length > expected) result.pass = true;
                    return result;
                }
            };
        },
    };

    // prepare environment for build list command testing
    function _testSuiteInit() {
        return ImptTestHelper.getAccountAttrs().
            then((account) => { email = account.email; userid = account.id; }).
            then(() => ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck)).
            then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt product create -n ${PRODUCT2_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Failed to create product");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP2_NAME} -p ${PRODUCT2_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                if (!dg_id) fail("TestSuitInit error: Failed to create device group");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP3_NAME} -p ${PRODUCT2_NAME}`, (commandOut) => {
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
            then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -t ${BUILD_TAG}`, (commandOut) => {
                build_id = ImptTestHelper.parseId(commandOut);
                if (!build_id) fail("TestSuiteInit error: Failed to create build");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP2_NAME} -f -t ${BUILD2_TAG} -x devicecode.nut`, (commandOut) => {
                build2_id = ImptTestHelper.parseId(commandOut);
                if (!build2_id) fail("TestSuiteInit error: Failed to create build");
                build2_sha = ImptTestHelper.parseSha(commandOut);
                if (!build2_sha) fail("TestSuiteInit error: Failed to parse build sha");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP3_NAME} -t ${BUILD3_TAG}`, (commandOut) => {
                build3_id = ImptTestHelper.parseId(commandOut);
                if (!build3_id) fail("TestSuiteInit error: Failed to create build");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt dg delete -g ${DEVICE_GROUP3_NAME} -q`, ImptTestHelper.emptyCheck));
    }

    // delete all entities using in impt build list test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheck).
            then(() => ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT2_NAME} -f -b -q`, ImptTestHelper.emptyCheck));
    }

    // check 'no deployments found' output message 
    function _checkNoDeploymentsFoundMessage(commandOut) {
        ImptTestHelper.checkOutputMessage('', commandOut,
            'No Deployments are found.');
    }

    describe('build list positive tests >', () => {
        it('build list by owner me and dg type', (done) => {
            ImptTestHelper.runCommand(`impt build list --owner me --dg-type development -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build_id });
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountGreaterThan(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by owner id and product id', (done) => {
            ImptTestHelper.runCommand(`impt build list --owner ${userid} --product ${product_id} -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toContainBuild({ id: build3_id });
                expect(commandOut).toHaveBuildCountEqual(2);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by owner name and product name', (done) => {
            ImptTestHelper.runCommand(`impt build list --owner ${config.username} --product ${PRODUCT2_NAME} -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toContainBuild({ id: build3_id });
                expect(commandOut).toHaveBuildCountEqual(2);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by owner email and dg id', (done) => {
            ImptTestHelper.runCommand(`impt build list --owner ${email} --dg ${dg_id} -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by dg name and sha', (done) => {
            ImptTestHelper.runCommand(`impt build list --dg ${DEVICE_GROUP2_NAME} --sha ${build2_sha} -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by sha and tag', (done) => {
            ImptTestHelper.runCommand(`impt build list --sha ${build2_sha} --tag ${BUILD2_TAG}  -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by several tags', (done) => {
            ImptTestHelper.runCommand(`impt build list -t ${BUILD2_TAG} -t ${BUILD_TAG}  -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build_id });
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(2);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by product id and flagged', (done) => {
            ImptTestHelper.runCommand(`impt build list -p ${product_id} --flagged -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by product id and unflagged', (done) => {
            ImptTestHelper.runCommand(`impt build list -p ${product_id} --unflagged -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build3_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by product id  and zombie', (done) => {
            ImptTestHelper.runCommand(`impt build list -p ${product_id} --zombie -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build3_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by product id and not zombie', (done) => {
            ImptTestHelper.runCommand(`impt build list -p ${product_id} --non-zombie -z json`, (commandOut) => {
                expect(commandOut).toContainBuild({ id: build2_id });
                expect(commandOut).toHaveBuildCountEqual(1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('build list by not exist owner', (done) => {
            ImptTestHelper.runCommand(`impt build list -o not-exist-owner`, (commandOut) => {
                _checkNoDeploymentsFoundMessage(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe('build list negative tests >', () => {
    });
});

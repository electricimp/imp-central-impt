// MIT License
//
// Copyright 2018 Electric Imp
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
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = `__impt_bld_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_bld_device_group${config.suffix}`;
const PRODUCT2_NAME = `__impt_bld_product_2${config.suffix}`;
const DEVICE_GROUP2_NAME = `__impt_bld_device_group_2${config.suffix}`;

// Test suite for 'impt build cleanup' command.
// Runs 'impt build cleanup' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build cleanup test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let build_id = null;
        let build2_id = null;
        let build3_id = null;
        let build4_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testCleanUp).
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(() => jasmine.addMatchers(customMatcher)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testCleanUp().
                then(_testSuiteCleanUp).
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // custom matcher for search Build with expected properties in Build array
        let customMatcher = {
            toContainsBuild: function (util, customEqualityTesters) {
                return {
                    compare: function (commandOut, expected = {}) {
                        let result = { pass: false };
                        const BuildArray = JSON.parse(commandOut.output);
                        if (!Array.isArray(BuildArray)) return result;
                        lodash.map(BuildArray, function (BuildItem) {
                            lodash.map(BuildItem, function (DgProperties) {
                                let compareFlag = true;
                                lodash.map(DgProperties, function (value, key) {
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
            toBuildCountEqual: function () {
                return {
                    compare: function (commandOut, expected) {
                        let result = { pass: false };
                        const BuildArray = JSON.parse(commandOut.output);
                        if (Array.isArray(BuildArray) && BuildArray.length === expected) result.pass = true;
                        return result;
                    }
                };
            },
            toBuildCountMore: function () {
                return {
                    compare: function (commandOut, expected) {
                        let result = { pass: false };
                        const BuildArray = JSON.parse(commandOut.output);
                        if (Array.isArray(BuildArray) && BuildArray.length > expected) result.pass = true;
                        return result;
                    }
                };
            },
            toBuildCountEqualOrMore: function () {
                return {
                    compare: function (commandOut, expected) {
                        let result = { pass: false };
                        const BuildArray = JSON.parse(commandOut.output);
                        if (Array.isArray(BuildArray) && BuildArray.length >= expected) result.pass = true;
                        return result;
                    }
                };
            },
        };

        // prepare environment for build cleanup command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt product create -n ${PRODUCT2_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // delete all entities using in impt build cleanup test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT2_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx));
        }

        function _testInit() {
            return ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP2_NAME} -p ${PRODUCT2_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    if (!build_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build2_id = ImptTestHelper.parseId(commandOut);
                    if (!build2_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP2_NAME}`, (commandOut) => {
                    build3_id = ImptTestHelper.parseId(commandOut);
                    if (!build3_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP2_NAME}`, (commandOut) => {
                    build4_id = ImptTestHelper.parseId(commandOut);
                    if (!build4_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                // delete device groups to generate zombie builds
                then(() => ImptTestHelper.runCommand(`impt dg delete -g ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommand(`impt dg delete -g ${DEVICE_GROUP2_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                // set flagged attribute for some zombie builds
                then(() => ImptTestHelper.runCommand(`impt build update -b ${build_id} -f`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommand(`impt build update -b ${build3_id} -f`, ImptTestHelper.emptyCheckEx));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt build cleanup -p ${PRODUCT_NAME} -u -q`, ImptTestHelper.emptyCheckEx).
            then(()=>ImptTestHelper.runCommand(`impt build cleanup -p ${PRODUCT2_NAME} -u -q`, ImptTestHelper.emptyCheckEx));
        }

        // check 'no deployments found' output message 
        function _checkNoDeploymentsFoundMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(outputMode, commandOut,
                'No Deployments are found.');
        }

        // check 'deployment successfully deleted' output message 
        function _checkSuccessDeleteDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        // check 'deployment successfully updated' output message 
        function _checkSuccessUpdatedDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        describe('build cleanup positive tests >', () => {
            beforeEach((done) => {
                _testInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build cleanup by product id', (done) => {
                ImptTestHelper.runCommand(`impt build cleanup --product ${product_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt build list -o me --zombie -z json`, (commandOut) => {
                        expect(commandOut).toContainsBuild({ id: build_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).toContainsBuild({ id: build4_id });
                        expect(commandOut).toBuildCountEqualOrMore(3);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('flagged build cleanup by product name', (done) => {
                ImptTestHelper.runCommand(`impt build cleanup --product ${PRODUCT_NAME} -u -q ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt build list  -o me --zombie -z json`, (commandOut) => {
                        expect(commandOut).not.toContainsBuild({ id: build_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).toContainsBuild({ id: build4_id });
                        expect(commandOut).toBuildCountEqualOrMore(2);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build cleanup', (done) => {
                ImptTestHelper.runCommand(`impt build cleanup -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build4_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt build list -o me --zombie -z json`, (commandOut) => {
                        expect(commandOut).toContainsBuild({ id: build_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).not.toContainsBuild({ id: build4_id });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('flagged build cleanup', (done) => {
                ImptTestHelper.runCommand(`impt build cleanup -u -q ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build_id);
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build3_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build3_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build4_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt build list -o me --zombie -z json`, (commandOut) => {
                        expect(commandOut).not.toContainsBuild({ id: build_id });
                        expect(commandOut).not.toContainsBuild({ id: build3_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).not.toContainsBuild({ id: build4_id });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build cleanup by not exist product', (done) => {
                ImptTestHelper.runCommand(`impt build cleanup -p not-exist-product -u -q ${outputMode}`, (commandOut) => {
                    _checkNoDeploymentsFoundMessage(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build cleanup negative tests >', () => {
        });
    });
});

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
const Shell = require('shelljs');
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';
const PRODUCT2_NAME = '__impt_product_2';
const DEVICE_GROUP2_NAME = '__impt_device_group_2';

// Test suite for 'impt build cleanup' command.
// Runs 'impt build cleanup' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt build cleanup test suite >', () => {
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

        // custom matcher for search Device with expected properties in Device array
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
        };

        // prepare environment for build cleanup command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT2_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all entities using in impt build cleanup test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT2_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx));
        }

        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP2_NAME} -p ${PRODUCT2_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build2_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP2_NAME}`, (commandOut) => {
                    build3_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP2_NAME}`, (commandOut) => {
                    build4_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                // delete device groups to generate zombie builds
                then(() => ImptTestHelper.runCommandEx(`impt dg delete -g ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt dg delete -g ${DEVICE_GROUP2_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                // set flagged attribute for some zombie builds
                then(() => ImptTestHelper.runCommandEx(`impt build update -b ${build_id} -f`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt build update -b ${build3_id} -f`, ImptTestHelper.emptyCheckEx));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt build cleanup -u -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'no deployments found' output message 
        function _checkNoDeploymentsFoundMessage(commandOut) {
            ImptTestHelper.checkOutputMessageEx(outputMode, commandOut,
                'No Deployments are found.');
        }

        // check 'deployment successfully deleted' output message 
        function _checkSuccessDeleteDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        // check 'deployment successfully updated' output message 
        function _checkSuccessUpdatedDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
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
                ImptTestHelper.runCommandEx(`impt build cleanup --product ${product_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build list --zombie -z json`, (commandOut) => {
                        expect(commandOut).toContainsBuild({ id: build_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).toContainsBuild({ id: build4_id });
                        expect(commandOut).toBuildCountEqual(3);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('flagged build cleanup by product name', (done) => {
                ImptTestHelper.runCommandEx(`impt build cleanup --product ${PRODUCT_NAME} -u -q ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build list --zombie -z json`, (commandOut) => {
                        expect(commandOut).not.toContainsBuild({ id: build_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).toContainsBuild({ id: build4_id });
                        expect(commandOut).toBuildCountEqual(2);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build cleanup', (done) => {
                ImptTestHelper.runCommandEx(`impt build cleanup -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build4_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build list --zombie -z json`, (commandOut) => {
                        expect(commandOut).toContainsBuild({ id: build_id });
                        expect(commandOut).toContainsBuild({ id: build3_id });
                        expect(commandOut).not.toContainsBuild({ id: build2_id });
                        expect(commandOut).not.toContainsBuild({ id: build4_id });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('flagged build cleanup', (done) => {
                ImptTestHelper.runCommandEx(`impt build cleanup -u -q ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build_id);
                    _checkSuccessUpdatedDeploymentMessage(commandOut, build3_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build2_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build3_id);
                    _checkSuccessDeleteDeploymentMessage(commandOut, build4_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build list --zombie -z json`, (commandOut) => {
                        expect(commandOut).toBuildCountEqual(0);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build cleanup by not exist product', (done) => {
                ImptTestHelper.runCommandEx(`impt build cleanup -p not-exist-product -u -q ${outputMode}`, (commandOut) => {
                    _checkNoDeploymentsFoundMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build cleanup negative tests >', () => {


        });
    });
});

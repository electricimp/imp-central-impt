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
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = '__impt_dg_product';
const DEVICE_GROUP_NAME = '__impt_dg_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';

// Test suite for 'impt dg builds' command.
// Runs 'impt dg builds' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device group builds test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let build_id = null;
        let build2_id = null;
        let build3_id = null;

        // custom matcher for search flagged and  not flagged deployments
        let customMatcher = {
            toContainsDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === undefined);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array not contains deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            },
            toContainsFlaggedDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === true);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains flagged deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array not contains flagged deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            }
        };

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

        // prepare environment for device group builds command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
        }

        // delete all entities using in impt dg builds test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME} -f`, (commandOut) => {
                build_id = ImptTestHelper.parseId(commandOut);
                if (!build_id) fail("TestInit error: Fail create build");
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME} -f`, (commandOut) => {
                    build2_id = ImptTestHelper.parseId(commandOut);
                    if (!build2_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build3_id = ImptTestHelper.parseId(commandOut);
                    if (!build3_id) fail("TestInit error: Fail create build");
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt dg update -g ${DEVICE_GROUP_NAME} --min-supported-deployment  ${build2_id}`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt build delete -b ${build_id} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt build delete -b ${build2_id} -f -q`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt build delete -b ${build3_id} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        describe('device group build positive tests >', () => {
            beforeAll((done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

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

            it('builds by device group id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds --dg ${dg_id} -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainsFlaggedDeployment(build_id);
                    expect(json).toContainsFlaggedDeployment(build2_id);
                    expect(json).toContainsDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unflag builds by device group name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds --dg ${DEVICE_GROUP_NAME} --unflag -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainsDeployment(build_id);
                    expect(json).toContainsDeployment(build2_id);
                    expect(json).toContainsDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unflag old builds by device group name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds --dg ${DEVICE_GROUP_NAME} --unflag-old -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainsDeployment(build_id);
                    expect(json).toContainsFlaggedDeployment(build2_id);
                    expect(json).toContainsDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove builds by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds --remove -q -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).not.toContainsDeployment(build_id);
                    expect(json).toContainsFlaggedDeployment(build2_id);
                    expect(json).toContainsDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group builds negative tests >', () => {
            it('builds by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('builds by not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg builds -g not-exist-device-group ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

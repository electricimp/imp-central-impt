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
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;
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
            toContainDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === undefined);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array does not contain deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            },
            toContainFlaggedDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === true);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains flagged deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array does not contain flagged deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            }
        };

        beforeAll((done) => {
            ImptTestHelper.init().
                then(() => ImptTestHelper.checkDeviceStatus(config.devices[config.deviceidx])).
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(() => jasmine.addMatchers(customMatcher)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(() => ImptTestHelper.restoreDeviceInfo()).
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for device group builds command testing
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
                then((dgInfo) => { dg_id = dgInfo.dgId; }).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
        }

        // delete all entities using in impt dg builds test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        function _testInit() {
            return ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -f`, (commandOut) => {
                build_id = ImptTestHelper.parseId(commandOut);
                if (!build_id) fail("TestInit error: Failed to create build");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -f`, (commandOut) => {
                    build2_id = ImptTestHelper.parseId(commandOut);
                    if (!build2_id) fail("TestInit error: Failed to create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build3_id = ImptTestHelper.parseId(commandOut);
                    if (!build3_id) fail("TestInit error: Failed to create build");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt dg update -g ${DEVICE_GROUP_NAME} --min-supported-deployment  ${build2_id}`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt build delete -b ${build_id} -f -q`, ImptTestHelper.emptyCheck).
                then(() => ImptTestHelper.runCommand(`impt build delete -b ${build2_id} -f -q`, ImptTestHelper.emptyCheck)).
                then(() => ImptTestHelper.runCommand(`impt build delete -b ${build3_id} -f -q`, ImptTestHelper.emptyCheck));
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
                ImptTestHelper.runCommand(`impt dg builds --dg ${dg_id} -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainFlaggedDeployment(build_id);
                    expect(json).toContainFlaggedDeployment(build2_id);
                    expect(json).toContainDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unflag builds by device group name', (done) => {
                ImptTestHelper.runCommand(`impt dg builds --dg ${DEVICE_GROUP_NAME} --unflag -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainDeployment(build_id);
                    expect(json).toContainDeployment(build2_id);
                    expect(json).toContainDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unflag old builds by device group name', (done) => {
                ImptTestHelper.runCommand(`impt dg builds --dg ${DEVICE_GROUP_NAME} --unflag-old -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).toContainDeployment(build_id);
                    expect(json).toContainFlaggedDeployment(build2_id);
                    expect(json).toContainDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove builds by project', (done) => {
                ImptTestHelper.runCommand(`impt dg builds --remove -q -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json).not.toContainDeployment(build_id);
                    expect(json).toContainFlaggedDeployment(build2_id);
                    expect(json).toContainDeployment(build3_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group builds negative tests >', () => {
            it('builds by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt dg builds ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('builds by not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt dg builds -g not-exist-device-group ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

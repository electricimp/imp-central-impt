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

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';

// Test suite for 'impt dg builds' command.
// Runs 'impt dg builds' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group builds test suite >', () => {
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

        // prepare environment for impt log get command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));


        }

        // delete all entities using in impt log get test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }



        describe('log get positive tests >', () => {
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

            it('log get by not exist project', (done) => {
                ImptTestHelper.runCommandInteractive(`impt log get ${outputMode}`, '\x0d', (commandOut) => {
                   
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });




        });

        describe('log get negative tests >', () => {

            it('log get by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt log get ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DEVICE);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log get without device value', (done) => {
                ImptTestHelper.runCommandEx(`impt log get ${outputMode} -d`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'd');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt log get ${outputMode} -d ""`, (commandOut) => {
                        MessageHelper.checkMissingArgumentValueError(commandOut, 'device');
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log get with incorrect page size value', (done) => {
                ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} -s 0`, (commandOut) => {
                    MessageHelper.checkOptionPositiveValueError(commandOut, '--page-size');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} -s -4`, (commandOut) => {
                        MessageHelper.checkOptionPositiveValueError(commandOut, '--page-size');
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log get with incorrect page number value', (done) => {
                ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} --page-number 0`, (commandOut) => {
                    MessageHelper.checkOptionPositiveValueError(commandOut, '--page-number');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} -n -4`, (commandOut) => {
                        MessageHelper.checkOptionPositiveValueError(commandOut, '--page-number');
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log get without size and num values', (done) => {
                ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} -s`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} ${outputMode} -n`, (commandOut) => {
                        MessageHelper.checkNotEnoughArgumentsError(commandOut, 'n');
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log get without output value', (done) => {
                ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} -z`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'z');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt log get -d ${config.devices[0]} -z undefined`, (commandOut) => {
                        MessageHelper.checkInvalidValuesError(commandOut);
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

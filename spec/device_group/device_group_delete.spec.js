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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');
const ImptDgTestHelper = require('./ImptDgTestHelper');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt dg delete ' command.
// Runs 'impt dg delete' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group delete test suite >', () => {
        let dg_id = null;
        let build_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);


        // prepare environment for device group delete command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx);
        }

        // prepare environment for device group delete command test 
        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // delete all entities using in impt dg delete test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'device group successfully deleted' output message 
        function _checkSuccessDeleteDeviceGroupMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'deployment successfully deleted' output message 
        function _checkSuccessDeleteDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        // check 'deployment successfully updated' output message 
        function _checkSuccessUpdateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        describe('device group delete positive tests  >', () => {
            beforeEach((done) => {
                _testInit().
                    then(() => ImptTestHelper.projectCreate(DEVICE_GROUP_NAME)).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('delete device group by id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg ${dg_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceGroupMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupNotExist(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupNotExist(DEVICE_GROUP_NAME)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceGroupMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupNotExist(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('device group delete with builds tests  >', () => {
                beforeEach((done) => {
                    ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME} -f`, (commandOut) => {
                        build_id = ImptTestHelper.parseId(commandOut);
                        ImptTestHelper.emptyCheckEx(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('force delete device group by name', (done) => {
                    ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} --force -q ${outputMode}`, (commandOut) => {
                        _checkSuccessDeleteDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }).
                        then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id} ${outputMode}`, (commandOut) => {
                            ImptTestHelper.checkAttributeEx(commandOut, 'flagged', 'false');
                            ImptTestHelper.checkSuccessStatusEx(commandOut);
                        })).
                        then(() => ImptDgTestHelper.checkDeviceGroupNotExist(DEVICE_GROUP_NAME)).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('delete device group with builds', (done) => {
                    ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -f --builds -q ${outputMode}`, (commandOut) => {
                        _checkSuccessDeleteDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                        _checkSuccessUpdateDeploymentMessage(commandOut, build_id);
                        _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }).
                        then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id} ${outputMode}`, (commandOut) => {
                            ImptTestHelper.checkFailStatusEx(commandOut);
                        })).
                        then(() => ImptDgTestHelper.checkDeviceGroupNotExist(DEVICE_GROUP_NAME)).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });

        describe('device group delete negative tests  >', () => {
            it('delete device group by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by empty name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg "" -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentValueError(commandOut, 'dg');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group without dg value', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode} --dg`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'dg');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode} --dg not-exist-device-group`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

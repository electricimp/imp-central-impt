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
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');

const PRODUCT_NAME = '__impt_dev_product';
const DEVICE_GROUP_NAME = '__impt_dev_device_group';
const DEVICE_NEW_NAME = '__impt_dev_device';

// Test suite for 'impt device update' command.
// Runs 'impt device update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        // prepare environment for device update command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
        }

        // delete all entities using in impt device update test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }
        
        // delete all entities using in impt device update test suite
        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt device update -d ${config.devices[0]} --name ${config.devicenames[0]}`, ImptTestHelper.emptyCheckEx);
        }

        // check 'device successfully updated' output message 
        function _checkSuccessUpdatedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        function _checkDeviceInfo() {
            ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device.id).toBe(config.devices[0]);
                expect(json.Device.name).toBe(DEVICE_NEW_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        describe('impt device update positive  tests >', () => {
            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device update by device id', (done) => {
                ImptTestHelper.runCommandEx(`impt device update --device ${config.devices[0]}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, config.devices[0])
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by device mac', (done) => {
                ImptTestHelper.runCommandEx(`impt device update --device ${config.devicemacs[0]}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, config.devicemacs[0])
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by device name', (done) => {
                ImptTestHelper.runCommandEx(`impt device update --device ${config.devicenames[0]}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, config.devicenames[0])
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by agent id', (done) => {
                ImptTestHelper.runCommandEx(`impt device update --device ${config.deviceaids[0]}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, config.deviceaids[0])
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('impt device update negative tests >', () => {
            it('not exist device update', (done) => {
                ImptTestHelper.runCommandEx(`impt device update -d not-exist-device -n ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update without new value', (done) => {
                ImptTestHelper.runCommandEx(`impt device update --device ${config.devices[0]} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'name');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update without device value', (done) => {
                ImptTestHelper.runCommandEx(`impt device update -n ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'device');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

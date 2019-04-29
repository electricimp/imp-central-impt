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
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');

const PRODUCT_NAME = `__impt_dev_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dev_device_group${config.suffix}`;
const DEVICE_NEW_NAME = `__impt_dev_device${config.suffix}`;

// Test suite for 'impt device update' command.
// Runs 'impt device update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteInit).
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

        // prepare environment for device update command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
        }

        // delete all entities using in impt device update test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        // delete all entities using in impt device update test suite
        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt device update -d ${config.devices[config.deviceidx]} --name ${ImptTestHelper.deviceInfo.deviceName}`, ImptTestHelper.emptyCheck);
        }

        // check 'device successfully updated' output message 
        function _checkSuccessUpdatedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        function _checkDeviceInfo() {
            ImptTestHelper.runCommand(`impt device info --device ${config.devices[config.deviceidx]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device.id).toBe(config.devices[config.deviceidx]);
                expect(json.Device.name).toBe(DEVICE_NEW_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        describe('impt device update positive  tests >', () => {
            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device update by device id', (done) => {
                ImptTestHelper.runCommand(`impt device update --device ${config.devices[config.deviceidx]}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, config.devices[config.deviceidx])
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by device mac', (done) => {
                ImptTestHelper.runCommand(`impt device update --device ${ImptTestHelper.deviceInfo.deviceMac}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceMac)
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by device name', (done) => {
                ImptTestHelper.runCommand(`impt device update --device ${ImptTestHelper.deviceInfo.deviceName}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceName)
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update by agent id', (done) => {
                ImptTestHelper.runCommand(`impt device update --device ${ImptTestHelper.deviceInfo.deviceAgentId}  --name ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceAgentId)
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkDeviceInfo).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('impt device update negative tests >', () => {
            it('not exist device update', (done) => {
                ImptTestHelper.runCommand(`impt device update -d not-exist-device -n ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update without new value', (done) => {
                ImptTestHelper.runCommand(`impt device update --device ${config.devices[config.deviceidx]} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'name');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device update without device value', (done) => {
                ImptTestHelper.runCommand(`impt device update -n ${DEVICE_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'device');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

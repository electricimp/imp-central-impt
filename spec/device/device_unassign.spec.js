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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = `__impt_dev_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dev_device_group${config.suffix}`;

// Test suite for 'impt device unassign' command.
// Runs 'impt device unassign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device unassign test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {

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

        // prepare environment for device group unassign command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME));
        }

        // delete all entities using in impt device unassign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        // check if device is unassigned
        function _checkUnassignDevice() {
            return ImptTestHelper.runCommand(`impt device info --device ${config.devices[config.deviceidx]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device['Device Group']).toBeUndefined();
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        // check 'device successfully unassigned' output message 
        function _checkSuccessUnassignedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_UNASSIGNED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        // check 'device already unassigned' output message 
        function _checkAlreadyUnassignedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_ALREADY_UNASSIGNED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        describe('device unassign positive tests >', () => {
            beforeEach((done) => {
                ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('unassign device by device id', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d ${config.devices[config.deviceidx]} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, config.devices[config.deviceidx]);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by device name', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d ${ImptTestHelper.deviceInfo.deviceName} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceName);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by device mac', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d ${ImptTestHelper.deviceInfo.deviceMac} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceMac);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by agent id', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d ${ImptTestHelper.deviceInfo.deviceAgentId} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceAgentId);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat unassign device', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d ${config.devices[config.deviceidx]} ${outputMode}`, ImptTestHelper.emptyCheck).
                    then(() => ImptTestHelper.runCommand(`impt device unassign -d ${config.devices[config.deviceidx]} ${outputMode}`, (commandOut) => {
                        _checkAlreadyUnassignedDeviceMessage(commandOut, config.devices[config.deviceidx]);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device unassign positive tests >', () => {
            it('unassign not exist device', (done) => {
                ImptTestHelper.runCommand(`impt device unassign -d not-exist-device ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

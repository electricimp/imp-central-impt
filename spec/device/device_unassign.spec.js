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

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt device unassign' command.
// Runs 'impt device unassign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device unassign test suite >', () => {

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

        // prepare environment for device group unassign command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx));
        }

        // delete entities using in impt device unassign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // check if device is unassigned
        function _checkUnassignDevice() {
            return ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device['Device Group']).toBeUndefined();
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        // check 'device successfully unassigned' output message 
        function _checkSuccessUnassignedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_UNASSIGNED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        // check 'device already unassigned' output message 
        function _checkAlreadyUnassignedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
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
                ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by device name', (done) => {
                ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by device mac', (done) => {
                ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devicemacs[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, config.devicemacs[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by agent id', (done) => {
                ImptTestHelper.runCommandEx(`impt device unassign -d ${config.deviceaids[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, config.deviceaids[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat unassign device', (done) => {
                ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]} ${outputMode}`, ImptTestHelper.emptyCheckEx).
                    then(() => ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]} ${outputMode}`, (commandOut) => {
                        _checkAlreadyUnassignedDeviceMessage(commandOut, config.devices[0]);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(() => _checkUnassignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device unassign positive tests >', () => {

            it('unassign not exist device', (done) => {
                ImptTestHelper.runCommandEx(`impt device unassign -d not-exist-device ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

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

// Test suite for 'impt device assign builds' command.
// Runs 'impt device assign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device assign test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(() => ImptTestHelper.checkDeviceStatus(config.devices[config.deviceidx])).
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

        // prepare environment for device assign command testing
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
                then((dgInfo) => { dg_id = dgInfo.dgId; });
        }

        // delete all entities using in impt device assign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt device unassign -d ${config.devices[config.deviceidx]}`, ImptTestHelper.emptyCheck);
        }

        // check if device is assigned to specified device group
        function _checkAssignDevice() {
            return ImptTestHelper.runCommand(`impt device info --device ${config.devices[config.deviceidx]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device.id).toBe(config.devices[config.deviceidx]);
                expect(json.Device.mac_address).toBe(ImptTestHelper.deviceInfo.deviceMac);
                expect(json.Device.name).toBe(ImptTestHelper.deviceInfo.deviceName);
                expect(json.Device.agent_id).toBe(ImptTestHelper.deviceInfo.deviceAgentId);
                expect(json.Device['Device Group'].id).toBe(dg_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        // check if device is assigned to specified device group already
        function _checkAlreadyAssignedDeviceMessage(commandOut, device, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_ALREADY_ASSIGNED_TO_DG}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'device successfully assigned' output message 
        function _checkSuccessAssignedDeviceMessage(commandOut, device, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_ASSIGNED_TO_DG}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('device assign positive tests >', () => {
            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device assign to dg by name', (done) => {
                ImptTestHelper.runCommand(`impt device assign --device ${config.devices[config.deviceidx]} --dg ${DEVICE_GROUP_NAME} --confirmed ${outputMode}`, (commandOut) => {
                    _checkSuccessAssignedDeviceMessage(commandOut, config.devices[config.deviceidx], DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(_checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to dg by id', (done) => {
                ImptTestHelper.runCommand(`impt device assign -d ${ImptTestHelper.deviceInfo.deviceMac} -g ${dg_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessAssignedDeviceMessage(commandOut, ImptTestHelper.deviceInfo.deviceMac, dg_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(_checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to project', (done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                    then(() => ImptTestHelper.runCommand(`impt device assign -d ${config.devices[config.deviceidx]} -q ${outputMode}`, (commandOut) => {
                        _checkSuccessAssignedDeviceMessage(commandOut, config.devices[config.deviceidx], dg_id);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(_checkAssignDevice).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat device assign', (done) => {
                ImptTestHelper.runCommand(`impt device assign -d ${config.devices[config.deviceidx]} -g ${dg_id} -q ${outputMode}`, ImptTestHelper.emptyCheck).
                    then(() => ImptTestHelper.runCommand(`impt device assign -d ${config.devices[config.deviceidx]} -g ${dg_id} -q ${outputMode}`, (commandOut) => {
                        _checkAlreadyAssignedDeviceMessage(commandOut, config.devices[config.deviceidx], dg_id);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(_checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device assign negative tests >', () => {
            it('device assign to not exist project', (done) => {
                ImptTestHelper.runCommand(`impt device assign -d ${config.devices[config.deviceidx]} -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt device assign -d ${config.devices[config.deviceidx]} -g not-exist-device-group -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

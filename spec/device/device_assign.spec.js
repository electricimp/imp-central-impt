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

// Test suite for 'impt device assign builds' command.
// Runs 'impt device assign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device assign test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;

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

        // prepare environment for device assign command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all entities using in impt device assign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]}`, ImptTestHelper.emptyCheckEx);
        }

        // check if device is assigned to specified device group
        function _checkAssignDevice() {
            return ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                let json = JSON.parse(commandOut.output);
                expect(json.Device['Device Group'].id).toBe(dg_id);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        // check if device is assigned to specified device group already
        function _checkAlreadyAssignedDeviceMessage(commandOut, device, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_ALREADY_ASSIGNED_TO_DG}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'device successfully assigned' output message 
        function _checkSuccessAssignedDeviceMessage(commandOut, device, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_ASSIGNED_TO_DG}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('device assign positive tests >', () => {
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

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device assign to dg by name', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign --device ${config.devices[0]} --dg ${DEVICE_GROUP_NAME} --confirmed ${outputMode}`, (commandOut) => {
                    _checkSuccessAssignedDeviceMessage(commandOut, config.devices[0], DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to dg by id', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign -d ${config.devicemacs[0]} -g ${dg_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessAssignedDeviceMessage(commandOut, config.devicemacs[0], dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to project', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessAssignedDeviceMessage(commandOut, config.devices[0], dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat device assign', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g ${dg_id} -q ${outputMode}`, ImptTestHelper.checkEmptyEx).
                    then(() => ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g ${dg_id} -q ${outputMode}`, (commandOut) => {
                        _checkAlreadyAssignedDeviceMessage(commandOut, config.devices[0], dg_id);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(() => _checkAssignDevice).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device assign negative tests >', () => {
            it('device assign to not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device assign to not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g not-exist-device-group -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

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

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt device info' command.
// Runs 'impt device info' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device info test suite >', () => {
        let product_id = null;
        let dg_id = null;
        let build_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for device info command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all entities using in impt device info test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]}`, ImptTestHelper.emptyCheckEx));
        }

        function _checkDeviceInfo(commandOut) {
            let json = JSON.parse(commandOut.output);
            expect(json.Device.id).toBe(config.devices[0]);
            expect(json.Device.name).toBe(config.devices[0]);
            expect(json.Device.mac_address).toBe(config.devicemacs[0]);
            expect(json.Device.agent_id).toBe(config.deviceaids[0]);
            expect(json.Device['Device Group'].id).toBe(dg_id);
            expect(json.Device['Device Group'].name).toBe(DEVICE_GROUP_NAME);
            expect(json.Device['Device Group']['Current Deployment'].id).toBe(build_id);
            expect(json.Device['Product'].id).toBe(product_id);
            expect(json.Device['Product'].name).toBe(PRODUCT_NAME);
        }

        describe('impt device info positive  tests >', () => {
            beforeAll((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device info by id', (done) => {
                ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                    _checkDeviceInfo(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device info by name', (done) => {
                ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                    _checkDeviceInfo(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device info by mac', (done) => {
                ImptTestHelper.runCommandEx(`impt device info --device ${config.devicemacs[0]} -z json`, (commandOut) => {
                    _checkDeviceInfo(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device info by agent id', (done) => {
                ImptTestHelper.runCommandEx(`impt device info --device ${config.deviceaids[0]} -z json`, (commandOut) => {
                    _checkDeviceInfo(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('impt device info negative tests >', () => {

            it('unassigned device info', (done) => {
                ImptTestHelper.runCommandEx(`impt device info --device ${config.devices[0]} -z json`, (commandOut) => {
                    let json = JSON.parse(commandOut.output);
                    console.log(json);
                    expect(json.Device.id).toBe(config.devices[0]);
                    expect(json.Device.name).toBe(config.devices[0]);
                    expect(json.Device.mac_address).toBe(config.devicemacs[0]);
                    expect(json.Device.agent_id).toBeEmptyString();
                    expect(json.Device['Device Group']).toBeUndefined();
                    expect(json.Device['Product']).toBeUndefined();
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('not exist device info', (done) => {
                ImptTestHelper.runCommandEx(`impt device info -d not-exist-device ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device info without device value', (done) => {
                ImptTestHelper.runCommandEx(`impt device info ${outputMode} -d`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'd');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

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
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt device remove' command.
// Runs 'impt device remove' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    xdescribe('impt device remove test suite >', () => {

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        beforeEach((done) => {
            _addDeviceMessage().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for device remove command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx));
        }

        // delete all entities using in impt device remove test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // show insert device message and waiting confirmation
        function _addDeviceMessage() {
            return new Promise((resolve, reject) => {
                console.log(`Add device "${config.devices[0]}" to your account manualy and press Enter.`);
                process.stdin.once('data', function () {
                    resolve();
                });
            });
        }

        // check 'device successfully deleted' output message 
        function _checkSuccessDeleteDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        describe('remove unassigned device tests >', () => {
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

            it('remove device by id', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove --device ${config.devices[0]} --confirmed ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt device info -d ${config.devices[0]}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove device by mac', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove -d ${config.devicemacs[0]} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.devicemacs[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt device info -d ${config.devicemacs[0]}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove device by agent id', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove -d ${config.deviceaids[0]} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.deviceaids[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt device info -d ${config.deviceaids[0]}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove device by name', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove -d ${config.devicenames[0]} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.devicenames[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt device info -d ${config.devicenames[0]}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

        });

        describe('remove assigned device tests >', () => {
            beforeAll((done) => {
                ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('force remove assigned device', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove -d ${config.devices[0]} --force -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt device info -d ${config.devices[0]}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('remove assigned device', (done) => {
                ImptTestHelper.runCommandEx(`impt device remove -d ${config.devices[0]} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

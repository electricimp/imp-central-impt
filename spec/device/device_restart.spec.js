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
const Shell = require('shelljs');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt device restart' command.
// Runs 'impt device restart' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device restart test suite >', () => {
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

        // prepare environment for device restart command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --create-product --name ${DEVICE_GROUP_NAME}  ${outputMode}`, ImptTestHelper.emptyCheckEx).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/device.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
                then(() => ImptTestHelper.runCommandEx(`impt build run`, ImptTestHelper.emptyCheckEx));
        }

        // delete all entities using in impt device restart test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'device successfully restarted' output message 
        function _checkSuccessRestartedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        // check 'device successfully coditional restarted' output message 
        function _checkSuccessCondRestartedDeviceMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DEVICE_COND_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE} "${device}"`)
            );
        }

        describe('device restart positive tests >', () => {

            it('restart device by device id', (done) => {
                ImptTestHelper.runCommandEx(`impt device restart --device ${config.devices[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart device by device name', (done) => {
                ImptTestHelper.runCommandEx(`impt device restart -d ${config.devicenames[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, config.devicenames[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart device by device mac', (done) => {
                ImptTestHelper.runCommandEx(`impt device restart -d ${config.devicemacs[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, config.devicemacs[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('conditional restart device by agent id', (done) => {
                ImptTestHelper.runCommandEx(`impt device restart -c -d ${config.deviceaids[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessCondRestartedDeviceMessage(commandOut, config.deviceaids[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            xit('restart device with log', (done) => {
                ImptTestHelper.runCommandInteractive(`impt device restart -l -d ${config.devices[0]} ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group create negative tests >', () => {

            it('restart not exist device', (done) => {
                ImptTestHelper.runCommandEx(`impt device restart -d not-exist-device ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DEVICE, 'not-exist-device');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

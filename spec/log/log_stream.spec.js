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
const Shell = require('shelljs');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = `__impt_log_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_log_device_group${config.suffix}`;
const DEVICE_GROUP2_NAME = `__impt_log_device_group_2${config.suffix}`;

// Test suite for 'impt log stream' command.
// Runs 'impt log stream' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt log stream test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
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

        // prepare environment for impt log stream command testing
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck)).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck)).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP2_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck)).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -x devicecode.nut`, ImptTestHelper.emptyCheck));
        }

        // delete all entities using in impt log stream test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        function _checkLogStreamOpenedMessage(commandOut, device) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.LOG_STREAM_OPENED}`,
                    `${device}`
                )
            );
        }

        xdescribe('log stream positive tests >', () => {
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

            it('log stream by device id', (done) => {
                Promise.all([
                    ImptTestHelper.runCommandWithTerminate(`impt log stream -d ${config.devices[config.deviceidx]} ${outputMode}`, (commandOut) => {
                        _checkLogStreamOpenedMessage(commandOut, config.devices[config.deviceidx]);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }),
                    ImptTestHelper.delayMs(5000).
                        then(ImptTestHelper.deviceRestart)
                ]).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('log stream negative tests >', () => {
            it('log stream by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt log stream ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DEVICE);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log stream without device value', (done) => {
                ImptTestHelper.runCommand(`impt log stream ${outputMode} -d`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'd');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt log stream ${outputMode} -d ""`, (commandOut) => {
                        MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DEVICE);
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log stream without dg value', (done) => {
                ImptTestHelper.runCommand(`impt log stream ${outputMode} -g`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'g');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt log stream ${outputMode} -g ""`, (commandOut) => {
                        MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('log stream without output value', (done) => {
                ImptTestHelper.runCommand(`impt log stream -d ${config.devices[config.deviceidx]} -z`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'z');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt log stream -d ${config.devices[config.deviceidx]} -z undefined`, (commandOut) => {
                        MessageHelper.checkInvalidValuesError(commandOut);
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

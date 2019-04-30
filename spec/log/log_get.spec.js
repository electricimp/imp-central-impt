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

const PRODUCT_NAME = `__impt_log_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_log_device_group${config.suffix}`;

const outputMode = '';

// Test suite for 'impt log get' command.
// Runs 'impt log get' command with different combinations of options,
describe(`impt log get test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {

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

    // prepare environment for impt log get command testing
    function _testSuiteInit() {
        return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
            then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
            then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
            then(() => ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -x devicecode.nut`, ImptTestHelper.emptyCheck)).
            then(() => ImptTestHelper.delayMs(10000));
    }

    function _checkLogMessages(commandOut, messages = {}) {
        let matcher = commandOut.output.match(new RegExp(/....-..-..T..:..:../g));
        expect(matcher).not.toBeNull();
        expect(matcher.length).toEqual(messages.count);
        // if output contains non server.log messages change message start nuber
        matcher = commandOut.output.match(new RegExp(/server\.log/g));
        if (matcher.length < messages.count) {
            messages.startNumber = messages.startNumber + (messages.count - matcher.length);
        }
        expect(commandOut.output).toMatch(`Message #${messages.startNumber}#`);
        expect(commandOut.output).toMatch(`Message #${messages.endNumber}#`);
    }

    // delete all entities using in impt log get test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.productDelete(PRODUCT_NAME);
    }

    describe('log get positive tests >', () => {
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

        it('log get by project', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 1, endNumber: 20, count: 20 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get by device id', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 1, endNumber: 20, count: 20 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get by device mac', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${ImptTestHelper.deviceInfo.deviceMac} ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 1, endNumber: 20, count: 20 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get by agent id', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${ImptTestHelper.deviceInfo.deviceAgentId} ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 1, endNumber: 20, count: 20 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get by device name', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${ImptTestHelper.deviceInfo.deviceName} ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 1, endNumber: 20, count: 20 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get with page size', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${config.devices[config.deviceidx]} --page-size 4 ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 17, endNumber: 20, count: 4 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get with page size and number', (done) => {
            ImptTestHelper.runCommandInteractive(`impt log get -d ${config.devices[config.deviceidx]} --page-size 5 --page-number 3 ${outputMode}`, (commandOut) => {
                _checkLogMessages(commandOut, { startNumber: 6, endNumber: 10, count: 5 });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe('log get negative tests >', () => {
        it('log get by not exist project', (done) => {
            ImptTestHelper.runCommand(`impt log get ${outputMode}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DEVICE);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get without device value', (done) => {
            ImptTestHelper.runCommand(`impt log get ${outputMode} -d`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'd');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt log get ${outputMode} -d ""`, (commandOut) => {
                    MessageHelper.checkNonEmptyOptionValueError(commandOut, 'device');
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get with incorrect page size value', (done) => {
            ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} -s 0`, (commandOut) => {
                MessageHelper.checkOptionPositiveValueError(commandOut, '--page-size');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} -s -4`, (commandOut) => {
                    MessageHelper.checkOptionPositiveValueError(commandOut, '--page-size');
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get with incorrect page number value', (done) => {
            ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} --page-number 0`, (commandOut) => {
                MessageHelper.checkOptionPositiveValueError(commandOut, '--page-number');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} -n -4`, (commandOut) => {
                    MessageHelper.checkOptionPositiveValueError(commandOut, '--page-number');
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get without size and num values', (done) => {
            ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} -s`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} ${outputMode} -n`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'n');
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('log get without output value', (done) => {
            ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} -z`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'z');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt log get -d ${config.devices[config.deviceidx]} -z undefined`, (commandOut) => {
                    MessageHelper.checkInvalidValuesError(commandOut);
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

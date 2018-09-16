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
const PRODUCT_DESCR = '__impt_product_description';


const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_NEW_NAME = '__impt_new_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';
const DEVICE_GROUP_NEW_DESCR = 'impt new device group description';

// Test suite for 'impt dg update' command.
// Runs 'impt dg update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    fdescribe('impt device group create test suite >', () => {
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

        // create products for device group testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt project link --dg ${DEVICE_GROUP_NAME} `, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy`, ImptTestHelper.emptyCheckEx));
        }

        // delete entities using in impt dg restart test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
        }

        // check 'device group successfully restarted' output message 
        function _checkSuccessRestartedDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'device group successfully coditional restarted' output message 
        function _checkSuccessCondRestartedDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_COND_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'device group have no device' output message 
        function _checkNoDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_NO_DEVICES}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('project exist preconditions >', () => {

            it('restart device by device group id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, dg_id);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart device by device group name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart --dg ${DEVICE_GROUP_NAME} --conditional ${outputMode}`, (commandOut) => {
                    _checkSuccessCondRestartedDeviceMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart device by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, dg_id);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            xit('restart device with log display', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart --dg ${DEVICE_GROUP_NAME} --log ${outputMode}`, (commandOut) => {
                    _checkSuccessRestartedDeviceMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project not exist preconditions >', () => {

            beforeAll((done) => {
                _testProjectClean().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            // delete project without entities 
            function _testProjectClean() {
                return ImptTestHelper.runCommandEx(`impt project delete --files -q`, ImptTestHelper.emptyCheckEx).
                    then(() => ImptTestHelper.runCommandEx(`impt device unassign -d ${config.devices[0]}`, ImptTestHelper.emptyCheckEx));
            }

            it('restart device by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart device by not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart -g not-exist-device-group ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('restart not exist device', (done) => {
                ImptTestHelper.runCommandEx(`impt dg restart -g ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    _checkNoDeviceMessage(commandOut, DEVICE_GROUP_NAME)
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

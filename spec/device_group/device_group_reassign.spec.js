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
const ImptDgTestHelper = require('./ImptDgTestHelper');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_DST_NAME = '__impt_dst_product';
const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_DST_NAME = '__impt_dst_device_group';

// Test suite for 'impt dg reassign' command.
// Runs 'impt dg reassign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group reassign test suite >', () => {
        let dg_id = null;
        let dg_dst_id = null;

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

        // prepare environment for device group reassign command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_DST_NAME}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_DST_NAME} -p ${PRODUCT_DST_NAME}`, (commandOut) => {
                    dg_dst_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all entities using in impt dg reassign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_DST_NAME} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        // check 'device successfully reassigned' output message 
        function _checkSuccessReassignedDeviceMessage(commandOut, dg_from, dg_to) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_REASSIGNED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg_from}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg_to}"`)
            );
        }

        // check 'device group has no devices' output message 
        function _checkNoDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_NO_DEVICES}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('device group reassign positive tests >', () => {
            beforeAll((done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_DST_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            beforeEach((done) => {
                ImptTestHelper.deviceUnassign(dg_dst_id).
                    then(() => ImptTestHelper.deviceAssign(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('reassign device by device group id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from ${dg_id} --to ${dg_dst_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessReassignedDeviceMessage(commandOut, dg_id, dg_dst_id);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasDevice(dg_dst_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('reassign device by device group name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from ${DEVICE_GROUP_NAME} --to ${DEVICE_GROUP_DST_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessReassignedDeviceMessage(commandOut, DEVICE_GROUP_NAME, DEVICE_GROUP_DST_NAME);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasDevice(dg_dst_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('reassign device by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from ${dg_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessReassignedDeviceMessage(commandOut, dg_id, dg_dst_id);
                    ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, config.devices[0]);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasDevice(dg_dst_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('reassign not exist device', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from ${DEVICE_GROUP_DST_NAME} --to ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    _checkNoDeviceMessage(commandOut, DEVICE_GROUP_DST_NAME)
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group reassign negative tests >', () => {
            it('reassign device to not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('reassign device from not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --from not-exist-device-group --to ${DEVICE_GROUP_DST_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('reassign device to not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg reassign --to not-exist-device-group --from ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});
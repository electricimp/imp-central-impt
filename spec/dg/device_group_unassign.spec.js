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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');
const ImptDgTestHelper = require('./ImptDgTestHelper');

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;

// Test suite for 'impt dg unassign' command.
// Runs 'impt dg unassign' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device group unassign test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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
                then(() => ImptTestHelper.restoreDeviceInfo()).
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for device group unassign command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
                then((dgInfo) => { dg_id = dgInfo.dgId; });
        }

        // delete all entities using in impt dg unassign test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        // check 'device successfully unassigned' output message 
        function _checkSuccessUnassignedDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_UNASSIGNED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'device group has no devices' output message 
        function _checkNoDeviceMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_NO_DEVICES}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('device group unassign positive tests >', () => {
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

            beforeEach((done) => {
                ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('unassign device by device group id', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by device group name', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign --dg ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by project', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign ${outputMode}`, (commandOut) => {
                    _checkSuccessUnassignedDeviceMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupHasNoDevice(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project not exist preconditions >', () => {
            it('unassign device by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign device by not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign -g not-exist-device-group ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('unassign not exist device', (done) => {
                ImptTestHelper.runCommand(`impt dg unassign -g ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    _checkNoDeviceMessage(commandOut, DEVICE_GROUP_NAME)
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

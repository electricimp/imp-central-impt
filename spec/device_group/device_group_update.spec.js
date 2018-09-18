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
const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_NEW_NAME = '__impt_new_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';
const DEVICE_GROUP_NEW_DESCR = 'impt new device group description';

// Test suite for 'impt dg update' command.
// Runs 'impt dg update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group update test suite >', () => {
        let dg_id = null;
        let product_id = null;
        let deploy_id = null;

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


        // prepare environment for device group update command test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // prepare environment for each device group update test
        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy --dg ${dg_id}`, (commandOut) => {
                    deploy_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all entities using in impt dg update test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // delete device group using in impt dg update test
        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NEW_NAME} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        // check 'device group successfully updated' output message 
        function _checkSuccessUpdatedDeviceGroupMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        // check 'min sup deployment successfully updated' output message 
        function _checkSuccessUpdatedMinSupDeploymentMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_MIN_SUPPORTED_DEPLOYMENT_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('device group update positive tests >', () => {
            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            beforeEach((done) => {
                _testInit().
                    then(() => ImptTestHelper.projectCreate(dg_id)).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('update device group by id whitout new value', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceGroupMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update device group by name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update --dg ${DEVICE_GROUP_NAME} --name ${DEVICE_GROUP_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id, name: DEVICE_GROUP_NEW_NAME })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update device group by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update -n ${DEVICE_GROUP_NEW_NAME} -s "${DEVICE_GROUP_NEW_DESCR}" --min-supported-deployment  ${deploy_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceGroupMessage(commandOut, dg_id);
                    _checkSuccessUpdatedMinSupDeploymentMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id, name: DEVICE_GROUP_NEW_NAME, descr: DEVICE_GROUP_NEW_DESCR })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group create negative tests >', () => {
            it('update device group by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update -n ${DEVICE_GROUP_NEW_NAME} -s "${DEVICE_GROUP_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update -g not-exist-device-group -s "${DEVICE_GROUP_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});
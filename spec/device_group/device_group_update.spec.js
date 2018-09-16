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
    describe('impt device group create test suite >', () => {
        let dg_id = null;
        let product_id = null;

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
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // create products for device group testing
        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // delete all products using in impt dg update test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
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

        // check base atributes of requested device group
        function _checkDeviceGroupInfo(expInfo) {
            ImptTestHelper.runCommandEx(`impt dg info -g ${expInfo && expInfo.id ? expInfo.id : dg_id}  -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json['Device Group']).toBeDefined();
                expect(json['Device Group'].id).toBe(expInfo && expInfo.id ? expInfo.id : dg_id);
                expect(json['Device Group'].name).toBe(expInfo && expInfo.name ? expInfo.name : DEVICE_GROUP_NAME);
                expect(json['Device Group'].description).toBe(expInfo && expInfo.descr ? expInfo.descr : DEVICE_GROUP_DESCR);
                expect(json['Device Group'].type).toBe('development');
                expect(json['Device Group'].Product.id).toBe(expInfo && expInfo.p_id ? expInfo.p_id : product_id);
                expect(json['Device Group'].Product.name).toBe(expInfo && expInfo.p_name ? expInfo.p_name : PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        describe('project not exist preconditions >', () => {
            beforeEach((done) => {
                _testInit().
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
                    then(() => _checkDeviceGroupInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update device group by name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update --dg ${DEVICE_GROUP_NAME} --name ${DEVICE_GROUP_NEW_NAME} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceGroupInfo({ name: DEVICE_GROUP_NEW_NAME })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update device group by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update -n ${DEVICE_GROUP_NEW_NAME} -s "${DEVICE_GROUP_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project exist preconditions >', () => {
            let deploy_id = null;

            beforeAll((done) => {
                _testProjectExistInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            // create products for device group testing
            function _testProjectExistInit() {
                return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt project link --dg ${DEVICE_GROUP_NAME} `, ImptTestHelper.emptyCheckEx)).
                    then(() => ImptTestHelper.runCommandEx(`impt build deploy`, (commandOut) => {
                        deploy_id = ImptTestHelper.parseId(commandOut);
                        ImptTestHelper.emptyCheckEx(commandOut);
                    }));
            }

            it('update device group by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg update -n ${DEVICE_GROUP_NEW_NAME} -s "${DEVICE_GROUP_NEW_DESCR}" --min-supported-deployment  ${deploy_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdatedDeviceGroupMessage(commandOut, dg_id);
                    //TODO: check DG_MIN_SUPPORTED_DEPLOYMENT_UPDATED message
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceGroupInfo({ name: DEVICE_GROUP_NEW_NAME, descr: DEVICE_GROUP_NEW_DESCR })).
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

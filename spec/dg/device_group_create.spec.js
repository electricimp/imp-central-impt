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

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;
const DEVICE_GROUP_DESCR = 'impt temp device group description';
const DEVICE_GROUP_EXIST_NAME = `dg_exist_name${config.suffix}`;

// Test suite for 'impt dg create' command.
// Runs 'impt dg create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt device group create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        // prepare environment for device group create command test suite 
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_EXIST_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // delete all entities using in impt dg create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // delete device group using in impt dg create test
        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt dg delete --dg ${DEVICE_GROUP_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // check successfuly created device group output message 
        function _checkSuccessCreateDeviceGroupMessage(commandOut, deviceGroupName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${deviceGroupName}"`)
            );
        }

        describe('device group create positive tests >', () => {
            beforeAll((done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_EXIST_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            function _checkDeviceGroupCreateResult(commandOut) {
                _checkSuccessCreateDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, DEVICE_GROUP_NAME);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, dg_id);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_TYPE, 'development');
            }

            it('device group create by product id', (done) => {
                ImptTestHelper.runCommand(`impt dg create --name ${DEVICE_GROUP_NAME} --descr "${DEVICE_GROUP_DESCR}" --product ${product_id} ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group create by product name', (done) => {
                ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME} --dg-type development ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id })).
                    then(done).
                    catch(error => done.fail(error));
            });

            fit('device group create by project', (done) => {
                ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptDgTestHelper.checkDeviceGroupInfo({ id: dg_id, p_id: product_id })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('device group create negative tests >', () => {
            it('device group create by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.PRODUCT);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group create by not exist product', (done) => {
                ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p not-exist-product ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.PRODUCT, 'not-exist-product');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('create duplicate device group', (done) => {
                ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_EXIST_NAME} -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDuplicateResourceError(commandOut, 'Devicegroup');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

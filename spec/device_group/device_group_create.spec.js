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
const DEVICE_GROUP_DESCR = 'impt temp device group description';


// Test suite for 'impt dg create' command.
// Runs 'impt dg create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group create test suite >', () => {
        let dg_id = null;
        let product_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
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
            }).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n dg_exist_name -p ${PRODUCT_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt project link --dg dg_exist_name`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // delete all products using in impt dg create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
        }

        // delete device group using in impt dg create test
        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // check base atributes of requested device group
        function _checkDeviceGroupInfo(expInfo) {
            ImptTestHelper.runCommandEx(`impt dg info -g ${expInfo && expInfo.id ? expInfo.id : dg_id}  -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json['Device Group']).toBeDefined();
                expect(json['Device Group'].id).toBe(expInfo && expInfo.id ? expInfo.id : dg_id);
                expect(json['Device Group'].name).toBe(expInfo && expInfo.name ? expInfo.name : DEVICE_GROUP_NAME);
                expect(json['Device Group'].type).toBe('development');
                expect(json['Device Group'].Product.id).toBe(expInfo && expInfo.p_id ? expInfo.p_id : product_id);
                expect(json['Device Group'].Product.name).toBe(expInfo && expInfo.p_name ? expInfo.p_name : PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        // check successfuly created device group output message 
        function _checkSuccessCreateDeviceGroupMessage(commandOut, deviceGroupName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${deviceGroupName}"`)
            );
        }

        describe('product exist preconditions >', () => {
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

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            function _checkDeviceGroupCreateResult(commandOut) {
                _checkSuccessCreateDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_NAME, DEVICE_GROUP_NAME);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, dg_id);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_TYPE, 'development');
            }

            it('device group create by product id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create --name ${DEVICE_GROUP_NAME} --descr "${DEVICE_GROUP_DESCR}" --product ${product_id} ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceGroupInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group create by product name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" -p ${PRODUCT_NAME} --dg-type development ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceGroupInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group create by project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -s "${DEVICE_GROUP_DESCR}" ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    expect(dg_id).not.toBeNull;
                    _checkDeviceGroupCreateResult(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkDeviceGroupInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('create duplicate device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create -n dg_exist_name -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDuplicateResourceError(commandOut, 'Devicegroup');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('product not exist preconditions >', () => {
            beforeAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('device group create by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Product');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group create by not exist product', (done) => {
                ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p not-exist-product ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Product', 'not-exist-product')
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

    });
});

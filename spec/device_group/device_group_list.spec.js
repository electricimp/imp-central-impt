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
const lodash = require('lodash');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NAME2 = '__impt_product2';
const PRODUCT_NAME3 = '__impt_product3';

const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_NAME2 = '__impt_device_group2';
const DEVICE_GROUP_NAME3 = '__impt_device_group3';

// Test suite for 'impt dg list' command.
// Runs 'impt dg list' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group list test suite >', () => {
        let product_id = null;

        // custom matcher for search Device Group with expected properties in Device Group array
        let customMatcher = {
            toContainsDeviceGroup: function (util, customEqualityTesters) {
                return {
                    compare: function containsDeviceGroup(DgArray, expected) {
                        let result = {};
                        result.pass = false;
                        if (expected === undefined) expected = {};
                        lodash.map(DgArray, function (DgItem) {
                            lodash.map(DgItem, function (DgProperties) {
                                let compareFlag = true;
                                lodash.map(DgProperties, function (value, key) {
                                    if (typeof (value) === 'object' && typeof (expected[key]) === 'object') {
                                        lodash.map(value, function (subval, subkey) {
                                            compareFlag = compareFlag && (expected[key][subkey] === undefined ? true : util.equals(subval, expected[key][subkey], customEqualityTesters));
                                        });
                                    }
                                    else
                                        compareFlag = compareFlag && (expected[key] === undefined ? true : value == expected[key]);
                                });
                                // all properties matched
                                if (compareFlag) result.pass = true;
                            });
                        });
                        return result;
                    }
                };
            }
        };

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(() => jasmine.addMatchers(customMatcher)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for device group list command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME2}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME2} -p ${PRODUCT_NAME2}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME3}`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME3} -p ${PRODUCT_NAME3}`, ImptTestHelper.emptyCheckEx));
        }

        // delete all entities using in impt dg list test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME2} -f -q`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME3} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        function _checkDeviceGroupExist(commandOut, expInfo) {
            const json = JSON.parse(commandOut.output);
            expect(json).toBeArrayOfObjects();
            expect(json).toContainsDeviceGroup(expInfo);
        }

        // check device group count in  list
        function _checkDeviceGroupCount(commandOut, expCount) {
            const json = JSON.parse(commandOut.output);
            expect(json).toBeArrayOfObjects;
            expect(json.length).toEqual(expCount);
        }

        describe('device group list positive tests >', () => {
            it('device group list by owner me', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list --owner me -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by owner name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list --owner ${config.username} --dg-type development -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by owner email', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list --owner ${config.email} -y development -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by owner id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list --owner ${config.accountid} -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by product id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list --product ${product_id} -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                    _checkDeviceGroupCount(commandOut, 1);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by product name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list -p ${PRODUCT_NAME2} -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupCount(commandOut, 1);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('device group list by several product name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg list -p ${PRODUCT_NAME2} -p ${PRODUCT_NAME3} -z json`, (commandOut) => {
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                    _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                    _checkDeviceGroupCount(commandOut, 2);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

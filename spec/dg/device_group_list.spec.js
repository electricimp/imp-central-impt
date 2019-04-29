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
const lodash = require('lodash');

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const PRODUCT_NAME2 = `__impt_dg_product_2${config.suffix}`;
const PRODUCT_NAME3 = `__impt_dg_product_3${config.suffix}`;

const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;
const DEVICE_GROUP_NAME2 = `__impt_dg_device_group_2${config.suffix}`;
const DEVICE_GROUP_NAME3 = `__impt_dg_device_group_3${config.suffix}`;

const outputMode = '-z json';

// Test suite for 'impt dg list' command.
// Runs 'impt dg list' command with different combinations of options,
describe(`impt device group list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let product_id = null;
    let email = null;
    let userid = null;


    // custom matcher for search Device Group with expected properties in Device Group array
    let customMatcher = {
        toContainDeviceGroup: function (util, customEqualityTesters) {
            return {
                compare: function (DgArray, expected = {}) {
                    let result = { pass: false };
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
        return ImptTestHelper.getAccountAttrs().
            then((account) => { email = account.email; userid = account.id; }).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
            then((dgInfo) => { product_id = dgInfo.productId; }).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME2, DEVICE_GROUP_NAME2)).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME3, DEVICE_GROUP_NAME3));
    }

    // delete all entities using in impt dg list test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.productDelete(PRODUCT_NAME).
            then(() => ImptTestHelper.productDelete(PRODUCT_NAME2)).
            then(() => ImptTestHelper.productDelete(PRODUCT_NAME3));
    }

    function _checkDeviceGroupExist(commandOut, expInfo) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects();
        expect(json).toContainDeviceGroup(expInfo);
    }

    // check device group count in  list
    function _checkDeviceGroupCount(commandOut, expCount) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        expect(json.length).toEqual(expCount);
    }

    describe('device group list positive tests >', () => {
        it('device group list by owner me', (done) => {
            ImptTestHelper.runCommand(`impt dg list --owner me -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by owner name', (done) => {
            ImptTestHelper.runCommand(`impt dg list --owner ${config.username} --dg-type development -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by owner email', (done) => {
            ImptTestHelper.runCommand(`impt dg list --owner ${email} -y development -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by owner id', (done) => {
            ImptTestHelper.runCommand(`impt dg list --owner ${userid} -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by product id', (done) => {
            ImptTestHelper.runCommand(`impt dg list --product ${product_id} -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME}`, Project: { name: `${PRODUCT_NAME}` } });
                _checkDeviceGroupCount(commandOut, 1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by product name', (done) => {
            ImptTestHelper.runCommand(`impt dg list -p ${PRODUCT_NAME2} -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupCount(commandOut, 1);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group list by several product name', (done) => {
            ImptTestHelper.runCommand(`impt dg list -p ${PRODUCT_NAME2} -p ${PRODUCT_NAME3} -z json`, (commandOut) => {
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME2}`, Project: { name: `${PRODUCT_NAME2}` } });
                _checkDeviceGroupExist(commandOut, { name: `${DEVICE_GROUP_NAME3}`, Project: { name: `${PRODUCT_NAME3}` } });
                _checkDeviceGroupCount(commandOut, 2);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

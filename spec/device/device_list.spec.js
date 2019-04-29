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

const PRODUCT_NAME = `__impt_dev_product${config.suffix}`;
const PRODUCT_NAME_2 = `__impt_dev_product_2${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dev_device_group${config.suffix}`;
const DEVICE_GROUP_NAME_2 = `__impt_dev_device_group_2${config.suffix}`;

const outputMode = '-z json';

// Test suite for 'impt device list' command.
// Runs 'impt device list' command with different combinations of options,
describe(`impt device list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let product_id = null;
    let product2_id = null;
    let dg_id = null;
    let dg2_id = null;

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
            then(() => ImptTestHelper.restoreDeviceInfo()).
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // custom matcher for search Device with expected properties in Device array
    let customMatcher = {
        toContainDevice: function (util, customEqualityTesters) {
            return {
                compare: function (commandOut, expected = {}) {
                    let result = { pass: false };
                    const DgArray = JSON.parse(commandOut.output);
                    if (!Array.isArray(DgArray)) return result;
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
        },
        toHaveDeviceCountEqual: function () {
            return {
                compare: function (commandOut, expected) {
                    let result = { pass: false };
                    const DgArray = JSON.parse(commandOut.output);
                    if (Array.isArray(DgArray) && DgArray.length === expected) result.pass = true;
                    return result;
                }
            };
        },
    };

    // prepare environment for device list command test suite 
    function _testSuiteInit() {
        return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
            then((dgInfo) => { product_id = dgInfo.productId; dg_id = dgInfo.dgId; }).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME_2, DEVICE_GROUP_NAME_2)).
            then((dgInfo) => { product2_id = dgInfo.productId; dg2_id = dgInfo.dgId; }).
            then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
    }

    // delete all entities using in impt device list test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.productDelete(PRODUCT_NAME).
            then(() => ImptTestHelper.productDelete(PRODUCT_NAME_2));
    }

    describe('impt device list positive  tests >', () => {
        it('device list by owner me', (done) => {
            ImptTestHelper.runCommand(`impt device list --owner me -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product id', (done) => {
            ImptTestHelper.runCommand(`impt device list --product ${product_id} -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt device list --product ${product2_id} -z json`, (commandOut) => {
                    expect(commandOut).toHaveDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product name', (done) => {
            ImptTestHelper.runCommand(`impt device list --product ${PRODUCT_NAME} -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt device list --product ${PRODUCT_NAME_2} -z json`, (commandOut) => {
                    expect(commandOut).toHaveDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by dg id', (done) => {
            ImptTestHelper.runCommand(`impt device list --dg ${dg_id} -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt device list --dg ${dg2_id} -z json`, (commandOut) => {
                    expect(commandOut).toHaveDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by dg type', (done) => {
            ImptTestHelper.runCommand(`impt device list --dg-type development -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product name and dg id', (done) => {
            ImptTestHelper.runCommand(`impt device list -p ${PRODUCT_NAME} -g ${dg_id} -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt device list -p ${PRODUCT_NAME} -g ${dg2_id} -z json`, (commandOut) => {
                    expect(commandOut).toHaveDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by two dg', (done) => {
            ImptTestHelper.runCommand(`impt device list -g ${DEVICE_GROUP_NAME} -g ${dg2_id} -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('assigned device list', (done) => {
            ImptTestHelper.runCommand(`impt device list --assigned -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('unassigned device list', (done) => {
            ImptTestHelper.runCommand(`impt device list --unassigned -z json`, (commandOut) => {
                expect(commandOut).not.toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('online device list', (done) => {
            ImptTestHelper.runCommand(`impt device list --online -z json`, (commandOut) => {
                expect(commandOut).toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('offline device list', (done) => {
            ImptTestHelper.runCommand(`impt device list --offline -z json`, (commandOut) => {
                expect(commandOut).not.toContainDevice({ id: `${config.devices[config.deviceidx]}` });
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

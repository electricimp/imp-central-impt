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

const PRODUCT_NAME = '__impt_dev_product';
const PRODUCT_NAME_2 = '__impt_dev_product_2';
const DEVICE_GROUP_NAME = '__impt_dev_device_group';
const DEVICE_GROUP_NAME_2 = '__impt_dev_device_group_2';

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
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // custom matcher for search Device with expected properties in Device array
    let customMatcher = {
        toContainsDevice: function (util, customEqualityTesters) {
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
        toDeviceCountEqual: function () {
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
        return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
            product_id = ImptTestHelper.parseId(commandOut);
            if (!product_id) fail("TestSuitInit error: Fail create product");
            ImptTestHelper.emptyCheckEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_2}`, (commandOut) => {
                product2_id = ImptTestHelper.parseId(commandOut);
                if (!product2_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                if (!dg_id) fail("TestSuitInit error: Fail create device group");
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME_2} -p ${PRODUCT_NAME_2}`, (commandOut) => {
                dg2_id = ImptTestHelper.parseId(commandOut);
                if (!dg2_id) fail("TestSuitInit error: Fail create device group");
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME));
    }
    if (!build_id) fail("TestSuiteInit error: Fail create build");

    // delete all entities using in impt device list test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -f -q`, ImptTestHelper.emptyCheckEx));
    }

    describe('impt device list positive  tests >', () => {
        it('device list by owner me', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --owner me -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product id', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --product ${product_id} -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt device list --product ${product2_id} -z json`, (commandOut) => {
                    expect(commandOut).toDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product name', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --product ${PRODUCT_NAME} -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt device list --product ${PRODUCT_NAME_2} -z json`, (commandOut) => {
                    expect(commandOut).toDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by dg id', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --dg ${dg_id} -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt device list --dg ${dg2_id} -z json`, (commandOut) => {
                    expect(commandOut).toDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by dg type', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --dg-type development -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by product name and dg id', (done) => {
            ImptTestHelper.runCommandEx(`impt device list -p ${PRODUCT_NAME} -g ${dg_id} -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt device list -p ${PRODUCT_NAME} -g ${dg2_id} -z json`, (commandOut) => {
                    expect(commandOut).toDeviceCountEqual(0);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('device list by two dg', (done) => {
            ImptTestHelper.runCommandEx(`impt device list -g ${DEVICE_GROUP_NAME} -g ${dg2_id} -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('assigned device list', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --assigned -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('unassigned device list', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --unassigned -z json`, (commandOut) => {
                expect(commandOut).not.toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('online device list', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --online -z json`, (commandOut) => {
                expect(commandOut).toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('offline device list', (done) => {
            ImptTestHelper.runCommandEx(`impt device list --offline -z json`, (commandOut) => {
                expect(commandOut).not.toContainsDevice({ id: `${config.devices[0]}` });
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

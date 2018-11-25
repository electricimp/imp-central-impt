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

const LOGINKEY_DESCR = 'impt temp loginkey description';

const outputMode = '-z json';

// Test suite for 'impt loginkey list' command.
// Runs 'impt loginkey list' command with different combinations of options,
describe(`impt loginkey list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let loginkey_id = null;

    // custom matcher for search Loginkey with expected properties in Loginkey array
    let customMatcher = {
        toContainLoginkey: function (util, customEqualityTesters) {
            return {
                compare: function (LoginKeyArray, expected = {}) {
                    let result = { pass: false };
                    lodash.map(LoginKeyArray, function (LoginKeyItem) {
                        lodash.map(LoginKeyItem, function (LoginKeyProperties) {
                            let compareFlag = true;
                            lodash.map(LoginKeyProperties, function (value, key) {
                                compareFlag = compareFlag && (expected[key] === undefined ? true : util.equals(value, expected[key], customEqualityTesters));
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

    // delete all entities using in impt loginkey list test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey_id} --pwd ${config.password} --confirmed`, ImptTestHelper.emptyCheckEx);
    }

    // prepare test environment for impt loginkey list test suite
    function _testSuiteInit() {
        return ImptTestHelper.runCommand(`impt loginkey create --pwd ${config.password} --descr "${LOGINKEY_DESCR}"`, (commandOut) => {
            loginkey_id = ImptTestHelper.parseLoginkey(commandOut);
            if (!loginkey_id) fail("TestSuitInit error: Failed to create loginkey");
            ImptTestHelper.emptyCheck(commandOut);
        });
    }

    // check loginkey exist in loginkey list
    function _checkLoginkeyExist(commandOut, expectInfo) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        expect(json).toContainLoginkey(expectInfo);
    }

    it('loginkey list', (done) => {
        ImptTestHelper.runCommand(`impt loginkey list -z json`, (commandOut) => {
            _checkLoginkeyExist(commandOut);
            _checkLoginkeyExist(commandOut, { id: loginkey_id, description: LOGINKEY_DESCR });
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});

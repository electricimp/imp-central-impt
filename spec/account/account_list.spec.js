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

const outputMode = '-z json';

// Test suite for 'impt account list' command.
// Runs 'impt account list' command with different combinations of options,
describe(`impt account list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let email = null;
    let userid = null;

    // custom matcher for search account with expected properties in account array
    let customMatcher = {
        toContainAccount: function (util, customEqualityTesters) {
            return {
                compare: function (AccountArray, expected = {}) {
                    let result = { pass: false };
                    lodash.map(AccountArray, function (AccountItem) {
                        lodash.map(AccountItem, function (AccountProperties) {
                            let compareFlag = true;
                            lodash.map(AccountProperties, function (value, key) {
                                compareFlag = compareFlag && (expected[key] === undefined ? true : util.equals(value, expected[key], customEqualityTesters));
                            });
                            // all properties matched
                            if (compareFlag) result.pass = true;
                        });
                    });
                    if (!result.pass) result.message = "Account is not found in list";
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
        ImptTestHelper.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // prepare environment for account info command testing
    function _testSuiteInit() {
        return ImptTestHelper.getAccountAttrs().
            then((account) => { email = account.email; userid = account.id; });
    }

    // check account exist in account list
    function _checkAccountExist(commandOut, expectInfo) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        expect(json).toContainAccount(expectInfo);
    }

    it('account list', (done) => {
        ImptTestHelper.runCommand(`impt account list -z json`, (commandOut) => {
            _checkAccountExist(commandOut, { id: userid, email: email, username: config.username });
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});

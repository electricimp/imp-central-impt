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

const LOGINKEY_DESCR = 'impt temp loginkey description';

// Test suite for 'impt product create' command.
// Runs 'impt product create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt loginkey create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let loginkey_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterEach((done) => {
            testSuiteCleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // delete all entities using in impt loginkey create test suite
        function testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey_id} --pwd ${config.password} --confirmed`, ImptTestHelper.emptyCheckEx);
        }

        // check command`s result by exec loginkey info command
        function checkLoginkeyInfo(expectInfo) {
            return ImptTestHelper.runCommandEx(`impt loginkey info --lk ${expectInfo && expectInfo.id ? expectInfo.id : loginkey_id}  ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, `${expectInfo && expectInfo.id ? expectInfo.id : loginkey_id}`);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_DESCRIPTION, `${expectInfo && expectInfo.descr ? expectInfo.descr : ''}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        // check successfuly created loginkey output message 
        function checkSuccessCreateLoginkeyMessage(commandOut, loginkey_id) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${loginkey_id}"`)
            );
        }

        it('loginkey create', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password} --descr "${LOGINKEY_DESCR}" ${outputMode}`, (commandOut) => {
                loginkey_id = ImptTestHelper.parseId(commandOut);
                expect(loginkey_id).not.toBeNull;
                checkSuccessCreateLoginkeyMessage(commandOut, loginkey_id);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, loginkey_id);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_DESCRIPTION, LOGINKEY_DESCR);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => checkLoginkeyInfo({ descr: LOGINKEY_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey create without description', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password} ${outputMode}`, (commandOut) => {
                loginkey_id = ImptTestHelper.parseId(commandOut);
                expect(loginkey_id).not.toBeNull;
                checkSuccessCreateLoginkeyMessage(commandOut, loginkey_id);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, loginkey_id);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(checkLoginkeyInfo).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey create without password', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey create ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});
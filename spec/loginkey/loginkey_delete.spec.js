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

// Test suite for 'impt product create' command.
// Runs 'impt product create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt loginkey delete test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let loginkey_id = null;
        let loginkey_id_2 = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // delete all entities using in impt loginkey delete test suite
        function testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey_id_2} --pwd ${config.password} --confirmed`, ImptTestHelper.emptyCheckEx);
        }

        // prepare test environment for impt loginkey delete test suite
        function testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password} ${outputMode}`, (commandOut) => {
                loginkey_id = ImptTestHelper.parseId(commandOut);
                if (!loginkey_id) fail("TestSuitInit error: Fail create loginkey");
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password} ${outputMode}`, (commandOut) => {
                    loginkey_id_2 = ImptTestHelper.parseId(commandOut);
                    if (!loginkey_id_2) fail("TestSuitInit error: Fail create loginkey");
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        // check successfuly deleted loginkey output message 
        function checkSuccessDeleteLoginkeyMessage(commandOut, loginkey_id) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`, `"${loginkey_id}"`)
            );
        }

        it('loginkey delete', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey_id} --pwd ${config.password} --confirmed ${outputMode}`, (commandOut) => {
                checkSuccessDeleteLoginkeyMessage(commandOut, loginkey_id);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt loginkey info --lk ${loginkey_id}  ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkFailStatusEx(commandOut);
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, loginkey_id);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey delete without password', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey_id_2} -q ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey delete without confirmation', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey_id_2} --pwd ${config.password} ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist loginkey delete', (done) => {
            ImptTestHelper.runCommandEx(`impt loginkey delete --lk not-exist-loginkey --pwd ${config.password} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, 'not-exist-loginkey');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});
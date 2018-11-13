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

// Test suite for 'impt loginkey delete' command.
// Runs 'impt loginkey delete' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt loginkey delete test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let loginkey_id = null;
        let loginkey2_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
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

        // delete all entities using in impt loginkey delete test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey2_id} --pwd ${config.password} --confirmed`, ImptTestHelper.emptyCheckEx);
        }

        // prepare test environment for impt loginkey delete test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt loginkey create --pwd ${config.password} ${outputMode}`, (commandOut) => {
                loginkey_id = ImptTestHelper.parseId(commandOut);
                if (!loginkey_id) fail("TestSuitInit error: Failed to create loginkey");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt loginkey create --pwd ${config.password} ${outputMode}`, (commandOut) => {
                    loginkey2_id = ImptTestHelper.parseId(commandOut);
                    if (!loginkey2_id) fail("TestSuitInit error: Failed to create loginkey");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // check successfuly deleted loginkey output message 
        function _checkSuccessDeleteLoginkeyMessage(commandOut, loginkey_id) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY} "${loginkey_id}"`)
            );
        }

        it('loginkey delete', (done) => {
            ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey_id} --pwd ${config.password} --confirmed ${outputMode}`, (commandOut) => {
                _checkSuccessDeleteLoginkeyMessage(commandOut, loginkey_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt loginkey info --lk ${loginkey_id}  ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkFailStatus(commandOut);
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, loginkey_id);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey delete without password', (done) => {
            ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey2_id} -q ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey delete without confirmation', (done) => {
            ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey2_id} --pwd ${config.password} ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist loginkey delete', (done) => {
            ImptTestHelper.runCommand(`impt loginkey delete --lk not-exist-loginkey --pwd ${config.password} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, 'not-exist-loginkey');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});
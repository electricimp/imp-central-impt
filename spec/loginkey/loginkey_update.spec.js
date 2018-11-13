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
const LOGINKEY_NEW_DESCR = 'impt new loginkey description';

// Test suite for 'impt loginkey update' command.
// Runs 'impt loginkey update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt loginkey update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        beforeEach((done) => {
            _testSuiteInit().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterEach((done) => {
            _testSuiteCleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // delete all entities using in impt loginkey update test
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey_id} --pwd ${config.password} --confirmed`, ImptTestHelper.emptyCheckEx);
        }

        // prepare test environment for impt loginkey update test
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt loginkey create --pwd ${config.password} --descr "${LOGINKEY_DESCR}" ${outputMode}`, (commandOut) => {
                loginkey_id = ImptTestHelper.parseId(commandOut);
                if (!loginkey_id) fail("TestSuitInit error: Failed to create loginkey");
                ImptTestHelper.emptyCheck(commandOut);
            });
        }

        // check successfuly updated loginkey output message 
        function _checkSuccessUpdateLoginkeyMessage(commandOut, loginkey_id) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY} "${loginkey_id}"`)
            );
        }

        it('loginkey update description', (done) => {
            ImptTestHelper.runCommand(`impt loginkey update --lk ${loginkey_id} --pwd ${config.password} --descr "${LOGINKEY_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateLoginkeyMessage(commandOut, loginkey_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt loginkey info --lk ${loginkey_id} ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, loginkey_id);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_DESCRIPTION, LOGINKEY_NEW_DESCR);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey update without new value', (done) => {
            ImptTestHelper.runCommand(`impt loginkey update --lk ${loginkey_id} --pwd ${config.password} ${outputMode}`, (commandOut) => {
                MessageHelper.checkMissingArgumentsError(commandOut, 'descr');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('loginkey update description without password', (done) => {
            ImptTestHelper.runCommand(`impt loginkey update --lk ${loginkey_id} --descr "${LOGINKEY_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist loginkey update', (done) => {
            ImptTestHelper.runCommand(`impt loginkey update --lk not-exist-loginkey --pwd ${config.password} --descr "${LOGINKEY_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, 'not-exist-loginkey');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});
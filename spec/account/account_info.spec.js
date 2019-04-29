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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

// Test suite for 'impt account info' command.
// Runs 'impt account info' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt account info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let email = null;
        let userid = null;

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

        // prepare environment for account info command testing
        function _testSuiteInit() {
            return ImptTestHelper.getAccountAttrs().
                then((account) => { email = account.email; userid = account.id; });
        }

        function _checkAccountInfo(commandOut) {
            ImptTestHelper.checkAttribute(commandOut, 'id', userid);
            ImptTestHelper.checkAttribute(commandOut, 'username', config.username);
            ImptTestHelper.checkAttribute(commandOut, 'email', email);
        }

        describe(`impt account info positive tests >`, () => {
            beforeAll((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('account info', (done) => {
                ImptTestHelper.runCommand(`impt account info`, (commandOut) => {
                    _checkAccountInfo(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('account info by me', (done) => {
                ImptTestHelper.runCommand(`impt account info --user me`, (commandOut) => {
                    _checkAccountInfo(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('account info by username', (done) => {
                ImptTestHelper.runCommand(`impt account info --user ${config.username}`, (commandOut) => {
                    _checkAccountInfo(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('account info by user id', (done) => {
                ImptTestHelper.runCommand(`impt account info -u ${userid}`, (commandOut) => {
                    _checkAccountInfo(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('account info by email', (done) => {
                ImptTestHelper.runCommand(`impt account info -u ${email}`, (commandOut) => {
                    _checkAccountInfo(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`impt account info negative tests >`, () => {
            it('account info by not exist username', (done) => {
                ImptTestHelper.runCommand(`impt account info -u not-exist-user`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.ACCOUNT, 'not-exist-user');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('account info without user value', (done) => {
                ImptTestHelper.runCommand(`impt account info -u`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'u');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

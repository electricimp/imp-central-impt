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
const ImptAuthCommandsHelper = require('./ImptAuthCommandsHelper');
const MessageHelper = require('../MessageHelper');
const Shell = require('shelljs');

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth info' command, using environment variables.
// Runs impt auth info commands with different combinations of environment variables.
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt auth using environment variables test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
        let loginkey = null;

        beforeAll((done) => {
            ImptTestHelper.init(true).
                then(_createLoginkey).
                then(_prepAuthPath).
                then(ImptAuthCommandsHelper.localLogout).
                then(ImptAuthCommandsHelper.globalLogout).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptAuthCommandsHelper.localLogin().
                then(_deleteLoginkey).
                then(ImptAuthCommandsHelper.localLogout).
                then(ImptAuthCommandsHelper.globalLogout).
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        function _prepAuthPath() {
            return new Promise((resolve, reject) => {
                Shell.mkdir(`${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`);
                Shell.mkdir(`${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Empty`);
                Shell.cp('-rf', `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/.impt.auth`, `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth/.impt.auth`);
                resolve();
            });
        }

        function _createLoginkey() {
            return ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password}`, (commandOut) => {
                const idMatcher = commandOut.output.match(new RegExp(`[0-9a-z]{16}`));
                if (idMatcher && idMatcher.length > 0) {
                    loginkey = idMatcher[0];
                }
                else fail("TestSuitInit error: Fail create loginkey");
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        function _deleteLoginkey() {
            return ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey} --pwd ${config.password} -q`,
                ImptTestHelper.emptyCheckEx);
        }

        function _checkLoginInfo(commandOut, expInfo = {}) {
            ImptTestHelper.checkAttributeEx(commandOut, 'endpoint', expInfo.epoint ? expInfo.epoint : endpoint);
            ImptTestHelper.checkAttributeEx(commandOut, 'auto refresh', expInfo.refresh ? expInfo.refresh : 'true');
            ImptTestHelper.checkAttributeEx(commandOut, 'Auth type', expInfo.auth ? expInfo.auth : 'Global Auth file');
            ImptTestHelper.checkAttributeEx(commandOut, 'Login method', expInfo.method ? expInfo.method : 'User/Password');
            ImptTestHelper.checkAttributeEx(commandOut, 'Email', expInfo.email ? expInfo.email : config.email);
            ImptTestHelper.checkAttributeEx(commandOut, 'Username', config.username);
            ImptTestHelper.checkAttributeEx(commandOut, 'Account id', config.accountid);
        }

        describe('Tests with not auth preconditions >', () => {
            it('Auth file path env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth file path with loginkey env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`, 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth file path with user env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`, 'IMPT_USER': config.username }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth loginkey env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth loginkey with endpoint env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey, 'IMPT_ENDPOINT': endpoint }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth loginkey with user env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey, 'IMPT_USER': config.username }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth user pass env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth user pass with endpoint env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password, 'IMPT_ENDPOINT': endpoint }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth user without password env info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    }, { 'IMPT_USER': config.username }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with global auth preconditions >', () => {
            beforeAll((done) => {
                ImptAuthCommandsHelper.globalLogin().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('Auth file path env and global auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth loginkey env and global auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth user pass env and global auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth pass env and global auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with local auth preconditions >', () => {
            beforeAll((done) => {
                ImptAuthCommandsHelper.localLogin().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptAuthCommandsHelper.localLogout().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('Auth file path env and local auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Local Auth file` });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth loginkey env and local auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Local Auth file' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('Auth user env and local auth info', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Local Auth file' });
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

    });
});

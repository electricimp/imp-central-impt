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
        let email = null;
        let userid = null;

        beforeAll((done) => {
            ImptTestHelper.init(true).
                then(() => ImptAuthCommandsHelper.createLoginkey((commandOut) => {
                    loginkey = commandOut;
                })).
                then(() => ImptTestHelper.getAccountAttrs()).
                then((account) => { email = account.email; userid = account.id; }).
                then(_prepAuthPath).
                then(ImptAuthCommandsHelper.localLogout).
                then(ImptAuthCommandsHelper.globalLogout).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptAuthCommandsHelper.localLogin().
                then(() => ImptAuthCommandsHelper.deleteLoginkey(loginkey)).
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

        function _checkLoginInfo(commandOut, expInfo = {}) {
            ImptTestHelper.checkAttribute(commandOut, 'endpoint', expInfo.epoint ? expInfo.epoint : endpoint);
            ImptTestHelper.checkAttribute(commandOut, 'auto refresh', expInfo.refresh ? expInfo.refresh : 'true');
            ImptTestHelper.checkAttribute(commandOut, 'Auth type', expInfo.auth ? expInfo.auth : 'Global Auth file');
            ImptTestHelper.checkAttribute(commandOut, 'Login method', expInfo.method ? expInfo.method : 'User/Password');
            ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
        }

        describe('Tests with not auth preconditions >', () => {
            it('auth file path env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth file path with loginkey env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`, 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth file path with user env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        ImptTestHelper.checkSuccessStatus(commandOut);
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`, 'IMPT_USER': config.username }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth loginkey env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth loginkey with endpoint env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey, 'IMPT_ENDPOINT': endpoint }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth loginkey with user env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey, 'IMPT_USER': config.username }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth user pass env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth user pass with endpoint env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_USER': email, 'IMPT_PASSWORD': config.password, 'IMPT_ENDPOINT': endpoint }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth user without password env info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        ImptTestHelper.checkFailStatus(commandOut);
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

            it('auth file path env and global auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Auth file path:` });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth loginkey env and global auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables', method: 'Login Key' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth user pass env and global auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Environment variables' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth pass env and global auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut);
                        ImptTestHelper.checkSuccessStatus(commandOut);
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

            it('auth file path env and local auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: `Local Auth file` });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth loginkey env and local auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Local Auth file' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_LOGINKEY': loginkey }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth user env and local auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`,
                    (commandOut) => {
                        _checkLoginInfo(commandOut, { auth: 'Local Auth file' });
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

    });
});

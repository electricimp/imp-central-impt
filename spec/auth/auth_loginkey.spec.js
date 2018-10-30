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

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --lk<loginkey>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt auth login by loginkey test suite  (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        const auth = `--user ${config.username} --pwd ${config.password}`;
        const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
        let loginkey = null;

        beforeAll((done) => {
            ImptTestHelper.init(true).
                then(_createLoginkey).
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

        function _createLoginkey() {
            return ImptTestHelper.runCommand(`impt loginkey create --pwd ${config.password}`, (commandOut) => {
                const idMatcher = commandOut.output.match(new RegExp(`[0-9a-z]{16}`));
                if (idMatcher && idMatcher.length > 0) {
                    loginkey = idMatcher[0];
                }
                else fail("TestSuitInit error: Fail create loginkey");
                ImptTestHelper.emptyCheck(commandOut);
            });
        }

        function _deleteLoginkey() {
            return ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey} --pwd ${config.password} -q`,
                ImptTestHelper.emptyCheckEx);
        }


        function _checkLoginInfo(expInfo = {}) {
            return ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                ImptTestHelper.checkAttribute(commandOut, 'endpoint', expInfo.endpoint ? expInfo.endpoint : endpoint);
                ImptTestHelper.checkAttribute(commandOut, 'auto refresh', expInfo.refresh ? expInfo.refresh : 'true');
                ImptTestHelper.checkAttribute(commandOut, 'Auth type', expInfo.auth ? expInfo.auth : 'Global Auth file');
                ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        describe('Tests with not auth preconditions >', () => {
            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('global login by loginkey', (done) => {
                ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(_checkLoginInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp login by loginkey', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp --lk ${loginkey} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local temp login by loginkey', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp --local --lk ${loginkey} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file', refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local login by loginkey with endpoint', (done) => {
                ImptTestHelper.runCommand(`impt auth login --local --endpoint ${endpoint} --lk ${loginkey} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global login by loginkey with endpoint', (done) => {
                ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} --endpoint ${endpoint} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(_checkLoginInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp login by loginkey with endpoint', (done) => {
                ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} --temp --endpoint ${endpoint} ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global login without loginkey', (done) => {
                ImptTestHelper.runCommand(`impt auth login ${outputMode} --lk`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'lk');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with global auth preconditions >', () => {
            beforeEach((done) => {
                ImptAuthCommandsHelper.globalLogin().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('repeated global temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp --lk ${loginkey} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated global temp login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp --endpoint ${endpoint} --lk ${loginkey} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated local temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp --local --lk ${loginkey} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file', refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with global auth by loginkey preconditions >', () => {
            beforeEach((done) => {
                ImptAuthCommandsHelper.globalLoginByLoginkey(loginkey).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('repeated global login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(_checkLoginInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated global login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login --endpoint ${endpoint} ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(_checkLoginInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated global temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login --temp ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated local login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated local login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l --endpoint ${endpoint} ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeated local temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l --temp ${auth} -q ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx).
                    then(() => _checkLoginInfo({ auth: 'Local Auth file', refresh: 'false' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global loginkey auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info  ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'endpoint', endpoint);
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'true');
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Global Auth file');
                    ImptTestHelper.checkAttribute(commandOut, 'Login method', 'Login Key');
                    ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });


        });

        describe('Tests with login auth by loginkey preconditions >', () => {
            beforeEach((done) => {
                ImptAuthCommandsHelper.localLoginByLoginkey(loginkey).
                    then(ImptAuthCommandsHelper.globalLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('local loginkey auth info ', (done) => {
                ImptTestHelper.runCommand(`impt auth info  ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'endpoint', endpoint);
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'true');
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Local Auth file');
                    ImptTestHelper.checkAttribute(commandOut, 'Login method', 'Login Key');
                    ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with global temp loginkey auth preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} -t -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('global temp loginkey auth info ', (done) => {
                ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'endpoint', endpoint);
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'false');
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Global Auth file');
                    ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('Tests with global loginkey auth and endpoint preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommand(`impt auth login --lk ${loginkey}  -e ${endpoint} -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('check global endpoint loginkey auth info ', (done) => {
                ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'endpoint', endpoint);
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'true');
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Global Auth file');
                    ImptTestHelper.checkAttribute(commandOut, 'Login method', 'Login Key');
                    ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

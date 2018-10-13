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

// Test suite for 'impt auth login --lk<loginkey>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt auth using environment variables test suite >', () => {
        const auth = `--user ${config.email} --pwd ${config.password}`;
        const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
        let loginkey = null;

        beforeAll((done) => {
            ImptTestHelper.init(true).
                then(_createLoginkey).
                then(_copyAuthFile).
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

        function _copyAuthFile() {
            return new Promise((resolve, reject) => {
                Shell.mkdir(`${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth`);
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


        function _checkLoginInfo(expectedInfo = {}) {
            return ImptTestHelper.runCommandEx(`impt auth info`, (commandOut) => {
                ImptTestHelper.checkAttributeEx(commandOut, 'endpoint', expectedInfo.epoint ? expectedInfo.epoint : endpoint);
                ImptTestHelper.checkAttributeEx(commandOut, 'auto refresh', expectedInfo.refresh ? expectedInfo.refresh : 'true');
                ImptTestHelper.checkAttributeEx(commandOut, 'Auth type', expectedInfo.auth ? expectedInfo.auth : 'Global Auth file');
                ImptTestHelper.checkAttributeEx(commandOut, 'Email', expectedInfo.email ? expectedInfo.email : config.email);
                if (config.username) ImptTestHelper.checkAttributeEx(commandOut, 'Username', config.username);
                if (config.accountid) ImptTestHelper.checkAttributeEx(commandOut, 'Account id', config.accountid);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        describe('Tests with not auth preconditions >', () => {
            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('test environment', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx, { 'IMPT_AUTH_FILE_PATH': `${ImptTestHelper.TESTS_EXECUTION_FOLDER}/Auth` }).
                    //then(_checkLoginInfo).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_USER')).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_PASSWORD')).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test environment', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    //then(_checkLoginInfo).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_USER')).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_PASSWORD')).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test environment', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info ${outputMode}`,
                    ImptTestHelper.checkSuccessStatusEx, { 'IMPT_LOGINKEY': loginkey }).
                    //then(_checkLoginInfo).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_USER')).
                    //then(() => ImptAuthCommandsHelper.deleteEnvVariable('IMPT_PASSWORD')).
                    then(done).
                    catch(error => done.fail(error));
            });

            xit('clear loginkeys', (done) => {
                let ids = null;
                ImptTestHelper.runCommandEx(`impt loginkey list`,
                    (commandOut) => {
                        ids = commandOut.output.match(new RegExp(/[0-9a-z]{16}/g));

                    }, { 'IMPT_USER': config.username, 'IMPT_PASSWORD': config.password }).
                    then(() => ids.forEach((key) => ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${key} --pwd ${config.password} -q`,
                        ImptTestHelper.emptyCheckEx))).
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
        });

        describe('Tests with global temp loginkey auth preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommandEx(`impt auth login --lk ${loginkey} -t -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);


        });

        describe('Tests with global loginkey auth and endpoint preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommandEx(`impt auth login --lk ${loginkey}  -e ${endpoint} -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            xit('check global endpoint loginkey auth info ', (done) => {
                ImptTestHelper.runCommandEx(`impt auth info`, (commandOut) => {
                    ImptTestHelper.checkAttributeEx(commandOut, 'endpoint', endpoint);
                    ImptTestHelper.checkAttributeEx(commandOut, 'auto refresh', 'true');
                    ImptTestHelper.checkAttributeEx(commandOut, 'Auth type', 'Global Auth file');
                    ImptTestHelper.checkAttributeEx(commandOut, 'Login method', 'Login Key');
                    ImptTestHelper.checkAttributeEx(commandOut, 'Email', config.email);
                    if (config.username) ImptTestHelper.checkAttributeEx(commandOut, 'Username', config.username);
                    if (config.accountid) ImptTestHelper.checkAttributeEx(commandOut, 'Account id', config.accountid);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

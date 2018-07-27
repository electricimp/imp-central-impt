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
const FS = require('fs');
const config = require('../config');
const ImptTestingHelper = require('../ImptTestingHelper');

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --user <user_id> --pwd <password>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
describe('impt auth by user/password test suite >', () => {
    beforeAll((done) => {
        ImptTestingHelper.init(false).
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestingHelper.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    function testSuiteInit() {
        return ImptTestingHelper.runCommand('impt auth logout', ImptTestingHelper.emptyCheck);
    }

    // negative test - run 'impt auth info' command without login
    it('auth info without login', (done) => {
        ImptTestingHelper.runCommand('impt auth info', ImptTestingHelper.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    // negative test - run 'impt auth logout' command without login
    it('global logout without login', (done) => {
        ImptTestingHelper.runCommand('impt auth logout', ImptTestingHelper.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('global login', (done) => {
        const endpoint = config.apiEndpoint ? `--endpoint ${config.apiEndpoint}` : '';
        ImptTestingHelper.runCommand(
            `impt auth login --user ${config.email} --pwd ${config.password} ${endpoint}`,
            ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('check global auth info', (done) => {
        ImptTestingHelper.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Global');
                expect(commandOut).toMatch(config.email);
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('repeated global temp login', (done) => {
        const endpoint = config.apiEndpoint ? `-e ${config.apiEndpoint}` : '';
        ImptTestingHelper.runCommand(
            `impt auth login -u ${config.email} -w ${config.password} ${endpoint} --temp --confirmed --output debug`,
            ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('check global temp auth info', (done) => {
        ImptTestingHelper.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Global');
                expect(commandOut).toMatch(config.email);
                ImptTestingHelper.checkAttribute(commandOut, 'auto refresh', 'false');
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    // negative test - run local logout command without login
    it('local logout without login', (done) => {
        ImptTestingHelper.runCommand('impt auth logout --local', ImptTestingHelper.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('local login', (done) => {
        const endpoint = config.apiEndpoint ? `--endpoint ${config.apiEndpoint}` : `--endpoint ${DEFAULT_ENDPOINT}`;
        ImptTestingHelper.runCommand(
            `impt auth login --local --user ${config.email} --pwd ${config.password} ${endpoint}`,
            ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));;
    });

    it('check local auth info', (done) => {
        ImptTestingHelper.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Local');
                expect(commandOut).toMatch(config.email);
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('repeated local temp login', (done) => {
        const endpoint = config.apiEndpoint ? `-e ${config.apiEndpoint}` : `-e ${DEFAULT_ENDPOINT}`;
        ImptTestingHelper.runCommand(`impt auth login -l -u ${config.email} -w ${config.password} ${endpoint} -q -t -z debug`, (commandOut) => {
                // login --temp must not save refreshToken and loginKey in the auth config file
                const authFileName = ImptTestingHelper.TESTS_EXECUTION_FOLDER + '/.impt.auth';
                if (FS.existsSync(authFileName)) {
                    try {
                        const json = JSON.parse(FS.readFileSync(authFileName).toString());
                        expect(json.refreshToken).toBeUndefined();
                        expect(json.loginKey).toBeUndefined();
                    } catch (error) {
                        done.fail('Local auth file reading failed: ' + error);
                    }
                }
                else {
                    done.fail('Local auth file not found');
                }
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('global logout', (done) => {
        ImptTestingHelper.runCommand('impt auth logout', ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('local logout', (done) => {
        ImptTestingHelper.runCommand('impt auth logout -l', ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    // negative tests
    it('login without user/password', (done) => {
        ImptTestingHelper.runCommand('impt auth login', ImptTestingHelper.checkFailStatus).
            then(() => ImptTestingHelper.runCommand('impt auth login --local', ImptTestingHelper.checkFailStatus)).
            then(() => ImptTestingHelper.runCommand('impt auth login -l -u', ImptTestingHelper.checkFailStatus)).
            then(() => ImptTestingHelper.runCommand('impt auth login -l -w', ImptTestingHelper.checkFailStatus)).
            then(() => ImptTestingHelper.runCommand(`impt auth login -l -u ${config.email}`, ImptTestingHelper.checkFailStatus)).
            then(() => ImptTestingHelper.runCommand(`impt auth login -l -w ${config.password}`, ImptTestingHelper.checkFailStatus)).
            then(done).
            catch(error => done.fail(error));
    });
});

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
const util = require('../util');

describe('impt auth by user/password test suite >', () => {
    beforeAll((done) => {
        util.init().
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    afterAll((done) => {
        util.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    function testSuiteInit() {
        return util.runCommand('impt auth logout', util.emptyCheck);
    }

    it('auth info without login', (done) => {
        util.runCommand('impt auth info', util.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('global logout without login', (done) => {
        util.runCommand('impt auth logout', util.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('global login', (done) => {
        util.runCommand(`impt auth login --user ${config.email} --pwd ${config.password}`, util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('global auth info', (done) => {
        util.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Global');
                expect(commandOut).toMatch(config.email);
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('repeated global temp login', (done) => {
        util.runCommand(`impt auth login -u ${config.email} -w ${config.password} --temp --confirmed`, util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('global temp auth info', (done) => {
        util.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Global');
                expect(commandOut).toMatch(config.email);
                const matcher = commandOut.match(/auto refresh:\s+false/);
                expect(matcher).toBeNonEmptyArray();
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('local logout without login', (done) => {
        util.runCommand('impt auth logout --local', util.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('local login', (done) => {
        util.runCommand(`impt auth login --local --user ${config.email} --pwd ${config.password}`, util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));;
    });

    it('local auth info', (done) => {
        util.runCommand('impt auth info', (commandOut) => {
                expect(commandOut).toMatch('Local');
                expect(commandOut).toMatch(config.email);
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('repeated local temp login', (done) => {
        util.runCommand(`impt auth login -l -u ${config.email} -w ${config.password} -q -t`, (commandOut) => {
                // login --temp must not save refreshToken and loginKey in the auth config file
                const authFileName = util.TESTS_EXECUTION_FOLDER + '/.impt.auth';
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
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('global logout', (done) => {
        util.runCommand('impt auth logout', util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('local logout', (done) => {
        util.runCommand('impt auth logout -l', util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });
});

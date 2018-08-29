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

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --lk<loginkey>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
describe('impt auth login by loginkey test suite >', () => {
    const auth = `--user ${config.email} --pwd ${config.password}`;
    const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
    const outputMode = '';
    let loginkey = null;

    beforeAll((done) => {
        ImptTestHelper.init(true).
            then(createLoginkey).
            then(ImptAuthCommandsHelper.localLogout).
            then(ImptAuthCommandsHelper.globalLogout).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestHelper.cleanUp().
            then(deleteLoginkey).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    function createLoginkey() {
        return ImptTestHelper.runCommandEx(`impt loginkey create --pwd ${config.password}`, (commandOut) => {
            const idMatcher = commandOut.output.match(new RegExp(`[0-9a-z]{16}`));
            if (idMatcher && idMatcher.length > 0) {
                loginkey = idMatcher[0];
            }
            else fail("TestSuitInit error: Fail create loginkey");
            ImptTestHelper.emptyCheckEx(commandOut);
        });
    }

    function deleteLoginkey() {
        return ImptTestHelper.runCommandEx(`impt loginkey delete --lk ${loginkey} --pwd ${config.password} -q`,
            ImptTestHelper.emptyCheckEx);
    }

    describe('Tests with not auth preconditions >', () => {
        afterEach((done) => {
            ImptAuthCommandsHelper.localLogout().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        it('global auth login by keylogin ', (done) => {
            ImptTestHelper.runCommandEx(`impt auth login  --lk ${loginkey} ${outputMode}`,
                ImptTestHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });
    });
});    

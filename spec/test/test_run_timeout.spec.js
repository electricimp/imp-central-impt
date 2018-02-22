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

/**
 * Test for timeout behavior
 */

'use strict';

require('jasmine-expect');

const util = require('../util');
const testUtil = require('./testUtil');

describe('impt test run for timeout behavior >', () => {
    beforeAll((done) => {
        util.initAndLoginLocal().
            then(testUtil.cleanUpTestEnvironment).
            then(testUtil.createTestProductAndDG).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    afterAll((done) => {
        testUtil.cleanUpTestEnvironment().
            then(() => util.cleanUp()).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    it('run test with too small timeout', (done) => {
        testUtil.createTestConfig('fixtures/timeout', { 'timeout' : 3 }).
            then(() => util.runCommand('impt test run', (commandOut) => {
                expect(commandOut).not.toBeEmptyString();
                expect(commandOut).toMatch('Test timed out');
                testUtil.checkTestFailStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    // checks that timeout is applied to every test method, not to the whole session
    it('run test with appropriate timeout', (done) => {
        testUtil.createTestConfig('fixtures/timeout', { 'timeout' : 10 }).
            then(() => util.runCommand('impt test run', (commandOut) => {
                expect(commandOut).not.toBeEmptyString();
                testUtil.checkTestSuccessStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });
});

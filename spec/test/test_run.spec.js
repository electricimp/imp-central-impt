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

const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');
const MessageHelper = require('../MessageHelper');

const outputMode = '';

// Impt test run tests
describe(`impt test run (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    beforeAll((done) => {
        ImptTestHelper.init().
            then(ImptTestCommandsHelper.cleanUpTestEnvironment).
            then(() => ImptTestCommandsHelper.saveDeviceInfo()).
            then(ImptTestCommandsHelper.createTestProductAndDG).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestCommandsHelper.cleanUpTestEnvironment().
            then(() => ImptTestHelper.restoreDeviceInfo()).
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    describe(`test run positive tests >`, () => {
        it('test run all test files', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -e', (commandOut) => {
                    expect(commandOut.output).not.toBeEmptyString();
                    expect(commandOut.output).toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).toMatch('TestFile1Case1Test2');
                    expect(commandOut.output).toMatch('TestFile1Case2Test1');
                    expect(commandOut.output).toMatch('TestFile2Case1Test1');
                    ImptTestCommandsHelper.checkTestSuccessStatus(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('test run one test file', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t testfile.test.nut', (commandOut) => {
                    expect(commandOut.output).not.toBeEmptyString();
                    expect(commandOut.output).toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).toMatch('TestFile1Case1Test2');
                    expect(commandOut.output).toMatch('TestFile1Case2Test1');
                    expect(commandOut.output).not.toMatch('TestFile2Case1Test1');
                    ImptTestCommandsHelper.checkTestSuccessStatus(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('test run one test case', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t testfile.test.nut:FirstTestCase', (commandOut) => {
                    expect(commandOut.output).not.toBeEmptyString();
                    expect(commandOut.output).toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).toMatch('TestFile1Case1Test2');
                    expect(commandOut.output).not.toMatch('TestFile1Case2Test1');
                    expect(commandOut.output).not.toMatch('TestFile2Case1Test1');
                    ImptTestCommandsHelper.checkTestSuccessStatus(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('test run one test method', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t testfile.test.nut:FirstTestCase::testMethod', (commandOut) => {
                    expect(commandOut.output).not.toBeEmptyString();
                    expect(commandOut.output).toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).not.toMatch('TestFile1Case1Test2');
                    expect(commandOut.output).not.toMatch('TestFile1Case2Test1');
                    expect(commandOut.output).not.toMatch('TestFile2Case1Test1');
                    ImptTestCommandsHelper.checkTestSuccessStatus(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe(`test run negative tests >`, () => {
        it('test run not exist test file', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t not-exist-file', (commandOut) => {
                    MessageHelper.checkNoTestFileFoundMessage(commandOut);
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('test run not exist test case', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t testfile.test.nut:TestFile1CaseNotExist', (commandOut) => {
                    expect(commandOut.output).not.toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).not.toMatch('TestFile1Case1Test2');
                    expect(commandOut.output).not.toMatch('TestFile1Case2Test1');
                    expect(commandOut.output).toMatch('Skip "testfile.test.nut" testing');
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('test run not exist test method', (done) => {
            ImptTestCommandsHelper.createTestConfig('fixtures/run', {}).
                then(() => ImptTestHelper.runCommand('impt test run -t testfile.test.nut:FirstTestCase::not-exist-method', (commandOut) => {
                    expect(commandOut.output).not.toMatch('TestFile1Case1Test1');
                    expect(commandOut.output).not.toMatch('TestFile1Case1Test2');
                    ImptTestHelper.checkSuccessStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

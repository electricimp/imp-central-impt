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

// Deep equal tests
describe('impt test run for asserts scenario >', () => {
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

    it('test assert true', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/true', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Failed to assert that condition is true/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert equal', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/equal', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Expected value: true, got: false/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert greater', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/greater', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Failed to assert that 2 > 2/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert less', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/less', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Failed to assert that 2 < 2/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert close', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/close', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Expected value: 9±0.5, got: 10/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert deep equal', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/deep_equal', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Comparison failed on 'a\.b\.c': expected 3, got none/);
                expect(commandOut.output).toMatch(/Comparison failed on 'a\.b\.d': expected none, got 4/);
                expect(commandOut.output).toMatch(/Comparison failed on 'a\.b\.c': expected 3, got 100/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert between', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/between', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Expected value the range of 11..12, got 10/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('test assert throw', (done) => {
        ImptTestCommandsHelper.createTestConfig('fixtures/asserts/throw', {}).
            then(() => ImptTestHelper.runCommand('impt test run', (commandOut) => {
                expect(commandOut.output).not.toBeEmptyString();
                expect(commandOut.output).toMatch(/Success/);
                expect(commandOut.output).toMatch(/Function was expected to throw an error/);
                ImptTestCommandsHelper.checkTestFailStatus(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });
});

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

const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');

// Tests for Bi-directional Device-Agent Communication
describe('impt test run for Agent code and device code together scenario >', () => {
    beforeAll((done) => {
        ImptTestHelper.init().
            then(ImptTestCommandsHelper.cleanUpTestEnvironment).
            then(() => ImptTestCommandsHelper.saveDeviceInfo()).
            then(() => ImptTestCommandsHelper.createTestEnvironment(
                'fixtures/agent_with_partner_code',
                { 'test-file': 'tests/tmp.agent.*.nut' })).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestCommandsHelper.cleanUpTestEnvironment().
            then(() => ImptTestHelper.restoreDeviceInfo()).
            then(() => ImptTestHelper.cleanUp()).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    it('run test', (done) => {
        ImptTestHelper.runCommand('impt test run --tests :MyTestCase::testMe_1', (commandOut) => {
            expect(commandOut.output).not.toBeEmptyString();
            expect(commandOut.output).not.toMatch(/MyTestCase::testMe\(\)\n/);
            expect(commandOut.output).toMatch(/MyTestCase::testMe_1\(\)\n/);
            ImptTestHelper.checkSuccessStatus(commandOut);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});

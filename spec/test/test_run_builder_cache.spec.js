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

// Builder syntax tests

'use strict';

require('jasmine-expect');

const Shell = require('shelljs');
const util = require('../util');
const testUtil = require('./testUtil');

describe('impt test run for Builder cache scenario >', () => {
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

    it('run test without builder-cache option in the project config', (done) => {
        testUtil.createTestConfig(
            'fixtures/builder_cache',
            {
                'device-file' : 'myDevice.class.nut',
                'agent-file' : 'myAgent.class.nut',
                'timeout': 40,
                'test-file' : 'tests/builder.agent.nut'
            }).
            then(() => util.runCommand('impt test run', (commandOut) => {
                expect(Shell.test('-e', '.builder-cache')).toBe(false);
                testUtil.checkTestSuccessStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('run test with builder-cache option in the project config', (done) => {
        testUtil.createTestConfig(
            'fixtures/builder_cache',
            {
                'device-file' : 'myDevice.class.nut',
                'agent-file' : 'myAgent.class.nut',
                'timeout' : 40,
                'test-file' : 'tests/builder.agent.nut',
                'builder-cache' : true
            }).
            then(() => util.runCommand('impt test run', (commandOut) => {
                expect(Shell.test('-e', '.builder-cache')).toBe(true);
                testUtil.checkTestSuccessStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('run test with --clear-cache and without builder-cache option in the project config', (done) => {
        expect(Shell.test('-e', '.builder-cache')).toBe(true);
        testUtil.createTestConfig(
            'fixtures/builder_cache',
            {
                'device-file' : 'myDevice.class.nut',
                'agent-file' : 'myAgent.class.nut',
                'timeout': 40,
                'test-file' : 'tests/builder.agent.nut',
                'builder-cache' : false
            }).
            then(() => util.runCommand('impt test run --clear-cache', (commandOut) => {
                expect(Shell.test('-e', '.builder-cache')).toBe(false);
                testUtil.checkTestSuccessStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });
});

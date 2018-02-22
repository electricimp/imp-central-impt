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
 * Test for error-before-start behavior
 */

'use strict';

require('jasmine-expect');

const util = require('../util');
const config = require('../config');
const testUtil = require('./testUtil');

describe('impt test run for error-before-start behavior >', () => {
    beforeAll((done) => {
        util.initAndLoginLocal().
            then(testUtil.cleanUpTestEnvironment).
            then(() => testUtil.createTestEnvironment('fixtures/error_before_start', {'device-file' : 'device.nut'})).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    afterAll((done) => {
        testUtil.cleanUpTestEnvironment().
            then(() => util.cleanUp()).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    beforeEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = util.TIMEOUT * (config.devices.length > 0 ? config.devices.length : 1);
    });

    it('run test', (done) => {
        util.runCommand('impt test run', (commandOut) => {
                expect(commandOut).not.toBeEmptyString();
                expect(commandOut).toMatch(/warning\] Device is out of memory\n/);
                expect(commandOut).toMatch(/error\] Session startup timeout\n/);
                expect(commandOut).not.toMatch(/test\] Device is out of memory\n/);
                testUtil.checkTestFailStatus(commandOut);
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });
});

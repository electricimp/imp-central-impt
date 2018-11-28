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

const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');

ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt test github tests (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare test environment for impt test github test
        function _testSuiteInit() {
            return ImptTestCommandsHelper.copyFiles('fixtures/github');
        }

        fdescribe(`test github positive tests >`, () => {
            it('create github config', (done) => {
                ImptTestHelper.runCommand(`impt test github -i github -u githubuser -w githubpassword ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileContainsString('github', '"githubUser": "githubuser"')).
                    then(() => ImptTestHelper.checkFileContainsString('github', '"githubToken": "githubpassword"')).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('update github config', (done) => {
                ImptTestHelper.runCommand(`impt test github -i github2 -u githubuser -w githubpassword -q ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileContainsString('github2', '"githubUser": "githubuser"')).
                    then(() => ImptTestHelper.checkFileContainsString('github2', '"githubToken": "githubpassword"')).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`test github negative tests >`, () => {

        });
    });
});

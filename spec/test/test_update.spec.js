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
const UserInterractor = require('../../lib/util/UserInteractor');

ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt test update tests (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(ImptTestCommandsHelper.cleanUpTestEnvironment).
                then(() => ImptTestCommandsHelper.saveDeviceInfo()).
                then(_testSuiteInit).
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

        // prepare test environment for impt test update test
        function _testSuiteInit() {
            return ImptTestCommandsHelper.createTestProductAndDG((commandOut) => {
                if (commandOut && commandOut.dgId) {
                    dg_id = commandOut.dgId;
                }
                else fail('TestSuiteInit error: Failed to get product and dg ids');
            }).
                then(() => ImptTestCommandsHelper.copyFiles('fixtures/create')).
                then(() => ImptTestHelper.runCommand(`impt test create --dg ${dg_id} -q`, ImptTestHelper.emptyCheck));
        }

        describe(`test update positive tests >`, () => {
            it('test update all attrs', (done) => {
                ImptTestHelper.runCommand(`impt test update -x devicecode.nut -y agentcode.nut -f testfile.nut -f testfile2.nut -i github.impt -j builder.impt  -t 20 -s -a -e ${outputMode}`, ImptTestHelper.checkSuccessStatus).
                    then(() => ImptTestCommandsHelper.checkTestInfo({
                        timeout: 20, stopOnFailure: true,
                        allowDisconnect: true, builderCashe: true,
                        deviceFile: 'devicecode.nut', agentFile: 'agentcode.nut',
                        githubConfig: 'github.impt', builderConfig: 'builder.impt',
                        testFiles: ["testfile.nut", "testfile2.nut"]
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test update remove attrs', (done) => {
                ImptTestHelper.runCommand(`impt test update -x -y -i -j ${outputMode}`, (commandOut) => {
                    expect(outputMode.output).not.toMatch('Device file');
                    expect(outputMode.output).not.toMatch('Agent file');
                    expect(outputMode.output).not.toMatch('Github config');
                    expect(outputMode.output).not.toMatch('Builder config');
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`test create negative tests >`, () => {
            it('test update to not exist dg', (done) => {
                ImptTestHelper.runCommand(`impt test update -g not-exist-dg ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-dg');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test update to not exist device file', (done) => {
                ImptTestHelper.runCommand(`impt test update -x not-exist-file ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, UserInterractor.MESSAGES.TEST_DEVICE_FILE, 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test update to not exist agent file', (done) => {
                ImptTestHelper.runCommand(`impt test update -y not-exist-file ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, UserInterractor.MESSAGES.TEST_AGENT_FILE, 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

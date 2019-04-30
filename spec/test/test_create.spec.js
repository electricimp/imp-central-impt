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
const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');
const MessageHelper = require('../MessageHelper');
const UserInterractor = require('../../lib/util/UserInteractor');

ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt test create tests (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        // prepare test environment for impt test create test
        function _testSuiteInit() {
            return ImptTestCommandsHelper.createTestProductAndDG((commandOut) => {
                if (commandOut && commandOut.dgId) {
                    dg_id = commandOut.dgId;
                }
                else fail('TestSuiteInit error: Failed to get product and dg ids');
            }).
                then(() => ImptTestHelper.checkDeviceStatus(config.devices[config.deviceidx])).
                then(() => ImptTestCommandsHelper.copyFiles('fixtures/create'));
        }

        describe(`test create positive tests >`, () => {
            it('test create by dg id', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg ${dg_id} -q ${outputMode}`, ImptTestHelper.checkSuccessStatus).
                    then(() => ImptTestCommandsHelper.checkTestInfo({ dgId: dg_id })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test create by dg name with options', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg ${ImptTestCommandsHelper.TEST_DG_NAME} -t 20 -s -a -e -q ${outputMode}`, ImptTestHelper.checkSuccessStatus).
                    then(() => ImptTestCommandsHelper.checkTestInfo({
                        dgName: ImptTestCommandsHelper.TEST_DG_NAME,
                        timeout: 20, stopOnFailure: true,
                        allowDisconnect: true, builderCashe: true
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test create by dg id with options', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg ${dg_id}  -x devicecode.nut -y agentcode.nut -f testfile.nut -f testfile2.nut -i github.impt -j builder.impt -q ${outputMode}`, ImptTestHelper.checkSuccessStatus).
                    then(() => ImptTestCommandsHelper.checkTestInfo({
                        dgId: dg_id,
                        deviceFile: 'devicecode.nut', agentFile: 'agentcode.nut',
                        githubConfig: 'github.impt', builderConfig: 'builder.impt',
                        testFiles: ["testfile.nut", "testfile2.nut"]
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`test create negative tests >`, () => {
            it('test create by not exist dg', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg not-exist-dg -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-dg');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test create whit not exist device file', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg ${ImptTestCommandsHelper.TEST_DG_NAME} -x not-exist-file -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, UserInterractor.MESSAGES.TEST_DEVICE_FILE, 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test create whit not exist agent file', (done) => {
                ImptTestHelper.runCommand(`impt test create --dg ${ImptTestCommandsHelper.TEST_DG_NAME} -y not-exist-file -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, UserInterractor.MESSAGES.TEST_AGENT_FILE, 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

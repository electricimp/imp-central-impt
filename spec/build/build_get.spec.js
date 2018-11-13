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
const Shell = require('shelljs');
const ImptTestHelper = require('../ImptTestHelper');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = `__impt_bld_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_bld_device_group${config.suffix}`;
const BUILD_TAG = `build_tag${config.suffix}`;
const BUILD2_TAG = `build2_tag${config.suffix}`;
const BUILD3_TAG = `build3_tag${config.suffix}`;
const BUILD4_TAG = `build4_tag${config.suffix}`;
const BUILD_ORIGIN = `build_origin${config.suffix}`;

// Test suite for 'impt build get' command.
// Runs 'impt build get' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build get test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let build_id = null;
        let build_sha = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for build get command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/agentcode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -s early_build`, ImptTestHelper.emptyCheckEx)).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -s build_descr -x devicecode.nut -y agentcode.nut -t ${BUILD_TAG} -o ${BUILD_ORIGIN} `, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    if (!build_id) fail("TestSuiteInit error: Failed to create build");
                    build_sha = ImptTestHelper.parseSha(commandOut);
                    if (!build_sha) fail("TestSuiteInit error: Failed to parse build sha");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // delete all entities using in impt build get test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'source files download successfuly' output message 
        function _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.BUILD_DOWNLOADED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        describe('build get positive tests >', () => {
            it('build get by build id', (done) => {
                ImptTestHelper.runCommand(`impt build get --build ${build_id} --device-file deviceread.nut --device-only --confirmed ${outputMode}`, (commandOut) => {
                    _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileEqual('deviceread.nut', 'devicecode.nut')).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            xit('build get by build sha', (done) => {
                ImptTestHelper.runCommand(`impt build get -b ${build_sha} --agent-file agentread.nut --agent-only -q ${outputMode}`, (commandOut) => {
                    _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, build_sha);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileEqual('agentread.nut', 'agentcode.nut')).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build get by build tag', (done) => {
                ImptTestHelper.runCommand(`impt build get -b ${BUILD_TAG} -x deviceread.nut -i -q ${outputMode}`, (commandOut) => {
                    _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, BUILD_TAG);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileEqual('deviceread.nut', 'devicecode.nut')).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build get by build origin', (done) => {
                ImptTestHelper.runCommand(`impt build get -b ${BUILD_ORIGIN}  -y agentread.nut -j -q ${outputMode}`, (commandOut) => {
                    _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, BUILD_ORIGIN);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.checkFileEqual('agentread.nut', 'agentcode.nut')).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build get by project', (done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME, 'deviceprj.nut', 'agentprj.nut').
                    then(() => ImptTestHelper.runCommand(`impt build get -q ${outputMode}`, (commandOut) => {
                        _checkSourceFilesDownloadedSuccessfulyMessage(commandOut, build_id);
                        // check get most recent deployment 
                        ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_DESCRIPTION, 'build_descr');
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(() => ImptTestHelper.checkFileEqual('deviceprj.nut', 'devicecode.nut')).
                    then(() => ImptTestHelper.checkFileEqual('agentprj.nut', 'agentcode.nut')).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);
        });

        describe('build get negative tests >', () => {
            it('build get by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt build get -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.BUILD);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build get without device and agent file', (done) => {
                ImptTestHelper.runCommand(`impt build get -b ${build_id} -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkOptionMustBeSpecifiedMessage(commandOut, 'device-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build get without agent file', (done) => {
                ImptTestHelper.runCommand(`impt build get -b ${build_id} -x deviceread.nut -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkOptionMustBeSpecifiedMessage(commandOut, 'agent-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);
        });
    });
});

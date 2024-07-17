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
const lodash = require('lodash');
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
const BUILD5_TAG = `build5_tag${config.suffix}`;
const BUILD_ORIGIN = `build_origin${config.suffix}`;

// Test suite for 'impt build update' command.
// Runs 'impt build update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
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

        // prepare environment for build update command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER));
        }

        // delete all entities using in impt build update test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheck);
        }

        function _testInit() {
            return ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                if (!dg_id) fail("TestInit error: Failed to create device group");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -x devicecode.nut -t ${BUILD_TAG}  -t ${BUILD2_TAG} -t ${BUILD3_TAG} -o ${BUILD_ORIGIN} `, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    if (!build_id) fail("TestInit error: Failed to create build");
                    build_sha = ImptTestHelper.parseSha(commandOut);
                    if (!build_id) fail("TestInit error: Failed to parse build sha");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt dg delete -g ${DEVICE_GROUP_NAME} -f -q`, ImptTestHelper.emptyCheck);
        }

        function _checkBuildInfo(expInfo = {}) {
            return ImptTestHelper.runCommand(`impt build info -b ${expInfo.id ? expInfo.id : build_id} -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Deployment).toBeDefined;
                expect(json.Deployment.id).toEqual(expInfo.id ? expInfo.id : build_id);
                if (expInfo.desc) expect(json.Deployment.description).toEqual(expInfo.desc);
                if (expInfo.flag) expect(json.Deployment.flagged).toEqual(expInfo.flag);
                expect(json.Deployment.sha).toEqual(expInfo.sha ? expInfo.sha : build_sha);
                if (expInfo.tag) {
                    if (Array.isArray(expInfo.tag)) {
                        expInfo.tag.forEach((item) => expect(json.Deployment.tags).toContain(item));
                    }
                    else expect(json.Deployment.tags).toContain(expInfo.tag);
                }
                if (expInfo.tag_cnt) expect(json.Deployment.tags.length).toEqual(expInfo.tag_cnt);
                expect(json.Deployment['Device Group'].id).toEqual(expInfo.dg_id ? expInfo.dg_id : dg_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        // check 'deployment successfully updated' output message 
        function _checkSuccessUpdateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        describe('build update positive tests >', () => {
            beforeEach((done) => {
                _testInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build update by id', (done) => {
                ImptTestHelper.runCommand(`impt build update --build ${build_id} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            xit('build update flagged by sha', (done) => {
                ImptTestHelper.runCommand(`impt build update -b ${build_sha} --flagged ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, build_sha);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ flag: true })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build update descr by tag', (done) => {
                ImptTestHelper.runCommand(`impt build update -b ${BUILD_TAG} --descr build_description ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, BUILD_TAG);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ descr: 'build_description' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build update tag by origin', (done) => {
                ImptTestHelper.runCommand(`impt build update -b ${BUILD_ORIGIN}  --tag ${BUILD4_TAG}  ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, BUILD_ORIGIN);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ tag: BUILD4_TAG })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build update remove tag by project', (done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                    then(() => ImptTestHelper.runCommand(`impt build update --remove-tag ${BUILD2_TAG} ${outputMode}`, (commandOut) => {
                        _checkSuccessUpdateDeploymentMessage(commandOut, build_id);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(() => _checkBuildInfo({ tag: [BUILD_TAG, BUILD3_TAG], tag_cnt: 2 })).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build update several tag', (done) => {
                ImptTestHelper.runCommand(`impt build update -b ${build_id} -t ${BUILD4_TAG}  -t ${BUILD5_TAG}  ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ tag: [BUILD4_TAG, BUILD5_TAG], tag_cnt: 5 })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build update remove several tag', (done) => {
                ImptTestHelper.runCommand(`impt build update -b ${build_id} -r ${BUILD_TAG} -r ${BUILD3_TAG} ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ tag: BUILD2_TAG, tag_cnt: 1 })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build update negative tests >', () => {
            beforeEach((done) => {
                _testInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build update by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt build update ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.BUILD);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

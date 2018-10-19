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

// Test suite for 'impt build deploy' command.
// Runs 'impt build deploy' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build deploy test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let build_id = null;

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

        // prepare environment for build deploy command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/agentcode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER));
        }

        // delete all entities using in impt build deploy test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'deployment successfully created' output message 
        function _checkSuccessCreateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        function _initProject() {
            return ImptTestHelper.runCommand(`impt project link -g ${DEVICE_GROUP_NAME} -x devicecode.nut -y agentcode.nut -q`, ImptTestHelper.emptyCheckEx);
        }

        function _checkBuildInfo(expInfo = {}) {
            return ImptTestHelper.runCommand(`impt build info -b ${expInfo.id ? expInfo.id : build_id} -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Deployment).toBeDefined;
                expect(json.Deployment.id).toEqual(expInfo.id ? expInfo.id : build_id);
                if (expInfo.descr) expect(json.Deployment.description).toEqual(expInfo.descr);
                if (expInfo.flag) expect(json.Deployment.flagged).toEqual(expInfo.flag);
                if (expInfo.tag) {
                    if (Array.isArray(expInfo.tag)) {
                        expInfo.tag.forEach((item) => expect(json.Deployment.tags).toContain(item));
                    }
                    else expect(json.Deployment.tags).toContain(expInfo.tag);
                }
                if (expInfo.tag_cnt) expect(json.Deployment.tags.length).toEqual(expInfo.tag_cnt);
                if (expInfo.origin) expect(json.Deployment.origin).toEqual(expInfo.origin);
                expect(json.Deployment['Device Group'].id).toEqual(expInfo.dg_id ? expInfo.dg_id : dg_id);
                expect(json.Deployment.device_code).toMatch(expInfo.dcode ? expInfo.dcode : '');
                expect(json.Deployment.agent_code).toMatch(expInfo.acode ? expInfo.acode : '');
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        describe('build deploy positive tests >', () => {
            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build deploy by dg id', (done) => {
                ImptTestHelper.runCommand(`impt build deploy --dg ${dg_id} -x devicecode.nut -y agentcode.nut --descr build_descr --tag build_tag --origin build_origin --flagged ${outputMode}`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({
                        descr: 'build_descr', flag: true, tag: 'build_tag', origin: 'build_origin',
                        dcode: 'server.log\\(\\"Device', acode: 'server.log\\(\\"Agent'
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build deploy by dg name', (done) => {
                ImptTestHelper.runCommand(`impt build deploy --dg ${DEVICE_GROUP_NAME} --tag build_tag --tag build_tag2 ${outputMode}`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({ descr: '', flag: false, origin: '', tag: ['build_tag', 'build_tag2'] })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build deploy by project', (done) => {
                _initProject().
                    then(() => ImptTestHelper.runCommand(`impt build deploy ${outputMode}`, (commandOut) => {
                        build_id = ImptTestHelper.parseId(commandOut);
                        _checkSuccessCreateDeploymentMessage(commandOut, build_id);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(() => _checkBuildInfo({
                        descr: '', flag: false, origin: '', tag: '',
                        dcode: 'server.log\\(\\"Device', acode: 'server.log\\(\\"Agent'
                    })).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build deploy negative tests >', () => {
            it('build deploy by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt build deploy`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build deploy by not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt build deploy -g not-exist-device-group`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build deploy with not exist device file', (done) => {
                ImptTestHelper.runCommand(`impt build deploy -g ${dg_id} -x not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'device', 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build deploy with not exist agent file', (done) => {
                ImptTestHelper.runCommand(`impt build deploy -g ${dg_id} -y not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'agent', 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

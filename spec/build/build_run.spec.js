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
const BUILD_ORIGIN = `build_origin${config.suffix}`;

// Test suite for 'impt build run' command.
// Runs 'impt build run' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build run test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let build_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.restoreDeviceInfo().
                then(() => ImptTestHelper.cleanUp()).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for build run command testing
        function _testSuiteInit() {
            return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
                then((dgInfo) => { dg_id = dgInfo.dgId; }).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/agentcode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER));
        }

        // delete all entities using in impt build run test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        // check 'deployment successfully created' output message 
        function _checkSuccessCreateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        // check 'deployment successfully run' output message 
        function _checkSuccessRunDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.BUILD_RUN}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        // check 'device successfully restarted' output message 
        function _checkSuccessDeviceRestartedMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`
                )
            );
        }

        // check 'device successfully conditional restarted' output message 
        function _checkSuccessDeviceCondRestartedMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_COND_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`
                )
            );
        }

        function _checkBuildInfo(expInfo = {}) {
            return ImptTestHelper.runCommand(`impt build info -b ${expInfo.build ? expInfo.build : build_id} -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Deployment).toBeDefined;
                if (expInfo.id) expect(json.Deployment.id).toEqual(expInfo.id ? expInfo.id : build_id);
                if (expInfo.descr) expect(json.Deployment.description).toEqual(expInfo.descr);
                if (expInfo.flagged) expect(json.Deployment.flagged).toEqual(expInfo.flagged);
                if (expInfo.tag) {
                    if (Array.isArray(expInfo.tag)) {
                        expInfo.tag.forEach((item) => expect(json.Deployment.tags).toContain(item));
                    }
                    else expect(json.Deployment.tags).toContain(expInfo.tag);
                }
                if (expInfo.tag_count) expect(json.Deployment.tags.length).toEqual(expInfo.tag_count);
                if (expInfo.origin) expect(json.Deployment.origin).toEqual(expInfo.origin);
                expect(json.Deployment['Device Group'].id).toEqual(expInfo.dg_id ? expInfo.dg_id : dg_id);
                expect(json.Deployment.device_code).toMatch(expInfo.device_code ? expInfo.device_code : '');
                expect(json.Deployment.agent_code).toMatch(expInfo.agent_code ? expInfo.agent_code : '');
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        describe('build run positive tests >', () => {
            beforeAll((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('build run by dg id', (done) => {
                ImptTestHelper.runCommand(`impt build run --dg ${dg_id} -x devicecode.nut -y agentcode.nut --descr build_descr --tag ${BUILD_TAG} --origin ${BUILD_ORIGIN}  --flagged ${outputMode}`, (commandOut) => {
                    _checkSuccessDeviceRestartedMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({
                        build: BUILD_TAG, descr: 'build_descr', flagged: true, tag: BUILD_TAG, origin: BUILD_ORIGIN,
                        device_code: 'server.log\\(\\"Device', agent_code: 'server.log\\(\\"Agent'
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by dg name', (done) => {
                ImptTestHelper.runCommand(`impt build run --dg ${DEVICE_GROUP_NAME} -t ${BUILD_TAG} -t ${BUILD2_TAG} --conditional ${outputMode}`, (commandOut) => {
                    _checkSuccessDeviceCondRestartedMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkBuildInfo({
                        build: BUILD2_TAG, descr: '', flagged: false, tag: [BUILD_TAG, BUILD2_TAG], origin: '',
                        device_code: '', agent_code: ''
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by project', (done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME, 'devicecode.nut', 'agentcode.nut').
                    then(() => ImptTestHelper.runCommand(`impt build run -t ${BUILD3_TAG} ${outputMode}`, (commandOut) => {
                        build_id = ImptTestHelper.parseId(commandOut);
                        _checkSuccessDeviceRestartedMessage(commandOut, dg_id);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(() => _checkBuildInfo({
                        build: BUILD3_TAG, descr: '', flag: false, origin: '', tag: BUILD3_TAG,
                        dcode: 'server.log\\(\\"Device', acode: 'server.log\\(\\"Agent'
                    })).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build run negative tests >', () => {
            it('build run by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt build deploy`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt build run -g not-exist-device-group`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run with not exist device file', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -x not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'device', 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run with not exist agent file', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -y not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'agent', 'not-exist-file');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without dg value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'g');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without device file value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -x`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'x');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without agent file value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -y`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'y');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without description value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -s`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without tag value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -t`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 't');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without origin value', (done) => {
                ImptTestHelper.runCommand(`impt build run -g ${DEVICE_GROUP_NAME} -o`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'o');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

        });
    });
});

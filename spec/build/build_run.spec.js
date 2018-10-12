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

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt build run' command.
// Runs 'impt build run' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt build run test suite >', () => {
        let dg_id = null;
        let build_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for build run command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/agentcode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER));
        }

        // delete all entities using in impt build run test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'deployment successfully created' output message 
        function _checkSuccessCreateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        // check 'deployment successfully run' output message 
        function _checkSuccessRunDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.BUILD_RUN}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        // check 'device successfully restarted' output message 
        function _checkSuccessDeviceRestartedMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`
                )
            );
        }

        // check 'device successfully conditional restarted' output message 
        function _checkSuccessDeviceCondRestartedMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_COND_RESTARTED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`
                )
            );
        }

        function _checkBuildInfo(expInfo = {}) {
            return ImptTestHelper.runCommandEx(`impt build info -b ${expInfo.build ? expInfo.build : build_id} -z json`, (commandOut) => {
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
                ImptTestHelper.checkSuccessStatusEx(commandOut);
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
                ImptTestHelper.runCommandEx(`impt build run --dg ${dg_id} -x devicecode.nut -y agentcode.nut --descr build_descr --tag build_tag --origin build_origin --flagged ${outputMode}`, (commandOut) => {
                    _checkSuccessDeviceRestartedMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkBuildInfo({
                        build: 'build_tag', descr: 'build_descr', flagged: true, tag: 'build_tag', origin: 'build_origin',
                        device_code: 'server.log\\(\\"Device', agent_code: 'server.log\\(\\"Agent'
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by dg name', (done) => {
                ImptTestHelper.runCommandEx(`impt build run --dg ${DEVICE_GROUP_NAME} -t build_tag -t build_tag2 --conditional ${outputMode}`, (commandOut) => {
                    _checkSuccessDeviceCondRestartedMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkBuildInfo({
                        build: 'build_tag2', descr: '', flagged: false, tag: ['build_tag', 'build_tag2'], origin: '',
                        device_code: '', agent_code: ''
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by project', (done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME, 'devicecode.nut', 'agentcode.nut').
                    then(() => ImptTestHelper.runCommandEx(`impt build run -t build_tag3 ${outputMode}`, (commandOut) => {
                        build_id = ImptTestHelper.parseId(commandOut);
                        _checkSuccessDeviceRestartedMessage(commandOut, dg_id);
                        ImptTestHelper.checkSuccessStatusEx(commandOut);
                    })).
                    then(() => _checkBuildInfo({
                        build: 'build_tag3', descr: '', flag: false, origin: '', tag: 'build_tag3',
                        dcode: 'server.log\\(\\"Device', acode: 'server.log\\(\\"Agent'
                    })).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build run negative tests >', () => {
            it('build run by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt build deploy`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run by not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g not-exist-device-group`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run with not exist device file', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -x not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'device', 'not-exist-file');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run with not exist agent file', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -y not-exist-file`, (commandOut) => {
                    MessageHelper.checkBuildDeployFileNotFoundMessage(commandOut, 'agent', 'not-exist-file');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without dg value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'g');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without device file value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -x`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'x');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without agent file value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -y`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'y');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without description value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -s`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without tag value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -t`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 't');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build run without origin value', (done) => {
                ImptTestHelper.runCommandEx(`impt build run -g ${DEVICE_GROUP_NAME} -o`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'o');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

        });
    });
});

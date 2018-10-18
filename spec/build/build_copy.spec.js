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

const PRODUCT_NAME = '__impt_bld_product';
const PRODUCT2_NAME = '__impt_bld_product_2';
const DEVICE_GROUP_NAME = '__impt_bld_device_group';
const DEVICE_GROUP2_NAME = '__impt_bld_device_group_2';



// Test suite for 'impt build copy' command.
// Runs 'impt build copy' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt build copy test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let build_id = null;
        let build_sha = null;
        let new_build_id = null;

        // custom matcher for search flagged and  not flagged deployments
        let customMatcher = {
            toContainsDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === undefined);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array not contains deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            },
            toContainsFlaggedDeployment: function () {
                return {
                    compare: function (DeploymentArray, expected) {
                        let result = { pass: false };
                        lodash.map(DeploymentArray, function (Item) {
                            result.pass = result.pass || (Item.Deployment.id === expected && Item.Deployment.flagged === true);
                        });
                        if (result.pass) {
                            result.message = "Deployment array contains flagged deployment \"" + expected + "\"";
                        } else {
                            result.message = "Deployment array not contains flagged deployment \"" + expected + "\"";
                        }
                        return result;
                    }
                };
            }
        };

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(() => jasmine.addMatchers(customMatcher)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare environment for build copy command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
                then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME} -x devicecode.nut -t build_tag -o build_origin`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    if (!build_id) fail("TestSuiteInit error: Fail create build");
                    build_sha = ImptTestHelper.parseSha(commandOut);
                    if (!build_sha) fail("TestSuiteInit error: Fail parse build sha");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // delete all entities using in impt build copy test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT2_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx));
        }

        function _testInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT2_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP2_NAME} -p ${PRODUCT2_NAME}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT2_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);

        }

        // check 'deployment successfully copied' output message 
        function _checkSuccessCopyDeploymentMessage(commandOut, fromdeploy, todeploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.BUILD_COPIED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${fromdeploy}"`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${todeploy}"`
                )
            );
        }

        // check 'deployment successfully created' output message 
        function _checkSuccessCreateDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`
                )
            );
        }

        // parse deployment id from output message 
        function _parseBuildId(commandOut) {
            const idMatcher = commandOut.output.match(new RegExp(`"([A-Za-z0-9-]+)`));
            if (idMatcher && idMatcher.length > 1) {
                return idMatcher[1];
            }
            else return null;
        }

        describe('build copy positive tests >', () => {
            beforeAll((done) => {
                ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                ImptTestHelper.projectDelete().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

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

            it('build copy by id', (done) => {
                ImptTestHelper.runCommand(`impt build copy --build ${build_id} --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    //parse build id of created deployment
                    new_build_id = _parseBuildId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, new_build_id);
                    _checkSuccessCopyDeploymentMessage(commandOut, build_id, new_build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg builds -g ${DEVICE_GROUP2_NAME} -z json`, (commandOut) => {
                        ImptTestHelper.checkAttribute(commandOut, 'sha', build_sha);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build copy by sha', (done) => {
                ImptTestHelper.runCommand(`impt build copy --build ${build_sha} --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    new_build_id = _parseBuildId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, new_build_id);
                    _checkSuccessCopyDeploymentMessage(commandOut, build_sha, new_build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg builds -g ${DEVICE_GROUP2_NAME} -z json`, (commandOut) => {
                        ImptTestHelper.checkAttribute(commandOut, 'sha', build_sha);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build copy by tag', (done) => {
                ImptTestHelper.runCommand(`impt build copy --build build_tag --dg ${dg_id} --all ${outputMode}`, (commandOut) => {
                    new_build_id = _parseBuildId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, new_build_id);
                    _checkSuccessCopyDeploymentMessage(commandOut, 'build_tag', new_build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg builds -g ${DEVICE_GROUP2_NAME} -z json`, (commandOut) => {
                        ImptTestHelper.checkAttribute(commandOut, 'sha', build_sha);
                        expect(commandOut.output).toMatch('build_tag');
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build copy by origin', (done) => {
                ImptTestHelper.runCommand(`impt build copy --build build_origin --dg ${dg_id} --all ${outputMode}`, (commandOut) => {
                    new_build_id = _parseBuildId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, new_build_id);
                    _checkSuccessCopyDeploymentMessage(commandOut, 'build_origin', new_build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg builds -g ${DEVICE_GROUP2_NAME} -z json`, (commandOut) => {
                        ImptTestHelper.checkAttribute(commandOut, 'sha', build_sha);
                        ImptTestHelper.checkAttribute(commandOut, 'origin', 'build_origin');
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build copy by project', (done) => {
                ImptTestHelper.runCommand(`impt build copy --dg ${dg_id} ${outputMode}`, (commandOut) => {
                    new_build_id = _parseBuildId(commandOut);
                    _checkSuccessCreateDeploymentMessage(commandOut, new_build_id);
                    _checkSuccessCopyDeploymentMessage(commandOut, build_id, new_build_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg builds -g ${DEVICE_GROUP2_NAME} -z json`, (commandOut) => {
                        ImptTestHelper.checkAttribute(commandOut, 'sha', build_sha);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build copy to not exist device group', (done) => {
                ImptTestHelper.runCommand(`impt build copy -b ${build_id} -g not-exist-device-group ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('build copy negative tests >', () => {
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

            it('build copy by not exist project', (done) => {
                ImptTestHelper.runCommand(`impt build copy -g ${dg_id} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Deployment');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

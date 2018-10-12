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
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const Shell = require('shelljs');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';

// Test suite for 'impt dg builds' command.
// Runs 'impt dg builds' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group builds test suite >', () => {
        let build_id = null;
        let build_sha = null;
        let build3_id = null;
        let dg_id = null;

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

        // prepare environment for build delete command testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER));

        }

        // delete all entities using in impt build delete test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut)
            }).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME} -t build_tag -o build_origin  -x devicecode.nut`, (commandOut) => {
                    build_id = ImptTestHelper.parseId(commandOut);
                    build_sha = ImptTestHelper.parseSha(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME}`, (commandOut) => {
                    build3_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt dg update -g ${DEVICE_GROUP_NAME} -m ${build3_id}`, ImptTestHelper.emptyCheckEx));
        }

        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt dg delete -g ${DEVICE_GROUP_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'deployment successfully deleted' output message 
        function _checkSuccessDeleteDeploymentMessage(commandOut, deploy) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${deploy}"`)
            );
        }

        describe('build delete positive tests >', () => {
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

            it('build delete by id', (done) => {
                ImptTestHelper.runCommandEx(`impt build delete --build ${build_id} --confirmed ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build delete by sha', (done) => {
                ImptTestHelper.runCommandEx(`impt build delete -b ${build_sha} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, build_sha);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build delete by tag', (done) => {
                ImptTestHelper.runCommandEx(`impt build delete -b build_tag -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, 'build_tag');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('build delete by origin', (done) => {
                ImptTestHelper.runCommandEx(`impt build delete -b build_origin -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeploymentMessage(commandOut, 'build_origin');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt build info -b ${build_id}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('min supported build delete', (done) => {
                ImptTestHelper.runCommandEx(`impt build delete -b  ${build3_id}  -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDeleteMinSupportedDeploymentMessage(commandOut, build3_id, dg_id);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('flagged build delete tests >', () => {
                beforeEach((done) => {
                    _flaggedBuild().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                function _flaggedBuild() {
                    return ImptTestHelper.runCommandEx(`impt build update -b ${build_id} -f ${outputMode}`, ImptTestHelper.checkEmptyEx);
                }

                it('flagged build delete', (done) => {
                    ImptTestHelper.runCommandEx(`impt build delete -b  ${build_id} -q ${outputMode}`, (commandOut) => {
                        MessageHelper.checkDeleteFlaggedDeploymentMessage(commandOut);
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('flagged build force delete', (done) => {
                    ImptTestHelper.runCommandEx(`impt build delete -b  ${build_id} --force -q ${outputMode}`, (commandOut) => {
                        _checkSuccessDeleteDeploymentMessage(commandOut, build_id);
                        ImptTestHelper.checkFailStatusEx(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });

        });


    });
});

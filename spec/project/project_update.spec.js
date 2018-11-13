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
const MessageHelper = require('../MessageHelper');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const Shell = require('shelljs');
const ProjectHelper = require('./ImptProjectTestHelper');

const PRODUCT_NAME = `__impt_prj_product${config.suffix}`;
const DG_NAME = `__impt_prj_device_group${config.suffix}`;
const DG_DESCR = 'impt temp dg description';

const DG_NEW_NAME = `__impt_prj_new_dg${config.suffix}`;
const DG_NEW_DESCR = 'impt new dg description';

// Test suite for 'impt project update command.
// Runs 'impt project update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    if (outputMode === '-z debug') return;
    describe(`impt project update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let dg_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare test environment for impt project update test
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Failed to create product");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt dg create --name ${DG_NAME} --descr "${DG_DESCR}" --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Failed to create device group");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt project link --dg ${DG_NAME} ${outputMode}`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // prepare test environment for impt project update test
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -q`, (commandOut) => ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommand(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
        }

        // check 'project successfully updated' output message 
        function _checkSuccessUpdateProjectMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`, 'Project')
            );
        }

        describe('project exist preconditions >', () => {
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

            it('project update', (done) => {
                ImptTestHelper.runCommand(`impt project update --name ${DG_NEW_NAME} --descr "${DG_NEW_DESCR}" --device-file dfile.nut --agent-file afile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ProjectHelper.checkProjectInfo({
                        product_id: product_id, dg_id: dg_id,
                        dg_name: DG_NEW_NAME, dg_descr: DG_NEW_DESCR,
                        dfile: 'dfile.nut', afile: 'afile.nut'
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project not exist preconditions >', () => {
            beforeAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('project update without project file', (done) => {
                ImptTestHelper.runCommand(`impt project update -n ${DG_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkProjectNotFoundMessage(commandOut);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('project not exist preconditions with restore >', () => {
                afterEach((done) => {
                    _testSuiteCleanUp().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('project update with not exist device group', (done) => {
                    Shell.cp('-Rf', `${__dirname}/fixtures/.impt.project`, ImptTestHelper.TESTS_EXECUTION_FOLDER);
                    ImptTestHelper.runCommand(`impt project update -n ${DG_NEW_NAME} ${outputMode}`, (commandOut) => {
                        MessageHelper.checkProjectDeviceGroupNotExistMessage(commandOut, 'not-exist-device-group')
                        ImptTestHelper.checkFailStatus(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });
    });
});

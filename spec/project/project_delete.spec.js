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
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const Shell = require('shelljs');
const ProjectHelper = require('./ImptProjectTestHelper');

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_dg';

const DG_DESCR = 'impt temp dg description';

// Test suite for 'impt project delete command.
// Runs 'impt project delete' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt project delete test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
               then(() => ImptTestHelper.runCommandEx(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
        }

        // check successfuly deleted project output message 
        function _checkSuccessDeletedProjectMessage(commandOut) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`, 'Project'));
        }

        // check project not found output message 
        function _checkProjectNotExistMessage(commandOut) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG}`, 'Project'));
        }

        describe('project exist preconditions >', () => {
            beforeEach((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            function _testSuiteInit() {
                return ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --create-product --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode}`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                });
            }

            it('delete project', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeletedProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => {
                        ImptTestHelper.checkFileNotExist('.impt.project');
                        // check if device and agent files not deleted
                        ProjectHelper.checkDeviceAgentFilesExists();
                    }).
                    // check if product and device group is not deleted
                    then(ProjectHelper.checkProjectsEntitiesExists).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete project with entities', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete --entities -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeletedProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => {
                        ImptTestHelper.checkFileNotExist('.impt.project');
                        ProjectHelper.checkDeviceAgentFilesExists();
                    }).
                    then(ProjectHelper.checkProjectsEntitiesNotExists).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete project with files', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete --files -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeletedProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => {
                        ImptTestHelper.checkFileNotExist('.impt.project');
                        ProjectHelper.checkDeviceAgentFilesNotExists();
                    }).
                    then(ProjectHelper.checkProjectsEntitiesExists).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete project with entities and files', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete --entities --files -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeletedProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => {
                        ImptTestHelper.checkFileNotExist('.impt.project');
                        ProjectHelper.checkDeviceAgentFilesNotExists();
                    }).
                    then(ProjectHelper.checkProjectsEntitiesNotExists).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete project with all', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete --all -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeletedProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => {
                        ImptTestHelper.checkFileNotExist('.impt.project');
                        ProjectHelper.checkDeviceAgentFilesNotExists();
                    }).
                    then(ProjectHelper.checkProjectsEntitiesNotExists).
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

            it('delete not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt project delete -q ${outputMode}`, (commandOut) => {
                    _checkProjectNotExistMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

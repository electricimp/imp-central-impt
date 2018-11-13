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
const ProjectHelper = require('./ImptProjectTestHelper');

const PRODUCT_NAME = `__impt_prj_product${config.suffix}`;
const DG_NAME = `__impt_prj_device_group${config.suffix}`;
const DG_DESCR = 'impt temp dg description';

// Test suite for 'impt project create command.
// Runs 'impt project create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt project create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;

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

        // delete all entities using in impt project create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt project delete --all --confirmed`, ImptTestHelper.emptyCheckEx));
        }
        
        // prepare test environment for impt project create test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Failed to create product");
                ImptTestHelper.emptyCheck(commandOut);
            });
        }

        // check successfuly created product output message 
        function _checkSuccessCreateProductMessage(commandOut, productName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_PRODUCT} "${productName}"`)
            );
        }
        // check successfuly created device group output message 
        function _checkSuccessCreateDeviceGroupMessage(commandOut, deviceGroupName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${deviceGroupName}"`)
            );
        }

        // check successfuly created device source file output message 
        function _checkSuccessCreateDeviceSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${UserInterractor.MESSAGES.PROJECT_DEVICE_SOURCE_FILE} "${fileName}"`)
            );
        }

        // check successfuly created agent source file output message 
        function _checkSuccessCreateAgentSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${UserInterractor.MESSAGES.PROJECT_AGENT_SOURCE_FILE} "${fileName}"`)
            );
        }

        // check 'project successfully created' output message 
        function _checkSuccessCreateProjectMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, 'Project')
            );
        }

        describe('exist product preconditions', () => {
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

            it('project create by product id', (done) => {
                ImptTestHelper.runCommand(`impt project create --product ${product_id} --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, ProjectHelper.DEVICE_FILE);
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, ProjectHelper.AGENT_FILE);
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist(ProjectHelper.DEVICE_FILE);
                    ImptTestHelper.checkFileExist(ProjectHelper.AGENT_FILE);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ProjectHelper.checkProjectInfo({ product_id: product_id })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create by product name with device file', (done) => {
                ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --name ${DG_NAME} --descr "${DG_DESCR}" --device-file dfile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'dfile.nut');
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, ProjectHelper.AGENT_FILE);
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist('dfile.nut');
                    ImptTestHelper.checkFileExist(ProjectHelper.AGENT_FILE);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ProjectHelper.checkProjectInfo({ product_id: product_id, dfile: 'dfile.nut' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create by product name with agent file', (done) => {
                ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --name ${DG_NAME} --descr "${DG_DESCR}" --agent-file afile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, ProjectHelper.DEVICE_FILE);
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, 'afile.nut');
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist(ProjectHelper.DEVICE_FILE);
                    ImptTestHelper.checkFileExist('afile.nut');
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ProjectHelper.checkProjectInfo({ product_id: product_id, afile: 'afile.nut' })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create without product value', (done) => {
                ImptTestHelper.runCommand(`impt project create ${outputMode} --product`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'product');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

        });

        describe('No exist product precondition >', () => {
            it('project create with not existing product', (done) => {
                ImptTestHelper.runCommand(`impt project create --product not-exist-product --name ${DG_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, 'not-exist-product');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('No exist product precondition with restore >', () => {
                afterEach((done) => {
                    _testSuiteCleanUp().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('project create with product creating', (done) => {
                    ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --create-product --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode}`, (commandOut) => {
                        _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                        _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                        _checkSuccessCreateDeviceSourceFileMessage(commandOut, ProjectHelper.DEVICE_FILE);
                        _checkSuccessCreateAgentSourceFileMessage(commandOut, ProjectHelper.AGENT_FILE);
                        _checkSuccessCreateProjectMessage(commandOut);
                        ImptTestHelper.checkFileExist(ProjectHelper.DEVICE_FILE);
                        ImptTestHelper.checkFileExist(ProjectHelper.AGENT_FILE);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }).
                        then(ProjectHelper.checkProjectInfo).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });
    });
});

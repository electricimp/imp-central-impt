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

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_dg';

const DG_DESCR = 'impt temp dg description';

// Test suite for 'impt project create command.
// Runs 'impt project create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt project create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let dg_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                // then(_testSuiteCleanUp).
                //  then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            //   _testSuiteCleanUp().
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
            then(()=>ImptTestHelper.runCommandEx(`impt project delete --all --confirmed`, ImptTestHelper.emptyCheckEx));
        }

        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // check successfuly created product output message 
        function _checkSuccessCreateProductMessage(commandOut, productName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${Identifier.ENTITY_TYPE.TYPE_PRODUCT}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${productName}"`)
            );
        }
        // check successfuly created device group output message 
        function _checkSuccessCreateDeviceGroupMessage(commandOut, deviceGroupName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${deviceGroupName}"`)
            );
        }

        // check successfuly created device source file output message 
        function _checkSuccessCreateDeviceSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${UserInterractor.MESSAGES.PROJECT_DEVICE_SOURCE_FILE}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${fileName}"`)
            );
        }

        // check successfuly created agent source file output message 
        function _checkSuccessCreateAgentSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${UserInterractor.MESSAGES.PROJECT_AGENT_SOURCE_FILE}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${fileName}"`)
            );
        }

        // check 'project successfully created' output message 
        function _checkSuccessCreateProjectMessage(commandOut) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `Project` + Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, '')
            );
        }

        // check command`s result by exec project info command
        function _checkProjectInfo(expectInfo) {
            return ImptTestHelper.runCommandEx(`impt project info -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Project).toBeDefined;
                expect(json.Project['Device file']).toBe(expectInfo && expectInfo.dfile ? expectInfo.dfile : 'device.nut');
                expect(json.Project['Agent file']).toBe(expectInfo && expectInfo.afile ? expectInfo.afile : 'agent.nut');
                //   expect(json.Project['Device Group'].id).toBe(expectInfo && expectInfo.dg_id ? expectInfo.dg_id : dg_id);
                expect(json.Project['Device Group'].type).toBe('development');
                expect(json.Project['Device Group'].name).toBe(expectInfo && expectInfo.dg_name ? expectInfo.dg_name : DG_NAME);
                expect(json.Project['Device Group'].description).toBe(expectInfo && expectInfo.dg_descr ? expectInfo.dg_descr : DG_DESCR);
                expect(json.Project['Device Group'].Product.id).toBe(expectInfo && expectInfo.product_id ? expectInfo.product_id : product_id);
                expect(json.Project['Device Group'].Product.name).toBe(expectInfo && expectInfo.product_name ? expectInfo.product_name : PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        describe('project create tests without existing product', () => {
            beforeAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('project create with product creating', (done) => {
                ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --create-product --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'device.nut');
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, 'agent.nut');
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist('device.nut');
                    ImptTestHelper.checkFileExist('agent.nut');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(_checkProjectInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create with not existing product', (done) => {
                ImptTestHelper.runCommandEx(`impt project create --product not-exist-product --name ${DG_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, 'not-exist-product');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project create tests with existing product', () => {
            beforeEach((done) => {
                _testSuiteCleanUp().
                    then(_testSuiteInit).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('project create by product id', (done) => {
                ImptTestHelper.runCommandEx(`impt project create --product ${product_id} --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'device.nut');
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, 'agent.nut');
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist('device.nut');
                    ImptTestHelper.checkFileExist('agent.nut');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(_checkProjectInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create by product name with device file', (done) => {
                ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --name ${DG_NAME} --descr "${DG_DESCR}" --device-file dfile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'dfile.nut');
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, 'agent.nut');
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist('dfile.nut');
                    ImptTestHelper.checkFileExist('agent.nut');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then( _checkProjectInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create by product name with agent file', (done) => {
                ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --name ${DG_NAME} --descr "${DG_DESCR}" --agent-file afile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                    _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'device.nut');
                    _checkSuccessCreateAgentSourceFileMessage(commandOut, 'afile.nut');
                    _checkSuccessCreateProjectMessage(commandOut);
                    ImptTestHelper.checkFileExist('device.nut');
                    ImptTestHelper.checkFileExist('afile.nut');
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(_checkProjectInfo).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project create without product value', (done) => {
                ImptTestHelper.runCommandEx(`impt project create ${outputMode} --product`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'product');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

        });

    });
});

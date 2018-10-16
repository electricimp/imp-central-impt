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

const PRODUCT_NAME = '__impt_prj_product';
const DG_NAME = '__impt_prj_device_group';
const DG_DESCR = 'impt temp dg description';

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt project link command.
// Runs 'impt project link' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt project link test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let dg_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterEach((done) => {
            _testSuiteCleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare test environment for impt project link test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheckEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME} --descr "${DG_DESCR}" --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

         // delete all entities using in impt project link test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt project delete --files --confirmed`, (commandOut) => {
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // check successfuly created device source file output message 
        function _checkSuccessCreateDeviceSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${UserInterractor.MESSAGES.PROJECT_DEVICE_SOURCE_FILE} "${fileName}"`)
            );
        }

        // check successfuly created agent source file output message 
        function _checkSuccessCreateAgentSourceFileMessage(commandOut, fileName) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${UserInterractor.MESSAGES.PROJECT_AGENT_SOURCE_FILE} "${fileName}"`)
            );
        }

        // check 'project successfully linkeded' output message 
        function _checkSuccessLinkedProjectMessage(commandOut) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${UserInterractor.MESSAGES.PROJECT_LINKED}`
            );
        }

        it('project link to dg by id', (done) => {
            ImptTestHelper.runCommandEx(`impt project link --dg ${dg_id} --device-file dfile.nut ${outputMode}`, (commandOut) => {
                _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'dfile.nut');
                _checkSuccessCreateAgentSourceFileMessage(commandOut, 'agent.nut');
                _checkSuccessLinkedProjectMessage(commandOut);
                ImptTestHelper.checkFileExist('dfile.nut');
                ImptTestHelper.checkFileExist('agent.nut');
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ProjectHelper.checkProjectInfo({ product_id: product_id, dg_id: dg_id, dfile: 'dfile.nut' })).
                then(done).
                catch(error => done.fail(error));
        });

        it('project link to dg by name', (done) => {
            ImptTestHelper.runCommandEx(`impt project link --dg ${DG_NAME} --agent-file afile.nut ${outputMode}`, (commandOut) => {
                _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'device.nut');
                _checkSuccessCreateAgentSourceFileMessage(commandOut, 'afile.nut');
                _checkSuccessLinkedProjectMessage(commandOut);
                ImptTestHelper.checkFileExist('device.nut');
                ImptTestHelper.checkFileExist('afile.nut');
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => ProjectHelper.checkProjectInfo({ product_id: product_id, dg_id: dg_id, afile: 'afile.nut' })).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

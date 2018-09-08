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

        afterEach((done) => {
            _testSuiteCleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt project delete --all --confirmed`, ImptTestHelper.emptyCheckEx);
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

        it('project create by product id', (done) => {
            ImptTestHelper.runCommandEx(`impt project create --product ${product_id} --name ${DG_NAME} --descr "${DG_DESCR}" ${outputMode} -z json`, (commandOut) => {
                _checkSuccessCreateDeviceGroupMessage(commandOut, DG_NAME);
                _checkSuccessCreateDeviceSourceFileMessage(commandOut, 'device.nut');
                _checkSuccessCreateAgentSourceFileMessage(commandOut, 'agent.nut');
                _checkSuccessCreateProjectMessage(commandOut);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                then(done).
                catch(error => done.fail(error));
        });


    });
});

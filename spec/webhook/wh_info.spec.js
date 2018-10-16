// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the Software), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND,
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

const PRODUCT_NAME = '__impt_wh_product';
const DG_NAME = '__impt_wh_device_group';
const WH_URL = 'http://example.com/wi/';

// Test suite for 'impt webhook info command.
// Runs 'impt webhook info' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt webhook info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let wh_id = null;

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

        // delete all entities using in impt webhook info test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt webhook delete --wh ${wh_id} -q`, ImptTestHelper.emptyCheckEx));
        }

        // prepare test environment for impt webhook info test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheckEx(commandOut);
                })).
                then(() => ImptTestHelper.runCommandEx(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json `, (commandOut) => {
                    wh_id = ImptTestHelper.parseId(commandOut);
                    if (!wh_id) fail("TestSuitInit error: Fail create webhook");
                ImptTestHelper.emptyCheckEx(commandOut);
                }));
        }

        it('webhook info', (done) => {
            ImptTestHelper.runCommandEx(`impt webhook info --wh ${wh_id} -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Webhook.id).toBe(wh_id);
                expect(json.Webhook.url).toBe(WH_URL);
                expect(json.Webhook.event).toBe('deployment');
                expect(json.Webhook.content_type).toBe('json');
                expect(json.Webhook['Device Group'].id).toBe(dg_id);
                expect(json.Webhook['Device Group'].name).toBe(DG_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist webhook info', (done) => {
            ImptTestHelper.runCommandEx(`impt webhook info --wh not-exist-webhook`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_WEBHOOK, 'not-exist-webhook');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

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
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const PRODUCT_NAME = `__impt_wh_product${config.suffix}`;
const DG_NAME = `__impt_wh_device_group${config.suffix}`;
const DG_NAME_2 = `__impt_wh_device_group_2${config.suffix}`;
const WH_URL = `http://example.com/wc/${config.suffix}`;

// Test suite for 'impt webhook create' command.
// Runs 'impt webhook create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    // skip debug outputmode
    if (outputMode == '-z debug') return;
    describe(`impt webhook create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        afterEach((done) => {
            ImptTestHelper.runCommand(`impt webhook delete --wh ${wh_id} -q`, ImptTestHelper.emptyCheckEx).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // delete all entities using in impt webhook create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg delete --dg ${DG_NAME_2} -f `, ImptTestHelper.emptyCheckEx));
        }

        // prepare test environment for impt webhook create test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                    dg_id = ImptTestHelper.parseId(commandOut);
                    if (!dg_id) fail("TestSuitInit error: Fail create device group");
                    ImptTestHelper.emptyCheck(commandOut);
                })).
                then(() => ImptTestHelper.runCommand(`impt project link --dg ${DG_NAME} -q`, (commandOut) => {
                    ImptTestHelper.emptyCheck(commandOut);
                }));
        }

        // check 'webhook successfuly created' output message 
        function _checkSuccessCreateWebhookMessage(commandOut, webhook) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_WEBHOOK} "${webhook}"`)
            );
        }


        // check command`s result by exec webhook info command
        function _checkWebhookInfo(expectInfo = {}) {
            return ImptTestHelper.runCommand(`impt webhook info --wh ${expectInfo.id ? expectInfo.id : wh_id} -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json.Webhook).toBeDefined;
                expect(json.Webhook.id).toBe(expectInfo.id ? expectInfo.id : wh_id);
                expect(json.Webhook.url).toBe(expectInfo.url ? expectInfo.url : WH_URL);
                expect(json.Webhook.event).toBe(expectInfo.deployment ? expectInfo.deployment : 'deployment');
                expect(json.Webhook.content_type).toBe(expectInfo.mime ? expectInfo.mime : 'json');
                expect(json.Webhook['Device Group'].id).toBe(expectInfo.dg_id ? expectInfo.dg_id : dg_id);
                expect(json.Webhook['Device Group'].name).toBe(expectInfo.dg_name ? expectInfo.dg_name : DG_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        it('webhook create by dg id', (done) => {
            ImptTestHelper.runCommand(`impt webhook create --dg ${dg_id} --url ${WH_URL} --event deployment --mime json ${outputMode}`, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                _checkSuccessCreateWebhookMessage(commandOut, wh_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(_checkWebhookInfo).
                then(done).
                catch(error => done.fail(error));
        });

        it('webhook create by dg name', (done) => {
            ImptTestHelper.runCommand(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json ${outputMode}`, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                _checkSuccessCreateWebhookMessage(commandOut, wh_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(_checkWebhookInfo).
                then(done).
                catch(error => done.fail(error));
        });

        it('webhook create by project', (done) => {
            ImptTestHelper.runCommand(`impt webhook create --url ${WH_URL} --event deployment --mime urlencoded ${outputMode}`, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                _checkSuccessCreateWebhookMessage(commandOut, wh_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => {
                    _checkWebhookInfo({ mime: 'urlencoded' });
                }).
                then(done).
                catch(error => done.fail(error));
        });

        it('webhook create with invalid url', (done) => {
            ImptTestHelper.runCommand(`impt webhook create --url invalidurl --event deployment --mime urlencoded ${outputMode}`, (commandOut) => {
                MessageHelper.checkInvalidUrlError(commandOut);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('webhook create with not exist dg', (done) => {
            ImptTestHelper.runCommand(`impt webhook create --dg ${DG_NAME_2} --url ${WH_URL} --event deployment --mime json ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, DG_NAME_2);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

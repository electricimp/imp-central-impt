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

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_device_group';
const DG_NAME_2 = '__impt_device_group_2';
const WH_URL = 'http://example.com/wu/';
const WH_URL_2 = 'http://example.com/wu2/';

describe('impt webhook update test suite >', () => {

    const outputMode = '';

    let dg_id = null;
    let wh_id = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(testSuiteCleanUp).
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // delete all entities using in impt webhook update  test suite
    function testSuiteCleanUp() {
        return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommandEx(`impt dg delete --dg ${DG_NAME_2} -f `, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt webhook delete --wh ${wh_id} -q`, ImptTestHelper.emptyCheckEx));
    }

    // prepare test environment for impt webhook update test suite
    function testSuiteInit() {
        return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json `, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }));
    }

    // check 'webhook successfully updated' output message 
    function checkSuccessUpdateWebhookMessage(commandOut, webhookId) {
        ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
            `${Identifier.ENTITY_TYPE.TYPE_WEBHOOK}\\s+` +
            Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`, `"${webhookId}"`)
        );
    }

    // check command`s result by exec webhook info command
    function checkWebhookInfo(expectInfo) {
        return ImptTestHelper.runCommandEx(`impt webhook info --wh ${expectInfo && expectInfo.id ? expectInfo.id : wh_id} -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json.Webhook).toBeDefined;
            expect(json.Webhook.id).toBe(expectInfo && expectInfo.id ? expectInfo.id : wh_id);
            expect(json.Webhook.url).toBe(expectInfo && expectInfo.url ? expectInfo.url : WH_URL);
            expect(json.Webhook.event).toBe(expectInfo && expectInfo.deployment ? expectInfo.deployment : 'deployment');
            expect(json.Webhook.content_type).toBe(expectInfo && expectInfo.mime ? expectInfo.mime : 'json');
            expect(json.Webhook['Device Group'].id).toBe(expectInfo && expectInfo.dg_id ? expectInfo.dg_id : dg_id);
            expect(json.Webhook['Device Group'].name).toBe(expectInfo && expectInfo.dg_name ? expectInfo.dg_name : DG_NAME);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        });
    }

    it('webhook update without url and mime', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook update --wh ${wh_id} ${outputMode}`, (commandOut) => {
            checkSuccessUpdateWebhookMessage(commandOut, wh_id);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(checkWebhookInfo).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook update url and mime', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook update --wh ${wh_id} --url ${WH_URL_2} --mime urlencoded ${outputMode}`, (commandOut) => {
            checkSuccessUpdateWebhookMessage(commandOut, wh_id);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(() => { checkWebhookInfo({ url: WH_URL_2, mime: 'urlencoded' }); }).
            then(done).
            catch(error => done.fail(error));
    });

    it('update not exist webhook', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook update --wh not-exist-webhook --url ${WH_URL_2} ${outputMode}`, (commandOut) => {
            MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_WEBHOOK, 'not-exist-webhook');
            ImptTestHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});
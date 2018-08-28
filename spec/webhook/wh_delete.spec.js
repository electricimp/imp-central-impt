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
const ImptTestingHelper = require('../ImptTestingHelper');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_device_group';
const DG_NAME_2 = '__impt_device_group_2';
const WH_URL = 'http://example.ru/';

describe('impt webhook delete test suite >', () => {

    const outputMode = '';

    let dg_id = null;
    let wh_id = null;

    beforeAll((done) => {
        ImptTestingHelper.init().
            then(testSuiteCleanUp).
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestingHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    // delete all entities using in impt webhook delete  test suite
    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt dg delete --dg ${DG_NAME_2} -f `, ImptTestingHelper.emptyCheckEx)).
            then(() => ImptTestingHelper.runCommandEx(`impt webhook delete --wh ${wh_id} -q`, ImptTestingHelper.emptyCheckEx));
    }

    // prepare test environment for impt webhook delete test suite
    function testSuiteInit() {
        return ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                dg_id = ImptTestingHelper.parseId(commandOut);
                ImptTestingHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestingHelper.runCommandEx(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json `, (commandOut) => {
                wh_id = ImptTestingHelper.parseId(commandOut);
                ImptTestingHelper.emptyCheckEx(commandOut);
            }));
    }

    // check 'webhook successfully deleted' output message 
    function checkSuccessDeleteWebhookMessage(commandOut, webhookId) {
        ImptTestingHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
            `${Identifier.ENTITY_TYPE.TYPE_WEBHOOK}\\s+` +
            Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`, `"${webhookId}"`)
        );
    }

    it('webhook delete', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook delete --wh ${wh_id} --confirmed ${outputMode}`, (commandOut) => {
            checkSuccessDeleteWebhookMessage(commandOut, wh_id);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(() => {
                ImptTestingHelper.runCommandEx(`impt webhook info --wh ${wh_id} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_WEBHOOK, wh_id);
                    ImptTestingHelper.checkFailStatusEx(commandOut);
                });
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook delete without id', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook delete --wh `, (commandOut) => {
            MessageHelper.checkNotEnoughArgumentsError(commandOut, 'wh');
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(() => {
                ImptTestingHelper.runCommandEx(`impt webhook delete --confirmed `, (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'wh');
                    ImptTestingHelper.checkFailStatusEx(commandOut);
                });
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('delete not exist webhook', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook delete --wh not-exist-webhook ${outputMode}`, (commandOut) => {
            MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_WEBHOOK, 'not-exist-webhook');
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});

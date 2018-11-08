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
const PRODUCT_NAME_2 = `__impt_wh_product_2${config.suffix}`;
const DG_NAME = `__impt_wh_device_group${config.suffix}`;
const DG_NAME_2 = `__impt_wh_device_group_2${config.suffix}`;
const WH_URL = `http://example.com/wl/${config.suffix}`;
const WH_URL_2 = `http://example.com/wl2/${config.suffix}`;

const outputMode = '-z json';

// Test suite for 'impt webhook list' command.
// Runs 'impt webhook list' command with different combinations of options,
describe(`impt webhook list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let product_id = null;
    let dg_id = null;
    let dg2_id = null;
    let wh_id = null;
    let wh2_id = null;

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

    // delete all entities using in impt webhook list  test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME_2} -f -q`, ImptTestHelper.emptyCheckEx));
    }

    // prepare test environment for impt webhook list test suite
    function _testSuiteInit() {
        return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
            product_id = ImptTestHelper.parseId(commandOut);
            if (!product_id) fail("TestSuitInit error: Fail create product");
            ImptTestHelper.emptyCheck(commandOut);
        }).
            then(() => ImptTestHelper.runCommand(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                if (!dg_id) fail("TestSuitInit error: Fail create device group");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommand(`impt dg create --name ${DG_NAME_2} -p ${PRODUCT_NAME_2} `, (commandOut) => {
                dg2_id = ImptTestHelper.parseId(commandOut);
                if (!dg2_id) fail("TestSuitInit error: Fail create device group");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json `, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                if (!wh_id) fail("TestSuitInit error: Fail create webhook");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt webhook create --dg ${DG_NAME_2} --url ${WH_URL_2} --event deployment --mime urlencoded `, (commandOut) => {
                wh2_id = ImptTestHelper.parseId(commandOut);
                if (!wh2_id) fail("TestSuitInit error: Fail create webhook");
                ImptTestHelper.emptyCheck(commandOut);
            }));
    }

    // check webhook exist in webhook list
    function _checkWebhookExist(commandOut, expectInfo = {}) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        let obj = {
            Webhook: {
                id: `${expectInfo.id ? expectInfo.id : wh_id}`,
                url: `${expectInfo.url ? expectInfo.url : WH_URL}`,
                event: `${expectInfo.deployment ? expectInfo.deployment : 'deployment'}`,
                'Device Group': {
                    id: `${expectInfo.dg_id ? expectInfo.dg_id : dg_id}`,
                    type: `${expectInfo.dg_type ? expectInfo.dg_type : 'development'}`,
                    name: `${expectInfo.dg_name ? expectInfo.dg_name : DG_NAME}`
                }
            }
        };
        expect(json).toContain(jasmine.objectContaining(obj));
    }

    // check webhook count in webhook list
    function _checkWebhookCount(commandOut, expectCount) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        expect(json.length).toEqual(expectCount);
    }

    it('webhook list by owner', (done) => {
        ImptTestHelper.runCommand(`impt webhook list --owner me -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookExist(commandOut,
                { id: wh2_id, url: WH_URL_2, mime: 'urlencoded', dg_id: dg2_id, dg_name: DG_NAME_2 });
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product id', (done) => {
        ImptTestHelper.runCommand(`impt webhook list -p ${product_id} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product name', (done) => {
        ImptTestHelper.runCommand(`impt webhook list -p ${PRODUCT_NAME} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by dg id', (done) => {
        ImptTestHelper.runCommand(`impt webhook list -g ${dg_id} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product name url and event', (done) => {
        ImptTestHelper.runCommand(`impt webhook list -p ${PRODUCT_NAME} -u ${WH_URL} -e deployment -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by several url', (done) => {
        ImptTestHelper.runCommand(`impt webhook list -u ${WH_URL} -u ${WH_URL_2} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookExist(commandOut,
                { id: wh2_id, url: WH_URL_2, mime: 'urlencoded', dg_id: dg2_id, dg_name: DG_NAME_2 });
            _checkWebhookCount(commandOut, 2);
            ImptTestHelper.checkSuccessStatus(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });
});

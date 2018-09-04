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
const PRODUCT_NAME_2 = '__impt_product_2';
const DG_NAME = '__impt_device_group';
const DG_NAME_2 = '__impt_device_group_2';
const WH_URL = 'http://example.com/wl/';
const WH_URL_2 = 'http://example.com/wl2/';


describe('impt webhook delete test suite >', () => {

    const outputMode = '';

    let pr_id = null;
    let dg_id = null;
    let dg_id_2 = null;
    let wh_id = null;
    let wh_id_2 = null;

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
        return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -f -q`, ImptTestHelper.emptyCheckEx));
    }

    // prepare test environment for impt webhook list test suite
    function _testSuiteInit() {
        return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
            pr_id = ImptTestHelper.parseId(commandOut);
            ImptTestHelper.emptyCheckEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME} -p ${PRODUCT_NAME} `, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME_2} -p ${PRODUCT_NAME_2} `, (commandOut) => {
                dg_id_2 = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt webhook create --dg ${DG_NAME} --url ${WH_URL} --event deployment --mime json `, (commandOut) => {
                wh_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => ImptTestHelper.runCommandEx(`impt webhook create --dg ${DG_NAME_2} --url ${WH_URL_2} --event deployment --mime urlencoded `, (commandOut) => {
                wh_id_2 = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }));
    }

    // check webhook exist in webhook list
    function _checkWebhookExist(commandOut, expectInfo) {
        const json = JSON.parse(commandOut.output);
        expect(json).toBeArrayOfObjects;
        let obj = {
            Webhook: {
                id: `${expectInfo && expectInfo.id ? expectInfo.id : wh_id}`,
                url: `${expectInfo && expectInfo.url ? expectInfo.url : WH_URL}`,
                event: `${expectInfo && expectInfo.deployment ? expectInfo.deployment : 'deployment'}`,
                'Device Group': {
                    id: `${expectInfo && expectInfo.dg_id ? expectInfo.dg_id : dg_id}`,
                    type: `${expectInfo && expectInfo.dg_type ? expectInfo.dg_type : 'development'}`,
                    name: `${expectInfo && expectInfo.dg_name ? expectInfo.dg_name : DG_NAME}`
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
        ImptTestHelper.runCommandEx(`impt webhook list --owner me -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookExist(commandOut,
                { id: wh_id_2, url: WH_URL_2, mime: 'urlencoded', dg_id: dg_id_2, dg_name: DG_NAME_2 });
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product id', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook list -p ${pr_id} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product name', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook list -p ${PRODUCT_NAME} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by dg id', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook list -g ${dg_id} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by product name url and event', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook list -p ${PRODUCT_NAME} -u ${WH_URL} -e deployment -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookCount(commandOut, 1);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('webhook list by several url', (done) => {
        ImptTestHelper.runCommandEx(`impt webhook list -u ${WH_URL} -u ${WH_URL_2} -z json`, (commandOut) => {
            _checkWebhookExist(commandOut);
            _checkWebhookExist(commandOut,
                { id: wh_id_2, url: WH_URL_2, mime: 'urlencoded', dg_id: dg_id_2, dg_name: DG_NAME_2 });
            _checkWebhookCount(commandOut, 2);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

});

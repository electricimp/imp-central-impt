// MIT License
//
// Copyright 2018-2019 Electric Imp
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

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;

const outputMode = '-z json';

// Test suite for 'impt dg info' command.
// Runs 'impt dg info' command with different combinations of options,
describe(`impt device group info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let dg_id = null;
    let product_id = null;
    let email = null;
    let userid = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(_testSuiteCleanUp).
            then(_testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        _testSuiteCleanUp().
            then(() => ImptTestHelper.restoreDeviceInfo()).
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // prepare environment for device group info command testing
    function _testSuiteInit() {
        return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
            then((dgInfo) => { product_id = dgInfo.productId; dg_id = dgInfo.dgId; }).
            then(() => ImptTestHelper.getAccountAttrs()).
            then((account) => { email = account.email; userid = account.id; }).
            then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
            then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME}`, ImptTestHelper.emptyCheck));
    }

    // delete all entities using in impt dg info test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.productDelete(PRODUCT_NAME);
    }

    // check base atributes of requested device group
    function _checkDeviceGroupInfo(commandOut, expInfo = {}) {
        const json = JSON.parse(commandOut.output);
        expect(json['Device Group']).toBeDefined();
        expect(json['Device Group'].id).toBe(expInfo.id ? expInfo.id : dg_id);
        expect(json['Device Group'].name).toBe(expInfo.name ? expInfo.name : DEVICE_GROUP_NAME);
        expect(json['Device Group'].type).toBe('development');
        expect(json['Device Group'].Product.id).toBe(expInfo.p_id ? expInfo.p_id : product_id);
        expect(json['Device Group'].Product.name).toBe(expInfo.p_name ? expInfo.p_name : PRODUCT_NAME);
    }

    // check additional atributes of requested device group
    function _checkDeviceGroupAdditionalInfo(commandOut, expInfo = {}) {
        const json = JSON.parse(commandOut.output);
        expect(json['Device Group'].Devices[0].Device.id).toBe(expInfo.dev_id ? expInfo.dev_id : config.devices[config.deviceidx]);
    }

    describe('device group info positive tests >', () => {
        beforeAll((done) => {
            ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.projectDelete().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        it('device group info by id', (done) => {
            ImptTestHelper.runCommand(`impt dg info --dg ${dg_id} -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by name', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g ${DEVICE_GROUP_NAME} --full -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by project', (done) => {
            ImptTestHelper.runCommand(`impt dg info -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by id and owner me', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {me}{${product_id}}{${dg_id}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by id and owner id', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {${userid}}{${product_id}}{${dg_id}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by id and owner email', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {${email}}{${product_id}}{${dg_id}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by id and owner name', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {${config.username}}{${product_id}}{${dg_id}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by id and product name', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {me}{${PRODUCT_NAME}}{${dg_id}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('device group full info by name and product name', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {me}{${PRODUCT_NAME}}{${DEVICE_GROUP_NAME}} -u -z json`, (commandOut) => {
                _checkDeviceGroupInfo(commandOut);
                _checkDeviceGroupAdditionalInfo(commandOut);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe('device group info negative tests  >', () => {
        it('device group info by not exist project', (done) => {
            ImptTestHelper.runCommand(`impt dg info`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist device group info', (done) => {
            ImptTestHelper.runCommand(`impt dg info --dg not-exist-device-group --full`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('hierarchical dg id without owner', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {${PRODUCT_NAME}}{${DEVICE_GROUP_NAME}}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, `{${PRODUCT_NAME}}{${DEVICE_GROUP_NAME}}`);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('hierarchical dg id with empty owner', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {}{${PRODUCT_NAME}}{${DEVICE_GROUP_NAME}}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.ACCOUNT);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('hierarchical dg id with empty product', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {me}{}{${DEVICE_GROUP_NAME}}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.PRODUCT);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('hierarchical dg id with empty dg', (done) => {
            ImptTestHelper.runCommand(`impt dg info -g {me}{${PRODUCT_NAME}}{}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

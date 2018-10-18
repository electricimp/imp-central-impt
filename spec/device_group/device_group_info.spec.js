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

const PRODUCT_NAME = '__impt_dg_product';
const DEVICE_GROUP_NAME = '__impt_dg_device_group';

const outputMode = '-z json';

// Test suite for 'impt dg info' command.
// Runs 'impt dg info' command with different combinations of options,
describe(`impt device group info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let dg_id = null;
    let product_id = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(_testSuiteCleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        _testSuiteCleanUp().
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // prepare environment for device group info command testing
    function _testSuiteInit() {
        return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
            product_id = ImptTestHelper.parseId(commandOut);
            if (!product_id) fail("TestSuitInit error: Fail create product");
            ImptTestHelper.emptyCheck(commandOut);
        }).
            then(() => ImptTestHelper.runCommand(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                if (!dg_id) fail("TestSuitInit error: Fail create device group");
                ImptTestHelper.emptyCheck(commandOut);
            })).
            then(() => ImptTestHelper.runCommand(`impt device assign -d ${config.devices[0]} -g ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommand(`impt build deploy -g ${DEVICE_GROUP_NAME}`, ImptTestHelper.emptyCheckEx));
    }

    // delete all entities using in impt dg info test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
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
        expect(json['Device Group'].Devices[0].Device.id).toBe(expInfo.dev_id ? expInfo.dev_id : config.devices[0]);
    }

    describe('device group info positive tests >', () => {
        beforeAll((done) => {
            _testSuiteInit().
                then(() => ImptTestHelper.projectCreate(DEVICE_GROUP_NAME)).
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
    });

    describe('device group delete negative tests  >', () => {
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
    });
});

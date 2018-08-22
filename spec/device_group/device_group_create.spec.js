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
const ImptTestingHelper = require('../ImptTestingHelper');
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NAME_2 = '__impt_product_2';

const DEVICE_GROUP_NAME = '__impt_device_group';

const DEVICE_GROUP_DESCR = 'impt temp device group description';


// Test suite for 'impt dg create' command.
// Runs 'impt dg create' command with different combinations of options,

describe('impt device group create test suite >', () => {
    const outputMode = '';
    let dg_id = null;
    let product_id = null;


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

    // create products for device group testing
    function testSuiteInit() {
        return ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
            product_id = ImptTestingHelper.parseId(commandOut);
            ImptTestingHelper.emptyCheckEx(commandOut);
        }).
            then(() => ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestingHelper.emptyCheckEx));
    }


    // delete all products using in impt dg create test suite
    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} --force -q`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -f -q`, ImptTestingHelper.emptyCheckEx));
    }

    // check base atributes of requested device group
    function checkDeviceGroupInfo(deviceGroup) {
        expect(deviceGroup.id).toBe(dg_id);
        expect(deviceGroup.name).toBe(DEVICE_GROUP_NAME);
        expect(deviceGroup.type).toBe('development');
        expect(deviceGroup.Product.id).toBe(product_id);
        expect(deviceGroup.Product.name).toBe(PRODUCT_NAME);
    };


    // check successfuly created device group output message 
    function checkSuccessCreateDeviceGroupMessage(commandOut, deviceGroupName) {
        ImptTestingHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
            `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP}\\s+` +
            Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`, `"${deviceGroupName}"`)
        );
    }

    it('device group create', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg create --name ${DEVICE_GROUP_NAME} --desc ${DEVICE_GROUP_DESCR} --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
            dg_id = ImptTestingHelper.parseId(commandOut);
            expect(dg_id).not.toBeNull;
            // check "device group successfuly created" message  
            checkSuccessCreateDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
            ImptTestingHelper.checkAttributeEx(commandOut, ImptTestingHelper.ATTR_NAME, DEVICE_GROUP_NAME);
            ImptTestingHelper.checkAttributeEx(commandOut, ImptTestingHelper.ATTR_ID, dg_id);
            ImptTestingHelper.checkAttributeEx(commandOut, ImptTestingHelper.ATTR_TYPE, 'development');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(() => ImptTestingHelper.runCommandEx(`impt dg info -g ${name}  -z json`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                checkDeviceGroupInfo(json);
                expect(json.description).toBe(DEVICE_GROUP_DESCR);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('device group info by id', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg info -g ${dg_id}  -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            checkDeviceGroupInfo(json);
            expect(json.description).toBe(DEVICE_GROUP_DESCR);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('device group list', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg list  -z json`, (commandOut) => {
            const jsonList = JSON.parse(commandOut.output);
            const json = jsonList.find(element => element['Device Group'].name === DEVICE_GROUP_NAME);
            checkDeviceGroupInfo(json);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

});

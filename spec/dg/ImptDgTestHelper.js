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

const Shell = require('shelljs');
const FS = require('fs');
const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;
const DEVICE_GROUP_DESCR = 'impt temp device group description';

// Helper class for testing impt dg command group.
// Contains common methods for testing environment initialization and cleanup,
// running impt commands, check commands output, ...
class ImptDgTestHelper {

    // check device group has no device
    static checkDeviceGroupHasNoDevice(dg) {
        return ImptTestHelper.runCommand(`impt dg info -g ${dg} -u -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json['Device Group'].Devices).toBeUndefined();
            ImptTestHelper.checkSuccessStatus(commandOut);
        });
    }

    // check device group has device
    static checkDeviceGroupHasDevice(dg) {
        return ImptTestHelper.runCommand(`impt dg info -g ${dg} -u -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json['Device Group'].Devices[0].Device.id).toBe(config.devices[config.deviceidx]);
            ImptTestHelper.checkSuccessStatus(commandOut);
        });
    }

    // check device group not exist
    static checkDeviceGroupNotExist(dg) {
        return ImptTestHelper.runCommand(`impt dg info --dg ${dg}`, ImptTestHelper.checkFailStatus);
    }

    // check base atributes of requested device group
    // if device group has no description attr (in dg list command case) don`t check it
    static checkDeviceGroupInfo(expInfo = {}) {
        return ImptTestHelper.runCommand(`impt dg info -g ${expInfo.id ? expInfo.id : DEVICE_GROUP_NAME}  -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json['Device Group']).toBeDefined();
            expect(json['Device Group'].id).toBe(expInfo.id ? expInfo.id : json['Device Group'].id);
            expect(json['Device Group'].name).toBe(expInfo.name ? expInfo.name : DEVICE_GROUP_NAME);
            if (json['Device Group'].description) expect(json['Device Group'].description).toBe(expInfo.descr ? expInfo.descr : DEVICE_GROUP_DESCR);
            expect(json['Device Group'].type).toBe('development');
            expect(json['Device Group'].Product.id).toBe(expInfo.p_id ? expInfo.p_id : json['Device Group'].Product.id);
            expect(json['Device Group'].Product.name).toBe(expInfo.p_name ? expInfo.p_name : PRODUCT_NAME);
            ImptTestHelper.checkSuccessStatus(commandOut);
        });
    }
}

module.exports = ImptDgTestHelper;

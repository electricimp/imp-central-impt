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

const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');
const MessageHelper = require('../MessageHelper');
const config = require('../config');

const outputMode = '-z json';

describe(`impt test info tests (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let dg_id = null;
    let product_id = null;
    let device_mac = null;
    let old_name = null;
    let device_name = null;
    let agent_id = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestHelper.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // prepare test environment for impt test create test
    function _testSuiteInit() {
        return ImptTestHelper.getDeviceAttrs(ImptTestCommandsHelper.TEST_PRODUCT_NAME, ImptTestCommandsHelper.TEST_DG_NAME, (commandOut) => {
            if (commandOut && commandOut.mac) {
                device_mac = commandOut.mac;
                old_name = commandOut.name;
                device_name = `${config.devices[config.deviceidx]}${config.suffix}`;
                agent_id = commandOut.agentid;
            }
            else fail("TestSuitInit error: Failed to get additional device attributes");
        }).
            then(() => ImptTestHelper.runCommand(`impt device update -d ${config.devices[config.deviceidx]} --name ${device_name}`, ImptTestHelper.emptyCheck)).
            then(() => ImptTestCommandsHelper.createTestProductAndDG((commandOut) => {
                if (commandOut && commandOut.dgId && commandOut.productId) {
                    dg_id = commandOut.dgId;
                    product_id = commandOut.productId
                }
                else fail('TestSuiteInit error: Failed to get product and dg ids');
            })).
            then(() => ImptTestCommandsHelper.copyFiles('fixtures/create')).
            then(() => ImptTestHelper.runCommand(`impt test create --dg ${dg_id}  -x devicecode.nut -y agentcode.nut -f testfile.nut -f testfile2.nut -i github.impt -j builder.impt -t 20 -s -a -e  -q`, ImptTestHelper.emptyCheck));
    }

    function _testSuiteCleanup() {
        return ImptTestHelper.runCommand(`impt device update -d ${config.devices[config.deviceidx]} --name ${old_name ? old_name : '""'}`, ImptTestHelper.emptyCheck);
    }

    describe(`test info positive tests >`, () => {
        beforeAll((done) => {
            ImptTestCommandsHelper.cleanUpTestEnvironment().
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestCommandsHelper.cleanUpTestEnvironment().
                then(_testSuiteCleanup).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        it('test info', (done) => {
            ImptTestHelper.runCommand(`impt test info ${outputMode}`, (commandOut) => {
                const json = JSON.parse(commandOut.output);
                expect(json['Test Configuration']).toBeDefined;
                (["testfile.nut", "testfile2.nut"]).map(testFile =>
                    expect(json['Test Configuration']['Test files']).toContain(testFile));
                expect(json['Test Configuration']['Stop on failure']).toBe(true);
                expect(json['Test Configuration']['Allow disconnect']).toBe(true);
                expect(json['Test Configuration']['Builder cache']).toBe(true);
                expect(json['Test Configuration']['Timeout']).toBe(20);
                expect(json['Test Configuration']['Device file']).toBe('devicecode.nut');
                expect(json['Test Configuration']['Agent file']).toBe('agentcode.nut');
                expect(json['Test Configuration']['Github config']).toBe('github.impt');
                expect(json['Test Configuration']['Builder config']).toBe('builder.impt');
                expect(json['Test Configuration']['Device Group'].id).toBe(dg_id);
                expect(json['Test Configuration']['Device Group'].type).toBe('development');
                expect(json['Test Configuration']['Device Group'].name).toBe(ImptTestCommandsHelper.TEST_DG_NAME);
                expect(json['Test Configuration']['Device Group']['Product'].id).toBe(product_id);
                expect(json['Test Configuration']['Device Group']['Product'].name).toBe(ImptTestCommandsHelper.TEST_PRODUCT_NAME);
                expect(json['Test Configuration']['Device Group'].Devices[0].Device.id).toBe(config.devices[config.deviceidx]);
                expect(json['Test Configuration']['Device Group'].Devices[0].Device.mac_address).toBe(device_mac);
                expect(json['Test Configuration']['Device Group'].Devices[0].Device.name).toBe(device_name);
                expect(json['Test Configuration']['Device Group'].Devices[0].Device.agent_id).toBe(agent_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe(`test info negative tests >`, () => {
        it('test info with not exist dg', (done) => {
            ImptTestCommandsHelper.copyFiles('fixtures/info', '.impt.test').
                then(() => ImptTestHelper.runCommand(`impt test info ${outputMode}`, (commandOut) => {
                    MessageHelper.checkTestDeviceGroupNotExistMessage(commandOut, 'not-exist-device-group');
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

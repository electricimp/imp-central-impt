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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = `__impt_dg_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_dg_device_group${config.suffix}`;
const DEVICE_GROUP_DESCR = 'impt temp device group description';

const outputMode = '';

// Test suite for 'impt dg restart' command.
// Runs 'impt dg restart' command with different combinations of options,

describe(`impt device group restart test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let dg_id = null;

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

    // prepare environment for device group restart command testing
    function _testSuiteInit() {
        return ImptTestHelper.retrieveDeviceInfo(PRODUCT_NAME, DEVICE_GROUP_NAME).
            then(() => ImptTestHelper.createDeviceGroup(PRODUCT_NAME, DEVICE_GROUP_NAME)).
            then((dgInfo) => { dg_id = dgInfo.dgId; });
    }

    // delete all entities using in impt dg restart test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.productDelete(PRODUCT_NAME);
    }

    // check 'device group successfully restarted' output message 
    function _checkSuccessRestartedDeviceMessage(commandOut, dg) {
        ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
            Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_RESTARTED}`,
                `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
        );
    }

    // check 'device group successfully coditional restarted' output message 
    function _checkSuccessCondRestartedDeviceMessage(commandOut, dg) {
        ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
            Util.format(`${UserInterractor.MESSAGES.DG_DEVICES_COND_RESTARTED}`,
                `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
        );
    }

    // check 'device group have no device' output message 
    function _checkNoDeviceMessage(commandOut, dg) {
        ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
            Util.format(`${UserInterractor.MESSAGES.DG_NO_DEVICES}`,
                `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
        );
    }

    describe('device group restart positive tests >', () => {
        beforeAll((done) => {
            ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.deviceAssign(DEVICE_GROUP_NAME)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.projectDelete().
                then(() => ImptTestHelper.deviceUnassign(DEVICE_GROUP_NAME)).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        it('restart device by device group id', (done) => {
            ImptTestHelper.runCommand(`impt dg restart --dg ${dg_id} ${outputMode}`, (commandOut) => {
                _checkSuccessRestartedDeviceMessage(commandOut, dg_id);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, config.devices[config.deviceidx]);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('restart device by device group name', (done) => {
            ImptTestHelper.runCommand(`impt dg restart --dg ${DEVICE_GROUP_NAME} --conditional ${outputMode}`, (commandOut) => {
                _checkSuccessCondRestartedDeviceMessage(commandOut, DEVICE_GROUP_NAME);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, config.devices[config.deviceidx]);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('restart device by project', (done) => {
            ImptTestHelper.runCommand(`impt dg restart ${outputMode}`, (commandOut) => {
                _checkSuccessRestartedDeviceMessage(commandOut, dg_id);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, config.devices[config.deviceidx]);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        xit('restart device with log display', (done) => {
            ImptTestHelper.runCommand(`impt dg restart --dg ${DEVICE_GROUP_NAME} --log ${outputMode}`, (commandOut) => {
                _checkSuccessRestartedDeviceMessage(commandOut, DEVICE_GROUP_NAME);
                // TODO: check interactive output
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, config.devices[config.deviceidx]);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });

    describe('device group create negative tests >', () => {
        it('restart device by not exist project', (done) => {
            ImptTestHelper.runCommand(`impt dg restart ${outputMode}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.DG);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('restart device by not exist device group', (done) => {
            ImptTestHelper.runCommand(`impt dg restart -g not-exist-device-group ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.DG, 'not-exist-device-group');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('restart not exist device', (done) => {
            ImptTestHelper.runCommand(`impt dg restart -g ${DEVICE_GROUP_NAME} ${outputMode}`, (commandOut) => {
                _checkNoDeviceMessage(commandOut, DEVICE_GROUP_NAME)
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

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
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_DESCR = '__impt_product_description';

const DEVICE_GROUP_NAME = '__impt_device_group';
const DEVICE_GROUP_DESCR = 'impt temp device group description';


// Test suite for 'impt dg create' command.
// Runs 'impt dg create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe('impt device group create test suite >', () => {
        let dg_id = null;
        let product_id = null;

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


        // create products for device group testing
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // create products for device group testing
        function _testInit() {
            return ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // delete all products using in impt dg create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt project delete --all -q`, ImptTestHelper.emptyCheckEx));
        }

        // delete device group using in impt dg create test
        function _testCleanUp() {
            return ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // check 'device group successfully deleted' output message 
        function _checkSuccessDeleteDeviceGroupMessage(commandOut, dg) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
            );
        }

        describe('project not exist preconditions >', () => {
            beforeEach((done) => {
                _testInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('delete device group by id', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg ${dg_id} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceGroupMessage(commandOut, dg_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt dg info --dg ${dg_id}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg ${DEVICE_GROUP_NAME} -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteDeviceGroupMessage(commandOut, DEVICE_GROUP_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt dg info --dg ${DEVICE_GROUP_NAME}`, ImptTestHelper.checkFailStatusEx)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by not exist project', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Device Group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group by empty name', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete --dg "" -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkMissingArgumentValueError(commandOut, 'dg');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete device group without dg value', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode} --dg`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'dg');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete not exist device group', (done) => {
                ImptTestHelper.runCommandEx(`impt dg delete -q ${outputMode} --dg not-exist-device-group`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, 'Device Group', 'not-exist-device-group');
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });


        });

        describe('project exist preconditions >', () => {
            beforeAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);




        });

    });
});

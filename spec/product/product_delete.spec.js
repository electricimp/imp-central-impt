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
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = `__impt_pr_product${config.suffix}`;
const DEVICE_GROUP_NAME = `__impt_pr_device_group${config.suffix}`;

const PRODUCT_DESCR = 'impt temp product description';

// Test suite for 'impt product delete command.
// Runs 'impt product delete' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product delete test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        afterEach((done) => {
            _testSuiteCleanUp().
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // delete all entities using in impt product delete test
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -f -q`, ImptTestHelper.emptyCheckEx);
        }

        // prepare test environment for impt product delete test
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} -s "${PRODUCT_DESCR}"`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Failed to create product");
                ImptTestHelper.emptyCheck(commandOut);
            });
        }

        // check 'product successfully deleted' output message 
        function _checkSuccessDeleteProductMessage(commandOut, product) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_PRODUCT} "${product}"`)
            );
        }

        it('product delete without confirmation', (done) => {
            ImptTestHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product delete by name', (done) => {
            ImptTestHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} --confirmed ${outputMode}`, (commandOut) => {
                _checkSuccessDeleteProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt product info -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, PRODUCT_NAME);
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('product delete by id', (done) => {
            ImptTestHelper.runCommand(`impt product delete -p ${product_id} -q ${outputMode}`, (commandOut) => {
                _checkSuccessDeleteProductMessage(commandOut, product_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt product info -p ${product_id} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, product_id);
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('product delete by empty name', (done) => {
            ImptTestHelper.runCommand(`impt product delete -p "" -q ${outputMode}`, (commandOut) => {
                MessageHelper.checkNonEmptyOptionValueError(commandOut, 'product');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product delete by name without value', (done) => {
            ImptTestHelper.runCommand(`impt product delete -q ${outputMode} -p`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'p');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('delete not exist product', (done) => {
            ImptTestHelper.runCommand(`impt product delete -p not-exist-product -q ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, 'not-exist-product');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product delete by not exist project', (done) => {
            ImptTestHelper.runCommand(`impt product delete -q ${outputMode}`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.PRODUCT);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        describe(`test with project exist preconditions >`, () => {
            beforeEach((done) => {
                _testSuiteProjectInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            // create project for test purposes
            function _testSuiteProjectInit() {
                return ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --name ${DEVICE_GROUP_NAME} -q`, ImptTestHelper.emptyCheckEx);
            }

            it('product delete by project', (done) => {
                ImptTestHelper.runCommand(`impt product delete -f -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteProductMessage(commandOut, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt product info -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                        MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, PRODUCT_NAME);
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('delete product with device group', (done) => {
                ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NAME} -q ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDependedDeviceGroupExistMessage(commandOut)
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

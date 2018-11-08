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
const PRODUCT_NEW_NAME = `__impt_pr_new_product${config.suffix}`;
const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_NEW_DESCR = 'impt temp product new description';
const DEVICE_GROUP_NAME = `__impt_pr_device_group${config.suffix}`;

// Test suite for 'impt product update' command.
// Runs 'impt product update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        // delete all entities using in impt product update test
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_NEW_NAME} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        // prepare test environment for impt product update test
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheck(commandOut);
            });
        }

        // check 'product successfully updated' output message 
        function _checkSuccessUpdateProductMessage(commandOut, product) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_PRODUCT} "${product}"`)
            );
        }

        // check command`s result by exec product info command
        function _checkProductInfo(expectInfo = {}) {
            return ImptTestHelper.runCommand(`impt product info -p ${expectInfo.name ? expectInfo.name : PRODUCT_NAME}  ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, `${expectInfo.id ? expectInfo.id : product_id}`);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, `${expectInfo.name ? expectInfo.name : PRODUCT_NAME}`);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_DESCRIPTION, `${expectInfo.descr ? expectInfo.descr : ''}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        it('update product name', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -n ${PRODUCT_NEW_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product description', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_NEW_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product name and description', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -n ${PRODUCT_NEW_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_NEW_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to empty description', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME}  -s "" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product name by id', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${product_id}  -n ${PRODUCT_NEW_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, product_id);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product without new values', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to empty name', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -n "" ${outputMode}`, (commandOut) => {
                MessageHelper.checkMissingArgumentValueError(commandOut, 'name');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to name without value', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -n`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'n');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to description without value', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME} -s`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product by empty name', (done) => {
            ImptTestHelper.runCommand(`impt product update -n ${PRODUCT_NAME} -p "" `, (commandOut) => {
                MessageHelper.checkMissingArgumentValueError(commandOut, 'product');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product by name without value', (done) => {
            ImptTestHelper.runCommand(`impt product update  -n ${PRODUCT_NAME} -p`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'p');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product without output value', (done) => {
            ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME}  -n ${PRODUCT_NAME} -z`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'z');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(() => ImptTestHelper.runCommand(`impt product update -p ${PRODUCT_NAME}  -n ${PRODUCT_NAME} -z undefined`, (commandOut) => {
                    MessageHelper.checkInvalidValuesError(commandOut);
                    ImptTestHelper.checkFailStatus(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update not existing product', (done) => {
            ImptTestHelper.runCommand(`impt product update -p __not_existing_product  -n ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, '__not_existing_product');
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        describe(`test with project exist preconditions >`, () => {
            beforeAll((done) => {
                _testSuiteProjectInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            // create project for test purposes
            function _testSuiteProjectInit() {
                return ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --name ${DEVICE_GROUP_NAME}`, ImptTestHelper.emptyCheckEx);
            }

            it('update product name and description by project', (done) => {
                ImptTestHelper.runCommand(`impt product update -n ${PRODUCT_NEW_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateProductMessage(commandOut, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_NEW_DESCR })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

    });
});
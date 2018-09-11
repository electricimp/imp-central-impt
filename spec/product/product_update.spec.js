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

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NEW_NAME = '__impt_new_product';

const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_NEW_DESCR = 'impt temp product new description';

const DG_NAME = '__impt_device_group';

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
            return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NEW_NAME} -f -q`, ImptTestHelper.emptyCheckEx));
        }

        // prepare test environment for impt product update test
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // check 'product successfully updated' output message 
        function _checkSuccessUpdateProductMessage(commandOut, product) {
            ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
                `${Identifier.ENTITY_TYPE.TYPE_PRODUCT}\\s+` +
                Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`, `"${product}"`)
            );
        }

        // check command`s result by exec product info command
        function _checkProductInfo(expectInfo) {
            return ImptTestHelper.runCommandEx(`impt product info -p ${expectInfo && expectInfo.name ? expectInfo.name : PRODUCT_NAME}  ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_ID, `${expectInfo && expectInfo.id ? expectInfo.id : product_id}`);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_NAME, `${expectInfo && expectInfo.name ? expectInfo.name : PRODUCT_NAME}`);
                ImptTestHelper.checkAttributeEx(commandOut, ImptTestHelper.ATTR_DESCRIPTION, `${expectInfo && expectInfo.descr ? expectInfo.descr : ''}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            });
        }

        it('update product name', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -n ${PRODUCT_NEW_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product description', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_NEW_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product name and description', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -n ${PRODUCT_NEW_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_NEW_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to empty description', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME}  -s "" ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product name by id', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${product_id}  -n ${PRODUCT_NEW_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, product_id);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product without new values', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                _checkSuccessUpdateProductMessage(commandOut, PRODUCT_NAME);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_DESCR })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to empty name', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -n "" ${outputMode}`, (commandOut) => {
                MessageHelper.checkMissingArgumentValueError(commandOut, 'name');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to name without value', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -n`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'n');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product to description without value', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -s`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 's');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product by empty name', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -n ${PRODUCT_NAME} -p "" `, (commandOut) => {
                MessageHelper.checkMissingArgumentValueError(commandOut, 'product');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product by name without value', (done) => {
            ImptTestHelper.runCommandEx(`impt product update  -n ${PRODUCT_NAME} -p`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'p');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('update product without output value', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME}  -n ${PRODUCT_NAME} -z`, (commandOut) => {
                MessageHelper.checkNotEnoughArgumentsError(commandOut, 'z');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(() => ImptTestHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME}  -n ${PRODUCT_NAME} -z undefined`, (commandOut) => {
                    MessageHelper.checkInvalidValuesError(commandOut);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                })).
                then(done).
                catch(error => done.fail(error));
        });

        it('update not existing product', (done) => {
            ImptTestHelper.runCommandEx(`impt product update -p __not_existing_product  -n "${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, '__not_existing_product');
                ImptTestHelper.checkFailStatusEx(commandOut);
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
                return ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --name ${DG_NAME}`, ImptTestHelper.emptyCheckEx);
            }

            it('update product name and description by project', (done) => {
                ImptTestHelper.runCommandEx(`impt product update -n ${PRODUCT_NEW_NAME} -s "${PRODUCT_NEW_DESCR}" ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateProductMessage(commandOut, product_id);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NEW_NAME, descr: PRODUCT_NEW_DESCR })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

    });
});
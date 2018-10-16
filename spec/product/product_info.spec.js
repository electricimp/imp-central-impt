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

const PRODUCT_NAME = '__impt_pr_product';
const PRODUCT_DESCR = 'impt temp product description';
const DEVICE_GROUP_NAME = '__impt_pr_device_group';

// Test suite for 'impt product info' command.
// Runs 'impt product info' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
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

        // create product and save product id for test purposes
        function _testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Fail create product");
                ImptTestHelper.emptyCheckEx(commandOut);
            });
        }

        // delete all entities using in impt product info test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --force --confirmed`, ImptTestHelper.emptyCheckEx);
        }

        it('product info by id', (done) => {
            ImptTestHelper.runCommandEx(`impt product info --product ${product_id}  ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                expect(commandOut.output).toMatch(`${product_id}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product info by name', (done) => {
            ImptTestHelper.runCommandEx(`impt product info -p ${PRODUCT_NAME}  ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                expect(commandOut.output).toMatch(`${product_id}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product full info by name', (done) => {
            ImptTestHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} --full ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                expect(commandOut.output).toMatch(`${product_id}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist product info', (done) => {
            ImptTestHelper.runCommandEx(`impt product info --product not-exist-product ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, 'not-exist-product');
                ImptTestHelper.checkFailStatusEx(commandOut)
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product info without product name', (done) => {
            ImptTestHelper.runCommandEx(`impt product info ${outputMode}`, ImptTestHelper.checkFailStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('product info with empty product name', (done) => {
            ImptTestHelper.runCommandEx(`impt product info --product "" ${outputMode}`, ImptTestHelper.checkFailStatusEx).
                then(() => ImptTestHelper.runCommandEx(`impt product info --product  ${outputMode}`, ImptTestHelper.checkFailStatusEx)).
                then(done).
                catch(error => done.fail(error));
        });

        it('product info without output value', (done) => {
            ImptTestHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} -z`, ImptTestHelper.checkFailStatusEx).
                then(() => ImptTestHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} -z undefined`, ImptTestHelper.checkFailStatusEx)).
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
                return ImptTestHelper.runCommandEx(`impt project create --product ${PRODUCT_NAME} --name ${DEVICE_GROUP_NAME}`, ImptTestHelper.emptyCheckEx);
            }

            it('product info by project', (done) => {
                ImptTestHelper.runCommandEx(`impt product info ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

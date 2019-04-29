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
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');

const PRODUCT_NAME = `__impt_pr_product${config.suffix}`;
const PRODUCT_DESCR = 'impt temp product description';
const DEVICE_GROUP_NAME = `__impt_pr_device_group${config.suffix}`;

// Test suite for 'impt product info' command.
// Runs 'impt product info' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let email = null;
        let userid = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestHelper.cleanUp().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // create product and save product id for test purposes
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
                product_id = ImptTestHelper.parseId(commandOut);
                if (!product_id) fail("TestSuitInit error: Failed to create product");
                ImptTestHelper.emptyCheck(commandOut);
            }).
                then(() => ImptTestHelper.getAccountAttrs()).
                then((account) => { email = account.email; userid = account.id; });
        }

        // delete all entities using in impt product info test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME);
        }

        describe(`product info positive tests >`, () => {
            beforeAll((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('product info by id', (done) => {
                ImptTestHelper.runCommand(`impt product info --product ${product_id}  ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by name', (done) => {
                ImptTestHelper.runCommand(`impt product info -p ${PRODUCT_NAME}  ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product full info by name', (done) => {
                ImptTestHelper.runCommand(`impt product info --product ${PRODUCT_NAME} --full ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by project', (done) => {
                ImptTestHelper.runCommand(`impt project create --product ${PRODUCT_NAME} --name ${DEVICE_GROUP_NAME}`, ImptTestHelper.emptyCheck).
                    then(() => ImptTestHelper.runCommand(`impt product info ${outputMode}`, (commandOut) => {
                        expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                        expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                        expect(commandOut.output).toMatch(`${product_id}`);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    })).
                    then(ImptTestHelper.projectDelete).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by id and owner id', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {${userid}}{${product_id}} ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by id and owner name', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {${config.username}}{${product_id}} ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by id and owner email', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {${email}}{${product_id}} ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by id and owner me', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {me}{${product_id}} ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info by name and owner id', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {${userid}}{${PRODUCT_NAME}} ${outputMode}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                    expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
                    expect(commandOut.output).toMatch(`${product_id}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`product info negative tests >`, () => {
            it('not exist product info', (done) => {
                ImptTestHelper.runCommand(`impt product info --product not-exist-product ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, 'not-exist-product');
                    ImptTestHelper.checkFailStatus(commandOut)
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info without product name', (done) => {
                ImptTestHelper.runCommand(`impt product info ${outputMode}`, ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('hierarchical product id without owner', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {${PRODUCT_NAME}} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.PRODUCT, `{${PRODUCT_NAME}}`);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('hierarchical product id with empty product', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {me}{} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.PRODUCT);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('hierarchical product id with empty owner', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {}{${PRODUCT_NAME}} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, MessageHelper.ACCOUNT);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('hierarchical product id with excess field', (done) => {
                ImptTestHelper.runCommand(`impt product info --product {me}{${PRODUCT_NAME}}{} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkEntityNotFoundError(commandOut, MessageHelper.PRODUCT, `{me}{${PRODUCT_NAME}}{}`);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product info without output value', (done) => {
                ImptTestHelper.runCommand(`impt product info --product ${PRODUCT_NAME} -z`, ImptTestHelper.checkFailStatus).
                    then(() => ImptTestHelper.runCommand(`impt product info --product ${PRODUCT_NAME} -z undefined`, ImptTestHelper.checkFailStatus)).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

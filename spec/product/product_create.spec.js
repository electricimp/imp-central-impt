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

const PRODUCT_NAME = `__impt_pr_product${config.suffix}`;
const PRODUCT_EXIST_NAME = `__impt_pr_product_2${config.suffix}`;

const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_EXIST_DESCR = 'impt temp product description 2';

// Test suite for 'impt product create' command.
// Runs 'impt product create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product create test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let username = config.collaborator ? config.collaborator : config.username;
        let email = null;
        let userid = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testCleanUp).
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

        // delete all entities using in impt product create test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.runCommand(`impt product delete -p ${PRODUCT_EXIST_NAME} -f -q`, ImptTestHelper.emptyCheck);
        }

        // delete all entities using in impt product create test
        function _testCleanUp(owner = 'me') {
            return ImptTestHelper.runCommand(`impt product delete -p {${owner}}{${PRODUCT_NAME}} -f -q`, ImptTestHelper.emptyCheck);
        }

        // prepare test environment for impt product create test suite
        function _testSuiteInit() {
            return ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_EXIST_NAME} -s "${PRODUCT_EXIST_DESCR}"`, ImptTestHelper.emptyCheck).
                then(() => ImptTestHelper.getAccountAttrs(username)).
                then((account) => { email = account.email; userid = account.id; });
        }

        // check command`s result by exec product info command
        function _checkProductInfo(expectInfo = {}) {
            return ImptTestHelper.runCommand(`impt product info -p ${expectInfo.product ? expectInfo.product : expectInfo.name ? expectInfo.name : PRODUCT_NAME}  ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, `${expectInfo.id ? expectInfo.id : product_id}`);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, `${expectInfo.name ? expectInfo.name : PRODUCT_NAME}`);
                ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_DESCRIPTION, `${expectInfo.descr ? expectInfo.descr : ''}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            });
        }

        // check successfuly created product output message 
        function _checkSuccessCreateProductMessage(commandOut, productName) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_CREATED}`,
                    `${Identifier.ENTITY_TYPE.TYPE_PRODUCT} "${productName}"`)
            );
        }

        describe(`product create tests >`, () => {
            afterEach((done) => {
                _testCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);


            it('product create', (done) => {
                ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}" ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_DESCR })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create without description', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, `${PRODUCT_NAME}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NAME })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create with duplicated description', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} --descr "${PRODUCT_EXIST_DESCR}" ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, `${PRODUCT_NAME}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NAME, descr: PRODUCT_EXIST_DESCR })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create with empty description', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} -s "" ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, 'name', `${PRODUCT_NAME}`);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({ name: PRODUCT_NAME })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('create duplicated product', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_EXIST_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDuplicateResourceError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('create duplicated product with description', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_EXIST_NAME} -s "${PRODUCT_EXIST_DESCR}" ${outputMode}`, (commandOut) => {
                    MessageHelper.checkDuplicateResourceError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create without name', (done) => {
                ImptTestHelper.runCommand('impt product create', (commandOut) => {
                    MessageHelper.checkMissingArgumentsError(commandOut, 'name');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt product create --descr "${PRODUCT_DESCR}" ${outputMode}`, (commandOut) => {
                        MessageHelper.checkMissingArgumentsError(commandOut, 'name');
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create with empty name', (done) => {
                ImptTestHelper.runCommand(`impt product create -n "" ${outputMode}`, (commandOut) => {
                    MessageHelper.checkNonEmptyOptionValueError(commandOut, 'name');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt product create --name`, (commandOut) => {
                        MessageHelper.checkNotEnoughArgumentsError(commandOut, 'name');
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create without description value', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} --descr`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'descr');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create without output value', (done) => {
                ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME}  --output`, (commandOut) => {
                    MessageHelper.checkNotEnoughArgumentsError(commandOut, 'output');
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt product create -n ${PRODUCT_NAME} --output undefined`, (commandOut) => {
                        MessageHelper.checkInvalidValuesError(commandOut);
                        ImptTestHelper.checkFailStatus(commandOut);
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`product create with owner option tests >`, () => {
            beforeAll((done) => {
                _testCleanUp(config.collaborator ? config.collaborator : config.username).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterEach((done) => {
                _testCleanUp(config.collaborator ? config.collaborator : config.username).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('product create for owner by id', (done) => {
                ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}" --owner ${userid} ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({
                        product: `{${username}}{${PRODUCT_NAME}}`,
                        name: PRODUCT_NAME, descr: PRODUCT_DESCR
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create for owner by name', (done) => {
                ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}" --owner ${username} ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({
                        product: `{${username}}{${PRODUCT_NAME}}`,
                        name: PRODUCT_NAME, descr: PRODUCT_DESCR
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('product create for owner by email', (done) => {
                ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}" --owner ${email} ${outputMode}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    expect(product_id).not.toBeNull;
                    _checkSuccessCreateProductMessage(commandOut, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_NAME, PRODUCT_NAME);
                    ImptTestHelper.checkAttribute(commandOut, ImptTestHelper.ATTR_ID, product_id);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(() => _checkProductInfo({
                        product: `{${username}}{${PRODUCT_NAME}}`,
                        name: PRODUCT_NAME, descr: PRODUCT_DESCR
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

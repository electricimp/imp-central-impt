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
const ImptTestingHelper = require('../ImptTestingHelper');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NAME_2 = '__impt_product_2';
const PRODUCT_DESCR = 'impt temp product description';

// Test suite for 'impt create product' command.
// Runs 'impt create product' command with different combinations of options,
// checks that products are actually created using 'impt product info' and 'impt product list' commands.
describe('impt product create test suite >', () => {
    let productId = null;

    beforeAll((done) => {
        ImptTestingHelper.init().
            then(testSuiteCleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestingHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommand(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestingHelper.emptyCheck).
            then(() => ImptTestingHelper.runCommand(`impt product delete -p ${PRODUCT_NAME_2} -q`, ImptTestingHelper.emptyCheck));
    }

    it('product create', (done) => {
        ImptTestingHelper.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create without description', (done) => {
        ImptTestingHelper.runCommand(`impt product create -n ${PRODUCT_NAME_2} --output debug`, ImptTestingHelper.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('check product info', (done) => {
        ImptTestingHelper.runCommand(`impt product info --product ${PRODUCT_NAME}`, (commandOut) => {
                ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_NAME, PRODUCT_NAME);
                ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_DESCRIPTION, PRODUCT_DESCR);
                const idMatcher = commandOut.match(new RegExp(`${ImptTestingHelper.ATTR_ID}:\\s+([A-Za-z0-9-]+)`));
                expect(idMatcher).toBeNonEmptyArray();
                if (idMatcher) {
                    productId = idMatcher[1];
                }
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('check full product info by id', (done) => {
        if (productId) {
            ImptTestingHelper.runCommand(`impt product info -p ${productId} --full`, (commandOut) => {
                    ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_NAME, PRODUCT_NAME);
                    ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_DESCRIPTION, PRODUCT_DESCR);
                    ImptTestingHelper.checkSuccessStatus(commandOut);
                }).
                then(done).
                catch(error => done.fail(error));
        }
        else {
            done();
        }
    });

    it('check product list', (done) => {
        ImptTestingHelper.runCommand('impt product list', (commandOut) => {
                ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_NAME, PRODUCT_NAME);
                ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_NAME, PRODUCT_NAME_2);
                if (productId) {
                    ImptTestingHelper.checkAttribute(commandOut, ImptTestingHelper.ATTR_ID, productId);
                }
                ImptTestingHelper.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    // negative tests
    it('create duplicated product', (done) => {
        ImptTestingHelper.runCommand(`impt product create -n ${PRODUCT_NAME} -s "${PRODUCT_DESCR}"`, ImptTestingHelper.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create without name', (done) => {
        ImptTestingHelper.runCommand('impt product create', ImptTestingHelper.checkFailStatus).
            then(() => ImptTestingHelper.runCommand(`impt product create --descr "${PRODUCT_DESCR}"`, ImptTestingHelper.checkFailStatus)).
            then(() => ImptTestingHelper.runCommand('impt product create -z', ImptTestingHelper.checkFailStatus)).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create with empty name', (done) => {
        ImptTestingHelper.runCommand('impt product create -n ""', ImptTestingHelper.checkFailStatus).
            then(() => ImptTestingHelper.runCommand('impt product create --name', ImptTestingHelper.checkFailStatus)).
            then(done).
            catch(error => done.fail(error));
    });
});

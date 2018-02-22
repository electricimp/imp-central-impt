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
const util = require('../util');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_DESCR = 'impt temp product description';

describe('impt product create test suite >', () => {
    let productId = null;

    beforeAll((done) => {
        util.initAndLoginLocal().
            then(testSuiteCleanUp).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(util.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, util.TIMEOUT);

    function testSuiteCleanUp() {
        return util.runCommand(`impt product delete --product ${PRODUCT_NAME} --confirmed`, util.emptyCheck);
    }

    it('product create', (done) => {
        util.runCommand(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, util.checkSuccessStatus).
            then(done).
            catch(error => done.fail(error));
    });

    it('product info', (done) => {
        util.runCommand(`impt product info --product ${PRODUCT_NAME}`, (commandOut) => {
                expect(commandOut).toMatch(PRODUCT_NAME);
                expect(commandOut).toMatch(PRODUCT_DESCR);
                const idMatcher = commandOut.match(/id:\s+([A-Za-z0-9-]+)/);
                expect(idMatcher).toBeNonEmptyArray();
                if (idMatcher) {
                    productId = idMatcher[1];
                }
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('full product info by id', (done) => {
        if (productId) {
            util.runCommand(`impt product info -p ${productId} --full`, (commandOut) => {
                    expect(commandOut).toMatch(PRODUCT_NAME);
                    expect(commandOut).toMatch(PRODUCT_DESCR);
                    util.checkSuccessStatus(commandOut);
                }).
                then(done).
                catch(error => done.fail(error));
        }
        else {
            done();
        }
    });

    it('product list', (done) => {
        util.runCommand('impt product list', (commandOut) => {
                expect(commandOut).toMatch(PRODUCT_NAME);
                if (productId) {
                    expect(commandOut).toMatch(productId);
                }
                util.checkSuccessStatus(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('create duplicated product', (done) => {
        util.runCommand(`impt product create -n ${PRODUCT_NAME} -s "${PRODUCT_DESCR}"`, util.checkFailStatus).
            then(done).
            catch(error => done.fail(error));
    });
});

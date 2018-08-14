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

// Test suite for 'impt product info' command.
// Runs 'impt product info' command with different combinations of options,
describe('impt product info test suite >', () => {
    const outmode = '';
    let product_id = null;

    beforeAll((done) => {
        ImptTestingHelper.init().
            then(testSuiteCleanUp).
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestingHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    // create product and save product id for test purposes
    function testSuiteInit() {
        return ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
            const idMatcher = commandOut.output.match(new RegExp(`${ImptTestingHelper.ATTR_ID}"?:\\s+"?([A-Za-z0-9-]+)`));
            if (idMatcher && idMatcher.length > 1) {
                product_id = idMatcher[1];
            }
            else fail("TestSuitInit error: Fail create product");
            ImptTestingHelper.emptyCheckEx(commandOut);
        });
    }

    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME_2} --confirmed`,
                ImptTestingHelper.emptyCheckEx));
    }

    it('product info by id', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info --product ${product_id}  ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
            expect(commandOut.output).toMatch(`${product_id}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product info by name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info -p ${PRODUCT_NAME}  ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
            expect(commandOut.output).toMatch(`${product_id}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product full info by name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} --full ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_DESCR}`);
            expect(commandOut.output).toMatch(`${product_id}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('not exist product info', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME_2} ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('product info without product name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('product info with empty product name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info --product "" ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product info --product  ${outmode}`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });

    it('product info without output value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} -z`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product info --product ${PRODUCT_NAME} -z undefined`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
});

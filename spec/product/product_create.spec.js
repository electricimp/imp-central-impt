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
const PRODUCT_NAME_3 = '__impt_product_3';
const PRODUCT_NAME_4 = '__impt_product_4';

const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_DESCR_2 = 'impt temp product description 2';

// Test suite for 'impt product create' command.
// Runs 'impt product create' command with different combinations of options,

describe('impt product create test suite >', () => {
    const outmode = '';
    
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
        return ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -q`, ImptTestingHelper.emptyCheckEx)).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_3} -q`, ImptTestingHelper.emptyCheckEx)).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_4} -q`, ImptTestingHelper.emptyCheckEx));
    }

    it('product create', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}" ${outmode}`, (commandOut) => {
                ImptTestingHelper.checkAttributeEx(commandOut, 'name', `${PRODUCT_NAME}`);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create without description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_2} ${outmode}`, (commandOut) => {
                ImptTestingHelper.checkAttributeEx(commandOut, 'name', `${PRODUCT_NAME_2}`);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create with duplicated description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_3} --descr "${PRODUCT_DESCR}" ${outmode}`, (commandOut) => {
                ImptTestingHelper.checkAttributeEx(commandOut, 'name', `${PRODUCT_NAME_3}`);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });
    
    it('create duplicated product', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME} ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME} -s "${PRODUCT_DESCR_2}" ${outmode}`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create without name', (done) => {
        ImptTestingHelper.runCommandEx('impt product create', ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product create --descr "${PRODUCT_DESCR}" ${outmode}`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });

    it('product create with empty name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n "" ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product create --name ${outmode}`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
    
    it('product create without description value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_4} -s ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
    
    it('product create without output value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_4}  --output`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME} --output undefined`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
    
    it('product create with empty description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME_4} -s "" ${outmode}`, (commandOut) => {
                ImptTestingHelper.checkAttributeEx(commandOut, 'name', `${PRODUCT_NAME_4}`);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
            then(done).
            catch(error => done.fail(error));
    });
});

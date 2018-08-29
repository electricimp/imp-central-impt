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
const PRODUCT_NAME_2 = '__impt_product_2';
const PRODUCT_NAME_3 = '__impt_product_3';
const PRODUCT_NAME_4 = '__impt_product_4';

const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_DESCR_2 = 'impt temp product description 2';

// Test suite for 'impt product delete command.
// Runs 'impt product delete' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product delete test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    const outputMode = '';
    let product_id = null;

    beforeAll((done) => {
        ImptTestHelper.init().
            then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    function testSuiteCleanUp() {
        return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestHelper.emptyCheckEx).
            then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -q`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_3} -q`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_4} -q`, ImptTestHelper.emptyCheckEx));
    }

    function testSuiteInit() {
        return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`, (commandOut) => {
            const idMatcher = commandOut.output.match(new RegExp(`${ImptTestHelper.ATTR_ID}"?:\\s+"?([A-Za-z0-9-]+)`));
            if (idMatcher && idMatcher.length > 1) {
                product_id = idMatcher[1];
            }
            else fail("TestSuitInit error: Fail create product");
            ImptTestHelper.emptyCheckEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_3}`, ImptTestHelper.emptyCheckEx)).
            then(() => ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_4}`, ImptTestHelper.emptyCheckEx));
    }

    // check 'product successfully deleted' output message 
    function checkSuccessDeleteProductMessage(commandOut, product) {
        ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
            `${Identifier.ENTITY_TYPE.TYPE_PRODUCT}\\s+` +
            Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`, `"${product}"`)
        );
    }

    it('product delete by name without confirmation', (done) => {
        ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME_2} ${outputMode}`, (commandOut) => {
            ImptTestHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product delete by name', (done) => {
        ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME_2} --confirmed ${outputMode}`, (commandOut) => {
            checkSuccessDeleteProductMessage(commandOut, PRODUCT_NAME_2);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt product info -p ${PRODUCT_NAME_2} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, PRODUCT_NAME_2);
                ImptTestHelper.checkFailStatusEx(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });

    it('product delete by id', (done) => {
        ImptTestHelper.runCommandEx(`impt product delete -p ${product_id} -q ${outputMode}`, (commandOut) => {
            checkSuccessDeleteProductMessage(commandOut, product_id);
            ImptTestHelper.checkSuccessStatusEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt product info -p ${product_id} ${outputMode}`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, Identifier.ENTITY_TYPE.TYPE_PRODUCT, product_id);
                ImptTestHelper.checkFailStatusEx(commandOut);
            })).
            then(done).
            catch(error => done.fail(error));
    });
});
});

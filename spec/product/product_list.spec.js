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

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NAME_2 = '__impt_product_2';

// Test suite for 'impt product list' command.
// Runs 'impt product list' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        const outputMode = '';
        let product_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(testSuiteCleanUp).
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

        function testSuiteInit() {
            return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestHelper.emptyCheckEx));
        }

        function testSuiteCleanUp() {
            return ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestHelper.emptyCheckEx).
                then(() => ImptTestHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME_2} --confirmed`,
                    ImptTestHelper.emptyCheckEx));
        }

        it('product list', (done) => {
            ImptTestHelper.runCommandEx(`impt product list  ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by me', (done) => {
            ImptTestHelper.runCommandEx(`impt product list --owner me ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by name', (done) => {
            ImptTestHelper.runCommandEx(`impt product list --owner ${config.username} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by email', (done) => {
            ImptTestHelper.runCommandEx(`impt product list --owner ${config.email} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by id', (done) => {
            ImptTestHelper.runCommandEx(`impt product list --owner ${config.accountid} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list without owner value', (done) => {
            ImptTestHelper.runCommandEx(`impt product list --owner ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list without output value', (done) => {
            ImptTestHelper.runCommandEx(`impt product list -z`, ImptTestHelper.checkFailStatusEx).
                then(() => ImptTestHelper.runCommandEx(`impt product list -z undefined`, ImptTestHelper.checkFailStatusEx)).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

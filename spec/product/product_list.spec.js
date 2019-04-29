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

const PRODUCT_NAME = `__impt_pr_product${config.suffix}`;
const PRODUCT_NAME_2 = `__impt_pr_product_2${config.suffix}`;

// Test suite for 'impt product list' command.
// Runs 'impt product list' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt product list test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let email = null;
        let userid = null;

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

        // prepare test environment for impt product list test
        function _testSuiteInit() {
            return ImptTestHelper.getAccountAttrs().
                then((account) => { email = account.email; userid = account.id; }).
                then(() => ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, ImptTestHelper.emptyCheck)).
                then(() => ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestHelper.emptyCheck));
        }

        // delete all entities using in impt product list test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME).
                then(() => ImptTestHelper.productDelete(PRODUCT_NAME_2));
        }

        it('product list', (done) => {
            ImptTestHelper.runCommand(`impt product list  ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by me', (done) => {
            ImptTestHelper.runCommand(`impt product list --owner me ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by name', (done) => {
            ImptTestHelper.runCommand(`impt product list --owner ${config.username} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by email', (done) => {
            ImptTestHelper.runCommand(`impt product list --owner ${email} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list with owner by id', (done) => {
            ImptTestHelper.runCommand(`impt product list --owner ${userid} ${outputMode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
                expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
                ImptTestHelper.checkSuccessStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list without owner value', (done) => {
            ImptTestHelper.runCommand(`impt product list --owner ${outputMode}`, (commandOut) => {
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('product list without output value', (done) => {
            ImptTestHelper.runCommand(`impt product list -z`, ImptTestHelper.checkFailStatus).
                then(() => ImptTestHelper.runCommand(`impt product list -z undefined`, ImptTestHelper.checkFailStatus)).
                then(done).
                catch(error => done.fail(error));
        });
    });
});

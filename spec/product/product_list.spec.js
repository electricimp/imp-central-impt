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

// Test suite for 'impt product list' command.
// Runs 'impt product list' command with different combinations of options,
describe('impt product list test suite >', () => {
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

    function testSuiteInit() {
        return ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME_2}`, ImptTestingHelper.emptyCheckEx));
    }

    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME_2} --confirmed`,
                ImptTestingHelper.emptyCheckEx));
    }

    it('product list', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list  ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list with owner by me', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list --owner me ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list with owner by name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list --owner ${config.username} ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list with owner by email', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list --owner ${config.email} ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list with owner by id', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list --owner ${config.accountid} ${outmode}`, (commandOut) => {
            expect(commandOut.output).toMatch(`${PRODUCT_NAME}`);
            expect(commandOut.output).toMatch(`${PRODUCT_NAME_2}`);
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list without owner value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list --owner ${outmode}`, (commandOut) => {
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('product list without output value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list -z`, ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product list -z undefined`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
});

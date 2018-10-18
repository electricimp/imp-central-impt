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

const Shell = require('shelljs');
const config = require('../config');
const ImptTestingHelper = require('../ImptTestHelper');

const TEST_PRODUCT_NAME = '__impt_test_run_product';
const TEST_DG_NAME = '__impt_test_run_dg';

// Helper class for 'impt test' commands testing.
// Contains common methods for impt test commands execution:
// creating test Product and DG, creating test config, check test run status
class ImptTestCommandsHelper {
    // Creates test Product and DG, copies test files to the tests execution folder,
    // creates test config.
    // Keys of testCreateOptions are optional 'impt test run' command options
    // ('device-file', 'agent-file', 'timeout', ...)
    static createTestEnvironment(testFilesPath, testCreateOptions) {
        return ImptTestCommandsHelper.createTestProductAndDG().
            then(() => ImptTestCommandsHelper.createTestConfig(testFilesPath, testCreateOptions));
    }

    // Creates test Product and DG
    static createTestProductAndDG() {
        return ImptTestingHelper.runCommand(`impt product create --name ${TEST_PRODUCT_NAME}`, ImptTestingHelper.checkSuccessStatus).
            then(() => ImptTestingHelper.runCommand(
                `impt dg create --name ${TEST_DG_NAME} --product ${TEST_PRODUCT_NAME}`, ImptTestingHelper.checkSuccessStatus)).
            then(() => Promise.all(config.devices.map(deviceId => 
                ImptTestingHelper.runCommand(
                    `impt device assign --device ${deviceId} --dg ${TEST_DG_NAME} --confirmed`, ImptTestingHelper.checkSuccessStatus))));
    }

    // Copies test files to the tests execution folder and creates test config.
    // Keys of testCreateOptions are optional 'impt test run' command options
    // ('device-file', 'agent-file', 'timeout', ...)
    static createTestConfig(testFilesPath, testCreateOptions) {
        Shell.cp('-Rf', `${__dirname}/${testFilesPath}/*`, ImptTestingHelper.TESTS_EXECUTION_FOLDER);
        const options = Object.keys(testCreateOptions).reduce((acc, optionName) => {
            const optionValue = testCreateOptions[optionName];
            let option = '';
            if (optionValue) {
                option = Array.isArray(optionValue) ? 
                    optionValue.reduce((opts, val) => `${opts} --${optionName} ${val}`, '') :
                    `--${optionName} ${optionValue}`;
            }
            return `${acc} ${option}`;
        }, '');
        const testCreateCommand = `impt test create --dg ${TEST_DG_NAME} --confirmed ${options}`;
        return ImptTestingHelper.runCommand(testCreateCommand, ImptTestingHelper.checkSuccessStatus);
    }

    // Removes test Product, DG and Deployments.
    static cleanUpTestEnvironment() {
        return ImptTestingHelper.runCommand(
            `impt product delete --product ${TEST_PRODUCT_NAME} --builds --force --confirmed`,
            ImptTestingHelper.emptyCheck);
    }

    // Checks success status of 'impt test run' command
    static checkTestSuccessStatus(commandOut) {
        expect(commandOut.output).toMatch('Testing succeeded');
    }

    // Checks failure status of 'impt test run' command
    static checkTestFailStatus(commandOut) {
        expect(commandOut.output).toMatch('Testing failed');
    }
}

module.exports = ImptTestCommandsHelper;

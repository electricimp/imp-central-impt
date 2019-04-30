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

const Shell = require('shelljs');
const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');

const TEST_PRODUCT_NAME = `__impt_test_run_product${config.suffix}`;
const TEST_DG_NAME = `__impt_test_run_dg${config.suffix}`;

// Helper class for 'impt test' commands testing.
// Contains common methods for impt test commands execution:
// creating test Product and DG, creating test config, check test run status
class ImptTestCommandsHelper {
    static get TEST_PRODUCT_NAME() {
        return TEST_PRODUCT_NAME;
    }

    static get TEST_DG_NAME() {
        return TEST_DG_NAME;
    }

    // Creates test Product and DG, copies test files to the tests execution folder,
    // creates test config.
    // Keys of testCreateOptions are optional 'impt test run' command options
    // ('device-file', 'agent-file', 'timeout', ...)
    static createTestEnvironment(testFilesPath, testCreateOptions) {
        return ImptTestCommandsHelper.createTestProductAndDG().
            then(() => ImptTestCommandsHelper.createTestConfig(testFilesPath, testCreateOptions));
    }

    // Creates test Product and DG
    static createTestProductAndDG(output) {
        let dg = null;
        return ImptTestHelper.createDeviceGroup(TEST_PRODUCT_NAME, TEST_DG_NAME).
            then((dgInfo) => { dg = dgInfo; }).
            then(() => ImptTestHelper.deviceAssign(TEST_DG_NAME)).
            then(() => Promise.resolve(dg)).
            then(output);
    }

    static saveDeviceInfo() {
        return ImptTestHelper.retrieveDeviceInfo(TEST_PRODUCT_NAME, TEST_DG_NAME);
    }

    // Copies test files to the tests execution folder and creates test config.
    // Keys of testCreateOptions are optional 'impt test run' command options
    // ('device-file', 'agent-file', 'timeout', ...)
    static createTestConfig(testFilesPath, testCreateOptions) {
        Shell.cp('-Rf', `${__dirname}/${testFilesPath}/*`, ImptTestHelper.TESTS_EXECUTION_FOLDER);
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
        return ImptTestHelper.runCommand(testCreateCommand, ImptTestHelper.checkSuccessStatus);
    }

    // Removes test Product, DG and Deployments.
    static cleanUpTestEnvironment() {
        return ImptTestHelper.productDelete(TEST_PRODUCT_NAME);
    }

    // Checks success status of 'impt test run' command
    static checkTestSuccessStatus(commandOut) {
        expect(commandOut.output).toMatch('Testing succeeded');
    }

    // Checks failure status of 'impt test run' command
    static checkTestFailStatus(commandOut) {
        expect(commandOut.output).toMatch('Testing failed');
    }

    // Copy files to test execution folder
    static copyFiles(testFilesPath, file = '*') {
        Shell.cp('-rf', `${__dirname}/${testFilesPath}/${file}`, ImptTestHelper.TESTS_EXECUTION_FOLDER);
        return Promise.resolve();
    }

    // Check test info
    static checkTestInfo(expectInfo = {}) {
        return ImptTestHelper.runCommand(`impt test info -z json`, (commandOut) => {
            const json = JSON.parse(commandOut.output);
            expect(json['Test Configuration']).toBeDefined;
            // Mandatory attrs check
            (expectInfo.testFiles ? expectInfo.testFiles : ["*.test.nut", "tests/**/*.test.nut"]).map(testFile =>
                expect(json['Test Configuration']['Test files']).toContain(testFile));
            expect(json['Test Configuration']['Stop on failure']).toBe(expectInfo.stopOnFailure ? expectInfo.stopOnFailure : false);
            expect(json['Test Configuration']['Allow disconnect']).toBe(expectInfo.allowDisconnect ? expectInfo.allowDisconnect : false);
            expect(json['Test Configuration']['Builder cache']).toBe(expectInfo.builderCashe ? expectInfo.builderCashe : false);
            expect(json['Test Configuration']['Timeout']).toBe(expectInfo.timeout ? expectInfo.timeout : 30);
            expect(json['Test Configuration']['Device Group'].id).toBe(expectInfo.dgId ? expectInfo.dgId : json['Test Configuration']['Device Group'].id);
            expect(json['Test Configuration']['Device Group'].name).toBe(expectInfo.dgName ? expectInfo.dgName : json['Test Configuration']['Device Group'].name);
            // not mandatory attrs check
            if (expectInfo.deviceFile) expect(json['Test Configuration']['Device file']).toBe(expectInfo.deviceFile);
            if (expectInfo.agentFile) expect(json['Test Configuration']['Agent file']).toBe(expectInfo.agentFile);
            if (expectInfo.githubConfig) expect(json['Test Configuration']['Github config']).toBe(expectInfo.githubConfig);
            if (expectInfo.builderConfig) expect(json['Test Configuration']['Builder config']).toBe(expectInfo.builderConfig);
            ImptTestHelper.checkSuccessStatus(commandOut);
        });
    }
}

module.exports = ImptTestCommandsHelper;

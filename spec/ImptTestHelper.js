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
const FS = require('fs');
const config = require('./config');
const Utils = require('../lib/util/Utils');
const UserInteractor = require('../lib/util/UserInteractor');
const child_process = require('child_process');

const TIMEOUT_MS = 300000;
const TESTS_EXECUTION_FOLDER = `${__dirname}/../__test`;
const KEY_ANSWER = {
    CTRL_C: '\x03',
    ENTER: '\n',
    YES: 'y',
    NO: 'n'
};

// Helper class for testing impt tool.
// Contains common methods for testing environment initialization and cleanup,
// running impt commands, check commands output, ...
class ImptTestHelper {
    static get TIMEOUT() {
        return TIMEOUT_MS;
    }

    static get TESTS_EXECUTION_FOLDER() {
        return TESTS_EXECUTION_FOLDER;
    }

    static get ATTR_NAME() {
        return 'name';
    }

    static get ATTR_DESCRIPTION() {
        return 'description';
    }

    static get ATTR_ID() {
        return 'id';
    }

    static get ATTR_TYPE() {
        return 'type';
    }

    static get OUTPUT_MODES() {
        const VALID_MODES = ['minimal', 'json', 'debug'];
        // default output mode present always
        let modes = [''];
        config.outputModes.forEach((item) => { if (VALID_MODES.includes(item)) modes.push(`-z ${item}`) });
        return modes;
    }

    static get KEY_ANSWER() {
        return KEY_ANSWER;
    }

    // Initializes testing environment: creates test execution folder, sets default jasmine test timeout.
    // Optionally executes 'impt auth login --local' command in the test execution folder.
    // Should be called from any test suite beforeAll method.
    static init(login = true) {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_MS;
        Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
        FS.mkdirSync(TESTS_EXECUTION_FOLDER);
        if (login) {
            const endpoint = config.apiEndpoint ? `--endpoint ${config.apiEndpoint}` : '';
            return ImptTestHelper.runCommand(
                `impt auth login --local --user ${config.email} --pwd ${config.password} ${endpoint}`,
                ImptTestHelper.checkSuccessStatus);
        }
        return Promise.resolve();
    }

    // Cleans up testing environment.
    // Should be called from any test suite afterAll method.
    static cleanUp() {
        Shell.cd(__dirname);
        Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
        return Promise.resolve();
    }

    // Executes impt command and calls outputChecker function to check the command output
    static runCommand(command, outputChecker) {
        return new Promise((resolve, reject) => {
            if (config.debug) {
                console.log('Running command: ' + command);
            }
            Shell.cd(TESTS_EXECUTION_FOLDER);
            Shell.exec(`node ${__dirname}/../bin/${command}`,
                { silent: !config.debug },
                (code, stdout, stderr) => {
                    resolve(stdout.replace(/\u001b\[.*?m/g, ''));
                }
            );
        }).then(outputChecker);
    }

    static runCommandEx(command, outputChecker) {
        return new Promise((resolve, reject) => {
            if (config.debug) {
                console.log('Running command: ' + command);
            }
            Shell.cd(TESTS_EXECUTION_FOLDER);
            Shell.exec(`node ${__dirname}/../bin/${command}`,
                { silent: !config.debug },
                (code, stdout, stderr) => {
                    resolve({ code: code, output: stdout.replace(/((\u001b\[2K.*\u001b\[1G)|(\u001b\[[0-9]{2}m))/g, '') });
                }
            );
        }).then(outputChecker);
    }

    static runCommandInteractive(command, outputChecker) {
        let out;
        return new Promise((resolve, reject) => {
            if (config.debug) {
                console.log('Running command: ' + command);
            }
            let child = Shell.exec(`node ${__dirname}/../bin/${command}`,
                { silent: !config.debug },
                (code, stdout, stderr) => {
                    resolve({ code: code, output: stdout.replace(/((\u001b\[2K.*\u001b\[1G)|(\u001b\[[0-9]{2}m))/g, '') });
                });
            child.stdin.end();
        }).then(outputChecker);
    }

    static runCommandWithTerminate(command, outputChecker) {
        var child;
        return Promise.all([
            new Promise((resolve, reject) => {
                if (config.debug) {
                    console.log('Running command: ' + command);
                }
                child = Shell.exec(`node ${__dirname}/../bin/${command}`,
                    { silent: !config.debug },
                    (code, stdout, stderr) => {
                        resolve({ code: code, output: stdout.replace(/((\u001b\[2K.*\u001b\[1G)|(\u001b\[[0-9]{2}m))/g, '') });
                    });

            }).then(outputChecker),
            this.delayMs(20000).
                then(() => child.kill('SIGINT')).
                then(() => child.kill())
        ]);
    }

    static delayMs(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    // Checks if file exist in the TESTS_EXECUTION_FOLDER
    static checkFileExist(fileName) {
        let files = Shell.find(`${TESTS_EXECUTION_FOLDER}/${fileName}`);
        expect(files).toBeNonEmptyArray();
    }

    // Checks if file not exist in the TESTS_EXECUTION_FOLDER
    static checkFileNotExist(fileName) {
        let files = Shell.find(`${TESTS_EXECUTION_FOLDER}/${fileName}`);
        expect(files.code).toBe(1);
    }

    static checkFileEqual(fileName, fileName2) {
        let file = Shell.find(`${TESTS_EXECUTION_FOLDER}/${fileName}`);
        let file2 = Shell.find(`${TESTS_EXECUTION_FOLDER}/${fileName2}`);
        expect(file).toBeNonEmptyArray();
        expect(file2).toBeNonEmptyArray();
        file = Shell.cat(`${TESTS_EXECUTION_FOLDER}/${fileName}`);
        file2 = Shell.cat(`${TESTS_EXECUTION_FOLDER}/${fileName2}`);
        expect(file).toEqual(file2);
    }

    static projectCreate(dg, dfile = 'device.nut', afile = 'agent.nut') {
        return ImptTestHelper.runCommandEx(`impt project link -g ${dg} -x ${dfile}  -y ${afile} -q`, ImptTestHelper.emptyCheckEx);
    }

    static projectDelete() {
        return ImptTestHelper.runCommandEx(`impt project delete -f -q`, ImptTestHelper.emptyCheckEx);
    }

    static deviceAssign(dg) {
        return ImptTestHelper.runCommandEx(`impt device assign -d ${config.devices[0]} -g ${dg} -q`, ImptTestHelper.emptyCheckEx);
    }

    static deviceRestart() {
        return ImptTestHelper.runCommandEx(`impt device restart -d ${config.devices[0]}`, ImptTestHelper.emptyCheckEx);
    }

    static deviceUnassign(dg) {
        return ImptTestHelper.runCommandEx(`impt dg unassign -g ${dg}`, ImptTestHelper.emptyCheckEx);
    }

    // Checks IMPT COMMAND SUCCEEDS status of the command
    static checkSuccessStatus(commandOut) {
        expect(commandOut).toMatch('IMPT COMMAND SUCCEEDS');
    }

    // Checks IMPT COMMAND FAILS status of the command
    static checkFailStatus(commandOut) {
        expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
        expect(commandOut).toMatch('IMPT COMMAND FAILS');
    }

    // Does not check command status, just check 'Access to impCentral failed or timed out' error doesn't occur.
    static emptyCheck(commandOut) {
        expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
    }

    // Checks if the command output contains the specified attribute name and value
    static checkAttribute(commandOut, attrName, attrValue) {
        expect(commandOut).toMatch(new RegExp(`${attrName}:\\s+${attrValue}`));
    }

    // Checks success return code of the command
    static checkSuccessStatusEx(commandOut) {
        expect(commandOut.code).toEqual(0);
    }

    // Checks fail return code of the command
    static checkFailStatusEx(commandOut) {
        expect(commandOut.output).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
        expect(commandOut.code).not.toEqual(0);
    }

    // Does not check command status, just check 'Access to impCentral failed or timed out' error doesn't occur.
    static emptyCheckEx(commandOut) {
        expect(commandOut.output).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
    }

    // Checks if the command output contains the specified attribute name and value
    static checkAttributeEx(commandOut, attrName, attrValue) {
        expect(commandOut.output).toMatch(new RegExp(`${attrName}"?:\\s+"?${attrValue}("|\\s)`));
    }

    // Checks if the command output contains the specified message for default or debug output mode
    static checkOutputMessageEx(outputMode, commandOut, message) {
        const matcher = outputMode.match('-(z|-output)\\s+(json|minimal)');
        if (matcher && matcher.length) expect(true).toBeTrue;
        else expect(commandOut.output).toMatch(message.replace(new RegExp(/[()\\]/g), `\\$&`));
    }

    // parse ID from command output and return id value if success, otherwise return null
    static parseId(commandOut) {
        const idMatcher = commandOut.output.match(new RegExp(`${ImptTestHelper.ATTR_ID}"?:\\s+"?([A-Za-z0-9-]+)`));
        if (idMatcher && idMatcher.length > 1) {
            return idMatcher[1];
        }
        else return null;
    }

    // parse sha from command output and return sha value if success, otherwise return null
    static parseSha(commandOut) {
        const idMatcher = commandOut.output.match(new RegExp(`sha"?:\\s+"?([A-Za-z0-9]{64})`));
        if (idMatcher && idMatcher.length > 1) {
            return idMatcher[1];
        }
        else return null;
    }
}

module.exports = ImptTestHelper;

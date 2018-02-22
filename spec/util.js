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

const TIMEOUT = 100000;
const TESTS_EXECUTION_FOLDER = `${__dirname}/../__test`;

function init() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT;
    Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
    FS.mkdirSync(TESTS_EXECUTION_FOLDER);
    return Promise.resolve();
}

function initAndLoginLocal() {
    return init().
        then(() => runCommand(`impt auth login --local --user ${config.email} --pwd ${config.password}`, checkSuccessStatus));
}

function cleanUp() {
    Shell.cd(__dirname);
    Utils.removeDirSync(TESTS_EXECUTION_FOLDER);
    return Promise.resolve();
}

function runCommand(command, outputChecker) {
    return new Promise((resolve, reject) => {
            if (config.debug) {
                console.log('Running command: ' + command);
            }
            Shell.cd(TESTS_EXECUTION_FOLDER);
            Shell.exec('node ' + __dirname + '/../bin/' + command, { silent : !config.debug }, (code, stdout, stderr) => {
                resolve(stdout);
            });
        }).
        then(outputChecker);
}

function emptyCheck(commandOut) {
    expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
}

function checkSuccessStatus(commandOut) {
    expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
    expect(commandOut).toMatch('IMPT COMMAND SUCCEEDS');
}

function checkFailStatus(commandOut) {
    expect(commandOut).not.toMatch(UserInteractor.ERRORS.ACCESS_FAILED);
    expect(commandOut).toMatch('IMPT COMMAND FAILS');
}

module.exports.init = init;
module.exports.initAndLoginLocal = initAndLoginLocal;
module.exports.cleanUp = cleanUp;
module.exports.runCommand = runCommand;
module.exports.checkSuccessStatus = checkSuccessStatus;
module.exports.checkFailStatus = checkFailStatus;
module.exports.emptyCheck = emptyCheck;
module.exports.TIMEOUT = TIMEOUT;
module.exports.TESTS_EXECUTION_FOLDER = TESTS_EXECUTION_FOLDER;

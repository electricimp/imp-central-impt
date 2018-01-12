// MIT License
//
// Copyright 2017 Electric Imp
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

const Util = require('util');
const Config = require('./Config');
const Options = require('./Options');
const Errors = require('./Errors');

const TEST_CONFIG_FILE_NAME = Util.format('.%s.test', Options.globalExecutableName);

// impt Test Config file representation
class TestConfig extends Config {

    static getEntity() {
        if (!TestConfig._config) {
            TestConfig._config = new TestConfig();
        }
        return TestConfig._config;
    }

    constructor() {
        super(Config.TYPE.TEST, TEST_CONFIG_FILE_NAME);
    }

    get deviceGroupId() {
        return this._json.deviceGroupId;
    }

    set deviceGroupId(deviceGroupId) {
        this._json.deviceGroupId = deviceGroupId;
    }

    get agentFile() {
        return this._json.agentFile;
    }

    set agentFile(agentFile) {
        this._json.agentFile = agentFile;
    }

    get deviceFile() {
        return this._json.deviceFile;
    }

    set deviceFile(deviceFile) {
        this._json.deviceFile = deviceFile;
    }

    get timeout() {
        return this._json.timeout;
    }

    set timeout(timeout) {
        this._json.timeout = timeout;
    }

    get stopOnFail() {
        return this._json.stopOnFail;
    }

    set stopOnFail(stopOnFail) {
        this._json.stopOnFail = stopOnFail;
    }

    get builderCache() {
        return this._json.builderCache;
    }

    set builderCache(builderCache) {
        this._json.builderCache = builderCache;
    }

    get allowDisconnect() {
        return this._json.allowDisconnect;
    }

    set allowDisconnect(allowDisconnect) {
        this._json.allowDisconnect = allowDisconnect;
    }

    get testFiles() {
        return this._json.testFiles;
    }

    set testFiles(testFiles) {
        this._json.testFiles = testFiles;
    }

    get githubConfig() {
        return this._json.githubConfig;
    }

    set githubConfig(githubConfig) {
        this._json.githubConfig = githubConfig;
    }

    get builderConfig() {
        return this._json.builderConfig;
    }

    set builderConfig(builderConfig) {
        this._json.builderConfig = builderConfig;
    }

    _checkConfig() {
        if (!this._json.deviceGroupId) {
            return Promise.reject(new Errors.CorruptedConfigError(this));
        }
        return Promise.resolve();
    }
}

module.exports = TestConfig;

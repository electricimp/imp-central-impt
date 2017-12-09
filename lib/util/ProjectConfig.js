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

const PROJECT_CONFIG_FILE_NAME = Util.format('.%s.project', Options.globalExecutableName);

// impt Project Config file representation
class ProjectConfig extends Config {

    static getEntity() {
        if (!ProjectConfig._config) {
            ProjectConfig._config = new ProjectConfig();
        }
        return ProjectConfig._config;
    }

    constructor() {
        super(Config.TYPE.PROJECT, PROJECT_CONFIG_FILE_NAME);
    }

    clean() {
        if (this.exists()) {
            super.clean();
        }
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

    _checkConfig() {
        if (!this._json.deviceGroupId) {
            return Promise.reject(new Errors.CorruptedConfigError(this._type, this.fileName));
        }
        return Promise.resolve();
    }
}

module.exports = ProjectConfig;

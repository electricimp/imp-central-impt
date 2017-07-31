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

const PROJECT_CONFIG_FILE_NAME = Util.format('.%s.project-settings', Options.globalExecutableName);

const DEFAULT_DEVICE_FILE_NAME = 'device.nut';
const DEFAULT_AGENT_FILE_NAME = 'agent.nut';

// build-cli Project Config file representation
class ProjectConfig extends Config {

    static getEntity() {
        if (!ProjectConfig._config) {
            ProjectConfig._config = new ProjectConfig();
        }
        return ProjectConfig._config;
    }

    constructor() {
        super('Project', PROJECT_CONFIG_FILE_NAME, false);
        this._initFiles();
    }

    clean() {
        if (this.exists()) {
            super.clean();
            this._initFiles();
        }
    }

    _initFiles() {
        if (!this.deviceFile) {
            this.deviceFile = DEFAULT_DEVICE_FILE_NAME;
        }
        if (!this.agentFile) {
            this.agentFile = DEFAULT_AGENT_FILE_NAME;
        }
    }

    get productId() {
        return this._json.productId;
    }

    set productId(productId) {
        this._json.productId = productId;
    }

    get activeDevGroupId() {
        return this._json.activeDevGroupId;
    }

    set activeDevGroupId(activeDevGroupId) {
        this._json.activeDevGroupId = activeDevGroupId;
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
        if (!this._json.productId) {
            return Promise.reject(new Errors.CorruptedConfigError(this._type, this.fileName));
        }
        return Promise.resolve();
    }
}

module.exports = ProjectConfig;

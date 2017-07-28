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
const Osenv = require('osenv');
const UserInteractor = require('./UserInteractor');
const Utils = require('./Utils');
const Errors = require('./Errors');

// Parent class for build-cli Project and Auth Configs.
class Config {
    constructor(type, configName, global = false) {
        this._type = type;
        this._fileName = this._getConfigPath(global) + configName;
        this._init();
        this._parse();
    }

    clean() {
        if (this.exists()) {
            this._init();
        }
    }

    _init() {
        this._exists = false;
        this._isValid = true;
        this._json = {};
    }

    _getConfigPath(global) {
        return global ? (Osenv.home() + '/') : './';
    }

    get fileName() {
        return this._fileName;
    }

    _parse() {
        const content = Utils.readFileSync(this._fileName);
        if (content !== null) {
            try {
                this._exists = true;
                this._json = JSON.parse(content);
            } catch (error) {
                this._isValid = false;
            }
        }
    }

    exists() {
        return this._exists;
    }

    isValid() {
        return this._isValid;
    }

    delete() {
        this._exists = false;
        return Utils.deleteFile(this._fileName);
    }

    save() {
        this._exists = true;
        return Utils.writeFile(this._fileName, JSON.stringify(this._json, null, 2));
    }

    checkConfig() {
        if (!this.exists()) {
            return Promise.reject(new Errors.NoConfigError(this._type));
        }
        if (!this.isValid()) {
            return Promise.reject(new Errors.CorruptedConfigError(this._type, this.fileName));
        }
        return this._checkConfig();
    }
}

module.exports = Config;

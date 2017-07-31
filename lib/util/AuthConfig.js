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

const AUTH_CONFIG_FILE_NAME = Util.format('.%s.auth-info', Options.globalExecutableName);

// build-cli Auth Config file representation
class AuthConfig extends Config {

    static getEntity(global) {
        if (!global) {
            if (!AuthConfig._localConfig) {
                AuthConfig._localConfig = new AuthConfig(false);
            }
            if (global === false || AuthConfig._localConfig.exists()) {
                return AuthConfig._localConfig;
            }
        }
        if (!AuthConfig._globalConfig) {
            AuthConfig._globalConfig = new AuthConfig(true);
        }
        return AuthConfig._globalConfig;
    }

    constructor(global) {
        super('Auth', AUTH_CONFIG_FILE_NAME, global);
        this._global = global;
    }

    get isGlobal() {
        return this._global;
    }

    get endpoint() {
        return this._json.endpoint;
    }

    set endpoint(endpoint) {
        this._json.endpoint = endpoint;
    }

    setAccessToken(accessToken, expiresAt) {
        this._json.accessToken = accessToken;
        this._json.expiresAt = expiresAt;
    }

    get accessToken() {
        return this._json.accessToken;
    }

    get expiresAt() {
        return this._json.expiresAt;
    }

    get refreshToken() {
        return this._json.refreshToken;
    }

    set refreshToken(refreshToken) {
        this._json.refreshToken = refreshToken;
    }

    get loginKey() {
        return this._json.loginKey;
    }

    set loginKey(loginKey) {
        this._json.loginKey = loginKey;
    }

    _checkConfig() {
        if (!this._json.refreshToken && !this._json.loginKey ||
            !this._json.accessToken || !this._json.expiresAt) {
            return Promise.reject(new Errors.CorruptedConfigError(this._type, this.fileName));
        }
        return Promise.resolve();
    }
}

module.exports = AuthConfig;

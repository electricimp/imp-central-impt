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
const Options = require('./Options');
const Config = require('./Config');
const Errors = require('./Errors');
const Osenv = require('osenv');

const AUTH_CONFIG_FILE_NAME = Util.format('.%s.auth', Options.globalExecutableName);

const LOCATION = {
    GLOBAL : 'Global',
    LOCAL : 'Local',
    ANY : 'Local/Global'
}

// impt Auth Config file representation
class AuthConfig extends Config {

    static get LOCATION() {
        return LOCATION;
    }

    static getEntity(location = null) {
        if (!location) {
            location = AuthConfig.LOCATION.ANY;
        }
        if (location !== AuthConfig.LOCATION.GLOBAL) {
            const localConfig = new AuthConfig(AuthConfig.LOCATION.LOCAL);
            if (location === AuthConfig.LOCATION.LOCAL || localConfig.exists()) {
                return localConfig;
            }
        }
        const globalConfig = new AuthConfig(AuthConfig.LOCATION.GLOBAL);
        if (location === AuthConfig.LOCATION.GLOBAL || globalConfig.exists()) {
            return globalConfig;
        }
        return new AuthConfig(AuthConfig.LOCATION.ANY);
    }

    constructor(location) {
        const configPath = (location == AuthConfig.LOCATION.GLOBAL) ? Osenv.home() : null;
        super(Config.TYPE.AUTH, AUTH_CONFIG_FILE_NAME, configPath);
        this._location = location;
    }

    save(temp = false) {
        if (temp) {
            this.loginKey = undefined;
            this.refreshToken = undefined;
        }
        return super.save();
    }

    get location() {
        return this._location;
    }

    get info() {
        return Util.format('%s %s', this._location, this._type);
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

    canRefreshToken() {
        return this.loginKey || this.refreshToken ? true : false;
    }

    _checkConfig() {
        if (!this._json.accessToken || !this._json.expiresAt) {
            return Promise.reject(new Errors.CorruptedConfigError(this));
        }
        return Promise.resolve();
    }
}

module.exports = AuthConfig;

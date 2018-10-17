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

const Util = require('util');
const Options = require('./Options');
const Config = require('./Config');
const Errors = require('./Errors');
const Osenv = require('osenv');
const UserInteractor = require('./UserInteractor');

const AUTH_CONFIG_FILE_NAME = Util.format('.%s.auth', Options.globalExecutableName);

const ENV_VAR_IMPT_AUTH_FILE_PATH = 'IMPT_AUTH_FILE_PATH';
const ENV_VAR_IMPT_LOGINKEY = 'IMPT_LOGINKEY';
const ENV_VAR_IMPT_USER = 'IMPT_USER';
const ENV_VAR_IMPT_PASSWORD = 'IMPT_PASSWORD';
const ENV_VAR_IMPT_ENDPOINT = 'IMPT_ENDPOINT';

const LOCATION = {
    GLOBAL : 'Global',
    LOCAL : 'Local',
    FILE_PATH : 'File path',
    ENV_VARS : 'Environment variables',
    ANY : 'Any'
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
        switch (location) {
            case AuthConfig.LOCATION.LOCAL:
                return new AuthConfig(AuthConfig.LOCATION.LOCAL);
            case AuthConfig.LOCATION.GLOBAL:
                return new AuthConfig(AuthConfig.LOCATION.GLOBAL);
            default:
                // local auth config
                const localConfig = new AuthConfig(AuthConfig.LOCATION.LOCAL);
                if (localConfig.exists()) {
                    return localConfig;
                }
                // auth config in IMPT_AUTH_FILE_PATH directory
                const authFilePath = process.env[ENV_VAR_IMPT_AUTH_FILE_PATH];
                if (authFilePath) {
                    return new AuthConfig(AuthConfig.LOCATION.FILE_PATH, authFilePath);
                }
                // auth with IMPT_LOGINKEY or IMPT_USER env vars
                const loginKey = process.env[ENV_VAR_IMPT_LOGINKEY];
                const user = process.env[ENV_VAR_IMPT_USER];
                if (loginKey || user) {
                    const authConfig = new AuthConfig(AuthConfig.LOCATION.ENV_VARS);
                    authConfig.endpoint = process.env[ENV_VAR_IMPT_ENDPOINT];
                    authConfig.loginKey = loginKey;
                    return authConfig;
                }
                // global auth config
                const globalConfig = new AuthConfig(AuthConfig.LOCATION.GLOBAL);
                if (globalConfig.exists()) {
                    return globalConfig;
                }
        }
        return new AuthConfig(AuthConfig.LOCATION.ANY);
    }

    constructor(location, path = null) {
        const configPath = (location == AuthConfig.LOCATION.GLOBAL) ? Osenv.home() : path;
        super(Config.TYPE.AUTH, AUTH_CONFIG_FILE_NAME, configPath);
        this._location = location;
        this._path = path;
    }

    exists() {
        return super.exists() || this._location === AuthConfig.LOCATION.ENV_VARS;
    }

    save(temp = false) {
        if (this._location === AuthConfig.LOCATION.ENV_VARS) {
            return Promise.resolve();
        }
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
        if (this._location === AuthConfig.LOCATION.LOCAL || this._location === AuthConfig.LOCATION.GLOBAL) {
            return Util.format('%s %s', this._location, this._type);
        }
        else {
            return this._type;
        }
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

    getAuthType() {
        switch (this._location) {
            case AuthConfig.LOCATION.FILE_PATH:
                return Util.format("%s: %s", UserInteractor.MESSAGES.AUTH_FILE_PATH, this._path);
            case AuthConfig.LOCATION.ENV_VARS:
                return this._location;
            default:
                return Util.format("%s %s", this._location, UserInteractor.MESSAGES.AUTH_FILE);
        }
    }

    setAuthInfo(accessToken, expiresAt, loginKey, refreshToken) {
        this.setAccessToken(accessToken, expiresAt);
        this.loginKey = loginKey;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
    }

    canRefreshToken() {
        if (this._location === AuthConfig.LOCATION.ENV_VARS || this.loginKey || this.refreshToken) {
            return true;
        }
        return false;
    }

    _checkConfig() {
        if (!this._json.accessToken || !this._json.expiresAt) {
            if (this._location === AuthConfig.LOCATION.ENV_VARS) {
                const Auth = require('../Auth');
                const loginKey = process.env[ENV_VAR_IMPT_LOGINKEY];
                const options = new Options({
                    [Options.LOGIN_KEY] : loginKey,
                    [Options.USER] : process.env[ENV_VAR_IMPT_USER],
                    [Options.PASSWORD] : process.env[ENV_VAR_IMPT_PASSWORD],
                });
                return new Auth()._login(options).
                    then(result => {
                        this.setAuthInfo(result.access_token, result.expires_at, loginKey, result.refresh_token);
                    });
            }
            return Promise.reject(new Errors.CorruptedConfigError(this));
        }
        return Promise.resolve();
    }
}

module.exports = AuthConfig;

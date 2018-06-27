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
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Errors = require('./util/Errors');
const AuthConfig = require('./util/AuthConfig');
const Options = require('./util/Options');
const Account = require('./Account');

// auth login/logout commands implementation.
class Auth {
    constructor(options, isInfo = false) {
        options = options || {};
        const location = isInfo ?
            AuthConfig.LOCATION.ANY :
            (options.local ? AuthConfig.LOCATION.LOCAL : AuthConfig.LOCATION.GLOBAL);
        this._helper = ImpCentralApiHelper.getEntity(options.endpoint, location);
        if (options.debug) {
            this._helper.debug = true;
        }
    }

    // Initializes imp-central-api library using identifier/password pair or loginKey
    // depending on the options.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _login(options) {
        if (options.loginKey) {
            return this._loginWithKey(options.loginKey);
        }
        else if (options.user) {
            return this._loginWithUser(options.user, options.password);
        }
        else {
            return UserInteractor.processNumericChoice(
                UserInteractor.MESSAGES.AUTH_CHOOSE_METHOD,
                [UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_USER_PWD, UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_LOGIN_KEY],
                [this._requestUser.bind(this), this._requestLoginKey.bind(this)],
                options);
        }
    }

    _requestUser(options) {
        return UserInteractor.prompt(Util.format(UserInteractor.MESSAGES.PROMPT_ENTER, UserInteractor.MESSAGES.AUTH_USERNAME_OR_EMAIL)).
            then((user) => this._loginWithUser(user));
    }

    _requestLoginKey(options) {
        return UserInteractor.prompt(
            Util.format(UserInteractor.MESSAGES.PROMPT_ENTER, UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_LOGIN_KEY), true).
            then((loginKey) => {
                options.setOption(Options.LOGIN_KEY, loginKey);
                return this._loginWithKey(loginKey);
            });
    }

    _loginWithKey(loginKey) {
        return this._helper.getAccessToken(loginKey);
    }

    _loginWithUser(user, password) {
        const requestPassword = password === undefined ?
            UserInteractor.prompt(Util.format(UserInteractor.MESSAGES.PROMPT_ENTER, UserInteractor.MESSAGES.AUTH_PASSWORD), true).
                then((pwd) => {
                    password = pwd;
                }) :
            Promise.resolve();
        return requestPassword.
            then(() => this._helper.login(user, password));
    }

    // 'auth login' command implementation.
    // Creates/rewrites global or local Auth Config.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    login(options) {
        const authConfig = this._helper.authConfig;
        return UserInteractor.processCancelContinueChoice(
            Util.format(UserInteractor.MESSAGES.AUTH_FILE_EXISTS, authConfig.location),
            this._login.bind(this),
            options,
            !authConfig.exists() || options.confirmed).
            then(result => {
                authConfig.clean();
                authConfig.endpoint = options.endpoint;
                authConfig.loginKey = options.loginKey;
                authConfig.setAccessToken(result.access_token, result.expires_at);
                if (result.refresh_token) {
                    authConfig.refreshToken = result.refresh_token;
                }
                return authConfig.save(options.temp);
            }).
            then(() => UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.LOGIN_SUCCESSFUL, authConfig.location)).
            catch(error => UserInteractor.processError(error));
    }

    // 'auth logout' command implementation.
    // Deletes global or local Auth Config.
    //
    // Returns:                 Nothing
    logout() {
        this._logout().
            then(() => UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.LOGOUT_SUCCESSFUL, this._helper.authConfig.location)).
            catch(error => UserInteractor.processError(error));
    }

    _logout() {
        const authConfig = this._helper.authConfig;
        if (authConfig.exists()) {
            return authConfig.delete();
        }
        else {
            return Promise.reject(new Errors.NoConfigError(authConfig, true));
        }        
    }

    _displayInfo(info) {
        UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_INFO, this._helper.authConfig.type);
        UserInteractor.printJsonData(info);
    }

    _info() {
        const authConfig = this._helper.authConfig;
        return authConfig.checkConfig().
            then(() => {
                const canRefreshToken = authConfig.canRefreshToken();
                const info = {
                    [UserInteractor.MESSAGES.AUTH_ENDPOINT] : this._helper.apiEndpoint,
                    [UserInteractor.MESSAGES.AUTH_FILE] : authConfig.location,
                    [UserInteractor.MESSAGES.AUTH_ACCESS_TOKEN_REFRESH] : canRefreshToken
                };
                let expiresIn = 0;
                if (canRefreshToken) {
                    info[UserInteractor.MESSAGES.AUTH_LOGIN_METHOD] = (authConfig.loginKey ? 
                        UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_LOGIN_KEY :
                        UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_USER_PWD);
                }
                else {
                    expiresIn = new Date(authConfig.expiresAt).getTime() - new Date().getTime();
                    info[UserInteractor.MESSAGES.AUTH_ACCESS_TOKEN] = expiresIn < 0 ? 
                        UserInteractor.MESSAGES.AUTH_ACCESS_TOKEN_EXPIRED :
                        Util.format(UserInteractor.MESSAGES.AUTH_ACCESS_TOKEN_EXPIRES_IN, Math.trunc(expiresIn / 1000 / 60));
                }
                const checker = expiresIn < 0 ?
                    Promise.resolve(null) :
                    new Account().initById('me').getEntity();
                return checker.
                    then((account) => {
                        if (account) {
                            info[UserInteractor.MESSAGES.AUTH_USERNAME] = account.username;
                            info[UserInteractor.MESSAGES.AUTH_EMAIL] = account.email;
                            info[UserInteractor.MESSAGES.AUTH_ACCOUNT_ID] = account.id;
                        }
                        this._displayInfo(info);
                    }).
                    catch(error => {
                        this._displayInfo(info);
                        throw error;
                    });
            });
    }

    // 'auth info' command implementation.
    // Displays the status and the details of the tool authentication.
    //
    // Returns:                 Nothing
    info() {
        this._info().
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }
}

module.exports = Auth;

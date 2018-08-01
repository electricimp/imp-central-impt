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
        UserInteractor.setOutputFormat(options, this._helper);
    }

    get entityType() {
        return this._helper.authConfig.type;
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
        return UserInteractor.requestOption(undefined, UserInteractor.MESSAGES.AUTH_USERNAME_OR_EMAIL).
            then((user) => this._loginWithUser(user));
    }

    _requestLoginKey(options) {
        return UserInteractor.requestOption(undefined, UserInteractor.MESSAGES.AUTH_LOGIN_METHOD_LOGIN_KEY, true).
            then((loginKey) => {
                options.setOption(Options.LOGIN_KEY, loginKey);
                return this._loginWithKey(loginKey);
            });
    }

    _loginWithKey(loginKey) {
        return this._helper.getAccessToken(loginKey);
    }

    _loginWithUser(user, password) {
        return UserInteractor.requestOption(password, UserInteractor.MESSAGES.AUTH_PASSWORD, true).
            then((pwd) => this._helper.login(user, pwd)).
            catch(error => {
                if (this._helper.isAuthOTPRequiredError(error)) {
                    // two-factor authentication enabled, one-time password required
                    if (error.body.hasOwnProperty('errors') && Array.isArray(error.body.errors) && error.body.errors.length > 0) {
                        const err = error.body.errors[0];
                        if (err.hasOwnProperty('meta') && err.meta.hasOwnProperty('login_token')) {
                            return UserInteractor.requestOption(undefined, UserInteractor.MESSAGES.AUTH_OTP, true).
                                then((otp) => this._helper.loginWithOTP(otp, err.meta.login_token));
                        }
                    }
                    throw new Errors.InternalLibraryError(UserInteractor.ERRORS.UNEXPECTED_RESPONSE_FORMAT);
                }
                throw error;
            });
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
            then(() => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.LOGIN_SUCCESSFUL, authConfig.location);
                UserInteractor.printResultWithStatus();
            }).
            catch(error => UserInteractor.processError(error));
    }

    // 'auth logout' command implementation.
    // Deletes global or local Auth Config.
    //
    // Returns:                 Nothing
    logout() {
        this._logout().
            then(() => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.LOGOUT_SUCCESSFUL, this._helper.authConfig.location);
                UserInteractor.printResultWithStatus();
            }).
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
                    new Account().initById(Account.CURR_USER).getEntity();
                return checker.
                    then((account) => {
                        if (account) {
                            info[UserInteractor.MESSAGES.AUTH_USERNAME] = account.username;
                            info[UserInteractor.MESSAGES.AUTH_EMAIL] = account.email;
                            info[UserInteractor.MESSAGES.AUTH_ACCOUNT_ID] = account.id;
                        }
                        return { [this.entityType] : info };
                    });
            });
    }

    // 'auth info' command implementation.
    // Displays the status and the details of the tool authentication.
    //
    // Returns:                 Nothing
    info() {
        this._info().
            then(info => UserInteractor.printResultWithStatus(info)).
            catch(error => UserInteractor.processError(error));
    }
}

module.exports = Auth;

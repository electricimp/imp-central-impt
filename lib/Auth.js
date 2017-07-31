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

const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Errors = require('./util/Errors');

// build-cli login/logout commands implementation.
class Auth {
    constructor(options, global = false) {
        options = options || {};
        this._helper = ImpCentralApiHelper.getEntity(options.endpoint, global);
        if (options.debug) {
            this._helper.debug = true;
        }
    }

    // Initializes imp-central-api library using identifier/password pair or loginKey
    // depending on the options.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _login(options) {
        if (options.user && options.password) {
            return this._helper.login(options.user, options.password);
        }
        else if (options.loginKey) {
            return this._helper.getAccessToken(options.loginKey);
        }
        return Promise.reject(new Errors.InternalLibraryError());
    }

    // build-cli 'login' / 'project login' commands implementation.
    // Creates/rewrites global or local Auth Config if successful or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    login(options) {
        let authConfig = this._helper.authConfig;
        authConfig.endpoint = options.endpoint;
        authConfig.loginKey = options.loginKey;
 
        this._login(options).then(result => {
            authConfig.setAccessToken(result.access_token, result.expires_at);
            if (result.refresh_token) {
                authConfig.refreshToken = result.refresh_token;
            }
            return authConfig.save().then(() => {
                UserInteractor.printMessage('Login successful');
            })
        }).catch(error => UserInteractor.processError(error));
    }

    // build-cli 'logout' / 'project logout' commands implementation.
    // Deletes global or local Auth Config.
    //
    // Returns:                 Nothing
    logout() {
        this._helper.authConfig.delete().then(() => {
            UserInteractor.printMessage('Logout successful');
        }).catch(error => UserInteractor.processError(error));
    }
}

module.exports = Auth;

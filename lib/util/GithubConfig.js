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
const Config = require('./Config');
const Options = require('./Options');
const Errors = require('./Errors');

// impt github credentials configuration representation
class GithubConfig extends Config {

    constructor(fileName) {
        super(Config.TYPE.GITHUB, fileName);
        this._isCurrDir = false;
    }

    get githubUser() {
        return this._json.githubUser;
    }

    set githubUser(githubUser) {
        this._json.githubUser = githubUser;
    }

    get githubToken() {
        return this._json.githubToken;
    }

    set githubToken(githubToken) {
        this._json.githubToken = githubToken;
    }

    _checkConfig() {
        if (!this._json.githubUser || !this._json.githubToken) {
            return Promise.reject(new Errors.CorruptedConfigError(this));
        }
        return Promise.resolve();
    }
}

module.exports = GithubConfig;

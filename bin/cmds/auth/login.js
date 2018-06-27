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

const Auth = require('../../../lib/Auth');
const Options = require('../../../lib/util/Options');
const Errors = require('../../../lib/util/Errors');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'login';
const COMMAND_SECTION = 'auth';
const COMMAND_SHORT_DESCR = 'Global or local login.';
const COMMAND_DESCRIPTION = 'Global or local login. Creates Global or Local Auth File.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const formattedCommandOptions = Options.getFormattedCommandOptions(
        '%s [%s [%s] | %s] %s',
        {
            [Options.LOCAL] : false,
            [Options.ENDPOINT] : false,
        },
        {
            [Options.USER] : true
        },
        {
            [Options.PASSWORD] : true
        },
        {
            [Options.LOGIN_KEY] : true
        },
        {
            [Options.TEMP] : false,
            [Options.CONFIRMED] : false,
            [Options.DEBUG] : false,
        });

    const options = Options.getOptions({
        [Options.LOCAL] : false,
        [Options.ENDPOINT] : false,
        [Options.USER] : false,
        [Options.PASSWORD] : false,
        [Options.LOGIN_KEY] : false,
        [Options.TEMP] : false,
        [Options.CONFIRMED] : false,
        [Options.DEBUG] : false
    });

    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, formattedCommandOptions))
        .options(options)
        .check(function (argv) {
            const opts = new Options(argv);
            if (opts.user && opts.loginKey) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_MUTUALLY_EXCLUSIVE_OPTIONS, Options.USER, Options.LOGIN_KEY);
            }
            if (opts.user === undefined && opts.password) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_COOPERATIVE_OPTIONS, Options.PASSWORD, Options.USER);
            }
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Auth(options).login(options);
};

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

const Test = require('../../../lib/Test');
const Options = require('../../../lib/util/Options');
const Errors = require('../../../lib/util/Errors');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'github';
const COMMAND_SECTION = 'test';
const COMMAND_SHORT_DESCR = 'Creates or updates a GitHub credentials file.';
const COMMAND_DESCRIPTION = COMMAND_SHORT_DESCR;

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.GITHUB_CONFIG] : {
            demandOption : true,
            describe : 'A path to the GitHub credentials file. A relative or absolute path can be used.'
        },
        [Options.USER] : {
            demandOption : false,
            describe : 'A GitHub account username.',
            _usage: '<github_username>'
        },
        [Options.PASSWORD] : {
            demandOption : false,
            describe : 'A GitHub account password or personal access token.',
            _usage: '<github_password>'
        },
        [Options.CONFIRMED] : false,
        [Options.OUTPUT] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            const opts = new Options(argv);
            if (opts.user === undefined && opts.password) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_COOPERATIVE_OPTIONS, Options.PASSWORD, Options.USER);
            }
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Test(options).github(options);
};

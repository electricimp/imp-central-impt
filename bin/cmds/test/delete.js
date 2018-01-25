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
const Util = require('util');

const COMMAND = 'delete';
const COMMAND_SECTION = 'test';
const COMMAND_SHORT_DESCR = 'Deletes Test Configuration File.';
const COMMAND_DESCRIPTION = 'Deletes Test Configuration File in the current directory.' +
    ' Does nothing if there is no Test Configuration File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.GITHUB_CONFIG] : {
            demandOption : false,
            nargs : 0,
            type : 'boolean',
            noValue : true,
            default : undefined,
            requiresArg : false,
            _usage: '',
            describe : 'Also deletes the github credentials file referenced by Test Configuration File.'
        },
        [Options.BUILDER_CONFIG] : {
            demandOption : false,
            nargs: 0,
            type : 'boolean',
            noValue : true,
            default : undefined,
            requiresArg : false,
            _usage: '',
            describe : 'Also deletes the file with Builder variables referenced by Test Configuration File.'
        },
        [Options.ENTITIES] : {
            demandOption : false,
            describe: 'Also deletes the impCentral API entities (Device Group, Product, Deployments) referenced by Test Configuration File.'
        },
        [Options.ALL] : {
            demandOption : false,
            describe: Util.format('Includes --%s, --%s and --%s options.',
                Options.GITHUB_CONFIG, Options.BUILDER_CONFIG, Options.ENTITIES)
        },
        [Options.CONFIRMED] : false,
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Test(options).delete(options);
};

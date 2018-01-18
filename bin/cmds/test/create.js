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

const Test = require('../../../lib/Test');
const Options = require('../../../lib/util/Options');

const COMMAND = 'create';
const COMMAND_SECTION = 'test';
const COMMAND_SHORT_DESCR = 'Creates Test Configuration File.';
const COMMAND_DESCRIPTION = 'Creates Test Configuration File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_GROUP_IDENTIFIER] : {
            demandOption : true,
            describe : 'Device Group Identifier of Device Group whose Devices are used for tests execution.'
        },
        [Options.DEVICE_FILE] : {
            demandOption : false,
            describe : 'A path to an optional file with IMP device source code that is deployed along with the tests.' +
                ' A relative or absolute path can be used.',
            requiresArg : false,
            nargs: 0,
            default : undefined
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe : 'A path to an optional file with IMP agent source code that is deployed along with the tests.' +
                ' A relative or absolute path can be used.',
            requiresArg : false,
            nargs: 0,
            default : undefined
        },
        [Options.TIMEOUT] : {
            demandOption : false,
            positiveInteger : true,
            default : 30
        },
        [Options.STOP_ON_FAIL] : {
            demandOption : false,
            default : false
        },
        [Options.ALLOW_DISCONNECT] : {
            demandOption : false,
            default : false
        },
        [Options.BUILDER_CACHE] : {
            demandOption : false,
            describe : 'If true or no value: cache external libraries in the local .builder-cache directory.' +
                ' If false value: do not cache external libraries. If the local .builder-cache directory exists, it is cleaned up.',
            default : false
        },
        [Options.TEST_FILE] : {
            demandOption : false,
            default : ["*.test.nut", "tests/**/*.test.nut"]
        },
        [Options.GITHUB_CONFIG] : {
            demandOption : false,
            describe : 'A path to a github credentials file. A relative or absolute path can be used. The specified file may not exist.'
        },
        [Options.BUILDER_CONFIG] : {
            demandOption : false,
            describe : 'A path to a file with *Builder* variables. A relative or absolute path can be used. The specified file may not exist.'
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
    new Test(options).create(options);
};

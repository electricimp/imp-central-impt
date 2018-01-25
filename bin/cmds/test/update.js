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

const COMMAND = 'update';
const COMMAND_SECTION = 'test';
const COMMAND_SHORT_DESCR = 'Updates Test Configuration File.';
const COMMAND_DESCRIPTION = 'Updates Test Configuration File in the current directory.' +
    ' Fails if there is no Test Configuration File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_GROUP_IDENTIFIER] : {
            demandOption : false,
            describe : 'Device Group Identifier of Device Group whose Devices are used for tests execution.'
        },
        [Options.DEVICE_FILE] : {
            demandOption : false,
            describe : 'A path to a file with IMP device source code that is deployed along with the tests.' +
                ' A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration.',
            requiresArg : false,
            nargs: 0,
            default : undefined,
            _usage: '[<device_file>]'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe : 'A path to a file with IMP agent source code that is deployed along with the tests.' +
                ' A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration.',
            requiresArg : false,
            nargs: 0,
            default : undefined,
            _usage: '[<agent_file>]'
        },
        [Options.TIMEOUT] : {
            demandOption : false,
            positiveInteger : true
        },
        [Options.STOP_ON_FAIL] : false,
        [Options.ALLOW_DISCONNECT] : false,
        [Options.BUILDER_CACHE] : {
            demandOption : false,
            describe : 'If true or no value: cache external libraries in the local .builder-cache directory.' +
                ' If false value: do not cache external libraries; in this case, if the local .builder-cache directory exists, it is cleaned up.'
        },
        [Options.TEST_FILE] : {
            demandOption : false,
            describe : 'Test file name or pattern. All files located in the current directory and all its subdirectories' +
                ' which names match the specified name or pattern are considered as files with test cases.' +
                ' The specified values fully replace the existed setting.',
        },
        [Options.GITHUB_CONFIG] : {
            demandOption : false,
            describe : 'A path to a github credentials file. A relative or absolute path can be used. The specified file may not exist.' +
                ' Specify this option w/o a value to remove a github credentials file from the test configuration.',
            requiresArg : false,
            nargs: 0,
            default : undefined,
            _usage: '[<github_credentials_file_name>]'
        },
        [Options.BUILDER_CONFIG] : {
            demandOption : false,
            describe : 'A path to a file with Builder variables. A relative or absolute path can be used. The specified file may not exist.' +
                ' Specify this option w/o a value to remove a file with Builder variables from the test configuration.',
            requiresArg : false,
            nargs: 0,
            default : undefined,
            _usage: '[<builder_file_name>]'
        },
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
    new Test(options).update(options);
};

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

const COMMAND = 'run';
const COMMAND_SECTION = 'test';
const COMMAND_SHORT_DESCR = 'Runs the tests specified by Test Configuration File.';
const COMMAND_DESCRIPTION = 'Runs the tests specified by Test Configuration File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.TESTS] : false,
        [Options.GITHUB_CONFIG] : {
            demandOption : false,
            describe : 'A path to the github credentials configuration file.' +
                ' A relative or absolute path can be used. If the value of the option is not specified,' +
                ' .impt.github-info file in the current directory is assumed.'
        },
        [Options.BUILDER_CONFIG] : {
            demandOption : false,
            describe : 'A path to the file with Builder variables. A relative or absolute path can be used.' +
                ' If the value of the option is not specified, .impt.builder file in the current directory is assumed.'
        },
        [Options.BUILDER_CACHE] : {
            demandOption : false,
            describe : 'If true or no value: cache (if not cached yet) external libraries in the local .builder-cache directory and use them' +
            	' from the cache for this test run. If false value: do not use external libraries from the cache even if they are cached.' +
            	' If not specified, the behavior is defined by the corresponding settings in Test Configuration File' +
            	' that was initialized/updated by impt test init command.'
        },
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Test(options).run(options);
};

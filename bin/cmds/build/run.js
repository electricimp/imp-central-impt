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

const Build = require('../../../lib/Build');
const Options = require('../../../lib/util/Options');

const COMMAND = 'run';
const COMMAND_SECTION = 'build';
const COMMAND_SHORT_DESCR = 'Creates, deploys and runs a build.';
const COMMAND_DESCRIPTION = 'Creates, deploys and runs a build (Deployment). Optionally, displays logs of the running build.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_GROUP_IDENTIFIER] : false,
        [Options.DEVICE_FILE] : {
            demandOption : false,
            describe : 'The device source code file name.' +
                ' If not specified, the file referenced by the Project file in the current directory is used;' +
                ' if there is no Project file, empty code is used. If the specified file does not exist, the command fails.'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe : 'The agent source code file name.' +
                ' If not specified, the file referenced by the Project file in the current directory is used;' +
                ' if there is no Project file, empty code is used. If the specified file does not exist, the command fails.'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : 'A description of the build (Deployment).',
            _usage : '<build_description>'
        },
        [Options.ORIGIN] : false,
        [Options.TAG] : false,
        [Options.FLAGGED] : false,
        [Options.CONDITIONAL] : {
            demandOption : false,
            describe : 'Trigger a conditional restart of the devices assigned to the specified Device Group instead of a normal restart.'
        },
        [Options.LOG] : false,
        [Options.OUTPUT] : false
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
    new Build(options).run(options);
};

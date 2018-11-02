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

const Log = require('../../../lib/Log');
const Options = require('../../../lib/util/Options');
const Util = require('util');

const COMMAND = 'stream';
const COMMAND_SECTION = 'log';
const COMMAND_SHORT_DESCR = 'Displays logs from the specified devices in real-time.';
const COMMAND_DESCRIPTION = 'Creates a log stream and displays logs from the specified devices in real-time.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_IDENTIFIER] : {
            demandOption : false,
            type : 'array',
            elemType : 'string',
            describe : 'The device identifier of the device to be added to the log stream.'
        },
        [Options.DEVICE_GROUP_IDENTIFIER] : {
            demandOption : false,
            type : 'array',
            elemType : 'string',
            describe : Util.format('A Device Group identifier: Device Group ID or Device Group name.' +
                ' Logs from all of the devices assigned to the specified Device Groups will be added to the log stream.' +
                ' --%s and --%s options are cumulative. If neither the --%s nor the --%s options are specified but there is' +
                ' a Project file in the current directory, all of the devices assigned to the Device Group referenced by the Project file are added.',
                Options.DEVICE_IDENTIFIER, Options.DEVICE_GROUP_IDENTIFIER, Options.DEVICE_IDENTIFIER, Options.DEVICE_GROUP_IDENTIFIER)
        },
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
    new Log(options).stream(options);
};

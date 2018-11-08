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

const COMMAND = 'get';
const COMMAND_SECTION = 'log';
const COMMAND_SHORT_DESCR = 'Displays historical logs for the specified device.';
const COMMAND_DESCRIPTION = 'Displays historical logs for the specified device. The logs are displayed with the most recent entry first.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_IDENTIFIER] : {
            demandOption : false,
            describe : 'A device identifier: Device ID, MAC address, Agent ID or Device name.' +
                ' If not specified and there is only one device in the Device Group referenced by' +
                ' the Project file in the current directory, then this device is used' +
                ' (if there is no Project file, or the Device Group has none or more than one device, the command fails).'
        },
        [Options.PAGE_SIZE] : {
            demandOption : false,
            positiveInteger : true
        },
        [Options.PAGE_NUMBER] : {
            demandOption : false,
            positiveInteger : true
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
    new Log(options).get(options);
};

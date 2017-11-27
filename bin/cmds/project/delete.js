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

const Project = require('../../../lib/Project');
const Options = require('../../../lib/util/Options');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'delete';
const COMMAND_SECTION = 'project';
const COMMAND_DESCRIPTION = 'Deletes Project File in the current directory and, optionally, the Device Group referenced by the Project File,' +
    ' the corresponding Product (if it contains one Device Group only) and the local source files.';

exports.command = COMMAND;

exports.describe = COMMAND_DESCRIPTION;

exports.builder = function (yargs) {
    const formattedCommandOptions = Options.getFormattedCommandOptions(
        '[%s | %s] %s',
        { [Options.DEVICE_GROUP] : { demandOption : true, isProjectOption : true } },
        { [Options.PRODUCT] : { demandOption : true, isProjectOption : true } },
        {
            [Options.FILES] : false,
            [Options.FORCE] : false,
            [Options.DEBUG] : false
        });

    const options = Options.getOptions({
        [Options.DEVICE_GROUP] : { demandOption : false, isProjectOption : true },
        [Options.PRODUCT] : { demandOption : false, isProjectOption : true },
        [Options.FILES] : false,
        [Options.FORCE] : false,
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, formattedCommandOptions))
        .options(options)
        .strict();
};

exports.handler = function (argv) {
    if (!Options.checkCommandArgs(argv)) {
        return;
    }
    const options = new Options(argv);
    if (options.product && options.deviceGroup) {
        UserInteractor.printErrorMessage(UserInteractor.ERRORS.CMD_MUTUALLY_EXCLUSIVE_OPTIONS, Options.PRODUCT, Options.DEVICE_GROUP);
        return;
    }
    new Project(options).delete(options);
};

// MIT License
//
// Copyright 2018-2019 Electric Imp
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

const Util = require('util');
const Project = require('../../../lib/Project');
const Options = require('../../../lib/util/Options');
const Errors = require('../../../lib/util/Errors');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'update';
const COMMAND_SECTION = 'project';
const COMMAND_SHORT_DESCR = 'Updates the Project settings and/or related Device Group attributes.';
const COMMAND_DESCRIPTION = 'Updates the Project settings and/or the name, description, or production target' +
    ' of the Device Group referenced by the Project file. Fails if there is no Project file in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.NAME] : {
            demandOption : false,
            describe : "The Project Device Group's new name. Must be unique among all Device Groups in the Product.",
            _usage : '<device_group_name>'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : "The Project Device Group's new description.",
            _usage : '<device_group_description>'
        },
        [Options.DEVICE_FILE] :  {
            demandOption : false,
            describe: 'A new device source code file name. If the file does not exist, an empty file is created.'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe: 'A new agent source code file name. If the file does not exist, an empty file is created.'
        },
        [Options.DUT] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the Project Device Group's device-under-test target Device Group." +
                " May only be specified if the Project Device Group is of the %s type." +
                " The specified device-under-test target Device Group must be of the type %s and belong to the same Product as the Project Device Group.",
                Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_PRE_DUT)
        },
        [Options.TARGET] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the Project Device Group's production target Device Group." +
                " May only be specified if the Project Device Group is of the %s type." +
                " The specified target Device Group must be of the type %s and belong to the same Product as the Project Device Group.",
                Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_PRE_PRODUCTION)
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
    new Project(options).update(options);
};

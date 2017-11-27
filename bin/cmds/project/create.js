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

const COMMAND = 'create';
const COMMAND_SECTION = 'project';
const COMMAND_DESCRIPTION = 'Creates a new Device Group for the specified Product and creates new Project File' +
    ' in the current directory by linking it to the new Device Group.';

exports.command = COMMAND;

exports.describe = COMMAND_DESCRIPTION;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.PRODUCT_IDENTIFIER] : true,
        [Options.CREATE_PRODUCT] : false,
        [Options.NAME] : {
            demandOption : true,
            describe : 'Name of the new Device Group. Must be unique among all Device Groups in the specified Product.',
            _usage : '<device_group_name>'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : 'Description of the Device Group.',
            _usage : '<device_group_description>'
        },
        [Options.DEVICE_FILE] : false,
        [Options.AGENT_FILE] : false,
        [Options.CREATE_FILES] : false,
        [Options.PRE_FACTORY] : false,
        [Options.TARGET] : {
            demandOption : false,
            describe : 'Device Group Identifier of the production target Device Group for the being created Device Group.' +
                ' The specified target Device Group must be of the type pre-production and belongs to the specified Product.'
        },
        [Options.CREATE_TARGET] : false,
        [Options.FORCE] : false,
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .strict();
};

exports.handler = function (argv) {
    if (!Options.checkCommandArgs(argv)) {
        return;
    }
    const options = new Options(argv);
    if (options.preFactory && !options.target || !options.preFactory && options.target) {
        UserInteractor.printErrorMessage(UserInteractor.ERRORS.CMD_COOPERATIVE_OPTIONS, Options.PRE_FACTORY, Options.TARGET);
        return;
    }
    new Project(options).create(options);
};

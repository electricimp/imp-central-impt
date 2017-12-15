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

const Util = require('util');
const Project = require('../../../lib/Project');
const Options = require('../../../lib/util/Options');
const Errors = require('../../../lib/util/Errors');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'update';
const COMMAND_SECTION = 'project';
const COMMAND_SHORT_DESCR = 'Updates the project settings and/or related Device Group attributes.';
const COMMAND_DESCRIPTION = 'Updates the project settings and/or Name, Description, production target of the' +
    ' Device Group referenced by Project File. Fails if there is no Project File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.NAME] : {
            demandOption : false,
            describe : 'New Name of the Device Group referenced by Project File. Must be unique among all Device Groups in the Product.',
            _usage : '<device_group_name>'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : 'New Description of the Device Group referenced by Project File.',
            _usage : '<device_group_description>'
        },
        [Options.DEVICE_FILE] :  {
            demandOption : false,
            describe: 'New name of a file for IMP device source code.'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe: 'New name of a file for IMP agent source code.'
        },
        [Options.RENAME_FILES] : false,
        [Options.CREATE_FILES] : {
            demandOption : false,
            describe : Util.format('Creates empty file(s) if the file(s) specified by --%s, --%s options does not exist.' +
                ' Should not be specified together with --%s option.',
                Options.DEVICE_FILE, Options.AGENT_FILE, Options.RENAME_FILES)
        },
        [Options.TARGET] : {
            demandOption : false,
            describe : Util.format('Device Group Identifier of the production target Device Group for the Device Group referenced by Project File.' +
                ' May be specified if the Device Group referenced by Project File is of the type %s only.' +
                ' The specified target Device Group must be of the type %s and belongs to the same Product' +
                ' as the Device Group referenced by Project File.',
                Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_PRE_PRODUCTION)
        },
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            const options = new Options(argv);
            if (options.createFiles && options.renameFiles) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_MUTUALLY_EXCLUSIVE_OPTIONS, Options.CREATE_FILES, Options.RENAME_FILES);
            }
            return true;
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Project(options).update(options);
};

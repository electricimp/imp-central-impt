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

const COMMAND = 'create';
const COMMAND_SECTION = 'project';
const COMMAND_SHORT_DESCR = 'Creates a new Device Group and a new Project file.';
const COMMAND_DESCRIPTION = 'Creates a new Device Group for the specified Product and creates a new Project file' +
    ' in the current directory by linking it to the new Device Group.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.PRODUCT_IDENTIFIER] : true,
        [Options.CREATE_PRODUCT] : false,
        [Options.NAME] : {
            demandOption : true,
            describe : 'The name of the new Device Group. Must be unique among all Device Groups in the specified Product.',
            _usage : '<device_group_name>'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : "The Device Group's optional description.",
            _usage : '<device_group_description>'
        },
        [Options.DEVICE_FILE] :  {
            demandOption : false,
            describe: 'The device source code file name. If the file does not exist, an empty file is created.',
            default: 'device.nut'
        },
        [Options.AGENT_FILE] : {
            demandOption : false,
            describe: 'The agent source code file name. If the file does not exist, an empty file is created.',
            default: 'agent.nut'
        },
        [Options.PRE_FACTORY] : false,
        [Options.DUT] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the new Project Device Group's device-under-test target Device Group." +
                " May be specified only if --%s is also specified." +
                " The specified Device Group must be of the type %s and belong to the specified Product.",
                Options.PRE_FACTORY, Options.DG_TYPE_PRE_DUT)
        },
        [Options.CREATE_DUT] : false,
        [Options.TARGET] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the new Project Device Group's production target Device Group." +
                " May be specified only if --%s is also specified." +
                " The specified Device Group must be of the type %s and belong to the specified Product.",
                Options.PRE_FACTORY, Options.DG_TYPE_PRE_PRODUCTION)
        },
        [Options.CREATE_TARGET] : false,
        [Options.CONFIRMED] : false,
        [Options.OUTPUT] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            const opts = new Options(argv);
            if (opts.preFactory && !opts.target || !opts.preFactory && opts.target) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_COOPERATIVE_OPTIONS, Options.PRE_FACTORY, Options.TARGET);
            }
            if (opts.preFactory && !opts.dut || !opts.preFactory && opts.dut) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_COOPERATIVE_OPTIONS, Options.PRE_FACTORY, Options.DUT);
            }
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Project(options).create(options);
};

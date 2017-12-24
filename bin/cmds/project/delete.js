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

const COMMAND = 'delete';
const COMMAND_SECTION = 'project';
const COMMAND_SHORT_DESCR = 'Deletes Project File and related entities.';
const COMMAND_DESCRIPTION = 'Deletes Project File in the current directory and, optionally,' +
    ' the impCentral API entities (Device Group, Product, Deployments) related to the project, and, optionally,' +
    ' the local source files. Does nothing if there is no Project File in the current directory.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.ENTITIES] : false,
        [Options.FILES] : false,
        [Options.ALL] : {
            demandOption : false,
            describe : Util.format('Includes --%s and --%s options.', Options.ENTITIES, Options.FILES)
        },
        [Options.CONFIRMED] : false,
        [Options.DEBUG] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            const options = new Options(argv);
            if (options.product && options.deviceGroup) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_MUTUALLY_EXCLUSIVE_OPTIONS, Options.PRODUCT, Options.DEVICE_GROUP);
            }
            return true;
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new Project(options).delete(options);
};

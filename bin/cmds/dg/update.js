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
const DeviceGroup = require('../../../lib/DeviceGroup');
const Options = require('../../../lib/util/Options');

const COMMAND = 'update';
const COMMAND_SECTION = 'dg';
const COMMAND_SHORT_DESCR = 'Updates the specified Device Group.';
const COMMAND_DESCRIPTION = 'Updates the specified Device Group. Fails if the specified Device Group does not exist.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.DEVICE_GROUP_IDENTIFIER] : false,
        [Options.NAME] : {
            demandOption : false,
            describe : "The Device Group's new name. Must be unique among all of the Device Groups belonging to the Product",
            _usage : '<device_group_name>'
        },
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : 'An optional description of the Device Group.',
            _usage : '<device_group_description>'
        },
        [Options.DUT] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the specified Device Group's device-under-test target Device Group." +
                " May only be specified for %s and %s Device Groups." +
                " The device-under-test target Device Group must be of the type %s or %s correspondingly," +
                " and belong to the same Product as the specified Device Group.",
                Options.DG_TYPE_FACTORY, Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_DUT, Options.DG_TYPE_PRE_DUT)
        },
        [Options.TARGET] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the specified Device Group's production target Device Group." +
                " May only be specified for %s and %s Device Groups." +
                " The target Device Group must be of the type %s or %s correspondingly," +
                " and belong to the same Product as the specified Device Group.",
                Options.DG_TYPE_FACTORY, Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_PRODUCTION, Options.DG_TYPE_PRE_PRODUCTION)
        },
        [Options.LOAD_CODE_AFTER_BLESSING] : false,
        [Options.MIN_SUPPORTED_DEPLOYMENT] : false,
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
    new DeviceGroup(options).update(options);
};

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
const Errors = require('../../../lib/util/Errors');
const UserInteractor = require('../../../lib/util/UserInteractor');

const COMMAND = 'create';
const COMMAND_SECTION = 'dg';
const COMMAND_SHORT_DESCR = 'Creates a new Device Group for the specified Product.';
const COMMAND_DESCRIPTION = 'Creates a new Device Group for the specified Product.' +
    ' Fails if a Device Group with the specified name already exists under the specified Product.';

exports.command = COMMAND;

exports.describe = COMMAND_SHORT_DESCR;

exports.builder = function (yargs) {
    const options = Options.getOptions({
        [Options.NAME] : {
            demandOption : true,
            describe : "The new Device Group's name. Must be unique among all Device Groups belonging to the specified Product.",
            _usage : '<device_group_name>'
        },
        [Options.DEVICE_GROUP_TYPE] : {
            demandOption : false,
            describe : "The new Device Group's type.",
            type : 'string',
            default: Options.DG_TYPE_DEVELOPMENT
        },
        [Options.PRODUCT_IDENTIFIER] : false,
        [Options.DESCRIPTION] : {
            demandOption : false,
            describe : 'An optional description of the Device Group.',
            _usage : '<device_group_description>'
        },
        [Options.DUT] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the new Device Group's device-under-test target Device Group." +
                " Should only be specified if the new Device Group is of the %s or %s type." +
                " The device-under-test target Device Group must be of the type %s or %s correspondingly, and belong to the specified Product.",
                Options.DG_TYPE_FACTORY, Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_DUT, Options.DG_TYPE_PRE_DUT)
        },
        [Options.TARGET] : {
            demandOption : false,
            describe : Util.format("The Device Group identifier of the new Device Group's production target Device Group." +
                " Should only be specified if the new Device Group is of the %s or %s type." +
                " The target Device Group must be of the type %s or %s correspondingly, and belong to the specified Product.",
                Options.DG_TYPE_FACTORY, Options.DG_TYPE_PRE_FACTORY, Options.DG_TYPE_PRODUCTION, Options.DG_TYPE_PRE_PRODUCTION)
        },
        [Options.REGION] : false,
        [Options.OUTPUT] : false
    });
    return yargs
        .usage(Options.getUsage(COMMAND_SECTION, COMMAND, COMMAND_DESCRIPTION, Options.getCommandOptions(options)))
        .options(options)
        .check(function (argv) {
            const opts = new Options(argv);
            if (!opts.dut && Options.isTargetRequired(opts.deviceGroupType)) {
                return new Errors.ImptError(UserInteractor.ERRORS.CMD_TARGET_REQUIRED,
                    Options.DUT, Options.getDeviceGroupTypeName(opts.deviceGroupType));
            }
            if (!opts.target && Options.isTargetRequired(opts.deviceGroupType)) {
                return new Errors.ImptError(UserInteractor.ERRORS.CMD_TARGET_REQUIRED,
                    Options.TARGET, Options.getDeviceGroupTypeName(opts.deviceGroupType));
            }
            if (opts.region && !Options.isProductionDeviceGroupType(opts.deviceGroupType)) {
                return new Errors.ImptError(
                    UserInteractor.ERRORS.WRONG_DG_TYPE_FOR_OPTION,
                    Options.REGION,
                    Options.getDeviceGroupTypeName(opts.deviceGroupType),
                    Options.DG_TYPE_PRE_PRODUCTION,
                    Options.DG_TYPE_PRODUCTION);
            }
            return Options.checkOptions(argv, options);
        })
        .strict();
};

exports.handler = function (argv) {
    const options = new Options(argv);
    new DeviceGroup(options).create(options);
};

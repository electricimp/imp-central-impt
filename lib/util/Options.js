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
const UserInteractor = require('./UserInteractor');
const Errors = require('./Errors');
const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;

const GLOBAL_EXECUTABLE_NAME = 'impt';

// Helper class for processing build-cli commands options.
class Options {
    constructor(options) {
        this._options = options;
    }

    contains(optionName) {
        return (optionName in this._options);
    }

    static get globalExecutableName() {
        return GLOBAL_EXECUTABLE_NAME;
    }

    static get DG_TYPE_PRE_FACTORY() {
        return 'pre-factory';
    }

    static get DG_TYPE_PRE_PRODUCTION() {
        return 'pre-production';
    }

    static get DG_TYPE_DEVELOPMENT() {
        return 'development';
    }

    static get DG_TYPE_FACTORY() {
        return 'factory';
    }

    static get DG_TYPE_PRODUCTION() {
        return 'production';
    }

    static checkCommandArgs(args, length = 2) {
        if (args['_'].length > length) {
            return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_UNKNOWN_ARGS, args['_'].slice(length).join(', '));
        }
        return true;
    }

    static getCommandGroupUsage(commandSection, commandDescription = null) {
        return Options.getUsage(commandSection, '<command>', commandDescription);
    }

    static getUsage(commandSection, commandName, commandDescription, options = null) {
        const fullCommandName = commandSection ? Util.format('%s %s', commandSection, commandName) : commandName;
        const usage = Util.format('\nUsage: %s %s %s',
            GLOBAL_EXECUTABLE_NAME,
            fullCommandName,
            (options ? options : '[options]'));

        if (commandDescription) {
            return Util.format('%s\n\n%s', usage, commandDescription);
        }
        else {
            return usage;
        }
    }

    static getOption(option, params) {
        if (typeof params === 'object') {
            for (let key in params) {
                if (key === 'describeFormatArgs') {
                    option.describe = Util.format(option.describe, ...params[key]);
                }
                else {
                    option[key] = params[key];
                } 
            }
        }
        else {
            option.demandOption = params;
        }
        if (option.type === 'array') {
            option.describe = option.describe + ' (may be repeated several times)';
        }
        return option;
    }

    static getOptions(keys) {
        Options.initOptions();
        let result = {};
        for (let key in keys) {
            let value = keys[key];
            if (value.isProjectOption && key in Options._projectOptions) {
                result[key] = Options.getOption(Options._projectOptions[key], value);
            }
            else if (key in Options._options) {
                result[key] = Options.getOption(Options._options[key], value);
            }
            else {
                UserInteractor.processError(new Errors.InternalLibraryError('Unexpected option'));
            }
        }
        return result;
    }

    static getCommandOptions(options, addHelp = true) {
        let result = [];
        for (let option in options) {
            const attrs = options[option];
            let curr = Util.format('--%s', option);
            if (attrs._usage.length > 0) {
                curr = Util.format('%s %s', curr, attrs._usage);
            }
            if (!attrs.demandOption) {
                curr = Util.format('[%s]', curr);
            }
            result.push(curr);
        }
        if (addHelp) {
            result.push('[--help]');
        }
        return result.join((' '));
    }

    static getFormattedCommandOptions(format, ...optionsParts) {
        const formattedParts = optionsParts.map((item, index) => {
            const isLastItem = (index === optionsParts.length - 1);
            return Options.getCommandOptions(Options.getOptions(item), isLastItem);
        });
        return Util.format(format, ...formattedParts);
    }

    static initOptions() {
        if (Options._options) {
            return;
        }
        Options._options = {
            [Options.AGENT_FILE] : {
                alias: 'y',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<agent_file>'
            },
            [Options.AGENT_ONLY] : {
                describe: 'Only file with imp agent source code is downloaded.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ASSIGNED] : {
                describe: 'List all Devices assigned to any Device Group.',
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.BUILD_IDENTIFIER] : {
                describe: 'Build Identifier: Deployment Id, sha, tag or origin.',
                alias: 'b',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<BUILD_IDENTIFIER>'
            },
            [Options.CREATE_FILES] : {
                describe: Util.format('Creates empty file(s) if the file(s) specified by --%s, --%s options does not exist.',
                    Options.DEVICE_FILE, Options.AGENT_FILE),
                alias: 'c',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.CREATE_PRODUCT] : {
                describe: Util.format('If the Product specified by --%s option does not exist, it is created.' +
                    ' In this case, the value of --%s option is considered as a Name of the new Product.' +
                    ' If the Product specified by --%s option exists, --%s option is ignored.',
                    Options.PRODUCT, Options.PRODUCT, Options.PRODUCT, Options.CREATE_PRODUCT),
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.CREATE_TARGET] : {
                describe: Util.format('Creates target Device Group if the Device Group specified by --%s option does not exist.',
                    Options.TARGET),
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.DEBUG] : {
                describe: 'Displays debug info of the command execution.',
                alias: 'z',
                type : 'boolean',
                _usage: ''
            },
            [Options.DEVICE_GROUP_ID] : {
                describe: 'List %s related to Device Group with the specified Id.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_id>'
            },
            [Options.DEVICE_GROUP_IDENTIFIER] : {
                describe: 'Device Group Identifier: Device Group Id or Device Group name.'+
                    ' If not specified, the Device Group referenced by Project File in the current directory is assumed' +
                    ' (if no Project File, the command fails).',
                alias: 'g',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.DEVICE_GROUP_NAME] : {
                describe: 'List %s related to Device Group(s) with the specified Name.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_name>'
            },
            [Options.DEVICE_GROUP_NAME] : {
                describe: 'List %s related to Device Group(s) with the specified Name.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_name>'
            },
            [Options.DEVICE_GROUP_TYPE] : {
                describe: 'Lists Device Groups of the specified type only.',
                nargs: 1,
                type : 'string',
                choices: [
                    Options.DG_TYPE_DEVELOPMENT,
                    Options.DG_TYPE_PRE_FACTORY,
                    Options.DG_TYPE_PRE_PRODUCTION,
                    Options.DG_TYPE_FACTORY,
                    Options.DG_TYPE_PRODUCTION
                ],
                requiresArg : true,
                _usage: '<device_group_type>'
            },
            [Options.DEVICE_IDENTIFIER] : {
                describe: 'Device Identifier: Device Id, MAC address, IP address, Agent Id or Device name.',
                alias: 'd',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_IDENTIFIER>'
            },
            [Options.DEVICE_FILE] : {
                alias: 'x',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_file>'
            },
            [Options.DEVICE_ONLY] : {
                describe: 'Only file with imp device source code is downloaded.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.DESCRIPTION] : {
                alias: 's',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: ''
            },
            [Options.ENDPOINT] : {
                describe: 'impCentral API endpoint URL.',
                alias: 'e',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<endpoint_url>'
            },
            [Options.FILES] : {
                describe: 'Also deletes the files referenced by Project File as files with IMP device and agent source code.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.FLAGGED] : {
                describe: 'Deployment flagged marker.',
                type : 'boolean',
                default: undefined,
                _usage: '[true|false]'
            },
            [Options.FORCE] : {
                describe: 'Forces the operation without asking a confirmation from user.',
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.FROM] : {
                describe: 'Device Group Identifier of the origin Device Group.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.FULL] : {
                describe: 'Implicitly updates or deletes other required entities in order to delete the target entity.',
                alias: '',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.LOAD_CODE_AFTER_BLESSING] : {
                describe: Util.format('Applicable to Device Group of the type %s or %s only.' +
                    ' If true or no value, production code is immediately loaded by the device after blessing.' +
                    ' If false, production code will be loaded the next time the device connects as part of BlinkUp,' +
                    ' whether successful or not. Note, the newly created production Device Group always has this option true.',
                    Options.DG_TYPE_PRODUCTION, Options.DG_TYPE_PRE_PRODUCTION),
                type : 'boolean',
                default: undefined,
                _usage: '[true|false]'
            },
            [Options.LOCAL] : {
                describe: 'Affects the local Auth File in the current directory instead of the global Auth File.',
                alias: 'l',
                type : 'boolean',
                _usage: ''
            },
            [Options.LOG] : {
                describe: 'Stream logs after the build run.',
                alias: 'l',
                type : 'boolean',
                default: undefined,
                _usage: ''
            },
            [Options.LOGIN_KEY] : {
                describe: 'Login Key id.',
                alias: 'k',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<login_key_id>'
            },
            [Options.MY] : {
                describe: 'Lists %s owned by the current logged-in account only.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.NAME] : {
                alias: 'n',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: ''
            },
            [Options.OFFLINE] : {
                describe: 'List all Devices which are offline.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ONLINE] : {
                describe: 'List all Devices which are online.',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ORIGIN] : {
                describe: 'Origin of the Deployment.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<origin>'
            },
            [Options.OWNER] : {
                describe: 'Lists %s owned by the account with the specified account id only.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<account_id>'
            },
            [Options.PASSWORD] : {
                describe: 'The account password.',
                alias: 'w',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<password>'
            },
            [Options.PRE_FACTORY] : {
                describe: Util.format('If not specified, the new Device Group is of the type %s.' +
                    ' If specified, the new Device Group is of the type %s.',
                    Options.DG_TYPE_DEVELOPMENT, Options.DG_TYPE_PRE_FACTORY),
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.PRODUCT_ID] : {
                describe: 'Lists %s which belong to the specified Product only.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<product_id>'
            },
            [Options.PRODUCT_IDENTIFIER] : {
                describe: 'Product Identifier: Product Id or Product name.',
                alias: 'p',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<PRODUCT_IDENTIFIER>'
            },
            [Options.PRODUCT_NAME] : {
                describe: 'Lists %s which belong to the specified Product only.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<product_name>'
            },
            [Options.REMOVE_TAG] : {
                describe : 'Deployment tag to be removed.',
                alias: 'r',
                type : 'array',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.RENAME_FILES] : {
                describe: Util.format('Renames file(s) (if existed) which were referenced by Project File as the file(s) with IMP device/agent' +
                    ' source code to the new name(s) specified by --%s, --%s options. Should not be specified together with --%s option.',
                    Options.DEVICE_FILE, Options.AGENT_FILE, Options.CREATE_FILES),
                alias: 'r',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.SHA] : {
                describe: 'Deployment SHA.',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<deployment_sha>'
            },
            [Options.TAG] : {
                describe : 'Deployment tag.',
                alias: 't',
                type : 'array',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.TARGET] : {
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.TEMP] : {
                describe: 'Does not save information required to refresh access token.',
                alias: 't',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.TO] : {
                describe: 'Device Group Identifier of the destination Device Group.' + 
                    ' If not specified, the Device Group referenced by Project File in the current directory is assumed' +
                    ' (if no Project File, the command fails).',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.TYPE] : {
                describe: 'Type of the Device Group.',
                nargs: 1,
                type : 'string',
                choices: [
                    Options.DG_TYPE_DEVELOPMENT,
                    Options.DG_TYPE_PRE_FACTORY,
                    Options.DG_TYPE_PRE_PRODUCTION,
                    Options.DG_TYPE_FACTORY,
                    Options.DG_TYPE_PRODUCTION
                ],
                requiresArg : true,
                _usage: '<device_group_type>'
            },
            [Options.UNASSIGNED] : {
                describe: 'List all Devices not assigned to any Device Group.',
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.UNBOND] : {
                describe: Util.format('Unbond key is required to unassign Devices from a Device Group of the type %s.',
                    Options.DG_TYPE_PRODUCTION),
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<unbond_key>'
            },
            [Options.USER] : {
                describe: 'The account identifier: username or email address.',
                alias: 'u',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<user_id>'
            }
        };
        Options._projectOptions = {
            [Options.DEVICE_GROUP] : {
                describe: 'Also deletes the Device Group referenced by Project File.' +
                    ' All Devices assigned to this Device Group to be unassigned.' +
                    ' All Deployments for this Device Group which have "flagged" attribute with value true to be updated to set it to false.',
                alias: 'g',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.PRODUCT] : {
                describe: Util.format('Includes and acts as --%s option.' +
                    ' Also deletes the Product which contains the Device Group referenced by Project File.' +
                    ' The Product can be deleted if it contains this one Device Group only.' +
                    ' Otherwise, the Product is not deleted but this is not considered as a fail,' +
                    ' the rest of the command may be completed successfully, including the Device Group deletion.',
                    Options.DEVICE_GROUP),
                alias: 'p',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            }
        };
    }

    getDeviceGroupType(typeName) {
        switch (typeName) {
            case Options.DG_TYPE_PRE_FACTORY:
                return DeviceGroups.TYPE_PRE_FACTORY_FIXTURE;
            case Options.DG_TYPE_PRE_PRODUCTION:
                return DeviceGroups.TYPE_PRE_PRODUCTION;
            case Options.DG_TYPE_FACTORY:
                return DeviceGroups.TYPE_FACTORY_FIXTURE;
            case Options.DG_TYPE_PRODUCTION:
                return DeviceGroups.TYPE_PRODUCTION;
            case Options.DG_TYPE_DEVELOPMENT:
            default:
                return DeviceGroups.TYPE_DEVELOPMENT;
        }
    }

    static getDeviceGroupTypeName(deviceGroupType) {
        switch (deviceGroupType) {
            case DeviceGroups.TYPE_PRE_FACTORY_FIXTURE:
                return Options.DG_TYPE_PRE_FACTORY;
            case DeviceGroups.TYPE_PRE_PRODUCTION:
                return Options.DG_TYPE_PRE_PRODUCTION;
            case DeviceGroups.TYPE_FACTORY_FIXTURE:
                return Options.DG_TYPE_FACTORY;
            case DeviceGroups.TYPE_PRODUCTION:
                return Options.DG_TYPE_PRODUCTION;
            case DeviceGroups.TYPE_DEVELOPMENT:
                return Options.DG_TYPE_DEVELOPMENT;
            default:
                return 'unknown';
        }
    }

    static isProductionTargetRequired(deviceGroupType) {
        return deviceGroupType === DeviceGroups.TYPE_PRE_FACTORY_FIXTURE ||
            deviceGroupType === DeviceGroups.TYPE_FACTORY_FIXTURE;
    }

    static get AGENT_FILE() {
        return 'agent-file';
    }

    get agentFile() {
        return this._options[Options.AGENT_FILE];
    }

    static get AGENT_ONLY() {
        return 'agent-only';
    }

    get agentOnly() {
        return this._options[Options.AGENT_ONLY];
    }

    static get ASSIGNED() {
        return 'assigned';
    }

    get assigned() {
        return this._options[Options.ASSIGNED];
    }

    static get BUILD_IDENTIFIER() {
        return 'build';
    }

    get buildIdentifier() {
        return this._options[Options.BUILD_IDENTIFIER];
    }

    static get CREATE_FILES() {
        return 'create-files';
    }

    get createFiles() {
        return this._options[Options.CREATE_FILES];
    }

    static get CREATE_PRODUCT() {
        return 'create-product';
    }

    get createProduct() {
        return this._options[Options.CREATE_PRODUCT];
    }

    static get CREATE_TARGET() {
        return 'create-target';
    }

    get createTarget() {
        return this._options[Options.CREATE_TARGET];
    }

    static get DEBUG() {
        return 'debug';
    }

    get debug() {
        return this._options[Options.DEBUG];
    }

    static get DESCRIPTION() {
        return 'descr';
    }

    get description() {
        return this._options[Options.DESCRIPTION];
    }

    static get DEVICE_FILE() {
        return 'device-file';
    }

    get deviceFile() {
        return this._options[Options.DEVICE_FILE];
    }

    static get DEVICE_GROUP() {
        return 'dg';
    }

    get deviceGroup() {
        return this._options[Options.DEVICE_GROUP];
    }

    static get DEVICE_GROUP_ID() {
        return 'dg-id';
    }

    get deviceGroupId() {
        return this._options[Options.DEVICE_GROUP_ID];
    }

    static get DEVICE_GROUP_IDENTIFIER() {
        return 'dg';
    }

    get deviceGroupIdentifier() {
        return this._options[Options.DEVICE_GROUP_IDENTIFIER];
    }

    static get DEVICE_GROUP_NAME() {
        return 'dg-name';
    }

    get deviceGroupName() {
        return this._options[Options.DEVICE_GROUP_NAME];
    }

    static get DEVICE_GROUP_TYPE() {
        return 'dg-type';
    }

    get deviceGroupType() {
        return this.getDeviceGroupType(this._options[Options.DEVICE_GROUP_TYPE]);
    }

    static get DEVICE_IDENTIFIER() {
        return 'device';
    }

    get deviceIdentifier() {
        return this._options[Options.DEVICE_IDENTIFIER];
    }

    static get DEVICE_ONLY() {
        return 'device-only';
    }

    get deviceOnly() {
        return this._options[Options.DEVICE_ONLY];
    }

    static get ENDPOINT() {
        return 'endpoint';
    }

    get endpoint() {
        return this._options[Options.ENDPOINT];
    }

    static get FILES() {
        return 'files';
    }

    get files() {
        return this._options[Options.FILES];
    }

    static get FLAGGED() {
        return 'flagged';
    }

    get flagged() {
        return this._options[Options.FLAGGED];
    }

    static get FORCE() {
        return 'force';
    }

    get force() {
        return this._options[Options.FORCE];
    }

    static get FROM() {
        return 'from';
    }

    get from() {
        return this._options[Options.FROM];
    }

    static get FULL() {
        return 'full';
    }

    get full() {
        return this._options[Options.FULL];
    }

    static get LOAD_CODE_AFTER_BLESSING() {
        return 'load-code-after-blessing';
    }

    get loadCodeAfterBlessing() {
        return this._options[Options.LOAD_CODE_AFTER_BLESSING];
    }

    static get LOCAL() {
        return 'local';
    }

    get local() {
        return this._options[Options.LOCAL];
    }

    static get LOG() {
        return 'log';
    }

    get log() {
        return this._options[Options.LOG];
    }

    static get LOGIN_KEY() {
        return 'lk';
    }

    get loginKey() {
        return this._options[Options.LOGIN_KEY];
    }

    static get MY() {
        return 'my';
    }

    get my() {
        return this._options[Options.MY];
    }

    static get NAME() {
        return 'name';
    }

    get name() {
        return this._options[Options.NAME];
    }

    static get OFFLINE() {
        return 'offline';
    }

    get offline() {
        return this._options[Options.OFFLINE];
    }

    static get ONLINE() {
        return 'online';
    }

    get online() {
        return this._options[Options.ONLINE];
    }

    static get ORIGIN() {
        return 'origin';
    }

    get origin() {
        return this._options[Options.ORIGIN];
    }

    static get OWNER() {
        return 'owner';
    }

    get owner() {
        return this._options[Options.OWNER];
    }

    static get PASSWORD() {
        return 'pwd';
    }

    get password() {
        return this._options[Options.PASSWORD];
    }

    static get PRE_FACTORY() {
        return 'pre-factory';
    }

    get preFactory() {
        return this._options[Options.PRE_FACTORY];
    }

    static get PRODUCT() {
        return 'product';
    }

    get product() {
        return this._options[Options.PRODUCT];
    }

    static get PRODUCT_ID() {
        return 'product-id';
    }

    get productId() {
        return this._options[Options.PRODUCT_ID];
    }

    static get PRODUCT_IDENTIFIER() {
        return 'product';
    }

    get productIdentifier() {
        return this._options[Options.PRODUCT_IDENTIFIER];
    }

    static get PRODUCT_NAME() {
        return 'product-name';
    }

    get productName() {
        return this._options[Options.PRODUCT_NAME];
    }

    static get REMOVE_TAG() {
        return 'remove-tag';
    }

    get removeTags() {
        return this._options[Options.REMOVE_TAG];
    }

    static get RENAME_FILES() {
        return 'rename-files';
    }

    get renameFiles() {
        return this._options[Options.RENAME_FILES];
    }

    static get SHA() {
        return 'sha';
    }

    get sha() {
        return this._options[Options.SHA];
    }

    static get TAG() {
        return 'tag';
    }

    get tags() {
        return this._options[Options.TAG];
    }

    static get TARGET() {
        return 'target';
    }

    get target() {
        return this._options[Options.TARGET];
    }

    static get TEMP() {
        return 'temp';
    }

    get temp() {
        return this._options[Options.TEMP];
    }

    static get TO() {
        return 'to';
    }

    get to() {
        return this._options[Options.TO];
    }

    static get TYPE() {
        return 'type';
    }

    get type() {
        return this.getDeviceGroupType(this._options[Options.TYPE]);
    }

    static get UNASSIGNED() {
        return 'unassigned';
    }

    get unassigned() {
        return this._options[Options.UNASSIGNED];
    }

    static get UNBOND() {
        return 'unbond';
    }

    get unbond() {
        return this._options[Options.UNBOND];
    }

    static get USER() {
        return 'user';
    }

    get user() {
        return this._options[Options.USER];
    }
}

module.exports = Options;

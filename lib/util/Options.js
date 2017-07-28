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

const GLOBAL_EXECUTABLE_NAME = 'climp';

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

    static checkLoginParameters(options) {
        if (!options.user && !options.loginKey) {
            UserInteractor.printError('One of "%s" and "%s" required options must be specified', Options.USER, Options.LOGIN_KEY);
            return false;
        }
        if (options.user && options.loginKey) {
            UserInteractor.printError('Options "%s" and "%s" are mutually exclusive', Options.USER, Options.LOGIN_KEY);
            return false;
        }
        if (options.user && !options.password) {
            UserInteractor.printError('Option "%s" must be specified', Options.PASSWORD);
            return false;
        }
        return true;
    }

    static checkCommandArgs(args, length = 2) {
        if (args['_'].length > length) {
            UserInteractor.printError('Unknown arguments: ' + args['_'].slice(length).join(', '));
            return false;
        }
        return true;
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

    static getCommandOptions(options) {
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
        result.push('[--help]');
        return result.join((' '));
    }

    static initOptions() {
        if (Options._options) {
            return;
        }
        Options._options = {
            [Options.PRODUCT_IDENTIFIER] : {
                describe: 'Product identifier: Product Id or Product name',
                alias: 'p',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<PRODUCT_IDENTIFIER>'
            },
            [Options.DEVICE_GROUP_IDENTIFIER] : {
                describe: 'Device Group identifier: Device Group Id or Device Group name',
                alias: 'g',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.DEVICE_IDENTIFIER] : {
                describe: 'Device identifier: Device Id, MAC address, IP address, Agent Id or Device name',
                alias: 'd',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_IDENTIFIER>'
            },
            [Options.BUILD_IDENTIFIER] : {
                describe: 'Build identifier: Deployment Id, sha, tag or origin',
                alias: 'b',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<BUILD_IDENTIFIER>'
            },
            [Options.NAME] : {
                alias: 'n',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: ''
            },
            [Options.DESCRIPTION] : {
                alias: 's',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: ''
            },
            [Options.ACTIVATE] : {
                describe: 'Marks the Device Group as Active for the current project (if exists)',
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.FORCE] : {
                describe: 'Execute the command without additional user confirmation',
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ENDPOINT] : {
                describe: 'impCentral API endpoint URL',
                alias: 'e',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<endpoint_url>'
            },
            [Options.USER] : {
                describe: 'Username or email',
                alias: 'u',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<user_id>'
            },
            [Options.PASSWORD] : {
                describe: 'User password',
                alias: 'w',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<password>'
            },
            [Options.LOGIN_KEY] : {
                describe: 'login key',
                alias: 'k',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<login_key>'
            },
            [Options.DEVICE_FILE] : {
                describe: 'Name of a file in the current directory which contains a source code for imp device',
                alias: 'x',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_file>'
            },
            [Options.AGENT_FILE] : {
                describe: 'Name of a file in the current directory which contains a source code for imp agent',
                alias: 'y',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<agent_file>'
            },
            [Options.DEVICE_ONLY] : {
                describe: 'Only file with imp device source code is downloaded',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.AGENT_ONLY] : {
                describe: 'Only file with imp agent source code is downloaded',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.CREATE_FILES] : {
                describe: 'Empty file(s) for the source code to be created if the required file(s) did not exist',
                alias: 'c',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.TAG] : {
                describe : 'Deployment tag',
                alias: 't',
                type : 'array',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.REMOVE_TAG] : {
                describe : 'Deployment tag to be removed',
                alias: 'r',
                type : 'array',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.ORIGIN] : {
                describe: 'Origin of the Deployment',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<origin>'
            },
            [Options.SHA] : {
                describe: 'Deployment SHA',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<deployment_sha>'
            },
            [Options.FLAGGED] : {
                describe: 'Deployment flagged marker',
                type : 'boolean',
                default: undefined,
                _usage: '([true]|false)'
            },
            [Options.LOG] : {
                describe: 'Stream logs after the build run',
                alias: 'l',
                type : 'boolean',
                default: undefined,
                _usage: ''
            },
            [Options.PRODUCT_ID] : {
                describe: 'List %s related to Product with the specified Id',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<product_id>'
            },
            [Options.PRODUCT_NAME] : {
                describe: 'List %s related to Product with the specified Name',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<product_name>'
            },
            [Options.DEVICE_GROUP_ID] : {
                describe: 'List %s related to Device Group with the specified Id',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_id>'
            },
            [Options.DEVICE_GROUP_NAME] : {
                describe: 'List %s related to Device Group(s) with the specified Name',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_name>'
            },
            [Options.UNASSIGNED] : {
                describe: 'List all Devices not assigned to any Device Group',
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ASSIGNED] : {
                describe: 'List all Devices assigned to any Device Group',
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ONLINE] : {
                describe: 'List all Devices which are online',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.OFFLINE] : {
                describe: 'List all Devices which are offline',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.FILES] : {
                describe: 'Deletes the local files which were specified in Project File as device/agent source files',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.LOGOUT] : {
                describe: 'Deletes Auth File (if any) located in the current directory',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.ALL] : {
                describe: 'Means --product, --files and --logout  options all together',
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            },
            [Options.DEBUG] : {
                describe: 'Enables debug output',
                type : 'boolean',
                _usage: ''
            }
        };
        Options._projectOptions = {
            [Options.ACTIVATE] : {
                describe: 'The specified Device Group become Active for the current project',
                alias: 'a',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<device_group_name>'
            },
            [Options.PRODUCT] : {
                describe: 'Deletes the corresponding Product which was specified in Project File',
                nargs: 0,
                type : 'boolean',
                _usage: ''
            }
        };
    }

    // Entity identification options

    static get PRODUCT_IDENTIFIER() {
        return 'product';
    }

    get productIdentifier() {
        return this._options[Options.PRODUCT_IDENTIFIER];
    }

    set productIdentifier(productIdentifier) {
        this._options[Options.PRODUCT_IDENTIFIER] = productIdentifier;
    }

    static get DEVICE_GROUP_IDENTIFIER() {
        return 'dg';
    }

    get deviceGroupIdentifier() {
        return this._options[Options.DEVICE_GROUP_IDENTIFIER];
    }

    static get DEVICE_IDENTIFIER() {
        return 'device';
    }

    get deviceIdentifier() {
        return this._options[Options.DEVICE_IDENTIFIER];
    }

    static get BUILD_IDENTIFIER() {
        return 'build';
    }

    get buildIdentifier() {
        return this._options[Options.BUILD_IDENTIFIER];
    }

    // Common options - are used in several different commands

    static get NAME() {
        return 'name';
    }

    get name() {
        return this._options[Options.NAME];
    }

    static get DESCRIPTION() {
        return 'descr';
    }

    get description() {
        return this._options[Options.DESCRIPTION];
    }

    static get ACTIVATE() {
        return 'activate';
    }

    get activate() {
        return this._options[Options.ACTIVATE];
    }

    static get FORCE() {
        return 'force';
    }

    get force() {
        return this._options[Options.FORCE];
    }

    // Login options

    static get ENDPOINT() {
        return 'endpoint';
    }

    get endpoint() {
        return this._options[Options.ENDPOINT];
    }

    static get USER() {
        return 'user';
    }

    get user() {
        return this._options[Options.USER];
    }

    static get PASSWORD() {
        return 'pwd';
    }

    get password() {
        return this._options[Options.PASSWORD];
    }

    static get LOGIN_KEY() {
        return 'login-key';
    }

    get loginKey() {
        return this._options[Options.LOGIN_KEY];
    }

    // Source file options

    static get DEVICE_FILE() {
        return 'device-file';
    }

    get deviceFile() {
        return this._options[Options.DEVICE_FILE];
    }

    static get AGENT_FILE() {
        return 'agent-file';
    }

    get agentFile() {
        return this._options[Options.AGENT_FILE];
    }

    static get DEVICE_ONLY() {
        return 'device-only';
    }

    get deviceOnly() {
        return this._options[Options.DEVICE_ONLY];
    }

    static get AGENT_ONLY() {
        return 'agent-only';
    }

    get agentOnly() {
        return this._options[Options.AGENT_ONLY];
    }

    static get CREATE_FILES() {
        return 'create-files';
    }

    get createFiles() {
        return this._options[Options.CREATE_FILES];
    }

    // Build options

    static get TAG() {
        return 'tag';
    }

    get tags() {
        return this._options[Options.TAG];
    }

    static get REMOVE_TAG() {
        return 'remove-tag';
    }

    get removeTags() {
        return this._options[Options.REMOVE_TAG];
    }

    static get ORIGIN() {
        return 'origin';
    }

    get origin() {
        return this._options[Options.ORIGIN];
    }

    static get SHA() {
        return 'sha';
    }

    get sha() {
        return this._options[Options.SHA];
    }

    static get FLAGGED() {
        return 'flagged';
    }

    get flagged() {
        return this._options[Options.FLAGGED];
    }

    static get LOG() {
        return 'log';
    }

    get log() {
        return this._options[Options.LOG];
    }

    // Filter options - used in list and history commands

    static get PRODUCT_ID() {
        return 'product-id';
    }

    get productId() {
        return this._options[Options.PRODUCT_ID];
    }

    static get PRODUCT_NAME() {
        return 'product-name';
    }

    get productName() {
        return this._options[Options.PRODUCT_NAME];
    }

    static get DEVICE_GROUP_ID() {
        return 'dg-id';
    }

    get deviceGroupId() {
        return this._options[Options.DEVICE_GROUP_ID];
    }

    static get DEVICE_GROUP_NAME() {
        return 'dg-name';
    }

    get deviceGroupName() {
        return this._options[Options.DEVICE_GROUP_NAME];
    }

    // Additional filter options for device list command

    static get UNASSIGNED() {
        return 'unassigned';
    }

    get unassigned() {
        return this._options[Options.UNASSIGNED];
    }

    static get ASSIGNED() {
        return 'assigned';
    }

    get assigned() {
        return this._options[Options.ASSIGNED];
    }

    static get ONLINE() {
        return 'online';
    }

    get online() {
        return this._options[Options.ONLINE];
    }

    static get OFFLINE() {
        return 'offline';
    }

    get offline() {
        return this._options[Options.OFFLINE];
    }

    // Additional options for project delete command

    static get PRODUCT() {
        return 'product';
    }

    get product() {
        return this._options[Options.PRODUCT];
    }

    static get FILES() {
        return 'files';
    }

    get files() {
        return this._options[Options.FILES];
    }

    static get LOGOUT() {
        return 'logout';
    }

    get logout() {
        return this._options[Options.LOGOUT];
    }

    static get ALL() {
        return 'all';
    }

    get all() {
        return this._options[Options.ALL];
    }

    static get DEBUG() {
        return 'debug';
    }

    get debug() {
        return this._options[Options.DEBUG];
    }
}

module.exports = Options;

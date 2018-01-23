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
const Webhooks = ImpCentralApi.Webhooks;

const GLOBAL_EXECUTABLE_NAME = 'impt';

// Helper class for processing impt commands options.
class Options {
    constructor(options = null) {
        this._options = options || {};
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

    static get WEBHOOK_MIME_JSON() {
        return 'json';
    }

    static get WEBHOOK_MIME_URLENCODED() {
        return 'urlencoded';
    }

    static checkOptions(args, options) {
        const cmdLength = 2;
        if (args['_'].length > cmdLength) {
            return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_UNKNOWN_ARGS, args['_'].slice(cmdLength).join(', '));
        }
        for (let optionName in options) {
            const option = options[optionName];
            const optionValue = args[optionName];
            if (optionValue === undefined) {
                continue;
            }
            else if (option.type !== 'array' && Array.isArray(optionValue)) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_MULTIPLE_OPTION, optionName);
            }
            else if (option.type === 'boolean' && option.noValue
                // we can only check "false" value currently, no difference between "--opt" and "--opt true" in yargs output
                && optionValue === false) { 
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_INCORRECT_VALUE, optionName, false);
            }
            else if (option.type === 'number' && (isNaN(optionValue) || typeof(optionValue) !== 'number')) {
                return new Errors.CommandSyntaxError(UserInteractor.ERRORS.CMD_NUMBER_REQUIRED, optionName);
            }
            else if (option.type === 'number' && option.positiveInteger && !Options._isPositiveInteger(optionValue)) {
                return new Errors.ImptError(UserInteractor.ERRORS.CMD_POSITIVE_INT_REQUIRED, optionName);
            }
            Options._convertOptionValue(option, optionName, optionValue, args);
        }
        return true;
    }

    static _isPositiveInteger(value) {
        return typeof(value) === 'number' && value > 0 && value === parseInt(value);
    }

    static _isString(value) {
        return typeof(value) === 'string';
    }

    static _convertOptionValue(option, optionName, optionValue, args) {
        if (option.type === 'array' && option.elemType === 'string' && Array.isArray(optionValue)) {
            if (optionValue.filter(val => !Options._isString(val)).length > 0) {
                args[optionName] = optionValue.map(val => Options._isString(val) ? val : String(val));
            }
        }
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
            if (key in Options._options) {
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
                describe: 'Downloads the source code for IMP agent only.',
                alias: 'j',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.ALL] : {
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.ALLOW_DISCONNECT] : {
                describe: 'If true or no value: keep a test session alive when a device is temporary disconnected.' +
                    ' If false value: a test session fails when a device is disconnected.',
                alias: 'a',
                type : 'boolean',
                default : undefined,
                _usage : '[true|false]'
            },
            [Options.ASSIGNED] : {
                describe: 'Lists assigned Devices only.',
                alias: 'a',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.BUILD_IDENTIFIER] : {
                describe: 'Build Identifier: Deployment Id, sha, tag or origin.' +
                    ' If not specified, the most recent Deployment for the Device Group referenced by Project File' +
                    ' in the current directory is assumed (if no Project File, the command fails).',
                alias: 'b',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<BUILD_IDENTIFIER>'
            },
            [Options.BUILDER_CACHE] : {
                alias: 'e',
                type : 'boolean',
                default : undefined,
                _usage : '[true|false]'
            },
            [Options.BUILDER_CONFIG] : {
                alias: 'j',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<builder_file_name>'
            },
            [Options.BUILDS] : {
                alias: 'b',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.CLEAR_CACHE] : {
                describe: 'Clears the local .builder-cache directory if it exists.',
                alias: 'e',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.CONDITIONAL] : {
                describe: 'Conditional restart.',
                alias: 'c',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.CONFIRMED] : {
                describe: 'Executes the operation w/o asking additional confirmation from user.',
                alias: 'q',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.CREATE_PRODUCT] : {
                describe: Util.format('If the Product specified by --%s option does not exist, it is created.' +
                    ' In this case, the value of --%s option is considered as a Name of the new Product.' +
                    ' If the Product specified by --%s option exists, --%s option is ignored.',
                    Options.PRODUCT, Options.PRODUCT, Options.PRODUCT, Options.CREATE_PRODUCT),
                alias: 'c',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.CREATE_TARGET] : {
                describe: Util.format('Creates target Device Group if the Device Group specified by --%s option does not exist.',
                    Options.TARGET),
                alias: 'r',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.DEBUG] : {
                describe: 'Displays debug info of the command execution.',
                alias: 'z',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
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
            [Options.DEVICE_GROUP_TYPE] : {
                alias: 'y',
                nargs: 1,
                type : 'array',
                elemType : 'string',
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
                describe: 'Downloads the source code for IMP device only.',
                alias: 'i',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.DESCRIPTION] : {
                alias: 's',
                nargs: 1,
                type : 'string',
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
            [Options.ENTITIES] : {
                alias: 'e',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.EVENT] : {
                describe: 'The event that triggers the Webhook.',
                alias: 'e',
                nargs: 1,
                type : 'string',
                choices: [
                    Webhooks.EVENT_BLESSING,
                    Webhooks.EVENT_BLINKUP,
                    Webhooks.EVENT_DEPLOYMENT
                ],
                requiresArg : true,
                _usage: '<triggered_event>'
            },
            [Options.FILES] : {
                describe: 'Also deletes the files referenced by Project File as files with IMP device and agent source code.',
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.FLAGGED] : {
                describe: 'If true or no value, this build (Deployment) cannot be deleted without first setting this option back to false.' +
                    ' If false or the option is not specified, the build can be deleted.',
                alias: 'f',
                type : 'boolean',
                default: undefined,
                _usage: '[true|false]'
            },
            [Options.FORCE] : {
                describe: 'Implicitly updates or deletes other required entities or attributes in order to delete the target entity.',
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.FROM] : {
                describe: 'Device Group Identifier of the origin Device Group.',
                alias: 'f',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.FULL] : {
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.GITHUB_CONFIG] : {
                alias: 'i',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<github_credentials_file_name>'
            },
            [Options.LOAD_CODE_AFTER_BLESSING] : {
                describe: Util.format('Applicable to Device Group of the type %s or %s only.' +
                    ' If true or no value, production code is immediately loaded by the device after blessing.' +
                    ' If false, production code will be loaded the next time the device connects as part of BlinkUp,' +
                    ' whether successful or not. Note, the newly created production Device Group always has this option true.',
                    Options.DG_TYPE_PRODUCTION, Options.DG_TYPE_PRE_PRODUCTION),
                alias: 'l',
                type : 'boolean',
                default: undefined,
                _usage: '[true|false]'
            },
            [Options.LOCAL] : {
                describe: 'Affects the local Auth File in the current directory instead of the global Auth File.',
                alias: 'l',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.LOG] : {
                describe: 'Starts displaying logs from the Devices assigned to the specified Device Group' +
                    ' (see impt log stream command description). To stop displaying the logs press <Ctrl-C>.',
                alias: 'l',
                nargs: 0,
                type : 'boolean',
                noValue: true,
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
            [Options.MIME] : {
                describe: 'The MIME content-type of the event data.',
                alias: 'm',
                nargs: 1,
                type : 'string',
                choices: [
                    Options.WEBHOOK_MIME_JSON,
                    Options.WEBHOOK_MIME_URLENCODED
                ],
                requiresArg : true,
                _usage: '<content_type>'
            },
            [Options.MIN_SUPPORTED_DEPLOYMENT] : {
                describe: 'Build Identifier of the new min_supported_deployment.' +
                    ' The Deployment should belong to this Device Group and should be newer than the current min_supported_deployment.',
                alias: 'm',
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
            [Options.NON_ZOMBIE] : {
                describe: 'Lists builds which have existent relation to Device Group.',
                alias: 'n',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.OFFLINE] : {
                describe: 'Lists Devices in offline state only.',
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.ONLINE] : {
                describe: 'Lists Devices in online state only.',
                alias: 'n',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.ORIGIN] : {
                describe: 'A free-form key to store the source of the code.',
                alias: 'o',
                nargs: 1,
                type : 'string',
                _usage: '<origin>'
            },
            [Options.OWNER] : {
                describe: 'Lists %s owned by the specified Account only.',
                alias: 'o',
                nargs: 1,
                type : 'array',
                elemType : 'string',
                requiresArg : true,
                _usage: '<ACCOUNT_IDENTIFIER>'
            },
            [Options.PAGE_NUMBER] : {
                describe: 'Ordinal page number with the log entries to display. Must have a positive value.' +
                    ' Page 1 is a page with the most recent log entries.' +
                    ' If specified, the command displays this page of the log entries only.' +
                    ' If not specified, the command displays all saved log entries.',
                alias: 'n',
                nargs: 1,
                type : 'number',
                requiresArg : true,
                _usage: '<page_number>'
            },
            [Options.PAGE_SIZE] : {
                describe: 'Number of log entries in one page.',
                alias: 's',
                nargs: 1,
                type : 'number',
                requiresArg : true,
                default: 20,
                _usage: '<number_of_entries>'
            },
            [Options.PASSWORD] : {
                describe: 'The account password.',
                alias: 'w',
                nargs: 1,
                type : 'string',
                _usage: '<password>'
            },
            [Options.PRE_FACTORY] : {
                describe: Util.format('If not specified, the new Device Group is of the type %s.' +
                    ' If specified, the new Device Group is of the type %s.',
                    Options.DG_TYPE_DEVELOPMENT, Options.DG_TYPE_PRE_FACTORY),
                alias: 'f',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.PRODUCT_IDENTIFIER] : {
                describe: 'Product Identifier: Product Id or Product name.' +
                    ' If not specified, the Product referenced by Project File in the current directory is assumed' +
                    ' (if no Project File, the command fails).',
                alias: 'p',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<PRODUCT_IDENTIFIER>'
            },
            [Options.REMOVE] : {
                describe: Util.format('Deletes all Deployments of the specified Device Group which are older than' +
                    ' min_supported_deployment and have "flagged" attribute set to false. This option works after --%s/--%s options.',
                    Options.UNFLAG, Options.UNFLAG_OLD),
                alias: 'r',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.REMOVE_TAG] : {
                describe : 'A tag removed from this build (Deployment).',
                alias: 'r',
                nargs: 1,
                type : 'array',
                elemType : 'string',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.SHA] : {
                describe: 'Deployment SHA.',
                alias: 's',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<deployment_sha>'
            },
            [Options.STOP_ON_FAIL] : {
                describe: 'If true or no value: the whole tests execution is stopped after a test failure.' +
                    ' If false value: the tests execution is not stopped after a failure.',
                alias: 's',
                type : 'boolean',
                _usage : '[true|false]',
                default : undefined
            },
            [Options.TAG] : {
                describe : 'A tag applied to this build (Deployment).',
                alias: 't',
                nargs: 1,
                type : 'array',
                elemType : 'string',
                requiresArg : true,
                _usage: '<tag>'
            },
            [Options.TARGET] : {
                alias: 't',
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
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.TEST_FILE] : {
                describe : 'Test file name or pattern. All files located in the current directory and all its subdirectories' +
                    ' which names match the specified name or pattern are considered as files with test cases.',
                alias: 'f',
                nargs : 1,
                type : 'array',
                elemType : 'string',
                requiresArg : true,
                _usage: '<test_file_name_pattern>'
            },
            [Options.TESTS] : {
                describe: 'A pattern to select the tests. Allows to select specific test files, test cases, test methods for execution.' +
                    ' The syntax of the pattern: [testFile][:testCase][::testMethod], where testFile may include a relative path as well as Regular Expressions.' +
                    ' If the option is missed all tests from all test files specified in Test Configuration File are executed.',
                alias: 't',
                nargs: 1,
                type : 'string',
                _usage: '<test_pattern>'
            },
            [Options.TIMEOUT] : {
                describe : 'A timeout period (in seconds) after which a test is interrupted and considered as failed.',
                alias: 't',
                nargs : 1,
                type : 'number',
                requiresArg : true,
                _usage : '<timeout>',
                default : undefined
            },
            [Options.TO] : {
                describe: 'Device Group Identifier of the destination Device Group.' + 
                    ' If not specified, the Device Group referenced by Project File in the current directory is assumed' +
                    ' (if no Project File, the command fails).',
                alias: 't',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<DEVICE_GROUP_IDENTIFIER>'
            },
            [Options.UNASSIGNED] : {
                describe: 'Lists unassigned Devices only.',
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.UNBOND] : {
                describe: Util.format('Unbond key is required to unassign Devices from a Device Group of the type %s.',
                    Options.DG_TYPE_PRODUCTION),
                alias: 'u',
                nargs: 1,
                type : 'string',
                _usage: '<unbond_key>'
            },
            [Options.UNFLAG] : {
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.UNFLAG_OLD] : {
                describe: 'Set "flagged" attribute to false in all Deployments of the specified Device Group' +
                    ' which are older than min_supported_deployment.',
                alias: 'o',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.UNFLAGGED] : {
                describe: 'Lists builds with the flagged attribute set to false only.',
                alias: 'u',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            },
            [Options.URL] : {
                describe: "The Webhook's target URL.",
                alias: 'u',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<target_url>'
            },
            [Options.USER] : {
                describe: 'The account identifier: username or email address.',
                alias: 'u',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<user_id>'
            },
            [Options.WEBHOOK_IDENTIFIER] : {
                describe: 'The Webhook id.',
                alias: 'w',
                nargs: 1,
                type : 'string',
                requiresArg : true,
                _usage: '<webhook_id>'
            },
            [Options.ZOMBIE] : {
                describe: 'Lists builds which do not have existent relation to Device Group.',
                alias: 'm',
                nargs: 0,
                type : 'boolean',
                noValue: true,
                default: undefined,
                _usage: ''
            }
        };
    }

    static getDeviceGroupType(typeName) {
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

    static getWebhookContentType(mime) {
        switch (mime) {
            case Options.WEBHOOK_MIME_JSON:
                return Webhooks.CONTENT_TYPE_JSON;
            case Options.WEBHOOK_MIME_URLENCODED:
                return Webhooks.CONTENT_TYPE_WWW_FORM;
        }
        return null;
    }

    static getWebhookMime(contentType) {
        switch (contentType) {
            case Webhooks.CONTENT_TYPE_JSON:
                return Options.WEBHOOK_MIME_JSON;
            case Webhooks.CONTENT_TYPE_WWW_FORM:
                return Options.WEBHOOK_MIME_URLENCODED;
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

    static get ALL() {
        return 'all';
    }

    get all() {
        return this._options[Options.ALL];
    }

    static get ALLOW_DISCONNECT() {
        return 'allow-disconnect';
    }

    get allowDisconnect() {
        return this._options[Options.ALLOW_DISCONNECT];
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

    static get BUILDER_CACHE() {
        return 'builder-cache';
    }

    get builderCache() {
        return this._options[Options.BUILDER_CACHE];
    }

    static get BUILDER_CONFIG() {
        return 'builder-config';
    }

    get builderConfig () {
        return this._options[Options.BUILDER_CONFIG];
    }

    static get BUILDS() {
        return 'builds';
    }

    get builds() {
        return this._options[Options.BUILDS];
    }

    static get CLEAR_CACHE() {
        return 'clear-cache';
    }

    get clearCache() {
        return this._options[Options.CLEAR_CACHE];
    }

    static get CONDITIONAL() {
        return 'conditional';
    }

    get conditional() {
        return this._options[Options.CONDITIONAL];
    }

    static get CONFIRMED() {
        return 'confirmed';
    }

    get confirmed() {
        return this._options[Options.CONFIRMED];
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

    static get DEVICE_GROUP_IDENTIFIER() {
        return 'dg';
    }

    get deviceGroupIdentifier() {
        return this._options[Options.DEVICE_GROUP_IDENTIFIER];
    }

    static get DEVICE_GROUP_TYPE() {
        return 'dg-type';
    }

    get deviceGroupType() {
        const types = this._options[Options.DEVICE_GROUP_TYPE];
        if (types !== undefined) {
            return Array.isArray(types) ?
                types.map(type => Options.getDeviceGroupType(type)) :
                Options.getDeviceGroupType(types);
        }
        return types;
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

    static get ENTITIES() {
        return 'entities';
    }

    get entities() {
        return this._options[Options.ENTITIES];
    }

    static get EVENT() {
        return 'event';
    }

    get event() {
        return this._options[Options.EVENT];
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

    static get GITHUB_CONFIG() {
        return 'github-config';
    }

    get githubConfig() {
        return this._options[Options.GITHUB_CONFIG];
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

    static get MIME() {
        return 'mime';
    }

    get mime() {
        return this._options[Options.MIME];
    }

    static get MIN_SUPPORTED_DEPLOYMENT() {
        return 'min-supported-deployment';
    }

    get minSupportedDeployment() {
        return this._options[Options.MIN_SUPPORTED_DEPLOYMENT];
    }

    static get NAME() {
        return 'name';
    }

    get name() {
        return this._options[Options.NAME];
    }

    static get NON_ZOMBIE() {
        return 'non-zombie';
    }

    get nonZombie() {
        return this._options[Options.NON_ZOMBIE];
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

    static get PAGE_NUMBER() {
        return 'page-number';
    }

    get pageNumber() {
        return this._options[Options.PAGE_NUMBER];
    }

    static get PAGE_SIZE() {
        return 'page-size';
    }

    get pageSize() {
        return this._options[Options.PAGE_SIZE];
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

    static get PRODUCT_IDENTIFIER() {
        return 'product';
    }

    get productIdentifier() {
        return this._options[Options.PRODUCT_IDENTIFIER];
    }

    static get REMOVE() {
        return 'remove';
    }

    get remove() {
        return this._options[Options.REMOVE];
    }

    static get REMOVE_TAG() {
        return 'remove-tag';
    }

    get removeTags() {
        return this._options[Options.REMOVE_TAG];
    }

    static get SHA() {
        return 'sha';
    }

    get sha() {
        return this._options[Options.SHA];
    }

    static get STOP_ON_FAIL() {
        return 'stop-on-fail';
    }

    get stopOnFail() {
        return this._options[Options.STOP_ON_FAIL];
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

    static get TEST_FILE() {
        return 'test-file';
    }

    get testFile() {
        return this._options[Options.TEST_FILE];
    }

    static get TESTS() {
        return 'tests';
    }

    get tests() {
        return this._options[Options.TESTS];
    }

    static get TIMEOUT() {
        return 'timeout';
    }

    get timeout() {
        return this._options[Options.TIMEOUT];
    }

    static get TO() {
        return 'to';
    }

    get to() {
        return this._options[Options.TO];
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

    static get UNFLAG() {
        return 'unflag';
    }

    get unflag() {
        return this._options[Options.UNFLAG];
    }

    static get UNFLAG_OLD() {
        return 'unflag-old';
    }

    get unflagOld() {
        return this._options[Options.UNFLAG_OLD];
    }

    static get UNFLAGGED() {
        return 'unflagged';
    }

    get unflagged() {
        return this._options[Options.UNFLAGGED];
    }

    static get URL() {
        return 'url';
    }

    get url() {
        return this._options[Options.URL];
    }

    static get USER() {
        return 'user';
    }

    get user() {
        return this._options[Options.USER];
    }

    static get WEBHOOK_IDENTIFIER() {
        return 'wh';
    }

    get webhookIdentifier() {
        return this._options[Options.WEBHOOK_IDENTIFIER];
    }

    static get ZOMBIE() {
        return 'zombie';
    }

    get zombie() {
        return this._options[Options.ZOMBIE];
    }
}

module.exports = Options;

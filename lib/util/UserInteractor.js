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

const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const Prompt = require('prompt-sync')();
const Util = require('util');
const CliSpinner = require('cli-spinner').Spinner;
const Colors = require('colors/safe');
const Errors = require('./Errors');
const Config = require('./Config');
const Identifier = require('./Identifier');
const JsonFormatter = require('./JsonFormatter');

const SPINNER_TEXT = 'Contacting impCentral...';

const PRINTED_ENTITIES_LIMIT = 5;

const OBJECT_VALUE_MAX_LENGTH = 512;

const SUCCESS_COMMAND_STATUS = 'IMPT COMMAND SUCCEEDS';
const FAIL_COMMAND_STATUS = 'IMPT COMMAND FAILS';
const FAIL_EXIT_CODE = 1;

const _PRODUCT = `${Identifier.ENTITY_TYPE.TYPE_PRODUCT}`;
const _DEVICE_GROUP = `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP}`;
const _DEVICE_GROUPS = `${_DEVICE_GROUP}s`;
const _DEVICE = `${Identifier.ENTITY_TYPE.TYPE_DEVICE}`;
const _DEVICES = `${_DEVICE}s`;
const _DEPLOYMENT = `${Identifier.ENTITY_TYPE.TYPE_BUILD}`;
const _DEPLOYMENTS = `${_DEPLOYMENT}s`;
const _MIN_SUPPORTED_DEPLOYMENT = `Min supported ${_DEPLOYMENT}`;

const MESSAGES = {
    LOGIN_SUCCESSFUL : '%s login is successful.',
    LOGOUT_SUCCESSFUL : '%s logout is successful.',
    ENTITY_CREATED : '%s is created successfully.',
    ENTITY_UPDATED : '%s is updated successfully.',
    ENTITY_DELETED : '%s is deleted successfully.',
    ENTITY_REMOVED : '%s is removed successfully.',
    ENTITY_ALREADY_DELETED : '%s is already deleted.',
    ENTITY_LIST : '%s list (%d items):',
    ENTITY_EMPTY_LIST : 'No %ss are found.',
    FILES_DELETED : 'Device/agent source files %s are deleted successfully.',
    DIR_DELETED : '%s %s directory is deleted successfully.',
    PROJECT_LINKED : 'Project is linked successfully.',
    CONFIG_EXISTS_CURR_DIR : 'The current directory already contains %s File. It will be overwritten.',
    CONFIG_EXISTS : '%s File %s already exists. It will be overwritten.',
    AUTH_CHOOSE_METHOD : 'Choose authentication method:',
    AUTH_FILE_EXISTS : 'The %s Auth File already exists. It will be overwritten.',
    CHOICES_CONTINUE_QUESTION : 'Are you sure you want to continue?',
    CHOICES_OPERATION_CANCELED : 'Operation is canceled.',
    CHOICES_YES_NO_PROMPT : "Enter 'y' (yes) or 'n' (no): ",
    CHOICES_INVALID_VALUE : 'Invalid value!',
    PROMPT_ENTER : 'Enter %s: ',
    RELOGIN_MSG : 'Please %s using "%s" command and then try again.',
    DELETE_CONFIG_MSG : 'Use "%s" command to delete the outdated %s.',
    NO_CONFIG_CURR_DIR_MSG : 'There is no %s File in the current directory.',
    NO_CONFIG_MSG : '%s File %s is not found.',
    DG_NO_DEVICES : `%s does not have assigned ${_DEVICES}.`,
    DG_DEVICES_RESTARTED : `Restart request for ${_DEVICES} assigned to %s is successful:`,
    DG_DEVICES_COND_RESTARTED : `Conditional restart request for ${_DEVICES} assigned to %s is successful:`,
    DG_DEVICES_UNASSIGNED : `The following ${_DEVICES} are unassigned successfully from %s:`,
    DG_DEVICES_REASSIGNED : `The following ${_DEVICES} assigned to %s are reassigned successfully to %s:`,
    DG_NO_FLAGGED_BUILDS : `No "flagged" ${_DEPLOYMENTS} are found for %s.`,
    DG_NO_BUILDS_TO_DELETE : `No ${_DEPLOYMENTS} that can be deleted are found for %s.`,
    DG_MIN_SUPPORTED_DEPLOYMENT_UPDATED : `${_MIN_SUPPORTED_DEPLOYMENT} for %s is updated successfully.`,
    DEVICE_ASSIGNED_TO_DG : '%s is assigned successfully to %s.',
    DEVICE_ALREADY_ASSIGNED_TO_DG : '%s is already assigned to %s.',
    DEVICE_REASSIGN : `%s is assigned to another ${_DEVICE_GROUP}. It will be reassigned to %s.`,
    DEVICE_RESTARTED : 'Restart request for %s is successful.',
    DEVICE_COND_RESTARTED : 'Conditional restart request for %s is successful.',
    DEVICE_UNASSIGNED : '%s is unassigned successfully.',
    DEVICE_ALREADY_UNASSIGNED : '%s is already unassigned.',
    BUILD_COPIED : '%s is copied successfully to %s.',
    BUILD_DOWNLOADED : '%s source file(s) are downloaded successfully.',
    BUILD_SOURCE_FILES_EXIST : 'Source file(s) %s already exist. They will be overwritten.',
    BUILD_RUN : '%s is run successfully.',
    BUILD_DEPLOY_FILE_NOT_SPECIFIED : '--%s option is not specified, empty %s code will be deployed.',
    LOG_GET_NEXT : 'Press <Enter> to see more logs or <Ctrl-C> to exit.',
    LOG_GET_FINISHED : 'No more logs are available.',
    LOG_STREAM_OPENED : `Log stream for ${_DEVICE}(s) %s is opened.`,
    LOG_STREAM_EXIT : 'Press <Ctrl-C> to exit.',
    LOG_STREAM_CLOSED : 'The log stream is closed.',
    LOG_STREAM_RECONNECT : 'The log stream is lost. Trying to reconnect...',
    DELETE_ENTITIES : 'The following entities will be deleted:',
    DELETE_DEVICES_UNASSIGNED : `The following ${_DEVICES} will be unassigned from ${_DEVICE_GROUPS}:`,
    DELETE_DEVICES_REMOVED : `The following ${_DEVICES} will be removed from the account:`,
    DELETE_BUILDS_FLAGGED : `The following ${_DEPLOYMENTS} are marked "flagged" to prevent deleting. They will be modified by setting "flagged" attribute to false:`,
    DELETE_FILES : 'The following files will be deleted:',
    DELETE_DIR : '%s %s directory will be deleted.',
    DELETE_CONFIG_FILE_CURR_DIR : '%s File in the current directory will be deleted.',
    DELETE_CONFIG_FILE : '%s File %s will be deleted.',
    TREE_MORE_ENTITIES : '... %d more %s(s)',
    AND_MORE_ENTITIES : 'And %d more %s(s).',
    AUTH_LOGIN_METHOD : 'Login method',
    AUTH_LOGIN_METHOD_USER_PWD : 'User/Password',
    AUTH_LOGIN_METHOD_LOGIN_KEY : 'Login Key',
    AUTH_USERNAME_OR_EMAIL : 'username or email address',
    AUTH_PASSWORD : 'password',
    AUTH_OTP : 'one-time password',
    AUTH_ENDPOINT : 'impCentral API endpoint',
    AUTH_TYPE : 'Auth type',
    AUTH_FILE : 'Auth file',
    AUTH_FILE_PATH : 'Auth file path',
    AUTH_ACCESS_TOKEN_REFRESH : 'Access token auto refresh',
    AUTH_ACCESS_TOKEN : 'Access token',
    AUTH_ACCESS_TOKEN_EXPIRED : 'expired',
    AUTH_ACCESS_TOKEN_EXPIRES_IN : 'expires in %d minutes',
    AUTH_USERNAME : 'Username',
    AUTH_EMAIL : 'Email',
    AUTH_ACCOUNT_ID : 'Account id',
    ENTITY_OWNER : 'Owner',
    ENTITY_CREATOR : 'Creator',
    ENTITY_CORRUPTED : 'Corrupted %s',
    DG_CURRENT_DEPLOYMENT : 'Current Deployment',
    DG_MIN_SUPPORTED_DEPLOYMENT : _MIN_SUPPORTED_DEPLOYMENT,
    DG_PRODUCTION_TARGET : 'Production Target',
    DG_PRODUCTION_TARGET_FOR : 'Production Target for',
    DG_DUT_TARGET : 'DUT Target',
    DG_DUT_TARGET_FOR : 'DUT Target for',
    BUILD_SOURCE_DEVICE : 'device',
    BUILD_SOURCE_AGENT : 'agent',
    TEST_GITHUB_USER : 'GitHub username',
    TEST_GITHUB_PASSWORD : 'GitHub password or personal access token',
    TEST_FILES : 'Test files',
    TEST_DEVICE_FILE : 'Device file',
    TEST_AGENT_FILE : 'Agent file',
    TEST_STOP_ON_FAILURE : 'Stop on failure',
    TEST_TIMEOUT : 'Timeout',
    TEST_ALLOW_DISCONNECT : 'Allow disconnect',
    TEST_BUILDER_CACHE : 'Builder cache',
    TEST_GITHUB_CONFIG : 'Github config',
    TEST_BUILDER_CONFIG : 'Builder config',
    TEST_DEBUG_MODE_TEMP_DIR : 'Debug mode temporary',
    TEST_STARTED_AT : 'Started at %s',
    TEST_STOP : 'Command was forced to stop',
    TEST_SUCCEEDED : 'Testing succeeded',
    TEST_SKIP_FILE : 'Skip "%s" testing',
    TEST_USE_DEVICE_GROUP : `Using ${_DEVICE_GROUP} "%s" [%s]`,
    TEST_DEPLOYMENT_CREATED : `Created ${_DEPLOYMENT}: %s`,
    TEST_SESSION_START : 'Starting test session "%s"',
    TEST_SESSION_SUCCEEDED : 'Session "%s" succeeded',
    TEST_SESSION_FAILED : 'Session "%s" failed',
    TEST_AGENT_ONLY : 'Test session is agent-only',
    TEST_USE_DEVICE : `Using ${_DEVICE} %s [%s] (%d/%d)`,
    TEST_AGENT_SOURCE : 'Using agent source file: %s',
    TEST_NO_AGENT_SOURCE : 'Have no agent source file, using blank',
    TEST_DEVICE_SOURCE : 'Using device source file: %s',
    TEST_NO_DEVICE_SOURCE : 'Have no device source file, using blank',
    TEST_SKIP_TEST : 'Skipping found test "%s"',
    TEST_FILES_FOUND : 'Found %d test file(s):',
    TEST_USE_FILE : 'Using %s test file "%s"',
    TEST_AGENT_SIZE : 'Agent code size: %d bytes',
    TEST_DEVICE_SIZE : 'Device code size: %d bytes',
    TEST_ERROR_TYPE : 'Error type: %s',
    TEST_FAILURE : 'Failure: %s',
    TEST_LOG_RECEIVED : 'Log line received: %s',
    TEST_DEVICE_RESTARTED : 'Device restarted',
    TEST_DEVICE_CODE_SPACE : 'Device code space usage: %s',
    TEST_DEVICE_DISCONNECTED_ALLOWED : 'Disconnected. Allowed by config.',
    TEST_DEVICE_POWERSTATE : 'Powerstate: %s',
    TEST_DEVICE_FIRMWARE : 'Firmware: %s',
    TEST_SESSION_RESULT : 'Tests: %d, Assertions: %d, Failures: %d',
    TEST_SUCCESS : 'Success',
    TEST_EXTERNAL_COMMAND : 'Running external command: %s',
    TEST_EXTERNAL_COMMAND_STDOUT : 'External command STDOUT: %s',
    TEST_EXTERNAL_COMMAND_STDERR : 'External command STDERR: %s',
    TEST_EXTERNAL_COMMAND_EXIT_CODE : 'External command exit code: %s',
    TEST_MESSAGE : 'Message of type %s: %s',
    TEST_WATCHDOG_STARTED : 'Watchdog "%s" started',
    TEST_WATCHDOG_STOPPED : 'Watchdog "%s" stopped',
    TEST_WATCHDOG_TIME_OUT : 'Watchdog "%s" timed out',
    TEST_SUMMARY_HEADER : '-------------TEST SUMMARY-------------',
    TEST_SUMMARY_FAILURE : '%d) %s',
    TEST_SUMMARY_AT: 'at %s',
    TEST_SUMMARY_ERROR : 'Error: %s',
    TEST_SUMMARY_FOOTER : '--------------------------------------',
    PROJECT_DEVICE_FILE : 'Device file',
    PROJECT_AGENT_FILE : 'Agent file',
    PROJECT_DEVICE_SOURCE_FILE : 'Device source file',
    PROJECT_AGENT_SOURCE_FILE : 'Agent source file',
    PROJECT_DEVICE_AGENT_FILES : 'Device/agent source files',
};

const ERRORS = {
    ERROR : 'Error',
    CMD_REQUIRED_OPTIONS : 'Either "--%s" or "--%s" option must be specified.',
    CMD_MUTUALLY_EXCLUSIVE_OPTIONS : 'Options "--%s" and "--%s" are mutually exclusive.',
    CMD_REQUIRED_OPTION : 'Option "--%s" must be specified.',
    CMD_COOPERATIVE_OPTIONS : 'Options "--%s" and "--%s" must be specified together.',
    CMD_COOPERATIVE_MULT_OPTIONS : 'Options "--%s" or "--%s" must be specified together with "--%s".',
    CMD_TARGET_REQUIRED : `Option "--%s" must be specified for ${_DEVICE_GROUP} of type "%s".`,
    CMD_UNKNOWN_ARGS : 'Unknown arguments: %s.',
    CMD_NUMBER_REQUIRED : 'Option "--%s" must be a number.',
    CMD_POSITIVE_INT_REQUIRED : 'Option "--%s" must have a positive integer value.',
    CMD_INCORRECT_VALUE : 'Option "--%s" has incorrect value "%s".',
    CMD_NON_EMPTY_VALUE : 'Option "--%s" must not be empty.',
    CMD_MULTIPLE_OPTION : 'Option "--%s" must not be specified multiple times.',
    CMD_UNKNOWN : 'Please specify a valid command.',
    CMD_IMPOSSIBLE_TO_EXECUTE : 'Impossible to execute the command.',
    NOT_LOGGED_IN : 'You are not logged in.',
    REFRESH_TOKEN_ERR : 'Impossible to refresh access token for the %s File.',
    ACCESS_TOKEN_EXPIRED : 'Access token is expired for the %s File. Information required to refresh access token is not saved.',
    CONFIG_NOT_FOUND : '%s File is not found.',
    CONFIG_CORRUPTED : '%s File is corrupted.',
    CONFIG_NOT_FOUND_CURR_DIR : '%s File is not found in the current directory.',
    CONFIG_OUTDATED : '%s, saved in %s File, does not exist anymore.',
    ACCESS_FAILED : 'Access to impCentral failed or timed out. Please check your network connection.',
    PROJECT_LINK_WRONG_DG_TYPE : `Project can not be linked to ${_DEVICE_GROUP} of the type "%s". Only "%s" or "%s" ${_DEVICE_GROUPS} are allowed.`,
    TARGET_DG_NOT_FOUND : '%s %s is not found.',
    WRONG_DG_TYPE_FOR_OPTION : `Invalid option "--%s" for ${_DEVICE_GROUP} of the type "%s". It may be specified for "%s" or "%s" ${_DEVICE_GROUPS} only.`,
    TARGET_DG_WRONG_TYPE : '%s %s is of the type "%s" but must be of the type "%s".',
    TARGET_DG_WRONG_PRODUCT : `%s ${_DEVICE_GROUP} must be from the same ${_PRODUCT}.`,
    DG_WRONG_MIN_SUPPORTED_DEPLOYMENT : `%s does not belong to %s. Impossible to set it as ${_MIN_SUPPORTED_DEPLOYMENT}.`,
    DG_OLD_MIN_SUPPORTED_DEPLOYMENT : `${_MIN_SUPPORTED_DEPLOYMENT} cannot be set to an earlier ${_DEPLOYMENT} than the current ${_MIN_SUPPORTED_DEPLOYMENT}.`,
    BUILD_DELETE_ERR : `Impossible to delete %s. It is the ${_MIN_SUPPORTED_DEPLOYMENT} or newer for %s.`,
    BUILD_DEPLOY_FILE_NOT_FOUND : 'File with IMP %s source code "%s" is not found.',
    MULTIPLE_IDENTIFIERS_FOUND : 'Multiple %ss "%s" are found:',
    MULTIPLE_IDS_FOUND : 'Multiple %ss are found:',
    NO_IDENTIFIER : 'No %s Identifier is specified.',
    ENTITY_NOT_FOUND : '%s "%s" is not found.',
    ENTITY_CORRUPTED : '%s. %s is related to corrupted %s which does not exist.',
    FILE_ERROR : 'File error: %s: %s.',
    FILE_NOT_FOUND : 'file is not found',
    INTERNAL_ERROR : 'Internal error: %s.',
    LOG_STREAM_UNEXPECTED_MSG : 'Unexpected format of log stream message: %s',
    UNEXPECTED_STATE : 'Unexpected state',
    UNEXPECTED_RESPONSE_FORMAT : 'Unexpected format of impCentral response',
    TEST_FAILED : 'Testing failed',
    TEST_DEVICE_OFFLINE : 'Device is offline',
    TEST_AGENT_SOURCE_NOT_FOUND : 'Agent source file "%s" not found',
    TEST_DEVICE_SOURCE_NOT_FOUND : 'Device source file "%s" not found',
    TEST_NO_FILES_FOUND : 'No test files found',
    TEST_DEVICE_OUT_OF_CODE_SPACE : 'Device is out of code space',
    TEST_DEVICE_OUT_OF_MEMORY : 'Device is out of memory',
    TEST_DEVICE_ERROR : 'Device Error: %s',
    TEST_DEVICE_RUNTIME_ERROR : 'Device Runtime Error: %s',
    TEST_AGENT_RUNTIME_ERROR : 'Agent Runtime Error: %s',
    TEST_DEVICE_DISCONNECTED : 'Device disconnected',
    TEST_SESSION_FAILED : 'Session failed',
    TEST_EXTERNAL_COMMAND_FAILED : 'External command failed with exit code %d',
    TEST_INVALID_SESSION_STATE : 'Invalid test session state',
    TEST_EXTERNAL_COMMAND_TIMEOUT : 'External command timed out',
    TEST_SESSION_TIMEOUT : 'Session startup timeout',
    TEST_TIMEOUT : 'Testing timeout',
    WRONG_IDENTIFIER_TYPE : 'Wrong identifier type',
    WRONG_ENTITY_TYPE : 'Wrong entity type',
    WRONG_OPTION : 'Unexpected option',
};

const OUTPUT_FORMAT = {
    TEXT : 'TEXT',
    JSON : 'JSON'
};

const OUTPUT_LEVEL = {
    RESULT : 1,
    INFO : 2,
    DEBUG : 3
};

// Helper class for interactions with a user.
class UserInteractor {
    static get MESSAGES() {
        return MESSAGES;
    }

    static get ERRORS() {
        return ERRORS;
    }

    static get PRINTED_ENTITIES_LIMIT() {
        return PRINTED_ENTITIES_LIMIT;
    }

    static setOutputFormat(options, impCentralApiHelper) {
        const Options = require('./Options');
        switch (options.output) {
            case Options.OUTPUT_MINIMAL:
                UserInteractor._outputLevel = OUTPUT_LEVEL.RESULT;
                break;
            case Options.OUTPUT_JSON:
                UserInteractor._outputFormat = OUTPUT_FORMAT.JSON;
                UserInteractor._outputLevel = OUTPUT_LEVEL.RESULT;
                break;
            case Options.OUTPUT_DEBUG:
                impCentralApiHelper.debug = true;
                UserInteractor._outputLevel = OUTPUT_LEVEL.DEBUG;
                break;
        }

        if (UserInteractor._outputLevel === OUTPUT_LEVEL.RESULT ||
            UserInteractor._outputLevel === OUTPUT_LEVEL.DEBUG) {
            UserInteractor.enableSpinner(false);
        }
    }

    static isOutputJson() {
        return UserInteractor._outputFormat === OUTPUT_FORMAT.JSON;
    }

    static isOutputText() {
        return UserInteractor._outputFormat === OUTPUT_FORMAT.TEXT;
    }

    static isOutputLevelDebugEnabled() {
        return UserInteractor._outputLevel >= OUTPUT_LEVEL.DEBUG;
    }

    static isOutputLevelInfoEnabled() {
        return UserInteractor._outputLevel >= OUTPUT_LEVEL.INFO;
    }

    static _printMessage(message, ...args) {
        UserInteractor.spinnerStop();
        console.log(message, ...args);
    }

    static printError(message, ...args) {
        UserInteractor.spinnerStop();
        if (UserInteractor.isOutputText()) {
            console.log('%s: %s', UserInteractor.ERRORS.ERROR, Util.format(message, ...args));
        }
        else {
            UserInteractor.printObject({ [UserInteractor.ERRORS.ERROR] : Util.format(message, ...args) });
        }
    }

    static printErrorWithStatus(message, ...args) {
        UserInteractor.printError(message, ...args);
        UserInteractor.printErrorStatus();
    }

    static printErrorStatus() {
        UserInteractor.printInfo(FAIL_COMMAND_STATUS);
        process.exit(FAIL_EXIT_CODE);
    }

    static printSuccessStatus() {
        UserInteractor.printInfo(SUCCESS_COMMAND_STATUS);
    }

    static printResultWithStatus(object = null) {
        UserInteractor.printObject(object);
        UserInteractor.printSuccessStatus();
    }

    static printInfo(message, ...args) {
        if (UserInteractor.isOutputLevelInfoEnabled()) {
            UserInteractor._printMessage(message, ...args);
        }
    }

    static printObjectInfo(object) {
        if (UserInteractor.isOutputLevelInfoEnabled()) {
            UserInteractor.printObject(object, true, true);
        }
    }

    static printDialog(message, ...args) {
        UserInteractor._printMessage(message, ...args);
    }

    static printObjectDialog(object) {
        UserInteractor._printObjectAsText(object, true, true);
    }

    static objectValueFormatter(value) {
        if (UserInteractor.isOutputText() && typeof(value) === 'string' && value.length > OBJECT_VALUE_MAX_LENGTH) {
            return value.substring(0, OBJECT_VALUE_MAX_LENGTH) + '\n...';
        }
        if (Array.isArray(value) && value.length === 0) {
            return '';
        }
        if (value === null || value === undefined) {
            return '';
        }
        return value;
    }

    static corruptedObject(object) {
        if (UserInteractor._outputLevel === OUTPUT_LEVEL.RESULT) {
            return object;
        }
        if (Array.isArray(object)) {
            return object.map(elem => UserInteractor.corruptedObject(elem));
        }
        else if (typeof object === 'object') {
            let result = {};
            for (let key in object) {
                result[UserInteractor.corruptedObject(key)] = UserInteractor.corruptedObject(object[key]);
            }
            return result;
        }
        return Colors.red(object);
    }

    static printObject(object, inlineArrays = true, truncArrays = false) {
        switch (UserInteractor._outputFormat) {
            case OUTPUT_FORMAT.JSON:
                UserInteractor._printObjectAsJson(object);
                break;
            case OUTPUT_FORMAT.TEXT:
                UserInteractor._printObjectAsText(object, inlineArrays, truncArrays);
                break;
            default:
                throw new Errors.InternalLibraryError();
        }
    }

    static _printObjectAsJson(object) {
        if (object === null || object === undefined) {
            object = {};
        }
        console.log(JSON.stringify(object, null, 2));
    }

    static _printObjectAsText(object, inlineArrays = true, truncArrays = false) {
        UserInteractor.spinnerStop();
        if (!object || Array.isArray(object) && object.length === 0 || Object.keys(object).length === 0) {
            return;
        }
        let objectToPrint = object;
        let truncData = false;
        if (truncArrays && Array.isArray(object)) {
            truncData = object.length > PRINTED_ENTITIES_LIMIT;
            if (truncData) {
                objectToPrint = object.slice(0, PRINTED_ENTITIES_LIMIT);
            }
        }
        const jsonFormatter = new JsonFormatter({
            noColor : UserInteractor._outputLevel === OUTPUT_LEVEL.RESULT,
            inlineArrays : inlineArrays
        });
        UserInteractor._printMessage(jsonFormatter.render(objectToPrint));
        if (truncData) {
            UserInteractor._printMessage(UserInteractor.MESSAGES.AND_MORE_ENTITIES,
                object.length - objectToPrint.length, Object.keys(object[0])[0]);
        }
    }

    static processError(error) {
        UserInteractor.spinnerStop();
        if (UserInteractor.isOutputLevelDebugEnabled()) {
            UserInteractor._printMessage(error);
        }
        const globalExecutableName = require('./Options').globalExecutableName;

        if (error instanceof Errors.InternalLibraryError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.INTERNAL_ERROR, 
                error.message || UserInteractor.ERRORS.UNEXPECTED_STATE);
        }
        else if (error instanceof Errors.RefreshTokenError) {
            UserInteractor.printError(UserInteractor.ERRORS.REFRESH_TOKEN_ERR, error._authConfig.info);
            UserInteractor.reloginMessage(error._authConfig);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.AccessTokenExpiredError) {
            UserInteractor.printError(UserInteractor.ERRORS.ACCESS_TOKEN_EXPIRED, error._authConfig.info);
            UserInteractor.reloginMessage(error._authConfig);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.EntityNotFoundError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ENTITY_NOT_FOUND, error._entityType, error._identifier);
        }
        else if (error instanceof Errors.CorruptedRelatedEntityError) {
            if (UserInteractor.isOutputText()) {
                UserInteractor.printError(UserInteractor.ERRORS.ENTITY_CORRUPTED, 
                    UserInteractor.ERRORS.UNEXPECTED_STATE, error._relatedIdentifier, error._identifier);
            }
        }
        else if (error instanceof Errors.OutdatedConfigEntityError) {
            UserInteractor.printError(UserInteractor.ERRORS.CONFIG_OUTDATED, error._identifier, error._configType);
            UserInteractor.printInfo(UserInteractor.ERRORS.CMD_IMPOSSIBLE_TO_EXECUTE);
            UserInteractor.deleteOutdatedConfigMessage(error._configType);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.NotUniqueIdentifierError) {
            if (error._identifier) {
                UserInteractor.printError(UserInteractor.ERRORS.MULTIPLE_IDENTIFIERS_FOUND, error._entityType, error._identifier);
            }
            else {
                UserInteractor.printError(UserInteractor.ERRORS.MULTIPLE_IDS_FOUND, error._entityType);
            }
            if (UserInteractor.isOutputText()) {
                UserInteractor.printObject(error._entitiesInfo);
                UserInteractor.printInfo(UserInteractor.ERRORS.CMD_IMPOSSIBLE_TO_EXECUTE);
            }
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.NoIdentifierError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.NO_IDENTIFIER, error._entityType);
        }
        else if (error instanceof Errors.NoOptionError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.CMD_REQUIRED_OPTION, error._option);
        }
        else if (error instanceof Errors.NoConfigError) {
            if (error._config.type === Config.TYPE.AUTH) {
                const AuthConfig = require('./AuthConfig');
                if (error._isLogout || error._config.location === AuthConfig.LOCATION.FILE_PATH) {
                    UserInteractor.printError(UserInteractor.ERRORS.CONFIG_NOT_FOUND, error._config.info);
                }
                else {
                    UserInteractor.printError(UserInteractor.ERRORS.NOT_LOGGED_IN);
                    UserInteractor.reloginMessage(error._config);
                }
            }
            else {
                UserInteractor.printError(UserInteractor.ERRORS.CONFIG_NOT_FOUND_CURR_DIR, error._config.type);
            }
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.CorruptedConfigError) {
            UserInteractor.printError(UserInteractor.ERRORS.CONFIG_CORRUPTED, error._config.info);
            if (error._config.type === Config.TYPE.AUTH) {
                UserInteractor.reloginMessage(error._config);
            }
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.FileError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.FILE_ERROR, error._fileName, error.message);
        }
        else if (error instanceof Errors.OperationCanceled) {
            UserInteractor.printInfo(UserInteractor.MESSAGES.CHOICES_OPERATION_CANCELED);
            UserInteractor.printObject();
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof ImpCentralApi.Errors.ImpCentralApiError) {
            UserInteractor.printImpCentralApiError(error);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof ImpCentralApi.Errors.InvalidDataError) {
            const message = error.message;
            if (message.indexOf('ENOENT') >= 0 || message.indexOf('ETIMEDOUT') >= 0 ||
                message.indexOf('ECONNRESET') >= 0) {
                UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ACCESS_FAILED);
            }
            else {
                UserInteractor.printErrorWithStatus("%s.", message);
            }
        }
        else {
            UserInteractor.printErrorWithStatus(error.message);
        }
    }

    static printImpCentralApiError(error) {
        if (UserInteractor.isOutputText() && error.body && error.body.hasOwnProperty('errors')) {
            UserInteractor._printErrorsAndWarnings(error.body.errors);
        }
        else {
            UserInteractor.printError(error.message);
        }
    }

    static printResponseMeta(response) {
        if (UserInteractor.isOutputText() && 
            response && response.hasOwnProperty('data') && response.data.hasOwnProperty('meta')) {
            UserInteractor._printErrorsAndWarnings(response.data.meta);
        }
    }

    static _printErrorsAndWarnings(entities) {
        if (Array.isArray(entities)) {
            entities.forEach((entity) => {
                if (['title', 'detail', 'status'].every(prop => entity.hasOwnProperty(prop))) {
                    const message = entity.title + ': ' + entity.detail;
                    if (UserInteractor._isError(entity)) {
                        UserInteractor.printError(message);
                        UserInteractor._printMeta(entity.meta);
                    }
                    else if (UserInteractor.isOutputLevelInfoEnabled()) {
                        UserInteractor.printInfo(message);
                        UserInteractor._printMeta(entity.meta);
                    }
                }
            });
        }
    }

    static _printMeta(metaData) {
        if (Array.isArray(metaData)) {
            for (let meta of metaData) {
                if (['row', 'column', 'text', 'type', 'file'].every(prop => meta.hasOwnProperty(prop))) {
                    UserInteractor._printMessage('%s %s (line %d, column %d): %s', meta.file, meta.type, meta.row, meta.column, meta.text);
                }
            }
        }
    }

    static _isError(entity) {
        const status = parseInt(entity.status);
        return (status < 200 || status >= 300);
    }

    static reloginMessage(authConfig) {
        const Options = require('./Options');
        const AuthConfig = require('./AuthConfig');
        if (authConfig.location === AuthConfig.LOCATION.LOCAL || authConfig.location === AuthConfig.LOCATION.GLOBAL) {
            const globalExecutableName = Options.globalExecutableName;
            let loginCommand = Util.format('%s auth login', globalExecutableName);
            if (authConfig.location !== AuthConfig.LOCATION.GLOBAL) {
                let localOption = Util.format('--%s', Options.LOCAL);
                if (authConfig.location === AuthConfig.LOCATION.ANY) {
                    localOption = Util.format('[%s]', localOption);
                }
                loginCommand = Util.format('%s %s', loginCommand, localOption);
            }
            const action = authConfig.exists() ? 'relogin' : 'login';
            UserInteractor.printInfo(UserInteractor.MESSAGES.RELOGIN_MSG, action, loginCommand);
        }
    }

    static deleteOutdatedConfigMessage(configType) {
        const globalExecutableName = require('./Options').globalExecutableName;
        const configDeleteCmd = Util.format('%s %s delete', 
            globalExecutableName, configType === Config.TYPE.PROJECT ? 'project' : 'test');
        UserInteractor.printInfo(UserInteractor.MESSAGES.DELETE_CONFIG_MSG,
            configDeleteCmd, configType);
    }

    static _callChoiceHandler(handler, handlersParams) {
        if (Array.isArray(handlersParams)) {
            return handler(...handlersParams);
        }
        else {
            return handler(handlersParams);
        }
    }

    static _cancelOperation() {
        return Promise.reject(new Errors.OperationCanceled());
    }

    static processCancelContinueChoice(message, continueChoiceHandler, continueChoiceHandlerParams, confirmed, printMsg = true) {
        const valueValidator = function (value) {
            const val = value.trim().toLowerCase();
            if (val === 'y') {
                return 1;
            }
            else if (val === 'n') {
                return 0;
            }
            return -1;
        };
        return UserInteractor._processChoice(
            message,
            UserInteractor.MESSAGES.CHOICES_CONTINUE_QUESTION,
            UserInteractor.MESSAGES.CHOICES_YES_NO_PROMPT,
            valueValidator,
            [UserInteractor._cancelOperation, continueChoiceHandler],
            continueChoiceHandlerParams,
            confirmed,
            1);
    }

    static processNumericChoice(message, choices, choicesHandlers, handlersParams) {
        let question = '';
        for (let i = 0; i < choices.length; i++) {
            question += Util.format('  (%d) %s\n', i + 1, choices[i]);
        }
        const choicesIndices = new Array(choices.length);
        for (let i = 0; i < choices.length; i++) {
            choicesIndices[i] = i + 1;
        }
        const prompt = Util.format(UserInteractor.MESSAGES.PROMPT_ENTER, choicesIndices.join(' or '));
        const valueValidator = function (value) {
            if (value && value >= 1 && value <= choices.length) {
                return value - 1;
            }
            return -1;
        };
        return UserInteractor._processChoice(
            message,
            question,
            prompt,
            valueValidator,
            choicesHandlers,
            handlersParams,
            false,
            0);
    }

    static _processChoice(message, question, prompt, valueValidator, 
        choicesHandlers, handlersParams, confirmed, confirmedHandlerIndex, printMsg = true) {
        if (confirmed) {
            return UserInteractor._callChoiceHandler(choicesHandlers[confirmedHandlerIndex], handlersParams);
        }
        else {
            if (printMsg) {
                if (message) {
                    UserInteractor.printDialog(message);
                }
                UserInteractor.printDialog(question);
            }
            return UserInteractor._prompt(prompt).
                then((value) => {
                    UserInteractor.printDialog('');
                    const choiceIndex = valueValidator(value);
                    if (choiceIndex >= 0) {
                        return UserInteractor._callChoiceHandler(choicesHandlers[choiceIndex], handlersParams);
                    }
                    else {
                        UserInteractor.printDialog(UserInteractor.MESSAGES.CHOICES_INVALID_VALUE);
                        return UserInteractor._processChoice(message, question, prompt, valueValidator, 
                            choicesHandlers, handlersParams, confirmed, confirmedHandlerIndex, false);
                    }
                });
        }
    }

    static _prompt(message, hideInput = false) {
        UserInteractor.spinnerStop();
        return new Promise((resolve, reject) => {
            let value = Prompt(message, null, hideInput ? { echo : '' } : null);
            if (value === null) {
                resolve(UserInteractor._cancelOperation());
            }
            else {
                resolve(value);
            }
        });
    }

    static requestOption(optionValue, optionName, hideInput = false) {
        if (optionValue === undefined) {
            return UserInteractor._prompt(Util.format(UserInteractor.MESSAGES.PROMPT_ENTER, optionName), hideInput);
        }
        return Promise.resolve(optionValue);
    }

    static get spinner() {
        if (!UserInteractor._spinner) {
            UserInteractor._spinner = new CliSpinner(SPINNER_TEXT);
            UserInteractor._spinner.setSpinnerString('|/-\\');
        }
        return UserInteractor._spinner;
    }

    static enableSpinner(value) {
        UserInteractor._enableSpinner = value;
    }

    static spinnerStart() {
        if (UserInteractor._enableSpinner && !UserInteractor.spinner.isSpinning()) {
            UserInteractor.spinner.start();
        }
    }

    static spinnerStop() {
        if (UserInteractor.spinner.isSpinning()) {
            UserInteractor.spinner.stop(true);
        }
    }
}

UserInteractor._enableSpinner = true;
UserInteractor._outputFormat = OUTPUT_FORMAT.TEXT;
UserInteractor._outputLevel = OUTPUT_LEVEL.INFO;

module.exports = UserInteractor;

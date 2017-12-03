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

const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const Prompt = require('cli-prompt');
const Util = require('util');
const CliSpinner = require('cli-spinner').Spinner;
const Colors = require('colors/safe');
const Errors = require('./Errors');
const Config = require('./Config');
const JsonFormatter = require('./JsonFormatter');

const SPINNER_TEXT = 'Contacting the impCentral...';

const JSON_VALUE_MAX_LENGTH = 512;

const SUCCESS_COMMAND_STATUS = 'IMPT COMMAND SUCCEEDS';
const FAIL_COMMAND_STATUS = 'IMPT COMMAND FAILS';

const MESSAGES = {
    LOGIN_SUCCESSFUL : '%s login successful.',
    LOGOUT_SUCCESSFUL : '%s logout successful.',
    ENTITY_CREATED : '%s is created successfully.',
    ENTITY_UPDATED : '%s is updated successfully.',
    ENTITY_DELETED : '%s is deleted successfully.',
    ENTITY_REMOVED : '%s is removed successfully.',
    ENTITY_INFO : '%s info:',
    ENTITY_LIST : '%ss list:',
    ENTITY_EMPTY_LIST : 'No %ss are found.',
    FILE_RENAMED : '%s is renamed successfully to %s.',
    FILES_DELETED : 'Device/agent source files %s are deleted successfully.',
    PROJECT_LINKED : 'Project is linked successfully.',
    PROJECT_EXISTS : 'The current directory already contains existing Project. The existing Project File will be overwritten.',
    CHOICES_CONTINUE_QUESTION : 'Are you sure you want to continue?',
    CHOICES_CHOOSE : 'Choose one of the following actions:',
    CHOICES_CONTINUE_OP : 'Continue the operation.',
    CHOICES_CANCEL_OP : 'Cancel the operation.',
    CHOICES_OPERATION_CANCELED : 'Operation is canceled.',
    CHOICES_PROMPT : 'Enter %s: ',
    CHOICES_INVALID_VALUE : 'Invalid value!',
    RELOGIN_MSG : 'Please %s using "%s" command and then try again.',
    CREATE_PROJECT_MSG : 'Please create a new Project using "%s" or "%s" command and then try again.',
    DELETE_PROJECT_MSG : 'Use "%s" command to delete the outdated Project.',
    NO_PROJECT_MSG : 'There is no Project File in the current directory.',
    DG_NO_DEVICES : '%s does not have assigned Devices.',
    DG_DEVICES_RESTARTED : 'Devices assigned to %s are restarted successfully.',
    DG_DEVICES_UNASSIGNED : 'Devices assigned to %s are unassigned successfully.',
    DG_DEVICES_REASSIGNED : 'Devices assigned to %s are reassigned to %s successfully.',
    DG_REASSIGN_DIFF_TYPES_AND_PRODUCTS : '%ss "%s" and "%s" are of different types ("%s" and "%s") and belong to different Products.',
    DG_REASSIGN_DIFF_TYPES : '%ss "%s" and "%s" are of different types ("%s" and "%s").',
    DG_REASSIGN_DIFF_PRODUCTS : '%ss "%s" and "%s" belong to different Products.',
    DG_NO_FLAGGED_BUILDS : '%s does not have "flagged" Deployments.',
    DG_BUILDS_UNFLAGGED : 'All "flagged" Deployments of %s are unflagged successfully.',
    DEVICE_ASSIGNED_TO_DG : '%s is assigned successfully to %s.',
    DEVICE_ALREADY_ASSIGNED_TO_DG : '%s is already assigned to %s.',
    DEVICE_REASSIGN : '%s is assigned to another Device Group. It will be reassigned to %s.',
    DEVICE_RESTARTED : '%s is restarted successfully.',
    DEVICE_UNASSIGNED : '%s is unassigned successfully.',
    DEVICE_ALREADY_UNASSIGNED : '%s is already unassigned.',
    DELETE_ENTITIES : 'The following entities will be deleted:',
    DELETE_DEVICES_UNASSIGNED : 'The following Devices will be unassigned from Device Groups:',
    DELETE_DEVICES_REMOVED : 'The following Devices will be removed from the account:',
    DELETE_BUILDS_FLAGGED : 'The following Deployments are marked "flagged" to prevent deleting. They will be modified by setting "flagged" attribute to false:',
    DELETE_FILES : 'The following files will be deleted:'
};

const ERRORS = {
    CMD_REQUIRED_OPTIONS : 'Either "--%s" or "--%s" option must be specified.',
    CMD_MUTUALLY_EXCLUSIVE_OPTIONS : 'Options "--%s" and "--%s" are mutually exclusive.',
    CMD_REQUIRED_OPTION : 'Option "--%s" must be specified.',
    CMD_COOPERATIVE_OPTIONS : 'Options "--%s" and "--%s" must be specified together.',
    CMD_TARGET_REQUIRED : 'Option "--%s" must be specified for Device Group of type "%s".',
    CMD_UNKNOWN_ARGS : 'Unknown arguments: %s.',
    CMD_IMPOSSIBLE_TO_EXECUTE : 'Impossible to execute the command.',
    NOT_LOGGED_IN : 'You are not logged in.',
    REFRESH_TOKEN_ERR : 'Impossible to refresh access token for the %s login.',
    ACCESS_TOKEN_EXPIRED : 'Access token is expired for the %s login. Information required to refresh access token is not saved.',
    CONFIG_NOT_FOUND : '%s File not found.',
    CONFIG_CORRUPTED : '%s File is corrupted.',
    PROJECT_CONFIG_OUTDATED : '%s, saved in Project File, does not exist anymore.',
    ACCESS_FAILED : 'Access to impCentral failed or timed out. Please check your network connection.',
    PROJECT_LINK_WRONG_DG_TYPE : 'Project can not be linked to Device Group of the type "%s". Only "%s" or "%s" Device Groups are allowed.',
    TARGET_DG_NOT_FOUND : 'Production target %s not found.',
    WRONG_DG_TYPE_FOR_TARGET : 'Invalid option "--%s" for Device Group of the type "%s". Production target may be specified for "%s" or "%s" Device Groups only.',
    WRONG_DG_TYPE_FOR_LOAD_CODE : 'Invalid option "--%s" for Device Group of the type "%s". It may be specified for "%s" or "%s" Device Groups only.',
    TARGET_DG_WRONG_TYPE : 'Production target %s is of the type "%s" but must be of the type "%s".',
    TARGET_DG_WRONG_PRODUCT : 'Production target Device Group must be from the same Product.',
    BUILD_DELETE_ERR : 'Impossible to delete the most recent %s for %s',
    MULTIPLE_IDENTIFIERS_FOUND : 'Multiple %ss "%s" found:',
    MULTIPLE_IDS_FOUND : 'Multiple %ss found:',
    NO_IDENTIFIER : 'No %s Identifier specified.',
    ENTITY_NOT_FOUND : '%s "%s" not found.',
    ENTITY_NOT_FOUND_ALT : '%s specified by "%s" and "%s" not found.',
    ENTITY_CORRUPTED : '%s. %s is related to corrupted %s which does not exist.',
    FILE_ERROR : 'File error: %s: %s.',
    INTERNAL_ERROR : 'Internal error: %s.',
    UNEXPECTED_STATE : 'Unexpected state'
};

// Helper class for interactions with a user.
class UserInteractor {
    static get MESSAGES() {
        return MESSAGES;
    }

    static get ERRORS() {
        return ERRORS;
    }

    static printError(message, ...args) {
        UserInteractor.spinnerStop();
        console.log('ERROR: ' + message, ...args);
    }

    static printErrorWithStatus(message, ...args) {
        UserInteractor.printError(message, ...args);
        UserInteractor.printErrorStatus();
    }

    static printErrorStatus() {
        UserInteractor.printMessage(FAIL_COMMAND_STATUS);
    }

    static printMessage(message, ...args) {
        UserInteractor.spinnerStop();
        console.log(message, ...args);
    }

    static printMessageWithStatus(message, ...args) {
        UserInteractor.printMessage(message, ...args);
        UserInteractor.printSuccessStatus();
    }

    static printSuccessStatus() {
        UserInteractor.printMessage(SUCCESS_COMMAND_STATUS);
    }

    static printAlert(message, ...args) {
        UserInteractor.spinnerStop();
        message = Colors.red(message);
        console.log(message, ...args);
    }

    static jsonDataValueFormatter(value) {
        if (typeof(value) === 'string' && value.length > JSON_VALUE_MAX_LENGTH) {
            return value.substring(0, JSON_VALUE_MAX_LENGTH) + '\n...';
        }
        if (Array.isArray(value) && value.length === 0) {
            return '';
        }
        if (value === null || value === undefined) {
            return '';
        }
        return value;
    }

    static corruptedJsonData(data) {
        if (Array.isArray(data)) {
            return data.map(elem => UserInteractor.corruptedJsonData(elem));
        }
        else if (typeof data === 'object') {
            let result = {};
            for (let key in data) {
                result[UserInteractor.corruptedJsonData(key)] = UserInteractor.corruptedJsonData(data[key]);
            }
            return result;
        }
        return Colors.red(data);
    }

    static printJsonData(data) {
        UserInteractor.spinnerStop();
        if (!data || Array.isArray(data) && data.length === 0 || Object.keys(data).length === 0) {
            return;
        }
        const jsonFormatter = new JsonFormatter();
        console.log(jsonFormatter.render(data));
    }

    static processError(error) {
        UserInteractor.spinnerStop();
        const globalExecutableName = require('./Options').globalExecutableName;

        if (error instanceof Errors.InternalLibraryError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.INTERNAL_ERROR, 
                error.message || UserInteractor.ERRORS.UNEXPECTED_STATE);
        }
        else if (error instanceof Errors.RefreshTokenError) {
            UserInteractor.printError(UserInteractor.ERRORS.REFRESH_TOKEN_ERR, error._authConfig.location);
            UserInteractor.reloginMessage(error._authConfig);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.AccessTokenExpiredError) {
            UserInteractor.printError(UserInteractor.ERRORS.ACCESS_TOKEN_EXPIRED, error._authConfig.location);
            UserInteractor.reloginMessage(error._authConfig);
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.EntityNotFoundError) {
            if (error._alternativeId) {
                UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ENTITY_NOT_FOUND_ALT,
                    error._entityType, error._identifier, error._alternativeId);
            }
            else {
                UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ENTITY_NOT_FOUND, error._entityType, error._identifier);
            }
        }
        else if (error instanceof Errors.CorruptedRelatedEntityError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ENTITY_CORRUPTED, 
                UserInteractor.ERRORS.UNEXPECTED_STATE, error._relatedIdentifier, error._identifier);
        }
        else if (error instanceof Errors.OutdatedProjectEntityError) {
            UserInteractor.printError(UserInteractor.ERRORS.PROJECT_CONFIG_OUTDATED, error._identifier);
            UserInteractor.printMessage(UserInteractor.ERRORS.CMD_IMPOSSIBLE_TO_EXECUTE);
            UserInteractor.deleteOutdatedProjectMessage();
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.NotUniqueIdentifierError) {
            if (error._identifier) {
                UserInteractor.printError(UserInteractor.ERRORS.MULTIPLE_IDENTIFIERS_FOUND, error._entityType, error._identifier);
            }
            else {
                UserInteractor.printError(UserInteractor.ERRORS.MULTIPLE_IDS_FOUND, error._entityType);
            }
            UserInteractor.printJsonData(error._entitiesInfo);
            UserInteractor.printMessage(UserInteractor.ERRORS.CMD_IMPOSSIBLE_TO_EXECUTE);
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
                if (error._isLogout) {
                    UserInteractor.printError(UserInteractor.ERRORS.CONFIG_NOT_FOUND, error._config.info);
                }
                else {
                    UserInteractor.printError(UserInteractor.ERRORS.NOT_LOGGED_IN);
                    UserInteractor.reloginMessage(error._config);
                }
            }
            else if (error._config.type === Config.TYPE.PROJECT) {
                UserInteractor.printError(UserInteractor.ERRORS.CONFIG_NOT_FOUND, error._config.info);
                UserInteractor.createNewProjectMessage();
            }
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.CorruptedConfigError) {
            UserInteractor.printError(UserInteractor.ERRORS.CONFIG_CORRUPTED, error._config.info);
            if (error._config.type === Config.TYPE.AUTH) {
                UserInteractor.reloginMessage(error._config);
            }
            else if (error._config.type === Config.TYPE.PROJECT) {
                UserInteractor.createNewProjectMessage();
            }
            UserInteractor.printErrorStatus();
        }
        else if (error instanceof Errors.RecentBuildDeleteError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.BUILD_DELETE_ERR, 
                error._buildIdentifier, error._devGroupIdentifier);
        }
        else if (error instanceof Errors.FileError) {
            UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.FILE_ERROR, error._fileName, error.message);
        }
        else if (error instanceof Errors.OperationCanceled) {
            UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.CHOICES_OPERATION_CANCELED);
        }
        else if (error instanceof ImpCentralApi.Errors.ImpCentralApiError) {
            UserInteractor.printErrorWithStatus(error.message);
        }
        else if (error instanceof ImpCentralApi.Errors.InvalidDataError) {
            const message = error.message;
            if (message.indexOf('ENOENT') >= 0 || message.indexOf('ETIMEDOUT') >= 0) {
                UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.ACCESS_FAILED);
            }
            else {
                UserInteractor.printErrorWithStatus(UserInteractor.ERRORS.INTERNAL_ERROR, message);
            }
        }
        else {
            UserInteractor.printErrorWithStatus(error.message);
        }
    }

    static reloginMessage(authConfig) {
        const Options = require('./Options');
        const AuthConfig = require('./AuthConfig');
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
        UserInteractor.printMessage(UserInteractor.MESSAGES.RELOGIN_MSG, action, loginCommand);
    }

    static createNewProjectMessage() {
        const globalExecutableName = require('./Options').globalExecutableName;
        const projectCreateCmd = Util.format('%s project create', globalExecutableName);
        const projectLinkCmd = Util.format('%s project link', globalExecutableName);
        UserInteractor.printMessage(UserInteractor.MESSAGES.CREATE_PROJECT_MSG,
            projectCreateCmd, projectLinkCmd);
    }

    static deleteOutdatedProjectMessage() {
        const globalExecutableName = require('./Options').globalExecutableName;
        const projectDeleteCmd = Util.format('%s project delete', globalExecutableName);
        UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_PROJECT_MSG,
            projectDeleteCmd);
    }


    static _callChoiceHandler(handler, handlersParams) {
        if (Array.isArray(handlersParams)) {
            return handler(...handlersParams);
        }
        else {
            return handler(handlersParams);
        }
    }

    static processChoices(message, choices, choicesHandlers, handlersParams, force, forcedHandlerIndex, printMsg = true) {
        if (force) {
            return UserInteractor._callChoiceHandler(choicesHandlers[forcedHandlerIndex], handlersParams);
        }
        else {
            return new Promise((resolve, reject) => {
                if (printMsg) {
                    if (message) {
                        UserInteractor.printMessage(message);
                    }
                    UserInteractor.printMessage(UserInteractor.MESSAGES.CHOICES_CONTINUE_QUESTION);
                    UserInteractor.printMessage(UserInteractor.MESSAGES.CHOICES_CHOOSE);
                    for (let i = 0; i < choices.length; i++) {
                        UserInteractor.printMessage('  (%d) %s', i + 1, choices[i]);
                    }
                }
                const choicesIndices = new Array(choices.length);
                for (let i = 0; i < choices.length; i++) {
                    choicesIndices[i] = i + 1;
                }
                Prompt(Util.format(UserInteractor.MESSAGES.CHOICES_PROMPT, choicesIndices.join(' or ')), function(value) {
                    UserInteractor.printMessage('');
                    if (value && value >= 1 && value <= choices.length) {
                        resolve(UserInteractor._callChoiceHandler(choicesHandlers[value - 1], handlersParams));
                    }
                    else {
                        UserInteractor.printMessage(UserInteractor.MESSAGES.CHOICES_INVALID_VALUE);
                        resolve(UserInteractor.processChoices(message, choices, choicesHandlers, handlersParams, force, forcedHandlerIndex, false));
                    }
                });
            });
        }
    }

    static _cancelOperation() {
        return Promise.reject(new Errors.OperationCanceled());
    }

    static processCancelContinueChoice(message, continueChoiceHandler, continueChoiceHandlerParams, force) {
        return UserInteractor.processChoices(
            message,
            [UserInteractor.MESSAGES.CHOICES_CANCEL_OP, UserInteractor.MESSAGES.CHOICES_CONTINUE_OP],
            [UserInteractor._cancelOperation, continueChoiceHandler],
            continueChoiceHandlerParams,
            force,
            1
        );
    }

    static get spinner() {
        if (!UserInteractor._spinner) {
            UserInteractor._spinner = new CliSpinner(SPINNER_TEXT);
            UserInteractor._spinner.setSpinnerString('|/-\\');
        }
        return UserInteractor._spinner;
    }

    static spinnerStart() {
        if (!UserInteractor.spinner.isSpinning()) {
            UserInteractor.spinner.start();
        }
    }

    static spinnerStop() {
        if (UserInteractor.spinner.isSpinning()) {
            UserInteractor.spinner.stop(true);
        }
    }
}

module.exports = UserInteractor;

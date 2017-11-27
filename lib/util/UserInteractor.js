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
const PrettyJson = require('prettyjson');
const Colors = require('colors/safe');
const Errors = require('./Errors');
const Config = require('./Config');

const SPINNER_TEXT = 'Contacting the impCentral...';

const JSON_VALUE_MAX_LENGTH = 512;

const JSON_PRINT_OPTIONS = {
    emptyArrayMsg : '-',
    defaultIndentation : 2,
    keysColor : 'green',
    dashColor : 'green'
};

const SUCCESS_PREFIX = "IMPT SUCCESS";
const FAIL_PREFIX = "IMPT FAIL";

const MESSAGES = {
    LOGIN_SUCCESSFUL : '%s login successful.',
    LOGOUT_SUCCESSFUL : '%s logout successful.',
    AUTH_INFO : 'Auth info:',
    ENTITY_CREATED : '%s created successfully.',
    ENTITY_UPDATED : '%s updated successfully.',
    ENTITY_DELETED : 'Delete completed successfully.',
    ENTITY_INFO : '%s info:',
    ENTITY_LIST : '%ss list:',
    ENTITY_EMPTY_LIST : 'No suitable %ss found.',
    OPERATION_CANCELED : 'Operation is canceled.'
}

const ERRORS = {
    CMD_REQUIRED_OPTIONS : 'One of "%s" and "%s" required options must be specified',
    CMD_MUTUALLY_EXCLUSIVE_OPTIONS : 'Options "%s" and "%s" are mutually exclusive',
    CMD_REQUIRED_OPTION : 'Option "%s" must be specified',
    CMD_UNKNOWN_ARGS : 'Unknown arguments: %s',
    NOT_LOGGED_IN : 'You are not logged in.',
    RELOGIN_MSG : 'Please %s using "%s" command and then try again.',
    REFRESH_TOKEN_ERR : 'Impossible to refresh access token for the %s login.',
    ACCESS_TOKEN_EXPIRED : 'Access token is expired for the %s login.\nInformation required to refresh access token is not saved.',
    CONFIG_NOT_FOUND : '%s file not found.',
    CONFIG_CORRUPTED : '%s file is corrupted.',
    ACCESS_FAILED : 'Access to impCentral failed or timed out. Please check your network connection.',
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

    static printSuccessMessage(message, ...args) {
        UserInteractor.printMessage(Util.format("%s: %s", SUCCESS_PREFIX, message), ...args);
    }

    static printErrorMessage(message, ...args) {
        UserInteractor.printMessage(Util.format("%s: %s", FAIL_PREFIX, message), ...args);
    }

    static printMessage(message, ...args) {
        UserInteractor.spinnerStop();
        console.log(message, ...args);
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
        const options = JSON_PRINT_OPTIONS;
        console.log(PrettyJson.render(data, options));
    }

    static processError(error) {
        UserInteractor.spinnerStop();
        const globalExecutableName = require('./Options').globalExecutableName;

        if (error instanceof Errors.InternalLibraryError) {
            UserInteractor.printErrorMessage(UserInteractor.ERRORS.INTERNAL_ERROR, 
                error.message || UserInteractor.ERRORS.UNEXPECTED_STATE);
        }
        else if (error instanceof Errors.RefreshTokenError) {
            UserInteractor.printErrorMessage(UserInteractor.ERRORS.REFRESH_TOKEN_ERR, error._authConfig.location);
            UserInteractor.reloginMessage(error._authConfig);
        }
        else if (error instanceof Errors.AccessTokenExpiredError) {
            UserInteractor.printErrorMessage(UserInteractor.ERRORS.ACCESS_TOKEN_EXPIRED, error._authConfig.location);
            UserInteractor.reloginMessage(error._authConfig);
        }
        else if (error instanceof Errors.EntityNotFoundError) {
            if (error._alternativeId) {
                UserInteractor.printErrorMessage('%s specified by "%s" and "%s" not found.',
                    error._entityType, error._identifier, error._alternativeId);
            }
            else {
                UserInteractor.printErrorMessage('%s "%s" not found.', error._entityType, error._identifier);
            }
        }
        else if (error instanceof Errors.CorruptedRelatedEntityError) {
            UserInteractor.printErrorMessage('%s. %s is related to corrupted %s which does not exist.', 
                UserInteractor.ERRORS.UNEXPECTED_STATE, error._relatedIdentifier, error._identifier);
        }
        else if (error instanceof Errors.OutdatedProjectEntityError) {
            UserInteractor.printErrorMessage(
                '%s, saved in Project File, does not exist anymore.\nThe operation can not be performed.\n' +
                'Use "%s project delete" command to delete the outdated Project.', 
                error._identifier, globalExecutableName);
        }
        else if (error instanceof Errors.NotUniqueIdentifierError) {
            if (error._identifier) {
                UserInteractor.printErrorMessage('Multiple %ss "%s" found:', error._entityType, error._identifier);
            }
            else {
                UserInteractor.printErrorMessage('Multiple %ss found:', error._entityType);
            }
            UserInteractor.printJsonData(error._entitiesInfo);
            UserInteractor.printMessage('Impossible to execute the command.');
        }
        else if (error instanceof Errors.NoIdentifierError) {
            UserInteractor.printErrorMessage('No %s identifier specified.', error._entityType);
        }
        else if (error instanceof Errors.NoOptionError) {
            UserInteractor.printErrorMessage('No %s option specified.', error._option);
        }
        else if (error instanceof Errors.UnsupportedDeviceGroupTypeError) {
            UserInteractor.printErrorMessage('Unsupported type "%s" of %s.\nOnly "%s" Device Groups are supported.\n%s', 
                error._type, error._identifier, DeviceGroups.TYPE_DEVELOPMENT, error.message);
        }
        else if (error instanceof Errors.NoConfigError) {
            if (error._config.type === Config.TYPE.AUTH) {
                if (error._isLogout) {
                    UserInteractor.printErrorMessage(UserInteractor.ERRORS.CONFIG_NOT_FOUND, error._config.info);
                }
                else {
                    UserInteractor.printErrorMessage(UserInteractor.ERRORS.NOT_LOGGED_IN);
                    UserInteractor.reloginMessage(error._config);
                }
            }
            else if (error._config.type === Config.TYPE.PROJECT) {
                UserInteractor.printErrorMessage(UserInteractor.ERRORS.CONFIG_NOT_FOUND, error._config.info);
                UserInteractor.createNewProjectMessage();
            }
        }
        else if (error instanceof Errors.CorruptedConfigError) {
            UserInteractor.printErrorMessage(UserInteractor.ERRORS.CONFIG_CORRUPTED, error._config.info);
            if (error._config.type === Config.TYPE.AUTH) {
                UserInteractor.reloginMessage(error._config);
            }
            else if (error._config.type === Config.TYPE.PROJECT) {
                UserInteractor.createNewProjectMessage();
            }
        }
        else if (error instanceof Errors.DeviceGroupActivationError) {
            UserInteractor.printErrorMessage('Impossible to Activate %s. It does not belong to the current Project/Product.', error._identifier);
        }
        else if (error instanceof Errors.DeviceGroupHasNoDevicesError) {
            UserInteractor.printErrorMessage('%s does not have assigned Devices', error._identifier);
        }
        else if (error instanceof Errors.RecentBuildDeleteError) {
            UserInteractor.printErrorMessage('Impossible to delete the most recent %s for %s', 
                error._buildIdentifier, error._devGroupIdentifier);
        }
        else if (error instanceof Errors.FileError) {
            UserInteractor.printErrorMessage('File error: %s: %s', 
                error._fileName, error.message);
        }
        else if (error instanceof Errors.OperationCanceled) {
            UserInteractor.printSuccessMessage(UserInteractor.MESSAGES.OPERATION_CANCELED);
        }
        else if (error instanceof ImpCentralApi.Errors.ImpCentralApiError) {
            UserInteractor.printErrorMessage(error.message);
        }
        else if (error instanceof ImpCentralApi.Errors.InvalidDataError) {
            const message = error.message;
            if (message.indexOf('ENOENT') >= 0 || message.indexOf('ETIMEDOUT') >= 0) {
                UserInteractor.printErrorMessage(UserInteractor.ERRORS.ACCESS_FAILED);
            }
            else {
                UserInteractor.printErrorMessage(UserInteractor.ERRORS.INTERNAL_ERROR, message);
            }
        }
        else {
            UserInteractor.printErrorMessage(error);
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
        UserInteractor.printMessage(UserInteractor.ERRORS.RELOGIN_MSG, action, loginCommand);
    }

    static createNewProjectMessage() {
        const globalExecutableName = require('./Options').globalExecutableName;
        UserInteractor.printMessage('Please create a new Project using "%s project new" or "%s project link" commands and then try again.',
            globalExecutableName, globalExecutableName);
    }

    static processChoices(message, choices, choicesHandlers, handlersParams, force, forcedHandlerIndex, printMsg = true) {
        if (force) {
            return choicesHandlers[forcedHandlerIndex](handlersParams);
        }
        else {
            return new Promise((resolve, reject) => {
                if (printMsg) {
                    UserInteractor.printMessage(message);
                    UserInteractor.printMessage('Choose one of the following actions:');
                    for (let i = 0; i < choices.length; i++) {
                        UserInteractor.printMessage('  (%d) %s', i + 1, choices[i]);
                    }
                }
                Prompt(Util.format('Enter 1 - %d: ', choices.length), function(value) {
                    UserInteractor.printMessage('');
                    if (value && value >= 1 && value <= choices.length) {
                        resolve(choicesHandlers[value - 1](handlersParams));
                    }
                    else {
                        UserInteractor.printMessage('Invalid value!');
                        resolve(UserInteractor.processChoices(message, choices, choicesHandlers, handlersParams, force, forcedHandlerIndex, false));
                    }
                });
            });
        }
    }

    static processChoicesWithCancel(message, choices, choicesHandlers, handlersParams, force, forcedHandlerIndex) {
        return UserInteractor.processChoices(
            message,
            ['Cancel the operation'].concat(choices),
            [UserInteractor._cancelOperation].concat(choicesHandlers),
            handlersParams,
            force,
            forcedHandlerIndex + 1
        );
    }

    static _cancelOperation() {
        return Promise.reject(new Errors.OperationCanceled());
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

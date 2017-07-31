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

const SPINNER_TEXT = 'Contacting the impCloud...';

const JSON_VALUE_MAX_LENGTH = 512;

const JSON_PRINT_OPTIONS = {
    emptyArrayMsg : '-',
    defaultIndentation : 2,
    keysColor : 'green',
    dashColor : 'green'
};

// Helper class for interactions with a user.
class UserInteractor {
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

    static printError(message, ...args) {
        UserInteractor.spinnerStop();
        console.log('ERROR: ' + message, ...args);
    }

    static processError(error) {
        UserInteractor.spinnerStop();
        const globalExecutableName = require('./Options').globalExecutableName;

        if (error instanceof Errors.InternalLibraryError) {
            UserInteractor.printError(error.message);
        }
        else if (error instanceof Errors.RefreshTokenError) {
            UserInteractor.printError('Refresh token failed.');
            UserInteractor.reloginMessage();
        }
        else if (error instanceof Errors.EntityNotFoundError) {
            if (error._alternativeId) {
                UserInteractor.printError('%s specified by "%s" and "%s" not found.',
                    error._entityType, error._identifier, error._alternativeId);
            }
            else {
                UserInteractor.printError('%s "%s" not found.', error._entityType, error._identifier);
            }
        }
        else if (error instanceof Errors.CorruptedRelatedEntityError) {
            UserInteractor.printError('Unexpected state. %s is related to corrupted %s which does not exist.', error._relatedIdentifier, error._identifier);
        }
        else if (error instanceof Errors.OutdatedProjectEntityError) {
            UserInteractor.printError(
                '%s, saved in Project File, does not exist anymore.\nThe operation can not be performed.\n' +
                'Use "%s project delete" command to delete the outdated Project.', 
                error._identifier, globalExecutableName);
        }
        else if (error instanceof Errors.NotUniqueIdentifierError) {
            if (error._identifier) {
                UserInteractor.printError('Multiple %ss "%s" found:', error._entityType, error._identifier);
            }
            else {
                UserInteractor.printError('Multiple %ss found:', error._entityType);
            }
            UserInteractor.printJsonData(error._entitiesInfo);
            UserInteractor.printMessage('Impossible to execute the command.');
        }
        else if (error instanceof Errors.NoIdentifierError) {
            UserInteractor.printError('No %s identifier specified.', error._entityType);
        }
        else if (error instanceof Errors.NoOptionError) {
            UserInteractor.printError('No %s option specified.', error._option);
        }
        else if (error instanceof Errors.UnsupportedDeviceGroupTypeError) {
            UserInteractor.printError('Unsupported type "%s" of %s.\nOnly "%s" Device Groups are supported.\n%s', 
                error._type, error._identifier, DeviceGroups.TYPE_DEVELOPMENT, error.message);
        }
        else if (error instanceof Errors.NoConfigError) {
            UserInteractor.printError('%s Config file not found.\n%s.', 
                error._type, (error.message || 'The operation can not be performed'));
            if (error._type === 'Auth') {
                UserInteractor.reloginMessage();
            }
            else if (error._type === 'Project') {
                UserInteractor.createNewProjectMessage();
            }
        }
        else if (error instanceof Errors.CorruptedConfigError) {
            UserInteractor.printError('%s Config file "%s" is corrupted.', error._type, error._fileName);
            if (error._type === 'Auth') {
                UserInteractor.reloginMessage();
            }
            else if (error._type === 'Project') {
                UserInteractor.createNewProjectMessage();
            }
        }
        else if (error instanceof Errors.DeviceGroupActivationError) {
            UserInteractor.printError('Impossible to Activate %s. It does not belong to the current Project/Product.', error._identifier);
        }
        else if (error instanceof Errors.DeviceGroupHasNoDevicesError) {
            UserInteractor.printError('%s does not have assigned Devices', error._identifier);
        }
        else if (error instanceof Errors.RecentBuildDeleteError) {
            UserInteractor.printError('Impossible to delete the most recent %s for %s', 
                error._buildIdentifier, error._devGroupIdentifier);
        }
        else if (error instanceof Errors.FileError) {
            UserInteractor.printError('File error: %s: %s', 
                error._fileName, error.message);
        }
        else if (error instanceof Errors.OperationCanceled) {
            UserInteractor.printMessage('Operation is canceled');
        }
        else if (error instanceof ImpCentralApi.Errors.ImpCentralApiError) {
            UserInteractor.printError(error.message);
        }
        else if (error instanceof ImpCentralApi.Errors.InvalidDataError) {
            const message = error.message;
            if (message.indexOf('ENOENT') >= 0 || message.indexOf('ETIMEDOUT') >= 0) {
                UserInteractor.printError('Access to impCloud failed or timed out. Please check your network connection');
            }
            else {
                UserInteractor.printError('Internal library error');
            }
        }
        else {
            UserInteractor.printError(error);
        }
    }

    static reloginMessage() {
        const globalExecutableName = require('./Options').globalExecutableName;
        UserInteractor.printMessage('Please login using "%s login" or "%s project login" commands and then try again.',
            globalExecutableName, globalExecutableName);
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
                        UserInteractor.printError('Invalid value!');
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

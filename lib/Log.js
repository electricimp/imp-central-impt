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
const Readline = require('readline');
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const ProjectConfig = require('./util/ProjectConfig');
const Identifier = require('./util/Identifier');
const Errors = require('./util/Errors');
const DeviceGroup = require('./DeviceGroup');
const Device = require('./Device');

const DEFAULT_LOGS_GET_NUMBER = 10;

// This class represents Logs impCentral API entity.
// Provides methods used by build-cli Logs Manipulation Commands.
class Log {
    constructor(options) {
        options = options || {};
        this._helper = ImpCentralApiHelper.getEntity();
        if (options.debug) {
            this._helper.debug = true;
        }
        this._projectConfig = ProjectConfig.getEntity();
        this._devices = [];
        this._deviceIds = [];
        this._logStreamId = undefined;
        this._logsFinished = false;
        this._init();
    }

    // Initializes readline interface to handle <Ctrl-C> and <Enter> presses.
    _init() {
        this._readline = Readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        if (process.platform === 'win32') {
            this._readline.on('SIGINT', () => { process.emit('SIGINT') });
        }

        process.on('SIGINT', () => {
            const closeLogStream = this._logStreamId ?
                this._helper.closeLogStream(this._logStreamId) :
                Promise.resolve();
            closeLogStream.then(() => process.exit());
        });
    }

    _exit() {
        this._readline.close();
        process.exit();
    }

    // Displays historical logs for the specified Device.
    //
    // If --device option is missed but the current directory contains
    // Project File with the specified Active Device Group:
    // If there is only one Device assigned to this Device Group, the command is processed for it.
    // If there no or more than one Devices assigned to this Device Group, 
    // the command informs a user and is not processed.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing.
    get(options) {
        this._setOptions(options).then(() => {
            if (this._devices.length === 0) {
                return Promise.reject(new Errors.NoIdentifierError(Identifier.ENTITY_TYPE.TYPE_DEVICE));
            }
            else {
                const device = this._devices[0];
                if (this._devices.length > 1) {
                    return device._collectDisplayListData(this._devices).then(() =>
                        Promise.reject(
                            new Errors.NotUniqueIdentifierError(
                                device.entityType,
                                null,
                                this._devices.map(entity => entity._displayData))));
                }
                else {
                    // the only device found
                    return device.getEntityId().then(() => {
                        let pageNumber = 1;
                        this._printDeviceLogs(device.id, pageNumber);
                        this._readline.on('line', () => {
                            pageNumber++;
                            this._printDeviceLogs(device.id, pageNumber);
                        });
                    });
                }
            }
        }).catch(error => {
            UserInteractor.processError(error);
            this._exit();
        });
    }

    // Prints a portion of historical logs for the specified Device.
    //
    // Parameters:
    //     deviceId : string    id of the Device
    //     pageNumber : number  logs pagination page number to be printed
    //
    // Returns:                 Nothing.
    _printDeviceLogs(deviceId, pageNumber) {
        if (this._logsFinished) {
            UserInteractor.printMessage('No more logs available');
            this._exit();
        }
        else {
            this._helper.logs(deviceId, pageNumber, DEFAULT_LOGS_GET_NUMBER).then(logs => {
                logs.map(log => {
                    UserInteractor.printJsonData(this._formatLog(log));
                });
                UserInteractor.printMessage('');
                UserInteractor.printMessage('Press <Enter> to see more logs or <Ctrl-C> to exit');
                if (logs.length < DEFAULT_LOGS_GET_NUMBER) {
                    this._logsFinished = true;
                }
            }).catch(error => {
                UserInteractor.processError(error);
                this._exit();
            });
        }
    }

    // Displays logs from the specified Devices in real-time.
    //
    // --device option may be repeated several times to specify several Devices. 
    // Logs from these Devices will be displayed in a one stream.
    //
    // If --dg option is specified, logs from all Devices assigned to this Device Group will be displayed. 
    // --dg option may be repeated several times to specify several Device Groups.
    //
    // --device and --dg options are cumulative. Logs from all the Devices specified by these options will 
    // be displayed in a one stream.
    //
    // If --device and --dg options are missed but the current directory contains Project File, 
    // then all Devices assigned to Active Device Group specified in that Project File are assumed.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing.
    stream(options) {
        this._setOptions(options).then(() => {
            if (this._devices.length === 0) {
                return Promise.reject(new Errors.NoIdentifierError(Identifier.ENTITY_TYPE.TYPE_DEVICE));
            }
            else {
                return Promise.all(this._devices.map(device => device.getEntityId())).then(() => {
                    this._deviceIds = this._devices.map(device => device.id);
                    // remove duplicates from _deviceIds
                    this._deviceIds = [...new Set(this._deviceIds)];
                    return this._helper.logStream(
                        this._deviceIds, 
                        this._messageHandler.bind(this),
                        this._stateChangeHandler.bind(this)).then((logStreamId) => {
                        this._logStreamId = logStreamId;
                        UserInteractor.spinnerStop();
                        UserInteractor.printMessage('Opening stream for Device(s): ' + this._deviceIds.join(', '));
                        UserInteractor.printMessage('');
                        UserInteractor.printMessage('Press <Ctrl-C> to exit');
                    });
                });
            }
        }).catch(error => {
            UserInteractor.processError(error);
            this._exit();
        });
    }

    // Log stream message handler
    _messageHandler(message) {
        try {
            UserInteractor.printJsonData(this._formatLog(JSON.parse(message), this._deviceIds.length > 1));
        }
        catch (e) {
            UserInteractor.processError(new Errors.InternalLibraryError(
                Util.format('Unexpected format of LogStream message: %s', message)));
        }
    }

    // Log stream state change handler
    _stateChangeHandler(state) {
        try {
            const json = JSON.parse(state);
            if (json.state === 'closed') {
                UserInteractor.printMessage('The stream is closed');
                this._exit();
            }
        }
        catch (e) {
            UserInteractor.processError(new Errors.InternalLibraryError(
                Util.format('Unexpected format of LogStream message: %s', state)));
        }
    }

    // Formats the single log message
    _formatLog(log, printDeviceId = false) {
        if (('device_id' in log) && printDeviceId) {
            return Util.format('[%s] %s [%s] %s', log.device_id, log.ts, log.type, log.msg);
        }
        else {
            return Util.format('%s [%s] %s', log.ts, log.type, log.msg);
        }
    }

    // Sets the Log specific options based on build-cli command options:
    // if (--device <DEVICE_IDENTIFIER>)* option is specified, the Devices identifiers
    // are initialized by its values
    // if (--dg <DEVICE_GROUP_IDENTIFIER>)* option is specified, all Devices assigned 
    // to the Device Groups are used
    // 
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.deviceIdentifier) {
            if (Array.isArray(options.deviceIdentifier)) {
                this._devices = this._devices.concat(options.deviceIdentifier.map(
                    device => new Device().initByIdentifier(device)));
            }
            else {
                this._devices.push(new Device().initByIdentifier(options.deviceIdentifier));
            }
        }
        if (options.deviceGroupIdentifier) {
            return Promise.all(options.deviceGroupIdentifier.map(
                    devGroup => new DeviceGroup().initByIdentifier(devGroup).getEntity())).
                then(devGroups => Promise.all(devGroups.map(
                    devGroup => this._setDevicesByDeviceGroup(devGroup))));
        }
        if (!options.deviceIdentifier && !options.deviceGroupIdentifier &&
            this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().
                then(() => new DeviceGroup().initByIdFromConfig(this._projectConfig.activeDevGroupId).getEntity()).
                then((deviceGroup) => this._setDevicesByDeviceGroup(deviceGroup));
        }
        return Promise.resolve();
    }

    _setDevicesByDeviceGroup(deviceGroup) {
        return new Device().listByDeviceGroup(deviceGroup.id).
            then((devices) => { 
                this._devices = this._devices.concat(devices);
                return Promise.resolve();
            });
    }
}

module.exports = Log;

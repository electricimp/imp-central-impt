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
const ImpCentralApiHelper = require('./ImpCentralApiHelper');
const Utils = require('./Utils');

// Helper class for impt delete commands.
class DeleteHelper {

    constructor() {
        this._summary = {
            entities : [],
            devices : [],
            flaggedBuilds : [],
            assignedDevices : [],
            sourceFiles : [],
            projectConfig : null
        };
        this._helper = ImpCentralApiHelper.getEntity();
    }

    // Processes delete command: 
    // - Collects a summary of all entities which are going to be deleted and modified
    //   during the Entity deleting. It can be:
    //     - Project Config file,
    //     - Project source files,
    //     - Entity to be deleted,
    //     - Device Groups associated with the Product,
    //     - flagged Deployments and assigned Devices of the Device Groups
    // - Displays a summary of all entities to be deleted/modified and 
    //   asks a user to confirm the operation.
    // - Performs the modification/deleting if confirmed.
    processDelete(entity, options) {
        return entity._collectDeleteSummary(this._summary, options).then(() => {
            if (!options.force) {
                this._printDeleteSummary();
            }
            return UserInteractor.processCancelContinueChoice(
                null,
                this._delete.bind(this),
                undefined,
                options.force);
        });
    }

    _printDeleteSummary() {
        if (this._summary.entities.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_ENTITIES);
            UserInteractor.printJsonData(this._summary.entities.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.assignedDevices.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_DEVICES_UNASSIGNED);
            UserInteractor.printJsonData(this._summary.assignedDevices.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.devices.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_DEVICES_REMOVED);
            UserInteractor.printJsonData(this._summary.devices.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }        
        if (this._summary.flaggedBuilds.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_BUILDS_FLAGGED);
            UserInteractor.printJsonData(this._summary.flaggedBuilds.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.sourceFiles.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_FILES);
            let files = {};
            if (this._summary.sourceFiles.length > 0) {
                files['Device/agent source files'] = this._summary.sourceFiles;
            }
            UserInteractor.printJsonData(files);
            UserInteractor.printMessage('');
        }
        if (this._summary.projectConfig) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_PROJECT_FILE);
        }
    }

    _modificationNeeded() {
        return this._summary.flaggedBuilds.length > 0 || this._summary.assignedDevices.length > 0;
    }

    _delete() {
        return this._unassignDevices().
            then(() => this._unflagBuilds()).
            then(() => this._deleteEntities()).
            then(() => this._removeDevices()).
            then(() => this._deleteSourceFiles()).
            then(() => this._deleteProjectConfig());
    }

    _unassignDevices() {
        return this._helper.makeConcurrentOperations(this._summary.assignedDevices.map(device => device._unassign()));
    }

    _unflagBuilds() {
        return this._helper.makeConcurrentOperations(this._summary.flaggedBuilds.map(build => build._unflag()));
    }

    _deleteEntities() {
        return this._summary.entities.reverse().reduce(
            (acc, entity) => acc.then(() => 
                entity._deleteEntity().then(() => 
                    UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_DELETED, entity.identifierInfo))),
            Promise.resolve());
    }

    _removeDevices() {
        return this._helper.makeConcurrentOperations(this._summary.devices.map(device => 
            device._deleteEntity().then(() =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_REMOVED, device.identifierInfo))));
    }

    _deleteSourceFiles(summary) {
        if (this._summary.sourceFiles.length > 0) {
            return Promise.all(this._summary.sourceFiles.map(fileName => {
                return Utils.deleteFile(fileName);
            })).then(() =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.FILES_DELETED, 
                    this._summary.sourceFiles.map(fileName => Util.format('"%s"', fileName)).join(', ')));
        }
    }

    _deleteProjectConfig() {
        if (this._summary.projectConfig) {
            return this._summary.projectConfig.delete().then(() =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_DELETED, this._summary.projectConfig.type));
        }
    }
}

module.exports = DeleteHelper;

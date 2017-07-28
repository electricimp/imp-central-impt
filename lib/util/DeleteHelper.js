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
const Utils = require('./Utils');

// Helper class for build-cli delete commands.
class DeleteHelper {

    constructor() {
        this._summary = {
            entities : [],
            devices : [],
            flaggedBuilds : [],
            assignedDevices : [],
            sourceFiles : [],
            authConfig : null,
            projectConfig : null
        };
    }

    // Processes delete command: 
    // - Collects a summary of all entities which are going to be deleted and modified
    //   during the Entity deleting. It can be:
    //     - Project Config file,
    //     - Project source files,
    //     - Auth Config file,
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
            const message = this._getDeleteMessage(entity);
            const continueMessage = this._getContinueMessage(entity);
            return UserInteractor.processChoicesWithCancel(
                message,
                [continueMessage],
                [this._delete.bind(this)],
                undefined,
                options.force,
                0);
        });
    }

    _printDeleteSummary() {
        if (this._summary.entities.length > 0) {
            UserInteractor.printMessage('The following entities will be deleted to perform the operation:');
            UserInteractor.printJsonData(this._summary.entities.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.assignedDevices.length > 0) {
            UserInteractor.printMessage('The following Devices will be unassigned from Device Groups to perform the operation:');
            UserInteractor.printJsonData(this._summary.assignedDevices.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.devices.length > 0) {
            UserInteractor.printMessage('The following Devices will be removed from the account to perform the operation:');
            UserInteractor.printJsonData(this._summary.devices.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }        
        if (this._summary.flaggedBuilds.length > 0) {
            UserInteractor.printAlert('The following Builds are marked "flagged" to prevent deleting.');
            UserInteractor.printAlert('They will be modified by setting "flagged" to false to perform the operation:');
            UserInteractor.printJsonData(this._summary.flaggedBuilds.map(entity => entity.displayData));
            UserInteractor.printMessage('');
        }
        if (this._summary.sourceFiles.length > 0 || this._summary.authConfig) {
            UserInteractor.printMessage('The following files will be deleted to perform the operation:');
            let files = {};
            if (this._summary.sourceFiles.length > 0) {
                files['Device/agent source files'] = this._summary.sourceFiles;
            }
            if (this._summary.authConfig) {
                files['Auth config'] = this._summary.authConfig.fileName;
            }
            UserInteractor.printJsonData(files);
            UserInteractor.printMessage('');
        }
    }

    _modificationNeeded() {
        return this._summary.flaggedBuilds.length > 0 || this._summary.assignedDevices.length > 0;
    }

    _getDeleteMessage(entity) {
        const Project = require('../Project');
        const Device = require('../Device');
        if (entity instanceof Project) {
            return 'Are you sure you want to delete the current Project?';
        }
        else if (entity instanceof Device) {
            return 'Are you sure you want to remove the Device from the account?';
        }
        else if (this._modificationNeeded()) {
            return 'Are you sure you want to delete/modify all of the listed entities?';
        }
        else {
            return 'Are you sure you want to delete all of the listed entities?';
        }
    }

    _getContinueMessage(entity) {
        const Project = require('../Project');
        const Device = require('../Device');
        let message;
        if (entity instanceof Project) {
            message = 'The existing Project will be deleted';
        }
        else if (entity instanceof Device) {
            message = 'The Device will be removed';
        }
        else if (this._modificationNeeded()) {
            message = 'All of the entities will be deleted/modified';
        }
        else {
            message = 'All of the entities will be deleted';
        }
        return Util.format('Continue the operation. %s', message);
    }

    _delete() {
        return this._unassignDevices().
            then(() => this._unflagBuilds()).
            then(() => this._deleteEntities()).
            then(() => this._removeDevices()).
            then(() => this._deleteSourceFiles()).
            then(() => this._deleteAuthConfig()).
            then(() => this._deleteProjectConfig());            
    }

    _unassignDevices() {
        return Promise.all(this._summary.assignedDevices.map(device => device._unassign()));
    }

    _unflagBuilds() {
        return Promise.all(this._summary.flaggedBuilds.map(build => build._unflag()));
    }

    _deleteEntities() {
        return this._summary.entities.reverse().reduce(
            (acc, entity) => acc.then(() => 
                entity._deleteEntity().then(() => 
                    UserInteractor.printMessage(Util.format('%s deleted successfully', entity.identifierInfo)))),
            Promise.resolve());
    }

    _removeDevices() {
        return Promise.all(this._summary.devices.map(device => 
            device._deleteEntity().then(() =>
                UserInteractor.printMessage(Util.format('%s removed successfully', device.identifierInfo)))));
    }

    _deleteSourceFiles(summary) {
        if (this._summary.sourceFiles.length > 0) {
            return Promise.all(this._summary.sourceFiles.map(fileName => {
                return Utils.deleteFile(fileName);
            })).then(() =>
                UserInteractor.printMessage('Device/agent source files %s deleted successfully', 
                    this._summary.sourceFiles.map(fileName => Util.format('"%s"', fileName)).join(', ')));
        }
    }

    _deleteAuthConfig() {
        if (this._summary.authConfig) {
            return this._summary.authConfig.delete().then(() =>
                UserInteractor.printMessage('Local Auth config deleted successfully'));
        }
    }

    _deleteProjectConfig() {
        if (this._summary.projectConfig) {
            return this._summary.projectConfig.delete().then(() =>
                UserInteractor.printMessage('Project deleted successfully'));
        }
    }
}

module.exports = DeleteHelper;

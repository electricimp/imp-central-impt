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
const Identifier = require('./Identifier');
const Utils = require('./Utils');

const PRINTED_ENTITIES_LIMIT = 5;

// Helper class for impt delete commands.
class DeleteHelper {

    constructor() {
        this._summary = {
            entities : [],
            devices : [],
            flaggedBuilds : [],
            assignedDevices : [],
            sourceFiles : [],
            dirs : {},
            configs : []
        };
        this._helper = ImpCentralApiHelper.getEntity();
    }

    // Processes delete command: 
    // - Collects a summary of all entities which are going to be deleted and modified
    //   during the Entity deleting. It can be:
    //     - Config files,
    //     - Project source files,
    //     - Entity to be deleted,
    //     - Device Groups associated with the Product,
    //     - flagged Deployments and assigned Devices of the Device Groups
    // - Displays a summary of all entities to be deleted/modified and 
    //   asks a user to confirm the operation.
    // - Performs the modification/deleting if confirmed.
    processDelete(entity, options) {
        return entity._collectDeleteSummary(this._summary, options).
            then(() => this._processDelete(options));
    }

    processDeleteEntities(entities, options) {
        return this._helper.makeConcurrentOperations(
            entities, (entity) => entity._collectDeleteSummary(this._summary, options)).
            then(() => this._processDelete(options));
    }

    _processDelete(options) {
        if (!options.confirmed) {
            this._printDeleteSummary();
        }
        return UserInteractor.processCancelContinueChoice(
            null,
            this._delete.bind(this),
            undefined,
            options.confirmed);
    }

    _printEntities(entities) {
        if (entities.length > 0) {
            const entitiesToPrint = entities.slice(0, PRINTED_ENTITIES_LIMIT);
            UserInteractor.printJsonData(entitiesToPrint.map(entity => entity.displayData));
            if (entitiesToPrint.length < entities.length) {
                UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_MORE_ENTITIES,
                    entities.length - entitiesToPrint.length, entities[0].entityType);
            }
        }
    }

    _printDeleteSummary() {
        if (this._summary.entities.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_ENTITIES);
            const displayOrder = [
                Identifier.ENTITY_TYPE.TYPE_PRODUCT,
                Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP,
                Identifier.ENTITY_TYPE.TYPE_DEVICE,
                Identifier.ENTITY_TYPE.TYPE_BUILD,
                Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY,
                Identifier.ENTITY_TYPE.TYPE_ACCOUNT,
                Identifier.ENTITY_TYPE.TYPE_WEBHOOK
            ];
            for (let entityType of displayOrder) {
                const entities = this._summary.entities.filter(entity => entity.entityType === entityType);
                this._printEntities(entities);
            }
            UserInteractor.printMessage('');
        }
        if (this._summary.assignedDevices.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_DEVICES_UNASSIGNED);
            this._printEntities(this._summary.assignedDevices);
            UserInteractor.printMessage('');
        }
        if (this._summary.devices.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_DEVICES_REMOVED);
            this._printEntities(this._summary.devices);
            UserInteractor.printMessage('');
        }        
        if (this._summary.flaggedBuilds.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_BUILDS_FLAGGED);
            this._printEntities(this._summary.flaggedBuilds);
            UserInteractor.printMessage('');
        }
        if (this._summary.sourceFiles.length > 0) {
            UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_FILES);
            let files = {};
            files['Device/agent source files'] = this._summary.sourceFiles;
            UserInteractor.printJsonData(files);
            UserInteractor.printMessage('');
        }
        if (Object.keys(this._summary.dirs).length > 0) {
            Object.keys(this._summary.dirs).forEach(key =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_DIR, key, this._summary.dirs[key]));
        }
        if (this._summary.configs.length > 0) {
            this._summary.configs.filter(config => config.exists()).
                forEach(config => {
                    if (config.isCurrDir()) {
                        UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_CONFIG_FILE_CURR_DIR, config.type);
                    }
                    else {
                        UserInteractor.printMessage(UserInteractor.MESSAGES.DELETE_CONFIG_FILE, config.type, config.fileName);
                    }
                });
            this._summary.configs.filter(config => !config.exists()).
                forEach(config => {
                    if (config.isCurrDir()) {
                        UserInteractor.printMessage(UserInteractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG, config.type);
                    }
                    else {
                        UserInteractor.printMessage(UserInteractor.MESSAGES.NO_CONFIG_MSG, config.type, config.fileName);
                    }
                });
        }
    }

    _modificationNeeded() {
        return this._summary.flaggedBuilds.length > 0 || this._summary.assignedDevices.length > 0;
    }

    _delete() {
        return this._unassignDevices().
            then(() => this._unflagBuilds()).
            then(() => this._deleteAllEntities()).
            then(() => this._removeDevices()).
            then(() => this._deleteSourceFiles()).
            then(() => this._deleteDirs()).
            then(() => this._deleteConfigs());
    }

    _unassignDevices() {
        return this._helper.makeConcurrentOperations(this._summary.assignedDevices, (device) => device._unassign());
    }

    _unflagBuilds() {
        return this._helper.makeConcurrentOperations(this._summary.flaggedBuilds, (build) => build._unflag());
    }

    _deleteEntities(entities) {
        return this._helper.makeConcurrentOperations(entities,
            (entity) => entity._deleteEntity().then(() =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_DELETED, entity.identifierInfo)));
    }

    _deleteAllEntities() {
        const deleteOrder = [
            Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP,
            Identifier.ENTITY_TYPE.TYPE_PRODUCT,
            Identifier.ENTITY_TYPE.TYPE_DEVICE,
            Identifier.ENTITY_TYPE.TYPE_BUILD,
            Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY,
            Identifier.ENTITY_TYPE.TYPE_ACCOUNT,
            Identifier.ENTITY_TYPE.TYPE_WEBHOOK
        ];
        return deleteOrder.reduce((acc, entityType) => acc.then(() => {
            const entities = this._summary.entities.filter(entity => entity.entityType === entityType);
            if (entities.length === 0) {
                return Promise.resolve();
            }
            if (entityType === Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP) {
                const devGroupsWithTarget = [];
                const devGroupsWithoutTarget = [];
                for (let devGroup of entities) {
                    if (devGroup.productionTargetId) {
                        devGroupsWithTarget.push(devGroup);
                    }
                    else {
                        devGroupsWithoutTarget.push(devGroup);
                    }
                }
                return this._deleteEntities(devGroupsWithTarget).
                    then(() => this._deleteEntities(devGroupsWithoutTarget));
            }
            else {
                return this._deleteEntities(entities);
            }
        }), Promise.resolve());
    }

    _removeDevices() {
        return this._helper.makeConcurrentOperations(this._summary.devices, (device) => 
            device._deleteEntity().then(() =>
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_REMOVED, device.identifierInfo)));
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

    _deleteDirs(summary) {
        Object.keys(this._summary.dirs).map(key => {
            const dirName = this._summary.dirs[key];
            Utils.removeDirSync(dirName);
            UserInteractor.printMessage(UserInteractor.MESSAGES.DIR_DELETED, key, dirName);
        });
        return Promise.resolve();
    }

    _deleteConfigs() {
        if (this._summary.configs.length > 0) {
            return Promise.all(this._summary.configs.map(config => {
                if (config.exists()) {
                    return config.delete().then(() =>
                        UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_DELETED, config.type));
                }
            }));
        }
    }
}

module.exports = DeleteHelper;

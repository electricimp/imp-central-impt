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

const Util = require('util');
const UserInteractor = require('./UserInteractor');
const ImpCentralApiHelper = require('./ImpCentralApiHelper');
const Identifier = require('./Identifier');
const Utils = require('./Utils');
const Errors = require('./Errors');

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

    cleanup(entity) {
        return entity._collectCleanupSummary(this._summary).
            then(() => this._delete());
    }

    _processDelete(options) {
        const printSummary = options.confirmed ? 
            Promise.resolve() :
            this._collectDisplayData().then(() => this._printDeleteSummary());
        return printSummary.then(() =>
            UserInteractor.processCancelContinueChoice(
                null,
                this._delete.bind(this),
                undefined,
                options.confirmed));
    }

    _printDeleteSummary() {
        if (this._summary.entities.length > 0) {
            UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_ENTITIES);
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
                const entities = this._summary.entities.filter(entity => entity.entityType === entityType).
                    map(entity => entity.displayData);
                UserInteractor.printObjectDialog(entities);
            }
            UserInteractor.printDialog('');
        }
        if (this._summary.assignedDevices.length > 0) {
            UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_DEVICES_UNASSIGNED);
            UserInteractor.printObjectDialog(this._summary.assignedDevices.map(entity => entity.displayData));
            UserInteractor.printDialog('');
        }
        if (this._summary.devices.length > 0) {
            UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_DEVICES_REMOVED);
            UserInteractor.printObjectDialog(this._summary.devices.map(entity => entity.displayData));
            UserInteractor.printDialog('');
        }        
        if (this._summary.flaggedBuilds.length > 0) {
            UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_BUILDS_FLAGGED);
            UserInteractor.printObjectDialog(this._summary.flaggedBuilds.map(entity => entity.displayData));
            UserInteractor.printDialog('');
        }
        if (this._summary.sourceFiles.length > 0) {
            UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_FILES);
            let files = {};
            files[UserInteractor.MESSAGES.PROJECT_DEVICE_AGENT_FILES] = this._summary.sourceFiles;
            UserInteractor.printObjectDialog(files);
            UserInteractor.printDialog('');
        }
        if (Object.keys(this._summary.dirs).length > 0) {
            Object.keys(this._summary.dirs).forEach(key =>
                UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_DIR, key, this._summary.dirs[key]));
        }
        if (this._summary.configs.length > 0) {
            this._summary.configs.filter(config => config.exists()).
                forEach(config => {
                    if (config.isCurrDir()) {
                        UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_CONFIG_FILE_CURR_DIR, config.type);
                    }
                    else {
                        UserInteractor.printDialog(UserInteractor.MESSAGES.DELETE_CONFIG_FILE, config.type, config.fileName);
                    }
                });
            this._summary.configs.filter(config => !config.exists()).
                forEach(config => {
                    if (config.isCurrDir()) {
                        UserInteractor.printDialog(UserInteractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG, config.type);
                    }
                    else {
                        UserInteractor.printDialog(UserInteractor.MESSAGES.NO_CONFIG_MSG, config.type, config.fileName);
                    }
                });
        }
    }

    _collectDisplayData() {
        return this._helper.makeConcurrentOperations(this._summary.entities, (entity) => entity._collectShortListData()).
            then(() => this._helper.makeConcurrentOperations(this._summary.devices, (entity) => entity._collectShortListData())).
            then(() => this._helper.makeConcurrentOperations(this._summary.flaggedBuilds,
                (build) => {
                    if (!build.displayData) {
                        return build._collectShortListData();
                    }
                    return Promise.resolve();
                })).
            then(() => this._helper.makeConcurrentOperations(this._summary.assignedDevices,
                (device) => {
                    if (!device.displayData) {
                        return device._collectShortListData();
                    }
                    return Promise.resolve();
                }));
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
        return this._helper.makeConcurrentOperations(
            this._summary.assignedDevices,
            (device) => device._unassign(),
            this._onDeviceAlreadyUnassignedError.bind(this));
    }

    _unflagBuilds() {
        return this._helper.makeConcurrentOperations(
            this._summary.flaggedBuilds,
            (build) => build._unflag(),
            this._onEntityNotFoundError.bind(this));
    }

    _deleteEntities(entities) {
        return this._helper.makeConcurrentOperations(
            entities,
            (entity) => entity._deleteEntity().
                then(() => UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_DELETED, entity.identifierInfo)),
            this._onEntityNotFoundError.bind(this));
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
                    if (devGroup.productionTargetId || devGroup.dutTargetId) {
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
        return this._helper.makeConcurrentOperations(
            this._summary.devices,
            (device) => device._deleteEntity().
                then(() => UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_REMOVED, device.identifierInfo)),
            this._onEntityNotFoundError.bind(this));
    }

    _onEntityNotFoundError(error, entity) {
        if (error instanceof Errors.EntityNotFoundError) {
            UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_ALREADY_DELETED, entity.identifierInfo);
        }
        else {
            throw error;
        }
    }

    _onDeviceAlreadyUnassignedError(error, device) {
        if (error instanceof Errors.EntityNotFoundError || this._helper.isMultipleEntitiesNotFoundError(error)) {
            UserInteractor.printInfo(UserInteractor.MESSAGES.DEVICE_ALREADY_UNASSIGNED, device.identifierInfo);
        }
        else {
            throw error;
        }
    }

    _deleteSourceFiles(summary) {
        if (this._summary.sourceFiles.length > 0) {
            return Promise.all(this._summary.sourceFiles.map(fileName => {
                return Utils.deleteFile(fileName);
            })).then(() =>
                UserInteractor.printInfo(UserInteractor.MESSAGES.FILES_DELETED, 
                    this._summary.sourceFiles.map(fileName => Util.format('"%s"', fileName)).join(', ')));
        }
    }

    _deleteDirs(summary) {
        Object.keys(this._summary.dirs).map(key => {
            const dirName = this._summary.dirs[key];
            Utils.removeDirSync(dirName);
            UserInteractor.printInfo(UserInteractor.MESSAGES.DIR_DELETED, key, dirName);
        });
        return Promise.resolve();
    }

    _deleteConfigs() {
        if (this._summary.configs.length > 0) {
            return Promise.all(this._summary.configs.map(config => {
                if (config.exists()) {
                    return config.delete().then(() =>
                        UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_DELETED, config.type));
                }
            }));
        }
    }
}

module.exports = DeleteHelper;

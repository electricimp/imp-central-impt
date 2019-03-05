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

const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const UserInteractor = require('./util/UserInteractor');
const ProjectConfig = require('./util/ProjectConfig');
const Utils = require('./util/Utils');
const Errors = require('./util/Errors');
const DeleteHelper = require('./util/DeleteHelper');
const Options = require('./util/Options');
const Product = require('./Product');
const DeviceGroup = require('./DeviceGroup');
const ProductionTarget = require('./util/Target').ProductionTarget;
const DutTarget = require('./util/Target').DutTarget;
const Build = require('./Build');
const Device = require('./Device');
const Auth = require('./Auth');
const Util = require('util');

// This class represents impt Project entity.
// 
// Project is an artificial entity introduced to help developers to align their work 
// with impCentral API.
// 
// Project is any directory on a local storage where Project Config is located.
// Project Config is the tool specific file which links a user's source code located 
// in a directory to impCentral API entities.
//
// The main link from a project to impCentral API entities is impCentral API Device Group Id.
class Project {
    constructor(options) {
        options = options || {};
        this._projectConfig = ProjectConfig.getEntity();
        this._helper = ImpCentralApiHelper.getEntity();
        UserInteractor.setOutputFormat(options, this._helper);

        this._product = null;
        this._deviceGroup = null;
    }

    get entityType() {
        return this._projectConfig.type;
    }

    // Creates a new Project in the current directory by linking it to the new Device Group.
    // - optionally creates new Product
    // - creates new Device Group
    // - creates source files if needed
    //
    // Parameters:
    //     options : Options    impt options of the 'project create' command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _create(options) {
        this._projectConfig.clean();
        return this._findOrCreateProduct(options).
            then(() => this._createDeviceGroup(options)).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig());
    }

    // 'project create' command implementation.
    // Creates a new Project in the current directory depending on the options.
    //
    // Parameters:
    //     options : Options    impt options of the 'project create' command
    //
    // Returns:                 Nothing
    create(options) {
        this._checkExistingProject(options, this._create.bind(this)).
            then(() => this._info()).
            then(info => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_CREATED, this.entityType);
                UserInteractor.printResultWithStatus(info);
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Checks if the current directory already contains Project File.
    // If so, a user is informed and asked to:
    // Cancel the operation
    // Continue the operation. In this case the existed Project File will be replaced.
    // (Done automatically with --confirmed option)
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //     continueHandler :    handler to be executed if a user confirmed the operation
    //              Function    or with --confirmed option 
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _checkExistingProject(options, continueHandler) {
        return UserInteractor.processCancelContinueChoice(
            Util.format(UserInteractor.MESSAGES.CONFIG_EXISTS_CURR_DIR, this.entityType),
            continueHandler,
            options,
            !this._projectConfig.exists() || options.confirmed);
    }

    // Links Project to the specified Device Group and displays current Project info.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Project linked successfully 
    //                          or rejects with an error
    _link(options) {
        this._projectConfig.clean();
        return this._initDeviceGroup(options).
            then(() => this._linkToDeviceGroup()).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig());
    }

    // 'project link' command implementation.
    // Creates a new project in the current directory by linking it to the specified Device Group.
    // If the specified Device Group does not exist, a user is informed and the operation is stopped.
    //
    // Parameters:
    //     options : Options    impt options of 'project link' command
    //
    // Returns:                 Nothing
    link(options) {
        this._checkExistingProject(options, this._link.bind(this)).
            then(() => this._info()).
            then(info => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.PROJECT_LINKED);
                UserInteractor.printResultWithStatus(info);
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Updates the current Device Group name, description and target if needed.
    //
    // Parameters:
    //     options : Options    impt options of 'project update' command
    //
    // Returns:                 Promise that resolves when the Project updated successfully 
    //                          or rejects with an error
    _updateDeviceGroup(options) {
        if (options.name || options.description || options.target || options.dut) {
            return this._deviceGroup._update(options);
        }
        return Promise.resolve();
    }

    // 'project update' command implementation.
    // Updates project in the current directory.
    // If the current directory does not contain Project Config, a user is informed and the operation is stopped.
    // If the Device Group with the id, saved in Project File, does not exist anymore, a user is informed 
    // and the operation is stopped.
    //
    // Parameters:
    //     options : Options    impt options of 'project update' command
    //
    // Returns:                 Nothing
    update(options) {
        this._checkProjectConfig().
            then(() => this._initDeviceGroup(options)).
            then(() => this._updateDeviceGroup(options)).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig()).
            then(() => this._info()).
            then(info => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_UPDATED, this.entityType);
                UserInteractor.printResultWithStatus(info);
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Collects info about the current Project.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _info(options) {
        options = options || new Options();
        return this._initDeviceGroup(null, true).
            then(() => this._deviceGroup._collectInfoData(options.full)).
            then(() => {
                const data = {
                    [UserInteractor.MESSAGES.PROJECT_DEVICE_FILE] : this._projectConfig.deviceFile,
                    [UserInteractor.MESSAGES.PROJECT_AGENT_FILE] : this._projectConfig.agentFile
                }
                Object.assign(data, this._deviceGroup.displayData);
                return { [this.entityType] : data }; 
            }).
            then((info) => {
                if (options.full) {
                    return new Auth(null, true)._info().
                        then(authInfo => {
                            Object.assign(info, authInfo);
                            return info;
                        });
                }
                return info;
            });
    }

    // 'project info' command implementation.
    // Displays info about the current Project.
    // The latest actual info is obtained using impCentral API.
    //
    // Returns:                 Nothing
    info(options) {
        this._checkProjectConfig().
            then(() => this._info(options)).
            then(info => UserInteractor.printResultWithStatus(info)).
            catch(error => UserInteractor.processError(error))
    }

    // Collects a summary of all entities which are going to be deleted and modified
    // during the Project deleting:
    // - Project Config file,
    // - Project source files,
    // - current Device Group,
    // - the Product which contains current Device Group (if it has this one Device Group only)
    // - flagged Deployments and assigned Devices of the current Device Group
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    impt options of 'project delete' command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary, options) {
        summary.configs.push(this._projectConfig);
        if (options.files || options.all) {
            if (Utils.existsFileSync(this._projectConfig.deviceFile)) {
                summary.sourceFiles.push(this._projectConfig.deviceFile);
            }
            if (Utils.existsFileSync(this._projectConfig.agentFile)) {
                summary.sourceFiles.push(this._projectConfig.agentFile);
            }
        }

        if ((options.entities || options.all) && this._projectConfig.deviceGroupId) {
            let productDeviceGroups = null;
            return this._initDeviceGroup().
                then(() => {
                    const productId = this._deviceGroup.relatedProductId;
                    const relatedDeviceGroupCount = this._deviceGroup.productionTargetId && this._deviceGroup.dutTargetId ? 3 : 1;
                    return new DeviceGroup().listByProduct(productId).
                        then(devGroups => {
                            productDeviceGroups = devGroups;
                            if (devGroups.length === relatedDeviceGroupCount) {
                                return new Product().initById(productId)._collectDeleteSummary(summary, new Options());
                            }
                            return Promise.resolve();
                        });
                }).
                then(() => this._collectTargetDeleteSummary(summary, productDeviceGroups, new ProductionTarget(null, this._deviceGroup.type))).
                then(() => this._collectTargetDeleteSummary(summary, productDeviceGroups, new DutTarget(null, this._deviceGroup.type))).
                then(() => this._deviceGroup._collectDeleteSummary(summary, new Options({ [Options.FORCE] : true, [Options.BUILDS] : true }))).
                catch(error => {
                    if (error instanceof Errors.OutdatedConfigEntityError) {
                        // the Project's Device Group doesn't already exist, no error needed
                    }
                    else {
                        throw error;
                    }
                });
        }
        else {
            return Promise.resolve();
        }
    }

    _collectTargetDeleteSummary(summary, productDeviceGroups, target) {
        const targetDeviceGroupId = target.getTargetId(this._deviceGroup);
        if (targetDeviceGroupId && productDeviceGroups.filter(devGroup =>
                targetDeviceGroupId === target.getTargetId(devGroup)).length === 1) {
            return new DeviceGroup().initById(targetDeviceGroupId).
                _collectDeleteSummary(summary, new Options({ [Options.FORCE] : true, [Options.BUILDS] : true }));
        }
        return Promise.resolve();
    }

    // 'project delete' command implementation.
    // Deletes the current Project:
    // - deletes Project File located in the current directory
    // - with --dg option: also deletes the Device Group referenced by Project File.
    // - with --product option: also deletes the Product which contains the Device Group referenced
    //     by Project File. The Product can be deleted if it contains this one Device Group only.
    //     Otherwise, the Product is not deleted but this is not considered as a fail, the rest of
    //     the command may be completed successfully, including the Device Group deletion.
    // - with --files option: also deletes the files referenced by Project File as files with
    //     IMP device and agent source code.
    //
    // Parameters:
    //     options : Options    impt options of 'project delete' command
    //
    // Returns:                 Nothing
    delete(options) {
        if (this._projectConfig.exists()) {
            new DeleteHelper().processDelete(this, options).
                then(() => UserInteractor.printResultWithStatus()).
                catch(error => UserInteractor.processError(error));
        }
        else {
            UserInteractor.printInfo(UserInteractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG, this.entityType);
            UserInteractor.printResultWithStatus();
        }
    }

    _findOrCreateProduct(options) {
        this._product = new Product();
        return this._product.initByIdentifier(options.productIdentifier).findEntity().then(entity => {
            if (entity) {
                return Promise.resolve();
            }
            else if (options.createProduct) {
                return this._product.createByName(options.productIdentifier);
            }
            else {
                return Promise.reject(new Errors.EntityNotFoundError(this._product.entityType, options.productIdentifier));
            }
        });
    }

    _createDeviceGroup(options) {
        this._deviceGroup = new DeviceGroup();
        const type = options.preFactory ?
            DeviceGroups.TYPE_PRE_FACTORY_FIXTURE :
            DeviceGroups.TYPE_DEVELOPMENT;
        return this._deviceGroup._createByProductId(this._product.id, options, type).
            then(() => this._linkToDeviceGroup());
    }

    // Links the current Project to the specified Device Group.
    _linkToDeviceGroup() {
        if (this._deviceGroup.type === DeviceGroups.TYPE_DEVELOPMENT ||
            this._deviceGroup.type === DeviceGroups.TYPE_PRE_FACTORY_FIXTURE) {
            this._projectConfig.deviceGroupId = this._deviceGroup.id;
            return Promise.resolve();
        }
        else {
            return Promise.reject(new Errors.ImptError(
                UserInteractor.ERRORS.PROJECT_LINK_WRONG_DG_TYPE,
                Options.getDeviceGroupTypeName(this._deviceGroup.type),
                Options.getDeviceGroupTypeName(DeviceGroups.TYPE_DEVELOPMENT),
                Options.getDeviceGroupTypeName(DeviceGroups.TYPE_PRE_FACTORY_FIXTURE)));
        }
    }

    // Initializes the Project's Device Group.
    _initDeviceGroup(options, isInfo = false) {
        this._deviceGroup = new DeviceGroup(options);
        return this._deviceGroup.getEntity(isInfo);
    }

    // Processes Project source files:
    // save agent/device file names and creates files if needed
    _processSourceFiles(options) {
        if (options.deviceFile) {
            this._projectConfig.deviceFile = options.deviceFile;
        }
        if (options.agentFile) {
            this._projectConfig.agentFile = options.agentFile;
        }
        return this._createSourceFile(this._projectConfig.deviceFile, UserInteractor.MESSAGES.PROJECT_DEVICE_SOURCE_FILE).
            then(() => this._createSourceFile(this._projectConfig.agentFile, UserInteractor.MESSAGES.PROJECT_AGENT_SOURCE_FILE));
    }

    _createSourceFile(fileName, type) {
        if (fileName && !Utils.existsFileSync(fileName)) {
            return Utils.create(fileName).then(() =>
                UserInteractor.printInfo(
                    UserInteractor.MESSAGES.ENTITY_CREATED, Util.format('%s "%s"', type, fileName)));
        }
        return Promise.resolve();
    }

    // Checks that the current Project Config is exists and not corrupted.
    _checkProjectConfig() {
        return this._projectConfig.checkConfig();
    }

    // Saves the Project Config file
    _saveProjectConfig() {
        return this._projectConfig.save();
    }
}

module.exports = Project;

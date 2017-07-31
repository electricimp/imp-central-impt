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

const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const UserInteractor = require('./util/UserInteractor');
const ProjectConfig = require('./util/ProjectConfig');
const Utils = require('./util/Utils');
const Errors = require('./util/Errors');
const DeleteHelper = require('./util/DeleteHelper');
const Auth = require('./Auth');
const Product = require('./Product');
const DeviceGroup = require('./DeviceGroup');
const Build = require('./Build');
const Device = require('./Device');
const Util = require('util');

const DEFAULT_ACTIVE_DEVICE_GROUP_NAME_PART = 'Default DG';

// This class represents build-cli Project entity.
// 
// Project is an artificial entity introduced to help developers to align their work 
// with impCentral API.
// 
// Project is any directory on a local storage where Project Config is located.
// Project Config is the tool specific file which links a user’s source code located 
// in a directory to impCentral API entities.
//
// The main link from a project to impCentral API entities is impCentral API Product Id.
// One Device Group (per one Product/project) can be Active Device Group.
class Project {
    constructor(options) {
        options = options || {};
        this._projectConfig = ProjectConfig.getEntity();
        this._helper = ImpCentralApiHelper.getEntity();
        if (options.debug) {
            this._helper.debug = true;
        }

        this._product = null;
    }

    // Returns default active Device Group name
    _getDefaultActiveDeviceGroupName(productName) {
        return Util.format('%s: %s', productName, DEFAULT_ACTIVE_DEVICE_GROUP_NAME_PART);
    }

    // Creates a new impCentral API Product 
    //
    // Parameters:
    //     options : Options    build-cli options of the 'project new' command
    //
    // Returns:                 Promise that resolves when the Product is successfully created,
    //                          or rejects with an error
    _createProduct(options) {
        const product = new Product();
        return product._create(options).
            then(() => this._linkToProduct(product));
    }

    // Creates a new Project from scratch:
    // - creates a new Product,
    // - creates and activate a Devivce Group,
    // - creates source files if needed.
    //
    // Parameters:
    //     options : Options    build-cli options of the 'project new' command
    //
    // Returns:                 Promise that resolves when the Project is successfully created,
    //                          or rejects with an error
    _createProject(options) {
        return this._createProduct(options).
            then(() => this._createActiveDeviceGroup(options.activate)).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig());
    }

    // Creates a new Project in the current directory.
    // If Product with the specified name already exists a user is informed and asked to:
    // Cancel the operation
    // Link project to the existing Product. The operation is continued as like project link command.
    // Link project to the existing Product and update it by the specified options (if any).
    // The operation is continued as like project link command followed by project update command.
    // (Done automatically with --force option.)
    //
    // Parameters:
    //     options : Options    build-cli options of the 'project new' command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _create(options) {
        this._projectConfig.clean();
        return new Product().initByName(options.name).findEntity().then(entity => {
            if (entity) {
                options.productIdentifier = options.name;
                return UserInteractor.processChoicesWithCancel(
                    'The Product with specified name already exists.',
                    ['Link project to the existing Product',
                     'Link project to the existing Product and update it by the specified arguments'],
                    [this._link.bind(this),
                     this._linkAndUpdate.bind(this)],
                    options,
                    options.force,
                    1
                );
            }
            else {
                return this._createProject(options).then(() => {
                    UserInteractor.printMessage('Project created successfully');
                    return this._info();
                });
            }
        });
    }

    // build-cli 'project new' command implementation.
    // Creates a new Project in the current directory depending on the options.
    //
    // Parameters:
    //     options : Options    build-cli options of the 'project new' command
    //
    // Returns:                 Nothing
    create(options) {
        this._checkExistingProject(options, this._create.bind(this)).
            catch(error => UserInteractor.processError(error));
    }

    // Checks if the current directory already contains Project File.
    // If so, a user is informed and asked to:
    // Cancel the operation
    // Continue the operation. In this case the existed Project File will be replaced.
    // (Done automatically with --force option)
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //     continueHandler :    handler to be executed if a user confirmed the operation
    //              Function    or with --force option 
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _checkExistingProject(options, continueHandler) {
        return UserInteractor.processChoicesWithCancel(
            'The current directory already contains existing Project.',
            ['Continue the operation. The existing Project file will be replaced'],
            [continueHandler],
            options,
            !this._projectConfig.exists() || options.force,
            0
        );
    }

    // Links current Project to the existing Product and updates it by the specified options (if any).
    // 
    // Parameters:
    //     options : Options    build-cli options of the 'project new' command
    // 
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _linkAndUpdate(options) {
        return this._linkProject(options).then(() => {
            return this._updateProject(options);
        }).then(() => {
            UserInteractor.printMessage('Project linked and updated successfully');
            return this._info();
        });
    }

    // Links Project to the specified Product, chooses Active Device Group (if any)
    // and creates source files if needed.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Project linked successfully 
    //                          or rejects with an error
    _linkProject(options) {
        return this._initProduct(options).
            then(() => this._linkToProduct()).
            then(() => this._chooseActiveDeviceGroup()).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig());
    }

    // Links Project to the specified Product and displays current Project info.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Project linked successfully 
    //                          or rejects with an error
    _link(options) {
        this._projectConfig.clean();
        return this._linkProject(options).then(() => {
            UserInteractor.printMessage('Project linked successfully');
            return this._info();
        });
    }

    // build-cli 'project link' command implementation.
    // Creates a new project in the current directory by linking it to the specified Product.
    // If the specified Product does not exist, a user is informed and the operation is stopped.
    //
    // Parameters:
    //     options : Options    build-cli options of 'project link' command
    //
    // Returns:                 Nothing
    link(options) {
        this._checkExistingProject(options, this._link.bind(this)).
            catch(error => UserInteractor.processError(error));
    }

    // Updates the current Product name and description if needed.
    //
    // Parameters:
    //     options : Options    build-cli options of 'project update' command
    //
    // Returns:                 Promise that resolves when the Project updated successfully 
    //                          or rejects with an error
    _updateProduct(options) {
        if (options.name || options.description) {
            return this._product._update(options);
        }
        return Promise.resolve();
    }

    // Updates Project in the current directory:
    // - updates the Product name and description if needed,
    // - creates a new Device Group if not found and marks it as Active Device Group,
    // - creates source files if needed
    //
    // Parameters:
    //     options : Options    build-cli options of 'project update' command
    //
    // Returns:                 Promise that resolves when the Project updated successfully 
    //                          or rejects with an error
    _updateProject(options) {
        return this._initProduct(options).
            then(() => this._updateProduct(options)).
            then(() => this._findOrCreateActiveDeviceGroup(options.activate)).
            then(() => this._processSourceFiles(options)).
            then(() => this._saveProjectConfig());
    }

    // build-cli 'project update' command implementation.
    // Updates project in the current directory.
    // If the current directory does not contain Project Config, a user is informed and the operation is stopped.
    // If the Product with the Product Id, saved in Project File, does not exist anymore, a user is informed 
    // and the operation is stopped.
    // If the Product with the Product Id, saved in Project File, exists, then the project is updated.
    //
    // Parameters:
    //     options : Options    build-cli options of 'project update' command
    //
    // Returns:                 Nothing
    update(options) {
        this._checkProjectConfig().
            then(() => this._updateProject(options)).then(() => {
                UserInteractor.printMessage('Project updated successfully');
                this._info();
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Collects info about Device Group.
    // The info includes:
    // - DeviceGroup Id, Name, Description
    // - The latest Deployment (if any)
    // - Active DeviceGroup (if any)
    // - Devices assigned (if any)
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeviceGroupDisplayData(deviceGroup) {
        let displayData;
        return deviceGroup._collectDisplayData(['name', 'description']).
        then(() => {
            displayData = deviceGroup.displayData[deviceGroup.entityType];
            // mark active device group
            const isActive = (deviceGroup.id === this._projectConfig.activeDevGroupId);
            if (isActive) {
                displayData = Object.assign({ active : true }, displayData);
            }
        }).
        then(() => {
            // add latest deployment info
            if (deviceGroup.currentDeploymentId) {
                const build = new Build().initById(deviceGroup.currentDeploymentId);
                return build.getEntity().then(() => 
                    build._collectDisplayData(['sha', 'origin', 'tags', 'flagged']).then(() =>
                        displayData['Latest Deployment'] = build.displayData[build.entityType]));
            }
        }).
        then(() => {
            // add assigned devices info
            const device = new Device();
            return device.listByDeviceGroup(deviceGroup.id).then(devices =>
                Promise.all(devices.map(device => device._collectDisplayData(device._getListAttrs()))).then(() => {
                    if (devices.length > 0) {
                        displayData['Devices'] = devices.map(device => device.displayData);
                    }
                }));
        }).
        then(() => {
            deviceGroup.displayData[deviceGroup.entityType] = displayData;
            return deviceGroup;
        });
    }

    // Collects info about the current Project and displays it.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _info() {
        return this._initProduct().
            then(() => this._product._collectDisplayData(['name', 'description'])).
            then(() => new DeviceGroup().listByProduct(this._product.id)).
            then((deviceGroups) =>
                Promise.all(deviceGroups.map(deviceGroup => this._collectDeviceGroupDisplayData(deviceGroup)))).
            then((deviceGroups) => {
                let data = this._product.displayData;
                if (deviceGroups.length > 0) {
                    data['Product']['Device Groups'] = deviceGroups.map(devGroup => devGroup.displayData);
                }
                data['Device file'] = this._projectConfig.deviceFile;
                data['Agent file'] = this._projectConfig.agentFile;
                data['impCentral API endpoint'] = this._helper.apiEndpoint;
                data['Type of login'] = this._helper.authConfig.isGlobal ? 'global' : 'local';

                UserInteractor.printMessage('\nCurrent Project info:\n');
                UserInteractor.printJsonData(data);
            });
    }

    // build-cli 'project info' command implementation.
    // Displays info about the current Project.
    // The latest actual info is obtained using impCentral API.
    //
    // Returns:                 Nothing
    info() {
        this._checkProjectConfig().
            then(() => this._info()).
            catch(error => UserInteractor.processError(error))
    }

    // Collects a summary of all entities which are going to be deleted and modified
    // during the Project deleting:
    // - Project Config file,
    // - Project source files,
    // - Auth Config file,
    // - current Product,
    // - Device Groups associated with the Product,
    // - flagged Deployments and assigned Devices of the Device Groups
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    build-cli options of 'project delete' command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary, options) {
        summary.projectConfig = this._projectConfig;
        if ((options.logout || options.all) && !this._helper.authConfig.isGlobal) {
            summary.authConfig = this._helper.authConfig;
        }
        if (options.files || options.all) {
            summary.sourceFiles.push(this._projectConfig.deviceFile);
            summary.sourceFiles.push(this._projectConfig.agentFile);
        }
        if ((options.product || options.all) && this._projectConfig.productId) {
            return this._initProduct().
                then(() => this._product._collectDeleteSummary(summary)).
                catch(error => {
                    if (error instanceof Errors.OutdatedProjectEntityError) {
                        // the Project's Product doesn't already exist, no error needed
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

    // build-cli 'project delete' command implementation.
    // Deletes the current Project:
    // - deletes Project File located in the current directory
    // - with --product option: also deletes the corresponding Product which was specified in Project File
    // - with --files option: also deletes the local files which were specified in Project File as 
    //   device/agent source files.
    // - with --logout option: also deletes Auth Config File (if any) located in the current directory.
    //
    // Parameters:
    //     options : Options    build-cli options of 'project delete' command
    //
    // Returns:                 Nothing
    delete(options) {
        this._checkProjectConfig().
            then(() => new DeleteHelper().processDelete(this, options)).
            catch(error => UserInteractor.processError(error));
    }

    // Marks the specified Device Group as Active.
    _activateDeviceGroup(deviceGroup) {
        this._projectConfig.activeDevGroupId = deviceGroup.id;
        return this._saveProjectConfig().then(() => 
            UserInteractor.printMessage('Device Group "%s" set as Active for the current Project', deviceGroup.id));
    }

    // Chooses Active Device Group according to the following rules:
    // If Product has only one Device Group, it is marked as Active.
    // If Product has more than one Device Groups, the most recently updated Device Group
    // is marked as Active.
    _chooseActiveDeviceGroup() {
        return new DeviceGroup().listByProduct(this._product.id, true).then(devGroups => {
            if (devGroups.length === 0) {
                return Promise.resolve(null);
            }
            else if (devGroups.length === 1) {
                return Promise.resolve(devGroups[0]);
            }
            else {
                // choose the most recently updated device group
                devGroups.sort((dg1, dg2) => 
                    (new Date(dg2.updatedAt).getTime() - new Date(dg1.updatedAt).getTime()));
                return Promise.resolve(devGroups[0]);
            }
        }).then((deviceGroup) => {
            if (deviceGroup) {
                return this._activateDeviceGroup(deviceGroup);
            }
            else {
                UserInteractor.printMessage('No Active Device Group found for the current Project');
            }
            return Promise.resolve();
        });
    }

    // Creates new Device Group with the specified name and marks it Active.
    _createActiveDeviceGroup(deviceGroupName) {
        const devGroupName = deviceGroupName || this._getDefaultActiveDeviceGroupName(this._product.name);
        const deviceGroup = new DeviceGroup();
        return deviceGroup.createByProductIdAndName(this._product.id, devGroupName).then(() =>
            this._activateDeviceGroup(deviceGroup));
    }

    // Finds a Device Group with the specified name or creates it if not found 
    // and marks it Active.
    _findOrCreateActiveDeviceGroup(deviceGroupName) {
        if (deviceGroupName) {
            return new DeviceGroup().listByProduct(this._product.id, false).then(deviceGroups => {
                deviceGroups = deviceGroups.filter(dg => dg.name === deviceGroupName);
                if (deviceGroups.length > 0) {
                    return this._activateDeviceGroup(deviceGroups[0]);
                }
                else {
                    return this._createActiveDeviceGroup(deviceGroupName);
                }
            });
        }
        else {
            return Promise.resolve();
        }
    }

    // Checks Device Group specified by a user and marks it Active if it has valid type
    // and belongs to the current Product.
    checkAndSetActiveDeviceGroup(deviceGroup) {
        return this._checkProjectConfig().then(() => {
            if (deviceGroup.relatedProductId === this._projectConfig.productId) {
                if (deviceGroup.hasValidType()) {
                    return this._activateDeviceGroup(deviceGroup);                        
                }
                else {
                    UserInteractor.processError(new Errors.UnsupportedDeviceGroupTypeError(
                        deviceGroup.identifierInfo, deviceGroup.type, 'Impossible to Activate Device Group'));
                }
            }
            else {
                return Promise.reject(new Errors.DeviceGroupActivationError(deviceGroup.identifierInfo));
            }
        });
    }

    // Checks if the deleted Device Group is Active for the current Project and
    // choose a new Active Device Group.
    modifyActiveDeviceGroup(deletedDeviceGroup) {
        if (!this._projectConfig.exists() ||
            deletedDeviceGroup.id !== this._projectConfig.activeDevGroupId) {
            return Promise.resolve();
        }
        return this._checkProjectConfig().
            then(() => this._initProduct()).
            then(() => this._chooseActiveDeviceGroup());
    }

    // Links the current Project to the specified Product.
    _linkToProduct(product = null) {
        if (product) {
            this._product = product;
        }
        this._projectConfig.productId = this._product.id;
        return Promise.resolve();
    }

    // Initializes the Project's Product
    _initProduct(options) {
        this._product = new Product(options);
        return this._product.getEntity();
    }

    // Processes Project source files:
    // save agent/device file names and creates files if needed
    _processSourceFiles(options) {
        const deviceFile = options.deviceFile; 
        const agentFile = options.agentFile; 
        const createSourceFiles = options.createFiles;

        if (deviceFile) {
            this._projectConfig.deviceFile = deviceFile;
        }
        if (agentFile) {
            this._projectConfig.agentFile = agentFile;
        }
        if (createSourceFiles) {
            return this._createSourceFile(this._projectConfig.deviceFile, 'Device').then(() =>
                this._createSourceFile(this._projectConfig.agentFile, 'Agent'));
        }
        return Promise.resolve();
    }

    _createSourceFile(fileName, type) {
        if (!Utils.existsFileSync(fileName)) {
            return Utils.create(fileName).then(() =>
                UserInteractor.printMessage('%s source file "%s" created successfully', type, fileName));
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

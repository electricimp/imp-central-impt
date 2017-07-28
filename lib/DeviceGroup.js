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
const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const Errors = require('./util/Errors');
const Product = require('./Product');

// This class represents Device Group impCentral API entity.
// Provides methods used by build-cli Device Group Manipulation Commands.
// NOTE: only 'development_devicegroup' type is currently supported for the most operations 
// (except for list and info).
class DeviceGroup extends Entity {

    // Returns the Device Group latest Deployment, if exists
    get currentDeploymentId() {
        if ('current_deployment' in this.apiEntity.relationships) {
            return this.apiEntity.relationships.current_deployment.id;
        }
        return undefined;
    }

    // Returns the Device Group related Product id
    get relatedProductId() {
        return this.apiEntity.relationships.product.id;
    }

    // Returns the Device Group name
    get name() {
        return this.apiEntity.attributes.name;
    }

    // Returns the Device Group updated_at attribute
    get updatedAt() {
        return this.apiEntity.attributes.updated_at;
    }

    // Returns the Device Group type
    get type() {
        return this.apiEntity.type;
    }

    // Obtains impCentral entity corresponded to the current Device Group,
    // and validates its type.
    // Fails if if the entity not found or the type is not development_devicegroup.
    // 
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    getEntityAndValidateType() {
        return this.getEntity().then(() => {
            if (this.hasValidType()) {
                return Promise.resolve(this);
            }
            else {
                return Promise.reject(new Errors.UnsupportedDeviceGroupTypeError(this.identifierInfo, this.type));
            }
        });
    }

    // Checks the type of the Device Group.
    // NOTE: only 'development_devicegroup' type is currently considered as valid. 
    //
    // Returns:                 true if the type is development_devicegroup,
    //                          false otherwise
    hasValidType() {
        if (this.apiEntity.type === DeviceGroups.TYPE_DEVELOPMENT) {
            return true;
        }
        return false;
    }

    // Creates a Device Group with the specified name related to the specified Product.
    // 
    // Parameters:
    //     productId : String    id of parent Product
    //     devGroupName : String name of the Device Group to be created
    //
    // Returns:                  Promise that resolves when the Device Group is successfully created, 
    //                           or rejects with an error
    createByProductIdAndName(productId, devGroupName) {
        return this._create(
            new Options({ [Options.PRODUCT_ID] : productId, [Options.NAME] : devGroupName }));
    }

    // Collects impCentral API attributes for Device Group creation based on build-cli options of 
    // 'dg create' command and creates a new impCentral Device Group.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group is successfully created, 
    //                          or rejects with an error
    _create(options) {
        const product = new Product(options);
        return product.getEntityId().then(() => {
            const attrs = {
                name : options.name,
                description : options.description
            };
            return super._createEntity(product.id, DeviceGroups.TYPE_DEVELOPMENT, attrs);
        }).then(() => this._activate(options));
    }

    // Collects impCentral API attributes for Device Group update based on build-cli options of
    // 'dg update' command and updates the specific Device Group.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        return this.getEntityAndValidateType().then(() => {
            const attrs = {
                name : options.name,
                description : options.description
            };
            return super._updateEntity(DeviceGroups.TYPE_DEVELOPMENT, attrs).
                then(() => this._activate(options));
        });
    }

    // Updates a specific Device Group or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    update(options) {
        if (options.name || options.description) {
            // update device group and then activate it if needed
            super.update(options);
        }
        else if (options.activate) {
            // no update needed, just activate device group
            this.getEntityAndValidateType().
                then(() => this._activate(options)).
                catch(error => UserInteractor.processError(error));
        }
    }

    // Collects a summary of all entities which are going to be deleted and modified
    // during the Device Group deleting:
    // the Device Group, related flagged Deployments and assigned Devices.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary) {
        const Device = require('./Device');
        const Build = require('./Build');
        return this.getEntity().then(() => 
            this._collectDisplayData().then(() => {
                summary.entities.push(this);
                const device = new Device();
                return device.listByDeviceGroup(this.id).then(devices =>
                    device._collectDisplayListData(devices).then(() =>
                        summary.assignedDevices = summary.assignedDevices.concat(devices)
                )).then(() => {
                    const build = new Build();
                    return build.listFlaggedByDeviceGroup(this.id).then(builds => {
                        build._collectDisplayListData(builds).then(() => {
                            summary.flaggedBuilds = summary.flaggedBuilds.concat(builds);
                            return Promise.resolve();
                        });
                    });
                });
            }));
    }

    // Deletes a specific Device Group if it has development_devicegroup type.
    // If the deleted Device Group was Active for the current Project, forces the Project to choose
    // another active Device Group.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group is successfully deleted,
    //                          or rejects with an error
    _delete(options) {
        return this.getEntityAndValidateType().then(() =>
            super._delete(options).then(() => {
                const Project = require('./Project');
                return new Project().modifyActiveDeviceGroup(this);
            })
        );
    }

    // Lists Device Groups filtered by Product id.
    //
    // Parameters:
    //     productId: String     id of Product
    //     onlyDevType : Boolean if true, lists only Device Groups with 'development_devicegroup' type,
    //                           otherwise lists all Device Groups
    //
    // Returns:                  Promise that resolves when the Device Group list is successfully
    //                           obtained, or rejects with an error
    listByProduct(productId, onlyDevType = false) {
        const filters = { [DeviceGroups.FILTER_PRODUCT_ID] : productId }
        if (onlyDevType) {
            filters[DeviceGroups.FILTER_TYPE] = DeviceGroups.TYPE_DEVELOPMENT;
        };
        return this._listEntities(filters);
    }

    // Lists all or filtered Device Groups available for a user.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        const productFilters = [{
            id : options.productId,
            name : options.productName,
            entity : Product,
            filterName : DeviceGroups.FILTER_PRODUCT_ID
        }];
        return super.listByParentIdOrName({}, productFilters);
    }

    // Reboots all of the Devices associated with the Device Group
    // if it has development_devicegroup type.
    // Fails if the Device Group does not have assigned Devices.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _restart() {
        return this.getEntityAndValidateType().then(() => {
            const Device = require('./Device');
            const device = new Device();
            return device.listByDeviceGroup(this.id).then(devices => {
                if (devices.length > 0) {
                    return this._helper.restartDevices(this.id).then(() =>
                        UserInteractor.printMessage('Devices assigned to %s restarted successfully',
                            this.identifierInfo));
                }
                else {
                    return Promise.reject(new Errors.DeviceGroupHasNoDevicesError(this.identifierInfo));
                }
            });
        });
    }

    // Reboots all of the Devices associated with the Device Group or reports an error occurred.
    // Fails if the Device Group does not have assigned Devices.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    restart(options) {
        this._restart().
            catch(error => UserInteractor.processError(error));
    }

    // Sets the Device Group as Active for the current Project 
    // (if the Project Config exists and the Device Group belongs to its Product)
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _activate(options) {
        const Project = require('./Project');
        if (options.activate) {
            return new Project().checkAndSetActiveDeviceGroup(this);
        }
        return Promise.resolve();
    }

    // Returns array of impCentral properties that will be displayed for every Device Group
    // by 'dg list' and 'dg info' build-cli command
    _getInfoProperties() {
        return ['id', 'type'];
    }

    // Returns related entities that will be displayed for every Device Group
    // by 'dg info' build-cli command
    _getInfoRelationships() {
        return [
            { name : 'product', Entity : Product },
        ];
    }

    // Returns array of attributes that will be displayed for every Device Group
    // by 'dg list' build-cli command
    _getListAttrs() {
        return ['type', 'name', 'description'];
    }

    // Initializes the Device Group entity
    _init() {
        this._Entity = DeviceGroup;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, ['name']);
    }

    // Sets the Device Group specific options based on build-cli command options:
    // if --dg or --dg-id option is specified, the Device Group identifier 
    // is initialized by its value,
    // otherwise the identifier is initialized by the Project Config Active Device Group, if exists.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.deviceGroupId) {
            this._identifier.initById(options.deviceGroupId);
        }
        else if (options.deviceGroupIdentifier) {
            this._identifier.initByIdentifier(options.deviceGroupIdentifier);
        }
        else if (this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().then(() =>
                this._identifier.initByIdFromConfig(this._projectConfig.activeDevGroupId));
        }
        return Promise.resolve();
    }
}

module.exports = DeviceGroup;

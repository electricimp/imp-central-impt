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
const ListHelper = require('./util/ListHelper');
const UserInteractor = require('./util/UserInteractor');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const Errors = require('./util/Errors');
const Product = require('./Product');

// This class represents Device Group impCentral API entity.
// Provides methods used by impt Device Group Manipulation Commands.
class DeviceGroup extends Entity {

    // Returns the Device Group latest Deployment, if exists
    get currentDeploymentId() {
        if ('current_deployment' in this.apiEntity.relationships) {
            return this.apiEntity.relationships.current_deployment.id;
        }
        return undefined;
    }

    // Returns the Device Group min supported Deployment, if exists
    get minSupportedDeploymentId() {
        if ('min_supported_deployment' in this.apiEntity.relationships) {
            return this.apiEntity.relationships.min_supported_deployment.id;
        }
        return undefined;
    }

    // Returns the production target Device Group, if exists
    get productionTargetId() {
        if ('production_target' in this.apiEntity.relationships) {
            return this.apiEntity.relationships.production_target.id;
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

    // Returns the Device Group type
    get type() {
        return this.apiEntity.type;
    }

    // Collects impCentral API attributes for Device Group creation based on impt options of 
    // 'dg create' command and creates a new impCentral Device Group.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group is successfully created, 
    //                          or rejects with an error
    _create(options, deviceGroupType = null) {
        const product = new Product(options);
        return product.getEntityId().
            then(() => this._createByProductId(product.id, options, deviceGroupType));
    }

    _createByProductId(productId, options, deviceGroupType) {
        const dgType = deviceGroupType ? deviceGroupType : options.type;
        return this._processProductionTarget(productId, dgType, options).
            then(() => {
                const attrs = {
                    name : options.name,
                    description : options.description
                };
                this.initByName(options.name);
                return super._createEntity(productId, dgType, attrs, this._getProductionTargetOptions());
            });
    }

    _getProductionTargetType(deviceGroupType) {
        switch (deviceGroupType) {
            case DeviceGroups.TYPE_PRE_FACTORY_FIXTURE:
                return DeviceGroups.TYPE_PRE_PRODUCTION;
            case DeviceGroups.TYPE_FACTORY_FIXTURE:
                return DeviceGroups.TYPE_PRODUCTION;
        }
        return null;
    }

    _processProductionTarget(productId, deviceGroupType, options) {
        if (options.target) {
            if (!Options.isProductionTargetRequired(deviceGroupType)) {
                return Promise.reject(new Errors.ImptError(
                    UserInteractor.ERRORS.WRONG_DG_TYPE_FOR_TARGET,
                    Options.TARGET,
                    Options.getDeviceGroupTypeName(deviceGroupType),
                    Options.getDeviceGroupTypeName(DeviceGroups.TYPE_PRE_FACTORY_FIXTURE),
                    Options.getDeviceGroupTypeName(DeviceGroups.TYPE_FACTORY_FIXTURE)));
            }
            this._productionTarget = new DeviceGroup();
            return this._productionTarget.initByIdentifier(options.target).findEntity().then(entity => {
                const targetRequiredType = this._getProductionTargetType(deviceGroupType);
                if (entity) {
                    if (this._productionTarget.type !== targetRequiredType) {
                        return Promise.reject(
                            new Errors.ImptError(
                                UserInteractor.ERRORS.TARGET_DG_WRONG_TYPE, 
                                this._productionTarget.identifierInfo,
                                Options.getDeviceGroupTypeName(this._productionTarget.type),
                                Options.getDeviceGroupTypeName(targetRequiredType)));
                    }
                    else if (this._productionTarget.relatedProductId !== productId) {
                        return Promise.reject(
                            new Errors.ImptError(UserInteractor.ERRORS.TARGET_DG_WRONG_PRODUCT));
                    }
                    return Promise.resolve();
                }
                else if (options.createTarget) {
                    return this._productionTarget._createByProductId(
                        productId, new Options({ [Options.NAME] : options.target }), targetRequiredType);
                }
                else {
                    return Promise.reject(
                        new Errors.ImptError(UserInteractor.ERRORS.TARGET_DG_NOT_FOUND, this._productionTarget.identifierInfo));
                }
            });
        }
        return Promise.resolve();
    }

    _getProductionTargetOptions() {
        return this._productionTarget ?
            { 'id' : this._productionTarget.id, 'type' : this._productionTarget.type } :
            null;
    }

    _isProductionType(deviceGroupType) {
        return deviceGroupType === DeviceGroups.TYPE_PRODUCTION ||
            deviceGroupType === DeviceGroups.TYPE_PRE_PRODUCTION;
    }

    // Collects impCentral API attributes for Device Group update based on impt options of
    // 'dg update' command and updates the specific Device Group.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        return this.getEntity().
            then(() => this._processProductionTarget(this.relatedProductId, this.type, options)).
            then(() => {
                if (options.loadCodeAfterBlessing !== undefined && !this._isProductionType(this.type)) {
                    return Promise.reject(new Errors.ImptError(
                        UserInteractor.ERRORS.WRONG_DG_TYPE_FOR_LOAD_CODE,
                        Options.LOAD_CODE_AFTER_BLESSING,
                        Options.getDeviceGroupTypeName(this.type),
                        Options.getDeviceGroupTypeName(DeviceGroups.TYPE_PRE_PRODUCTION),
                        Options.getDeviceGroupTypeName(DeviceGroups.TYPE_PRODUCTION)));
                }
                return Promise.resolve();
            }).
            then(() => {
                if (options.minSupportedDeployment) {
                    const Build = require('./Build');
                    const newMinSupported = new Build().initByIdentifier(options.minSupportedDeployment);
                    const currMinSupported = this.minSupportedDeploymentId ? 
                        new Build().initById(this.minSupportedDeploymentId) : null;
                    return newMinSupported.getEntity().
                        then(() => {
                            if (newMinSupported.relatedDeviceGroupId !== this.id) {
                                return Promise.reject(new Errors.ImptError(UserInteractor.ERRORS.DG_WRONG_MIN_SUPPORTED_DEPLOYMENT,
                                    newMinSupported.identifierInfo, this.identifierInfo));
                            }
                            return Promise.resolve();
                        }).
                        then(() => currMinSupported ? currMinSupported.getEntity() : Promise.resolve()).
                        then(() => {
                            if (newMinSupported._isOlderThan(currMinSupported)) {
                                return Promise.reject(new Errors.ImptError(UserInteractor.ERRORS.DG_OLD_MIN_SUPPORTED_DEPLOYMENT));
                            }
                            return this._helper.updateMinSupportedDeployment(this.id, newMinSupported.id).
                                then(() => UserInteractor.printMessage(
                                    UserInteractor.MESSAGES.DG_MIN_SUPPORTED_DEPLOYMENT_UPDATED, this.identifierInfo));
                        });
                }
                return Promise.resolve();
            }).
            then(() => {
                const attrs = {
                    name : options.name,
                    description : options.description
                };
                if (options.loadCodeAfterBlessing !== undefined) {
                    attrs.load_code_after_blessing = options.loadCodeAfterBlessing;
                }
                return super._updateEntity(this.type, attrs, this._getProductionTargetOptions());
            });
    }

    // Collects a summary of all additional entities which are going to be deleted and
    // modified during "--full" delete.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    impt options of the corresponding delete command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteFullSummary(summary, options) {
        return this._getAssignedDevices().
            then(devices => {
                return this._helper.makeConcurrentOperations(devices.map(device => 
                    device._collectDisplayListData())).
                    then(() => summary.assignedDevices = summary.assignedDevices.concat(devices));
            }).
            then(() => this._getFlaggedBuilds()).
            then((builds) => {
                return this._helper.makeConcurrentOperations(builds.map(build => 
                    build._collectDisplayListData())).
                    then(() => summary.flaggedBuilds = summary.flaggedBuilds.concat(builds));
            });
    }

    // Lists Device Groups filtered by Product id.
    //
    // Parameters:
    //     productId: String     id of Product
    //
    // Returns:                  Promise that resolves when the Device Group list is successfully
    //                           obtained, or rejects with an error
    listByProduct(productId) {
        return this._list(new Options({ [Options.PRODUCT_IDENTIFIER] : [ productId ] }));
    }

    // Lists all or filtered Device Groups available for a user.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device Group list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        const filters = [];
        if (options.owner) {
            filters.push(new ListHelper.OwnerFilter(DeviceGroups.FILTER_OWNER_ID, options.owner));
        }
        if (options.productIdentifier) {
            filters.push(new ListHelper.ProductFilter(DeviceGroups.FILTER_PRODUCT_ID, options.productIdentifier));
        }
        if (options.deviceGroupType) {
            filters.push(new ListHelper.DeviceGroupTypeFilter(DeviceGroups.FILTER_TYPE, options.deviceGroupType));
        }
        return super._listEntities(filters);
    }

    // Reboots all of the Devices associated with the Device Group.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _restart(options) {
        return this._getAssignedDevices().
            then(devices => {
                if (devices.length > 0) {
                    const conditional = options && options.conditional;
                    return this._helper.restartDevices(this.id, conditional).
                        then(() => UserInteractor.printMessage(
                            conditional ? UserInteractor.MESSAGES.DG_DEVICES_COND_RESTARTED : UserInteractor.MESSAGES.DG_DEVICES_RESTARTED,
                            this.identifierInfo));
                }
                else {
                    UserInteractor.printMessage(UserInteractor.MESSAGES.DG_NO_DEVICES, this.identifierInfo);
                }
            });
    }

    // Reboots all of the Devices associated with the Device Group or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    restart(options) {
        this._restart(options).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _reassign(fromDeviceGroup, toDeviceGroup, deviceIds) {
        return this._helper.assignDevices(toDeviceGroup.id, ...deviceIds).
            then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DG_DEVICES_REASSIGNED,
                fromDeviceGroup.identifierInfo, toDeviceGroup.identifierInfo));
    }

    // Reassigns all Devices from one Device Group to another.
    reassign(options) {
        return this.getEntity().
            then(() => {
                const from = new DeviceGroup().initByIdentifier(options.from);
                return from._getAssignedDevices().
                    then(devices => {
                        if (devices.length > 0) {
                            const deviceIds = devices.map(device => device.id);
                            return UserInteractor.processCancelContinueChoice(
                                this._getReassignMessage(from, this),
                                this._reassign.bind(this),
                                [from, this, deviceIds],
                                options.force || this._isSimpleReassign(from, this));
                        }
                        else {
                            UserInteractor.printMessage(UserInteractor.MESSAGES.DG_NO_DEVICES, from.identifierInfo);
                        }
                    });
            }).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _getReassignMessage(fromDeviceGroup, toDeviceGroup) {
        if (fromDeviceGroup.type !== toDeviceGroup.type &&
            fromDeviceGroup.relatedProductId !== toDeviceGroup.relatedProductId) {
            return Util.format(UserInteractor.MESSAGES.DG_REASSIGN_DIFF_TYPES_AND_PRODUCTS,
                fromDeviceGroup.entityType, fromDeviceGroup._identifier.info, toDeviceGroup._identifier.info,
                Options.getDeviceGroupTypeName(fromDeviceGroup.type), Options.getDeviceGroupTypeName(toDeviceGroup.type));
        }
        else if (fromDeviceGroup.type !== toDeviceGroup.type) {
            return Util.format(UserInteractor.MESSAGES.DG_REASSIGN_DIFF_TYPES,
                fromDeviceGroup.entityType, fromDeviceGroup._identifier.info, toDeviceGroup._identifier.info,
                Options.getDeviceGroupTypeName(fromDeviceGroup.type), Options.getDeviceGroupTypeName(toDeviceGroup.type));
        }
        else if (fromDeviceGroup.relatedProductId !== toDeviceGroup.relatedProductId) {
            return Util.format(UserInteractor.MESSAGES.DG_REASSIGN_DIFF_PRODUCTS,
                fromDeviceGroup.entityType, fromDeviceGroup._identifier.info, toDeviceGroup._identifier.info)
        }
    }

    _isSimpleReassign(fromDeviceGroup, toDeviceGroup) {
        return fromDeviceGroup.type === toDeviceGroup.type &&
            fromDeviceGroup.relatedProductId === toDeviceGroup.relatedProductId;
    }

    // Unassigns all Devices from the specified Device Group.
    unassign(options) {
        return this._getAssignedDevices().
            then(devices => {
                if (devices.length > 0) {
                    const deviceIds = devices.map(device => device.id);
                    return this._helper.unassignDevices(this.id, options.unbond, ...deviceIds).
                        then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DG_DEVICES_UNASSIGNED, this.identifierInfo));
                }
                else {
                    UserInteractor.printMessage(UserInteractor.MESSAGES.DG_NO_DEVICES, this.identifierInfo);
                }
            }).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Set "flagged" attribute to false in all Deployments of the specified Device Group.
    unflag(options) {
        return this._getFlaggedBuilds().
            then((builds) => {
                if (builds.length > 0) {
                    return this._helper.makeConcurrentOperations(builds.map(build => build._unflag())).
                        then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DG_BUILDS_UNFLAGGED, this.identifierInfo));
                }
                else {
                    UserInteractor.printMessage(UserInteractor.MESSAGES.DG_NO_FLAGGED_BUILDS, this.identifierInfo);
                }
            }).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _getAssignedDevices() {
        return this.getEntity().then(() => {
            const Device = require('./Device');
            const device = new Device();
            return device.listByDeviceGroup(this.id);
        });
    }

    _getFlaggedBuilds() {
        return this.getEntity().then(() => {
            const Build = require('./Build');
            const build = new Build();
            return build.listFlaggedByDeviceGroup(this.id);
        });
    }

    // Returns array of impCentral properties that will be displayed for every Device Group
    // by 'dg list' and 'dg info' command
    _getInfoProperties() {
        return ['id', 'type'];
    }

    // Returns related entities that will be displayed for every Device Group
    // by 'dg info' command
    _getInfoRelationships() {
        const Build = require('./Build');
        return [
            {
                name : 'product',
                Entity : Product
            },
            {
                name : 'production_target',
                Entity : DeviceGroup,
                displayName : 'Production Target',
            },
            {
                name : 'current_deployment',
                Entity : Build,
                displayName : 'Current Deployment',
            },
            {
                name : 'min_supported_deployment',
                Entity : Build,
                displayName : 'Min supported Deployment',
            }
        ].concat(super._getInfoRelationships());
    }

    // Returns related entities that will be displayed for every Build
    // by 'build history' command
    _getListRelationships() {
        return [
            { name : 'product', Entity : Product }
        ];
    }

    // Returns array of attributes that will be displayed for every Device Group
    // by 'dg list' command
    _getListAttrs() {
        return ['type', 'name', 'description'];
    }

    _getAttributeValue(attr, apiEntity) {
        let value = super._getAttributeValue(attr, apiEntity);
        if (attr === 'type') {
            value = Options.getDeviceGroupTypeName(value);
        }
        return value;
    }

    // Initializes the Device Group entity
    _init() {
        this._Entity = DeviceGroup;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, ['name']);
        this._productionTarget = null;
    }

    // Sets the Device Group specific options based on impt command options:
    // if --dg or --dg-id option is specified, the Device Group identifier 
    // is initialized by its value,
    // otherwise the identifier is initialized by the Project Config Device Group, if exists.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.deviceGroupIdentifier) {
            this._identifier.initByIdentifier(options.deviceGroupIdentifier);
        }
        else if (options.to) {
            this._identifier.initByIdentifier(options.to);
        }
        else if (this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().then(() =>
                this._identifier.initByIdFromConfig(this._projectConfig.deviceGroupId));
        }
        return Promise.resolve();
    }
}

module.exports = DeviceGroup;

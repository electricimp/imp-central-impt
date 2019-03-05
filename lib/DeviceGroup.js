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
const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const ListHelper = require('./util/ListHelper');
const DeleteHelper = require('./util/DeleteHelper');
const UserInteractor = require('./util/UserInteractor');
const Identifier = require('./util/Identifier');
const ProductionTarget = require('./util/Target').ProductionTarget;
const DutTarget = require('./util/Target').DutTarget;
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const Errors = require('./util/Errors');
const Product = require('./Product');
const Account = require('./Account');

const INFO_FULL_DEVICES_LIMIT = 5;

const ATTR_TYPE = 'type';
const ATTR_LOAD_CODE_AFTER_BLESSING = 'load_code_after_blessing';
const ATTR_REGION = 'region';

const REL_CURRENT_DEPLOYMENT = 'current_deployment';
const REL_MIN_SUPPORTED_DEPLOYMENT = 'min_supported_deployment';
const REL_PRODUCTION_TARGET = 'production_target';
const REL_DUT_TARGET = 'dut_target';

// This class represents Device Group impCentral API entity.
// Provides methods used by impt Device Group Manipulation Commands.
class DeviceGroup extends Entity {

    static get REL_CURRENT_DEPLOYMENT() {
        return REL_CURRENT_DEPLOYMENT;
    }

    // Returns the Device Group latest Deployment, if exists
    get currentDeploymentId() {
        if (REL_CURRENT_DEPLOYMENT in this.apiEntity.relationships) {
            return this.apiEntity.relationships[REL_CURRENT_DEPLOYMENT].id;
        }
        return undefined;
    }

    // Returns the Device Group min supported Deployment, if exists
    get minSupportedDeploymentId() {
        if (REL_MIN_SUPPORTED_DEPLOYMENT in this.apiEntity.relationships) {
            return this.apiEntity.relationships[REL_MIN_SUPPORTED_DEPLOYMENT].id;
        }
        return undefined;
    }

    // Returns the production target Device Group, if exists
    get productionTargetId() {
        if (REL_PRODUCTION_TARGET in this.apiEntity.relationships) {
            return this.apiEntity.relationships[REL_PRODUCTION_TARGET].id;
        }
        return undefined;
    }

    // Returns the DUT target Device Group, if exists
    get dutTargetId() {
        if (REL_DUT_TARGET in this.apiEntity.relationships) {
            return this.apiEntity.relationships[REL_DUT_TARGET].id;
        }
        return undefined;
    }

    // Returns the Device Group related Product id
    get relatedProductId() {
        return this.apiEntity.relationships[Entity.REL_PRODUCT].id;
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
        const dgType = deviceGroupType ? deviceGroupType : options.deviceGroupType;
        this._productionTarget = new ProductionTarget(options, dgType);
        this._dutTarget = new DutTarget(options, dgType);
        return this._processTarget(this._productionTarget, productId).
            then(() => this._processTarget(this._dutTarget, productId)).
            then(() => {
                const attrs = {
                    [Entity.ATTR_NAME] : options.name,
                    [Entity.ATTR_DESCRIPTION] : options.description
                };
                if (options.region) {
                    attrs[ATTR_REGION] = options.region;
                }
                this.initByName(options.name);
                return super._createEntity(
                    productId,
                    dgType,
                    attrs,
                    this._getTargetOptions(this._productionTarget),
                    this._getTargetOptions(this._dutTarget));
            });
    }

    _processTarget(target, productId) {
        if (target.isSpecified()) {
            return target.findOrCreate(productId);
        }
        return Promise.resolve();
    }

    _getTargetOptions(target) {
        return target.deviceGroupId ?
            { [Entity.ATTR_ID] : target.deviceGroupId, [ATTR_TYPE] : target.deviceGroupType } :
            null;
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
            then(() => {
                this._productionTarget = new ProductionTarget(options, this.type);
                return this._processTarget(this._productionTarget, this.relatedProductId);
            }).
            then(() => {
                this._dutTarget = new DutTarget(options, this.type);
                return this._processTarget(this._dutTarget, this.relatedProductId);
            }).
            then(() => {
                if (options.loadCodeAfterBlessing !== undefined && !Options.isProductionDeviceGroupType(this.type)) {
                    return Promise.reject(new Errors.ImptError(
                        UserInteractor.ERRORS.WRONG_DG_TYPE_FOR_OPTION,
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
                                then(() => UserInteractor.printInfo(
                                    UserInteractor.MESSAGES.DG_MIN_SUPPORTED_DEPLOYMENT_UPDATED, this.identifierInfo));
                        });
                }
                return Promise.resolve();
            }).
            then(() => {
                const attrs = {
                    [Entity.ATTR_NAME] : options.name,
                    [Entity.ATTR_DESCRIPTION] : options.description
                };
                if (options.loadCodeAfterBlessing !== undefined) {
                    attrs[ATTR_LOAD_CODE_AFTER_BLESSING] = options.loadCodeAfterBlessing;
                }
                return super._updateEntity(
                    this.type,
                    attrs,
                    this._getTargetOptions(this._productionTarget),
                    this._getTargetOptions(this._dutTarget));
            });
    }

    _collectDeleteSummary(summary, options) {
        return super._collectDeleteSummary(summary, options).
            then(() => {
                if (options.builds) {
                    const Build = require('./Build');
                    return new Build().listByDeviceGroup(this.id).
                        then((builds) => {
                            if (builds.length > 0) {
                                return this._helper.makeConcurrentOperations(builds, 
                                    (build) => build._collectDeleteSummary(summary, new Options(), false));
                            }
                            return Promise.resolve();
                        });
                }
                return Promise.resolve();
            });
    }

    // Collects a summary of all additional entities which are going to be deleted and
    // modified during "--force" delete.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    impt options of the corresponding delete command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteForceSummary(summary, options) {
        return this._getAssignedDevices().
            then(devices => {
                summary.assignedDevices = summary.assignedDevices.concat(devices);
            }).
            then(() => this._getFlaggedBuilds()).
            then((builds) => {
                summary.flaggedBuilds = summary.flaggedBuilds.concat(builds);
            });
    }

    _collectFullTargetInfo(target) {
        if (Options.isProductionDeviceGroupType(this.type) || Options.isDutDeviceGroupType(this.type)) {
            const productId = this.relatedProductId;
            return new DeviceGroup().listByProduct(productId).
                then(devGroups => this._addRelatedEntities(
                    devGroups.filter((devGroup) => this.id === target.getTargetId(devGroup)),
                    false,
                    target.backRelationName));
        }
        return Promise.resolve();
    }

    _collectFullDevicesInfo() {
        // collect info about assigned devices
        const Device = require('./Device');
        return new Device().listByDeviceGroup(this.id).
            then(devices => this._addRelatedEntities(devices, false, null, INFO_FULL_DEVICES_LIMIT));
    }

    _collectFullWebhooksInfo() {
        const Webhook = require('./Webhook');
        return new Webhook().listByDeviceGroup(this.id).
            then(webhooks => this._addRelatedEntities(webhooks, true));
    }

    _collectFullInfo() {
        return this._collectFullTargetInfo(new ProductionTarget(null, this.type)).
            then(() => this._collectFullTargetInfo(new DutTarget(null, this.type))).
            then(() => this._collectFullWebhooksInfo()).
            then(() => this._collectFullDevicesInfo());
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
                    this._assignedDevices = devices;
                    const conditional = options && options.conditional;
                    return this._helper.restartDevices(this.id, conditional).
                        then(() => this._printDevicesList(
                            devices,
                            conditional ? UserInteractor.MESSAGES.DG_DEVICES_COND_RESTARTED : UserInteractor.MESSAGES.DG_DEVICES_RESTARTED,
                            this.identifierInfo));
                }
                else {
                    UserInteractor.printInfo(UserInteractor.MESSAGES.DG_NO_DEVICES, this.identifierInfo);
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
            then(() => {
                if (options.log && this._assignedDevices && this._assignedDevices.length > 0) {
                    const Log = require('./Log');
                    new Log()._stream(this._assignedDevices);
                }
                else {
                    UserInteractor.printResultWithStatus();
                }
            }).
            catch(error => UserInteractor.processError(error));
    }

    _reassign(fromDeviceGroup, toDeviceGroup, devices) {
        const deviceIds = devices.map(device => device.id);
        return this._helper.assignDevices(toDeviceGroup.id, ...deviceIds).
            then(() => this._printDevicesList(
                devices,
                UserInteractor.MESSAGES.DG_DEVICES_REASSIGNED,
                fromDeviceGroup.identifierInfo,
                toDeviceGroup.identifierInfo));
    }

    // Reassigns all Devices from one Device Group to another.
    reassign(options) {
        return this.getEntity().
            then(() => {
                const from = new DeviceGroup().initByIdentifier(options.from);
                return from._getAssignedDevices().
                    then(devices => {
                        if (devices.length > 0) {
                            return this._reassign(from, this, devices);
                        }
                        else {
                            UserInteractor.printInfo(UserInteractor.MESSAGES.DG_NO_DEVICES, from.identifierInfo);
                        }
                    });
            }).
            then(() => UserInteractor.printResultWithStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Unassigns all Devices from the specified Device Group.
    unassign(options) {
        return this._getAssignedDevices().
            then(devices => {
                if (devices.length > 0) {
                    const deviceIds = devices.map(device => device.id);
                    return this._helper.unassignDevices(this.id, options.unbond, ...deviceIds).
                        then(() => this._printDevicesList(devices, UserInteractor.MESSAGES.DG_DEVICES_UNASSIGNED, this.identifierInfo));
                }
                else {
                    UserInteractor.printInfo(UserInteractor.MESSAGES.DG_NO_DEVICES, this.identifierInfo);
                }
            }).
            then(() => UserInteractor.printResultWithStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _printDevicesList(devices, message, ...messageArgs) {
        return this._helper.makeConcurrentOperations(devices, (device) => device._collectShortListData()).
            then(() => {
                UserInteractor.printInfo(message, ...messageArgs);
                UserInteractor.printObjectInfo(devices.map(entity => entity.displayData));
            });
    }

    // Updates and/or deletes builds (Deployments) of the specified Device Group.
    // At the end of the command execution information about all Deployments of the Device Group is displayed.
    builds(options) {
        const Build = require('./Build');
        const build = new Build();
        let minSupportedBuild = null;
        return this.getEntity().
            then(() => {
                if (this.minSupportedDeploymentId &&
                    (options.unflagOld && !options.unflag || options.remove)) {
                    minSupportedBuild = new Build().initById(this.minSupportedDeploymentId);
                    return minSupportedBuild.getEntity();
                }
                return Promise.resolve();
            }).
            then(() => {
                if (options.unflag || options.unflagOld) {
                    return this._getFlaggedBuilds().
                        then((builds) => {
                            if (minSupportedBuild && options.unflagOld && !options.unflag) {
                                builds = builds.filter(build => build._isOlderThan(minSupportedBuild));
                            }
                            if (builds.length > 0) {
                                return this._helper.makeConcurrentOperations(builds, (build) => build._unflag());
                            }
                            else {
                                UserInteractor.printInfo(UserInteractor.MESSAGES.DG_NO_FLAGGED_BUILDS, this.identifierInfo);
                            }
                        });
                }
                return Promise.resolve();
            }).
            then(() => {
                if (options.remove) {
                    return new Build().listUnflaggedByDeviceGroup(this.id).
                        then((builds) => {
                            if (minSupportedBuild) {
                                builds = builds.filter(build => build._isOlderThan(minSupportedBuild));
                            }
                            if (builds.length > 0) {
                                return new DeleteHelper().processDeleteEntities(builds, options);
                            }
                            else {
                                UserInteractor.printInfo(UserInteractor.MESSAGES.DG_NO_BUILDS_TO_DELETE, this.identifierInfo);
                            }
                        });
                }
                return Promise.resolve();
            }).
            then(() => {
                return build.listByDeviceGroup(this.id).
                    then((builds) => build._getListData(builds));
            }).
            then((builds) => {
                UserInteractor.printInfo(...build._getListMessage(builds));
                UserInteractor.printResultWithStatus(builds);
            }).
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
            return new Build().listFlaggedByDeviceGroup(this.id);
        });
    }

    // Returns array of impCentral properties that will be displayed for every Device Group
    // by 'dg list' and 'dg info' command
    _getInfoProperties() {
        return [Entity.ATTR_ID, ATTR_TYPE];
    }

    // Returns related entities that will be displayed for every Device Group
    // by 'dg info' command
    _getInfoRelationships() {
        const Build = require('./Build');
        return [
            {
                name : Entity.REL_PRODUCT,
                Entity : Product
            },
            {
                name : REL_CURRENT_DEPLOYMENT,
                Entity : Build,
                displayName : UserInteractor.MESSAGES.DG_CURRENT_DEPLOYMENT,
            },
            {
                name : REL_MIN_SUPPORTED_DEPLOYMENT,
                Entity : Build,
                displayName : UserInteractor.MESSAGES.DG_MIN_SUPPORTED_DEPLOYMENT,
            },
            {
                name : REL_PRODUCTION_TARGET,
                Entity : DeviceGroup,
                displayName : UserInteractor.MESSAGES.DG_PRODUCTION_TARGET,
            },
            {
                name : REL_DUT_TARGET,
                Entity : DeviceGroup,
                displayName : UserInteractor.MESSAGES.DG_DUT_TARGET,
            }
        ].concat(super._getInfoRelationships());
    }

    _getFullRelationships() {
        const Build = require('./Build');
        return [
            {
                name : REL_CURRENT_DEPLOYMENT,
                Entity : Build,
                displayName : UserInteractor.MESSAGES.DG_CURRENT_DEPLOYMENT,
            },
            {
                name : REL_MIN_SUPPORTED_DEPLOYMENT,
                Entity : Build,
                displayName : UserInteractor.MESSAGES.DG_MIN_SUPPORTED_DEPLOYMENT,
            },
            {
                name : REL_PRODUCTION_TARGET,
                Entity : DeviceGroup,
                displayName : UserInteractor.MESSAGES.DG_PRODUCTION_TARGET,
            },
            {
                name : REL_DUT_TARGET,
                Entity : DeviceGroup,
                displayName : UserInteractor.MESSAGES.DG_DUT_TARGET,
            }
        ];
    }

    // Returns related entities that will be displayed for every Build
    // by 'build history' command
    _getListRelationships() {
        return [
            { name : Entity.REL_PRODUCT, Entity : Product },
            { name : Entity.REL_OWNER, Entity : Account, displayName : UserInteractor.MESSAGES.ENTITY_OWNER, skipMine : true }
        ];
    }

    // Returns array of attributes that will be displayed for every Device Group
    // by 'dg list' command
    _getListAttrs() {
        return [ATTR_TYPE, Entity.ATTR_NAME];
    }

    _getAttributeValue(attr, apiEntity) {
        let value = super._getAttributeValue(attr, apiEntity);
        if (attr === ATTR_TYPE) {
            value = Options.getDeviceGroupTypeName(value);
        }
        return value;
    }

    _hasHierarchicalIdentifier() {
        return true;
    }

    _getHierarchicalEntitiesInfo(parts) {
        if (parts.length === 3) {
            const result = new Product()._getHierarchicalEntitiesInfo(parts.slice(0, 2));
            result.push([ new DeviceGroup().initByIdentifier(parts[2]), DeviceGroups.FILTER_PRODUCT_ID ]);
            return result;
        }
        return null;
    }

    _checkHierarchicalFilters(filters) {
        for (let filter in filters) {
            switch (filter) {
                case DeviceGroups.FILTER_PRODUCT_ID:
                    if (this.relatedProductId !== filters[filter]) {
                        return false;
                    }
            }
        }
        return true;
    }

    // Initializes the Device Group entity
    _init() {
        this._Entity = DeviceGroup;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, [Entity.ATTR_NAME]);
        this._productionTarget = null;
        this._dutTarget = null;
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
            this.initByIdentifier(options.deviceGroupIdentifier);
        }
        else if (options.to) {
            this.initByIdentifier(options.to);
        }
        else if (this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().then(() =>
                this.initByIdFromConfig(this._projectConfig.deviceGroupId, this._projectConfig.type));
        }
        return Promise.resolve();
    }
}

module.exports = DeviceGroup;

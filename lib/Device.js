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
const Devices = ImpCentralApi.Devices;
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Errors = require('./util/Errors');
const Options = require('./util/Options');
const Product = require('./Product');
const DeviceGroup = require('./DeviceGroup');

// This class represents Device impCentral API entity.
// Provides methods used by build-cli Device Manipulation Commands.
class Device extends Entity {
    // Returns online property of the Device
    get online() {
        return this.apiEntity.attributes.device_online;
    }

    // Returns assigned property of the Device
    get assigned() {
        return this.relatedDeviceGroupId != null;
    }

    // Returns the id of associated Device Group, if exists
    get relatedDeviceGroupId() {
        if ('devicegroup' in this.apiEntity.relationships) {
            return this.apiEntity.relationships.devicegroup.id;
        }
        return null;
    }

    // Collects impCentral API attributes for Device update based on build-cli options of
    // 'device update' command and updates the specific Device.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        const attrs = {
            name : options.name
        };
        return super._updateEntity(attrs);
    }

    // Fills DeleteHelper summary with the deleted Device info.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary, options) {
        return this.getEntity().
            then(() => this._collectDisplayData(this._getDeleteAttrs(), this._getDeleteRelationships())).
            then(() => {
                summary.devices.push(this);
                if (options.full) {
                    return this._collectDeleteFullSummary(summary, options);
                }
                return Promise.resolve();
            });
    }

    // Collects a summary of all additional entities which are going to be deleted and
    // modified during "--full" delete.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    build-cli options of the corresponding delete command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteFullSummary(summary, options) {
        if (this.assigned) {
            summary.assignedDevices.push(this);
        }
        return Promise.resolve();
    }

    // Lists Devices filtered by associated Device Group.
    //
    // Parameters:
    //     deviceGroupId: String   id of Device Group
    //
    // Returns:                    Promise that resolves when the Devices list is successfully
    //                             obtained, or rejects with an error
    listByDeviceGroup(deviceGroupId) {
        return this._list(new Options({ [Options.DEVICE_GROUP_ID] : deviceGroupId }));
    }

    // Lists all or filtered Devices available for a user.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Devices list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        const productAndDevGroupFilters = [
            {
                id : options.productId,
                name : options.productName,
                entity : Product,
                filterName : Devices.FILTER_PRODUCT_ID
            },
            {
                id : options.deviceGroupId,
                name : options.deviceGroupName,
                entity : DeviceGroup,
                filterName : Devices.FILTER_DEVICE_GROUP_ID
            }
        ];
        return super.listByParentIdOrName({}, productAndDevGroupFilters).then(devices => {
            // filter devices by assigned/unassigned, online/offline
            let result = devices;
            if ((options.assigned || options.unassigned) && !(options.assigned && options.unassigned)) {
                result = result.filter(device => 
                    options.assigned && device.assigned || options.unassigned && !device.assigned);
            }
            if ((options.online || options.offline) && !(options.online && options.offline)) {
                result = result.filter(device => 
                    options.online && device.online || options.offline && !device.online);
            }
            return Promise.resolve(result);
        });
    }

    // Reboots the Device.
    //
    // Returns:                 Promise that resolves when the Device is successfully
    //                          restarted, or rejects with an error
    _restart() {
        return this.getEntityId().
            then(() => this._helper.restart(this.id)).
            then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DEVICE_RESTARTED, this.identifierInfo));
    }

    // Reboots the Device or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    restart(options) {
        this._restart().
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _assign(deviceGroup) {
        return this._helper.assignDevices(deviceGroup.id, this.id).
            then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DEVICE_ASSIGNED_TO_DG,
                this.identifierInfo, deviceGroup.identifierInfo));
    }

    // Assigns the Device to a Device Group specified by the options or reports an error occurred.
    // User is asked to confirm the operation if the specified Device is already assigned to
    // another Device Group.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    assign(options) {
        const deviceGroup = new DeviceGroup(options);
        this.getEntity().
            then(() => deviceGroup.getEntity()).
            then(() => {
                if (this.relatedDeviceGroupId === deviceGroup.id) {
                    UserInteractor.printMessage(UserInteractor.MESSAGES.DEVICE_ALREADY_ASSIGNED_TO_DG,
                        this.identifierInfo, deviceGroup.identifierInfo);
                }
                else {
                    return UserInteractor.processCancelContinueChoice(
                        Util.format(UserInteractor.MESSAGES.DEVICE_REASSIGN, this.identifierInfo, deviceGroup.identifierInfo),
                        this._assign.bind(this),
                        [deviceGroup],
                        options.force || !this.assigned);
                }
            }).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Unassigns the specified Device. Does nothing if the Device already unassigned.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Device(s) are successfully
    //                          unassigned, or rejects with an error
    _unassign(options) {
        return this.getEntity().then(() => {
            if (this.assigned) {
                return this._helper.unassignDevices(this.relatedDeviceGroupId, Options.unbond, this.id).
                    then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.DEVICE_UNASSIGNED, this.identifierInfo));
            }
            else {
                UserInteractor.printMessage(UserInteractor.MESSAGES.DEVICE_ALREADY_UNASSIGNED, this.identifierInfo);
            }
        });
    }

    // Unassigns the specified Device. Does nothing if the Device already unassigned.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    unassign(options) {
        this._unassign(options).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Returns related entities that will be displayed for every Device
    // by 'device info' build-cli command
    _getInfoRelationships() {
        return [
            { name : 'devicegroup', Entity : DeviceGroup }
        ].concat(super._getInfoRelationships());
    }

    // Returns related entities that will be displayed for every Entity
    // by '... list' build-cli command.
    // To be overwritten in children classes.
    _getListRelationships() {
        return [ { name : 'devicegroup', Entity : DeviceGroup, relationships : [] } ];
    }

    // Returns array of attributes that will be displayed for every Device
    // by 'device list' build-cli command
    _getListAttrs() {
        return ['name', 'mac_address', 'ip_address', 'device_online', 'agent_id', 'agent_running'];
    }

    // Returns array of attributes that will be displayed for every Entity
    // by delete summary.
    // To be overwritten in children classes.
    _getDeleteAttrs() {
        return ['name', 'mac_address'];
    }

    // Returns related entities that will be displayed for every Entity
    // by delete summary.
    // To be overwritten in children classes.
    _getDeleteRelationships() {
        return [ { name : 'devicegroup', Entity : DeviceGroup, relationships : [] } ];
    }

    // Initializes the Device entity
    _init() {
        this._Entity = Device;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_DEVICE, ['mac_address', 'ip_address', 'agent_id', 'name']);
    }

    // Sets the Device specific options based on build-cli command options:
    // if --device <DEVICE_IDENTIFIER> option is specified, the Device identifier 
    // is initialized by its value
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.deviceIdentifier) {
            this._identifier.initByIdentifier(options.deviceIdentifier);
        }
        return Promise.resolve();
    }
}

module.exports = Device;

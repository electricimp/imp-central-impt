// MIT License
//
// Copyright 2019 Electric Imp
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

const ImpCentralApi = require('imp-central-api');
const DeviceGroups = ImpCentralApi.DeviceGroups;
const Options = require('./Options');
const Errors = require('./Errors');
const UserInteractor = require('./UserInteractor');

// Auxiliary classes to work with Device Group targets: production target and dut target.
class Target {
    constructor(parentDeviceGroupType, deviceGroupType, option, relationName, backRelationName) {
        this._parentDeviceGroupType = parentDeviceGroupType;
        this._deviceGroupType = deviceGroupType;
        this._option = option;
        this._name = relationName;
        this._backRelationName = backRelationName;
        this._identifier = undefined;
        this._createIfAbsent = false;
        this._deviceGroup = null;
    }

    get deviceGroupType() {
        return this._deviceGroupType;
    }

    get backRelationName() {
        return this._backRelationName;
    }

    get deviceGroupId() {
        return this._deviceGroup ? this._deviceGroup.id : null;
    }

    isSpecified() {
        return this._identifier !== undefined;
    }

    findOrCreate(parentProductId) {
        if (!Options.isTargetRequired(this._parentDeviceGroupType)) {
            throw new Errors.ImptError(
                UserInteractor.ERRORS.WRONG_DG_TYPE_FOR_OPTION,
                this._option,
                Options.getDeviceGroupTypeName(this._parentDeviceGroupType),
                Options.getDeviceGroupTypeName(DeviceGroups.TYPE_PRE_FACTORY_FIXTURE),
                Options.getDeviceGroupTypeName(DeviceGroups.TYPE_FACTORY_FIXTURE));
        }
        const DeviceGroup = require('../DeviceGroup');
        this._deviceGroup = new DeviceGroup();
        return this._deviceGroup.initByIdentifier(this._identifier).findEntity().then(entity => {
            if (entity) {
                if (this._deviceGroup.type !== this._deviceGroupType) {
                    throw new Errors.ImptError(
                        UserInteractor.ERRORS.TARGET_DG_WRONG_TYPE,
                        this._name,
                        this._deviceGroup.identifierInfo,
                        Options.getDeviceGroupTypeName(this._deviceGroup.type),
                        Options.getDeviceGroupTypeName(this._deviceGroupType));
                }
                else if (this._deviceGroup.relatedProductId !== parentProductId) {
                    throw new Errors.ImptError(UserInteractor.ERRORS.TARGET_DG_WRONG_PRODUCT, this._name);
                }
                return Promise.resolve();
            }
            else if (this._createIfAbsent) {
                return this._deviceGroup._createByProductId(
                    parentProductId, new Options({ [Options.NAME] : this._identifier }), this._deviceGroupType);
            }
            else {
                throw new Errors.ImptError(
                    UserInteractor.ERRORS.TARGET_DG_NOT_FOUND,
                    this._name,
                    this._deviceGroup.identifierInfo);
            }
        });
    }
}

class ProductionTarget extends Target {
    constructor(options, parentDeviceGroupType) {
        super(
            parentDeviceGroupType,
            parentDeviceGroupType === DeviceGroups.TYPE_PRE_FACTORY_FIXTURE ?
                DeviceGroups.TYPE_PRE_PRODUCTION :
                DeviceGroups.TYPE_PRODUCTION,
            Options.TARGET,
            UserInteractor.MESSAGES.DG_PRODUCTION_TARGET,
            UserInteractor.MESSAGES.DG_PRODUCTION_TARGET_FOR);
        if (options) {
            this._identifier = options.target;
            this._createIfAbsent = options.createTarget;
        }
    }

    getTargetId(deviceGroup) {
        return deviceGroup.productionTargetId;
    }
}

class DutTarget extends Target {
    constructor(options, parentDeviceGroupType) {
        super(
            parentDeviceGroupType,
            parentDeviceGroupType === DeviceGroups.TYPE_PRE_FACTORY_FIXTURE ?
                DeviceGroups.TYPE_PRE_DUT :
                DeviceGroups.TYPE_DUT,
            Options.DUT,
            UserInteractor.MESSAGES.DG_DUT_TARGET,
            UserInteractor.MESSAGES.DG_DUT_TARGET_FOR);
        if (options) {
            this._identifier = options.dut;
            this._createIfAbsent = options.createDut;
        }
    }

    getTargetId(deviceGroup) {
        return deviceGroup.dutTargetId;
    }
}

module.exports = Target;
module.exports.ProductionTarget = ProductionTarget;
module.exports.DutTarget = DutTarget;

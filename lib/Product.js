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
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const UserInteractor = require('./util/UserInteractor');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const Errors = require('./util/Errors');
const ListHelper = require('./util/ListHelper');
const ImpCentralApi = require('imp-central-api');
const Products = ImpCentralApi.Products;
const Account = require('./Account');

// This class represents Product impCentral API entity.
// Provides methods used by impt Products Manipulation Commands.
class Product extends Entity {
    // Returns the Product name
    get name() {
        return this.apiEntity.attributes.name;
    }

    // Creates a Product with the specified name.
    // 
    // Parameters:
    //     name : String        name of the Product to be created
    //
    // Returns:                 Promise that resolves when the Product is successfully created, 
    //                          or rejects with an error
    createByName(name) {
        return this._create(new Options({ [Options.NAME] : name }));
    }

    // Collects impCentral API attributes for Product creation based on impt options of 
    // 'product create' command and creates a new impCentral Product.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Product is successfully created, 
    //                          or rejects with an error
    _create(options) {
        const attrs = {
            name : options.name,
            description : options.description
        };
        this.initByName(options.name);
        return super._createEntity(attrs);
    }

    // Collects impCentral API attributes for Product update based on impt options of
    // 'product update' command and updates the specific Product.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Product is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        const attrs = {
            name : options.name,
            description : options.description
        };
        return super._updateEntity(attrs);
    }

    _collectDeleteSummary(summary, options) {
        return super._collectDeleteSummary(summary, options).
            then(() => {
                if (options.builds) {
                    const Build = require('./Build');
                    return new Build().listByProduct(this.id).
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
        const DeviceGroup = require('./DeviceGroup');
        return new DeviceGroup().listByProduct(this.id).then(devGroups =>
            this._helper.makeConcurrentOperations(devGroups,
                (devGroup) => devGroup._collectDeleteSummary(summary, new Options({ [Options.FORCE] : true }))));
    }

    _collectFullInfo() {
        const DeviceGroup = require('./DeviceGroup');
        return new DeviceGroup().listByProduct(this.id).
            then(devGroups => this._addRelatedEntities(devGroups, true));
    }

    // Lists all Products available for a user.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Product list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        const filters = [];
        if (options.owner) {
            filters.push(new ListHelper.OwnerFilter(Products.FILTER_OWNER_ID, options.owner));
        }
        return super._listEntities(filters);
    }

    // Returns array of attributes that will be displayed for every Product
    // by 'product list' command
    _getListAttrs() {
        return [ 'name' ];
    }

    // Returns related entities that will be displayed for every Entity
    // by 'product list' command.
    _getListRelationships() {
        return [
            { name : 'owner', Entity : Account, displayName : 'Owner', skipMine : true }
        ];
    }

    // Initializes the Product entity
    _init() {
        this._Entity = Product;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_PRODUCT, [ 'name' ]);
    }

    // Sets the Product specific options based on impt command options:
    // if --product or --product-id option is specified, the Product identifier is initialized by its value,
    // otherwise the Product identifier is initialized by the Project Config Product, if exists.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.productIdentifier) {
            this._identifier.initByIdentifier(options.productIdentifier);
        }
        else if (this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().then(() => {
                const DeviceGroup = require('./DeviceGroup');
                const deviceGroup = new DeviceGroup().initByIdFromConfig(this._projectConfig.deviceGroupId, this._projectConfig.type);
                return deviceGroup.getEntity().then(() => {
                    this._identifier.initById(deviceGroup.relatedProductId);
                    return Promise.resolve();
                });
            });
        }
        return Promise.resolve();
    }
}

module.exports = Product;

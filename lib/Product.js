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

// This class represents Product impCentral API entity.
// Provides methods used by build-cli Products Manipulation Commands.
class Product extends Entity {
    // Returns the Product name
    get name() {
        return this.apiEntity.attributes.name;
    }

    // Collects impCentral API attributes for Product creation based on build-cli options of 
    // 'product create' command and creates a new impCentral Product.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Product is successfully created, 
    //                          or rejects with an error
    _create(options) {
        const attrs = {
            name : options.name,
            description : options.description
        };
        return super._createEntity(attrs);
    }

    // Collects impCentral API attributes for Product update based on build-cli options of
    // 'product update' command and updates the specific Product.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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

    // Collects a summary of all entities which are going to be deleted and modified
    // during the Product deleting:
    // the Product, related Device Groups, related flagged Deployments and assigned Devices.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary) {
        const DeviceGroup = require('./DeviceGroup');
        return this.getEntity().then(() =>
            this._collectDisplayData().then(() => {
                summary.entities.push(this);
                return new DeviceGroup().listByProduct(this.id).then(devGroups =>
                    Promise.all(devGroups.map(devGroup => devGroup._collectDeleteSummary(summary))));
            }));
    }

    // Lists all Products available for a user.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Product list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        return super._listEntities();
    }

    // Returns array of attributes that will be displayed for every Product
    // by 'product list' build-cli command
    _getListAttrs() {
        return ['name', 'description'];
    }

    // Initializes the Product entity
    _init() {
        this._Entity = Product;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_PRODUCT, ['name']);
    }

    // Sets the Product specific options based on build-cli command options:
    // if --product or --product-id option is specified, the Product identifier is initialized by its value,
    // otherwise the Product identifier is initialized by the Project Config Product, if exists.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.productId) {
            this._identifier.initById(options.productId);
        }
        else if (options.productIdentifier) {
            this._identifier.initByIdentifier(options.productIdentifier);
        }
        else if (this._projectConfig.exists()) {
            return this._projectConfig.checkConfig().then(() =>
                this._identifier.initByIdFromConfig(this._projectConfig.productId));
        }
        return Promise.resolve();
    }
}

module.exports = Product;

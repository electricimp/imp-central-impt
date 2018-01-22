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
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const DeviceGroup = require('./DeviceGroup');
const Product = require('./Product');
const ListHelper = require('./util/ListHelper');
const ImpCentralApi = require('imp-central-api');
const Webhooks = ImpCentralApi.Webhooks;
const Account = require('./Account');

// This class represents Webhook impCentral API entity.
// Provides methods used by impt Webhook Manipulation Commands.
class Webhook extends Entity {
    // Collects impCentral API attributes for Webhook creation based on impt options of 
    // 'webhook create' command and creates a new impCentral Webhook.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Webhook is successfully created, 
    //                          or rejects with an error
    _create(options) {
        const deviceGroup = new DeviceGroup(options);
        return deviceGroup.getEntity().
            then(() => {
                const attrs = {
                    event : options.event,
                    url : options.url,
                    content_type : Options.getWebhookContentType(options.mime)
                };
                return super._createEntity(deviceGroup.id, deviceGroup.type, attrs);
            });
    }

    // Collects impCentral API attributes for Webhook update based on impt options of
    // 'webhook update' command and updates the specific Webhook.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Webhook is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        const attrs = {
            url : options.url
        };
        if (options.mime) {
            attrs.content_type = Options.getWebhookContentType(options.mime)
        }
        return super._updateEntity(attrs);
    }

    _getAttributeValue(attr, apiEntity) {
        let value = super._getAttributeValue(attr, apiEntity);
        if (attr === 'content_type') {
            value = Options.getWebhookMime(value);
        }
        return value;
    }

    // Lists all Webhooks of the current logged-in account.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Webhook list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        let ownerIds = [];
        let productIds = [];
        let ownersResolver = Promise.resolve();
        let productsResolver = Promise.resolve();
        if (options.owner) {
            const ownerFilter = new ListHelper.OwnerFilter(null, options.owner);
            ownersResolver = ownerFilter.init().
                then(() => {
                    ownerIds = ownerFilter.getValues();
                    return Promise.resolve();
                });
        }
        if (options.productIdentifier) {
            const productFilter = new ListHelper.ProductFilter(null, options.productIdentifier);
            productsResolver = productFilter.init().
                then(() => {
                    productIds = productFilter.getValues();
                    return Promise.resolve();
                });
        }
        return ownersResolver.
            then(() => productsResolver).
            then(() => {
                const filters = [];
                if (options.deviceGroupIdentifier) {
                    filters.push(new ListHelper.DeviceGroupFilter(
                        Webhooks.FILTER_DEVICE_GROUP_ID, options.deviceGroupIdentifier));
                }
                if (options.owner) {
                    filters.push(new ListHelper.ArtificialFilter((entity) => {
                        if ('devicegroup' in entity.relationships) {
                            return new DeviceGroup().initById(entity.relationships.devicegroup.id).getEntity().then((dgEntity) => {
                                return Promise.resolve(ownerIds.indexOf(dgEntity.apiEntity.relationships.owner.id) >= 0);
                            });
                        }
                        else {
                            return Promise.resolve(false);
                        }
                    }));
                }
                if (options.productIdentifier) {
                    filters.push(new ListHelper.ArtificialFilter((entity) => {
                        if ('devicegroup' in entity.relationships) {
                            return new DeviceGroup().initById(entity.relationships.devicegroup.id).getEntity().then((dgEntity) => {
                                return Promise.resolve(productIds.indexOf(dgEntity.relatedProductId) >= 0);
                            });
                        }
                        else {
                            return Promise.resolve(false);
                        }
                    }));
                }
                if (options.deviceGroupType) {
                    filters.push(new ListHelper.ArtificialFilter((entity) =>
                        Promise.resolve('devicegroup' in entity.relationships &&
                            options.deviceGroupType.indexOf(entity.relationships.devicegroup.type) >= 0)));
                }
                if (options.url) {
                    filters.push(new ListHelper.ArtificialFilter((entity) =>
                        Promise.resolve(options.url.indexOf(entity.attributes.url) >= 0)));
                }
                if (options.event) {
                    filters.push(new ListHelper.ArtificialFilter((entity) =>
                        Promise.resolve(options.event.indexOf(entity.attributes.event) >= 0)));
                }
                return super._listEntities(filters);
            });
    }

    listByDeviceGroup(deviceGroupId) {
        return this._list(new Options({ [Options.DEVICE_GROUP_IDENTIFIER] : [ deviceGroupId ] }));
    }

    // Returns related entities that will be displayed for every Device
    // by 'device info' command
    _getInfoRelationships() {
        return [
            { name : 'devicegroup', Entity : DeviceGroup },
            { name : 'product', Entity : Product }
        ].concat(super._getInfoRelationships());
    }

    // Returns array of attributes that will be displayed for every Webhook
    // by 'webhook list' command
    _getListAttrs() {
        return ['event', 'url'];
    }

    // Returns related entities that will be displayed for every Entity
    // by webhook list' command.
    _getListRelationships() {
        return [
            { name : 'devicegroup', Entity : DeviceGroup },
            { name : 'owner', Entity : Account, displayName : 'Owner', skipMine : true }
        ];
    }

    // Initializes the Webhook entity
    _init() {
        this._Entity = Webhook;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_WEBHOOK, []);
    }

    // Sets the Webhook specific options based on impt command options:
    // if --wh option is specified, the Webhook identifier is initialized by its value
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.webhookIdentifier) {
            this._identifier.initById(options.webhookIdentifier);
        }
        return Promise.resolve();
    }
}

module.exports = Webhook;

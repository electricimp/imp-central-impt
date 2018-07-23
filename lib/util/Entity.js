// MIT License
//
// Copyright 2018 Electric Imp
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
const ImpCentralApiHelper = require('./ImpCentralApiHelper');
const DeleteHelper = require('./DeleteHelper');
const ListHelper = require('./ListHelper');
const UserInteractor = require('./UserInteractor');
const ProjectConfig = require('./ProjectConfig');
const Identifier = require('./Identifier');
const Errors = require('./Errors');

const ATTR_ID = 'id';
const ATTR_NAME = 'name';
const ATTR_DESCRIPTION = 'description';

const REL_OWNER = 'owner';
const REL_CREATOR = 'creator';
const REL_PRODUCT = 'product';
const REL_DEVICE_GROUP = 'devicegroup';

// Parent class for all types of impCentral API entities the impt deals with:
// Product, DeviceGroup, Device and Build.
// Provides common methods used by different impt Manipulation Commands.
class Entity {

    // Entity constructor
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    constructor(options) {
        options = options || {};
        this._helper = ImpCentralApiHelper.getEntity();
        UserInteractor.setOutputFormat(options, this._helper);
        this._projectConfig = ProjectConfig.getEntity();
        this._options = options;
        this._identifier = new Identifier();
        this._relatedEntity = null;
        this._corrupted = false;
        this._init();
    }

    static get ATTR_ID() {
        return ATTR_ID;
    }

    static get ATTR_NAME() {
        return ATTR_NAME;
    }

    static get ATTR_DESCRIPTION() {
        return ATTR_DESCRIPTION;
    }

    static get REL_OWNER() {
        return REL_OWNER;
    }

    static get REL_CREATOR() {
        return REL_CREATOR;
    }

    static get REL_PRODUCT() {
        return REL_PRODUCT;
    }

    static get REL_DEVICE_GROUP() {
        return REL_DEVICE_GROUP;
    }

    get name() {
        return this.apiEntity.attributes[ATTR_NAME];
    }

    // Creates a new impCentral API Entity
    //
    // Parameters:
    //     args :               arguments of specific impCentral API library create method
    //
    // Returns:                 Promise that resolves when the Entity is successfully created, 
    //                          or rejects with an error
    _createEntity(...args) {
        return this._helper.createEntity(this.entityType, ...args).then(entity => {
            this.setApiEntity(entity, Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_GET);
            UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_CREATED, this.identifierInfo);
            return Promise.resolve(entity);
        });
    }

    // Creates a new Entity according to the specified options or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    create(options) {
        this._create(options).
            then(() => this._collectShortListData()).
            then(() => UserInteractor.printResultWithStatus(this._displayData)).
            catch(error => UserInteractor.processError(error));
    }

    // Updates a specific impCentral API Entity
    //
    // Parameters:
    //     args :               arguments of specific impCentral API library update method
    //
    // Returns:                 Promise that resolves when the Entity is successfully updated,
    //                          or rejects with an error
    _updateEntity(...args) {
        return this.getEntityId().
            then(() => this._helper.updateEntity(this.entityType, this.id, ...args)).
            then(() => UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_UPDATED, this.identifierInfo));
    }

    // Updates a specific Entity or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    update(options) {
        this._update(options).
            then(() => UserInteractor.printResultWithStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Fills DeleteHelper summary with the deleted Entity info.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    impt options of the corresponding delete command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteSummary(summary, options) {
        return this.getEntity().
            then(() => summary.entities.push(this)).
            then(() => {
                if (options.force) {
                    return this._collectDeleteForceSummary(summary, options);
                }
                return Promise.resolve();
            });
    }

    // Deletes a specific impCentral API Entity
    //
    // Returns:                 Promise that resolves when the Entity is successfully deleted,
    //                          or rejects with an error
    _deleteEntity() {
        return this.getEntityId().then(() =>
            this._helper.deleteEntity(this.entityType, this.id));
    }

    // Helper method for an Entity deleting.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Entity is successfully deleted,
    //                          or rejects with an error
    _delete(options) {
        return new DeleteHelper().processDelete(this, options);
    }

    // Deletes a specific Entity and all dependent sub-entities that required to be deleted
    // or reports an error occurred.
    // Displays a summary of all entities which are going to be deleted/modified during the operation
    // and asks a user confirmation.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    delete(options) {
        this._delete(options).
            then(() => UserInteractor.printResultWithStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _getInfoData(options) {
        return this._collectInfoData(options.full).
            then(() => this._displayData);
    }

    // Displays info about the specific Entity or reports an error occurred.
    // The details displayed depends on the entity type.
    // See the specific impt info or get commands description.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    info(options) {
        this.getEntity(true).
            then(() => this._getInfoData(options)).
            then((data) => UserInteractor.printResultWithStatus(data)).
            catch(error => UserInteractor.processError(error));
    }

    _getListData(entities) {
        return this._collectListEntities(entities).
            then(() => entities.map(entity => entity._displayData));
    }

    _getListMessage(entities) {
        if (entities && entities.length > 0) {
            return [UserInteractor.MESSAGES.ENTITY_LIST, this.entityType, entities.length];
        }
        else {
            return [UserInteractor.MESSAGES.ENTITY_EMPTY_LIST, this.entityType];
        }
    }

    // Lists all or filtered impCentral API Entities.
    //
    // Returns:                 Promise that resolves when the Entity list is successfully
    //                          obtained, or rejects with an error
    _listEntities(filters = null) {
        return new ListHelper(this).processList(filters);
    }

    // Displays info about all or filtered Entities or reports an error occurred.
    // The details displayed depends on the entity type.
    // See the specific impt list or history commands description.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    list(options) {
        this._list(options).
            then(entities => this._getListData(entities)).
            then(data => {
                UserInteractor.printInfo(...this._getListMessage(data));
                UserInteractor.printResultWithStatus(data);
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Returns the entity impCentral API id
    get id() {
        return this._identifier.id;
    }

    // Returns the entity type (one of the Identifier.ENTITY_TYPE constants)
    get entityType() {
        return this._identifier.entityType;
    }

    // Returns the entity identifier details
    get identifierInfo() {
        return Util.format('%s "%s"', this.entityType, this._identifier.info);
    }

    // Returns the entity details to be displayed by info or list impt commands
    get displayData() {
        return this._displayData;
    }

    // Returns the entity impCentral API JSON representation
    get apiEntity() {
        return this._apiEntity;
    }

    // Sets the entity impCentral API JSON representation
    setApiEntity(entity, origin) {
        this._apiEntity = entity;
        this._identifier.initByApiEntity(entity, origin);
    }

    setDefaultApiEntity() {
        this._apiEntity = {
            id : this._identifier.id,
            attributes : {},
            relationships : {}
        };
    }

    _getAttributeValue(attr, apiEntity) {
        let value = undefined;
        if (attr in apiEntity) {
            value = apiEntity[attr];
        }
        else if (attr in apiEntity.attributes) {
            value = apiEntity.attributes[attr];
        }
        return value;
    }

    _isEmptyAttr(value) {
        return value === undefined || value === null || value === '' || value === false ||
            Array.isArray(value) && value.length === 0;
    }

    // Returns object of key/value pairs for the specified entity attributes values.
    _getDisplayData(apiEntity, attrs, skipEmptyAttrs = false) {
        let data = {};
        for (let attr of attrs) {
            let value = this._getAttributeValue(attr, apiEntity);
            if (value !== undefined && !(this._isEmptyAttr(value) && skipEmptyAttrs)) {
                data[attr] = UserInteractor.jsonDataValueFormatter(value);
            }
        }
        return data;
    }

    // Collects data to be displayed for the specified Entity.
    // 
    // Parameters:
    //     attrs : array        array of attributes that will be displayed.
    //                          If not specified, displays all attributes, 
    //                          returned by impCentral API corresponding get method
    //     relations : array    array of related entities that will be displayed
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDisplayData(attrs = null, relations = null, full = false) {
        let skipEmptyAttrs = true;
        if (!attrs) {
            attrs = Object.keys(this._apiEntity.attributes);
            skipEmptyAttrs = false;
        }
        attrs = this._getInfoProperties().concat(attrs);
        relations = relations || [];

        let relatedEntities = ('relationships' in this._apiEntity) ?
            relations.filter(relation => relation.name in this._apiEntity.relationships).
                map(relation => {
                    const result = {
                        entity : new relation.Entity().initRelatedById(this._apiEntity.relationships[relation.name].id, this)
                    };
                    Object.assign(result, relation);
                    return result;
                }) : 
            [];
        let accountRequest = Promise.resolve(null);
        if (relatedEntities.filter(related => 'skipMine' in related).length > 0) {
            const Account = require('../Account');
            accountRequest = new Account().initById(Account.CURR_USER).getEntity().then((account) => Promise.resolve(account.id));
        }
        return accountRequest.
            then((meAccountId) => {
                if (meAccountId) {
                    relatedEntities = relatedEntities.filter(related => !(related.skipMine && meAccountId === related.entity.id));
                }
            }).
            then(() => {
                const data = this._getDisplayData(this._apiEntity, attrs, skipEmptyAttrs);
                this._displayData = this._corrupted ? 
                    UserInteractor.corruptedJsonData(
                        { [Util.format(UserInteractor.MESSAGES.ENTITY_CORRUPTED, this.entityType)] : data }) :
                    { [this.entityType] : data };
                return this._helper.makeConcurrentOperations(relatedEntities, (related) =>
                    this._collectRelatedEntityDisplayData(related.entity, false, related.displayName));
            }).
            then(() => relatedEntities.forEach(related =>
                this._addRelatedEntity(related.entity, related.displayName))).
            then(() => {
                if (full) {
                    return this._collectFullInfo();
                }
                return Promise.resolve();
            });
    }

    _collectFullInfo() {
        return Promise.resolve();
    }

    _collectInfoData(full = false) {
        return this._collectDisplayData(null, this._getInfoRelationships(), full);
    }

    _collectListData(full = false) {
        return this._collectDisplayData(this._getListAttrs(), this._getListRelationships(), full);
    }

    _collectListEntities(entities) {
        return this._helper.makeConcurrentOperations(entities, (entity) => entity._collectListData());
    }

    _collectShortListData() {
        return this._collectDisplayData(this._getListAttrs(), [], false);
    }

    _collectRelatedEntityDisplayData(entity, full = false) {
        return entity.getEntity().
            then(() => entity._collectDisplayData(
                entity._getListAttrs(),
                full ? entity._getFullRelationships() : [],
                full));
    }

    _addRelatedEntity(entity, relationName = null) {
        Object.keys(entity.displayData).forEach(key => {
            relationName = relationName || key;
            this.displayData[this.entityType][relationName] = entity.displayData[key];
        });
    }

    _addRelatedEntities(entities, full = false, relationName = null, limit = null) {
        if (entities.length > 0) {
            const entityType = entities[0].entityType;
            let moreEntities = null;
            if (!UserInteractor.isOutputJson() && limit !== null && entities.length > limit) {
                moreEntities = Util.format(UserInteractor.MESSAGES.TREE_MORE_ENTITIES, entities.length - limit, entityType);
                entities = entities.slice(0, limit);
            }
            return this._helper.makeConcurrentOperations(entities, (entity) => this._collectRelatedEntityDisplayData(entity, full)).
                then(() => {
                    relationName = relationName || (entityType + 's');
                    const entitiesData = entities.map(entity => entity.displayData);
                    if (moreEntities) {
                        entitiesData.push(moreEntities);
                    }
                    this.displayData[this.entityType][relationName] = entitiesData;
                    return Promise.resolve();
                });
        }
        return Promise.resolve();
    }

    // Initializes the Entity identifier by impCentral API Entity id
    initById(id) {
        this._identifier.initById(id);
        return this;
    }

    // Initializes the Entity identifier by impCentral API Entity id
    // obtained from Project Config
    initByIdFromConfig(id, configType) {
        this._identifier.initByIdFromConfig(id, configType);
        return this;
    }

    // Initializes the Entity identifier by impCentral API Entity name
    initByName(name) {
        this._identifier.initByName(name);
        return this;
    }

    // Initializes the Entity by impCentral API JSON representation
    initByApiEntity(entity, origin) {
        this.setApiEntity(entity, origin);
        return this;
    }

    // Initializes the Entity by ENTITY_IDENTIFIER
    initByIdentifier(identifier) {
        this._identifier.initByIdentifier(identifier);
        return this;
    }

    // Initializes related Entity by impCentral API Entity id
    initRelatedById(id, relatedEntity) {
        this._identifier.initByIdFromApiData(id);
        this._relatedEntity = relatedEntity;
        return this;
    }

    isRelated() {
        return this._relatedEntity !== null;
    }
    
    // Returns array of impCentral properties that will be displayed for every Entity
    // by '... list' and '... info' impt command.
    // To be overwritten in children classes.
    _getInfoProperties() {
        return [ATTR_ID];
    }

    // Returns related entities that will be displayed for every Entity
    // by '... info' impt command.
    // To be overwritten in children classes.
    _getInfoRelationships() {
        const Account = require('../Account');
        return [
            { name : REL_OWNER, Entity : Account, displayName : UserInteractor.MESSAGES.ENTITY_OWNER, skipMine : true },
            { name : REL_CREATOR, Entity : Account, displayName : UserInteractor.MESSAGES.ENTITY_CREATOR, skipMine : true }
        ];
    }

    _getFullRelationships() {
        return [];
    }

    // Returns array of attributes that will be displayed for every Entity
    // by '... list' impt command.
    // To be overwritten in children classes.
    _getListAttrs() {
        return [];
    }

    // Returns related entities that will be displayed for every Entity
    // by '... list' impt command.
    // To be overwritten in children classes.
    _getListRelationships() {
        return [];
    }

    // Finds impCentral entities corresponded to the current Entity identifier.
    // Resolves with array of found entities (or empty array if no entities found).
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    findEntities(origin = Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_LIST) {
        const setOptions = (this._identifier.isEmpty()) ? 
            this._setOptions(this._options) :
            Promise.resolve();
        return setOptions.
            then(() => this._identifier.checkNonEmpty()).
            then(() => this._helper.findEntitiesByIdentifier(this._identifier, origin));
    }

    // Finds impCentral entity corresponded to the current Entity identifier.
    // If the entity not found, returns Promise resolved with null.
    // If multiple entities found, rejects with the corresponding error.
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    findEntity(isInfo = false) {
        if (this.apiEntity) {
            return Promise.resolve(this);
        }
        else {
            const origin = isInfo ?
                Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_GET :
                Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_LIST;
            return this.findEntities(origin).then(result => {
                if (result.length > 1) {
                    const entities = result.map(entity => new this._Entity().initByApiEntity(entity, origin));
                    return this._collectListEntities(entities).then(() =>
                        Promise.reject(
                            new Errors.NotUniqueIdentifierError(
                                this.entityType,
                                this._identifier.info,
                                entities.map(entity => entity.displayData))));
                }
                else if (result.length === 1) {
                    this.setApiEntity(result[0], origin);
                    return Promise.resolve(this);
                }
                else {
                    return Promise.resolve(null);
                }
            });
        }
    }

    // Obtains impCentral entity corresponded to the current Entity identifier,
    // fails if the entity not found.
    // If the entity id was collected from the Project Config and the entity not found,
    // fails with the special error.
    // 
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    getEntity(isInfo = false) {
        return this.findEntity(isInfo).then(entity => {
            if (entity) {
                return Promise.resolve(entity);
            }
            else {
                if (this._identifier.origin === Identifier.IDENTIFIER_ORIGIN.CONFIG_FILE) {
                    return Promise.reject(new Errors.OutdatedConfigEntityError(this.identifierInfo, this._identifier._configType));
                }
                else if (this._identifier.isImpCentralApiOrigin() && this.isRelated()) {
                    this._corrupted = true;
                    this.setDefaultApiEntity();
                    UserInteractor.processError(new Errors.CorruptedRelatedEntityError(this.identifierInfo, this._relatedEntity.identifierInfo));
                    return Promise.resolve(this);
                }
                else {
                    return Promise.reject(new Errors.EntityNotFoundError(this.entityType, this._identifier.info));
                }
            }
        });
    }

    // Obtains impCentral entity id corresponded to the current Entity identifier,
    // fails if the entity not found.
    // 
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    getEntityId() {
        if (this.id) {
            return Promise.resolve(this.id);
        }
        else {
            return this.getEntity().then(() => Promise.resolve(this.id));
        }
    }
}

module.exports = Entity;

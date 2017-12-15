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
const ImpCentralApiHelper = require('./ImpCentralApiHelper');
const DeleteHelper = require('./DeleteHelper');
const ListHelper = require('./ListHelper');
const UserInteractor = require('./UserInteractor');
const ProjectConfig = require('./ProjectConfig');
const Identifier = require('./Identifier');
const Errors = require('./Errors');

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
        if (options.debug) {
            this._helper.debug = true;
        }
        this._projectConfig = ProjectConfig.getEntity();
        this._options = options;
        this._identifier = new Identifier();
        this._relatedEntity = null;
        this._corrupted = false;
        this._init();
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
            UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_CREATED, this.identifierInfo);
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
            then(() => UserInteractor.printSuccessStatus()).
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
            then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_UPDATED, this.identifierInfo));
    }

    // Updates a specific Entity or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    update(options) {
        this._update(options).
            then(() => UserInteractor.printSuccessStatus()).
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
            then(() => this._collectDisplayData(this._getListAttrs(), this._getListRelationships())).
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
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Collects data to be displayed for the specific Entity and displays it.
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _displayInfo() {
        return this._collectDisplayInfoData().then(() => {
            UserInteractor.printJsonData(this._displayData);
        });
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
            then(() => this._displayInfo()).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Collects data to be displayed for the specified Entities and displays it.
    //
    // Parameters:
    //     entities : array     array of Entity objects to be displayed
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _displayList(entities) {
        return this._collectEntitiesDisplayListData(entities).then(() => {
            if (entities.length > 0) {
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_LIST, this.entityType);
                UserInteractor.printJsonData(entities.map(entity => entity._displayData));
            }
            else {
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_EMPTY_LIST, this.entityType);
            }
        });
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
            then(entities => this._displayList(entities)).
            then(() => UserInteractor.printSuccessStatus()).
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

    // Returns object of key/value pairs for the specified entity attributes values.
    _getDisplayData(apiEntity, attrs) {
        let data = {};
        for (let attr of attrs) {
            let value = this._getAttributeValue(attr, apiEntity);
            if (value !== undefined) {
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
    _collectDisplayData(attrs = null, relations = null) {
        if (!attrs) {
            attrs = Object.keys(this._apiEntity.attributes);
        }
        attrs = this._getInfoProperties().concat(attrs);
        relations = relations || [];

        const relatedEntities = ('relationships' in this._apiEntity) ?
            relations.filter(relation => relation.name in this._apiEntity.relationships).
                map(relation => {
                    const result = {
                        entity : new relation.Entity().initRelatedById(this._apiEntity.relationships[relation.name].id, this)
                    };
                    Object.assign(result, relation);
                    return result;
                }) : 
            [];

        return this._helper.makeConcurrentOperations(relatedEntities.map(related => {
            const relatedEntity = related.entity;
            const relationships = related.relationships !== undefined ? related.relationships : [];
            const attrs = related.attributes !== undefined ? related.attributes : relatedEntity._identifier.attributes;
            let getEntity = null;
            if (relationships.length === 0 && attrs.length === 1 && attrs.indexOf('id') >= 0) {
                getEntity = new Promise((resolve, reject) => {
                    relatedEntity.setDefaultApiEntity();
                    resolve();
                });
            }
            else {
                getEntity = relatedEntity.getEntity();
            }
            return getEntity.then(() => relatedEntity._collectDisplayData(attrs, relationships));
        })).then(() => {
            const data = this._getDisplayData(this._apiEntity, attrs);
            if (relatedEntities.length > 0) {
                relatedEntities.forEach(related => {
                    Object.keys(related.entity._displayData).forEach(key => {
                        const displayName = related.displayName ? related.displayName : key;
                        data[displayName] = related.entity._displayData[key];
                    });
                });
            }

            this._displayData = this._corrupted ? 
                UserInteractor.corruptedJsonData({ [ 'Corrupted ' + this.entityType] : data }) :
                { [this.entityType] : data };
            return Promise.resolve();
        });
    }

    _collectDisplayInfoData() {
        return this._collectDisplayData(null, this._getInfoRelationships());
    }

    // Collects data to be displayed for the specified entities.
    // 
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDisplayListData() {
        return this._collectDisplayData(this._getListAttrs(), this._getListRelationships());
    }

    _collectEntitiesDisplayListData(entities) {
        return this._helper.makeConcurrentOperations(entities.map(entity => entity._collectDisplayListData()));
    }

    // Initializes the Entity identifier by impCentral API Entity id
    initById(id) {
        this._identifier.initById(id);
        return this;
    }

    // Initializes the Entity identifier by impCentral API Entity id
    // obtained from Project Config
    initByIdFromConfig(id) {
        this._identifier.initByIdFromConfig(id);
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
        return ['id'];
    }

    // Returns related entities that will be displayed for every Entity
    // by '... info' impt command.
    // To be overwritten in children classes.
    _getInfoRelationships() {
        const Account = require('../Account');
        return [
            { name : 'owner', Entity : Account, displayName : 'Owner', attributes : [ 'id' ] },
            { name : 'creator', Entity : Account, displayName : 'Creator', attributes : [ 'id' ] }
        ];
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
                    return this._collectEntitiesDisplayListData(entities).then(() =>
                        Promise.reject(
                            new Errors.NotUniqueIdentifierError(
                                this.entityType,
                                this._identifier.info,
                                entities.map(entity => entity._displayData))));
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
                if (this._identifier.origin === Identifier.IDENTIFIER_ORIGIN.PROJECT_CONFIG) {
                    return Promise.reject(new Errors.OutdatedProjectEntityError(this.identifierInfo));
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

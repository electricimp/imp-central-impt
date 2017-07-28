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
const UserInteractor = require('./UserInteractor');
const ProjectConfig = require('./ProjectConfig');
const Identifier = require('./Identifier');
const Errors = require('./Errors');

// Parent class for all types of impCentral API entities the build-cli deals with:
// Product, DeviceGroup, Device and Build.
// Provides common methods used by different build-cli Manipulation Commands.
class Entity {

    // Entity constructor
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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
            this.setApiEntity(entity);
            UserInteractor.printMessage('%s created successfully', this.identifierInfo);
            return Promise.resolve(entity);
        });
    }

    // Creates a new Entity according to the specified options or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    create(options) {
        this._create(options).
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
            then(() => UserInteractor.printMessage('%s updated successfully', this.identifierInfo));
    }

    // Updates a specific Entity or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    update(options) {
        this._update(options).
            catch(error => UserInteractor.processError(error));
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
    //     options : Options    build-cli options of the corresponding command
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
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    delete(options) {
        this._delete(options).
            catch(error => UserInteractor.processError(error));
    }

    // Collects data to be displayed for the specific Entity and displays it.
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _displayInfo() {
        return this._collectDisplayData(null, this._getInfoRelationships()).then(() =>
            UserInteractor.printJsonData(this._displayData));
    }

    // Displays info about the specific Entity or reports an error occurred.
    // The details displayed depends on the entity type.
    // See the specific build-cli info or get commands description.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    info(options) {
        this.getEntity().
            then(() => this._displayInfo()).
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
        return this._collectDisplayListData(entities).then(() => {
            if (entities.length > 0) {
                UserInteractor.printJsonData(entities.map(entity => entity._displayData));
            }
            else {
                UserInteractor.printMessage('No suitable %ss found', this.entityType);
            }
        });
    }

    // Lists all or filtered impCentral API Entities.
    //
    // Returns:                 Promise that resolves when the Entity list is successfully
    //                          obtained, or rejects with an error
    _listEntities(filters = null) {
        return this._helper.listEntities(this.entityType, filters).then(entities => 
            entities.map(entity => new this._Entity().initByApiEntity(entity)));
    }

    // Displays info about all or filtered Entities or reports an error occurred.
    // The details displayed depends on the entity type.
    // See the specific build-cli list or history commands description.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    list(options) {
        this._list(options).then(entities =>
            this._displayList(entities)
        ).catch(error => UserInteractor.processError(error));
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

    // Returns the entity details to be displayed by info or list build-cli commands
    get displayData() {
        return this._displayData;
    }

    // Returns the entity impCentral API JSON representation
    get apiEntity() {
        return this._apiEntity;
    }

    // Sets the entity impCentral API JSON representation
    setApiEntity(entity) {
        this._apiEntity = entity;
        this._identifier.initByApiEntity(entity);
    }

    setDefaultApiEntity() {
        this._apiEntity = {
            id : this._identifier.id,
            attributes : {},
            relationships : {}
        };
    }

    // Returns object of key/value pairs for the specified entity attributes values.
    _getDisplayData(entity, attrs) {
        let data = {};
        for (let attr of attrs) {
            let value = undefined;
            if (attr in entity) {
                value = entity[attr];
            }
            else if (attr in entity.attributes) {
                value = entity.attributes[attr];
            }
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

        const relatedEntities = relations.filter(relation => relation.name in this._apiEntity.relationships).
            map(relation => new relation.Entity().initRelatedById(this._apiEntity.relationships[relation.name].id, this));
        return Promise.all(relatedEntities.map(relatedEntity =>
            relatedEntity.getEntity().then(() => 
               relatedEntity._collectDisplayData(relatedEntity._identifier.attributes, relatedEntity._getListRelationships()))
        )).then(() => {
            const data = this._getDisplayData(this._apiEntity, attrs);
            if (relatedEntities.length > 0) {
                data[this._getInfoRelationName()] = relatedEntities.length === 1 ?
                    relatedEntities[0]._displayData :
                    relatedEntities.map(relation => relation._displayData);
            }

            this._displayData = this._corrupted ? 
                UserInteractor.corruptedJsonData({ [ 'Corrupted ' + this.entityType] : data }) :
                { [this.entityType] : data };
            return Promise.resolve();
        });
    }

    // Collects data to be displayed for the specified entities.
    // 
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDisplayListData(entities) {
        return Promise.all(entities.map(entity => 
            entity._collectDisplayData(this._getListAttrs(), this._getListRelationships())));
    }

    // Lists an Entities filtered by parent id/names.
    // Used for build-cli 'dg list', 'device list', 'build history' commands with 
    // --product-id, --product-name, --dg-id and --dg-name options.
    //
    // Parameters:
    //     filters : array         array of additional entity filters
    //     parentFilters: array    array of 
    //
    // Returns:                    Promise that resolves when the Deployments list is successfully
    //                             obtained, or rejects with an error
    listByParentIdOrName(filters, parentFilters) {
        return Promise.all(
            parentFilters.map(filter =>
                this._getParentFilterIds(filter.id, filter.name, filter.entity).then(ids => filter.ids = ids))
        ).then(() => {
            let filtersArr = [filters];
            parentFilters.forEach(filter => {
                filtersArr = this._getAllParentFilters(filtersArr, filter.filterName, filter.ids);
            });
            return Promise.all(filtersArr.map(filters => this._listEntities(filters))).
                then(results => [].concat.apply([], results));
        });
    }

    // Returns Entities ids that correspond to
    // --product-id, --product-name or --dg-id and --dg-name option values.
    _getParentFilterIds(id, name, Entity) {
        let ids = [];
        const findById = id ?
            new Entity().initById(id).getEntity().then(() => ids.push(id)) :
            Promise.resolve();
        return findById.then(() => {
            if (name) {
                const entity = new Entity().initByName(name);
                return entity.findEntities().then(entities => {
                    if (entities.length == 0) {
                        return Promise.reject(new Errors.EntityNotFoundError(entity.entityType, name));
                    }
                    else {
                        let entitiesIds = entities.map(entity => entity.id).
                            filter(id => ids.length === 0 || ids.indexOf(id) >= 0);
                        if (entitiesIds.length > 0) {
                            return Promise.resolve(entitiesIds);
                        }
                        else {
                            return Promise.reject(new Errors.EntityNotFoundError(entity.entityType, id, name));
                        }
                    }
                });
            }
            else {
                return Promise.resolve(ids);
            }
        });
    }

    // Returns all possible combinations of filters used by listByParentIdOrName
    _getAllParentFilters(filtersArr, filterType, filterValues) {
        if (filterValues.length > 0) {
            const result = [];
            for (let value of filterValues) {
                for (let filter of filtersArr) {
                    const _filter = {};
                    Object.assign(_filter, filter);
                    _filter[filterType] = value;
                    result.push(_filter);
                }
            }
            return result;
        }
        else {
            return filtersArr;
        }
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
    initByApiEntity(entity) {
        this.setApiEntity(entity);
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
    // by '... list' and '... info' build-cli command.
    // To be overwritten in children classes.
    _getInfoProperties() {
        return ['id'];
    }

    // Returns related entities that will be displayed for every Entity
    // by '... info' build-cli command.
    // To be overwritten in children classes.
    _getInfoRelationships() {
        return [];
    }

    // Returns the relation name that will be displayed between the Entity and its related entities
    // by '... info' build-cli command.
    // To be overwritten in children classes.
    _getInfoRelationName() {
        return 'Related to';
    }

    // Returns array of attributes that will be displayed for every Entity
    // by '... list' build-cli command.
    // To be overwritten in children classes.
    _getListAttrs() {
        return [];
    }

    // Returns related entities that will be displayed for every Entity
    // by '... list' build-cli command.
    // To be overwritten in children classes.
    _getListRelationships() {
        return this._getInfoRelationships();
    }

    // Finds impCentral entities corresponded to the current Entity identifier.
    // Resolves with array of found entities (or empty array if no entities found).
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    findEntities() {
        const setOptions = (this._identifier.isEmpty()) ? 
            this._setOptions(this._options) :
            Promise.resolve();
        return setOptions.then(() => 
            this._identifier.checkNonEmpty()).then(() => 
            this._helper.findEntitiesByIdentifier(this._identifier));
    }

    // Finds impCentral entity corresponded to the current Entity identifier.
    // If the entity not found, returns Promise resolved with null.
    // If multiple entities found, rejects with the corresponding error.
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    findEntity() {
        if (this.apiEntity) {
            return Promise.resolve(this);
        }
        else {
            return this.findEntities().then(result => {
                if (result.length > 1) {
                    const entities = result.map(entity => new this._Entity().initByApiEntity(entity));
                    return this._collectDisplayListData(entities).then(() =>
                        Promise.reject(
                            new Errors.NotUniqueIdentifierError(
                                this.entityType,
                                this._identifier.info,
                                entities.map(entity => entity._displayData))));
                }
                else if (result.length === 1) {
                    this.setApiEntity(result[0]);
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
    getEntity() {
        return this.findEntity().then(entity => {
            if (entity) {
                return Promise.resolve(entity);
            }
            else {
                if (this._identifier.origin === Identifier.IDENTIFIER_ORIGIN.PROJECT_CONFIG) {
                    return Promise.reject(new Errors.OutdatedProjectEntityError(this.identifierInfo));
                }
                else if (this._identifier.origin === Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API &&
                         this.isRelated()) {
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

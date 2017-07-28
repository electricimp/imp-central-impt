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
const LogStreams = ImpCentralApi.LogStreams;
const AuthConfig = require('./AuthConfig');
const UserInteractor = require('./UserInteractor');
const Options = require('./Options');
const Errors = require('./Errors');
const Identifier = require('./Identifier');

const ACCESS_TOKEN_RENEW_BEFORE_EXPIRY_MS = 3 * 60 * 1000; // 3 min

// Helper class for imp-central-api library requests.
class ImpCentralApiHelper {

    static getEntity(endpoint = null, global = undefined) {
        if (!ImpCentralApiHelper._entity) {
            ImpCentralApiHelper._entity = new ImpCentralApiHelper(endpoint, global);
        }
        return ImpCentralApiHelper._entity;
    }

    constructor(endpoint = null, global = undefined) {
        this._authConfig = AuthConfig.getEntity(global);
        this._impCentralApi = new ImpCentralApi(endpoint || this._authConfig.endpoint);
    }

    set debug(value) {
        this._impCentralApi.debug = value;
    }

    get authConfig() {
        return this._authConfig;
    }

    get apiEndpoint() {
        return this._impCentralApi.apiEndpoint;
    }

    // Finds impCentral entities corresponded to the specified identifier.
    // Resolves with array of found entities (or empty array if no entities found).
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    findEntitiesByIdentifier(identifier) {
        switch (identifier.type) {
            case Identifier.IDENTIFIER_TYPE.ID:
            case Identifier.IDENTIFIER_TYPE.ANY:
                return this.getEntity(identifier.entityType, identifier.identifier).
                    then(result => [result]).
                    catch(error => {
                        if (error instanceof Errors.EntityNotFoundError) {
                            if (identifier.type === Identifier.IDENTIFIER_TYPE.ID) {
                                return Promise.resolve([]);
                            }
                            else {
                                return this._getEntitiesByAttrs(identifier);
                            }
                        }
                        else {
                            throw error;
                        }
                    });
            case Identifier.IDENTIFIER_TYPE.NAME:
                return this._getEntitiesByAttrs(identifier);
        }
        return Promise.reject(new Errors.InternalLibraryError('Wrong type of identifier'));
    }

    // Finds impCentral entities corresponded to the specified identifier attributes.
    // Resolves with array of found entities (or empty array if no entities found).
    //
    // The method starts from the first attribute from identifier.attributes and searches the 
    // specified identifier value for this attribute.
    // If no entity is found for this attribute, the method searches the specified value for 
    // the next attribute in the order.
    // If one or more entities are found for the particular attribute, the method returns 
    // array of found entities.
    // If no entity is found for all attributes, the method returns empty array.
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _getEntitiesByAttrs(identifier) {
        return this.listEntities(identifier.entityType).then(entities => {
            for (let attr of identifier.attributes) {
                let result = [];
                for (let entity of entities) {
                    const entityAttr = entity.attributes[attr];
                    if (Array.isArray(entityAttr)) {
                        if (entityAttr.indexOf(identifier.identifier) >= 0) {
                            result.push(entity);
                        }
                    }
                    else if (entityAttr === identifier.identifier) {
                        result.push(entity);
                    }
                }
                if (result.length > 0) {
                    return Promise.resolve(result);
                }
            }
            return Promise.resolve([]);
        });
    }

    _getEntityApi(entityType) {
        switch (entityType) {
            case Identifier.ENTITY_TYPE.TYPE_PRODUCT:
                return this._impCentralApi.products;
            case Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP:
                return this._impCentralApi.deviceGroups;
            case Identifier.ENTITY_TYPE.TYPE_DEVICE:
                return this._impCentralApi.devices;
            case Identifier.ENTITY_TYPE.TYPE_BUILD:
                return this._impCentralApi.deployments;
        }
        throw new Errors.InternalLibraryError('Wrong entity type');
    }

    _resolveImpCentralApiResponse(result) {
        UserInteractor.spinnerStop();
        return Promise.resolve(result);
    }

    // Calls to Imp Central API using imp-central-api library
    login(user, password) {
        UserInteractor.spinnerStart();
        return this._impCentralApi.auth.login(user, password).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    getAccessToken(loginKey) {
        UserInteractor.spinnerStart();
        return this._impCentralApi.auth.getAccessToken(loginKey).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    // Checks and refreshes access token if needed
    _checkAccessToken() {
        return this._authConfig.checkConfig().then(() => {
            UserInteractor.spinnerStart();
            let expDate = new Date(this._authConfig.expiresAt);
            let currDate = new Date();
            if (expDate - currDate < ACCESS_TOKEN_RENEW_BEFORE_EXPIRY_MS) {
                return this._renewAccessToken()
                .then(result => this._resolveImpCentralApiResponse(result))
                .then(result => {
                    this._authConfig.setAccessToken(result.access_token, result.expires_at);
                    this._authConfig.save();
                    this._impCentralApi.auth.accessToken = this._authConfig.accessToken;
                    return Promise.resolve();
                }).catch(error => {
                    return Promise.reject(new Errors.RefreshTokenError());
                });
            }
            else {
                this._impCentralApi.auth.accessToken = this._authConfig.accessToken;
                return Promise.resolve();
            }
        });
    }

    _renewAccessToken() {
        if (this._authConfig.refreshToken) {
            return this._impCentralApi.auth.refreshAccessToken(this._authConfig.refreshToken);           
        }
        else if (this._authConfig.loginKey) {
            return this._impCentralApi.auth.getAccessToken(this._authConfig.loginKey);
        }
    }

    _listEntities(entityApi, filters, pageNumber) {
        return entityApi.list(filters, pageNumber).then(result => {
            let data = result.data;
            if ('next' in result.links) {
                return this._listEntities(entityApi, filters, pageNumber + 1).then(nextRes => {
                    data = data.concat(nextRes);
                    return Promise.resolve(data);
                });
            }
            else {
                return Promise.resolve(data);
            }
        });
    }

    listEntities(entityType, filters = null) {
        return this._checkAccessToken().then(() => {
            const entityApi = this._getEntityApi(entityType);
            return this._listEntities(entityApi, filters, 1);
        }).then(result => this._resolveImpCentralApiResponse(result));
    }

    createEntity(entityType, ...args) {
        return this._checkAccessToken().
            then(() => this._getEntityApi(entityType).create(...args)).
            then(result => this._resolveImpCentralApiResponse(result.data));
    }

    _processError(error, entityType, id) {
        if (error instanceof ImpCentralApi.Errors.ImpCentralApiError &&
            error._statusCode === 404) {
            throw new Errors.EntityNotFoundError(entityType, id);
        }
        throw error;
    }

    updateEntity(entityType, id, ...args) {
        return this._checkAccessToken().then(() => {
            return this._getEntityApi(entityType).update(id, ...args).
                then(result => this._resolveImpCentralApiResponse(result.data)).
                catch(error => this._processError(error, entityType, id));
        });
    }

    getEntity(entityType, id) {
        return this._checkAccessToken().then(() => {
            return this._getEntityApi(entityType).get(id).
                then(result => this._resolveImpCentralApiResponse(result.data)).
                catch(error => this._processError(error, entityType, id));
        });
    }

    deleteEntity(entityType, id) {
        return this._checkAccessToken().then(() => {
            return this._getEntityApi(entityType).delete(id).
                then(result => this._resolveImpCentralApiResponse(result)).
                catch(error => this._processError(error, entityType, id));
        });
    }

    restartDevices(devGroupId) {
        return this._checkAccessToken().
            then(() => this._impCentralApi.deviceGroups.restartDevices(devGroupId)).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    restart(deviceId) {
        return this._checkAccessToken().
            then(() => this._impCentralApi.devices.restart(deviceId)).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    assignDevice(deviceGroupId, deviceId) {
        return this._checkAccessToken().
            then(() => this._impCentralApi.deviceGroups.addDevices(deviceGroupId, deviceId)).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    unassignDevices(deviceGroupId, ...deviceIds) {
        return this._checkAccessToken().
            then(() => this._impCentralApi.deviceGroups.removeDevices(deviceGroupId, null, ...deviceIds)).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    logStream(deviceIds, messageHandler, stateChangeHandler = null) {
        let logStreamId;
        return this._checkAccessToken().then(() => {
            return this._impCentralApi.logStreams.create(
                messageHandler,
                stateChangeHandler,
                null,
                LogStreams.FORMAT_JSON);
        }).then((logStream) => {
            logStreamId = logStream.data.id;
            return Promise.all(deviceIds.map(deviceId => this._impCentralApi.logStreams.addDevice(logStreamId, deviceId)));
        }).then(() => this._resolveImpCentralApiResponse(logStreamId));
    }

    closeLogStream(logStreamId) {
        return this._impCentralApi.logStreams.close(logStreamId).
            then(result => this._resolveImpCentralApiResponse(result));
    }

    logs(deviceId, pageNumber = null, pageSize = null) {
        return this._checkAccessToken().
            then(() => this._impCentralApi.devices.getLogs(deviceId, pageNumber, pageSize)).
            then(result => this._resolveImpCentralApiResponse(result.data));
    }
}

module.exports = ImpCentralApiHelper;

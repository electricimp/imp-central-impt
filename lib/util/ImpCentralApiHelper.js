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
const ImpCentralApi = require('imp-central-api');
const LogStreams = ImpCentralApi.LogStreams;
const AuthConfig = require('./AuthConfig');
const UserInteractor = require('./UserInteractor');
const Options = require('./Options');
const Errors = require('./Errors');
const Identifier = require('./Identifier');
const EntityStorage = require('./EntityStorage');

const ACCESS_TOKEN_RENEW_BEFORE_EXPIRY_MS = 3 * 60 * 1000; // 3 min
const LIST_PAGE_SIZE = 100;
const CONCURRENT_REQUESTS_LIMIT = 5;

// Helper class for imp-central-api library requests.
class ImpCentralApiHelper {

    static getEntity(endpoint = null, authLocation = AuthConfig.LOCATION.ANY) {
        if (!ImpCentralApiHelper._entity) {
            ImpCentralApiHelper._entity = new ImpCentralApiHelper(endpoint, authLocation);
        }
        return ImpCentralApiHelper._entity;
    }

    constructor(endpoint, authLocation) {
        this._authConfig = AuthConfig.getEntity(authLocation);
        this._impCentralApi = new ImpCentralApi(endpoint || this._authConfig.endpoint);
        this._entityStorage = new EntityStorage();
    }

    set debug(value) {
        this._impCentralApi.debug = value;
        UserInteractor.debug = value;
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
    findEntitiesByIdentifier(identifier, origin) {
        switch (identifier.type) {
            case Identifier.IDENTIFIER_TYPE.ID:
            case Identifier.IDENTIFIER_TYPE.ANY:
                return this.getEntity(identifier.entityType, identifier.identifier, origin).
                    then(result => [result]).
                    catch(error => {
                        if (error instanceof Errors.EntityNotFoundError) {
                            if (identifier.type === Identifier.IDENTIFIER_TYPE.ID) {
                                return Promise.resolve([]);
                            }
                            else {
                                return this._getEntitiesByAttrs(identifier, origin);
                            }
                        }
                        else {
                            throw error;
                        }
                    });
            case Identifier.IDENTIFIER_TYPE.NAME:
                return this._getEntitiesByAttrs(identifier, origin);
        }
        return Promise.reject(new Errors.InternalLibraryError('Wrong identifier type'));
    }

    makeConcurrentOperations(elements, operation) {
        const chunks = [];
        for (var i = 0; i < elements.length; i += CONCURRENT_REQUESTS_LIMIT) {
            chunks.push(elements.slice(i, i + CONCURRENT_REQUESTS_LIMIT));
        }

        let result = [];
        return chunks.reduce(
            (acc, chunk) => acc.
                then(() => Promise.all(chunk.map(elem => operation(elem)))).
                then(res => {
                    result = result.concat(res);
                    return Promise.resolve();
                }).
                catch(error => { throw error; }),
            Promise.resolve()).
            then(() => this._resolveImpCentralApiResponse(result));
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
    _getEntitiesByAttrs(identifier, origin) {
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
        }).
        then(result => 
            this.makeConcurrentOperations(
                result, (entity) => this.getEntity(identifier.entityType, entity.id, origin)));
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
            case Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY:
                return this._impCentralApi.accounts._loginKeys;
            case Identifier.ENTITY_TYPE.TYPE_ACCOUNT:
                return this._impCentralApi.accounts;
            case Identifier.ENTITY_TYPE.TYPE_WEBHOOK:
                return this._impCentralApi.webhooks;
        }
        throw new Errors.InternalLibraryError('Wrong entity type');
    }

    // Calls to impCentral API using imp-central-api library
    login(user, password) {
        const auth = this._impCentralApi.auth;
        return this._processImpCentralApiRequest(
            null, null, auth.login.bind(auth), user, password);
    }

    getAccessToken(loginKey) {
        const auth = this._impCentralApi.auth;
        return this._processImpCentralApiRequest(
            Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, loginKey, auth.getAccessToken.bind(auth), loginKey);
    }

    // Checks and refreshes access token if needed
    _checkAccessToken() {
        return this._authConfig.checkConfig().then(() => {
            UserInteractor.spinnerStart();
            let expDate = new Date(this._authConfig.expiresAt);
            let currDate = new Date();
            if (expDate - currDate < ACCESS_TOKEN_RENEW_BEFORE_EXPIRY_MS) {
                if (!this._authConfig.refreshToken && !this._authConfig.loginKey) {
                    return Promise.reject(new Errors.AccessTokenExpiredError(this._authConfig));
                }
                else {
                    return this._renewAccessToken()
                        .then(result => {
                            this._authConfig.setAccessToken(result.access_token, result.expires_at);
                            this._impCentralApi.auth.accessToken = this._authConfig.accessToken;
                            return this._authConfig.save();
                        }).catch(error => {
                            if (error instanceof Errors.EntityNotFoundError ||
                                this._isEntityNotFoundError(error)) {
                                return Promise.reject(new Errors.RefreshTokenError(this._authConfig));
                            }
                            return Promise.reject(error);
                        });
                }
            }
            else {
                this._impCentralApi.auth.accessToken = this._authConfig.accessToken;
                return Promise.resolve();
            }
        });
    }

    _renewAccessToken() {
        const auth = this._impCentralApi.auth;
        if (this._authConfig.refreshToken) {
            return this._processImpCentralApiRequest(
                null, null, auth.refreshAccessToken.bind(auth), this._authConfig.refreshToken);
        }
        else if (this._authConfig.loginKey) {
            return this.getAccessToken(this._authConfig.loginKey);
        }
    }

    _listEntities(entityApi, filters, pageNumber, pageSize) {
        UserInteractor.spinnerStart();
        const listArgs = entityApi === this._impCentralApi.accounts ?
            [pageNumber, pageSize] :
            [filters, pageNumber, pageSize];

        return this._processImpCentralApiRequest(null, null, entityApi.list.bind(entityApi), ...listArgs).
            then(result => {
                let data = result.data;
                if ('next' in result.links) {
                    return this._listEntities(entityApi, filters, pageNumber + 1, pageSize).then(nextRes => {
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
        const noFilters = filters === null;
        return this._checkAccessToken().then(() => {
            if (noFilters) {
                const list = this._entityStorage.getList(entityType);
                if (list) {
                    return list;
                }
            }
            const listRequest = this._listEntities(this._getEntityApi(entityType), filters, 1, LIST_PAGE_SIZE);
            if (noFilters) {
                this._entityStorage.setList(entityType, listRequest);
            }
            return listRequest.then(result => {
                this._entityStorage.setListEntities(result);
                return result;
            }).catch(error => {
                if (noFilters) {
                    this._entityStorage.clearList(entityType);
                }
                throw error;
            });
        });
    }

    createEntity(entityType, ...args) {
        const entityApi = this._getEntityApi(entityType);
        return this._checkAccessToken().
            then(() => this._entityStorage.clearList(entityType)).
            then(() => this._processImpCentralApiRequest(null, null, entityApi.create.bind(entityApi), ...args)).
            then(result => result.data);
    }

    updateEntity(entityType, id, ...args) {
        const entityApi = this._getEntityApi(entityType);
        return this._checkAccessToken().
            then(() => {
                this._entityStorage.clearList(entityType);
                this._entityStorage.clearEntity(id);
            }).
            then(() => this._processImpCentralApiRequest(entityType, id, entityApi.update.bind(entityApi), id, ...args)).
            then(result => result.data);
    }

    getEntity(entityType, id, origin) {
        const entityApi = this._getEntityApi(entityType);
        return this._checkAccessToken().
            then(() => {
                const entity = this._entityStorage.getEntity(id, origin);
                if (entity) {
                    return entity;
                }
                const entityRequest = this._processImpCentralApiRequest(entityType, id, entityApi.get.bind(entityApi), id).
                    then(result => result.data);
                this._entityStorage.setEntity(id, entityRequest);
                return entityRequest.
                    catch(error => {
                        this._entityStorage.clearEntity(id);
                        throw error;
                    });
            });
    }

    deleteEntity(entityType, id, ...args) {
        const entityApi = this._getEntityApi(entityType);
        return this._checkAccessToken().
            then(() => {
                this._entityStorage.clearList(entityType);
                this._entityStorage.clearEntity(id);
            }).
            then(() => this._processImpCentralApiRequest(entityType, id, entityApi.delete.bind(entityApi), id, ...args));
    }

    restartDevices(devGroupId, conditional = false) {
        const entityApi = this._impCentralApi.deviceGroups;
        return this._checkAccessToken().
            then(() => {
                const method = conditional ? 
                    entityApi.conditionalRestartDevices :
                    entityApi.restartDevices;
                return this._processImpCentralApiRequest(
                    Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, devGroupId, method.bind(entityApi), devGroupId);
            });
    }

    updateMinSupportedDeployment(devGroupId, deploymentId) {
        const entityApi = this._impCentralApi.deviceGroups;
        return this._checkAccessToken().
            then(() => {
                this._entityStorage.clearList(Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP);
                this._entityStorage.clearEntity(devGroupId);
            }).
            then(() => this._processImpCentralApiRequest(
                    Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP,
                    devGroupId,
                    entityApi.updateMinSupportedDeployment.bind(entityApi),
                    devGroupId,
                    deploymentId));
    }

    restart(deviceId, conditional = false) {
        const entityApi = this._impCentralApi.devices;
        return this._checkAccessToken().
            then(() => {
                const method = conditional ? 
                    entityApi.conditionalRestart :
                    entityApi.restart;
                return this._processImpCentralApiRequest(
                    Identifier.ENTITY_TYPE.TYPE_DEVICE, deviceId, method.bind(entityApi), deviceId);
            });
    }

    assignDevices(deviceGroupId, ...deviceIds) {
        const entityApi = this._impCentralApi.deviceGroups;
        return this._checkAccessToken().
            then(() => {
                this._entityStorage.clearList(Identifier.ENTITY_TYPE.TYPE_DEVICE);
                for (let deviceId in deviceIds) {
                    this._entityStorage.clearEntity(deviceId);
                }
            }).
            then(() => this._processImpCentralApiRequest(
                Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP, deviceGroupId, entityApi.addDevices.bind(entityApi), deviceGroupId, ...deviceIds));
    }

    unassignDevices(deviceGroupId, unbondKey, ...deviceIds) {
        const entityApi = this._impCentralApi.deviceGroups;
        return this._checkAccessToken().
            then(() => {
                this._entityStorage.clearList(Identifier.ENTITY_TYPE.TYPE_DEVICE);
                for (let deviceId in deviceIds) {
                    this._entityStorage.clearEntity(deviceId);
                }
            }).
            then(() => this._processImpCentralApiRequest(
                Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP,
                deviceGroupId,
                entityApi.removeDevices.bind(entityApi),
                deviceGroupId,
                unbondKey,
                ...deviceIds));
    }

    logStream(deviceIds, messageHandler, stateChangeHandler = null) {
        let logStreamId;
        const entityApi = this._impCentralApi.logStreams;
        return this._checkAccessToken().
            then(() => this._processImpCentralApiRequest(
                null, null, entityApi.create.bind(entityApi), messageHandler, stateChangeHandler, null, LogStreams.FORMAT_JSON)).
            then((logStream) => {
                logStreamId = logStream.data.id;
                return this.makeConcurrentOperations(deviceIds, (deviceId) => 
                    this._processImpCentralApiRequest(null, null, entityApi.addDevice.bind(entityApi), logStreamId, deviceId));
            }).
            then(() => logStreamId);
    }

    closeLogStream(logStreamId) {
        const entityApi = this._impCentralApi.logStreams;
        return this._processImpCentralApiRequest(null, null, entityApi.close.bind(entityApi), logStreamId);
    }

    logs(deviceId, pageNumber = null, pageSize = null) {
        const entityApi = this._impCentralApi.devices;
        return this._checkAccessToken().
            then(() => this._processImpCentralApiRequest(
                Identifier.ENTITY_TYPE.TYPE_DEVICE, deviceId, entityApi.getLogs.bind(entityApi), deviceId, pageNumber, pageSize)).
            then(result => result.data);
    }

    _resolveImpCentralApiResponse(result) {
        UserInteractor.spinnerStop();
        UserInteractor.printResponseMeta(result);
        return result;
    }

    _processImpCentralApiRequest(entityType, id, impCentralApiMethod, ...args) {
        UserInteractor.spinnerStart();
        return impCentralApiMethod(...args).
            then(result => this._resolveImpCentralApiResponse(result)).
            catch(error => {
                if (this._isRateLimitError(error)) {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => resolve(), 1000)
                    }).then(() => this._processImpCentralApiRequest(entityType, id, impCentralApiMethod, ...args));
                }
                else if (this._isEntityNotFoundError(error) && entityType && id) {
                    throw new Errors.EntityNotFoundError(entityType, id);
                }
                throw error;
            });
    }

    _isEntityNotFoundError(error) {
        return error instanceof ImpCentralApi.Errors.ImpCentralApiError &&
            error._statusCode === 404;
    }

    _isRateLimitError(error) {
        return error instanceof ImpCentralApi.Errors.ImpCentralApiError &&
            error._statusCode === 429;
    }
}

module.exports = ImpCentralApiHelper;

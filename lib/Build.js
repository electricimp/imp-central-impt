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

const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const ImpCentralApi = require('imp-central-api');
const Deployments = ImpCentralApi.Deployments;
const UserInteractor = require('./util/UserInteractor');
const ListHelper = require('./util/ListHelper');
const DeleteHelper = require('./util/DeleteHelper');
const Utils = require('./util/Utils');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const DeviceGroup = require('./DeviceGroup');
const Product = require('./Product');
const Log = require('./Log');
const Errors = require('./util/Errors');
const Util = require('util');
const Account = require('./Account');

const ATTR_SHA = 'sha';
const ATTR_TAGS = 'tags';
const ATTR_ORIGIN = 'origin';
const ATTR_FLAGGED = 'flagged';
const ATTR_DEVICE_CODE = 'device_code';
const ATTR_AGENT_CODE = 'agent_code';
const ATTR_CREATED_AT = 'created_at';

// This class represents Deployment impCentral API entity.
// Provides methods used by impt Build Manipulation Commands.
class Build extends Entity {

    // Returns device_code attribute of the Deployment
    get deviceCode() {
        return this.apiEntity.attributes[ATTR_DEVICE_CODE];
    }

    // Returns agent_code attribute of the Deployment
    get agentCode() {
        return this.apiEntity.attributes[ATTR_AGENT_CODE];
    }

    // Returns the Deployment tags
    get tags() {
        return this.apiEntity.attributes[ATTR_TAGS];
    }

    // Returns the Deployment flagged attribute
    get flagged() {
        return this.apiEntity.attributes[ATTR_FLAGGED];
    }

    // Returns the Deployment description attribute
    get description() {
        return this.apiEntity.attributes[Entity.ATTR_DESCRIPTION];
    }

    // Returns the Deployment origin attribute
    get origin() {
        return this.apiEntity.attributes[ATTR_ORIGIN];
    }

    // Returns the Deployment created_at attribute
    get createdAt() {
        return this.apiEntity.attributes[ATTR_CREATED_AT];
    }

    // Returns the id of associated Device Group
    get relatedDeviceGroupId() {
        if (Entity.REL_DEVICE_GROUP in this.apiEntity.relationships) {
            return this.apiEntity.relationships[Entity.REL_DEVICE_GROUP].id;
        }
        return null;
    }

    // Collects impCentral API attributes for Deployment creation based on impt options of 
    // 'build deploy' command and creates a new impCentral Deployment.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Deployment is successfully created, 
    //                          or rejects with an error
    _create(options, deviceCode, agentCode) {
        const deviceGroup = new DeviceGroup(options);
        return deviceGroup.getEntity().
            then(() => this._createByDeviceGroup(deviceGroup, options, deviceCode, agentCode));
    }

    _createByDeviceGroup(deviceGroup, options, deviceCode, agentCode) {
        options = options || new Options();
        const attrs = {
            [ATTR_DEVICE_CODE] : deviceCode,
            [ATTR_AGENT_CODE] : agentCode,
            [Entity.ATTR_DESCRIPTION] : options.description,
            [ATTR_ORIGIN] : options.origin,
            [ATTR_FLAGGED] : this._getFlaggedValue(options),
            [ATTR_TAGS] : options.tags
        };
        return this._createEntity(deviceGroup.id, deviceGroup.type, attrs);
    }

    // Creates a build from the specified source files, and deploys it to all Devices of the specified 
    // Device Group.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Build is successfully deployed, 
    //                          or rejects with an error
    _deploy(options) {
        return this._setFileOptions(options).
            then(() => this._readSourceFiles()).
            then((sources) => this._create(options, sources.deviceCode, sources.agentCode));
    }

    // Creates a build from the specified source files, and deploys it to all Devices of the specified 
    // Device Group or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    deploy(options) {
        this._deploy(options).
            then(() => this._collectShortListData()).
            then(() => UserInteractor.printResultWithStatus(this._displayData)).
            catch(error => UserInteractor.processError(error));
    }

    // Creates, deploys and run a build or reports an error occurred.
    // Optionally, displays logs of the running build.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing
    run(options) {
        const deviceGroup = new DeviceGroup(options);
        this._deploy(options).
            then(() => {
                return deviceGroup._restart(options);
            }).
            then(() => {
                if (options.log && deviceGroup._assignedDevices && deviceGroup._assignedDevices.length > 0) {
                    UserInteractor.printInfo(UserInteractor.MESSAGES.BUILD_RUN, this.identifierInfo);
                    new Log()._stream(deviceGroup._assignedDevices);
                }
                else {
                    UserInteractor.printResultWithStatus();
                }
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Updates tags of the current Build.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _updateTags(options) {
        if (options.tags || options.removeTags) {
            return super.getEntity().then(() => {
                let tags = this.tags;
                if (options.removeTags) {
                    for (let tag of options.removeTags) {
                        let index = tags.indexOf(String(tag));
                        if (index >= 0) {
                            tags.splice(index, 1);
                        }
                    }
                }
                if (options.tags) {
                    for (let tag of options.tags) {
                        if (tags.indexOf(String(tag)) < 0) {
                            tags.push(tag);
                        }
                    }
                }
                return Promise.resolve(tags);
            });
        }
        else {
            return Promise.resolve(undefined);
        }
    }

    // Collects impCentral API attributes for Deployment update based on impt options of
    // 'build update' command and updates the specific Deployment.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Deployment is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        return this._updateTags(options).then(tags => {
            const attrs = {
                [Entity.ATTR_DESCRIPTION] : options.description,
                [ATTR_FLAGGED] : this._getFlaggedValue(options),
                [ATTR_TAGS] : tags
            };
            return super._updateEntity(attrs);
        });
    }

    // Obtains options 'flagged' value.
    _getFlaggedValue(options) {
        if (options.contains(Options.FLAGGED)) {
            return options.flagged;
        }
        return undefined;
    }

    // Downloads the specified Build and displays information about it 
    // or reports an error occurred.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Nothing.
    get(options) {
        return super.getEntity(true).
            then(() => this._checkFileOptions(options)).
            then(() => {
                const existingFiles = [];
                if (Utils.existsFileSync(this._deviceFileName) && !options.agentOnly) {
                    existingFiles.push(this._deviceFileName);
                }
                if (Utils.existsFileSync(this._agentFileName) && !options.deviceOnly) {
                    existingFiles.push(this._agentFileName);
                }
                return UserInteractor.processCancelContinueChoice(
                    Util.format(UserInteractor.MESSAGES.BUILD_SOURCE_FILES_EXIST, existingFiles.join(', ')),
                    this._saveSourceFiles.bind(this),
                    options,
                    options.confirmed || existingFiles.length === 0);
            }).
            then(() => this._getInfoData(options)).
            then((data) => UserInteractor.printResultWithStatus(data)).
            catch(error => UserInteractor.processError(error));
    }

    // Updates the Build by setting 'flagged' attribute to false.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _unflag() {
        return this._update(new Options({ [Options.FLAGGED] : false }));
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
        if (this.flagged) {
            summary.flaggedBuilds.push(this);
        }
    }

    _collectDeleteSummary(summary, options, checkMinSupported = true) {
        return this.getEntity().
            then(() => {
                if (this.relatedDeviceGroupId && checkMinSupported) {
                    const deviceGroup = new DeviceGroup().initById(this.relatedDeviceGroupId);
                    return deviceGroup.getEntity().then(() => {
                        if (deviceGroup.minSupportedDeploymentId) {
                            const minSupported = new Build().initById(deviceGroup.minSupportedDeploymentId);
                            return minSupported.getEntity().
                                then(() => {
                                    if (!this._isOlderThan(minSupported)) {
                                        return Promise.reject(new Errors.ImptError(UserInteractor.ERRORS.BUILD_DELETE_ERR,
                                            this.identifierInfo, deviceGroup.identifierInfo));
                                    }
                                    return Promise.resolve();
                                });
                        }
                        return Promise.resolve();
                    });
                }
                return Promise.resolve();
            }).then(() => super._collectDeleteSummary(summary, options));
    }

    cleanup(options) {
        let listOptions = { [Options.ZOMBIE] : true };
        if (options.productIdentifier) {
            listOptions[Options.PRODUCT_IDENTIFIER] = [ options.productIdentifier ];
        }
        if (!options.unflag) {
            listOptions[Options.UNFLAGGED] = true;
        }
        return this._list(new Options(listOptions)).
            then(builds => {
                if (builds.length > 0) {
                    const deleteOptions = new Options({
                        [Options.CONFIRMED] : options.confirmed,
                        [Options.FORCE] : options.unflag
                    });
                    return new DeleteHelper().processDeleteEntities(builds, deleteOptions).
                        then(() => UserInteractor.printResultWithStatus());
                }
                else {
                    UserInteractor.printInfo(UserInteractor.MESSAGES.ENTITY_EMPTY_LIST, this.entityType);
                    UserInteractor.printResultWithStatus();
                }
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Lists all or filtered Deployments available for a user.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Devices list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        const filters = [];
        if (options.owner) {
            filters.push(new ListHelper.OwnerFilter(Deployments.FILTER_OWNER_ID, options.owner));
        }
        if (options.productIdentifier) {
            filters.push(new ListHelper.ProductFilter(Deployments.FILTER_PRODUCT_ID, options.productIdentifier));
        }
        if (options.deviceGroupIdentifier) {
            filters.push(new ListHelper.DeviceGroupFilter(Deployments.FILTER_DEVICE_GROUP_ID, options.deviceGroupIdentifier));
        }
        if (options.deviceGroupType) {
            filters.push(new ListHelper.ArtificialFilter((entity) =>
                Promise.resolve(Entity.REL_DEVICE_GROUP in entity.relationships && 
                    options.deviceGroupType.indexOf(entity.relationships[Entity.REL_DEVICE_GROUP].type) >= 0)));
        }
        if (options.sha) {
            filters.push(new ListHelper.BuildShaFilter(Deployments.FILTER_SHA, options.sha));
        }
        if (options.tags) {
            filters.push(new ListHelper.BuildTagsFilter(Deployments.FILTER_TAGS, options.tags));
        }
        if ((options.flagged || options.unflagged) && !(options.flagged && options.unflagged)) {
            filters.push(new ListHelper.BuildFlaggedFilter(Deployments.FILTER_FLAGGED, options.flagged ? true : false));
        }
        if ((options.nonZombie || options.zombie) && !(options.nonZombie && options.zombie)) {
            if (options.nonZombie) {
                filters.push(new ListHelper.ArtificialFilter((entity) => Promise.resolve(Entity.REL_DEVICE_GROUP in entity.relationships)));
            }
            if (options.zombie) {
                filters.push(new ListHelper.ArtificialFilter((entity) => Promise.resolve(!(Entity.REL_DEVICE_GROUP in entity.relationships))));
            }
        }

        return super._listEntities(filters);
    }

    // Lists flagged Deployments of a Device Group.
    //
    // Parameters:
    //     deviceGroupId: String   id of Device Group
    //
    // Returns:                    Promise that resolves when the Deployments list is successfully
    //                             obtained, or rejects with an error
    listFlaggedByDeviceGroup(deviceGroupId) {
        const options = new Options({
            [Options.DEVICE_GROUP_IDENTIFIER] : [ deviceGroupId ],
            [Options.FLAGGED] : true
        });
        return this._list(options);
    }

    listUnflaggedByDeviceGroup(deviceGroupId) {
        const options = new Options({
            [Options.DEVICE_GROUP_IDENTIFIER] : [ deviceGroupId ],
            [Options.UNFLAGGED] : true
        });
        return this._list(options);
    }

    listByDeviceGroup(deviceGroupId) {
        const options = new Options({
            [Options.DEVICE_GROUP_IDENTIFIER] : [ deviceGroupId ]
        });
        return this._list(options);
    }

    listByProduct(productId) {
        const options = new Options({
            [Options.PRODUCT_IDENTIFIER] : [ productId ]
        });
        return this._list(options);
    }

    // Copies the specified build (Deployment) to the new Deployment of the specified Device Group.
    // Fails if the specified Deployment or the specified Device Group does not exist.
    //
    // Parameters:
    //     options : Options    impt options of the build copy command
    //
    // Returns:                 Nothing.
    copy(options) {
        const build = new Build();
        return super.getEntity(true).
            then(() => {
                let opts = {
                    [Options.DEVICE_GROUP_IDENTIFIER] : options.deviceGroupIdentifier
                };
                if (options.all) {
                    Object.assign(opts, {
                        [Options.DESCRIPTION] : this.description,
                        [Options.ORIGIN] : this.origin !== null ? this.origin : undefined,
                        [Options.TAG] : this.tags,
                        [Options.FLAGGED] : this.flagged
                    });
                }
                return build._create(new Options(opts), this.deviceCode, this.agentCode);
            }).
            then(() => {
                UserInteractor.printInfo(UserInteractor.MESSAGES.BUILD_COPIED, this.identifierInfo, build.identifierInfo);
                UserInteractor.printResultWithStatus();
            }).
            catch(error => UserInteractor.processError(error));
    }

    _isOlderThan(build) {
        return new Date(this.createdAt).getTime() < new Date(build.createdAt).getTime();
    }

    // Returns array of attributes that will be displayed for every Build
    // by 'build history' command
    _getListAttrs() {
        return [ATTR_SHA, ATTR_TAGS, ATTR_ORIGIN, ATTR_FLAGGED];
    }

    // Returns related entities that will be displayed for every Entity
    // by 'build list' command.
    _getListRelationships() {
        return [
            { name : Entity.REL_DEVICE_GROUP, Entity : DeviceGroup },
            { name : Entity.REL_OWNER, Entity : Account, displayName : UserInteractor.MESSAGES.ENTITY_OWNER, skipMine : true }
        ];
    }

    // Returns related entities that will be displayed for every Build
    // by 'build get' command
    _getInfoRelationships() {
        return [
            { name : Entity.REL_DEVICE_GROUP, Entity : DeviceGroup },
            { name : Entity.REL_PRODUCT, Entity : Product }
        ].concat(super._getInfoRelationships());
    }

    // Initializes the Build entity
    _init() {
        this._Entity = Build;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_BUILD, [ATTR_SHA, ATTR_TAGS, ATTR_ORIGIN]);
    }

    // Reads device and agent source files.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _readSourceFiles() {
        const sources = {};
        return this._readSourceFile(this._deviceFileName, true).
            then(source => {
                sources.deviceCode = source;
                return this._readSourceFile(this._agentFileName, false);
            }).
            then(source => {
                sources.agentCode = source;
                return sources;
            });
    }

    _readSourceFile(fileName, isDevice) {
        const option = isDevice ? Options.DEVICE_FILE : Options.AGENT_FILE;
        const type = isDevice ? UserInteractor.MESSAGES.BUILD_SOURCE_DEVICE : UserInteractor.MESSAGES.BUILD_SOURCE_AGENT;
        if (fileName) {
            if (Utils.existsFileSync(fileName)) {
                return Utils.readFile(fileName);
            }
            else {
                return Promise.reject(new Errors.ImptError(UserInteractor.ERRORS.BUILD_DEPLOY_FILE_NOT_FOUND,
                    type, fileName));
            }
        }
        else {
            UserInteractor.printInfo(UserInteractor.MESSAGES.BUILD_DEPLOY_FILE_NOT_SPECIFIED, option, type);
        }
        return Promise.resolve("");
    }

    // Writes device and/or agent source files depending on the options.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _saveSourceFiles(options) {
        const writeDeviceCode = (!options.agentOnly) ? 
            Utils.writeFile(this._deviceFileName, this.deviceCode) :
            Promise.resolve();
        const writeAgentCode = (!options.deviceOnly) ? 
            Utils.writeFile(this._agentFileName, this.agentCode) :
            Promise.resolve();
        return writeDeviceCode.
            then(() => writeAgentCode).
            then(() => UserInteractor.printInfo(UserInteractor.MESSAGES.BUILD_DOWNLOADED, this.identifierInfo));
    }

    // Checks agent-file/device-file options availability.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _checkFileOptions(options) {
        if (!this._deviceFileName && !options.agentOnly) {
            return Promise.reject(new Errors.NoOptionError(Options.DEVICE_FILE));
        }
        if (!this._agentFileName && !options.deviceOnly) {
            return Promise.reject(new Errors.NoOptionError(Options.AGENT_FILE));
        }
        return Promise.resolve();
    }

    // Sets the Build --device-file/--agent-file options.
    // If --device-file and/or --agent-file options are missed but the current directory 
    // contains Project Config, then Project Config device/agent file names are used.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setFileOptions(options) {
        this._deviceFileName = options.deviceFile || (this._projectConfig.exists() ? this._projectConfig.deviceFile : null);
        this._agentFileName = options.agentFile || (this._projectConfig.exists() ? this._projectConfig.agentFile : null);
        return Promise.resolve();
    }

    // Sets the Build specific options based on impt command options.
    // If --build <BUILD_IDENTIFIER> option is specified, the Build identifier 
    // is initialized by its value,
    // otherwise the identifier is initialized by the Project Config Device Group 
    // latest Deployment, if exists.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        return this._setFileOptions(options).then(() => {
            if (options.buildIdentifier) {
                this._identifier.initByIdentifier(options.buildIdentifier);
            }
            else if (this._projectConfig.exists()) {
                return this._projectConfig.checkConfig().then(() => {
                    const deviceGroup = new DeviceGroup().initByIdFromConfig(this._projectConfig.deviceGroupId, this._projectConfig.type);
                    return deviceGroup.getEntity().then(() => {
                        if (deviceGroup.currentDeploymentId) {
                            this._identifier.initById(deviceGroup.currentDeploymentId);
                        }
                        return Promise.resolve();
                    });
                });
            }
            return Promise.resolve();
        });
    }
}

module.exports = Build;

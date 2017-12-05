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

const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const ImpCentralApi = require('imp-central-api');
const Deployments = ImpCentralApi.Deployments;
const UserInteractor = require('./util/UserInteractor');
const Utils = require('./util/Utils');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const Options = require('./util/Options');
const DeviceGroup = require('./DeviceGroup');
const Product = require('./Product');
const Log = require('./Log');
const Errors = require('./util/Errors');
const Util = require('util');

// This class represents Deployment impCentral API entity.
// Provides methods used by build-cli Build Manipulation Commands.
class Build extends Entity {

    // Returns device_code attribute of the Deployment
    get deviceCode() {
        return this.apiEntity.attributes.device_code;
    }

    // Returns agent_code attribute of the Deployment
    get agentCode() {
        return this.apiEntity.attributes.agent_code;
    }

    // Returns the Deployment tags
    get tags() {
        return this.apiEntity.attributes.tags;
    }

    // Returns the Deployment flagged attribute
    get flagged() {
        return this.apiEntity.attributes.flagged;
    }

    // Returns the Deployment description attribute
    get description() {
        return this.apiEntity.attributes.description;
    }

    // Returns the Deployment origin attribute
    get origin() {
        return this.apiEntity.attributes.origin;
    }

    // Returns the id of associated Device Group
    get relatedDeviceGroupId() {
        return this.apiEntity.relationships.devicegroup.id;
    }

    // Collects impCentral API attributes for Deployment creation based on build-cli options of 
    // 'build deploy' command and creates a new impCentral Deployment.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Deployment is successfully created, 
    //                          or rejects with an error
    _create(options, deviceCode, agentCode) {
        const deviceGroup = new DeviceGroup(options);
        return deviceGroup.getEntity().
            then(() => {
                const attrs = {
                    device_code : deviceCode,
                    agent_code : agentCode,
                    description : options.description,
                    origin : options.origin,
                    flagged : this._getFlaggedValue(options),
                    tags : options.tags
                };
                return this._createEntity(deviceGroup.id, deviceGroup.type, attrs);
            });
    }

    // Creates a build from the specified source files, and deploys it to all Devices of the specified 
    // Device Group.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Build is successfully deployed, 
    //                          or rejects with an error
    _deploy(options) {
        return this._setFileOptions(options).
            then(() => this._checkFileOptions(options)).
            then(() => this._readSourceFiles()).
            then((sources) => this._create(options, sources.deviceCode, sources.agentCode));
    }

    // Creates a build from the specified source files, and deploys it to all Devices of the specified 
    // Device Group or reports an error occurred.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    deploy(options) {
        this._deploy(options).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    // Creates, deploys and run a build or reports an error occurred.
    // Optionally, displays logs of the running build.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing
    run(options) {
        this._deploy(options).
            then(() => new DeviceGroup().initById(this.relatedDeviceGroupId)._restart()).
            then(() => {
                UserInteractor.printMessage(UserInteractor.MESSAGES.BUILD_RUN, this.identifierInfo);
                if (options.log) {
                    new Log().stream(options);
                }
                else {
                    UserInteractor.printSuccessStatus();
                }
            }).
            catch(error => UserInteractor.processError(error));
    }

    // Updates tags of the current Build.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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

    // Collects impCentral API attributes for Deployment update based on build-cli options of
    // 'build update' command and updates the specific Deployment.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Deployment is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        return this._updateTags(options).then(tags => {
            const attrs = {
                description : options.description,
                flagged : this._getFlaggedValue(options),
                tags : tags
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
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Nothing.
    get(options) {
        return super.getEntity().
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
                    options.force || existingFiles.length === 0);
            }).
            then(() => this._displayInfo()).
            then(() => UserInteractor.printSuccessStatus()).
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
    // modified during "--full" delete.
    // 
    // Parameters:
    //     summary : Object     DeleteHelper summary object to be filled by collected info
    //     options : Options    build-cli options of the corresponding delete command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _collectDeleteFullSummary(summary, options) {
        if (this.flagged) {
            summary.flaggedBuilds.push(this);
        }
    }

    // Lists all or filtered Deployments available for a user.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Devices list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        let filters = {};
        if (options.sha) {
            filters[Deployments.FILTER_SHA] = options.sha;
        }
        const flagged = this._getFlaggedValue(options);
        if (flagged !== undefined) {
            filters[Deployments.FILTER_FLAGGED] = options.flagged;
        }
        if (options.tags) {
            filters[Deployments.FILTER_TAGS] = options.tags.join(',');
        }
        const productAndDevGroupFilters = [
            {
                id : options.productId,
                name : options.productName,
                entity : Product,
                filterName : Deployments.FILTER_PRODUCT_ID
            },
            {
                id : options.deviceGroupId,
                name : options.deviceGroupName,
                entity : DeviceGroup,
                filterName : Deployments.FILTER_DEVICE_GROUP_ID
            }
        ];
        return super.listByParentIdOrName(filters, productAndDevGroupFilters);
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
            [Options.DEVICE_GROUP_ID] : deviceGroupId,
            [Options.FLAGGED] : true
        });
        return this._list(options);
    }

    // Copies the specified build (Deployment) to the new Deployment of the specified Device Group.
    // Fails if the specified Deployment or the specified Device Group does not exist.
    //
    // Parameters:
    //     options : Options    build-cli options of the build copy command
    //
    // Returns:                 Nothing.
    copy(options) {
        const build = new Build();
        return super.getEntity().
            then(() => {
                const opts = new Options({
                    [Options.DEVICE_GROUP_IDENTIFIER] : options.deviceGroupIdentifier,
                    [Options.DESCRIPTION] : this.description,
                    [Options.ORIGIN] : this.origin !== null ? this.origin : undefined,
                    [Options.TAG] : this.tags,
                    [Options.FLAGGED] : this.flagged,
                });
                return build._create(opts, this.deviceCode, this.agentCode);
            }).
            then(() => UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.BUILD_COPIED, this.identifierInfo, build.identifierInfo)).
            catch(error => UserInteractor.processError(error));
    }

    // Returns array of attributes that will be displayed for every Build
    // by 'build history' build-cli command
    _getListAttrs() {
        return ['description', 'sha', 'tags', 'origin', 'flagged'];
    }

    // Returns related entities that will be displayed for every Build
    // by 'build get' build-cli command
    _getInfoRelationships() {
        return [
            { name : 'devicegroup', Entity : DeviceGroup }
        ].concat(super._getInfoRelationships());
    }

    // Returns array of attributes that will be displayed for every Entity
    // by delete summary.
    // To be overwritten in children classes.
    _getDeleteAttrs() {
        return ['description', 'sha', 'tags', 'origin', 'flagged'];
    }

    // Initializes the Build entity
    _init() {
        this._Entity = Build;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_BUILD, ['sha', 'tags', 'origin']);
    }

    // Reads device and agent source files.
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _readSourceFiles() {
        const sources = {};
        return Utils.readFile(this._deviceFileName).then(source => {
            sources.deviceCode = source;
            return Utils.readFile(this._agentFileName);
        }).then(source => {
            sources.agentCode = source;
            return sources;
        });
    }

    // Writes device and/or agent source files depending on the options.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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
            then(() => UserInteractor.printMessage(UserInteractor.MESSAGES.BUILD_DOWNLOADED, this.identifierInfo));
    }

    // Checks agent-file/device-file options availability.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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
    //     options : Options    build-cli options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded,
    //                          or rejects with an error
    _setFileOptions(options) {
        this._deviceFileName = options.deviceFile || (this._projectConfig.exists() ? this._projectConfig.deviceFile : null);
        this._agentFileName = options.agentFile || (this._projectConfig.exists() ? this._projectConfig.agentFile : null);
        return Promise.resolve();
    }

    // Sets the Build specific options based on build-cli command options.
    // If --build <BUILD_IDENTIFIER> option is specified, the Build identifier 
    // is initialized by its value,
    // otherwise the identifier is initialized by the Project Config Device Group 
    // latest Deployment, if exists.
    //
    // Parameters:
    //     options : Options    build-cli options of the corresponding command
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
                    const deviceGroup = new DeviceGroup().initByIdFromConfig(this._projectConfig.deviceGroupId);
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

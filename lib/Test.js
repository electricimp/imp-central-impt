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
const TestConfig = require('./util/TestConfig');
const GithubConfig = require('./util/GithubConfig');
const BuilderConfig = require('./util/BuilderConfig');
const Errors = require('./util/Errors');
const Utils = require('./util/Utils');
const TestHelper = require('./util/TestHelper');
const DeleteHelper = require('./util/DeleteHelper');
const Identifier = require('./util/Identifier');
const DeviceGroup = require('./DeviceGroup');

const BUILDER_CACHE_DIR_NAME = '.builder-cache';

// Provides methods used by impt Test Manipulation Commands.
class Test {
    constructor(options) {
        options = options || {};
        this._testConfig = TestConfig.getEntity();
        this._githubConfig = null;
        this._helper = ImpCentralApiHelper.getEntity();
        if (options.debug) {
            this._helper.debug = true;
        }

        this._deviceGroup = null;
        this._devices = null;
    }

    get entityType() {
        return this._testConfig.type + ' File';
    }

    create(options) {
        return UserInteractor.processCancelContinueChoice(
            Util.format(UserInteractor.MESSAGES.CONFIG_EXISTS_CURR_DIR, this._testConfig.type),
            this._create.bind(this),
            options,
            !this._testConfig.exists() || options.confirmed).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _create(options) {
        this._testConfig.clean();
        return this._initDeviceGroup(options).
            then(() => this._setTestConfigOptions(options, true)).
            then(() => this._saveTestConfig()).
            then(() => {
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_CREATED, this.entityType);
                return this._info();
            });
    }

    update(options) {
        return this._checkTestConfig().
            then(() => this._initDeviceGroup(options)).
            then(() => this._setTestConfigOptions(options, false)).
            then(() => this._saveTestConfig()).
            then(() => {
                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_UPDATED, this.entityType);
                return this._info();
            }).
            catch(error => UserInteractor.processError(error));
    }

    delete(options) {
        if (this._testConfig.exists()) {
            new DeleteHelper().processDelete(this, options).
                then(() => UserInteractor.printSuccessStatus()).
                catch(error => UserInteractor.processError(error));
        }
        else {
            UserInteractor.printMessageWithStatus(UserInteractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG, this._testConfig.type);
        }
    }

    _collectDeleteSummary(summary, options) {
        summary.configs.push(this._testConfig);
        if (Utils.existsFileSync(BUILDER_CACHE_DIR_NAME)) {
            summary.dirs['Builder cache'] = BUILDER_CACHE_DIR_NAME;
        }
        if (options.githubConfig !== undefined) {
            summary.configs.push(new GithubConfig(options.githubConfig));
        }
        if (options.builderConfig !== undefined) {
            summary.configs.push(new BuilderConfig(options.builderConfig));
        }
        return Promise.resolve();
    }

    run(options) {
        UserInteractor.enableSpinner(false);
        return this._initDeviceGroup(null).
            then(() => this._checkTestConfig()).
            then(() => {
                const testHelper = new TestHelper(this._deviceGroup, options);
                return testHelper.runTests();
            }).
            then(() => {
                UserInteractor.printSuccessStatus();
                process.exit(0);
            }).
            catch((error) => {
                UserInteractor.processError(error);
                process.exit(1);
            });
    }

    info(options) {
        this._checkTestConfig().
            then(() => this._info()).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error))
    }

    _info(options) {
        return this._initDeviceGroup(null).
            then(() => this._deviceGroup._collectListData(true)).
            then(() => {
                const data = {
                    'Test files' : this._testConfig.testFiles,
                    'Device file' : this._testConfig.deviceFile,
                    'Agent file' : this._testConfig.agentFile,
                    'Stop on failure' : this._testConfig.stopOnFail,
                    'Timeout' : this._testConfig.timeout,
                    'Allow disconnect' : this._testConfig.allowDisconnect,
                    'Builder cache' : this._testConfig.builderCache
                };
                Object.assign(data, this._deviceGroup.displayData);

                UserInteractor.printMessage(UserInteractor.MESSAGES.ENTITY_INFO, this._testConfig.type);
                UserInteractor.printJsonData(data);
            });
    }

    github(options) {
        this._githubConfig = new GithubConfig(options.githubConfig);
        return UserInteractor.processCancelContinueChoice(
            this._githubConfig.isCurrDir() ?
                Util.format(UserInteractor.MESSAGES.CONFIG_EXISTS_CURR_DIR, this._githubConfig.type) :
                Util.format(UserInteractor.MESSAGES.CONFIG_EXISTS, this._githubConfig.type, this._githubConfig.fileName),
            this._github.bind(this),
            options,
            !this._githubConfig.exists() || options.confirmed).
            then(() => UserInteractor.printSuccessStatus()).
            catch(error => UserInteractor.processError(error));
    }

    _github(options) {
        const exists = this._githubConfig.exists();
        this._githubConfig.clean();
        return this._setGithubConfigOptions(options).
            then(() => this._githubConfig.save()).
            then(() => {
                UserInteractor.printMessage(
                    exists ? UserInteractor.MESSAGES.ENTITY_UPDATED : UserInteractor.MESSAGES.ENTITY_CREATED,
                    this._githubConfig.type + ' File');
            });
    }

    _initDeviceGroup(options) {
        if (options && options.deviceGroupIdentifier) {
            this._deviceGroup = new DeviceGroup(options);
            return this._deviceGroup.getEntity().then(() => {
                this._testConfig.deviceGroupId = this._deviceGroup.id;
            });
        }
        else if (this._testConfig.deviceGroupId) {
            this._deviceGroup = new DeviceGroup().initByIdFromConfig(this._testConfig.deviceGroupId, this._testConfig.type);
            return this._deviceGroup.getEntity();
        }
        return Promise.reject(new Errors.NoIdentifierError(Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP));
    }

    _processSourceFile(fileName, type) {
        if (fileName) {
            if (Utils.existsFileSync(fileName)) {
                return fileName;
            }
            else {
                throw new Errors.ImptError(UserInteractor.ERRORS.ENTITY_NOT_FOUND, Util.format('%s source file', type), fileName);
            }
        }
        return undefined;
    }

    _setGithubConfigOptions(options) {
        this._githubConfig.githubUser = options.user;
        this._githubConfig.githubToken = options.password;
        return Promise.resolve();
    }

    _setTestConfigOptions(options, isCreate) {
        if (isCreate || options.timeout !== undefined) {
            this._testConfig.timeout = options.timeout;
        }
        if (isCreate || options.stopOnFail !== undefined) {
            this._testConfig.stopOnFail = options.stopOnFail;
        }
        if (isCreate || options.allowDisconnect !== undefined) {
            this._testConfig.allowDisconnect = options.allowDisconnect;
        }
        if (isCreate || options.builderCache !== undefined) {
            this._testConfig.builderCache = options.builderCache;
        }
        if (isCreate || options.testFile !== undefined) {
            this._testConfig.testFiles = options.testFile;
        }
        if (isCreate || options.deviceFile !== undefined) {
            this._testConfig.deviceFile = this._processSourceFile(options.deviceFile, 'Device');
        }
        if (isCreate || options.agentFile !== undefined) {
            this._testConfig.agentFile = this._processSourceFile(options.agentFile, 'Agent');
        }
        return Promise.resolve();
    }

    _saveTestConfig() {
        return this._testConfig.save();
    }

    _checkTestConfig() {
        return this._testConfig.checkConfig();
    }
}

module.exports = Test;

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

require('jasmine-expect');

const ImptTestHelper = require('./ImptTestHelper');
const UserInterractor = require('../lib/util/UserInteractor');
const Identifier = require('../lib/util/Identifier');
const Util = require('util');

// Helper class for testing impt tool.
// Contains common methods for testing output error message
class MessageHelper {

    static get DEVICE() {
        return Identifier.ENTITY_TYPE.TYPE_DEVICE;
    }

    static get DG() {
        return Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP;
    }

    static get PRODUCT() {
        return Identifier.ENTITY_TYPE.TYPE_PRODUCT;
    }

    static get BUILD() {
        return Identifier.ENTITY_TYPE.TYPE_BUILD;
    }

    static get ACCOUNT() {
        return Identifier.ENTITY_TYPE.TYPE_ACCOUNT;
    }

    static get LOGINKEY() {
        return Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY;
    }

    static get WEBHOOK() {
        return Identifier.ENTITY_TYPE.TYPE_WEBHOOK;
    }

    static checkDuplicateResourceError(commandOut, entity) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Duplicate Resource: ${entity}s must have unique names.`
        );
    }

    static checkMissingArgumentsError(commandOut, names) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Missing required argument: ${names}`
        );
    }

    static checkNotEnoughArgumentsError(commandOut, option) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Not enough arguments following: ${option}`
        );
    }

    static checkNonEmptyOptionValueError(commandOut, option) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.CMD_NON_EMPTY_VALUE}`, option)
        );
    }

    static checkInvalidValuesError(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            'Invalid values:'
        );
    }

    static checkInvalidUrlError(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Invalid URL: The provided URL is invalid.`
        );
    }

    static checkOptionPositiveValueError(commandOut, option) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Option "${option}" must have a positive integer value.`
        );
    }

    static checkProjectDeviceGroupNotExistMessage(commandOut, deviceGroup) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Device Group "${deviceGroup}", saved in Project File, does not exist anymore.`
        );
    }

    static checkTestDeviceGroupNotExistMessage(commandOut, deviceGroup) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.CONFIG_OUTDATED}`, `Device Group "${deviceGroup}"`, 'Test Configuration')
        );
    }

    static checkProjectNotFoundMessage(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Project File is not found in the current directory.`
        );
    }

    static checkDependedDeviceGroupExistMessage(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Dependent Devicegroups Exist: Cannot delete a product with associated devicegroups.`
        );
    }

    static checkNoIdentifierIsSpecifiedMessage(commandOut, entity) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.NO_IDENTIFIER}`, entity)
        );
    }

    static checkEntityNotFoundError(commandOut, entity, name) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.ENTITY_NOT_FOUND}`, entity, name)
        );
    }

    static checkDeleteFlaggedDeploymentMessage(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            `Resource Flagged: You cannot delete flagged deployments; set the flagged attribute to false and try again.`
        );
    }

    static checkDeleteMinSupportedDeploymentMessage(commandOut, build, dg) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.BUILD_DELETE_ERR}`, `${Identifier.ENTITY_TYPE.TYPE_BUILD} "${build}"`, `${Identifier.ENTITY_TYPE.TYPE_DEVICE_GROUP} "${dg}"`)
        );
    }

    static checkBuildDeployFileNotFoundMessage(commandOut, filetype, file) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.BUILD_DEPLOY_FILE_NOT_FOUND}`, `${filetype}`, `${file}`)
        );
    }

    static checkOptionMustBeSpecifiedMessage(commandOut, option) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            Util.format(`${UserInterractor.ERRORS.CMD_REQUIRED_OPTION}`, `${option}`)
        );
    }
    static checkNoTestFileFoundMessage(commandOut) {
        ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
            UserInterractor.ERRORS.TEST_NO_FILES_FOUND);
    }
}

module.exports = MessageHelper;

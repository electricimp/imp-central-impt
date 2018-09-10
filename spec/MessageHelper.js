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

// Helper class for testing impt tool.
// Contains common methods for testing output error message
class MessageHelper {
    static checkDuplicateResourceError(commandOut, entity) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Duplicate Resource: ${entity}s must have unique names.`
        );
    }

    static checkMissingArgumentsError(commandOut, names) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Missing required argument: ${names}`
        );
    }

    static checkNotEnoughArgumentsError(commandOut, option) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Not enough arguments following: ${option}`
        );
    }

    static checkMissingArgumentValueError(commandOut, option) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Missing argument value: ${option}`
        );
    }

    static checkInvalidValuesError(commandOut) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            'Invalid values:'
        );
    }

    static checkEntityNotFoundError(commandOut, entity, name) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `${entity} "${name}" is not found.`
        );
    }

    static checkInvalidUrlError(commandOut) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Invalid URL: The provided URL is invalid.`
        );
    }

  
    static checkProjectDeviceGroupNotExistMessage(commandOut, deviceGroup) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Device Group "${deviceGroup}", saved in Project File, does not exist anymore.`
        );
    }

    static  checkProjectNotFoundMessage(commandOut) {
        ImptTestHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
            `Project File is not found in the current directory.`
        );
    }
}

module.exports = MessageHelper;

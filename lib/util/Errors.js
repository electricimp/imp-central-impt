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

// These classes define different types of errors used by the library.
class InternalLibraryError extends Error {
    constructor(message) {
        super('Internal library error: ' + (message || 'unexpected state'));
    }
}

class RefreshTokenError extends Error {
}

class EntityNotFoundError extends Error {
    constructor(entityType, identifier, alternativeId = null) {
        super();
        this._entityType = entityType;
        this._identifier = identifier;
        this._alternativeId = alternativeId;
    }
}

class CorruptedRelatedEntityError extends Error {
    constructor(identifier, relatedIdentifier) {
        super();
        this._identifier = identifier;
        this._relatedIdentifier = relatedIdentifier;
    }
}

class OutdatedProjectEntityError extends Error {
    constructor(identifier) {
        super();
        this._identifier = identifier;
    }
}

class NotUniqueIdentifierError extends Error {
    constructor(entityType, identifier, entitiesInfo) {
        super();
        this._entityType = entityType;
        this._identifier = identifier;
        this._entitiesInfo = entitiesInfo;
    }
}

class NoIdentifierError extends Error {
    constructor(entityType) {
        super();
        this._entityType = entityType;
    }
}

class NoOptionError extends Error {
    constructor(option) {
        super();
        this._option = option;
    }
}

class UnsupportedDeviceGroupTypeError extends Error {
    constructor(identifier, type, message = null) {
        super(message || 'Impossible to execute the command');
        this._identifier = identifier;
        this._type = type;
    }
}

class DeviceGroupActivationError extends Error {
    constructor(identifier) {
        super();
        this._identifier = identifier;
    }
}

class DeviceGroupHasNoDevicesError extends Error {
    constructor(identifier) {
        super();
        this._identifier = identifier;
    }
}

class RecentBuildDeleteError extends Error {
    constructor(buildIdentifier, devGroupIdentifier) {
        super();
        this._buildIdentifier = buildIdentifier;
        this._devGroupIdentifier = devGroupIdentifier;
    }
}

class NoConfigError extends Error {
    constructor(type, message) {
        super(message);
        this._type = type;
    }
}

class CorruptedConfigError extends Error {
    constructor(type, fileName) {
        super();
        this._type = type;
        this._fileName = fileName;
    }
}

class FileError extends Error {
    constructor(fileName, message) {
        super(message);
        this._fileName = fileName;
    }
}

class OperationCanceled extends Error {
}

module.exports.InternalLibraryError = InternalLibraryError;
module.exports.RefreshTokenError = RefreshTokenError;
module.exports.EntityNotFoundError = EntityNotFoundError;
module.exports.CorruptedRelatedEntityError = CorruptedRelatedEntityError;
module.exports.OutdatedProjectEntityError = OutdatedProjectEntityError;
module.exports.NotUniqueIdentifierError = NotUniqueIdentifierError;
module.exports.NoIdentifierError = NoIdentifierError;
module.exports.NoOptionError = NoOptionError;
module.exports.UnsupportedDeviceGroupTypeError = UnsupportedDeviceGroupTypeError;
module.exports.DeviceGroupActivationError = DeviceGroupActivationError;
module.exports.DeviceGroupHasNoDevicesError = DeviceGroupHasNoDevicesError;
module.exports.RecentBuildDeleteError = RecentBuildDeleteError;
module.exports.NoConfigError = NoConfigError;
module.exports.CorruptedConfigError = CorruptedConfigError;
module.exports.FileError = FileError;
module.exports.OperationCanceled = OperationCanceled;

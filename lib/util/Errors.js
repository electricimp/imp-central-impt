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

// These classes define different types of errors used by the library.
class CommandSyntaxError extends Error {
    constructor(message, ...args) {
        super(Util.format(message, ...args));
    }
}

class InternalLibraryError extends Error {
    constructor(message) {
        super(message);
    }
}

class RefreshTokenError extends Error {
    constructor(authConfig) {
        super();
        this._authConfig = authConfig;
    }
}

class AccessTokenExpiredError extends Error {
    constructor(authConfig) {
        super();
        this._authConfig = authConfig;
    }
}

class EntityNotFoundError extends Error {
    constructor(entityType, identifier) {
        super();
        this._entityType = entityType;
        this._identifier = identifier;
    }
}

class CorruptedRelatedEntityError extends Error {
    constructor(identifier, relatedIdentifier) {
        super();
        this._identifier = identifier;
        this._relatedIdentifier = relatedIdentifier;
    }
}

class OutdatedConfigEntityError extends Error {
    constructor(identifier, configType) {
        super();
        this._identifier = identifier;
        this._configType = configType;
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

class RecentBuildDeleteError extends Error {
    constructor(buildIdentifier, devGroupIdentifier) {
        super();
        this._buildIdentifier = buildIdentifier;
        this._devGroupIdentifier = devGroupIdentifier;
    }
}

class NoConfigError extends Error {
    constructor(config, isLogout = false) {
        super();
        this._config = config;
        this._isLogout = isLogout;
    }
}

class CorruptedConfigError extends Error {
    constructor(config) {
        super();
        this._config = config;
    }
}

class FileError extends Error {
    constructor(fileName, message) {
        super(message);
        this._fileName = fileName;
    }
}

class ImptError extends Error {
    constructor(message, ...args) {
        super(Util.format(message, ...args));
    }
}

class OperationCanceled extends Error {
}

module.exports.CommandSyntaxError = CommandSyntaxError;
module.exports.InternalLibraryError = InternalLibraryError;
module.exports.RefreshTokenError = RefreshTokenError;
module.exports.AccessTokenExpiredError = AccessTokenExpiredError;
module.exports.EntityNotFoundError = EntityNotFoundError;
module.exports.CorruptedRelatedEntityError = CorruptedRelatedEntityError;
module.exports.OutdatedConfigEntityError = OutdatedConfigEntityError;
module.exports.NotUniqueIdentifierError = NotUniqueIdentifierError;
module.exports.NoIdentifierError = NoIdentifierError;
module.exports.NoOptionError = NoOptionError;
module.exports.RecentBuildDeleteError = RecentBuildDeleteError;
module.exports.NoConfigError = NoConfigError;
module.exports.CorruptedConfigError = CorruptedConfigError;
module.exports.FileError = FileError;
module.exports.ImptError = ImptError;
module.exports.OperationCanceled = OperationCanceled;

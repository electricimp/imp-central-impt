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
const Errors = require('./Errors');

// Possible types of Identifier
const IDENTIFIER_TYPE = {
    ID : 1,     // impCentral API id
    NAME : 2,   // impCentral API name attribute
    ANY : 3     // id or any valid attribute depending on Entity type. See build-cli Entities Identification
};

// Identifier origin
const IDENTIFIER_ORIGIN = {
    CLI_COMMAND : 1,       // obtained from build-cli command options
    PROJECT_CONFIG : 2,    // obtained from Project Config
    IMP_CENTRAL_API : 3    // obtained from impCentral API JSON data
};

const ENTITY_TYPE = {
    TYPE_PRODUCT : 'Product',
    TYPE_DEVICE_GROUP : 'Device Group',
    TYPE_DEVICE : 'Device',
    TYPE_BUILD : 'Build'
}

// Helper class for entities identification.
class Identifier {
    static get IDENTIFIER_TYPE() {
        return IDENTIFIER_TYPE;
    }

    static get IDENTIFIER_ORIGIN() {
        return IDENTIFIER_ORIGIN;
    }

    static get ENTITY_TYPE() {
        return ENTITY_TYPE;
    }
    
    constructor() {
        this._identifier = null;
        this._id = null;
        this._type = IDENTIFIER_TYPE.ANY;
        this._origin = IDENTIFIER_ORIGIN.CLI_COMMAND;
    }

    init(entityType, attributes) {
        this._entityType = entityType;
        this._attributes = attributes;
    }

    get id() {
        return this._id;
    }

    get type() {
        return this._type;
    }

    get attributes() {
        return this._attributes;
    }

    get entityType() {
        return this._entityType;
    }

    get identifier() {
        return this._type === IDENTIFIER_TYPE.ID ? this._id : this._identifier;
    }

    get origin() {
        return this._origin;
    }

    get info() {
        return this._identifier || this._id;
    }

    initById(id) {
        this._id = id;
        this._type = IDENTIFIER_TYPE.ID;
    }

    initByIdFromConfig(id) {
        this.initById(id);
        this._origin = IDENTIFIER_ORIGIN.PROJECT_CONFIG;
    }

    initByIdFromApiData(id) {
        this.initById(id);
        this._origin = IDENTIFIER_ORIGIN.IMP_CENTRAL_API;
    }

    initByIdentifier(identifier) {
        this._identifier = identifier;
        this._type = IDENTIFIER_TYPE.ANY;
    }

    initByName(name) {
        this._identifier = name;
        this._type = IDENTIFIER_TYPE.NAME;
        this._attributes = ['name'];
    }

    initByApiEntity(apiEntity) {
        this.initById(apiEntity.id);
        this._origin = IDENTIFIER_ORIGIN.IMP_CENTRAL_API;
    }

    isEmpty() {
        return !this._id && !this._identifier;
    }

    checkNonEmpty() {
        if (this.isEmpty()) {
            return Promise.reject(new Errors.NoIdentifierError(this._entityType));
        }
        return Promise.resolve();
    }
}

module.exports = Identifier;

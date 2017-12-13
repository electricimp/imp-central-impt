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

const Identifier = require('./Identifier');

// Helper class that stores impCentral API entities already obtained from impCloud.
class EntityStorage {
    constructor() {
        this._entities = {};
        this._lists = {};
    }

    getEntity(entityId, origin = null) {
        const entity = this._entities[entityId];
        return entity && (origin === null || entity.origin <= origin) ? entity.entity : null;
    }

    getList(entityType) {
        return this._lists[entityType];
    }

    setEntity(entityId, entity, origin = Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_GET) {
        const existingEntity = this._entities[entityId];
        if (!existingEntity || existingEntity.origin > origin) {
            this._entities[entityId] = {
                entity : entity,
                origin : origin
            };
        }
    }

    clearEntity(entityId) {
        delete this._entities[entityId];
    }

    setList(entityType, list) {
        if (!this._lists[entityType]) {
            this._lists[entityType] = list;
        }
    }

    setListEntities(entities) {
        for (let entity of entities) {
            this.setEntity(entity.id, entity, Identifier.IDENTIFIER_ORIGIN.IMP_CENTRAL_API_LIST);
        }
    }

    clearList(entityType) {
        delete this._lists[entityType];
    }
}

module.exports = EntityStorage;

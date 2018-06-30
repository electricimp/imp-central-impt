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
const ImpCentralApiHelper = require('./util/ImpCentralApiHelper');
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');
const UserInteractor = require('./util/UserInteractor');


// This class represents Login Key impCentral API entity.
// Provides methods used by impt Login Key Manipulation Commands.
class LoginKey extends Entity {
    // Collects impCentral API attributes for Login Key creation based on impt options of 
    // 'loginkey create' command and creates a new impCentral Login Key.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Login Key is successfully created, 
    //                          or rejects with an error
    _create(options) {
        const attrs = {
            description : options.description,
            password : options.password
        };
        return super._createEntity(attrs);
    }

    // Collects impCentral API attributes for Login Key update based on impt options of
    // 'loginkey update' command and updates the specific Login Key.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Login Key is successfully updated, 
    //                          or rejects with an error
    _update(options) {
        const attrs = {
            description : options.description,
            password : options.password
        };
        return super._updateEntity(attrs);
    }

    // Deletes a specific impCentral API Login Key Entity
    //
    // Returns:                 Promise that resolves when the Login Key is successfully deleted,
    //                          or rejects with an error
    _deleteEntity() {
        const attrs = {
            password : this._options.password
        };
        return this.getEntityId().then(() =>
            this._helper.deleteEntity(this.entityType, this.id, attrs));
    }

    // Lists all Login Keys of the current logged-in account.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Login Key list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        if (options._options.output == "JSON"){
            UserInteractor.PRINT_FORMAT = UserInteractor.PRINT_FORMAT_JSON
        }
        return super._listEntities();
    }

    // Returns array of attributes that will be displayed for every Login Key
    // by 'loginkey list' command
    _getListAttrs() {
        return ['description', 'usages'];
    }

    // Initializes the LoginKey entity
    _init() {
        this._Entity = LoginKey;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_LOGIN_KEY, []);
    }

    // Sets the Login Key specific options based on impt command options:
    // if --lk option is specified, the Login Key identifier is initialized by its value
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves if the operation succeeded, 
    //                          or rejects with an error
    _setOptions(options) {
        options = options || {};
        if (options.loginKey) {
            this._identifier.initById(options.loginKey);
        }
        return Promise.resolve();
    }
}

module.exports = LoginKey;

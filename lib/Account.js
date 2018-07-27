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
const Identifier = require('./util/Identifier');
const Entity = require('./util/Entity');

const ATTR_EMAIL = 'email';
const ATTR_USERNAME = 'username';

const CURR_USER = 'me';

// This class represents Account impCentral API entity.
class Account extends Entity {
    static get CURR_USER() {
        return CURR_USER;
    }

    // Returns the Account username
    get username() {
        return this.apiEntity.attributes[ATTR_USERNAME];
    }

    // Returns the Account email
    get email() {
        return this.apiEntity.attributes[ATTR_EMAIL];
    }

    // Lists all Accounts of the current logged-in account.
    //
    // Parameters:
    //     options : Options    impt options of the corresponding command
    //
    // Returns:                 Promise that resolves when the Login Key list is successfully
    //                          obtained, or rejects with an error
    _list(options) {
        return super._listEntities();
    }

    // Initializes the Account entity
    _init() {
        this._Entity = Account;
        this._identifier.init(Identifier.ENTITY_TYPE.TYPE_ACCOUNT, [ATTR_EMAIL, ATTR_USERNAME]);
    }

    _getListAttrs() {
        return [ATTR_EMAIL];
    }

    _setOptions(options) {
        return Promise.resolve();
    }
}

module.exports = Account;

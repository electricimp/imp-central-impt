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

const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');

// Helper class for testing impt auth commands.
class ImptAuthCommandsHelper {
    static localLogout() {
        return ImptTestHelper.runCommand(`impt auth logout --local `, ImptTestHelper.emptyCheck);
    }

    static globalLogout() {
        return ImptTestHelper.runCommand(`impt auth logout`, ImptTestHelper.emptyCheck);
    }

    static localLogin() {
        return ImptTestHelper.runCommand(`impt auth login --local --user ${config.username} --pwd "${config.password}" --confirmed`,
            ImptTestHelper.emptyCheck);
    }

    static globalLogin() {
        return ImptTestHelper.runCommand(`impt auth login --user ${config.username} --pwd "${config.password}" --confirmed`,
            ImptTestHelper.emptyCheck);
    }

    static globalLoginByLoginkey(loginkey) {
        return ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} --confirmed`,
            ImptTestHelper.emptyCheck);
    }

    static localLoginByLoginkey(loginkey) {
        return ImptTestHelper.runCommand(`impt auth login --lk ${loginkey} --local --confirmed`,
            ImptTestHelper.emptyCheck);
    }

    static createLoginkey(output) {
        let loginkey = null;
        return ImptTestHelper.runCommand(`impt loginkey create --pwd "${config.password}"`, (commandOut) => {
            loginkey = ImptTestHelper.parseLoginkey(commandOut);
            ImptTestHelper.emptyCheck(commandOut);
        }).
            then(() => Promise.resolve(loginkey)).
            then(output);
    }

    static deleteLoginkey(loginkey) {
        return loginkey ? ImptTestHelper.runCommand(`impt loginkey delete --lk ${loginkey} --pwd "${config.password}" -q`,
            ImptTestHelper.emptyCheck) : Promise.resolve();
    }
}

module.exports = ImptAuthCommandsHelper;

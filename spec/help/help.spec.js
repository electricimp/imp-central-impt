// MIT License
//
// Copyright 2018 Electric Imp
//
// SPDX-License-Identifier: MIT
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the Software), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED AS IS, WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES
// OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
// ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.

'use strict';

require('jasmine-expect');

const ImptTestHelper = require('../ImptTestHelper');
const UserInterractor = require('../../lib/util/UserInteractor');
const outputMode = '';

describe(`impt help pages test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
    let tool = ['impt'];
    tool.impt = ['', 'auth', 'build', 'device', 'dg', 'log', 'loginkey', 'product', 'project', 'test', 'webhook'];
    tool.impt[''] = [''];
    tool.impt.auth = ['', 'info', 'login', 'logout'];
    tool.impt.build = ['', 'cleanup', 'copy', 'delete', 'deploy', 'get', 'info', 'list', 'run', 'update'];
    tool.impt.device = ['', 'assign', 'info', 'list', 'remove', 'restart', 'unassign', 'update'];
    tool.impt.dg = ['', 'builds', 'create', 'delete', 'info', 'list', 'reassign', 'restart', 'unassign', 'update'];
    tool.impt.log = ['', 'get', 'stream'];
    tool.impt.loginkey = ['', 'create', 'delete', 'info', 'list', 'update'];
    tool.impt.product = ['', 'create', 'delete', 'info', 'list', 'update',];
    tool.impt.project = ['', 'create', 'delete', 'info', 'link', 'update',];
    tool.impt.test = ['', 'create', 'delete', 'github', 'info', 'run', 'update'];
    tool.impt.webhook = ['', 'create', 'delete', 'info', 'list', 'update'];

    beforeAll((done) => {
        ImptTestHelper.init(false).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestHelper.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestHelper.TIMEOUT);

    // help page tests for all commands
    tool.forEach((imptool) => {
        // negative test for tool
        it(`${imptool} without command group`, (done) => {
            ImptTestHelper.runCommand(`${imptool}`, (commandOut) => {
                expect(commandOut.output).toMatch(`Usage: ${imptool}\\s*(\\<|\\[|-)`);
                ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
                    UserInterractor.ERRORS.CMD_UNKNOWN);
                ImptTestHelper.checkFailStatus(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
        tool[imptool].forEach((commandGroup) => {
            // negative test for each command group 
            it(`${imptool} ${commandGroup} without command`, (done) => {
                ImptTestHelper.runCommand(`${imptool} ${commandGroup}`, (commandOut) => {
                    expect(commandOut.output).toMatch(`Usage: ${imptool}\\s*${commandGroup}\\s*(\\<|\\[|-)`);
                    ImptTestHelper.checkAttribute(commandOut, UserInterractor.ERRORS.ERROR,
                        UserInterractor.ERRORS.CMD_UNKNOWN);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
            tool[imptool][commandGroup].forEach((command) => {
                // positive tests for all
                it(`${imptool} ${commandGroup} ${command} help page`, (done) => {
                    ImptTestHelper.runCommand(`${imptool} ${commandGroup} ${command} -h`, (commandOut) => {
                        expect(commandOut.output).toMatch(`Usage: ${imptool}\\s*${commandGroup}\\s*${command}\\s*(\\<|\\[|-)`);
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });
    });
});

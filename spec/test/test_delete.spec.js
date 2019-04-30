// MIT License
//
// Copyright 2018-2019 Electric Imp
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

const ImptTestHelper = require('../ImptTestHelper');
const ImptTestCommandsHelper = require('./ImptTestCommandsHelper');
const MessageHelper = require('../MessageHelper');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');

ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt test delete tests (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let dg_id = null;
        let product_id = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(ImptTestCommandsHelper.cleanUpTestEnvironment).
                then(() => ImptTestCommandsHelper.saveDeviceInfo()).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            ImptTestCommandsHelper.cleanUpTestEnvironment().
                then(() => ImptTestHelper.restoreDeviceInfo()).
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        beforeEach((done) => {
            _testInit().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterEach((done) => {
            ImptTestCommandsHelper.cleanUpTestEnvironment().
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare test environment for impt test delete test
        function _testInit() {
            return ImptTestCommandsHelper.createTestProductAndDG((commandOut) => {
                if (commandOut && commandOut.dgId) {
                    dg_id = commandOut.dgId;
                    product_id = commandOut.productId;
                }
                else fail('TestInit error: Failed to get product and dg ids');
            }).
                then(() => ImptTestCommandsHelper.copyFiles('fixtures/create')).
                then(() => ImptTestHelper.runCommand(`impt test create --dg ${dg_id} -e -i github.impt -j builder.impt -q ${outputMode}`, ImptTestHelper.emptyCheck));
        }

        // check 'test configuration successfully deleted' output message 
        function _checkSuccessDeleteTestConfigMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `Test Configuration`)
            );
        }

        // check 'github configuration successfully deleted' output message 
        function _checkSuccessDeleteGithubConfigMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `GitHub credentials Configuration`)
            );
        }

        // check 'github configuration successfully deleted' output message 
        function _checkSuccessDeleteBuilderConfigMessage(commandOut) {
            ImptTestHelper.checkOutputMessage(`${outputMode}`, commandOut,
                Util.format(`${UserInterractor.MESSAGES.ENTITY_DELETED}`,
                    `Builder Configuration`)
            );
        }

        describe(`test delete positive tests >`, () => {
            it('test delete', (done) => {
                ImptTestHelper.runCommand(`impt test delete -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteTestConfigMessage(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut)
                }).
                    then(() => ImptTestHelper.checkFileNotExist('.impt.test')).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test delete with options', (done) => {
                ImptTestHelper.runCommand(`impt test delete -i -j -e -q ${outputMode}`, (commandOut) => {
                    _checkSuccessDeleteTestConfigMessage(commandOut);
                    _checkSuccessDeleteGithubConfigMessage(commandOut);
                    _checkSuccessDeleteBuilderConfigMessage(commandOut);
                    ImptTestHelper.checkSuccessStatus(commandOut)
                }).
                    then(() => ImptTestHelper.checkFileNotExist('.impt.test')).
                    then(() => ImptTestHelper.checkFileNotExist('github.impt')).
                    then(() => ImptTestHelper.checkFileNotExist('builder.impt')).
                    then(() => ImptTestHelper.runCommand(`impt dg info -g ${dg_id}}`, ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand(`impt product info -p ${product_id}}`, ImptTestHelper.checkFailStatus)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('test delete with all entities', (done) => {
                ImptTestHelper.runCommand(`impt dg create --name ${ImptTestCommandsHelper.TEST_DG_NAME}2 --product ${product_id}`, ImptTestHelper.emptyCheck).
                    then(() => ImptTestHelper.runCommand(`impt test delete -a -q ${outputMode}`, (commandOut) => {
                        _checkSuccessDeleteTestConfigMessage(commandOut);
                        _checkSuccessDeleteGithubConfigMessage(commandOut);
                        _checkSuccessDeleteBuilderConfigMessage(commandOut);
                        ImptTestHelper.checkSuccessStatus(commandOut)
                    })).
                    then(() => ImptTestHelper.checkFileNotExist('.impt.test')).
                    then(() => ImptTestHelper.checkFileNotExist('github.impt')).
                    then(() => ImptTestHelper.checkFileNotExist('builder.impt')).
                    then(() => ImptTestHelper.runCommand(`impt dg info -g ${dg_id}}`, ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand(`impt product info -p ${product_id}`, ImptTestHelper.checkSuccessStatus)).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe(`test create negative tests >`, () => {
            it('test delete with not exist dg', (done) => {
                ImptTestHelper.runCommand(`impt dg delete -g ${dg_id} -f -q`, ImptTestHelper.emptyCheck).
                    then(() => ImptTestHelper.runCommand(`impt test delete -a -q ${outputMode}`, (commandOut) => {
                        _checkSuccessDeleteTestConfigMessage(commandOut);
                        _checkSuccessDeleteGithubConfigMessage(commandOut);
                        _checkSuccessDeleteBuilderConfigMessage(commandOut);
                        ImptTestHelper.checkSuccessStatus(commandOut)
                    })).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

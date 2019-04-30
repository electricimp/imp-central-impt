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
const config = require('../config');
const ImptTestHelper = require('../ImptTestHelper');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const Shell = require('shelljs');
const ProjectHelper = require('./ImptProjectTestHelper');

const PRODUCT_NAME = `__impt_prj_product${config.suffix}`;
const DG_NAME = `__impt_prj_device_group${config.suffix}`;
const DG_DESCR = 'impt temp dg description';

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt project create command.
// Runs 'impt project create' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    if (outputMode === '-z debug') return;
    describe(`impt project info test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        let product_id = null;
        let dg_id = null;
        let email = null;
        let userid = null;

        beforeAll((done) => {
            ImptTestHelper.init().
                then(_testSuiteCleanUp).
                then(_testSuiteInit).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        afterAll((done) => {
            _testSuiteCleanUp().
                then(ImptTestHelper.cleanUp).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT);

        // prepare test environment for impt project info test suite
        function _testSuiteInit() {
            return ImptTestHelper.getAccountAttrs().
                then((account) => { email = account.email; userid = account.id; });
        }

        // delete all entities using in impt project info test suite
        function _testSuiteCleanUp() {
            return ImptTestHelper.productDelete(PRODUCT_NAME).
                then(() => ImptTestHelper.runCommand(`impt project delete --all -q`, ImptTestHelper.emptyCheck));
        }

        describe('project exist preconditions >', () => {
            beforeAll((done) => {
                _testSuiteInit().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            // prepare test environment for impt project info test
            function _testSuiteInit() {
                return ImptTestHelper.runCommand(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    if (!product_id) fail("TestSuitInit error: Failed to create product");
                    ImptTestHelper.emptyCheck(commandOut);
                }).
                    then(() => ImptTestHelper.runCommand(`impt dg create --name ${DG_NAME} --descr "${DG_DESCR}" --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                        dg_id = ImptTestHelper.parseId(commandOut);
                        if (!dg_id) fail("TestSuitInit error: Failed to create device group");
                        ImptTestHelper.emptyCheck(commandOut);
                    })).
                    then(() => ImptTestHelper.runCommand(`impt project link --dg ${DG_NAME} ${outputMode}`, (commandOut) => {
                        ImptTestHelper.emptyCheck(commandOut);
                    }));
            }

            it('project info', (done) => {
                ImptTestHelper.runCommand(`impt project info -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json.Project['Device file']).toBe(ProjectHelper.DEVICE_FILE);
                    expect(json.Project['Agent file']).toBe(ProjectHelper.AGENT_FILE);
                    expect(json.Project['Device Group'].id).toBe(dg_id);
                    expect(json.Project['Device Group'].type).toBe('development');
                    expect(json.Project['Device Group'].name).toBe(DG_NAME);
                    expect(json.Project['Device Group'].description).toBe(DG_DESCR);
                    expect(json.Project['Device Group'].Product.id).toBe(product_id);
                    expect(json.Project['Device Group'].Product.name).toBe(PRODUCT_NAME);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project full info', (done) => {
                ImptTestHelper.runCommand(`impt project info --full -z json`, (commandOut) => {
                    const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
                    const json = JSON.parse(commandOut.output);
                    // Project info
                    expect(json.Project['Device file']).toBe(ProjectHelper.DEVICE_FILE);
                    expect(json.Project['Agent file']).toBe(ProjectHelper.AGENT_FILE);
                    expect(json.Project['Device Group'].id).toBe(dg_id);
                    expect(json.Project['Device Group'].type).toBe('development');
                    expect(json.Project['Device Group'].name).toBe(DG_NAME);
                    expect(json.Project['Device Group'].description).toBe(DG_DESCR);
                    expect(json.Project['Device Group'].Product.id).toBe(product_id);
                    expect(json.Project['Device Group'].Product.name).toBe(PRODUCT_NAME);
                    // Auth info
                    expect(json.Auth['impCentral API endpoint']).toBe(endpoint);
                    expect(json.Auth['Auth type']).toBe('Local Auth file');
                    expect(json.Auth['Access token auto refresh']).toBe(true);
                    expect(json.Auth['Login method']).toBe('User/Password');
                    expect(json.Auth['Username']).toBe(config.username);
                    expect(json.Auth['Email']).toBe(email);
                    expect(json.Auth['Account id']).toBe(userid);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('project not exist preconditions >', () => {
            beforeAll((done) => {
                _testSuiteCleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('project info without project file', (done) => {
                ImptTestHelper.runCommand(`impt project info ${outputMode}`, (commandOut) => {
                    MessageHelper.checkProjectNotFoundMessage(commandOut);
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('project not exist preconditions with restore >', () => {
                afterEach((done) => {
                    _testSuiteCleanUp().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('project info with not exist device group', (done) => {
                    Shell.cp('-Rf', `${__dirname}/fixtures/.impt.project`, ImptTestHelper.TESTS_EXECUTION_FOLDER);
                    ImptTestHelper.runCommand(`impt project info ${outputMode}`, (commandOut) => {
                        MessageHelper.checkProjectDeviceGroupNotExistMessage(commandOut, 'not-exist-device-group')
                        ImptTestHelper.checkFailStatus(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });
    });
});

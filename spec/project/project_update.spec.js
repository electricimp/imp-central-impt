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
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');
const Shell = require('shelljs');

const PRODUCT_NAME = '__impt_product';
const DG_NAME = '__impt_dg';
const DG_DESCR = 'impt temp dg description';

const DG_NEW_NAME = '__impt_new_dg';
const DG_NEW_DESCR = 'impt new dg description';

// Test suite for 'impt project update command.
// Runs 'impt project update' command with different combinations of options,
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt project update test suite (output: ${outputMode ? outputMode : 'default'}) >`, () => {

        describe('impt project update positive tests', () => {
            let product_id = null;
            let dg_id = null;

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

            function _testSuiteInit() {
                return ImptTestHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME}`, (commandOut) => {
                    product_id = ImptTestHelper.parseId(commandOut);
                    ImptTestHelper.emptyCheckEx(commandOut);
                }).
                    then(() => ImptTestHelper.runCommandEx(`impt dg create --name ${DG_NAME} --descr "${DG_DESCR}" --product ${PRODUCT_NAME} ${outputMode}`, (commandOut) => {
                        dg_id = ImptTestHelper.parseId(commandOut);
                        ImptTestHelper.emptyCheckEx(commandOut);
                    })).
                    then(() => ImptTestHelper.runCommandEx(`impt project link --dg ${DG_NAME} ${outputMode}`, (commandOut) => {
                        ImptTestHelper.emptyCheckEx(commandOut);
                    }));
            }

            function _testSuiteCleanUp() {
                return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -q`, (commandOut) => {
                    ImptTestHelper.emptyCheckEx(commandOut);
                });
            }

            // check command`s result by exec project info command
            function _checkProjectInfo(expectInfo) {
                return ImptTestHelper.runCommandEx(`impt project info -z json`, (commandOut) => {
                    const json = JSON.parse(commandOut.output);
                    expect(json.Project).toBeDefined;
                    expect(json.Project['Device file']).toBe(expectInfo && expectInfo.dfile ? expectInfo.dfile : 'device.nut');
                    expect(json.Project['Agent file']).toBe(expectInfo && expectInfo.afile ? expectInfo.afile : 'agent.nut');
                    expect(json.Project['Device Group'].id).toBe(expectInfo && expectInfo.dg_id ? expectInfo.dg_id : dg_id);
                    expect(json.Project['Device Group'].type).toBe('development');
                    expect(json.Project['Device Group'].name).toBe(expectInfo && expectInfo.dg_name ? expectInfo.dg_name : DG_NAME);
                    expect(json.Project['Device Group'].description).toBe(expectInfo && expectInfo.dg_descr ? expectInfo.dg_descr : DG_DESCR);
                    expect(json.Project['Device Group'].Product.id).toBe(expectInfo && expectInfo.product_id ? expectInfo.product_id : product_id);
                    expect(json.Project['Device Group'].Product.name).toBe(expectInfo && expectInfo.product_name ? expectInfo.product_name : PRODUCT_NAME);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                });
            }

// check 'project successfully updated' output message 
function _checkSuccessUpdateProjectMessage(commandOut) {
    ImptTestHelper.checkOutputMessageEx(`${outputMode}`, commandOut,
        Util.format(`${UserInterractor.MESSAGES.ENTITY_UPDATED}`, 'Project')
    );
}

            it('project update', (done) => {
                ImptTestHelper.runCommandEx(`impt project update --name ${DG_NEW_NAME} --descr "${DG_NEW_DESCR}" --device-file dfile.nut --agent-file afile.nut ${outputMode}`, (commandOut) => {
                    _checkSuccessUpdateProjectMessage(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                }).
                then(()=>_checkProjectInfo({dg_name:DG_NEW_NAME ,dg_descr:DG_NEW_DESCR,dfile: 'dfile.nut',afile: 'afile.nut'})).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('impt project update negative tests', () => {

            beforeAll((done) => {
                ImptTestHelper.init().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            afterAll((done) => {
               ImptTestHelper.cleanUp().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('project update without project file', (done) => {
                ImptTestHelper.runCommandEx(`impt project update -n ${DG_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkProjectNotFoundMessage(commandOut);
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('project update with not exist device group', (done) => {
                Shell.cp('-Rf', `${__dirname}/fixtures/.impt.project`, ImptTestHelper.TESTS_EXECUTION_FOLDER);
                ImptTestHelper.runCommandEx(`impt project update -n ${DG_NEW_NAME} ${outputMode}`, (commandOut) => {
                    MessageHelper.checkProjectDeviceGroupNotExistMessage(commandOut, 'not-exist-device-group')
                    ImptTestHelper.checkFailStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });
});

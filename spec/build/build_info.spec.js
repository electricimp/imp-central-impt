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
const Shell = require('shelljs');
const ImptTestHelper = require('../ImptTestHelper');
const lodash = require('lodash');
const MessageHelper = require('../MessageHelper');
const Identifier = require('../../lib/util/Identifier');
const Util = require('util');
const UserInterractor = require('../../lib/util/UserInteractor');

const PRODUCT_NAME = '__impt_product';
const DEVICE_GROUP_NAME = '__impt_device_group';

// Test suite for 'impt build info' command.
// Runs 'impt build info' command with different combinations of options,
fdescribe('impt build info test suite >', () => {
    let product_id = null;
    let dg_id = null;
    let build_id = null;
    let build_sha = null;

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

    // prepare environment for build info command testing
    function _testSuiteInit() {
        return ImptTestHelper.runCommandEx(`impt product create -n ${PRODUCT_NAME}`, (commandOut) => {
            product_id = ImptTestHelper.parseId(commandOut);
            ImptTestHelper.emptyCheckEx(commandOut);
        }).
            then(() => ImptTestHelper.runCommandEx(`impt dg create -n ${DEVICE_GROUP_NAME} -p ${PRODUCT_NAME}`, (commandOut) => {
                dg_id = ImptTestHelper.parseId(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            })).
            then(() => Shell.cp('-Rf', `${__dirname}/fixtures/devicecode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
            then(() => Shell.cp('-Rf', `${__dirname}/fixtures/agentcode.nut`, ImptTestHelper.TESTS_EXECUTION_FOLDER)).
            then(() => ImptTestHelper.runCommandEx(`impt build deploy -g ${DEVICE_GROUP_NAME} -s build_descr -x devicecode.nut -y agentcode.nut -t build_tag -o build_origin`, (commandOut) => {
                build_id = ImptTestHelper.parseId(commandOut);
                build_sha = ImptTestHelper.parseSha(commandOut);
                ImptTestHelper.emptyCheckEx(commandOut);
            }));
    }

    // delete all entities using in impt build info test suite
    function _testSuiteCleanUp() {
        return ImptTestHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME} -f -b -q`, ImptTestHelper.emptyCheckEx);
    }

    function _checkBuildInfo(commandOut) {
        let json = JSON.parse(commandOut.output);
        expect(json.Deployment.id).toEqual(build_id);
        expect(json.Deployment.sha).toEqual(build_sha);
        expect(json.Deployment.description).toEqual('build_descr');
        expect(json.Deployment.flagged).toEqual(false);
        expect(json.Deployment.tags).toContain('build_tag');
        expect(json.Deployment.origin).toEqual('build_origin');
        expect(json.Deployment['Device Group'].id).toEqual(dg_id);
        expect(json.Deployment['Device Group'].type).toEqual('development');
        expect(json.Deployment['Device Group'].name).toEqual(DEVICE_GROUP_NAME);
        expect(json.Deployment.Product.id).toEqual(product_id);
        expect(json.Deployment.Product.name).toEqual(PRODUCT_NAME);
        expect(json.Deployment.device_code).toMatch('server.log\\(\\"Device');
        expect(json.Deployment.agent_code).toMatch('server.log\\(\\"Agent');
    }

    describe('build info positive tests >', () => {
        it('build info by id', (done) => {
            ImptTestHelper.runCommandEx(`impt build info --build ${build_id} -z json`, (commandOut) => {
                _checkBuildInfo(commandOut);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT * 3);

        it('build info by sha', (done) => {
            ImptTestHelper.runCommandEx(`impt build info -b ${build_sha} -z json`, (commandOut) => {
                _checkBuildInfo(commandOut);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT * 3);

        it('build info by tag', (done) => {
            ImptTestHelper.runCommandEx(`impt build info -b build_tag -z json`, (commandOut) => {
                _checkBuildInfo(commandOut);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT * 3);

        it('build info by origin', (done) => {
            ImptTestHelper.runCommandEx(`impt build info -b build_origin -z json`, (commandOut) => {
                _checkBuildInfo(commandOut);
                ImptTestHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT * 3);

        it('build info by project', (done) => {
            ImptTestHelper.projectCreate(DEVICE_GROUP_NAME).
                then(() => ImptTestHelper.runCommandEx(`impt build info -z json`, (commandOut) => {
                    _checkBuildInfo(commandOut);
                    ImptTestHelper.checkSuccessStatusEx(commandOut);
                })).
                then(ImptTestHelper.projectDelete).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestHelper.TIMEOUT * 3);
    });

    describe('build info negative tests >', () => {
        it('build info by not exist project', (done) => {
            ImptTestHelper.runCommandEx(`impt build info`, (commandOut) => {
                MessageHelper.checkNoIdentifierIsSpecifiedMessage(commandOut, 'Deployment');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('not exist build info', (done) => {
            ImptTestHelper.runCommandEx(`impt build info -b not-exist-deployment`, (commandOut) => {
                MessageHelper.checkEntityNotFoundError(commandOut, 'Deployment', 'not-exist-deployment');
                ImptTestHelper.checkFailStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
    });
});
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
const FS = require('fs');
const config = require('../config');
const ImptTestingHelper = require('../ImptTestingHelper');

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --user <user_id> --pwd <password>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
describe('impt auth login by user/password test suite >', () => {
    
	const auth = `--user ${config.email} --pwd ${config.password}`;
	const endpoint = config.apiEndpoint ? `--endpoint ${config.apiEndpoint}` : `--endpoint ${DEFAULT_ENDPOINT}`;
	
	beforeAll((done) => {
            ImptTestingHelper.init(false).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        ImptTestingHelper.cleanUp().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

	
	
	// help function for prepare preconditions
    function localLogout(options) {
        return ImptTestingHelper.runCommandEx(`impt auth logout --local `, ImptTestingHelper.emptyCheckEx);
    }
	
	function globalLogout(options) {
        return ImptTestingHelper.runCommandEx(`impt auth logout`, ImptTestingHelper.emptyCheckEx);
    }
	
	function localLogin() {
        return ImptTestingHelper.runCommandEx(`impt auth login --local ${auth} --confirmed`, ImptTestingHelper.emptyCheckEx);
    }
	
	function globalLogin() {
        return ImptTestingHelper.runCommandEx(`impt auth login ${auth} --confirmed`, ImptTestingHelper.emptyCheckEx);
    }
	
	

describe('global login test suite >', () => {	
	
	beforeAll((done) => {
            localLogout().
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
	beforeEach((done) => {
            globalLogout().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
    it('global auth login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('global auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login temporarily', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp ${endpoint}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} ${endpoint}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
});	

describe('repeat global login test suite >', () => {	
	
	beforeAll((done) => {
            localLogout().
			then(globalLogin).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
     it('repeat global auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
});	

describe('local login test suite >', () => {	
	const local = `--local`;
	
	beforeAll((done) => {
            globalLogout().
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
	beforeEach((done) => {
            localLogout().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
    it('local auth login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local} ${auth}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('local auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login temporarily', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp ${endpoint}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} ${endpoint}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
});	

describe('repeat local login test suite >', () => {	
	const local = `--local`;
	
	beforeAll((done) => {
            globalLogout().
			then(localLogin).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	

    it('repeat local auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('repeat local temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('repeat local temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
		
	it('repeat local auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} ${endpoint} --confirmed`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
});	

	
	
});

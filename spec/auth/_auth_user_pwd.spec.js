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
	const local = '--local';
	const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;
	const outmode = '';

	
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
    function localLogout() {
        return ImptTestingHelper.runCommandEx(`impt auth logout --local `, ImptTestingHelper.emptyCheckEx);
    }
	
	function globalLogout() {
        return ImptTestingHelper.runCommandEx(`impt auth logout`, ImptTestingHelper.emptyCheckEx);
    }
	
	function localLogin() {
        return ImptTestingHelper.runCommandEx(`impt auth login --local ${auth} --confirmed`, ImptTestingHelper.emptyCheckEx);
    }
	
	function globalLogin() {
        return ImptTestingHelper.runCommandEx(`impt auth login ${auth} --confirmed`, ImptTestingHelper.emptyCheckEx);
    }
	
	
describe('Not auth preconditions >', () => {	

	beforeAll((done) => {
            globalLogout().
			then(localLogout).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	

	it('auth info without login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info`,  (commandOut) => {
				ImptTestingHelper.checkFailStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });
	
	 it('login without user/password', (done) => {
        ImptTestingHelper.runCommandEx('impt auth login', ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx('impt auth login --local', ImptTestingHelper.checkFailStatusEx)).
            then(() => ImptTestingHelper.runCommandEx('impt auth login -l -u', ImptTestingHelper.checkFailStatusEx)).
            then(() => ImptTestingHelper.runCommandEx('impt auth login -l -w', ImptTestingHelper.checkFailStatusEx)).
            then(() => ImptTestingHelper.runCommandEx(`impt auth login -l -u ${config.email}`, ImptTestingHelper.checkFailStatusEx)).
            then(() => ImptTestingHelper.runCommandEx(`impt auth login -l -w ${config.password}`, ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('login without output argument', (done) => {
        ImptTestingHelper.runCommandEx('impt auth login -z', ImptTestingHelper.checkFailStatusEx).
            then(() => ImptTestingHelper.runCommandEx('impt auth login --output undefined', ImptTestingHelper.checkFailStatusEx)).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('login without endpoint argument', (done) => {
        ImptTestingHelper.runCommandEx('impt auth login --endpoint', ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

	it('global logout without login', (done) => {
        ImptTestingHelper.runCommandEx('impt auth logout', ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local logout without login', (done) => {
        ImptTestingHelper.runCommandEx('impt auth logout -l', ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	

describe('global login test suite >', () => {	
	
	afterEach((done) => {
            globalLogout().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
    it('global auth login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('global auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login temporarily', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --endpoint ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --endpoint ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('global auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
});	

describe('local login test suite >', () => {	
	
	
	afterEach((done) => {
            localLogout().
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
    it('local auth login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local} ${auth} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

    it('local auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login temporarily', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --endpoint ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local auth login with endpoint', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --endpoint ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('local auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
});	
	
	
});	


describe('Global auth preconditions >', () => {	
	
	beforeAll((done) => {
            localLogout().
			then(globalLogin).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	

	it('repeat global auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('repeat global auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('local logout with global login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth logout --local ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	it('check global auth info ', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info`,  (commandOut) => {
				expect(commandOut.output).toMatch(`${endpoint}`);
				ImptTestingHelper.checkAttributeEx(commandOut, 'auto refresh', 'true');
				expect(commandOut.output).toMatch('Global');
				expect(commandOut.output).toMatch('User/Password');
				expect(commandOut.output).toMatch(config.email);
			//  temporary disabled - need adding environment variable IMPT_USER in config.js file 
			//	expect(commandOut.output).toMatch(config.user);
				const idMatcher = commandOut.output.match(new RegExp(`${ImptTestingHelper.ATTR_ID}"?:\\s+([A-Za-z0-9-]+)`));
                expect(idMatcher).toBeNonEmptyArray();
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });
	
	describe('Global auth preconditions with restore>', () => {		
	afterEach((done) => {
            globalLogin().
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);


it('global logout', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth logout`,  (commandOut) => {
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });


	
});
});


describe('Global temp auth preconditions >', () => {		
	beforeAll((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} --temp --confirmed`, ImptTestingHelper.emptyCheckEx).
			then(localLogout).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

	it('check global temp auth info ', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info`,  (commandOut) => {
				ImptTestingHelper.checkAttributeEx(commandOut, 'auto refresh', 'false');
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });
	describe('Global temp auth preconditions with restore >', () => {	
	afterEach((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} --temp --confirmed`, ImptTestingHelper.emptyCheckEx).
			then(localLogout).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

	it('global logout with temp login', (done) => {
        ImptTestingHelper.runCommandEx('impt auth logout', ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	});
});


describe('Global auth with endpoint preconditions >', () => {		
	beforeAll((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} --endpoint ${endpoint} --confirmed`, ImptTestingHelper.emptyCheckEx).
			then(localLogout).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

	it('check global endpoint auth info ', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info`,  (commandOut) => {
				expect(commandOut.output).toMatch(endpoint);
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });
	
	describe('Global auth with endpoint preconditions with restore >', () => {
	afterEach((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} --endpoint ${endpoint} --confirmed`, ImptTestingHelper.emptyCheckEx).
			then(localLogout).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
		it('global logout with endpoint login', (done) => {
        ImptTestingHelper.runCommandEx('impt auth logout', ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
});

});


describe('Local auth preconditions >', () => {	

	beforeAll((done) => {
            globalLogout().
			then(localLogin).
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);
	
	it('repeat local auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('repeat local temp auth login with confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('repeat local temp auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --temp --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
		
	it('repeat local auth login with endpoint and confirm', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login ${local}  ${auth} --endpoint ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
            then(done).
            catch(error => done.fail(error));
    });
	
	
	it('global logout with local login', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth logout ${outmode}`, ImptTestingHelper.checkFailStatusEx).
            then(done).
            catch(error => done.fail(error));
    });

	
	it('check local auth info ', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info`,  (commandOut) => {
				expect(commandOut.output).toMatch('Local');
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });	

	
describe('Local auth preconditions with restore>', () => {		
	afterEach((done) => {
            localLogin().
			then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);


it('local logout', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth logout -l`, (commandOut) => {
				ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
			then(done).
            catch(error => done.fail(error));
    });






	
	
});	
});

});
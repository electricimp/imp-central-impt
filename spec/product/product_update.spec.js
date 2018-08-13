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
const ImptTestingHelper = require('../ImptTestingHelper');

const PRODUCT_NAME = '__impt_product';
const PRODUCT_NAME_2 = '__impt_product_2';

const PRODUCT_DESCR = 'impt temp product description';
const PRODUCT_DESCR_2 = 'impt temp product description 2';

// Test suite for 'impt product update' command.
// Runs 'impt product update' command with different combinations of options,

describe('impt product update test suite >', () => {

const outmode = '';
let product_id = null;
  
    beforeAll((done) => {
        ImptTestingHelper.init().
            then(testSuiteCleanUp).
			then(testSuiteInit).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    afterAll((done) => {
        testSuiteCleanUp().
            then(ImptTestingHelper.cleanUp).
            then(done).
            catch(error => done.fail(error));
    }, ImptTestingHelper.TIMEOUT);

    function testSuiteCleanUp() {
        return ImptTestingHelper.runCommandEx(`impt product delete --product ${PRODUCT_NAME} --confirmed`, ImptTestingHelper.emptyCheckEx).
            then(() => ImptTestingHelper.runCommandEx(`impt product delete -p ${PRODUCT_NAME_2} -q`, ImptTestingHelper.emptyCheckEx));
	 }

    // create product and save product id for test purposes
	function testSuiteInit() {
        return ImptTestingHelper.runCommandEx(`impt product create --name ${PRODUCT_NAME} --descr "${PRODUCT_DESCR}"`,(commandOut) => {
			const idMatcher = commandOut.output.match(new RegExp(`${ImptTestingHelper.ATTR_ID}"?:\\s+"?([A-Za-z0-9-]+)`));
            if(idMatcher && idMatcher.length > 1){
				product_id = idMatcher[1];
			}
			else fail("TestSuitInit error: Fail create product");
			ImptTestingHelper.emptyCheckEx(commandOut);
		});
	}
	
	it('update product name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME} -n ${PRODUCT_NAME_2} ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	 
	it('update product description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} -s "${PRODUCT_DESCR_2}" ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });	 
	 
	it('update product name and description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} -n ${PRODUCT_NAME} -s "${PRODUCT_DESCR}" ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product to empty description', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME}  -s "" ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product name by id', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${product_id}  -n ${PRODUCT_NAME_2} ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product without new values', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} ${outmode}`,ImptTestingHelper.checkSuccessStatusEx). 
			
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product to empty name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} -n "" ${outmode}`,ImptTestingHelper.checkFailStatusEx). 
			
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product to name without value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} -n`,ImptTestingHelper.checkFailStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product to description without value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2} -s`,ImptTestingHelper.checkFailStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });

	it('update product by empty name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p "" -n ${PRODUCT_NAME_2}`,ImptTestingHelper.checkFailStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });

	it('update product by name without value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p -n ${PRODUCT_NAME_2}`,ImptTestingHelper.checkFailStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });
	
	it('update product without output value', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2}  -n ${PRODUCT_NAME} -z`,ImptTestingHelper.checkFailStatusEx). 
			then(()=>ImptTestingHelper.runCommandEx(`impt product update -p ${PRODUCT_NAME_2}  -n ${PRODUCT_NAME} -z undefined`, ImptTestingHelper.checkFailStatusEx)).
			then(done).
            catch(error => done.fail(error));
    });

	it('update not existing product', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -p __not_existing_product  -n "${PRODUCT_NAME} ${outmode}`,ImptTestingHelper.checkFailStatusEx). 
			then(done).
            catch(error => done.fail(error));
    });	
});

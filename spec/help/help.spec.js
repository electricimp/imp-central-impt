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
const config = require('../config');
const ImptTestingHelper = require('../ImptTestingHelper');
const UserInterractor = require('../../lib/util/UserInteractor');

fdescribe('impt help page test suite >', () => {

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

    it('impt help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt auth help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt auth (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt auth info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt auth info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt auth login help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth login -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt auth login (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt auth logout help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth logout -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt auth logout (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build cleanup help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build cleanup -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build cleanup (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build copy help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build copy -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build copy (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build deploy help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build deploy -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build deploy (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build get help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build get -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build get (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt build run help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt build run -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt build run (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device assign help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device assign -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device assign (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device assign help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device assign -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device assign (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device remove help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device remove -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device remove (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device restart help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device restart -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device restart (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device unassign help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device unassign -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device unassign (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt device update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt device update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt device update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg builds help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg builds -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg builds (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg reassign help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg reassign -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg reassign (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg restart help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg restart -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg restart (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg unassign help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg unassign -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg unassign (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt dg update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt dg update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt dg update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt log help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt log -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt log (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt log get help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt log get -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt log get (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt log stream help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt log stream -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt log stream (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt loginkey update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt loginkey update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt loginkey update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt product update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project link help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project link -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project link (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt project update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt project update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt project update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test github help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test github -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test github (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test run help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test run -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test run (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt test update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt test update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt test update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook create help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook create -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook create (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook delete help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook delete -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook delete (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook info help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook info -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook info (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook list help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook list -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook list (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt webhook update help page', (done) => {
        ImptTestingHelper.runCommandEx(`impt webhook update -h`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt webhook update (\\<|\\[|-)');
            ImptTestingHelper.checkSuccessStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });





    // negative tests
    it('impt without command group', (done) => {
        ImptTestingHelper.runCommandEx(`impt`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt <command>');
            ImptTestingHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
                UserInterractor.ERRORS.CMD_UNKNOWN);
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt auth without command name', (done) => {
        ImptTestingHelper.runCommandEx(`impt auth`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt auth <command>');
            ImptTestingHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
                UserInterractor.ERRORS.CMD_UNKNOWN);
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });

    it('impt product without command name', (done) => {
        ImptTestingHelper.runCommandEx(`impt product`, (commandOut) => {
            expect(commandOut.output).toMatch('Usage: impt product <command>');
            ImptTestingHelper.checkAttributeEx(commandOut, UserInterractor.ERRORS.ERROR,
                UserInterractor.ERRORS.CMD_UNKNOWN);
            ImptTestingHelper.checkFailStatusEx(commandOut);
        }).
            then(done).
            catch(error => done.fail(error));
    });


});

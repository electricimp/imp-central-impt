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
const ImptAuthCommandsHelper = require('./ImptAuthCommandsHelper');

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --user <user_id> --pwd <password>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
describe('impt auth login by user/password test suite >', () => {
    const auth = `--user ${config.email} --pwd ${config.password}`;
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

    describe('Tests with not auth preconditions >', () => {
        beforeAll((done) => {
            ImptAuthCommandsHelper.globalLogout().
                then(ImptAuthCommandsHelper.localLogout).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestingHelper.TIMEOUT);

        it('auth info without login', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info ${outmode}`, (commandOut) => {
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
                ImptAuthCommandsHelper.globalLogout().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestingHelper.TIMEOUT);

            it('global auth login', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global auth login with confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp auth login temporarily', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} --temp ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp auth login with confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -t -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp auth login with endpoint', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -t -e ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global temp auth login with endpoint and confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -t -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global auth login with endpoint', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -e ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global auth login with endpoint and confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });
        });

        describe('local login test suite >', () => {
            afterEach((done) => {
                ImptAuthCommandsHelper.localLogout().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestingHelper.TIMEOUT);

            it('local auth login', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l ${auth} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local auth login with confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local temp auth login temporarily', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local temp auth login with confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local temp auth login with endpoint', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t -e ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local temp auth login with endpoint and confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local auth login with endpoint', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -e ${endpoint} ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local auth login with endpoint and confirm', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });

    describe('Tests with global auth preconditions >', () => {
        beforeAll((done) => {
            ImptAuthCommandsHelper.localLogout().
                then(ImptAuthCommandsHelper.globalLogin).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestingHelper.TIMEOUT);

        it('repeat global auth login with confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat global temp auth login with confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -t -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat global temp auth login with endpoint and confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -q -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat global auth login with endpoint and confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login  ${auth} -e ${endpoint} --confirmed ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('local logout with global login', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth logout -l ${outmode}`, ImptTestingHelper.checkFailStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('check global auth info ', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info  ${outmode}`, (commandOut) => {
                expect(commandOut.output).toMatch(`${endpoint}`);
                ImptTestingHelper.checkAttributeEx(commandOut, 'auto refresh', 'true');
                expect(commandOut.output).toMatch('Global');
                expect(commandOut.output).toMatch('User/Password');
                expect(commandOut.output).toMatch(config.email);
                if (config.user) expect(commandOut.output).toMatch(config.user);
                const idMatcher = commandOut.output.match(new RegExp(`${ImptTestingHelper.ATTR_ID}"?:\\s+([A-Za-z0-9-]+)`));
                expect(idMatcher).toBeNonEmptyArray();
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        describe('Test with global auth preconditions and restore>', () => {
            afterEach((done) => {
                ImptAuthCommandsHelper.globalLogin().
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestingHelper.TIMEOUT);

            it('global logout', (done) => {
                ImptTestingHelper.runCommandEx(`impt auth logout`, (commandOut) => {
                    ImptTestingHelper.checkSuccessStatusEx(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
        });
    });

    describe('Tests with global temp auth preconditions >', () => {
        beforeAll((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} -t -q`, ImptTestingHelper.emptyCheckEx).
                then(ImptAuthCommandsHelper.localLogout).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestingHelper.TIMEOUT);

        it('check global temp auth info ', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info`, (commandOut) => {
                ImptTestingHelper.checkAttributeEx(commandOut, 'auto refresh', 'false');
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });
        describe('Tests with global temp auth preconditions and restore >', () => {
            afterEach((done) => {
                ImptTestingHelper.runCommandEx(`impt auth login ${auth} -t -q`, ImptTestingHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
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

    describe('Tests with global auth and endpoint preconditions >', () => {
        beforeAll((done) => {
            ImptTestingHelper.runCommandEx(`impt auth login ${auth} -e ${endpoint} -q`, ImptTestingHelper.emptyCheckEx).
                then(ImptAuthCommandsHelper.localLogout).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestingHelper.TIMEOUT);

        it('check global endpoint auth info ', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info`, (commandOut) => {
                expect(commandOut.output).toMatch(endpoint);
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        describe('Tests with global auth , endpoint preconditions and restore >', () => {
            afterEach((done) => {
                ImptTestingHelper.runCommandEx(`impt auth login ${auth} -e ${endpoint} -q`, ImptTestingHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
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

    describe('Tests with local auth preconditions >', () => {
        beforeAll((done) => {
            ImptAuthCommandsHelper.globalLogout().
                then(ImptAuthCommandsHelper.localLogin).
                then(done).
                catch(error => done.fail(error));
        }, ImptTestingHelper.TIMEOUT);

        it('repeat local auth login with confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat local temp auth login with confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat local temp auth login with endpoint and confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -t -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('repeat local auth login with endpoint and confirm', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth login -l  ${auth} -e ${endpoint} -q ${outmode}`, ImptTestingHelper.checkSuccessStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('global logout with local login', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth logout ${outmode}`, ImptTestingHelper.checkFailStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('global logout without output value', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth logout -z`, ImptTestingHelper.checkFailStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        it('check local auth info ', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info`, (commandOut) => {
                expect(commandOut.output).toMatch('Local');
                ImptTestingHelper.checkSuccessStatusEx(commandOut);
            }).
                then(done).
                catch(error => done.fail(error));
        });

        it('auth info without output value', (done) => {
            ImptTestingHelper.runCommandEx(`impt auth info -z`, ImptTestingHelper.checkFailStatusEx).
                then(done).
                catch(error => done.fail(error));
        });

        describe('Tests with local auth preconditions and restore>', () => {
            afterEach((done) => {
                ImptAuthCommandsHelper.localLogin().
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

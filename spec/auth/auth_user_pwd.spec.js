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
const ImptTestHelper = require('../ImptTestHelper');
const ImptAuthCommandsHelper = require('./ImptAuthCommandsHelper');
const Identifier = require('../../lib/util/Identifier');
const UserInterractor = require('../../lib/util/UserInteractor');
const Util = require('util');
const MessageHelper = require('../MessageHelper');

const DEFAULT_ENDPOINT = 'https://api.electricimp.com/v5';

// Test suite for 'impt auth login --user <user_id> --pwd <password>', 'impt auth logout', 'impt auth info' commands.
// Runs impt auth commands with different combinations of options.
ImptTestHelper.OUTPUT_MODES.forEach((outputMode) => {
    describe(`impt auth login by user/password test suite  (output: ${outputMode ? outputMode : 'default'}) >`, () => {
        const auth = `--user ${config.username} --pwd ${config.password}`;
        const endpoint = config.apiEndpoint ? `${config.apiEndpoint}` : `${DEFAULT_ENDPOINT}`;

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

        describe('Tests with not auth preconditions >', () => {
            beforeAll((done) => {
                ImptAuthCommandsHelper.globalLogout().
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('auth info without login', (done) => {
                ImptTestHelper.runCommand(`impt auth info ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkFailStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('login without user/password', (done) => {
                ImptTestHelper.runCommand('impt auth login', ImptTestHelper.checkFailStatus).
                    then(() => ImptTestHelper.runCommand('impt auth login --local', ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand('impt auth login -l -u', ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand('impt auth login -l -w', ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand(`impt auth login -l -u ${config.username}`, ImptTestHelper.checkFailStatus)).
                    then(() => ImptTestHelper.runCommand(`impt auth login -l -w ${config.password}`, ImptTestHelper.checkFailStatus)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('login without output argument', (done) => {
                ImptTestHelper.runCommand('impt auth login -z', ImptTestHelper.checkFailStatus).
                    then(() => ImptTestHelper.runCommand('impt auth login --output undefined', ImptTestHelper.checkFailStatus)).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('login without endpoint argument', (done) => {
                ImptTestHelper.runCommand('impt auth login --endpoint', ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global logout without login', (done) => {
                ImptTestHelper.runCommand('impt auth logout', ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local logout without login', (done) => {
                ImptTestHelper.runCommand('impt auth logout -l', ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('global login test suite >', () => {
                afterEach((done) => {
                    ImptAuthCommandsHelper.globalLogout().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('global login', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global login with confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global temp login temporarily', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} --temp ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global temp login with confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -t -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global temp login with endpoint', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -t -e ${endpoint} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global temp login with endpoint and confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -t -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global login with endpoint', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -e ${endpoint} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('global login with endpoint and confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login  ${auth} -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });
            });

            describe('local login test suite >', () => {
                afterEach((done) => {
                    ImptAuthCommandsHelper.localLogout().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('local login', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l ${auth} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local login with confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local temp login temporarily', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local temp login with confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local temp login with endpoint', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t -e ${endpoint} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local temp login with endpoint and confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local login with endpoint', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -e ${endpoint} ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });

                it('local login with endpoint and confirm', (done) => {
                    ImptTestHelper.runCommand(`impt auth login -l  ${auth} -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
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
            }, ImptTestHelper.TIMEOUT);

            it('repeat global login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login  ${auth} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat global temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login  ${auth} -t -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat global temp login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login  ${auth} -q -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat global login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login  ${auth} -e ${endpoint} --confirmed ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local logout with global login', (done) => {
                ImptTestHelper.runCommand(`impt auth logout -l ${outputMode}`, ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info  ${outputMode}`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'true');
                    ImptTestHelper.checkAttribute(commandOut, 'endpoint', `${endpoint}`);
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Global Auth file');
                    ImptTestHelper.checkAttribute(commandOut, 'Login method', 'User/Password');
                    ImptTestHelper.checkAttribute(commandOut, 'Username', config.username);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('Test with global auth preconditions and restore>', () => {
                afterEach((done) => {
                    ImptAuthCommandsHelper.globalLogin().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('global logout', (done) => {
                    ImptTestHelper.runCommand(`impt auth logout`, (commandOut) => {
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });

        describe('Tests with global temp auth preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommand(`impt auth login ${auth} -t -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('global temp auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'auto refresh', 'false');
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });
            describe('Tests with global temp auth preconditions and restore >', () => {
                afterEach((done) => {
                    ImptTestHelper.runCommand(`impt auth login ${auth} -t -q`, ImptTestHelper.emptyCheckEx).
                        then(ImptAuthCommandsHelper.localLogout).
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('global logout with temp login', (done) => {
                    ImptTestHelper.runCommand('impt auth logout', ImptTestHelper.checkSuccessStatusEx).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });

        describe('Tests with global auth and endpoint preconditions >', () => {
            beforeAll((done) => {
                ImptTestHelper.runCommand(`impt auth login ${auth} -e ${endpoint} -q`, ImptTestHelper.emptyCheckEx).
                    then(ImptAuthCommandsHelper.localLogout).
                    then(done).
                    catch(error => done.fail(error));
            }, ImptTestHelper.TIMEOUT);

            it('global endpoint auth info', (done) => {
                ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                    expect(commandOut.output).toMatch(endpoint);
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('Tests with global auth , endpoint preconditions and restore >', () => {
                afterEach((done) => {
                    ImptTestHelper.runCommand(`impt auth login ${auth} -e ${endpoint} -q`, ImptTestHelper.emptyCheckEx).
                        then(ImptAuthCommandsHelper.localLogout).
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('global logout with endpoint login', (done) => {
                    ImptTestHelper.runCommand('impt auth logout', ImptTestHelper.checkSuccessStatusEx).
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
            }, ImptTestHelper.TIMEOUT);

            it('repeat local login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l  ${auth} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat local temp login with confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat local temp login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l  ${auth} -t -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('repeat local login with endpoint and confirm', (done) => {
                ImptTestHelper.runCommand(`impt auth login -l  ${auth} -e ${endpoint} -q ${outputMode}`, ImptTestHelper.checkSuccessStatusEx).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global logout with local login', (done) => {
                ImptTestHelper.runCommand(`impt auth logout ${outputMode}`, ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('global logout without output value', (done) => {
                ImptTestHelper.runCommand(`impt auth logout -z`, ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('local auth info ', (done) => {
                ImptTestHelper.runCommand(`impt auth info`, (commandOut) => {
                    ImptTestHelper.checkAttribute(commandOut, 'Auth type', 'Local Auth file');
                    ImptTestHelper.checkSuccessStatus(commandOut);
                }).
                    then(done).
                    catch(error => done.fail(error));
            });

            it('auth info without output value', (done) => {
                ImptTestHelper.runCommand(`impt auth info -z`, ImptTestHelper.checkFailStatus).
                    then(done).
                    catch(error => done.fail(error));
            });

            describe('Tests with local auth preconditions and restore>', () => {
                afterEach((done) => {
                    ImptAuthCommandsHelper.localLogin().
                        then(done).
                        catch(error => done.fail(error));
                }, ImptTestHelper.TIMEOUT);

                it('local logout', (done) => {
                    ImptTestHelper.runCommand(`impt auth logout -l`, (commandOut) => {
                        ImptTestHelper.checkSuccessStatus(commandOut);
                    }).
                        then(done).
                        catch(error => done.fail(error));
                });
            });
        });
    });
});

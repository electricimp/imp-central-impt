// MIT License
//
// Copyright 2017 Electric Imp
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

const fs = require('fs');
const c = require('colors');
const path = require('path');
const glob = require('glob');
const Builder = require('Builder');
const Errors = require('./Errors');
const TestSession = require('./TestSession');
const dateformat = require('dateformat');
const TestLogsParser = require('./TestLogsParser');
const TestWatchdog = require('./TestWatchdog');
const randomstring = require('randomstring');
const sprintf = require('sprintf-js').sprintf;
const TestDebugMixin = require('./TestDebugMixin');
const randomWords = require('random-words');

const Util = require('util');
const ImpCentralApiHelper = require('./ImpCentralApiHelper');
const UserInteractor = require('./UserInteractor');
const TestConfig = require('./TestConfig');
const GithubConfig = require('./GithubConfig');
const BuilderConfig = require('./BuilderConfig');
const Device = require('../Device');
const Build = require('../Build');

// Delay before testing start.
// Prevents log sessions mixing, allows
// service messages to be before tests output.
// [s]

const DEFAULT_STARTUP_DELAY = 2;

// Timeout before session startup

const DEFAULT_STARTUP_TIMEOUT = 60;

// Allow extra time on top of .imptest.timeout before
// treating test as timed out on a tool siode.

const DEFAULT_EXTRA_TEST_MESSAGE_TIMEOUT = 5;

// Helper class for impt test commands.
class TestHelper {
    constructor(deviceGroup, options) {
        this._helper = ImpCentralApiHelper.getEntity();
        this._testConfig = TestConfig.getEntity();
        this._deviceGroup = deviceGroup;
        this._devices = null;
        this._success = true;

        TestDebugMixin.call(this);
        this._init(options);
    }

    _init(options) {
        this.testFrameworkFile = __dirname + '/../../../impUnit/index.nut';
        this.logTiming = true; // enable log timing

        // github credentials in env vars
        this.githubUser = process.env['GITHUB_USER'];
        this.githubToken = process.env['GITHUB_TOKEN'];
        // env vars values have the bigger priority
        if ((!this.githubUser || !this.githubToken) &&
            options.githubConfig !== undefined) {
            const githubConfig = new GithubConfig(options.githubConfig);
            if (this._checkConfig(githubConfig)) {
                this.githubUser = githubConfig.githubUser;
                this.githubToken = githubConfig.githubToken;
            }
        }
        if (options.builderConfig !== undefined) {
            const builderConfig = new BuilderConfig(options.builderConfig);
            if (this._checkConfig(builderConfig)) {
                this.builderVariables = builderConfig._json;
            }
        }
        if (options.builderCache !== undefined) {
            this.builderCache = options.builderCache;
        }
        if (options.tests !== undefined) {
            this.selectedTest = options.tests;
        }
        this.debug = options.debug;
    }

    _checkConfig(config) {
        if (config.exists()) {
            return true;
        }
        else {
            if (config.isCurrDir()) {
                UserInteractor.printMessage(UserInteractor.MESSAGES.NO_CONFIG_CURR_DIR_MSG, config.type);
            }
            else {
                UserInteractor.printMessage(UserInteractor.MESSAGES.NO_CONFIG_MSG, config.type, config.fileName);
            }
            return false;
        }
    }

    runTests() {
        this._info(c.blue('Started at ') + dateformat(new Date(), 'dd mmm yyyy HH:MM:ss Z'));
        const testFiles = this._findTestFiles();
        this._initSourceCode();
        return new Device().listByDeviceGroup(this._deviceGroup.id).
            then((devices) => {
                this._devices = devices;
                if (devices.length === 0) {
                    return Promise.reject(new Errors.ImptError(UserInteractor.MESSAGES.DG_NO_DEVICES, this._deviceGroup.identifierInfo));
                }
                return Promise.resolve();
            }).
            then(() => testFiles.reduce(
                (acc, testFile) => acc.then(() => {
                    if (this._stopCommand) {
                        return Promise.resolve();
                    }
                    return this._runTestOnDeviceGroup(testFile);
                }),
                Promise.resolve())).
            then(() => {
                if (this._stopCommand) {
                    this._debug(c.red('Command was forced to stop'));
                }
                return Promise.resolve();
            }).
            then(() => {
                this._blank();

                if (this._success) {
                    this._info(c.green('Testing succeeded'));
                } else {
                    this._info(c.red('Testing failed'));
                }
            });
    }

    _runTestOnDeviceGroup(testFile) {
        let deviceIndex = 0;
        this._sessionId = randomWords(2).join('-');
        // create agent/device code to run
        const code = this._getSessionCode(testFile);

        if (code == null) {
            this._info(c.yellow("Skip " + testFile.name + " testing"));
            return Promise.resolve();
        }
        return new Build()._createByDeviceGroup(this._deviceGroup, null, code.device, code.agent).
            then((build) => {
                this._info(c.blue('Created deployment: ') + build.id);
                return this._devices.reduce(
                    (acc, device) => acc.then(() => {
                        if (this._stopDevice || this._stopCommand) {
                            return Promise.reject();
                        }
                        deviceIndex++;
                        this._stopDevice = false;
                        return this._runTestOnDevice(device, deviceIndex, testFile);
                    }),
                    Promise.resolve());
            });
    }

    _runTestOnDevice(device, deviceIndex, testFile) {
        return new Promise((resolve, reject) => {

            // blank line
            this._blank();

            // init test session
            this._session = new TestSession(this._sessionId, this._devices.length > 1 ? deviceIndex : null);
            this._info(c.blue('Starting test session ') + this._session.name);

            // is test agent-only?
            const testIsAgentOnly = !this._deviceSource && 'agent' === testFile.type;

            if (testIsAgentOnly) {
                this._info(c.blue('Test session is') + ' agent-only');
            }

            this._info(
                c.blue('Using device ') + (device.name ? device.name : '') + c.blue(' [') + device.id + c.blue('] (') +
                c.blue((deviceIndex) + '/' + this._devices.length + ') '));

            // check online state
            if (!testIsAgentOnly && !device.online) {
                throw new TestSession.Errors.DevicePowerstateError('Device is offline');
            }

            this._info(c.blue('Using DeviceGroup ') + this._deviceGroup.name + c.blue(' [') + this._deviceGroup.id + c.blue(']'));

            // create agent/device code to run
            const code = this._getSessionCode(testFile);

            if (code == null) {
                this._info(c.yellow("Skip " + testFile.name + " testing"));
                return Promise.resolve();
            }
            // run test session
            return this._runSession(device, testFile.type)

                // error
                .catch((error) => {
                    this._onError(error);
                })

                // next file
                .then(resolve);
        });
    }

    _initSourceCode() {

        if (undefined === this._agentSource || undefined === this._deviceSource) {

            let sourceFilePath;

            if (this._testConfig.agentFile) {
                sourceFilePath = this._testConfig.agentFile;

                /* [debug] */
                this._debug(c.blue('Agent source code file path: ') + sourceFilePath);
                /* [info] */
                this._info(c.blue('Using ') + 'agent' + c.blue(' source file: ') + this._testConfig.agentFile);

                // read/process agent source

                if (!fs.existsSync(sourceFilePath)) {
                    throw new Error(`Agent source file "${sourceFilePath}" not found`);
                }

                this._agentSource = sourceFilePath.replace(/\\/g, "/");

            } else {
                this._info(c.blue('Have no ') + 'agent' + c.blue(' source file, using blank'));
                this._agentSource = false;
            }

            if (this._testConfig.deviceFile) {
                sourceFilePath = this._testConfig.deviceFile;

                this._debug(c.blue('Device source code file path: ') + sourceFilePath);
                this._info(c.blue('Using ') + 'device' + c.blue(' source file: ') + this._testConfig.deviceFile);

                // read/process device source

                if (!fs.existsSync(sourceFilePath)) {
                    throw new Error(`Device source file "${sourceFilePath}" not found`);
                }

                this._deviceSource = sourceFilePath.replace(/\\/g, "/");

            } else {
                this._info(c.blue('Have no ') + 'device' + c.blue(' source file, using blank'));
                this._deviceSource = false;
            }

        }
    }

    _findTestFiles() {
        const files = [];
        let configCwd;

        const pushFile = (file) => {
            let lastAdded = files[files.push({
                name: file,
                path: path.resolve(configCwd, file),
                type: /\bagent\b/i.test(file) ? 'agent' : 'device',
            }) - 1];
            if (/.*\.(agent|device)\.test\.nut$/ig.test(file)) {
                let tmp = file.replace(/\.(agent|device)\.test\.nut$/ig, '') + (lastAdded.type == 'agent' ? '.device' : '.agent')  + '.nut';
                if (fs.existsSync(path.resolve(configCwd, tmp))) {
                    Object.defineProperty(lastAdded, 'partnerpath', {
                        value: path.resolve(configCwd, tmp)
                    });
                    Object.defineProperty(lastAdded, 'partner', {
                        value: tmp
                    });
                }
            }
        };

        // look in config file directory
        configCwd = '.';
        let searchPatterns = this._testConfig.testFiles;

        let testFileName = this.selectedTest;
        this.testCase = '';
        if (this.selectedTest && this.selectedTest.length > 0) {
            let tmp = this.selectedTest.lastIndexOf(':');
            if (tmp >= 0) {
                this.testCase = this.selectedTest.slice(tmp + 1);
                testFileName = this.selectedTest.slice(0, tmp);
                // windows fix
                testFileName = testFileName.replace(/\\/g, '/');
            }
        }

        for (const searchPattern of searchPatterns) {
          for (const file of glob.sync(searchPattern, {cwd: configCwd})) {
            // TODO: would it better to add the testFileName to the searchPatterns?
            if (testFileName != null && testFileName.length > 0 && file.search(testFileName) < 0) {
              this._debug("Skipping found test " + file);
              continue;
            }
            pushFile(file);
          }
        }

        if (files.length === 0) {
            throw new Error('No test files found');
        }

        this._debug(c.blue('Test files found:'), files);

        this._info(c.blue('Found ') +
            files.length +
            c.blue(' test file' +
                (files.length === 1 ? ':' : 's:')) + '\n\t'
            + files.map(e => (e.partner) ? e.name + ' (' + e.partner + ')': e.name).join('\n\t')
        );

        return files;
    }

    // Prepare source code
    _getSessionCode(testFile) {
        let agentCode, deviceCode;

        // [info]
        this._info(c.blue('Using ') + testFile.type + c.blue(' test file ') + testFile.name);

        // triggers device code space usage message, which also serves as revision launch indicator for device
        const reloadTrigger = '// force code update\n"' + randomstring.generate(32) + '"';

        // look in the current test the individual test to run
        let testClass = '';
        let testMethod = '';
        if (this.testCase && this.testCase.length > 0) {
            let tmp = this.testCase.indexOf('.');
            if (tmp >= 0) {
                testMethod = this.testCase.slice(tmp + 1);
                testClass = this.testCase.slice(0, tmp);
            } else {
              testMethod = this.testCase;
            }
        }

        // bootstrap code
        const bootstrapCode = `
// bootstrap tests
imp.wakeup(${this.startupDelay /* prevent log sessions mixing, allow service messages to be before tests output */}, function() {
  local t = ImpUnitRunner();
  t.readableOutput = false;
  t.session = "${this._sessionId}";
  t.timeout = ${parseFloat(this._testConfig.timeout)};
  t.stopOnFailure = ${!!this._testConfig.stopOnFailure};
  t.testClass = "${testClass}";
  t.testCase = "${testMethod}";
  // poehali!
  t.run();
});`
            .trim();

        // quote file name for line control statement
        const quoteFilename = f => f.replace('"', '\\"');
        // backslash to slash
        const backslashToSlash = f => f.replace(/\\/g, "/");

        let tmpFrameworkFile = backslashToSlash(this._testFrameworkFile);
        let agentIncludeOrComment = this._agentSource ? '@include "' + this._agentSource + '"' : '/* no agent source */';
        let deviceIncludeOrComment = this._deviceSource ? '@include "' + this._deviceSource + '"' : '/* no device source */';

        if ('agent' === testFile.type) {
            // <editor-fold defaultstate="collapsed">
            agentCode =
                `@include "${quoteFilename(tmpFrameworkFile)}"

${agentIncludeOrComment}

// tests module
function __module_tests(ImpTestCase) {
@include "${quoteFilename(backslashToSlash(testFile.path))}"
}

// tests bootstrap module
function __module_tests_bootstrap(ImpUnitRunner) {
#line 1 "__tests_bootstrap__"
${bootstrapCode}
}

// resolve modules
__module_tests(__module_impUnit_exports.ImpTestCase);
__module_tests_bootstrap(__module_impUnit_exports.ImpUnitRunner);
`;

            deviceCode =
                `${deviceIncludeOrComment}

${'partnerpath' in testFile ? '@include "' + backslashToSlash(testFile.partnerpath) + '"' : ''}

${reloadTrigger}
`;
            // </editor-fold>
        } else {
            // <editor-fold defaultstate="collapsed">
            deviceCode =
                `@include "${quoteFilename(tmpFrameworkFile)}"

${deviceIncludeOrComment}

// tests module
function __module_tests(ImpTestCase) {
@include "${quoteFilename(backslashToSlash(testFile.path))}"
}

// tests bootstrap module
function __module_tests_bootstrap(ImpUnitRunner) {
#line 1 "__tests_bootstrap__"
${bootstrapCode}
}

// resolve modules
__module_tests(__module_impUnit_exports.ImpTestCase);
__module_tests_bootstrap(__module_impUnit_exports.ImpUnitRunner);

${reloadTrigger}
`;
            agentCode =
                `${agentIncludeOrComment}

${'partnerpath' in testFile ? '@include "' + backslashToSlash(testFile.partnerpath) + '"' : ''}
`;
            // </editor-fold>
        }

        agentCode = this._Builder.machine.execute(agentCode, this.builderVariables);
        deviceCode = this._Builder.machine.execute(deviceCode, this.builderVariables);

        let code2Check = testFile.type == 'agent' ? agentCode : deviceCode;

        if (testClass.length > 0) {
            let klass = "class[ \s]*"+testClass;
            let re = new RegExp(klass, 'g');
            if (code2Check.search(re) < 0) {
                // skip this test
                return null;
            }
        }

        if (testMethod.length > 0) {
            let func = "function[ ]*"+testMethod;
            let re = new RegExp(func, 'g');
            if (code2Check.search(re) < 0) {
                // skip this test
                return null;
            }
        }

        if (this.debug) {
            // FUNCTION: create a new directory and any necessary subdirectories
            let mkdirs = (dirName) => {
                let subDirNAme = path.dirname(dirName);
                if (!fs.existsSync(subDirNAme)) {
                    mkdirs(subDirNAme);
                }
                if (!fs.existsSync(dirName)) {
                    fs.mkdirSync(dirName);
                }
            };

            let tmpFileName = path.resolve('./build', testFile.name);
            let preprocessedFolder = path.dirname(tmpFileName);
            let fileName = path.basename(tmpFileName);
            // create folder to dump preprocessed code
            mkdirs(preprocessedFolder);
            // write dump preprocessed codes
            fs.writeFile(preprocessedFolder + '/preprocessed.agent.' + fileName, agentCode, (err) => {
                if (err) this._error(err);
            });
            fs.writeFile(preprocessedFolder + '/preprocessed.device.' + fileName, deviceCode, (err) => {
                if (err) this._error(err);
            });
        }

        this._debug(c.blue('Agent code size: ') + agentCode.length + ' bytes');
        this._debug(c.blue('Device code size: ') + deviceCode.length + ' bytes');

        return {
            agent: agentCode,
            device: deviceCode
        };
    }

    // Initialize session watchdog timers
    _initSessionWatchdogs() {
        // test messages

        this._sessionTestMessagesWatchdog = new TestWatchdog();
        this._sessionTestMessagesWatchdog.debug = this.debug;
        this._sessionTestMessagesWatchdog.name = 'test-messages';
        this._sessionTestMessagesWatchdog.timeout =
            this.extraTestTimeout + parseFloat(this._testConfig.timeout);

        this._sessionTestMessagesWatchdog.on('timeout', () => {
            this._onError(new TestSession.Errors.SesstionTestMessagesTimeoutError());
            this._session.stop = this._stopSession;
        });

        // session start

        this._sessionStartWatchdog = new TestWatchdog();
        this._sessionStartWatchdog.debug = this.debug;
        this._sessionStartWatchdog.name = 'session-start';
        this._sessionStartWatchdog.timeout = this.sessionStartTimeout;

        this._sessionStartWatchdog.on('timeout', () => {
            this._onError(new TestSession.Errors.SessionStartTimeoutError());
            this._session.stop = this._stopSession;
        });

        this._sessionStartWatchdog.start();
    }

    // Execute test from prepared code
    _runSession(device, testType) {

        return new Promise((resolve, reject) => {

            this._stopSession = false;
            this._initSessionWatchdogs();

            // configure session

            this._session.debug = this.debug;
            this._session.externalCommandsTimeout = parseFloat(this._testConfig.timeout);
            this._session.allowDisconnect = this._testConfig.allowDisconnect;
            this._session.externalCommandsCwd = '.';

            this._session.logParser = new TestLogsParser();
            this._session.logParser.debug = this.debug;

            // set event handlers

            this._session.on('message', (e) => {
                if ('test' === e.type) {
                    this._testLine(e.message);
                } else if ('externalCommandOutput' === e.type) {
                    console.log(e.message);
                } else if ('testInfo' === e.type) /* this.info() in test cases */ {
                    this._testLine(e.message);
                } else {
                    this._info(e.message);
                }
            });

            this._session.on('error', (error) => {
                this._onError(error);
                this._session.stop = this._stopSession;
            });

            this._session.on('warning', (error) => {
                this._warning(c.yellow(error instanceof Error ? error.message : error));
            });

            this._session.on('start', () => {
                this._sessionStartWatchdog.stop();
            });

            this._session.on('testMessage', () => {
                this._sessionTestMessagesWatchdog.reset();
            });

            this._session.on('result', () => {
                this._sessionTestMessagesWatchdog.stop();
            });

            this._session.on('done', () => {
                this._sessionStartWatchdog.stop();
                this._sessionTestMessagesWatchdog.stop();
                resolve();
            });

            this._session.run(
                testType,
                device
            );

        });
    }

    // Handle test error
    _onError(error) {
        var ignoreErrorLog = false;

        this._debug('Error type: ' + error.constructor.name);

        if (error instanceof TestSession.Errors.TestMethodError) {

            this._testLine(c.red('Failure: ' + error.message));
            this._stopSession = this._testConfig.stopOnFailure;

        } else if (error instanceof TestSession.Errors.TestStateError) {

            this._error(error);
            this._stopSession = true;

        } else if (error instanceof TestSession.Errors.SessionFailedError) {

            // do nothing, produced at the end of session anyway

        } else if (error instanceof TestSession.Errors.DeviceDisconnectedError) {

            this._testLine(c.red(error.message));
            this._stopSession = !this._testConfig.allowDisconnect;

        } else if (error instanceof TestSession.Errors.DeviceRuntimeError) {

            ignoreErrorLog = true;
            this._testLine(c.red(error.message));
            this._stopSession = false;

        } else if (error instanceof TestSession.Errors.AgentRuntimeError) {

            ignoreErrorLog = true;
            this._testLine(c.red(error.message));
            this._stopSession = false;

        } else if (error instanceof TestSession.Errors.DeviceError) {

            this._testLine(c.red(error.message));
            this._stopSession = true;

        } else if (error instanceof TestSession.Errors.DevicePowerstateError) {

            this._error(error.message);
            this._stopSession = true;
            this._stopDevice = true;

        } else if (error instanceof TestSession.Errors.SessionStartTimeoutError) {

            this._error(error.message);
            this._stopSession = true;

        } else if (error instanceof TestSession.Errors.SesstionTestMessagesTimeoutError) {

            this._error(error.message);

            // tool-side timeouts are longer than test-side, so they
            // indicate for test session to become unresponsive,
            // so it makes sense to stop it
            this._stopSession = true;

        } else if (error instanceof TestSession.Errors.ExternalCommandTimeoutError) {

            this._error(error.message);
            this._stopSession = true;

        } else if (error instanceof TestSession.Errors.ExternalCommandExitCodeError) {

            this._error(error.message);
            this._stopSession = true;

        } else if (error instanceof Error) {

            this._error(error.message);
            this._stopSession = true;

        } else {

            this._error(error);
            this._stopSession = true;

        }

        if (this._session && !ignoreErrorLog) {
            this._session.error = true;
        }

        // abort completely?
        // _stopSession==true means the error is
        // big enough to interrupt the session.
        // in combination w/stopOnFailure it makes sense
        // to abort the entire testing
        if ((this._stopDevice || this._stopSession) && this._testConfig.stopOnFailure) {
            this._stopCommand = true;
        }

        // command has not succeeded
        if (!ignoreErrorLog)
          this._success = false;
    }

    // Configure and return an instance of Builder
    get _Builder() {
        if (!this.__Builder) {
            this.__Builder = new Builder();
            this.__Builder.logger = {
                debug: function () {
                },
                info: function () {
                },
                warning: this._warning,
                error: this._error
            };
            this.__Builder.machine.generateLineControlStatements = true;
            if (this.githubUser && this.githubToken) {
                this.__Builder.machine.readers.github.username = this.githubUser;
                this.__Builder.machine.readers.github.token = this.githubToken;
            }
            // command line option has higher priority than config option
            this.__Builder.machine.useCache = this.builderCache != null ? (this.builderCache == true) : (this._testConfig.builderCache == true);
        }
        return this.__Builder;
    }

    // Print blank line
    _blank() {
        console.log('');
    }

    // Log message
    _log(type, colorFn, params) {
        let dateMessage = '';

        if (this._logTiming) {
            const now = new Date();
            //dateMessage = dateformat(now, 'HH:MM:ss.l');

            if (this._lastLogDate && this._logStartDate) {
                let dif1 = (now - this._logStartDate) / 1000;
                let dif2 = (now - this._lastLogDate) / 1000;
                dif1 = sprintf('%.2f', dif1);
                dif2 = sprintf('%.2f', dif2);
                dateMessage += '+' + dif1 + '/' + dif2 + 's ';
            } else {
                this._logStartDate = now;
            }

            this._lastLogDate = now;
        }

        // convert params to true array (from arguments)
        params = Array.prototype.slice.call(params);
        params.unshift(colorFn('[' + dateMessage + type + ']'));
        console.log.apply(this, params);
    }

    // Log info message
    _info() {
        this._log('info', c.grey, arguments);
    }

    // Log warning message
    _warning() {
        this._log('warning', c.yellow, arguments);
    }

    // Error message
    _error(error) {
        if (error instanceof Error) {
            error = error.message;
        }

        this._log('error', c.red, [c.red(error)]);
    }

    // Print [test] message
    _testLine() {
        this._log('test', c.grey, arguments);
    }

    get logTiming() {
        return this._logTiming;
    }

    set logTiming(value) {
        this._logTiming = value;
    }

    get testFrameworkFile() {
        return this._testFrameworkFile;
    }

    set testFrameworkFile(value) {
        this._testFrameworkFile = value;
    }

    get testCase() {
        return this._testCaseFile;
    }

    set testCase(value) {
        this._testCaseFile = value;
    }

    get startupDelay() {
        return this._startupDelay === undefined ? DEFAULT_STARTUP_DELAY : this._startupDelay;
    }

    set startupDelay(value) {
        this._startupDelay = value;
    }

    get sessionStartTimeout() {
        return this._sessionStartTimeout === undefined ? DEFAULT_STARTUP_TIMEOUT : this._sessionStartTimeout;
    }

    set sessionStartTimeout(value) {
        this._sessionStartTimeout = value;
    }

    get extraTestTimeout() {
        return this._extraTestTimeout === undefined ? DEFAULT_EXTRA_TEST_MESSAGE_TIMEOUT : this._extraTestTimeout;
    }

    set extraTestTimeout(value) {
        this._extraTestTimeout = value;
    }

    get githubUser() {
        return this._githubUser;
    }

    set githubUser(value) {
        this._githubUser = value;
    }

    get githubToken() {
        return this._githubToken;
    }

    set githubToken(value) {
        this._githubToken = value;
    }

    get builderVariables() {
        return this._builderVariables;
    }

    set builderVariables(value) {
        this._builderVariables = value;
    }

    get builderCache() {
        return this._builderCache;
    }

    set builderCache(value) {
        this._builderCache = value;
    }

    get selectedTest() {
        return this._selectedTest;
    }

    set selectedTest(value) {
        this._selectedTest = value;
    }
}

module.exports = TestHelper;

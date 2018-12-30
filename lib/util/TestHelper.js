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
const ImpCentralApi = require('imp-central-api');

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

        this._testFailures = [];
        this._testMethod = null;
        this._testFile = null;
        this._tests = 0;
        this._assertions = 0;
        this._failures = 0;

        TestDebugMixin.call(this);
        this._init(options);

        c.enabled = UserInteractor.isOutputLevelInfoEnabled();
    }

    get success() {
        return this._success;
    }

    _init(options) {
        this.testFrameworkFile = __dirname + '/../impUnit/index.nut';
        this.logTiming = true; // enable log timing

        if (this._testConfig.githubConfig !== undefined) {
            const githubConfig = new GithubConfig(this._testConfig.githubConfig);
            if (this._checkConfig(githubConfig)) {
                this.githubUser = githubConfig.githubUser;
                this.githubToken = githubConfig.githubToken;
            }
        }
        if (!this.githubUser || !this.githubToken) {
            // github credentials in env vars
            this.githubUser = process.env['GITHUB_USER'];
            this.githubToken = process.env['GITHUB_TOKEN'];
        }

        if (this._testConfig.builderConfig !== undefined) {
            const builderConfig = new BuilderConfig(this._testConfig.builderConfig);
            if (this._checkConfig(builderConfig)) {
                this.builderVariables = builderConfig._json;
            }
        }
        if (options.tests !== undefined) {
            this.selectedTest = options.tests;
        }
        this.debug = UserInteractor.isOutputLevelDebugEnabled();
    }

    _checkConfig(config) {
        if (config.exists()) {
            return true;
        }
        else {
            UserInteractor.printInfo(UserInteractor.MESSAGES.NO_CONFIG_MSG, config.type, config.fileName);
            return false;
        }
    }

    runTests() {
        this._info(Util.format(UserInteractor.MESSAGES.TEST_STARTED_AT, dateformat(new Date(), 'dd mmm yyyy HH:MM:ss Z')));
        const testFiles = this._findTestFiles();
        this._initSourceCode();
        return new Device().listByDeviceGroup(this._deviceGroup.id).then((devices) => {
            this._devices = devices;
            if (devices.length === 0) {
                return Promise.reject(new Errors.ImptError(UserInteractor.MESSAGES.DG_NO_DEVICES, this._deviceGroup.identifierInfo));
            }
            return Promise.resolve();
        }).then(() => testFiles.reduce(
            (acc, testFile) => acc.then(() => {
                if (this._stopCommand) {
                    return Promise.resolve();
                }
                return this._runTestOnDeviceGroup(testFile);
            }),
            Promise.resolve())).then(() => {
                if (this._stopCommand) {
                    this._debug(UserInteractor.MESSAGES.TEST_STOP);
                }
                return Promise.resolve();
            }).then(() => {
                this._blank();
                this._info(UserInteractor.MESSAGES.TEST_SUMMARY_HEADER);
                this._blank();
                this._testFailures.forEach((item, index) => {
                    this._info(Util.format(UserInteractor.MESSAGES.TEST_SUMMARY_FAILURE, index + 1, item.test));
                    this._info(Util.format(UserInteractor.MESSAGES.TEST_SUMMARY_AT, item.file));
                    this._info(Util.format(UserInteractor.MESSAGES.TEST_SUMMARY_ERROR, item.result));
                    this._blank();
                });
                this._info(Util.format(UserInteractor.MESSAGES.TEST_SESSION_RESULT, this._tests, this._assertions, this._failures));
                this._info(UserInteractor.MESSAGES.TEST_SUMMARY_FOOTER);
                this._blank();

                if (this._success) {
                    this._info(c.green(UserInteractor.MESSAGES.TEST_SUCCEEDED));
                } else {
                    this._info(c.red(UserInteractor.ERRORS.TEST_FAILED));
                }
            });
    }

    _runTestOnDeviceGroup(testFile) {
        let deviceIndex = 0;
        this._sessionId = randomWords(2).join('-');
        // create agent/device code to run
        const code = this._getSessionCode(testFile);

        if (code == null) {
            this._info(Util.format(UserInteractor.MESSAGES.TEST_SKIP_FILE, testFile.name));
            return Promise.resolve();
        }
        this._info(Util.format(UserInteractor.MESSAGES.TEST_USE_DEVICE_GROUP, this._deviceGroup.name, this._deviceGroup.id));

        return new Build()._createByDeviceGroup(this._deviceGroup, null, code.device, code.agent).then((build) => {
            this._info(Util.format(UserInteractor.MESSAGES.TEST_DEPLOYMENT_CREATED, build.id));
            return this._devices.reduce(
                (acc, device) => acc.then(() => {
                    if (this._stopDevice || this._stopCommand) {
                        return Promise.resolve();
                    }
                    deviceIndex++;
                    this._stopDevice = false;
                    return this._runTestOnDevice(device, deviceIndex, testFile);
                }),
                Promise.resolve());
        }).catch((error) => {
            this._onError(error);
        });
    }

    _runTestOnDevice(device, deviceIndex, testFile) {
        return new Promise((resolve, reject) => {

            // blank line
            this._blank();

            // init test session
            this._session = new TestSession(this._sessionId, this._devices.length > 1 ? deviceIndex : null);
            this._testLine(Util.format(UserInteractor.MESSAGES.TEST_SESSION_START, this._session.name));

            // is test agent-only?
            const testIsAgentOnly = !this._deviceSource && 'agent' === testFile.type;

            if (testIsAgentOnly) {
                this._info(UserInteractor.MESSAGES.TEST_AGENT_ONLY);
            }
            this._info(Util.format(UserInteractor.MESSAGES.TEST_USE_DEVICE,
                device.name ? device.name : '', device.id, deviceIndex, this._devices.length));

            // check online state
            if (!testIsAgentOnly && !device.online) {
                throw new TestSession.Errors.DevicePowerstateError(UserInteractor.ERRORS.TEST_DEVICE_OFFLINE);
            }

            // create agent/device code to run
            const code = this._getSessionCode(testFile);

            if (code == null) {
                this._info(Util.format(UserInteractor.MESSAGES.TEST_SKIP_FILE, testFile.name));
                return Promise.resolve();
            }
            // run test session
            return this._runSession(device, testFile.type, this._deviceGroup)

                // error
                .catch((error) => {
                    this._onError(error);
                })
                .then(() => this._session.destroy())

                // next file
                .then(resolve);
        });
    }

    _initSourceCode() {

        if (undefined === this._agentSource || undefined === this._deviceSource) {

            let sourceFilePath;

            if (this._testConfig.agentFile) {
                sourceFilePath = this._testConfig.agentFile;

                this._info(Util.format(UserInteractor.MESSAGES.TEST_AGENT_SOURCE, sourceFilePath));

                // read/process agent source

                if (!fs.existsSync(sourceFilePath)) {
                    throw new Error(Util.format(UserInteractor.ERRORS.TEST_AGENT_SOURCE_NOT_FOUND, sourceFilePath));
                }

                this._agentSource = sourceFilePath.replace(/\\/g, "/");

            } else {
                this._info(UserInteractor.MESSAGES.TEST_NO_AGENT_SOURCE);
                this._agentSource = false;
            }

            if (this._testConfig.deviceFile) {
                sourceFilePath = this._testConfig.deviceFile;

                this._info(Util.format(UserInteractor.MESSAGES.TEST_DEVICE_SOURCE, sourceFilePath));

                // read/process device source

                if (!fs.existsSync(sourceFilePath)) {
                    throw new Error(Util.format(UserInteractor.ERRORS.TEST_DEVICE_SOURCE_NOT_FOUND, sourceFilePath));
                }

                this._deviceSource = sourceFilePath.replace(/\\/g, "/");

            } else {
                this._info(UserInteractor.MESSAGES.TEST_NO_DEVICE_SOURCE);
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
                let tmp = file.replace(/\.(agent|device)\.test\.nut$/ig, '') + (lastAdded.type == 'agent' ? '.device' : '.agent') + '.nut';
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
            let tmp = this.selectedTest.indexOf(':');
            if (tmp >= 0) {
                this.testCase = this.selectedTest.slice(tmp);
                testFileName = this.selectedTest.slice(0, tmp);
                // windows fix
                testFileName = testFileName.replace(/\\/g, '/');
            }
        }

        for (const searchPattern of searchPatterns) {
            for (const file of glob.sync(searchPattern, { cwd: configCwd })) {
                // TODO: would it better to add the testFileName to the searchPatterns?
                if (testFileName != null && testFileName.length > 0 && file.search(testFileName) < 0) {
                    this._debug(Util.format(UserInteractor.MESSAGES.TEST_SKIP_TEST, file));
                    continue;
                }
                pushFile(file);
            }
        }

        if (files.length === 0) {
            throw new Error(UserInteractor.ERRORS.TEST_NO_FILES_FOUND);
        }

        this._info(Util.format(UserInteractor.MESSAGES.TEST_FILES_FOUND, files.length) + '\n\t'
            + files.map(e => (e.partner) ? e.name + ' (' + e.partner + ')' : e.name).join('\n\t')
        );

        return files;
    }

    // Prepare source code
    _getSessionCode(testFile) {
        let agentCode, deviceCode;

        // save current test file name
        this._testFile = testFile.name;
            
        // [info]
        this._info(Util.format(UserInteractor.MESSAGES.TEST_USE_FILE, testFile.type, testFile.name));

        // triggers device code space usage message, which also serves as revision launch indicator for device
        const reloadTrigger = '// force code update\n"' + randomstring.generate(32) + '"';

        // look in the current test the individual test to run
        // testCase format is [:testCase][::testMethod]
        let testClass = '';
        let testMethod = '';
        if (this.testCase && this.testCase.length > 0) {
            let tmp = this.testCase.lastIndexOf('::');
            if (tmp >= 0) {
                testMethod = this.testCase.slice(tmp + 2);
                testClass = this.testCase.slice(1, tmp);
            } else {
                testClass = this.testCase.slice(1);
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
  t.stopOnFailure = ${!!this._testConfig.stopOnFail};
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
            let klass = "class[ \s]*" + testClass;
            let re = new RegExp(klass, 'g');
            if (code2Check.search(re) < 0) {
                // skip this test
                return null;
            }
        }

        if (testMethod.length > 0) {
            let func = "function[ ]*" + testMethod;
            let re = new RegExp(func, 'g');
            if (code2Check.search(re) < 0) {
                // skip this test
                return null;
            }
        }

        if (this.debug) {
            const Test = require('../Test');

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

            let tmpFileName = path.resolve(Test.DEBUG_MODE_DIR_NAME, testFile.name);
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

        this._debug(Util.format(UserInteractor.MESSAGES.TEST_AGENT_SIZE, agentCode.length));
        this._debug(Util.format(UserInteractor.MESSAGES.TEST_DEVICE_SIZE, deviceCode.length));

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
    _runSession(device, testType, deviceGroup) {

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
                    this._testMethod = e.message;
                    this._testLine(e.message);
                } else if ('externalCommandOutput' === e.type) {
                    this._print(e.message);
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
                this._tests += this._session.tests;
                this._failures += this._session.failures;
                this._assertions += this._session.assertions;
                resolve();
            });

            this._session.run(
                testType,
                device,
                deviceGroup
            );

        });
    }

    // Handle test error
    _onError(error) {
        var ignoreErrorLog = false;

        this._debug(Util.format(UserInteractor.MESSAGES.TEST_ERROR_TYPE, error.constructor.name));

        if (error instanceof TestSession.Errors.TestMethodError) {
            this._testLine(c.red(Util.format(UserInteractor.MESSAGES.TEST_FAILURE, error.message)));
            this._testFailures.push({ file: this._testFile, test: this._testMethod, result: error.message });
            this._stopSession = this._testConfig.stopOnFail;
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
            if (error instanceof ImpCentralApi.Errors.ImpCentralApiError && UserInteractor.isOutputText()) {
                UserInteractor.printImpCentralApiError(error);
            }
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
        if ((this._stopDevice || this._stopSession) && this._testConfig.stopOnFail) {
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
            this.__Builder.machine.useCache = this._testConfig.builderCache == true;
        }
        return this.__Builder;
    }

    // Print blank line
    _blank() {
        if (UserInteractor.isOutputText()) {
            this._print('');
        }
    }

    _print(message) {
        if (UserInteractor.isOutputText()) {
            console.log(message);
        }
    }

    // Log message
    _log(type, colorFn, params) {
        if (!UserInteractor.isOutputText()) {
            return;
        }
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
        if (UserInteractor.isOutputLevelInfoEnabled()) {
            this._log('info', c.grey, arguments);
        }
    }

    // Log warning message
    _warning() {
        if (UserInteractor.isOutputLevelInfoEnabled()) {
            this._log('warning', c.yellow, arguments);
        }
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

    get selectedTest() {
        return this._selectedTest;
    }

    set selectedTest(value) {
        this._selectedTest = value;
    }
}

module.exports = TestHelper;

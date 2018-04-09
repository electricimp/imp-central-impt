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

/**
 * Test session
 *
 * Events:
 *  - message({type, message})
 *  - error(error)
 *  - warning(error)
 *  - start
 *  - testMessage
 *  - result
 *  - done
 */

'use strict';

const c = require('colors');
const syncExec = require('sync-exec');
const EventEmitter = require('events');
const Errors = require('./TestSessionErrors');
const randomWords = require('random-words');
const sprintf = require('sprintf-js').sprintf;
const TestDebugMixin = require('./TestDebugMixin');

class TestSession extends EventEmitter {

    constructor(id, index = null) {
        super();
        TestDebugMixin.call(this);

        this.id = id;
        this._index = index;
        this.state = 'initialized';
    }

    /**
     * Run test session
     *
     * @param {string} testType
     * @param {string} deviceId
     * @param {string} modelId
     * @param {string} deviceCode
     * @param {string} agentCode
     */
    run(testType, device, deviceGroup) {

        this.logParser

            .on('ready', () => {
                // TODO: this is sort of a dirty hack to work the core issue around.
                // The core issue is that if you restart the device, it might result
                // in the agent running the OLD code, while device recieving the new one!
                // This results in intermittent test failures.
                device.assignToDG(deviceGroup);

                // TODO: this doesn't work, so comment it out (temporary?)
                // this._start(device);
            })

            .on('log', (log) => {
                this._handleLog(log);
            })

            .on('error', (event) => {
                this.emit('error', event.error);
            })

            .on('done', () => {
                this.stop = true;
            });

        return this.logParser.parse(testType, device.id);
    }

    /**
     * Start session
     * @param {string} deviceCode
     * @param {string} agentCode
     * @param {string} modelId
     * @param {string} deviceId
     */
    _start(device) {
        device._restart()
            .then(/* device restarted */ () => {
                this._debug(c.blue('Device restarted'));
            })
            .catch((error) => {
                this.emit('error', error);
            });
    }

    /**
     * Finish test session
     */
    _finish() {
        if (this.error) {
            this.emit('message', {
                type: 'info',
                message: c.red('Session ') + this.name + c.red(' failed')
            });
        } else {
            this.emit('message', {
                type: 'info',
                message: c.green('Session ') + this.name + c.green(' succeeded')
            });
        }

        this.emit('done');
    }


    /**
     * Handle log *event* (produced by LogParser)
     *
     * @param {{type, value}} log
     * @private
     */
    _handleLog(log) {

        switch (log.type) {

            case 'AGENT_RESTARTED':
                if (this.state === 'initialized') {
                    // also serves as an indicator that current code actually started to run
                    // and previous revision was replaced
                    this.state = 'ready';
                }
                break;

            case 'DEVICE_CODE_SPACE_USAGE':

                if (this._deviceCodespaceUsage !== log.value) {

                    this.emit('message', {
                        type: 'info',
                        message: c.blue('Device code space usage: ') + sprintf('%.1f%%', log.value)
                    });

                    this._deviceCodespaceUsage = log.value; // avoid duplicate messages
                }

                break;

            case 'DEVICE_OUT_OF_CODE_SPACE':
                this.emit('error', new Errors.DeviceError('Device is out of code space'));
                break;

            case 'DEVICE_OUT_OF_MEMORY':

                this.emit(
                    this.state === 'started' ? 'error' : 'warning',
                    new Errors.DeviceError('Device is out of memory')
                );

                break;

            case 'LASTEXITCODE':

                this.emit(
                    this.state === 'started' ? 'error' : 'warning',
                    new Errors.DeviceError('Device Error: ' + log.value)
                );

                break;

            case 'DEVICE_ERROR':

                this.emit(
                    this.state === 'started' ? 'error' : 'warning',
                    new Errors.DeviceRuntimeError('Device Runtime Error: ' + log.value)
                );

                break;

            case 'AGENT_ERROR':

                this.emit(
                    this.state === 'started' ? 'error' : 'warning',
                    new Errors.AgentRuntimeError('Agent Runtime Error: ' + log.value)
                );

                break;

            case 'DEVICE_CONNECTED':
                break;

            case 'DEVICE_DISCONNECTED':

                if (this.allowDisconnect) {
                    this.emit('message', {
                        type: 'info',
                        message: c.blue('Disconnected. Allowed by config.')
                    });

                    break;
                }

                this.emit(
                    this.state === 'started' ? 'error' : 'warning',
                    new Errors.DeviceDisconnectedError()
                );

                break;

            case 'POWERSTATE':
                // ??? any actions needed?

                this.emit('message', {
                    type: 'info',
                    message: c.blue('Powerstate: ') + log.value
                });

                break;

            case 'FIRMWARE':
                // ??? any actions needed?

                this.emit('message', {
                    type: 'info',
                    message: c.blue('Firmware: ') + log.value
                });

                break;

            case 'IMPUNIT':

                if (log.value.session !== this.id) {
                    // skip messages not from the current session
                    // ??? should an error be thrown?
                    break;
                }

                this.emit('testMessage');

                switch (log.value.type) {

                    case 'SESSION_START':

                        this.emit('start');

                        if (this.state !== 'ready') {
                            throw new Errors.TestStateError();
                        }

                        this.state = 'started';
                        break;

                    case 'TEST_START':

                        if (this.state !== 'started') {
                            throw new Errors.TestStateError();
                        }

                        // status message
                        this.emit('message', {
                            type: 'test',
                            message: log.value.message
                        });

                        break;

                    case 'TEST_FAIL':

                        if (this.state !== 'started') {
                            throw new Errors.TestStateError();
                        }

                        this.emit('error', new Errors.TestMethodError(log.value.message));
                        break;

                    case 'SESSION_RESULT':

                        this.emit('result');

                        if (this.state !== 'started') {
                            throw new Errors.TestStateError();
                        }

                        this.tests = log.value.message.tests;
                        this.failures = log.value.message.failures;
                        this.assertions = log.value.message.assertions;
                        this.state = 'finished';

                        const sessionMessage =
                            `Tests: ${this.tests}, Assertions: ${this.assertions}, ` +
                            `Failures: ${this.failures}`;

                        if (this.failures) {

                            this.emit('message', {
                                type: 'test',
                                message: c.red(sessionMessage)
                            });

                            this.emit('error', new Errors.SessionFailedError('Session failed'));

                        } else {

                            this.emit('message', {
                                type: 'info',
                                message: c.green(sessionMessage)
                            });

                        }

                        this.stop = true;
                        break;

                    case 'TEST_OK':

                        let message;

                        if (typeof log.value.message === 'string') {
                            message = log.value.message;
                        } else {
                            message = JSON.stringify(log.value.message);
                        }

                        this.emit('message', {
                            type: 'test',
                            message: null !== log.value.message
                                ? (c.green('Success: ') + message)
                                : c.green('Success')
                        });

                        break;

                    case 'EXTERNAL_COMMAND':

                        // run command

                        this.emit('message', {
                            type: 'info',
                            message: c.blue('Running external command ') + log.value.message.command
                        });

                        let res;

                        try {

                            const env = JSON.parse(JSON.stringify(process.env));

                            // remove blocked env vars
                            if (this.externalCommandsBlockedEnvVars) {
                                for (const blokedVarName of this.externalCommandsBlockedEnvVars) {
                                    delete env[blokedVarName];
                                }
                            }

                            res = syncExec(log.value.message.command, this.externalCommandsTimeout * 1000, {
                                cwd: this.externalCommandsCwd,
                                env
                            });

                            // debug command result
                            this._debug(c.blue('External command STDOUT'), res.stdout);
                            this._debug(c.blue('External command STDERR'), res.stderr);
                            this._debug(c.blue('External command exit code'), res.satus);

                            // output command STDOUT

                            let out = res.stdout;
                            out = res.stdout;

                            out = out.toString().trim().split(/\n|\r\n/).map(v => '> ' + v).join('\n');

                            this.emit('message', {
                                type: 'externalCommandOutput',
                                message: c.cyan(out)
                            });

                            // check exit code
                            if (res.status !== 0) {
                                throw new Errors.ExternalCommandExitCodeError(`External command failed with exit code ${res.status}`);
                            }
                        } catch (e) {
                            if (e.message === 'Timeout') {
                                throw new Errors.ExternalCommandTimeoutError();
                            } else {
                                throw e;
                            }
                        }

                        break;

                    // this.info() from test case
                    case 'INFO':

                        this.emit('message', {
                            type: 'testInfo',
                            message: c.cyan(JSON.stringify(log.value.message.message))
                        });

                        break;

                    default:
                        break;
                }

                break;

            default:

                this.emit('message', {
                    type: 'info',
                    message: c.blue('Message of type ') + log.value.type + c.blue(': ') + log.value.message
                });

                break;
        }
    }

    set allowDisconnect(value) {
        this._allowDisconnect = value;
    }

    get allowDisconnect() {
        return this._allowDisconnect;
    }

    get name() {
        let name = this._id;
        if (this._index !== null) {
            name += '-' + this._index;
        }
        return name;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get state() {
        return this._state;
    }

    set state(value) {
        this._state = value;
    }

    get failures() {
        return this._failures || 0;
    }

    set failures(value) {
        this._failures = value;
    }

    get assertions() {
        return this._assertions || 0;
    }

    set assertions(value) {
        this._assertions = value;
    }

    get tests() {
        return this._tests || 0;
    }

    set tests(value) {
        this._tests = value;
    }

    get error() {
        return this._error;
    }

    set error(value) {
        this._error = value;
    }

    get logParser() {
        return this._logParser;
    }

    set logParser(value) {
        this._logParser = value;
    }

    get stop() {
        return this._stop;
    }

    set stop(value) {

        // stop log parser
        if (this.logParser) {
            this.logParser.stop = !!value;
        }

        if (value != /* use weak compare to match null to booleans */ this._stop) {
            this._stop = !!value;

            // finish
            if (this._stop) {
                this._finish();
            }
        }

    }

    get externalCommandsTimeout() {
        return this._externalCommandsTimeout;
    }

    set externalCommandsTimeout(value) {
        this._externalCommandsTimeout = value;
    }

    get externalCommandsCwd() {
        return this._externalCommandsCwd;
    }

    set externalCommandsCwd(value) {
        this._externalCommandsCwd = value;
    }

    get externalCommandsBlockedEnvVars() {
        return this._externalCommandsBlockedEnvVars;
    }

    set externalCommandsBlockedEnvVars(value) {
        this._externalCommandsBlockedEnvVars = value;
    }
}

module.exports = TestSession;
module.exports.Errors = Errors;

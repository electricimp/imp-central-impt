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
 * Watchdog timer
 */

'use strict';

const Util = require('util');
const TestDebugMixin = require('./TestDebugMixin');
const EventEmitter = require('events');
const UserInteractor = require('./UserInteractor');

class TestWatchdog extends EventEmitter {

    constructor() {
        super();
        TestDebugMixin.call(this);
        this.name = null;
        this.timeout = 0;
        this._timerId = null;
    }

    start() {
        this._timerId = setTimeout(
          this._onTimeout.bind(this),
          this._timeout * 1000
        );

        this._debug(Util.format(UserInteractor.MESSAGES.TEST_WATCHDOG_STARTED, this.name));
    }

    reset() {
        this.stop();
        this.start();
    }

    stop() {
        if (this._timerId) {
          clearTimeout(this._timerId);
          this._timerId = null;
        }

        this._debug(Util.format(UserInteractor.MESSAGES.TEST_WATCHDOG_STOPPED, this.name));
    }

    _onTimeout() {
        this._debug(Util.format(UserInteractor.MESSAGES.TEST_WATCHDOG_TIME_OUT, this.name));
        this.emit('timeout', {name: this.name});
    }

    get timeout() {
        return this._timeout;
    }

    set timeout(value) {
        this._timeout = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }
}

module.exports = TestWatchdog;

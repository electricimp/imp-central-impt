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
 * Session errors
 */

'use strict';

const UserInteractor = require('./UserInteractor');

module.exports.AgentRuntimeError = class AgentRuntimeError extends Error {
    constructor(message, id) {
       super(message, id);
    }
};

module.exports.DeviceDisconnectedError = class DeviceDisconnectedError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.DeviceError = class DeviceError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.DeviceRuntimeError = class DeviceRuntimeError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.SessionFailedError = class SessionFailedError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.TestMethodError = class TestMethodError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.TestStateError = class TestStateError extends Error {
    constructor(message, id) {
        super(message || UserInteractor.ERRORS.TEST_INVALID_SESSION_STATE, id);
    }
};

module.exports.ExternalCommandExitCodeError = class ExternalCommandExitCodeError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.ExternalCommandTimeoutError = class ExternalCommandTimeoutError extends Error {
    constructor(message, id) {
        super(message || UserInteractor.ERRORS.TEST_EXTERNAL_COMMAND_TIMEOUT, id);
    }
};

module.exports.DevicePowerstateError = class DevicePowerstateError extends Error {
    constructor(message, id) {
        super(message, id);
    }
};

module.exports.SessionStartTimeoutError = class SessionStartTimeoutError extends Error {
    constructor(message, id) {
        super(message || UserInteractor.ERRORS.TEST_SESSION_TIMEOUT, id);
    }
};

module.exports.SesstionTestMessagesTimeoutError = class SesstionTestMessagesTimeoutError extends Error {
    constructor(message, id) {
        super(message || UserInteractor.ERRORS.TEST_TIMEOUT, id);
    }
};

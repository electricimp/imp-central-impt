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

module.exports.AgentRuntimeError = class AgentRuntimeError extends Error {
  constructor(message, id) {
    super(message || 'Agent runtime error', id);
  }
};

module.exports.DeviceDisconnectedError = class DeviceDisconnectedError extends Error {
  constructor(message, id) {
    super(message || 'Device disconnected', id);
  }
};

module.exports.DeviceError = class DeviceError extends Error {
  constructor(message, id) {
    super(message || 'Device error', id);
  }
};

module.exports.DeviceRuntimeError = class DeviceRuntimeError extends Error {
  constructor(message, id) {
    super(message || 'Device runtime error', id);
  }
};

module.exports.SessionFailedError = class SessionFailedError extends Error {
  constructor(message, id) {
    super(message || 'Session failed', id);
  }
};

module.exports.TestMethodError = class TestMethodError extends Error {
  constructor(message, id) {
    super(message || 'Test method failed', id);
  }
};

module.exports.TestStateError = class TestStateError extends Error {
  constructor(message, id) {
    super(message || 'Invalid test session state', id);
  }
};

module.exports.ExternalCommandExitCodeError = class ExternalCommandExitCodeError extends Error {
  constructor(message, id) {
    super(message || 'External command failed', id);
  }
};

module.exports.ExternalCommandTimeoutError = class ExternalCommandTimeoutError extends Error {
  constructor(message, id) {
    super(message || 'External command timed out', id);
  }
};

module.exports.DevicePowerstateError = class DevicePowerstateError extends Error {
  constructor(message, id) {
    super(message || 'Device is in the wrong powerstate', id);
  }
};

module.exports.SessionStartTimeoutError = class SessionStartTimeoutError extends Error {
  constructor(message, id) {
    super(message || 'Session startup timeout', id);
  }
};

module.exports.SesstionTestMessagesTimeoutError = class SesstionTestMessagesTimeoutError extends Error {
  constructor(message, id) {
    super(message || 'Testing timeout', id);
  }
};

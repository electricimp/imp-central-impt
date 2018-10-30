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

exports.username = process.env.IMPT_USER_NAME;
exports.password = process.env.IMPT_USER_PASSWORD;
exports.devices = process.env.IMPT_DEVICE_IDS ? process.env.IMPT_DEVICE_IDS.split(',') : [];

// output modes for run tests in addition to default mode  
exports.outputModes = process.env.IMPT_OUTPUT_MODES ? process.env.IMPT_OUTPUT_MODES.split(',') : [];

// not mandatory variables
exports.debug = process.env.IMPT_DEBUG === 'true' || process.env.IMPT_DEBUG === '1';
exports.apiEndpoint = process.env.IMPT_ENDPOINT;
exports.githubUser = process.env.IMPT_GITHUB_USER;
exports.githubToken = process.env.IMPT_GITHUB_TOKEN;
exports.deviceidx = process.env.IMPT_DEVICE_IDX ? process.env.IMPT_DEVICE_IDX : 0;
exports.suffix = process.env.IMPT_SUFFIX ? `_${process.env.IMPT_USER_ID.slice(0,8)}_${process.env.IMPT_SUFFIX}` : `_${process.env.IMPT_USER_ID.slice(0,8)}`;
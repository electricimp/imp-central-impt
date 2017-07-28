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

const UserInteractor = require('./UserInteractor');
const Errors = require('./Errors');
const FS = require('fs');

// Helper class for File I/O operations and other utility methods
class Utils {
    static readFileSync(fileName) {
        try {
            if (FS.existsSync(fileName)) {
                return FS.readFileSync(fileName).toString();
            }
        } catch (error) {
            UserInteractor.processError(new Errors.FileError(fileName, error.message));
        }
        return null;
    }

    static readFile(fileName) {
        return new Promise((resolve, reject) => {
            FS.readFile(fileName, (error, data) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        reject(new Errors.FileError(fileName, 'file not found'));
                    }
                    else {
                        reject(new Errors.FileError(fileName, error.message));
                    }
                }
                else {
                    resolve(data.toString());
                }
            });
        });
    }

    static deleteFile(fileName) {
        return new Promise((resolve, reject) => {
            FS.unlink(fileName, (error) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        // file doesn't exist
                        resolve();
                    }
                    reject(new Errors.FileError(fileName, error.message));
                }
                resolve();
            });
        });
    }

    static writeFile(fileName, content) {
        return new Promise((resolve, reject) => {
            FS.writeFile(fileName, content || '', (error) => {
                if (error) {
                    reject(new Errors.FileError(fileName, error.message));
                }
                resolve();
            });
        });
    }

    static create(fileName) {
        return new Promise((resolve, reject) => {
            FS.open(fileName, 'wx', (error, fd) => {
                if (error) {
                    reject(new Errors.FileError(fileName, error.message));
                }
                else {
                    FS.close(fd, function (error) {
                        if (error) {
                            reject(new Errors.FileError(fileName, error.message));
                        }
                        resolve();
                    });
                }
            });
        });
    }

    static existsFileSync(fileName) {
        try {
            return FS.existsSync(fileName);
        } catch (error) {
            UserInteractor.processError(new Errors.FileError(fileName, error.message));
        }
        return true;
    }
}

module.exports = Utils;

'use strict';

const Colors = require('colors/safe');

class JsonFormatter {
    constructor(options) {
        options = options || {};
        options.emptyArrayMsg = options.emptyArrayMsg || '-';
        options.keysColor = options.keysColor || 'green';
        options.dashColor = options.dashColor || 'green';
        options.defaultIndentation = options.defaultIndentation || 2;
        options.noColor = options.noColor || null;
        options.valueColor = options.valueColor || null;
        options.noAlign = options.noAlign || null;
        if (options.inlineArrays === undefined) {
            options.inlineArrays = true;
        }

        this._options = options;
    }

    render(data, indentation = 0) {
        return this._renderToArray(data, indentation).join('\n');
    }

    _renderToArray(data, indentation) {
        if (this._isSerializable(data, false)) {
            return [this._indent(indentation) + this._addColorToData(data)];
        }

        // Unserializable string means it's multiline
        if (typeof data === 'string') {
            return [
                this._indent(indentation) + '"""',
                this._indentLines(data, indentation + this._options.defaultIndentation),
                this._indent(indentation) + '"""'
            ];
        }

        if (Array.isArray(data)) {
            // If the array is empty, render the `emptyArrayMsg`
            if (data.length === 0) {
                return [this._indent(indentation) + this._options.emptyArrayMsg];
            }

            var outputArray = [];

            data.forEach((element) => {
                var line = this._indent(indentation);

                // If the element of the array is a string, bool, number, or null
                // render it in the same line
                if (this._isSerializable(element, false)) {
                    line += this._renderToArray(element, 0)[0];
                    outputArray.push(line);
                }
                else {
                    // If the element is an array or object, render it in next line
                    outputArray.push.apply(
                        outputArray,
                        this._renderToArray(
                            element, indentation
                        )
                    );
                }
            });

            return outputArray;
        }

        if (data instanceof Error) {
            return this._renderToArray(
                {
                    message: data.message,
                    stack: data.stack.split('\n')
                },
                indentation
            );
        }

        // If values alignment is enabled, get the size of the longest index
        // to align all the values
        var maxIndexLength = this._options.noAlign ? 0 : this._getMaxIndexLength(data);
        var key;
        var output = [];

        Object.getOwnPropertyNames(data).forEach((i) => {
            // Prepend the index at the beginning of the line
            key = (i + ': ');
            if (!this._options.noColor) {
                key = Colors[this._options.keysColor](key);
            }
            key = this._indent(indentation) + key;

            // Skip `undefined`, it's not a valid JSON value.
            if (data[i] === undefined) {
                return;
            }

            // If the value is serializable, render it in the same line
            if (this._isSerializable(data[i], false)) {
                var nextIndentation = this._options.noAlign ? 0 : maxIndexLength - i.length;
                key += this._renderToArray(data[i], nextIndentation)[0];
                output.push(key);
            } else {
                // If the index is an array or object, render it in next line
                output.push(key);
                output.push.apply(
                    output,
                    this._renderToArray(
                        data[i],
                        indentation + this._options.defaultIndentation
                    )
                );
            }
        });
        return output;
    }

    _indentLines(string, spaces) {
        var lines = string.split('\n');
        lines = lines.map((line) => {
            return this._indent(spaces) + line;
        });
        return lines.join('\n');
    }

    _isSerializable(input, onlyPrimitives) {
        if (typeof input === 'boolean' ||
            typeof input === 'number' ||
            typeof input === 'function' ||
            input === null ||
            input instanceof Date) {
            return true;
        }
        if (typeof input === 'string' && input.indexOf('\n') === -1) {
            return true;
        }

        if (this._options.inlineArrays && !onlyPrimitives) {
            if (Array.isArray(input) && this._isSerializable(input[0], true)) {
              return true;
            }
        }

        return false;
    }

    _addColorToData(input) {
        if (this._options.noColor) {
            return input;
        }

        if (this._isSerializable(input, true)) {
            return this._options.valueColor ? Colors[this._options.valueColor](input) : input;
        }

        var sInput = input + '';

        if (Array.isArray(input)) {
            return input.join(', ');
        }

        return sInput;
    }

    _indent(numSpaces) {
        return new Array(numSpaces + 1).join(' ');
    }

    // Gets the string length of the longer index in a hash
    _getMaxIndexLength(input) {
        var maxWidth = 0;

        Object.getOwnPropertyNames(input).forEach((key) => {
            // Skip undefined values.
            if (input[key] === undefined) {
                return;
            }

            maxWidth = Math.max(maxWidth, key.length);
        });
        return maxWidth;
    }
}

module.exports = JsonFormatter;

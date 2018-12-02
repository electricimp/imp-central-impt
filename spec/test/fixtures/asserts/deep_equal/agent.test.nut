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

class TestCaseDeepEqualAsserts extends ImpTestCase {
    function testMissingSlot() {
        assertDeepEqual(
            /* expected */
            { "a": 1, "b": { "c": 3 } },
            /* actual */
            { "a": 1, "b": {} }
        );
    }

    function testExtraSlot() {
        assertDeepEqual(
            /* expected */
            { "a": 1, "b": { "c": 3 } },
            /* actual */
            { "a": 1, "b": { "c": 3, "d": 4 } }
        );
    }

    function testNotEqual() {
        assertDeepEqual(
            /* expected */
            { "a": 1, "b": { "c": 3 } },
            /* actual */
            { "a": 1, "b": { "c": 100 } }
        );
    }

    function testEqual() {
        assertDeepEqual(
            /* expected */
            { "a": 1, "b": { "c": 3 } },
            /* actual */
            { "a": 1, "b": { "c": 3 } }
        );
    }    
}

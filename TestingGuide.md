# impt Testing Guide

This additional guide is intended for developers and testers who use the impt tool to test IMP libraries or other IMP code by unit tests which are created with the [*impUnit*](https://github.com/electricimp/impUnit) test framework. The impt tool supersedes the [previous version of impTest](https://github.com/electricimp/impTest) and includes it as a part of the impt now.

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

Table Of Contents:
- [What is New](#what-is-new)
- [Overview](#overview)
- [Writing Tests](#writing-tests)
  - [Main Rules and Steps](#main-rules-and-steps)
  - [Tests for Bi-directional Device-Agent Communication](#tests-for-bi-directional-device-agent-communication)
  - [Asynchronous Testing](#asynchronous-testing)
  - [Builder Usage](#builder-usage)
  - [External Commands](#external-commands)
  - [Assertions](#assertions)
  - [Diagnostic Messages](#diagnostic-messages)
  - [A Test Case Example](#a-test-case-example)
- [Using Tests](#using-tests)
  - [Device Group](#device-group)
  - [Test Configuration](#test-configuration)
  - [GitHub Credentials](#github-credentials)
  - [Running Tests](#running-tests)
  - [Running Selective Tests](#running-selective-tests)
  - [Debug Mode](#debug-mode)
  - [Cleaning Up](#cleaning-up)

## What is New

The main differences to the [previous version](https://github.com/electricimp/impTest):

- impTest is working via the [Electric Imp impCentral&trade; API](https://apidoc.electricimp.com).
- Model is replaced by the new impCentral API entity - Device Group.
- individual Devices are not specified. All Devices assigned to the specified Device Group are used for tests running.
- impTest is a part of the impt tool.
- impTest does not have a separate installation. It is installed as a part ot the impt tool.
- impTest does not have a separate authentication. The impt tool's authentication is used.
- impTest commands are re-designed and follows the general syntax and design of the impt tool commands.
- impTest commands are less interactive, all settings are specified as command's options.

## Overview

This guide contains two main parts:
- explanation of how to [write tests](#writing-tests).
- explanation of how to [use tests: configure and run](#using-tests).

The main terms:

### Test File, Test Case, Test Method

Test file is a file with test cases.

Test case is a class inherited from the *ImpTestCase* class defined by the [*impUnit*](https://github.com/electricimp/impUnit) framework. There can be several test cases in a test file. 

Test method (or simply called a test) is a method of test case. It is prefixed by *test*, eg. *testEverythingOk()*. There can be several test methods (tests) in a test case.

Every test may be uniquely identified or specified by the corresponding test file name, test case name and test method name.

### Test Project, Test Configuration, Test Project Home

Test project is an artificial entity which combines test files intended to test an IMP library or other IMP code. One test project is defined by one test configuration.

Test configuration is represented by [Test Configuration File](./CommandsManual.md#test-configuration-file). It defines the test files which are included into the test project, impCentral Device Group which is used to run the tests, source file(s) with the IMP library/code which is going to be tested and other settings required for the tests building and running.

There may be one and only one [Test Configuration File](./CommandsManual.md#test-configuration-file) in a directory. Subdirectories may contain Test Configuration Files as well but it is not recommended.

Test home is a directory where [Test Configuration File](./CommandsManual.md#test-configuration-file) exists. All files located in the test project home and all its subdirectories are considered as test files of the corresponding test project if their names match the patterns specified in the test configuration.

Note, test project has no any relation to development Project described in the [impt Development Guide](./DevelopmentGuide.md). Both [Project File](./CommandsManual.md#project-file) and [Test Configuration File](./CommandsManual.md#test-configuration-file) may coexist fully independently in a one directory.

### Test Commands

The impt tool has a dedicated group of commands which operate with test projects - [Test Commands](./CommandsManual.md#test-commands). For a particular test project the commands should be called from the test project home.

Other impt commands may also be needed during a testing process. For example, commands to assign devices to Device Group.

### Test Session

Test session is a run of a set of tests from one test file on one device. That may be all tests from all test cases of the test file or a subset of all tests in the test file. Running the same set of tests on another device is another test session.

Test session is considered failed if at least one test fails.

## Writing Tests

### Main Rules and Steps

The main steps you need to perform in order to write tests:

1. Define a structure of your test files and test cases. It fully depends on design of your tests and on the functionality you are testing.

  - You may combine all test cases in one test file or divide them by different test files.
  - You may combine all test files in one directory or put some or all files into subdirectories. A test project can include test files from the test project home and all it's subdirectories.

2. Define names of your test files. In general, a test file may have any name but should follow few rules:

  - A file is treated as test file for IMP agent if `agent` is present in the file name. Otherwise, the file is treated as test file for IMP device.
  - By default, all test cases from a test file run either on IMP device or on IMP agent. If your test cases are intended to run on both the IMP device and its IMP agent, there is a way to organize this which is described [here](#tests-for-bi-directional-device-agent-communication).
  - A test configuration has a pattern for location and names of the test files included into the test project. You specifies this pattern during [test configuration creation or updating](#test-configuration). You should have this in mind when naming your test files.
  - Note, the files are chosen for execution by the tool in an arbitrary order.

3. Add test cases into your test files.

  - Test case is a class inherited from the *ImpTestCase* class defined by the [*impUnit*](https://github.com/electricimp/impUnit) framework.
  - A test file may have several test cases.
  - There are no rules for test case naming. But there is a feature of the [running selective tests](#running-selective-tests). You may have it in mind when naming your test cases. Test cases may have identical names if they are in different test files.
  - Note, the test cases from one test file are chosen for execution by the tool in an arbitrary order.

4. Add and implement test methods (tests) in your test cases.

  - Every test method name should start with `test`. There are no other rules for test method naming. But there is a feature of the [running selective tests](#running-selective-tests). You may have it in mind when naming your test methods. Test methods may have identical names if they are in different test cases.
  - A test case may have several test methods (tests).
  - Additionally, any test case may have *setUp()* and *tearDown()* methods:
    - if exists, *setUp()* is called by the tool before any other methods of the test case. It may be used to perform the environment setup before execution the tests of the test case.
    - if exists, *tearDown()* is called by the tool after all other methods of the test case. It may be used to clean-up the environment after execution the tests of the test case.
  - Note, all other test methods of one test case are chosen for execution by the tool in an arbitrary order. I.e. your tests should be independent and do not assume any particular order of execution.

A test method may be designed as synchronous (by default) or [asynchronous](#asynchronous-testing).

You can use [*Builder*](https://github.com/electricimp/Builder) language in your tests. See more details [here](#builder-usage).

A test file must not contain any `#require` statement. Instead, an [include from GitHub](#include-from-github) should be used.

The tests may call external (a host operating system) commands. See more details [here](#external-commands).

[Assertions](#assertions) and [diagnostic messages](#diagnostic-messages) are available in your tests.

*Example of a simple Test Case:*

```squirrel
class MyTestCase extends ImpTestCase {
    function testAssertTrue() {
        this.assertTrue(true);
    }

    function testAssertEqual() {
        this.assertEqual(1000 * 0.01, 100 * 0.1);
    }
}
```

### Tests for Bi-directional Device-Agent Communication

It is possible to test an interaction between IMP device and IMP agent by emulating one of the sides of the interaction.

A test file is intended to test either IMP device or IMP agent side. The opposite side is emulated by a partner file. There are several rules:
- A partner file must not contain any test cases. It should contain the IMP code needed for the emulation of interaction only.
- The test file and the partner file should be located in the same directory.
- The test file and the partner file should have similar names according to the following pattern: `TestFileName.(agent|device)[.test].nut`:
  - The both files should have the same `TestFileName` prefix and the same `.nut` suffix.
  - The file intended for IMP device should contain `.device` in the name, the file intended for IMP agent should contain `.agent` in the name.
  - The test file should contain `.test` in the name, the partner file must not contain that in the name.
  - For example, `"Test1.agent.test.nut"` (a test file with test cases for IMP agent side) and `"Test1.device.nut"` (the corresponding partner file with emulation of IMP device side).

Note, it is enough that only the test file is selected for the run, i.e. satisfies the test file search pattern defined during [test configuration creation or updating](#test-configuration). The corresponding partner file will be added to the test session automatically.

*Example of a test file / partner file pair:*

Test file `"Test1.agent.test.nut"`:
```squirrel
class MyTestCase extends ImpTestCase {
    _myVar = null;

    function setUp() {
        device.on("data", function(data) {
            _myVar = data;
        }.bindenv(this));
    }

    function testMe() {
        local myFunc = null;
        return Promise(function(resolve, reject) {
            myFunc = function() {
                if (_myVar == null) {
                    imp.wakeup(1.0, myFunc);
                } else if (_myVar == "Hello from IMP Device") {
                    resolve();
                } else {
                    reject();
                }
            }.bindenv(this);
            imp.wakeup(1.0, myFunc);
        }.bindenv(this));
    }
}
```

The corresponding partner file `"Test1.device.nut"`:
```squirrel
imp.wakeup(5.0, function() {
    agent.send("data", "Hello from IMP Device");
});
```

### Asynchronous Testing

Every test method, including *setUp()* and *tearDown()*, can be either synchronous (by default) or asynchronous.

A test method should return an instance of [Promise](https://github.com/electricimp/Promise) to notify that it needs to do some work asynchronously. The resolution of the Promise indicates that the test has been passed successfully. The rejection of the Promise denotes a failure.

*Example:*

```squirrel
function testSomethingAsynchronously() {
    return Promise(function (resolve, reject) {
        resolve("It's all good, man!");
    });
}
```

### Builder Usage

#### Builder Language

You can use [*Builder*](https://github.com/electricimp/Builder) language in your tests. It combines a preprocessor with an expression language and advanced imports.

*Example:*

```squirrel
@set assertText = "Failed to assert that values are"

this.assertEqual(
    expected,
    actual,
        "@{assertText}"
        + " equal in '@{__FILE__}'"
        + " at line @{__LINE__}"
    );
```

[*\_\_FILE\_\_* and *\_\_LINE\_\_*](https://github.com/electricimp/Builder#variables) variables are defined in the [Builder](https://github.com/electricimp/Builder), they can be useful for debugging information:

```squirrel
this.assertEqual(
    expected,
    actual,
    "Failed to assert that values are"
        + " equal in '@{__FILE__}'"
        + " at line @{__LINE__}"
);
```

#### Builder Variables

It is possible to define and propagate [custom variables](https://github.com/electricimp/Builder#variables) through a separate configuration file. The syntax of this file is like this:

```
{ "pollServer": "http://example.com",
  "expectedAnswer": "data ready" }
```

It allows the [*Builder*](https://github.com/electricimp/Builder) to process your custom variables used in the source code:

```squirrel
local response = http.get("@{pollServer}", {}).sendsync();
this.assertEqual(
    "@{expectedAnswer}",
    response,
    "Failed to get expected answer"
);
```

You create and manage the file with the [*Builder*](https://github.com/electricimp/Builder) variables manually. You may locate it anywhere. The file is specified during [test configuration creation or updating](#test-configuration).

#### Include From GitHub

Source code / libraries from GitHub may be included in your test files by using the [Builder's include statement](https://github.com/electricimp/Builder#from-github). You should use it instead of the `#require` statement.

For example: `#require "messagemanager.class.nut:2.0.0"` should be replaced with `@include "github:electricimp/MessageManager/MessageManager.class.nut@v2.0.0"`.

There may be some limitations which you can overcome - see [here](#github-credentials).

#### Builder Cache

Builder cache is intended to improve the build time and reduce the number of requests to external resources. It is only possible to cache external libraries. Builder stores the cache in the `.builder-cache` folder inside the test project home. The cache is stored for up to 24 hours.

Builder cache is disabled by default. It can be enabled during [test configuration creation or updating](#test-configuration). Also it is possible to clear the cache when you [run the tests](#running-tests).

### External Commands

A test can call a host operating system command as follows:

```squirrel
// Within the test case/method
this.runCommand("echo 123");
// The host operating system command `echo 123` is executed
```

If the execution timeout (specified during [test configuration creation or updating](#test-configuration)) or the external command exits with a status code other than 0, the test session fails.

### Assertions

The following assertions are available in tests:

#### assertTrue()

`this.assertTrue(condition, [message]);`

Asserts that the condition is truthful.

*Example:*

```squirrel
// OK
this.assertTrue(1 == 1);

// Fails
this.assertTrue(1 == 2);
```

#### assertEqual()

`this.assertEqual(expected, actual, [message])`

Asserts that two values are equal.

*Example:*

```squirrel
// OK
this.assertEqual(1000 * 0.01, 100 * 0.1);

// Failure: Expected value: 1, got: 2
this.assertEqual(1, 2);
```

#### assertGreater()

`this.assertGreater(actual, cmp, [message])`

Asserts that a value is greater than some other value.

*Example:*

```squirrel
// OK
this.assertGreater(1, 0);

// Failure: Failed to assert that 1 > 2
this.assertGreater(1, 2);
```

#### assertLess()

`this.assertLess(actual, cmp, [message])`

Asserts that a value is less than some other value.

*Example:*

```squirrel
// OK
this.assertLess(0, 1);

// Failure: Failed to assert that 2 < 2
this.assertLess(2, 2);
```

#### assertClose()

`this.assertClose(expected, actual, maxDiff, [message])`

Asserts that a value is within some tolerance from an expected value.

*Example:*

```squirrel
// OK
this.assertClose(10, 9, 2);

// Failure: Expected value: 10±0.5, got: 9
this.assertClose(10, 9, 0.5);
```

#### assertDeepEqual()

`this.assertDeepEqual(expected, actual, [message])`

Performs a deep comparison of tables, arrays and classes.

*Example:*

```squirrel
// OK
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 0 }});

// Failure: Missing slot [a.b] in actual value
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "_b" : 0 }});

// Failure: Extra slot [a.c] in actual value
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 1, "c": 2 }});

// Failure: At [a.b]: expected "1", got "0"
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 0 }});
```

#### assertBetween()

`this.assertBetween(actual, from, to, [message])`

Asserts that a value belongs to the range from _from_ to _to_.

*Example:*

```squirrel
// OK
this.assertBetween(10, 9, 11);

// Failure: Expected value in the range of 11..12, got 10
this.assertBetween(10, 11, 12);
```

#### assertThrowsError

`this.assertThrowsError(func, ctx, [args = []], [message])`

Asserts that the _func_ function throws an error when it is called with the _args_ arguments and the _ctx_ context. Returns an error thrown by _func_.

*Example:*

```squirrel
// OK, returns "abc"
this.assertThrowsError(function (a) {
    throw a;
}, this, ["abc"]);

// Failure: Function was expected to throw an error
this.assertThrowsError(function () {
    // Throw "error";
}, this);
```

### Diagnostic Messages

There are three ways to display diagnostic/informational messages to the console from your tests:
- call `this.info(<message>);` from a test method, as many times as you need/want.
- for synchronous tests call `return <return_value>;` from a test method. The returned value will be displayed on the console, if not `null` and the test succeeds. 
- for asynchronous tests call Promise resolution or rejection methods with a value `resolve(<return_value>);` or `reject(<return_value>);`. The returned value will be displayed on the console, if not `null`. 

Examples of tests output are provided in the [running tests section](#running-tests).

### A Test Case Example

The utility file `myFile.nut` contains the following code:

```squirrel

// (optional) Async version, can also be synchronous

function setUp() {
    return Promise(function (resolve, reject) {
        resolve("We're ready");
    }.bindenv(this));
}
```

The Test Case code is as follows:

```squirrel
class TestCase1 extends ImpTestCase {

@include __PATH__+"/myFile.nut"

    // Sync test method
    function testSomethingSync() {
        this.assertTrue(true);    // OK
        this.assertTrue(false);   // Fails
    }

    // Async test method
    function testSomethingAsync() {
        return Promise(function (resolve, reject) {
            // Return in 2 seconds
            imp.wakeup(2 /* 2 seconds */, function() {
                resolve("something useful");
            }.bindenv(this));
        }.bindenv(this));
    }

    // (optional) Teardown method - cleans up after the test
    function tearDown() {
        // Clean-up here
    }
}
```

## Using Tests

### Device Group

To run your tests you need to:
- have IMP device(s) blinked-up to your account.
- have impCentral Device Group.
- assign the needed device(s) to that Device Group.

These are the main steps you should perform in order to prepare your devices and Device Group for testing:

1. Obtain impCentral Product. If you already have/know a Product, notice it's Id or Name. If you do not have a Product, create a new one by [**impt product create**](./CommandsManual.md#product-create) command.

*Example:*  
**TODO** - screenshot   

2. Obtain Device Group. If you already have/know a Device Group, notice it's Id or Name. If you do not have a Device Group, create a new one by [**impt dg create**](./CommandsManual.md#device-group-create) command. You need to specify the Product when creating the Device Group.

Theoretically, you may try to use Device Group of any [type](./CommandsManual#device-group-type). Practically, it is recommended to use Device Group of the *development* type.

*Example:*  
**TODO** - screenshot   

3. Assign one or several devices, on which you plan to run your tests, to the Device Group by [**impt device assign**](./CommandsManual.md#device-assign) command.

*Example:*  
**TODO** - screenshot   

4. Specify the Device Group during [test configuration creation](#test-configuration). Your tests will run on all devices assigned to the Device Group. Note, you can always change the Device Group in the test configuration.

### Test Configuration

Before running the tests you should create test configuration for your test project - call [**impt test create**](./CommandsManual.md#test-create) command from the test project home. If [Test Configuration File](./CommandsManual.md#test-configuration-file) already exists in that directory, it will be deleted (if confirmed by you) and the new configuration will be created from scratch.

The configuration settings include:

- `--dg` - identifier of impCentral [Device Group](#device-group). Your tests will run on all devices assigned to that Device Group. You may specify Device Group by it's Id or Name.

- `--device-file`, `--agent-file` - IMP device / IMP agent source code which is deployed along with the tests. Usually, it is the source code of IMP library or other IMP code which you are planning to test and you specifies one of that options.

- `--test-file` - test file name or pattern which specifies the test file(s) included into your test project. You may repeat this option several times and specify several file names and/or patterns. The values of the repeated option are combined by logical OR. There is a default pattern mentioned in the [command's spec](./CommandsManual.md#test-create).

- `--github-config`- A path to a [github credentials file](#github-credentials). You may need to use it if your test files use [include from GitHub](#include-from-github).

- `--builder-config`- A path to a file with [Builder variables](#builder-variables) You need it only if your tests use Builder variables.

- `--timeout`, `--stop-on-fail`, `--allow-disconnect`, `--builder-cache` - other settings, their meaning and default values are described in the [command's spec](./CommandsManual.md#test-create).

*Example:*  
**TODO** - screenshot   

You may update the test configuration by calling [**impt test update**](./CommandsManual.md#test-update) command. The existing [Test Configuration File](./CommandsManual.md#test-configuration-file) will be updated by the new specified settings. Note, the newly specified `--test-file` option value(s) totally replaces the existed setting.

*Example:*  
**TODO** - screenshot   

You may display the current test configuration by calling [**impt test info**](./CommandsManual.md#test-info) command.

*Example:*  
**TODO** - screenshot   

### GitHub Credentials

It may be needed if your test files use [include from GitHub](#include-from-github).

For unauthenticated requests the GitHub API allows you to make [up to 60 requests per hour](https://developer.github.com/v3/#rate-limiting). This may be not sufficient for intensive test running. To overcome the limitation you can provide GitHub's user credentials. There are two ways to do this:

- Via environment variables - we strongly recommend this way due to the security reasons. You should specify two environment variables:
  - `GITHUB_USER` - GitHub username.
  - `GITHUB_TOKEN` - GitHub password or personal access token.

- Via github credentials file.
  - This file may be created or updated by [**impt test github**](./CommandsManual.md#test-github) command. You specifies GitHub's username and password and they are saved in the specified file. Note, the credentials are saved in a plain text.
  - You may have several github credentials files and they may be located in any places. You specifies a concrete github credentials file during [test configuration creation or updating](#test-configuration). If the specified file exists when you [run the tests](#running-tests), the GitHub's credentials are taken from it. If the specified file does not exist, the GitHub's credentials are taken from the environment variables if they are set.

*Example:*  
**TODO** - screenshot   

### Running Tests

To run the tests of your configured test project call [**impt test run**](./CommandsManual.md#test-run) command from the test project home. The tests will be executed according to your [test configuration](#test-configuration).

By default, the tool searches for all test files according to the file names and/or patterns specified in the [test configuration](#test-configuration). The search starts from the test project home and includes all subdirectories. The tool looks for all test cases in the found files. All test methods in all found test cases are considered as tests for execution. For a particular run you may select a subset of test files, test cases, test methods by specifying `--tests` option. See the details [here](#running-selective-tests).

Every selected test file is a source for build (Deployment). Finally, there are as many different builds as the number of the selected test files for execution. Test files (builds) run in an arbitrary order.

Every test file (build) runs on all devices currently assigned to the Device Group specified in the [test configuration](#test-configuration) one by one - on one device, then on the second one, etc. Devices are chosen in an arbitrary order. A test file (build) running on one device is called a test session. After the build finished on the last device, the next test file (build) starts running on the same set of devices, again one by one.

A build includes the selected set of test cases and tests from a selected test file. It may be all test cases with all tests or a subset of test cases / subset of tests as [defined](#running-selective-tests) by `--tests` option. The selected test cases are executed in an arbitrary order. The selected tests of a test case are executed in an arbitrary order.

Every test is treated as failed if an error has been thrown or a timeout, defined in the [test configuration](#test-configuration), occurs during the test execution. Otherwise the test is treated as passed. If at least one test in a test session fails, the test session is treated as failed. If the [test configuration](#test-configuration) has the `stop-on-fail` setting set to `true`, the whole tests execution is stopped after the first failed test.

You may clear the [Builder cache](#builder-cache) by `--clear-cache` option. The cache, if existed, will be deleted before running the tests. And, if the Builder cache is enabled in the [test configuration](#test-configuration), it will be re-created during the tests running.

You may run the tests in the [debug mode](#debug-mode) by specifying `--debug` option.

*Example:*  
**TODO** - screenshots and explanations for a successfull test execution and several failed test executions

### Running Selective Tests

`--tests <testcase_pattern>` option of the [**impt test run**](./CommandsManual.md#test-run) command allows to select specific test files, test cases, test methods for execution. The syntax of `<testcase_pattern>` is the following `[testFile][:testCase][::testMethod]`, where:

- `testFile` - name of a test file. May include a relative path. May include [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) like `.*`, etc. The specified file(s) will be selected from all files which correspond to the file names and/or patterns defined in the [test configuration](#test-configuration). If `testFile` is ommited, all files, which correspond to the file names and/or patterns defined in the [test configuration](#test-configuration), are assumed.

- `testCase` - name of a test case. Should be fully qualified. Test cases with an identical name may exist in different test files, in this situation all of them will be selected if the files are selected.

- `testMethod` - name of a test method. Should be fully qualified. Test methods with an identical name may exist in different test cases, in this situation all of them will be selected if the cases are selected.

*Example:*

A test file `TestFile1.test.nut` contains:

```squirrel
class MyTestCase extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}

class MyTestCase_1 extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}
```

A test file `TestFile2.test.nut` contains:

```squirrel
class MyTestCase extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}
```

In this case:
- `--tests TestFile1:MyTestCase::testMe` selects the `testMe()` method in the `MyTestCase` case of the `TestFile1.test.nut` file.
- `--tests :MyTestCase::testMe` selects the `testMe()` method in the `MyTestCase` case from the both `TestFile1.test.nut` and `TestFile2.test.nut` files.
- `--tests :MyTestCase_1` selects all test methods from the `MyTestCase_1` case of the `TestFile1.test.nut` file as it is the only file with the specified test case.
- `--tests TestFile2` selects all test methods from the `TestFile2.test.nut` file.
- `--tests ::testMe_1` selects the `testMe_1()` methods in all test cases from the both `TestFile1.test.nut` and `TestFile2.test.nut` files.

### Debug Mode

You may run the tests in the debug mode by specifying `--debug` option of the [**impt test run**](./CommandsManual.md#test-delete) command. It may be useful for analyzing failures. In this mode:
- All communications with the [impCentral API](https://apidoc.electricimp.com) are displayed.
- All communications with the [impUnit test framework](https://github.com/electricimp/impUnit) are displayed.
- IMP device and IMP agent code of all the running builds are stored in the `.build` folder inside the test project home.

*Example:*  
**TODO** - screenshot   

### Cleaning Up

After the testing is finished you may want to clean-up different entities created during your testing.

If you want to delete your test project, call [**impt test delete**](./CommandsManual.md#test-run) command from the test project home. It deletes [Test Configuration File](./CommandsManual.md#test-configuration-file), Builder cache directory and debug information. By specifying additional options you may delete the github credentials file, the file with Builder variables and impCentral API entities (Device Group, Deployments, Product) which were used or created during the testing. See the [command's spec](./CommandsManual.md#test-delete) for the details.

*Example:*  
**TODO** - screenshot   

Alternatively, you may fully delete the Device Group which you used for the testing by calling the [**impt dg delete**](./CommandsManual.md#dg-delete) command as `impt dg delete --dg <DEVICE_GROUP_IDENTIFIER> --builds --force`. It makes a full clean-up of all impCentral entities created during your testing - unassigns all devices from the Device Group, deletes all builds created for the Device Group, deletes the Device Group itself.

*Example:*  
**TODO** - screenshot   

If you only want to unassign the devices from the Device Group, call [**impt dg unassign**](./CommandsManual.md#dg-unassign) or [**impt device unassign**](./CommandsManual.md#device-unassign) commands.

*Example:*  
**TODO** - screenshot   

If you want to delete the Product, call [**impt product delete**](./CommandsManual.md#product-delete) command.

*Example:*  
**TODO** - screenshot   

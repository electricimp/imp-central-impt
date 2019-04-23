# impt Testing Guide #

This additional guide is intended for developers and testers who use *impt* to test Squirrel libraries and code with unit tests which are created using the [*impUnit*](https://github.com/electricimp/impUnit) test framework. *impt* supersedes the [previous version of *impTest*](https://github.com/electricimp/impTest) by integrating a new version of the *impTest* code.

Please read the main [Read Me file](./README.md) first as it covers all the basic *impt* usage and its common components.

The full *impt* tool commands specification is described in the [*impt* Commands Manual](./CommandsManual.md).

## Contents ##

- [What’s New](#whats-new)
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
  - [Test Device Group](#test-device-group)
  - [Test Configuration](#test-configuration)
  - [GitHub Credentials](#github-credentials)
  - [Running Tests](#running-tests)
  - [Running Selective Tests](#running-selective-tests)
  - [Debug Mode](#debug-mode)
  - [Cleaning Up](#cleaning-up)

## What’s New ##

The main differences between *impt* and the legacy tool, [*impTest*](https://github.com/electricimp/impTest):

- *impTest* is now integrated into *impt*.
- *impt* uses the [impCentral™ API](https://apidoc.electricimp.com).
- Individual devices are no longer specified. All Devices assigned to the specified Device Group are used for tests.
- *impTest* commands have been re-designed and follow the general syntax and design of *impt* commands.
- *impTest* commands are less interactive &mdash; all settings are now specified as command options.

## Overview ##

This guide contains two main parts:

- How to [write tests](#writing-tests).
- How to [use tests](#using-tests).

### Terminology ###

A ‘test file’ is a file containing ‘test cases’.

A ‘test case’ is a class based on the *ImpTestCase* class defined by the [*impUnit*](https://github.com/electricimp/impUnit) framework. There can be several test cases in a test file.

A ‘test method’ (or simply called a ‘test’) is one of a test case’s methods. It should be prefixed by *test*, eg. *testEverythingOk()*. There can be several test methods (tests) in a test case.

Every test may be uniquely identified or specified by the corresponding test file name, test case name and test method name.

A ‘test project’ is an entity which combines test files intended to test a Squirrel library or other Squirrel code. Each test project is defined by one ‘test configuration’, which is embodied in a [‘test configuration file’](./CommandsManual.md#test-configuration-files). A test configuration indicates the test files which are part of the test project; the Device Group to which test devices are assigned and the test code deployed; the source file(s) with the Squirrel code which is going to be tested; and other settings required to build and run the tests.

There must be only one [test configuration file](./CommandsManual.md#test-configuration-files) in a directory. Sub-directories may contain test configuration files too but this is not recommended.

The ‘test home’ is the directory where the [test configuration file](./CommandsManual.md#test-configuration-files) is located. All of the files located in the test home and all of its sub-directories are considered as test files belonging to the corresponding test project if their names match the patterns specified in the test configuration.

**Note** The test project entity has no any relation to the development Project entity described in the [*impt* Development Guide](./DevelopmentGuide.md). A [Project file](./CommandsManual.md#project-files) and a [test configuration file](./CommandsManual.md#test-configuration-files) may coexist in the same directory.

A ‘test session’ is a run of a set of tests from one test file on one device. That may include all of the tests from all of the test cases from the test file, or a subset of all the tests in the test file. Running the same set of tests on another device is another test session.

A test session is considered failed if at least one test fails.

### Test Commands ###

*impt* has a dedicated set of commands which operate with test projects, called [test commands](./CommandsManual.md#test-commands). For a particular test project, the commands should be called from the test home.

Other *impt* commands may also be needed during testing, such as commands to assign devices to Device Group.

## Writing Tests ##

### Main Rules And Steps ###

You need to perform the following steps to write your tests:

1. Define the structure of your test files and test cases. This depends entirely on the design of your tests and on the functionality you are testing.

  - You may combine all test cases in one test file or divide them into different test files.
  - You may combine all test files in one directory, or put some or all files into sub-directories. A test project can include test files from the test project home and all its sub-directories.

2. Define the names of your test files. In general, a test file may have any name but should follow a few rules:

  - A file is assumed to contain agent code if `agent` is present in its file name, otherwise it is assumed to contain device code.
  - By default, all the test cases in a test file run either on a device *or* an agent. If your test cases are intended to run on *both* device and agent, please use the approach described [here](#tests-for-bi-directional-device-agent-communication).
  - A test configuration has a pattern for the location and the names of the test files included in the test project. You specify this pattern during [test configuration](#test-configuration). You should have this pattern in mind when you name your test files.
  - The files are chosen for execution by the tool in an arbitrary order.

3. Add test cases to your test files.

  - A test case is a class derived from the *ImpTestCase* class defined by the [*impUnit*](https://github.com/electricimp/impUnit) framework.
  - A test file may have more than one test case.
  - There are no rules for test case naming. Test cases may have identical names if they are in different test files. But bear in mind that [running selective tests](#running-selective-tests) can have an impact on test case naming.
  - The test cases from one test file are chosen for execution by the tool in an arbitrary order.

4. Add test methods (tests) to your test cases.

  - Every test method name should start with *test*. Test methods may have identical names if they are in different test cases. There are no other rules for test method naming, but bear in mind that [running selective tests](#running-selective-tests) can have an impact on test method naming.
  - A test case may have several test methods (tests).
  - Additionally, any test case may have *setUp()* and *tearDown()* methods:
    - If it exists, *setUp()* is called by the tool before any other methods in the test case. It may be used to perform environment setup before test case execution.
    - If it exists, *tearDown()* is called by the tool after all other methods in the test case. It may be used to clean the environment after test case execution.
  - All test methods other than *setUp()* and *tearDown()* in one test case are chosen for execution by the tool in an arbitrary order, ie. your tests should be independent and not assume any particular order of execution.

A test method may be run synchronously (the default) or [asynchronously](#asynchronous-testing).

You can use the [*Builder*](https://github.com/electricimp/Builder) language in your tests; please find further details [here](#builder-usage).

A test file **must not** contain any `#require` statements. Instead, an [include from GitHub](#include-from-github) should be used.

Tests may call external (eg. a host operating system) commands; please find further details [here](#external-commands).

[Assertions](#assertions) and [diagnostic messages](#diagnostic-messages) are also available for your tests.

#### Example ####

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

### Tests For Bi-directional Device-Agent Communication ###

It is possible to test an interaction between device and agent by emulating one side of the interaction.

A test file is intended to test either device or agent code, so the opposite side is emulated by code stored in a ‘partner file’. There are several rules for these:

- A partner file must not contain any test cases. It should only contain the Squirrel code needed to emulate the interaction, eg. the **agent.on()** code that handles messages sent by **device.send()** in your agent code tests.
- The test file and the partner file should be located in the same directory.
- The test file and the partner file should have similar names according to the following pattern: `TestFileName.(agent|device)[.test].nut`:
  - The both files should have the same `TestFileName` prefix and the same `.nut` suffix.
  - The file intended for the device should contain `.device` in the name; the file intended for the agent should contain `.agent` in the name.
  - The test file should contain `.test` in the name; the partner file must not contain `.test` in the name.

For example, `"Test1.agent.test.nut"` (a test file with test cases for agent code) would be partnered with  `"Test1.device.nut"` (the corresponding partner file with emulation of the device side of the interaction).

**Note** It is sufficient that only the test file is selected for the run, ie. it satisfies the test file search pattern defined during [test configuration](#test-configuration). The corresponding partner file will be added to the test session automatically.

#### Example ####

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
                } else if (_myVar == "Hello from the device") {
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
    agent.send("data", "Hello from the dDevice");
});
```

### Asynchronous Testing ###

Every test method, including *setUp()* and *tearDown()*, can be run either synchronously (the default) or asynchronously.

Test methods should return an instance of the [Promise](https://github.com/electricimp/Promise) class if it needs to do some work asynchronously. The resolution of the Promise indicates that the test has been passed. The rejection of the Promise denotes a failure.

#### Example ####

```squirrel
function testSomethingAsynchronously() {
    return Promise(function (resolve, reject) {
        resolve("It's all good, man!");
    });
}
```

### Builder Usage ###

#### The Builder Language ####

You can use the [*Builder*](https://github.com/electricimp/Builder) language in your tests. It combines a preprocessor with an expression language and advanced imports. For example:

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

[*\_\_FILE\_\_* and *\_\_LINE\_\_*](https://github.com/electricimp/Builder#variables) variables are defined by [*Builder*](https://github.com/electricimp/Builder). They can be useful for debugging:

```squirrel
this.assertEqual(
    expected,
    actual,
    "Failed to assert that values are"
        + " equal in '@{__FILE__}'"
        + " at line @{__LINE__}"
);
```

#### Builder Variables ####

It is possible to define and propagate [custom variables](https://github.com/electricimp/Builder#variables) through a separate configuration file. The syntax of this file is:

```
{ "pollServer": "http://example.com",
  "expectedAnswer": "data ready" }
```

This allows [*Builder*](https://github.com/electricimp/Builder) to process custom variables used in the source code:

```squirrel
local response = http.get("@{pollServer}", {}).sendsync();
this.assertEqual(
    "@{expectedAnswer}",
    response,
    "Failed to get expected answer"
);
```

You create and manage the file containing your [*Builder*](https://github.com/electricimp/Builder) variables manually. You may locate it anywhere. The file is specified during [test configuration](#test-configuration).

#### Include From GitHub ####

Source code and libraries from GitHub may be included in your test files by using [*Builder*’s `@include` statement](https://github.com/electricimp/Builder#from-github), which you should use instead of the `#require` statement.

For example: `#require "messagemanager.class.nut:2.0.0"` should be replaced with `@include "github:electricimp/MessageManager/MessageManager.class.nut@v2.0.0"`.

#### Builder Cache ####

*Builder*’s cache is designed to improve the build time and reduce the number of requests issued to external resources. It is only possible to cache external libraries. *Builder* stores the cache in the `.builder-cache` sub-directory inside the test project directory. The cache is maintained for up to 24 hours to prevent library code from becoming stale.

Caching is disabled by default. It can be enabled during [test configuration](#test-configuration). It is possible to clear the cache when you [run the tests](#running-tests).

### External Commands ###

A test can call a host operating system command as follows:

```squirrel
// Within the test case/method
this.runCommand("echo 123");
// The host operating system command `echo 123` is executed
```

If the execution times out (specified during [test configuration](#test-configuration)) or the external command exits with a status code other than 0, the test session fails.

### Assertions ###

The following assertions are available in tests:

#### assertTrue() ####

`this.assertTrue(condition[, message])`

Asserts that the condition is truthful.

#### Example ####

```squirrel
// OK
this.assertTrue(1 == 1);

// Fails
this.assertTrue(1 == 2);
```

#### assertEqual() ####

`this.assertEqual(expected, actual[, message])`

Asserts that two values are equal.

#### Example ####

```squirrel
// OK
this.assertEqual(1000 * 0.01, 100 * 0.1);

// Failure: Expected value: 1, got: 2
this.assertEqual(1, 2);
```

#### assertGreater() ####

`this.assertGreater(actual, cmp[, message])`

Asserts that a value is greater than some other value.

#### Example ####

```squirrel
// OK
this.assertGreater(1, 0);

// Failure: Failed to assert that 1 > 2
this.assertGreater(1, 2);
```

#### assertLess() ####

`this.assertLess(actual, cmp[, message])`

Asserts that a value is less than some other value.

#### Example ####

```squirrel
// OK
this.assertLess(0, 1);

// Failure: Failed to assert that 2 < 2
this.assertLess(2, 2);
```

#### assertClose() ####

`this.assertClose(expected, actual, maxDiff[, message])`

Asserts that a value is within a specified range of an expected value.

#### Example ####

```squirrel
// OK
this.assertClose(10, 9, 2);

// Failure: Expected value: 10±0.5, got: 9
this.assertClose(10, 9, 0.5);
```

#### assertDeepEqual() ####

`this.assertDeepEqual(expected, actual[, message])`

Performs a deep comparison of tables, arrays and classes.

#### Example ####

```squirrel
// OK
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 1 }});

// Failure: Missing slot [a.b] in actual value
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "_b" : 0 }});

// Failure: Extra slot [a.c] in actual value
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 1, "c": 2 }});

// Failure: At [a.b]: expected "1", got "0"
this.assertDeepEqual({"a" : { "b" : 1 }}, {"a" : { "b" : 0 }});
```

#### assertBetween() ####

`this.assertBetween(actual, from, to[, message])`

Asserts that a value belongs to the range from _from_ to _to_.

#### Example ####

```squirrel
// OK
this.assertBetween(10, 9, 11);

// Failure: Expected value in the range of 11..12, got 10
this.assertBetween(10, 11, 12);
```

#### assertThrowsError ####

`this.assertThrowsError(func, ctx[, args][, message])`

Asserts that the function _func_ throws an error when it is called with the arguments _args_ and the context _ctx_. Returns an error thrown by _func_.

#### Example ####

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

### Diagnostic Messages ###

There are three ways to display diagnostic messages in the console from your tests:

- Call `this.info(<message>);` from a test method, as many times as you need.
- For synchronous tests, call `return <return_value>;` from a test method. The returned value will be displayed in the console, provided it is not `null` and the test succeeds.
- For asynchronous tests, call Promise resolution or rejection methods with a value `resolve(<return_value>);` or `reject(<return_value>);`. The returned value will be displayed on the console, provided it is not `null`.

Examples of tests output are provided in the [section on running tests](#running-tests).

#### A Test Case Example ####

The utility file `myFile.nut` contains the following code:

```squirrel
// (optional) Async version, can also be synchronous
function setUp() {
    return Promise(function (resolve, reject) {
        resolve("We're ready");
    }.bindenv(this));
}
```

The test case code is as follows:

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

## Using Tests ##

### Test Device Group ###

To run your tests you need to have one or more devices associated with your account and assigned to the Device Group to which your tests will be deployed. These then are the tasks you should perform in order to prepare your devices for testing:

1. Prepare a Product. If you already have a Product, note its ID or name. If you do not have a Product, create a new one with [`impt product create`](./CommandsManual.md#product-create):

    ```bash
    > impt product create --name MyTestProduct
    Product "MyTestProduct" is created successfully.
    Product:
      id:   a83ecc00-cb39-d950-9a60-96694403ab9d
      name: MyTestProduct
    IMPT COMMAND SUCCEEDS
    ```

2. Prepare a Device Group. If you already have a Device Group, note its ID or name. If you do not have a Device Group, create a new one with [`impt dg create`](./CommandsManual.md#device-group-create). You need to specify the Product when creating the Device Group.
    You may use a Device Group of any [type](./CommandsManual.md#device-group-type), but it is recommended that you use a Development Device Group.

    ```bash
    > impt dg create --name MyTestDG --product MyTestProduct
    Device Group "MyTestDG" is created successfully.
    Device Group:
      id:   e4bf84dd-7cc6-147e-9b42-b08812912b99
      type: development
      name: MyTestDG
    IMPT COMMAND SUCCEEDS
    ```

3. Assign one or more devices on which you plan to run your tests to the Device Group using [`impt device assign`](./CommandsManual.md#device-assign).

    ```bash
    > impt device assign --device myDevice1 --dg MyTestDG
    Device "myDevice1" is assigned successfully to Device Group "MyTestDG".
    IMPT COMMAND SUCCEEDS
    ```

4. Specify the Device Group during [test configuration](#test-configuration). Your tests will run on all the devices assigned to the Device Group. If you need to, you can change the Device Group in the test configuration.

### Test Configuration ###

Before running the tests you should create a test configuration for your test project: call [`impt test create`](./CommandsManual.md#test-create) from the test home. If a [test configuration file](./CommandsManual.md#test-configuration-files) already exists in that directory, it will be deleted (if confirmed by you) and the new configuration will be created from scratch in its place.

The configuration settings include:

- `--dg` &mdash; the Device Group identifier. Your tests will run on all of the devices assigned to that Device Group. You may specify the Device Group by its ID or its name.

- `--device-file`, `--agent-file` &mdash; The device and agent source code which is deployed along with the tests. Usually, it is the source code of a library or other Squirrel which you are planning to test.

- `--test-file` &mdash; The test file name or the pattern which specifies the test file(s) included in your test project. You may repeat this option to specify several file names and/or patterns. The values of the repeated option are combined by logical OR. The default pattern is detailed in the [command’s spec](./CommandsManual.md#test-create).

- `--github-config` &mdash; A path to a [GitHub credentials file](#github-credentials). You may need to use it if your test files use [include from GitHub](#include-from-github).

- `--builder-config` &mdash; A path to a file containing [*Builder* variables](#builder-variables). You only need it if your tests use *Builder* variables.

- `--timeout`, `--stop-on-fail`, `--allow-disconnect`, `--builder-cache` &mdash; Other settings, their meaning and default values are described in the [command’s spec](./CommandsManual.md#test-create).

#### Example ####

```bash
> impt test create --dg MyTestDG --agent-file MyLibrary.agent.lib.nut
Test Configuration is created successfully.
Test Configuration:
  Test files:       *.test.nut, tests/**/*.test.nut
  Agent file:       MyLibrary.agent.lib.nut
  Stop on failure:  false
  Timeout:          30
  Allow disconnect: false
  Builder cache:    false
  Device Group:
    id:      e4bf84dd-7cc6-147e-9b42-b08812912b99
    type:    development
    name:    MyTestDG
    Product:
      id:   a83ecc00-cb39-d950-9a60-96694403ab9d
      name: MyTestProduct
    Devices:
      Device:
        id:            234776801163a9ee
        name:          myDevice1
        mac_address:   0c:2a:69:05:0d:62
        agent_id:      T1oUmIZ3At_N
        device_online: true
IMPT COMMAND SUCCEEDS
```

#### Updating The Configuration ####

You may update the test configuration by calling [`impt test update`](./CommandsManual.md#test-update). The existing [test configuration file](./CommandsManual.md#test-configuration-files) will be updated with the new settings. The new `--test-file` option value(s) completely replace any existing setting.

#### Example ####

```bash
> impt test update --timeout 60 --builder-cache true
Test Configuration is updated successfully.
Test Configuration:
  Test files:       *.test.nut, tests/**/*.test.nut
  Agent file:       MyLibrary.agent.lib.nut
  Stop on failure:  false
  Timeout:          60
  Allow disconnect: false
  Builder cache:    true
  Device Group:
    id:      e4bf84dd-7cc6-147e-9b42-b08812912b99
    type:    development
    name:    MyTestDG
    Product:
      id:   a83ecc00-cb39-d950-9a60-96694403ab9d
      name: MyTestProduct
    Devices:
      Device:
        id:            234776801163a9ee
        name:          myDevice1
        mac_address:   0c:2a:69:05:0d:62
        agent_id:      T1oUmIZ3At_N
        device_online: true
IMPT COMMAND SUCCEEDS
```

You may also display the current test configuration by calling [`impt test info`](./CommandsManual.md#test-info).

#### Example ####

```bash
> impt test info
Test Configuration:
  Test files:       *.test.nut, tests/**/*.test.nut
  Agent file:       MyLibrary.agent.lib.nut
  Stop on failure:  false
  Timeout:          60
  Allow disconnect: false
  Builder cache:    true
  Device Group:
    id:      e4bf84dd-7cc6-147e-9b42-b08812912b99
    type:    development
    name:    MyTestDG
    Product:
      id:   a83ecc00-cb39-d950-9a60-96694403ab9d
      name: MyTestProduct
    Devices:
      Device:
        id:            234776801163a9ee
        name:          myDevice1
        mac_address:   0c:2a:69:05:0d:62
        agent_id:      T1oUmIZ3At_N
        device_online: true
IMPT COMMAND SUCCEEDS
```

### GitHub Credentials ###

These may be needed if your test files [include code from GitHub](#include-from-github).

For unauthenticated requests, the GitHub API allows you to make [up to 60 requests per hour](https://developer.github.com/v3/#rate-limiting), but this may be not sufficient for intensive testing. To overcome this limit, you can provide GitHub account credentials. There are two ways to do this:

- Via environment variables. **We strongly recommend this way for security reasons**<br />You should specify two environment variables:
  - `GITHUB_USER` &mdash; A GitHub account username.
  - `GITHUB_TOKEN` &mdash; A GitHub account password or personal access token.

- Via a GitHub credentials file.
  - This file may be created or updated with [`impt test github`](./CommandsManual.md#test-github). You specify a GitHub username and password, and they are saved in the specified file. **Important** The credentials are stored in a plain text.
  - You may have several GitHub credential files and they may be located in any place. You specify a concrete GitHub credentials file during [test configuration](#test-configuration). If the specified file exists when you [run the tests](#running-tests), the GitHub credentials are taken from it. If the specified file does not exist, the GitHub credentials are taken from the environment variables, if they are set.

#### Example ####

```bash
> impt test github --github-config github.conf --user github_username
    --pwd github_password
GitHub credentials Configuration is created successfully.
IMPT COMMAND SUCCEEDS
```

### Running Tests ###

To run your configured test project’s tests, call [`impt test run`](./CommandsManual.md#test-run) from the test home. The tests will be executed according to your [test configuration](#test-configuration) file.

By default, the tool searches for all test files according to the file names and/or patterns specified in the [test configuration](#test-configuration) file. The search starts from the test home and includes all sub-directories. The tool looks for all test cases in the files it discovers. All test methods in all located test cases are considered as viable tests for execution. For a particular run, you may select a subset of test files, test cases and test methods by specifying the `--tests` option; see [here](#running-selective-tests) for more details.

Every selected test file is a source for building and deploying code, so there will be as many different builds as there are selected test files for execution. Test files (builds) run in an arbitrary order.

Every test file (build) runs on all devices currently assigned to the Device Group specified in the [test configuration](#test-configuration) file one by one: no device is run until the previous device has completed testing. Devices are chosen in an arbitrary order. A test file (build) running on one device is called a test session. When the build completes on the last device, the next test file (build) starts running on the same set of devices, again one after the other.

You may clear the [*Builder* cache](#builder-cache) before the tests starts by setting the `--clear-cache` option. If the *Builder* cache is enabled in the [test configuration](#test-configuration) file, it will then be re-created during the test run.

You may run the tests in [debug mode](#debug-mode) by specifying the `--output debug` option.

Every test is treated as failed if an error is thrown or a timeout, as defined in the [test configuration](#test-configuration) file, occurs during the test execution. Otherwise the test is treated as passed. If at least one test in a test session fails, the test session is treated as failed. If the [test configuration](#test-configuration) has the `stop-on-fail` setting set to `true`, test execution ends after the first failed test.

When all tests are passed, the [`impt test run`](./CommandsManual.md#test-run) command outputs `IMPT COMMAND SUCCEEDS` and returns an exit code of zero. Otherwise, it outputs `IMPT COMMAND FAILS` and returns a non-zero exit code.

#### Example: Testing Failed ####

```bash
> impt test run
[info] Started at 09 Mar 2018 18:58:31 GMT+0300
[+0.01/0.01s info] Found 1 test file:
        tests/TestFile1.test.nut
[+0.02/0.00s info] Using agent source file: MyLibrary.agent.lib.nut
[+0.02/0.00s info] Have no device source file, using blank
[+0.72/0.70s info] Using device test file "tests/TestFile1.test.nut"
[+0.76/0.04s info] Using DeviceGroup "MyTestDG" [ece0ef8d-fbb1-6bdf-e2b8-02776e2fdf41]
Deployment "d28fb08b-44f2-d995-db1e-73a863c33a03" is created successfully.
[+2.89/2.13s info] Created deployment: d28fb08b-44f2-d995-db1e-73a863c33a03

[+2.89/0.00s test] Starting test session "world-dawn"
[+2.89/0.00s info] Using device myDevice1 [234776801163a9ee] (1/1)
[+2.89/0.00s info] Using device test file "tests/TestFile1.test.nut"
Device "234776801163a9ee" is assigned successfully to Device Group "ece0ef8d-fbb1-6bdf-e2b8-02776e2fdf41".
[+6.03/3.14s info] Device code space usage: 17.0%
[+11.19/5.15s test] MyTestCase_1::testMe_1()
[+11.19/0.00s test] Success
[+11.66/0.47s test] MyTestCase::setUp()
[+11.66/0.00s test] Success: We're ready
[+11.66/0.00s test] MyTestCase::testMe_1()
[+11.67/0.00s test] Failure: Expected value: 1, got: 10
[+11.67/0.00s test] MyTestCase::testMe()
[+11.67/0.00s test] Success
[+11.67/0.00s test] MyTestCase::tearDown()
[+11.67/0.00s test] Success
[+11.68/0.00s test] Tests: 3, Assertions: 3, Failures: 1
[+11.68/0.00s test] Session "world-dawn" failed

[+11.68/0.00s info] Testing failed
Error: Testing failed
IMPT COMMAND FAILS
```

#### Example: All Tests Passed ####

```bash
> impt test run
[info] Started at 09 Mar 2018 19:00:25 GMT+0300
[+0.01/0.01s info] Found 1 test file:
        tests/TestFile1.test.nut
[+0.01/0.00s info] Using agent source file: MyLibrary.agent.lib.nut
[+0.01/0.00s info] Have no device source file, using blank
[+0.86/0.84s info] Using device test file "tests/TestFile1.test.nut"
[+0.90/0.04s info] Using DeviceGroup "MyTestDG" [ece0ef8d-fbb1-6bdf-e2b8-02776e2fdf41]
Deployment "03b7f0d3-f5df-9bd9-b856-5d5e3b9fd8e7" is created successfully.
[+2.12/1.23s info] Created deployment: 03b7f0d3-f5df-9bd9-b856-5d5e3b9fd8e7

[+2.13/0.00s test] Starting test session "industry-grain"
[+2.13/0.00s info] Using device myDevice1 [234776801163a9ee] (1/1)
[+2.13/0.00s info] Using device test file "tests/TestFile1.test.nut"
Device "234776801163a9ee" is assigned successfully to Device Group "ece0ef8d-fbb1-6bdf-e2b8-02776e2fdf41".
[+5.36/3.23s info] Device code space usage: 17.0%
[+9.94/4.58s test] MyTestCase_1::testMe_1()
[+9.94/0.00s test] Success
[+9.94/0.00s test] MyTestCase::setUp()
[+9.94/0.00s test] Success: We're ready
[+9.94/0.00s test] MyTestCase::testMe_1()
[+9.94/0.00s test] Success
[+9.95/0.00s test] MyTestCase::testMe()
[+9.95/0.00s test] Success
[+10.16/0.21s test] MyTestCase::tearDown()
[+10.16/0.00s test] Success
[+10.16/0.00s test] Tests: 3, Assertions: 3, Failures: 0
[+10.16/0.00s test] Session "industry-grain" succeeded

[+10.17/0.00s info] Testing succeeded
IMPT COMMAND SUCCEEDS
```

### Running Selective Tests ###

The `--tests <testcase_pattern>` option of the [`impt test run`](./CommandsManual.md#test-run) command allows you to select specific test files, test cases and test methods for execution. The syntax of `<testcase_pattern>` is the `[testFile][:testCase][::testMethod]`, where:

- `testFile` is the name of a test file. May include a relative path. May include [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions) like `.*`, etc. The specified file(s) will be selected from all files which correspond to the file names and/or patterns defined in the [test configuration](#test-configuration). If `testFile` is omitted, all files which correspond to the file name or patterns defined in the [test configuration](#test-configuration) are selected.

- `testCase` is the name of a test case. Should be fully qualified. Test cases with an identical name may exist in different test files; in this situation all of them will be selected if the files are selected.

- `testMethod` is the name of a test method. Should be fully qualified. Test methods with an identical name may exist in different test cases; in this situation all of them will be selected if the cases are selected.

#### Example ####

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

In this example:

- `--tests TestFile1:MyTestCase::testMe` selects the *testMe()* method in the MyTestCase case from the `TestFile1.test.nut` file.
- `--tests :MyTestCase::testMe` selects the *testMe()* method in the MyTestCase case from both `TestFile1.test.nut` and `TestFile2.test.nut`.
- `--tests :MyTestCase_1` selects all the test methods from the MyTestCase_1 case from the `TestFile1.test.nut` file as it is the only file containing the specified test case.
- `--tests TestFile2` selects all the test methods from the `TestFile2.test.nut` file.
- `--tests ::testMe_1` selects the *testMe_1()* methods in all test cases from both `TestFile1.test.nut` and `TestFile2.test.nut`.

### Debug Mode ###

You may run your tests in debug mode by specifying the `--output debug` option of the [`impt test run`](./CommandsManual.md#test-run) command. In this mode:

- All communications with the [impCentral API](https://apidoc.electricimp.com) are displayed in the console.
- All communications with the [*impUnit* test framework](https://github.com/electricimp/impUnit) are displayed in the console.
- Device and agent code for all the running builds are placed in the `.build` folder inside the test home.

#### Example ####

```bash
> impt test run --tests TestFile1:MyTestCase::testMe --output debug
...
[info] Started at 22 Jan 2018 22:49:25 GMT+0300
[debug:TestHelper] Skipping found test "tests/TestFile2.test.nut"
[+0.02/0.02s info] Found 1 test file:
        tests/TestFile1.test.nut
[+0.03/0.00s info] Using agent source file: MyLibrary.agent.lib.nut
[+0.03/0.00s info] Have no device source file, using blank
...
[+1.16/1.13s info] Using device test file "tests/TestFile1.test.nut"
[debug:TestHelper] Agent code size: 53 bytes
[debug:TestHelper] Device code size: 22207 bytes
[+1.19/0.04s info] Using DeviceGroup "MyTestDG" [e4bf84dd-7cc6-147e-9b42-b08812912b99]
...
Deployment "e46e138c-9053-db40-e9de-f299e7c2908e" is created successfully.
[+3.04/1.85s info] Created deployment: e46e138c-9053-db40-e9de-f299e7c2908e

[+3.04/0.00s test] Starting test session "paint-influence"
[+3.05/0.00s info] Using device myDevice1 [234776801163a9ee] (1/1)
[+3.05/0.00s info] Using device test file "tests/TestFile1.test.nut"
[debug:TestHelper] Agent code size: 53 bytes
[debug:TestHelper] Device code size: 22207 bytes
[debug:TestWatchdog] Watchdog "session-start" started
...
Doing the request with options:
{
  "url": "https://api.electricimp.com/v5/devicegroups/e4bf84dd-7cc6-147e-9b42-b08812912b99/relationships/devices",
  "method": "POST",
  "headers": {
    "Content-type": "application/vnd.api+json",
    "Authorization": "[hidden]"
  },
  "json": true,
  "qs": null,
  "body": {
    "data": [
      {
        "type": "device",
        "id": "234776801163a9ee"
      }
    ]
  },
  "qsStringifyOptions": {
    "arrayFormat": "repeat"
  }
}

Response code: 204
Response body: undefined
Device "234776801163a9ee" is assigned successfully to Device Group "e4bf84dd-7cc6-147e-9b42-b08812912b99".
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:30.423Z","log_type":"development","type":"status","msg":"Agent restarted: reload."}
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:30.673Z","log_type":"development","type":"status","msg":"Agent restarted: new_bytecode_version."}
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:30.667Z","log_type":"development","type":"status","msg":"Downloading new code; 16.83% program storage used"}
[+6.35/3.30s info] Device code space usage: 16.8%
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:34.917Z","log_type":"development","type":"server.log","msg":"{\"type\":\"SESSION_START\",\"__IMPUNIT__\":1,\"session\":\"paint-influence\",\"message\":\"\"}"}
[debug:TestWatchdog] Watchdog "test-messages" stopped
[debug:TestWatchdog] Watchdog "test-messages" started
[debug:TestWatchdog] Watchdog "session-start" stopped
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:34.937Z","log_type":"development","type":"server.log","msg":"{\"type\":\"DEBUG\",\"__IMPUNIT__\":1,\"session\":\"paint-influence\",\"message\":{\"testCasesFound\":{\"MyTestCase\":{\"tests\":[\"testMe\"],\"tearDown\":false,\"setUp\":false}}}}"}
[debug:TestWatchdog] Watchdog "test-messages" stopped
[debug:TestWatchdog] Watchdog "test-messages" started
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:34.951Z","log_type":"development","type":"server.log","msg":"{\"type\":\"TEST_START\",\"__IMPUNIT__\":1,\"session\":\"paint-influence\",\"message\":\"MyTestCase::testMe()\"}"}
[debug:TestWatchdog] Watchdog "test-messages" stopped
[debug:TestWatchdog] Watchdog "test-messages" started
[+10.50/4.15s test] MyTestCase::testMe()
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:34.962Z","log_type":"development","type":"server.log","msg":"{\"type\":\"TEST_OK\",\"__IMPUNIT__\":1,\"session\":\"paint-influence\",\"message\":null}"}
[debug:TestWatchdog] Watchdog "test-messages" stopped
[debug:TestWatchdog] Watchdog "test-messages" started
[+10.50/0.00s test] Success
[debug:TestLogsParser] Log line received: {"device_id":"234776801163a9ee","ts":"2018-01-22T19:49:34.976Z","log_type":"development","type":"server.log","msg":"{\"type\":\"SESSION_RESULT\",\"__IMPUNIT__\":1,\"session\":\"paint-influence\",\"message\":{\"assertions\":1,\"failures\":0,\"tests\":1}}"}
[debug:TestWatchdog] Watchdog "test-messages" stopped
[debug:TestWatchdog] Watchdog "test-messages" started
[debug:TestWatchdog] Watchdog "test-messages" stopped
[+10.51/0.01s test] Tests: 1, Assertions: 1, Failures: 0
[+10.51/0.00s test] Session paint-influence succeeded
[debug:TestWatchdog] Watchdog "session-start" stopped
[debug:TestWatchdog] Watchdog "test-messages" stopped

[+10.51/0.00s info] Testing succeeded
IMPT COMMAND SUCCEEDS
```

### Cleaning Up ###

After testing is complete, you may want to clean the various entities created during testing. If you want to delete your test project, call [`impt test delete`](./CommandsManual.md#test-delete) from the test home. This deletes the [test configuration file](./CommandsManual.md#test-configuration-files), the *Builder* cache directory and any debug information. By specifying additional options you may also delete the GitHub credentials file, any file containing *Builder* variables, and impCentral API entities (Device Group, Deployments, Product) which were used or created during testing. Please see the [delete command’s spec](./CommandsManual.md#test-delete) for more information.

#### Example ####

```bash
> impt test delete --all
The following entities will be deleted:
Product:
  id:   a83ecc00-cb39-d950-9a60-96694403ab9d
  name: MyTestProduct
Device Group:
  id:   e4bf84dd-7cc6-147e-9b42-b08812912b99
  type: development
  name: MyTestDG
Deployment:
  id:  e46e138c-9053-db40-e9de-f299e7c2908e
  sha: 6b2c3c2f7eb406dd0aa035ac4b7544cff6fa5b2eebf2c2317bcca8a30d5545da
Deployment:
  id:  f44511f9-f1a0-a892-a4b8-53f48880d6c7
  sha: c56bd6d4723170c8022401461036fff2c2a86f9dc43e84613c42068abd667c6c
Deployment:
  id:  3c0ef686-6200-59e1-cc39-ec8ca788a482
  sha: 2f45a6f13ffa6e1ef201429583f9d758da0b6cb9939e663bb278f7270f036220

The following Devices will be unassigned from Device Groups:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true

Debug mode temporary .build directory will be deleted.
GitHub credentials Configuration File github.conf will be deleted.
Test Configuration File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "234776801163a9ee" is unassigned successfully.
Device Group "e4bf84dd-7cc6-147e-9b42-b08812912b99" is deleted successfully.
Product "a83ecc00-cb39-d950-9a60-96694403ab9d" is deleted successfully.
Deployment "e46e138c-9053-db40-e9de-f299e7c2908e" is deleted successfully.
Deployment "3c0ef686-6200-59e1-cc39-ec8ca788a482" is deleted successfully.
Deployment "f44511f9-f1a0-a892-a4b8-53f48880d6c7" is deleted successfully.
Debug mode temporary .build directory is deleted successfully.
GitHub credentials Configuration is deleted successfully.
Test Configuration is deleted successfully.
IMPT COMMAND SUCCEEDS
```

Alternatively, you may fully delete the Device Group which you used for the testing by calling `impt dg delete --dg <DEVICE_GROUP_IDENTIFIER> --builds --force`. This fully cleans all of the impCentral entities created during testing, unassigns all devices from the Device Group, deletes all builds created for the Device Group, and deletes the Device Group itself.

#### Example ####

```bash
> impt dg delete --dg MyTestDG --builds --force
The following entities will be deleted:
Device Group:
  id:   e4bf84dd-7cc6-147e-9b42-b08812912b99
  type: development
  name: MyTestDG
Deployment:
  id:  e46e138c-9053-db40-e9de-f299e7c2908e
  sha: 6b2c3c2f7eb406dd0aa035ac4b7544cff6fa5b2eebf2c2317bcca8a30d5545da
Deployment:
  id:  f44511f9-f1a0-a892-a4b8-53f48880d6c7
  sha: c56bd6d4723170c8022401461036fff2c2a86f9dc43e84613c42068abd667c6c
Deployment:
  id:  3c0ef686-6200-59e1-cc39-ec8ca788a482
  sha: 2f45a6f13ffa6e1ef201429583f9d758da0b6cb9939e663bb278f7270f036220

The following Devices will be unassigned from Device Groups:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "234776801163a9ee" is unassigned successfully.
Device Group "e4bf84dd-7cc6-147e-9b42-b08812912b99" is deleted successfully.
Deployment "e46e138c-9053-db40-e9de-f299e7c2908e" is deleted successfully.
Deployment "3c0ef686-6200-59e1-cc39-ec8ca788a482" is deleted successfully.
Deployment "f44511f9-f1a0-a892-a4b8-53f48880d6c7" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

If you only want to unassign the devices from the testing Device Group, use [`impt dg unassign`](./CommandsManual.md#device-group-unassign) or [`impt device unassign`](./CommandsManual.md#device-unassign).

#### Example ####

```bash
> impt dg unassign --dg MyTestDG
The following Devices are unassigned successfully from Device Group "MyTestDG":
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
IMPT COMMAND SUCCEEDS
```

```bash
> impt device unassign --device myDevice1
Device "myDevice1" is unassigned successfully.
IMPT COMMAND SUCCEEDS
```

If you want to delete the Product, use [`impt product delete`](./CommandsManual.md#product-delete).

#### Example ####

```bash
> impt product delete --product MyTestProduct --builds --force
The following entities will be deleted:
Product:
  id:   a83ecc00-cb39-d950-9a60-96694403ab9d
  name: MyTestProduct
Device Group:
  id:   e4bf84dd-7cc6-147e-9b42-b08812912b99
  type: development
  name: MyTestDG
Deployment:
  id:  e46e138c-9053-db40-e9de-f299e7c2908e
  sha: 6b2c3c2f7eb406dd0aa035ac4b7544cff6fa5b2eebf2c2317bcca8a30d5545da
Deployment:
  id:  f44511f9-f1a0-a892-a4b8-53f48880d6c7
  sha: c56bd6d4723170c8022401461036fff2c2a86f9dc43e84613c42068abd667c6c
Deployment:
  id:  3c0ef686-6200-59e1-cc39-ec8ca788a482
  sha: 2f45a6f13ffa6e1ef201429583f9d758da0b6cb9939e663bb278f7270f036220

The following Devices will be unassigned from Device Groups:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "234776801163a9ee" is unassigned successfully.
Device Group "e4bf84dd-7cc6-147e-9b42-b08812912b99" is deleted successfully.
Product "a83ecc00-cb39-d950-9a60-96694403ab9d" is deleted successfully.
Deployment "e46e138c-9053-db40-e9de-f299e7c2908e" is deleted successfully.
Deployment "3c0ef686-6200-59e1-cc39-ec8ca788a482" is deleted successfully.
Deployment "f44511f9-f1a0-a892-a4b8-53f48880d6c7" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

# impt Testing Guide

This additional guide is intended for developers and testers who use the impt tool to test IMP libraries or other IMP code by unit tests which are created with the [*impUnit*](https://github.com/electricimp/impUnit) test framework. The impt tool supersedes the [previous version of impTest](https://github.com/electricimp/impTest) and includes it as a part of the impt now.

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

## The main differences to the previous [version](https://github.com/electricimp/impTest)

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

## Writing Tests

**TODO - all below is just a copy of the previous impTest readme - to be updated!**

The following are the basic steps you need to follow in order to write tests:

- Choose the name and location of your file with tests. You can have several files with tests in the same or different locations.
  - The name with the path, relative to Project Home, must conform to the patterns specified in the [Test Project Configuration](#test-project-configuration) file within your Test Project.
  - The file is treated as agent test code if `agent` is present in the file name. Otherwise the file is treated as device test code.
  - By default, the test code runs either on device or agent. If your Test Case must run on both the device and its agent, there is a way that allows you to execute [agent and device test code together](#tests-for-bi-directional-device-agent-communication).
- Add a Test Case class that inherits from the *ImpTestCase* class. A file can have several Test Cases. Test Cases can have identical names if they are in different files.
- Add and implement tests: methods whose names start with `test`. Every Test Case can have several tests.
- Additionally, any Test Case can have *setUp()* and *tearDown()* methods to perform the environment setup before the tests execute and then perform cleaning-up afterwards.

A test method can be designed as synchronous (by default) or [asynchronous](#asynchronous-testing).

A test file must not contain any `#require` statement. Instead, [an include from GitHub](#github-credentials-configuration) must be used. For example: `#require "messagemanager.class.nut:1.0.2"` must be replaced with `@include "github:electricimp/MessageManager/MessageManager.class.nut@v1.0.2"`.

Here is an example of a simple Test Case:

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

To test interaction between a device and an agent, *impTest* allows developers to extend tests with corresponding logic implemented on the other side of the link (agent or device, respectively). The test “extensions” can be used to emulate real device-agent interaction and communication.

To identify partners file uniquely, there are some restrictions imposed on the test extensions:

The [Test case](#overview) class must be located either in the device code or the agent code, but not in both. Whichever of the two it is included in, that is the **TestFile** &mdash; the other file is the **PartnerFile**. Both of these files must be located in the same directory on the disk.

**TestFile** and **PartnerFile** must be named as follows: `TestName.(agent|device)[.test].nut`, ie. they need to have the same `TestName` prefix and the same `.nut` suffix.

**TestFile** is indicated by the `.test` string in its filename; **PartnerFile** must not feature this string in the suffix.

The type of execution environment is indicated by either `.device` or `.agent` in the file name &mdash; if **TestFile** contains `.agent`, **PartnerFile** must have `.device`, and *vice versa*.

For example, `"Test1.agent.test.nut"` (test file) and `"Test1.device.nut"` (partner file).

Due to partner special naming **do not** change the default value of ["Test file search pattern"](#test-project-configuration).

Further examples of test extensions can be found at [sample7](./samples/sample7).

### Asynchronous Testing

Every test method (as well as *setUp()* and *tearDown()*) can be either synchronous (the default) or asynchronous.

Methods must return an instance of [**Promise**](https://github.com/electricimp/Promise) to notify that it needs to do some work asynchronously.

The resolution of the Promise indicates that all test have been passed successfully. The rejection of a Promise denotes a failure.

#### Example

```squirrel
function testSomethingAsynchronously() {
    return Promise(function (resolve, reject){
        resolve("It's all good, man!");
    });
}
```

### Builder Language

[*Builder*](https://github.com/electricimp/Builder) is supported by *impTest*. The *Builder* language combines a preprocessor with an expression language and advanced imports.

#### Example

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

[*\_\_FILE\_\_* and *\_\_LINE\_\_*](https://github.com/electricimp/Builder#variables) variables are defined in the [**Builder**](https://github.com/electricimp/Builder), they can be useful for debugging information. Below is a usage example:

```squirrel
this.assertEqual(
    expected,
    actual,
    "Failed to assert that values are"
        + " equal in '@{__FILE__}'"
        + " at line @{__LINE__}"
);
```

It is possible to define and propagate [custom variables](https://github.com/electricimp/Builder#variables) through a separate configuration file which syntax is similar to the [github credential file](#github-credentials-configuration):

```
{ "pollServer": "http://example.com",
  "expectedAnswer": "data ready" }
```

The default file name is `.imptest-builder` but an alternative name can be selected with the  `-b <builder_config_file>` command line option as follows:

```bash
imptest test -b tests/test1/.test1-builder-config
```

Now [*Builder*](https://github.com/electricimp/Builder) will be able to process any custom variables encountered in the source code.

```squirrel
local response = http.get("@{pollServer}", {}).sendsync();
this.assertEqual(
    "@{expectedAnswer}",
    response,
    "Failed to get expected answer"
);
```

### External Commands

A test can call a host operating system command as follows:

```squirrel
// Within the test case/method
this.runCommand("echo 123");
// The host operating system command `echo 123` is executed
```

If the execution timeout of an external command expires (the timeout is specified by the _timeout_ parameter in the [Test Project Configuration](#test-project-configuration) file) or exits with a status code other than 0, the test session fails.

### Assertions

The following assertions are available in tests:

#### assertTrue()

`this.assertTrue(condition, [message]);`

Asserts that the condition is truthful.

##### Example

```squirrel
// OK
this.assertTrue(1 == 1);

// Fails
this.assertTrue(1 == 2);
```

#### assertEqual()

`this.assertEqual(expected, actual, [message])`

Asserts that two values are equal.

##### Example

```squirrel
// OK
this.assertEqual(1000 * 0.01, 100 * 0.1);

// Failure: Expected value: 1, got: 2
this.assertEqual(1, 2);
```

#### assertGreater()

`this.assertGreater(actual, cmp, [message])`

Asserts that a value is greater than some other value.

##### Example

```squirrel
// OK
this.assertGreater(1, 0);

// Failure: Failed to assert that 1 > 2
this.assertGreater(1, 2);
```

#### assertLess()

`this.assertLess(actual, cmp, [message])`

Asserts that a value is less than some other value.

##### Example

```squirrel
// OK
this.assertLess(0, 1);

// Failure: Failed to assert that 2 < 2
this.assertLess(2, 2);
```

#### assertClose()

`this.assertClose(expected, actual, maxDiff, [message])`

Asserts that a value is within some tolerance from an expected value.

##### Example

```squirrel
// OK
this.assertClose(10, 9, 2);

// Failure: Expected value: 10пїЅ0.5, got: 9
this.assertClose(10, 9, 0.5);
```

#### assertDeepEqual()

`this.assertDeepEqual(expected, actual, [message])`

Performs a deep comparison of tables, arrays and classes.

##### Example

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

##### Example

```squirrel
// OK
this.assertBetween(10, 9, 11);

// Failure: Expected value in the range of 11..12, got 10
this.assertBetween(10, 11, 12);
```

#### assertThrowsError

`this.assertThrowsError(func, ctx, [args = []], [message])`

Asserts that the _func_ function throws an error when it is called with the _args_ arguments and the _ctx_ context. Returns an error thrown by _func_.

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

Return values other than `null` are displayed in the console when a test succeeds and can be used to output the following diagnostic messages:

<img src="./docs/diagnostic-messages.png" width=497>

[Test cases](#overview) can also output informational messages with:

```squirrel
this.info(<message>);
```

A log of a failed test looks as follows:

<img src="./docs/diagnostic-messages2.png" width=497>

This means that the execution of the *testMe()* method in the *MyTestCase* class has failed: the incorrect syntax is in line 6 of the test file (containing the *MyTestCase* class).

### A Test Case Example

The utility file `myFile.nut` contains the following code:

```squirrel

// (optional) Async version, can also be synchronous

function setUp() {
    return Promise(function (resolve, reject){
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
        return Promise(function (resolve, reject){
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

### Project Configuration Generation

The Test Project Configuration file can be created or updated by the following command:

```bash
imptest init [-c <configuration_file>] [-d] [-f]
```

where:

* `-d` &mdash; prints the debug output.
* `-c` &mdash; provides a path to the configuration file. A relative or absolute path can be used. Generation fails if any intermediate directory in the path does not exist. If the `-c` option is not specified, the `.imptest` file in the current directory is assumed.
* `-f` &mdash; updates (overwrites) an existing configuration. If the specified configuration file already exists, this option must be explicitly specified to update the file.

During the command execution you will be asked for [configuration settings](#test-project-configuration) in either of the following cases:
- if a new Test Project Configuration is being created, the default values of the settings are offered;
- if the existing Test Project Configuration is being updated, the settings from the existing configuration file are offered as defaults.

### GitHub Credentials Configuration

Sources from [GitHub](https://github.com/electricimp/Builder#from-github) can be included in test files.

For unauthenticated requests, the GitHub API allows you to make [up to 60 requests per hour](https://developer.github.com/v3/#rate-limiting). To overcome this limitation, you can provide user credentials.

For security reasons, we strongly recommend that you provide the credentials via [Environment Variables](#environment-variables). However, there is also a way to store the credentials in a special file (one file per Test Project).
The file can be created or updated by the following command:

```bash
imptest github [-g <credentials_file>] [-d] [-f]
```

where:

* `-d` &mdash; prints the debug output/
* `-g` &mdash; provides a path to the file with GitHub credentials. A relative or absolute path can be used. Generation fails if any intermediate directory in the path does not exist. If `-g` option is not specified, the `.imptest-auth` file in the current directory is assumed.
* `-f` &mdash; updates (overwrites) an existing file. If the specified file already exists, this option must be explicitly specified to update it.

The file syntax is as follows:

```
{ "github-user": "user",
  "github-token": "password_or_token" }
```

### Environment Variables

For security reasons, we strongly recommend that you define your Build API key and GitHub credentials as environment variables, as follows:

- [*apiKey*](#test-project-configuration) -> `IMP_BUILD_API_KEY` &mdash; to deploy and run the code on imp devices via [Electric Imp Build API](https://electricimp.com/docs/buildapi/).
- [*github-user*](#github-credentials-configuration) -> `GITHUB_USER` &mdash; to include external sources from GitHub.
- [*github-token*](#github-credentials-configuration) -> `GITHUB_TOKEN` &mdash; to include external sources from GitHub.


## Running Tests

Use this command to run the tests:

```bash
imptest test [-c <configuration_file>] [-g <credentials_file>] [-b <builder_file>] [--builder-cache=true|false] [-d] [testcase_pattern]
```
where:

* `-c` &mdash; this option is used to provide a path to the Test Project Configuration file. A relative or absolute path can be used. If the `-c` option is left out, the `.imptest` file in the current directory is assumed.
* `-g` &mdash; this option is used to provide a path to file with GitHub credentials. A relative or absolute path can be used. If the `-g` option is left out, the `.imptest-auth` file in the current directory is assumed.
* `-b` &mdash; this option is used to provide a path to file with [Builder variables](https://github.com/electricimp/Builder#usage). A relative or absolute path can be used. If the `-b` option is left out, the `.imptest-builder` file in the current directory is assumed.
* `--builder-cache` &mdash; enable (if `=true`) / disable (if `=false`) builder cache for this test run. If not specified, defined by the setting in the test project configuration.
* `-d` &mdash; prints [debug output](#debug-mode), stores device and agent code.
* `testcase_pattern` &mdash; a pattern for [selective test runs](#selective-test-runs).

The *impTest* tool searches all files that match the filename patterns specified in the [Test Project Configuration](#test-project-configuration). The search starts with Project Home. The tool looks for all Test Cases (classes) in the files. All the test methods from those classes are considered as tests for the current Test Project.

The optional `testcase_pattern` selects a specific test or a set of tests for execution from all the found tests. If `testcase_pattern` is not specified, all the found tests are selected for execution.

The selected tests are executed in an arbitrary order.

Every test is treated as failed if an error has been thrown. Otherwise the test is treated as passed.

### Selective Test Runs

The optional `testcase_pattern` allows you to execute a single test or a set of tests from one or several Test Cases. The syntax of the pattern is as follows: `[testFileName]:[testClass].[testMethod]`

where:

* `testFileName` &mdash; the name of the Test Case file. A pattern to filter required files among all conforming to the [test file search pattern](#test-project-configuration).
* `testClass` &mdash; the name of the Test Case class. **Note** Test Cases with identical names can exist in different files that belong to the same Test Project, all of them must be selected.
* `testMethod` &mdash; a test method name

#### Example

The test file `TestFile1.test.nut` contains:

```squirrel
class MyTestClass extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}

class MyTestClass_1 extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}
```

The test file `TestFile2.test.nut` contains:

```
class MyTestClass extends ImpTestCase {
    function testMe() {...}
    function testMe_1() {...}
}
```

In this case:

- `imptest test TestFile1:MyTestClass.testMe` runs the *testMe()* method in the *MyTestClass* class of the `TestFile1.test.nut` file.
- `imptest test :MyTestClass.testMe` runs the *testMe()* method in the *MyTestClass* class from the `TestFile1` __and__ `TestFile2.test.nut` file.
- `imptest test :MyTestClass_1` runs all test methods from the *MyTestClass_1* class of the first file since it is the only file with the required class.
- `imptest test TestFile2` runs all test methods from the `TestFile2.test.nut` file.
- `imptest test :.testMe_1` runs the *testMe_1()* methods in all classes of all files.

**Note** Search patterns are allowed for test file names only. A test class and a test method **must be** fully qualified.

**Note** If no colon is present in the testcase filter, it is assumed that only the pattern for a file name is specified.

**Note** An internal class can play the role of a test case. To denote this use case, put `"."` at the end of the filter. For example, `"imptest test :Inner.TestClass."` executes all test methods from the *Inner.TestClass* class.

### Builder Cache

Builder cache is intended to improve the build time and reduce the number of requests to external resources. It is only possible to cache external libraries. Builder stores the cache in the `.builer-cache` folder for up to 24 hours.

Caching is disabled by default. It can be activated during a [test project configuration generation](#project-configuration-generation).

It is possible to specify whether the builder cache should be enabled or disabled for a given [test run](#running-tests). For example, to disable the cache:

```shell
imptest test --builder-cache=false
```

There is no special impTest option or command to remove the builder cache, but you can do this manually:

```shell
rm -rf .builder-cache
```

### Debug Mode

The `-d` option is used to run tests in the debug mode:
- A debug output is switched on. JSON is used to communicate between [*impUnit*](https://github.com/electricimp/impUnit) test framework and **impTest**. Communication messages are printed.
- Device and agent code are stored in the `./build` folder that is created in Project Home.

The debug mode is useful for analyzing failures.

The following is an example of a debug log:

<img src="./docs/diagnostic-messages3.png" width=497>





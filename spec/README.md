# impt Testing #

There are [Jasmine](https://www.npmjs.com/package/jasmine) tests in the [spec folder](../spec) to test *impt* commands.

## Tests Running ##

1. Clone or download the latest version of *imp-central-impt* repository to a local *imp-central-impt* folder. For example, by a command `git clone --recursive https://github.com/electricimp/imp-central-impt.git imp-central-impt`
1. Install imp-central-impt dependencies by calling `npm install` command from your local *imp-central-impt* folder.
1. Set the mandatory environment variables:
    - **IMPT_USER_NAME** - impCentral account username.
    - **IMPT_USER_PASSWORD** - impCentral account password.
    - **IMPT_DEVICE_IDS** - comma separated list of Device IDs that will be used for tests execution.
    
1. If needed, set optional environment variables:
    - **IMPT_DEBUG** - if *true*, displays additional output of the command execution (default: *false*).
    - **IMPT_ENDPOINT** - impCentral API endpoint (default: *https://api.electricimp.com/v5*). You need to specify it when working with a private impCentral installation.
    - **IMPT_GITHUB_USER** / **IMPT_GITHUB_TOKEN** - a GitHub account username / password or personal access token. You need to specify them when you got `GitHub rate limit reached` error.
    - **IMPT_SUFFIX** - Additional custom suffix for entity names created and used during testing. To prevent collisions due to identical entity names in collaborator's accounts the tests try to create unique entity names by adding a suffix with the current user name. If needed, you may specify an additional suffix via this variable.
    - **IMPT_FOLDER_SUFFIX** - Custom suffix for test execution folder name. You need to specify it for [Parallel Tests Execution](#parallel-tests-execution).
    - **IMPT_DEVICE_IDX** - Index (starting from 0) of the value (i.e. a particular device) in the **IMPT_DEVICE_IDS** variable. You may need to specify it to select a concrete device from the device list, eg. for [Parallel Tests Execution](#parallel-tests-execution).
    - **IMPT_OUTPUT_MODES** - Additional output modes to test (several modes may be listed, separated by comma). The tests are always executed in the default output mode. Using this variable you may specify additional output modes. The tests will be repeated for the specified modes. Note, some tests can not be executed in all output modes, in this case unsupported modes will be skipped for that tests.
1. Run the tests by calling `npm test` command from your local *imp-central-impt* folder.

## Parallel Tests Execution ##

In order to decrease a time of the tests execution, the tests for different command groups can be executed in parallel, in different threads. 

To avoid collisions, every thread should use it's own folder. So, you must specify **IMPT_FOLDER_SUFFIX** variable for each thread.

The following groups of tests do not require a device and can be always executed in parallel: `auth`, `account`, `loginkey`, `product`, `project`, `webhook`, `help`.

The following groups of tests require a device and cannot be executed in parallel on the same device: `build`, `log`, `device`, `dg`. They should be executed either sequentially, or in parallel using different devices (use **IMPT_DEVICE_IDX** variable to specify a concrete device for every thread).

### Example ###

Scripts for the fastest tests execution:

#### Using one device ####

##### On Windows #####

```
    start cmd /k "npm test --filter **/build/*.spec.js  **/log/*.spec.js **/dg/*.spec.js **/device/*.spec.js IMPT_FOLDER_SUFFIX=build"
    start cmd /k "npm test --filter **/auth/*.spec.js IMPT_FOLDER_SUFFIX=auth"
    start cmd /k "npm test --filter **/account/*.spec.js IMPT_FOLDER_SUFFIX=account"
    start cmd /k "npm test --filter **/loginkey/*.spec.js IMPT_FOLDER_SUFFIX=loginkey"
    start cmd /k "npm test --filter **/product/*.spec.js IMPT_FOLDER_SUFFIX=product" 
    start cmd /k "npm test --filter **/webhook/*.spec.js IMPT_FOLDER_SUFFIX=webhook"
    start cmd /k "npm test --filter **/project/*.spec.js IMPT_FOLDER_SUFFIX=project"
    start cmd /k "npm test --filter **/help/*.spec.js IMPT_FOLDER_SUFFIX=help"
```

##### On Linux #####

```
    #/bin/sh
    npm test --filter **/build/*.spec.js  **/log/*.spec.js **/dg/*.spec.js **/device/*.spec.js IMPT_FOLDER_SUFFIX=build &
    npm test --filter **/auth/*.spec.js IMPT_FOLDER_SUFFIX=auth &
    npm test --filter **/account/*.spec.js IMPT_FOLDER_SUFFIX=account &
    npm test --filter **/loginkey/*.spec.js IMPT_FOLDER_SUFFIX=loginkey &
    npm test --filter **/product/*.spec.js IMPT_FOLDER_SUFFIX=product & 
    npm test --filter **/webhook/*.spec.js IMPT_FOLDER_SUFFIX=webhook &
    npm test --filter **/project/*.spec.js IMPT_FOLDER_SUFFIX=project &
    npm test --filter **/help/*.spec.js IMPT_FOLDER_SUFFIX=help
```

#### Using 4 devices ####

##### On Windows #####

```
    start cmd /k "npm test --filter **/build/*.spec.js  IMPT_FOLDER_SUFFIX=build IMPT_DEVICE_IDX=0"
    start cmd /k "npm test --filter **/log/*.spec.js IMPT_FOLDER_SUFFIX=log IMPT_DEVICE_IDX=1"
    start cmd /k "npm test --filter **/dg/*.spec.js IMPT_FOLDER_SUFFIX=dg IMPT_DEVICE_IDX=2"
    start cmd /k "npm test --filter **/device/*.spec.js IMPT_FOLDER_SUFFIX=device IMPT_DEVICE_IDX=3"
    start cmd /k "npm test --filter **/auth/*.spec.js IMPT_FOLDER_SUFFIX=auth"
    start cmd /k "npm test --filter **/account/*.spec.js IMPT_FOLDER_SUFFIX=account"
    start cmd /k "npm test --filter **/loginkey/*.spec.js IMPT_FOLDER_SUFFIX=loginkey"
    start cmd /k "npm test --filter **/product/*.spec.js IMPT_FOLDER_SUFFIX=product" 
    start cmd /k "npm test --filter **/webhook/*.spec.js IMPT_FOLDER_SUFFIX=webhook"
    start cmd /k "npm test --filter **/project/*.spec.js IMPT_FOLDER_SUFFIX=project"
    start cmd /k "npm test --filter **/help/*.spec.js IMPT_FOLDER_SUFFIX=help"
```

##### On Linux #####

```
    #/bin/sh
    npm test --filter **/build/*.spec.js  IMPT_FOLDER_SUFFIX=build IMPT_DEVICE_IDX=0 &
    npm test --filter **/log/*.spec.js IMPT_FOLDER_SUFFIX=log IMPT_DEVICE_IDX=1 &
    npm test --filter **/dg/*.spec.js IMPT_FOLDER_SUFFIX=dg IMPT_DEVICE_IDX=2 &
    npm test --filter **/device/*.spec.js IMPT_FOLDER_SUFFIX=device IMPT_DEVICE_IDX=3 &
    npm test --filter **/auth/*.spec.js IMPT_FOLDER_SUFFIX=auth &
    npm test --filter **/account/*.spec.js IMPT_FOLDER_SUFFIX=account &
    npm test --filter **/loginkey/*.spec.js IMPT_FOLDER_SUFFIX=loginkey &
    npm test --filter **/product/*.spec.js IMPT_FOLDER_SUFFIX=product &
    npm test --filter **/webhook/*.spec.js IMPT_FOLDER_SUFFIX=webhook &
    npm test --filter **/project/*.spec.js IMPT_FOLDER_SUFFIX=project &
    npm test --filter **/help/*.spec.js IMPT_FOLDER_SUFFIX=help
```

## Limitations ##

- Tests for device removal can not be executed automatically, as *impt* does not have a command to add device to account. Due to this fact, a device must be added to account manually after each test.
- Total number of login keys is limited to 10 per account. Be sure that you have at least one "free" login key slot for tests execution.

## Tests Running Management ##

A set of tests to run is specified by a pattern of the file names which is defined as a value of the `"spec_files"` key in your local [imp-central-impt/spec/support/jasmine.json](../spec/support/jasmine.json) file. By default it is:
```
  "spec_files": [
    "**/*[sS]pec.js"
]
```
I.e. all files with names ended by `spec.js` or `Spec.js` in your local [imp-central-impt/spec](../spec) directory and all it's subdirectories are considered as files with tests.

To run one particular test file, or all test files from one particular directory, or any other subset of test files, update the value of the `"spec_files"` key correspondingly.

## Tests Writing ##

One test file contains one test suite, intended to test one or several *impt* commands, usually from the same command group.

Test files are combined in directories. One directory includes all test files (test suites) intended to test *impt* commands of one command group. For example:
- [imp-central-impt/spec/auth](../spec/auth) directory contains test suites to test *impt auth* commands
- [imp-central-impt/spec/product](../spec/product) directory contains test suites to test *impt product* commands
- [imp-central-impt/spec/dg](../spec/dg) directory contains test suites to test *impt dg* commands

A test file should be named as `<test_suite_name>.spec.js`, where `<test_suite_name>` is some meaningful name, eg. it includes the tested command name.

Every test file (test suite) is executed independently from all other test suites.

Every test file (test suite) includes two mandatory methods:
- `beforeAll()` - is executed before any other code in the file. Should be used to setup an environment before the test suite execution (eg. logging in, creation a Product, etc.)
- `afterAll()` - is executed after any other code in the file. Should be used to cleanup the environment after the test suite execution (eg. deleting the Product, etc.)

Additionally test file (test suite) includes two not mandatory methods:
- `beforeEach()` - is executed before each test in the file. Should be used to setup an environment before the each test execution if necessary.
- `afterEach()` - is executed after each test in the file. Should be used to cleanup the environment after the each test execution if necessary.

Every test suite must delete all impCentral entities (Products, Device Groups, Deployments, etc.) which were created during the tests running. For support parallel execution, test file(s) must use own unique names for entities with suffix ${config.suffix}.

For example:

    const PRODUCT_NAME = `__impt_new_test_product${config.suffix}`;
    
If a test suite needs a new input parameter (eg. an unbound key or a Webhook url) it should be provided via a new environment variable. The environment variable must be documented in this readme file.

There is a common util files
- [imp-central-impt/spec/ImptTestHelper.js](../spec/ImptTestHelper.js) - that contains useful methods which may be used by different test suites. 
- [imp-central-impt/spec/MessageHelper.js](../spec/MessageHelper.js) - that contains useful methods for test output error messages.

The files may be extended by adding more reusable methods during new tests development.

## Test Matrix ##

The list and details of the existing tests are described in the [Test Matrix document](./TestMatrix.md).

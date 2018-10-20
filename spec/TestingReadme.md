# impt Testing #

There are [Jasmine](https://www.npmjs.com/package/jasmine) tests in the [spec folder](../spec) to test *impt* commands.

## Tests Running ##

1. Clone or download the latest version of *imp-central-impt* repository to a local *imp-central-impt* folder. For example, by a command `git clone --recursive https://github.com/electricimp/imp-central-impt.git imp-central-impt`
1. Install imp-central-impt dependencies by calling `npm install` command from your local *imp-central-impt* folder.
1. Set the mandatory environment variables:
    - **IMPT_USER_ID** - impCentral account ID.
    - **IMPT_USER_NAME** - impCentral account username.
    - **IMPT_USER_EMAIL** - impCentral account email address.
    - **IMPT_USER_PASSWORD** - impCentral account password.
    - **IMPT_DEVICE_IDS** - comma separated list of Device IDs that will be used for tests execution.
    - **IMPT_DEVICE_NAMES** - comma separated list of Device names that will be used for tests execution.
    - **IMPT_DEVICE_MACS** - comma separated list of Device MACs that will be used for tests execution.
    - **IMPT_DEVICE_AGENTIDS** - comma separated list of Agent IDs that will be used for tests execution.
    
    ***NOTE*** - all comma separated values in the **IMPT_DEVICE_\*** variables must be in same order, according to the order of the devices.
1. If needed, set optional environment variables:
    - **IMPT_DEBUG** - if *true*, displays additional output of the command execution (default: *false*).
    - **IMPT_ENDPOINT** - impCentral API endpoint (default: *https://api.electricimp.com/v5*). You need to specify it when working with a private impCentral installation.
    - **IMPT_GITHUB_USER** / **IMPT_GITHUB_TOKEN** - a GitHub account username / password or personal access token. You need to specify them when you got `GitHub rate limit reached` error.
    - **IMPT_SUFFIX** - Additional custom suffix for entity names created and used during testing. To prevent collisions due to identical entity names in collaborator's accounts the tests try to create unique entity names by adding a suffix with the first 8 symbols of the current account Id. If needed, you may specify an additional suffix via this variable.
    - **IMPT_TEF** - Custom suffix for test execution directory name. You need to specify it for [Parallel Tests Execution](#parallel-tests-execution).
    - **IMPT_DEVICE_IDX** - Index (starting from 0) of the value (i.e. a particular device) in the **IMPT_DEVICE_\*** variables. You may need to specify it for [Parallel Tests Execution](#parallel-tests-execution).
1. Alternatively, instead of the environment variables setting, you can directly specify the values of the corresponding variables in your local [imp-central-impt/spec/config.js file](../spec/config.js).
1. Run the tests by calling `npm test` command from your local *imp-central-impt* folder.

Note, at this moment some tests for *impt test run* command need to be run either on an imp001 or an imp002 module as they are designed to fail with an `"Out of memory"` error, which does not happen on imp modules with more memory available.

## Parallel Tests Execution ##

In order to decrease a time of the tests execution, the tests for different command groups can be executed in parallel, in different threads. You must specify **IMPT_TEF** variable for each thread.
Bear in mind that tests for some command groups (dg, build, device etc.) will fail if you use the same device for them. To prevent this, you should
- either use several devices and assign a concrete device to concrete thread via **IMPT_DEVICE_IDX** variable (by default index 0 is used),
- or execute these tests in one thread sequentially.

For example:

    npm test --filter `**/build/*[sS]pec.js` IMPT_TEF=build
    npm test --filter `**/dg/*[sS]pec.js` IMPT_TEF=dg IMPT_DEVICE_IDX=1  
    npm test --filter `**/device/*[sS]pec.js` IMPT_TEF=device IMPT_DEVICE_IDX=2   

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
- [imp-central-impt/spec/test](../spec/test) directory contains test suites to test *impt test* commands

A test file should be named as `<test_suite_name>.spec.js`, where `<test_suite_name>` is some meaningful name, eg. it includes the tested command name.

Every test file (test suite) is executed independently from all other test suites.

Every test file (test suite) includes two mandatory methods:
- `beforeAll()` - is executed before any other code in the file. Should be used to setup an environment before the test suite execution (eg. logging in, creation a Product, etc.)
- `afterAll()` - is executed after any other code in the file. Should be used to cleanup the environment after the test suite execution (eg. deleting the Product, etc.)

Every test suite must delete all impCentral entities (Products, Device Groups, Deployments, etc.) which were created during the tests running.

If a test suite needs a new input parameter (eg. an unbound key or a Webhook url) it should be provided via a new environment variable. The environment variable must be documented in this readme file.

There is a common util file - [imp-central-impt/spec/ImptTestHelper.js](../spec/ImptTestHelper.js) - that contains useful methods which may be used by different test suites. The file may be extended by adding more reusable methods during new tests development.


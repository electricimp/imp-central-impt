## Testing ##

The library contains [Jasmine](https://www.npmjs.com/package/jasmine) tests in the [spec folder](../spec). To setup and run them, you will need to:
1. Clone or download the latest version of *imp-central-impt* repository to a local *imp-central-impt* folder. For example, by a command `git clone --recursive https://github.com/electricimp/imp-central-impt.git imp-central-impt`
1. Install imp-central-impt dependencies by calling `npm install` command from your local *imp-central-impt* folder.
1. Set the mandatory environment variables:
    - **IMPT_USER_EMAIL** - impCentral account username or email address.
    - **IMPT_USER_PASSWORD** - the account password.
    - **IMPT_DEVICE_IDS** - comma separated list of Device IDs that will be used for tests execution.
1. If needed, set optional environment variables:
    - **IMPT_DEBUG** - if *true*, displays additional output of the command execution (default: *false*).
    - **IMPT_ENDPOINT** - impCentral API endpoint (default: *https://api.electricimp.com/v5*)
1. Alternatively, instead of the environment variables setting, you can directly specify the values of the corresponding variables in your local [imp-central-impt/spec/config.js file](../spec/config.js).
1. Run the tests by calling `npm test` command from your local *imp-central-impt* folder.

**Important** Tests need to be run either on an imp001 or an imp002 as some of them are designed to fail with an `"Out of memory"` error, which does not happen on imp modules with more memory available.

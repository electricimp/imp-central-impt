# climp Commands Manual

## General

### List Of Commands

**[climp help](#help-command)**

**[climp product create](#product-create)**  
**[climp product update](#product-update)**  

**[climp test init](#test-init)**  
**[climp test info](#test-info)**  
**[climp test github](#test-github)**  
**[climp test run](#test-run)**  
**[climp test delete](#test-delete)**

### Command Syntax

**climp <command_group> \[<command_name>] \[\<options>]**, where:
- **<command_group>** - a logical group of commands
- **<command_name>** - a command name, unique inside the group. Few commands do not have <command_name> but only <command_group>.
- **\<options>** - one or more options applicable to a corresponded command. Most of commands has them. Options may be written in any order.

One **option** has the following format:
  
**--<option_name> [<option_value>]** or **-<option_alias> [<option_value>]**, where:
- **<option_name>** - is unique across a particular command. For a user convenience many of the option names are reused across different commands.
- **<option_alias>** - a one letter alias for the option, unique for a particular command. Not all but many options have aliases.
- **<option_value>** - a value of the option. Not all options require value. If option value has spaces it must be put into double quotes (“”).

### Entity Identification

Applicable to impCentral API entities: Product, Device Group, Device, Build (Deployment).

**The rules** how the tool searches an entity:

- There is an order of attributes for every entity type (see below).
- The tool starts from the first attribute in the order and searches the specified value for
this attribute.
- If no entity is found for this attribute, the tool searches the specified value for the next
attribute in the order.
- If one and only one entity is found for the particular attribute, the search is stopped, the
command is processed for the found entity.
- If more than one entity is found for the particular attribute, the search is stopped, the
command is failed.
- If no entity is found for all attributes, the command is usually failed (depends on a
command).

#### Product Identifier
Option: **--product <PRODUCT_IDENTIFIER>**

Attributes accepted as <PRODUCT_IDENTIFIER> (in order of search):
- Product Id (always unique)
- Product Name (unique for all Products owned by a particular user)

#### Device Group Identifier
Option: **--dg <DEVICE_GROUP_IDENTIFIER>**

Attributes accepted as <DEVICE_GROUP_IDENTIFIER> (in order of search):
- Device Group Id (always unique)
- Device Group Name (unique for all Device Groups in a Product)

#### Device Identifier
Option: **--device <DEVICE_IDENTIFIER>**

Attributes accepted as <DEVICE_IDENTIFIER> (in order of search):
- Device Id (always unique)
- MAC address
- IP address
- IMP Agent Id
- Device Name

#### Build Identifier
Option: **--build <BUILD_IDENTIFIER>**

Attributes accepted as <BUILD_IDENTIFIER> (in order of search):
- Deployment Id (always unique)
- sha
- tag
- origin

### Project File

Project File is *.climp.project-settings* file located in a directory. Different directories may contain different Project Files. One directory may contain not more than one Project File.

Project File references a Device Group ("development" or "pre-factory" types of Device Group only) and, correspondingly, the Product which contains that Device Group.

Project File may affect commands called from the directory where the file is located. Device Group and/or Product referenced by Project File may be assumed by a command, if they are not specified explicitly.

## Commands Description

In alphabetical order.

### Help Command

**climp help**

Displays the list of all commands (w/o command options). To display the details of every command use the command’s **--help** option.

### Product Manipulation Commands

#### Product Create

**climp product create --name <product_name> \[--descr <product_description>] \[--debug] \[--help]**

Creates a new Product with the specified Name and Description (if specified).
Fails if Product with the specified Name already exists.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Product. Must be unique for all Products owned by a particular Account. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product Update

**climp product update \[--product <PRODUCT_IDENTIFIER>] \[--name <product_name>] \[--descr <product_description>] \[--debug] \[--help]**

Updates the specified Product by a new Name and/or Description.
Fails if the specified Product does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | no | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed. If no Project File, the command fails. |
| --name | -n | no | yes | New Name of the Product. Must be unique for all Products owned by a particular Account. |
| --descr | -s | no | yes | New Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Test Commands

#### Test Delete

**test delete \[--github-config <github_credentials_file_name>] \[--builder-config <builder_file_name>] \[--force] \[--debug] \[--help]**

Deletes (if existed) test configuration file *.climp.test* in the current directory, the specified github credentials configuration file, the specified file with *Builder* variables.

A user is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | | no | yes | A path to the github credentials configuration file that should be deleted. A relative or absolute path can be used. If the option is absent, *.climp.github-info* file in the current directory is assumed. |
| --builder-config | | no | yes | A path to the file with *Builder* variables that should be deleted. A relative or absolute path can be used. If the option is absent, *.climp.builder* file in the current directory is assumed. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Github

**test github \[--github-config <github_credentials_file_name>] --user <github_username> --pwd <github_password> \[--force] \[--debug] \[--help]**

Creates or updates github credentials configuration file.

If the file already exists, a user is informed and asked to:
- Cancel the operation
- Continue the operation (done automatically with **--force** option). In this case the existing github credentials configuration file is updated by the new option values provided.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | | no | yes | A path to the github credentials configuration file. A relative or absolute path can be used. If the option is absent, *.climp.github-info* file in the current directory is assumed. |
| --user | -u | yes | yes | GitHub username. |
| --pwd | -w | yes | yes | GitHub password or personal access token. |
| --force | -f | no | no | Forces the github credentials configuration file update (if existed) by the new option values w/o asking a user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Info

**test info \[--debug] \[--help]**

Displays information about the current test configuration (if test configuration file *.climp.test* exists in the current directory).
With every call the latest actual information is obtained using impCentral API.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Init

**test init \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file \[<device_file>]] \[--agent-file \[<agent_file>]] \[--timeout \<timeout>] \[--stop-on-fail \[true|false]] \[--test-file <test_file_name_pattern>] \[--force] \[--debug] \[--help]**

Creates or updates test configuration file *.climp.test* in the current directory.

If the current directory already contains test configuration file, a user is informed and asked to:
- Cancel the operation
- Continue the operation (done automatically with **--force** option). In this case the existing test configuration file is updated by the new option values provided. Options which are not specified in the command keep their previous values from the existing test configuration file.

At the end of the command execution information about the test configuration is displayed (the same as by [Test Info command](#test-info)).

| Option | Alias | Mandatory? | Value Required? | Description | When option is not specified and test configuration file does not exist in the current directory |
| --- | --- | --- | --- | --- | --- |
| --dg | -g | no | yes | [Device Group Identifier](#device-group-identifier) of a group whose devices are used for tests execution. | The command is stopped with an error. |
| --device-file | -x | no | no | A path to a file with the device source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. | No additional device code is deployed. |
| --agent-file | -y | no | no | A path to a file with the agent source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. | No additional agent code is deployed. |
| --timeout | -t | no | yes | A timeout period (in seconds) after which the tests are interrupted and considered as failed. | By default: 30 seconds. |
| --stop-on-fail | | no | no | If *true* or no value: the tests execution is stopped after a test failure. If *false* value: the tests execution is not stopped after a failure. | By default: *false* |
| --test-file | | no | yes | Test file name or pattern. All files located in the current directory (and its subdirectories) which names match this pattern are considered as files with Test Cases. This option may be repeated several times to specify several names and/or patterns. | By default: *"\*.test.nut" "tests/\*\*/\*.test.nut"* |
| --force | -f | no | no | Forces the test configuration file update (if existed) by the new option values w/o asking a user. | n/a |
| --debug | -z | no | no | Displays debug info of the command execution. | n/a |
| --help | -h | no | no | Displays description of the command. Ignores any other options. | n/a |

#### Test Run

**test run \[--tests <testcase_pattern>] \[--github-config <github_credentials_file_name>] \[--builder-config <builder_file_name>] \[--debug] \[--help]**

Runs the tests specified by test configuration file *.climp.test* (if exists in the current directory).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --tests | | no | yes | A pattern for selective test runs, allows to execute a single test or a set of tests from one or several Test Cases. The syntax of the pattern: *\[testFileName]:\[testClass].\[testMethod]* If the option is missed all tests from all test files specified in the test configuration are executed. |
| --github-config | | no | yes | A path to the github credentials configuration file. A relative or absolute path can be used. If the option is absent, *.climp.github-info* file in the current directory is assumed. |
| --builder-config | | no | yes | A path to the file with *Builder* variables. A relative or absolute path can be used. If the option is absent, *.climp.builder* file in the current directory is assumed. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |


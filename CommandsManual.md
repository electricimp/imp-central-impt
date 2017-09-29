# climp Commands Manual

## General

### List Of Commands

**[climp help](#help-command)**

**[climp product create](#product-create)**

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
| --name | -n | yes | yes | Name of the Product. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Display debug info of the command execution. |
| --help | -h | no | no | Display description of the command. Ignore any other options. |

### Test Commands

#### Test Init

**test init \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file \[<device_file>]] \[--agent-file \[<agent_file>]] \[--timeout \<timeout>] \[--stop-on-fail] \[--tests <test_file_names_pattern>] \[--create-templates] \[--force] \[--debug] \[--help]**

Creates or updates test configuration file (*.climp.test*) in the current directory.

If the current directory already contains test configuration file, a user is informed and asked to:
- Cancel the operation
- Continue the operation (done automatically with **--force** option). In this case the existing test configuration file is updated by the new option values provided. Options which are not specified in the command keep their previous values from the existing test configuration file.

At the end of the command execution information about the test configuration is displayed (the same as by [Test Info command](#test-info)).

| Option | Alias | Mandatory? | Value Required? | Description | When option is not specified and test configuration file does not exist in the current directory |
| --- | --- | --- | --- | --- | --- |
| --dg | -g | no | yes | [Device Group Identifier](#device-group-identifier) of a group whose devices are used for tests execution. | The command is stopped with an error. |
| --device-file | -x | no | yes |  | No additional device code is deployed. |
| --agent-file | -y | no | yes |  | No additional agent code is deployed. |
| --timeout | -t | no | yes | A timeout period (in seconds) after which the tests are interrupted and considered as failed. | By default: 30 seconds. |
| --stop-on-fail | | no | no | The tests execution is stopped after a test failure. | By default: the tests execution is not stopped after a failure. |
| --tests | | no | yes | Test file names pattern. All files located in the current directory (and its subdirectories) which names match this pattern are considered as files with Test Cases. | By default: |
| --create-templates | -c | no | no | | n/a |
| --force | -f | no | no | Forces the test configuration file updated (if existed) by the new option values w/o asking a user. | n/a |
| --debug | -z | no | no | Display debug info of the command execution. | n/a |
| --help | -h | no | no | Display description of the command. Ignore any other options. | n/a |

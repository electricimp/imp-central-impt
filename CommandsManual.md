# impt Commands Manual

## General

### List Of Commands

**[impt help](#help-command)**

**[impt product create](#product-create)**  
**[impt product delete](#product-delete)**  
**[impt product info](#product-info)**  
**[impt product list](#product-list)**  
**[impt product update](#product-update)**  

**[impt dg create](#device-group-create)**  
**[impt dg delete](#device-group-delete)**  
**[impt dg info](#device-group-info)**  
**[impt dg list](#device-group-list)**  
**[impt dg reassign](#device-group-reassign)**  
**[impt dg restart](#device-group-restart)**  
**[impt dg unassign](#device-group-unassign)**  
**[impt dg update](#device-group-update)**  

**[impt device assign](#device-assign)**  
**[impt device info](#device-info)**  
**[impt device list](#device-list)**  
**[impt device remove](#device-remove)**  
**[impt device restart](#device-restart)**  
**[impt device unassign](#device-unassign)**  
**[impt device update](#device-update)**  

**[impt build deploy](#build-deploy)**  
**[impt build run](#build-run)**  

**[impt test init](#test-init)**  
**[impt test info](#test-info)**  
**[impt test github](#test-github)**  
**[impt test run](#test-run)**  
**[impt test delete](#test-delete)**

### Command Syntax

**impt <command_group> \[<command_name>] \[\<options>]**, where:
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
command fails.
- If no entity is found for all attributes, the command usually fails (depends on a
command).

#### Product Identifier
Option: **--product <PRODUCT_IDENTIFIER>**

Attributes accepted as <PRODUCT_IDENTIFIER> (in order of search):
- Product Id (always unique)
- Product Name (unique among all Products owned by a particular user)

#### Device Group Identifier
Option: **--dg <DEVICE_GROUP_IDENTIFIER>**

Attributes accepted as <DEVICE_GROUP_IDENTIFIER> (in order of search):
- Device Group Id (always unique)
- Device Group Name (unique among all Device Groups in a Product)

#### Device Identifier
Option: **--device <DEVICE_IDENTIFIER>**

Attributes accepted as <DEVICE_IDENTIFIER> (in order of search):
- Device Id (always unique)
- MAC address
- IMP Agent Id
- IP address **TBD**
- Device Name

#### Build Identifier
Option: **--build <BUILD_IDENTIFIER>**

Attributes accepted as <BUILD_IDENTIFIER> (in order of search):
- Deployment Id (always unique)
- sha
- tag
- origin

### Project File

Project File is *.impt.project* **TBD** file located in a directory. Different directories may contain different Project Files. One directory may contain not more than one Project File.

Project File references a Device Group ("development" or "pre-factory" - **TBD** - types of Device Group only) and, correspondingly, the Product which contains that Device Group.

Project File may affect commands called from the directory where the file is located. Device Group, Product, source files referenced by Project File may be assumed by a command, if they are not specified explicitly.

## Commands Description

In alphabetical order.

### Build Manipulation Commands

#### Build Deploy

**impt build deploy \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--descr <build_description>] \[--origin \<origin>] \[--tag \<tag>] \[--flagged \[true|false]] \[--debug] \[--help]**

Creates a build (Deployment) from the specified source files, with Description (if specified) and attributes (if
specified) and deploys it to all Devices of the specified Device Group.

Fails if one or both of the specified source files do not exist or the specified Device Group does not exist.

The new build is not ran until the Devices are rebooted. To run it call **[impt dg restart](#device-group-restart)** or **[impt device restart](#device-restart)** command.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | yes/[project](#project-file) | yes | Name of a file which contains a source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --agent-file | -y | yes/[project](#project-file) | yes | Name of a file which contains a source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --origin | | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Run

**impt build run \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--descr <build_description>] \[--origin \<origin>] \[--tag \<tag>] \[--flagged \[true|false]] \[--log] \[--debug] \[--help]**

Creates, deploys and runs a build (Deployment). Optionally, displays logs of the running build.

It behaves exactly like **[impt build deploy](#build-deploy)** command followed by **[impt dg restart](#device-group-restart)** command and, optionally, by **[impt log stream](#log-stream)** command.

Fails if one or both of the specified source files do not exist or the specified Device Group does not exist.
Informs user if the specified Device Group does not have assigned Devices, in this case the Deployment is created anyway.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | yes/[project](#project-file) | yes | Name of a file which contains a source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --agent-file | -y | yes/[project](#project-file) | yes | Name of a file which contains a source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --origin | | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --log | -l | no | no | Starts displaying logs from the Devices assigned to the specified Device Group (see **[impt log stream](#log-stream)** command description). To stop logs displaying press *\<Ctrl-C>*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |


### Device Manipulation Commands

#### Device Assign

**impt device assign --device <DEVICE_IDENTIFIER> \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Assigns the specified Device to the specified Device Group.
Fails if the specified Device Group does not exist.

User is asked to confirm the operation (confirmed automatically with **--force** option) when:
- the specified Device Group is of the production/pre-production type ? **TBD**
- the specified Device is already assigned to another Device Group. If operation is confirmed, the Device is reassigned to the new Device Group, may fail for some combinations of the Device Groups.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Info

**impt device info --device <DEVICE_IDENTIFIER> \[--debug] \[--help]**

Displays information about the specified Device.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device List

**impt device list \[--my] \[--unassigned] \[--assigned] \[--online] \[--offline] \[--product-id <product_id>] \[--product-name <product_name>] \[--dg-type <device_group_type>] \[--dg-id <device_group_id>] \[--dg-name <device_group_name>] \[--debug] \[--help]**

Displays information about all Devices available for the current logged-in account. **TBD** or owned only?.

The returned list of the Devices may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times - **TBD**

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| **TBD** --my | | no | no | Devices owned by the current logged-in account only. |
| --unassigned | | no | no | Unassigned Devices only. |
| --assigned | | no | no | Assigned Devices only. |
| --online | | no | no | Devices in online state only. |
| --offline | | no | no | Devices in offline state only. |
| --product-id | | no | yes | Devices assigned to Device Groups which belong to the specified Product only. |
| **TBD** --product-name | | no | yes | Devices assigned to Device Groups which belong to the specified Product only. |
| --dg-type | | no | yes | Devices assigned to Device Groups of the specified type only. Valid values are: **TBD**. |
| --dg-id | | no | yes | Devices assigned to the specified Device Group only. |
| **TBD** --dg-name | | no | yes | Devices assigned to the specified Device Group only. |

#### Device Remove

**impt device remove --device <DEVICE_IDENTIFIER> \[--force] \[--debug] \[--help]**

Removes the specified Device from the logged-in account.

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Restart

**impt device restart --device <DEVICE_IDENTIFIER> \[--debug] \[--help]**

Reboots the specified Device.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Unassign

**impt device unassign --device <DEVICE_IDENTIFIER> \[--unbond <unbond_key>] \[--debug] \[--help]**

Unassigns the specified Device.
Does nothing if the Device already unassigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| **TBD** --unbond | | no | yes | Unbond key is required to unassign Device from a production Device Group. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Update

**impt device update --device <DEVICE_IDENTIFIER> --name <device_name> \[--debug] \[--help]**

Updates Name of the specified Device.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --name | -n | yes | yes | New Name of the Device. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Device Group Manipulation Commands

#### Device Group Create

**impt dg create --name <device_group_name> --type <device_group_type> \[--product <PRODUCT_IDENTIFIER>] \[--descr <device_group_description>] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Creates a new Device Group.
Fails if Device Group with the specified Name already exists in the specified Product.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Device Group. Must be unique among all Device Groups in the specified Product. |
| --type | | yes | yes | Type of the Device Group. Valid values are: **TBD**. If the value is invalid, the command fails. |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier) of the Product which the Device Group belongs to. If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the Device Group. |
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being created Device Group. May be specified for the being created Device Group of the type **TBD** or **TBD** only. The target Device Group must be of the type **TBD** or **TBD** correspondingly. Otherwise the command fails. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Delete

**impt dg delete \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Deletes the specified Device Group.

**TBD** - from the spec: Device Groups cannot be deleted if any of the following are true:
    there are devices assigned to the group
    the group is the production target of a pre_factoryfixture or factoryfixture group
    the group has any flagged deployments

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Info

**impt dg info \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Displays information about the specified Device Group.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group List

**impt dg list \[--my] \[--type <device_group_type>] \[--product-id <product_id>] \[--product-name <product_name>] \[--debug] \[--help]**

Displays information about all Device Groups available for the current logged-in account.

The returned list of the Device Groups may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times - **TBD**

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --my | | no | no | Device Groups owned by the current logged-in account only. |
| --type | | no | yes | Device Groups of the specified type only. Valid values are: **TBD**. |
| --product-id | | no | yes | Device Groups which belong to the specified Product only. |
| **TBD** --product-name | | no | yes | Device Groups which belong to the specified Product only. |

#### Device Group Reassign

**impt dg reassign --from <DEVICE_GROUP_IDENTIFIER> \[--to <DEVICE_GROUP_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Reassigns all Devices from one Device Group to another.
Fails if any of the specified Device Groups does not exist.

User is asked to confirm the operation when the specified Device Groups are of different types or belong to different Products (confirmed automatically with **--force** option).

The operation may fail for some combinations of the Device Groups.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes | yes | [Device Identifier](#device-identifier). |
| --from | | yes | yes | [Device Group Identifier](#device-group-identifier) of the origin Device Group. |
| --to | | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier) of the destination Device Group. If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Restart

**impt dg restart \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Reboots all Devices assigned to the specified Device Group.
Does nothing if the Device Group has no Devices assigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Unassign

**impt dg unassign \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--unbond <unbond_key>] \[--debug] \[--help]**

Unassigns all Devices from the specified Device Group.
Does nothing if the Device Group has no Devices assigned.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| **TBD** --unbond | | no | yes | Unbond key is required to unassign Devices from a production Device Group. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Update

**impt dg update \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--name <device_group_name>] \[--descr <device_group_description>] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--load-code-after-blessing \[true|false]] \[--debug] \[--help]**

Updates the specified Device Group.
Fails if the specified Device Group does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --name | -n | no | yes | New Name of the Device Group. Must be unique among all Device Groups in the Product. |
| --descr | -s | no | yes | Description of the Device Group. |
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being updated Device Group. May be specified for the being update Device Group of the type **TBD** or **TBD** only. The target Device Group must be of the type **TBD** or **TBD** correspondingly. Otherwise the command fails. |
| --load-code-after-blessing | | no | no | Applicable to Device Group of the type **TBD**. If *true* or no value, production code is immediately loaded by the device after blessing. If *false*, production code will be loaded the next time the device connects as part of BlinkUp, whether successful or not. Note, the newly created production Device Group always has this option *true*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Help Command

**impt help**

Displays the list of all commands (w/o command options). To display the details of every command use the command’s **--help** option.

### Product Manipulation Commands

#### Product Create

**impt product create --name <product_name> \[--descr <product_description>] \[--debug] \[--help]**

Creates a new Product.
Fails if Product with the specified Name already exists.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Product. Must be unique among all Products owned by the logged-in account. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product Delete

**impt product delete \[--product <PRODUCT_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Deletes the specified Product.

**TBD** - deletes Device Groups?

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product Info

**impt product info \[--product <PRODUCT_IDENTIFIER>] \[--debug] \[--help]**

Displays information about the specified Product.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Product List

**impt product list \[--my] \[--debug] \[--help]**

Displays information about all Products available for the current logged-in account.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --my | | no | no | Displays information about Products owned by the current logged-in account only.  |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |


#### Product Update

**impt product update \[--product <PRODUCT_IDENTIFIER>] \[--name <product_name>] \[--descr <product_description>] \[--debug] \[--help]**

Updates the specified Product by a new Name and/or Description.
Fails if the specified Product does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier). If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --name | -n | no | yes | New Name of the Product. Must be unique among all Products owned by a particular Account. |
| --descr | -s | no | yes | Description of the Product. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Test Commands

#### Test Delete

**impt test delete \[--github-config <github_credentials_file_name>] \[--builder-config <builder_file_name>] \[--force] \[--debug] \[--help]**

Deletes (if existed) test configuration file *.impt.test* in the current directory, the specified github credentials configuration file, the specified file with *Builder* variables.

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | | no | yes | A path to the github credentials configuration file that should be deleted. A relative or absolute path can be used. If the option is absent, *.impt.github-info* file in the current directory is assumed. |
| --builder-config | | no | yes | A path to the file with *Builder* variables that should be deleted. A relative or absolute path can be used. If the option is absent, *.impt.builder* file in the current directory is assumed. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Github

**impt test github \[--github-config <github_credentials_file_name>] --user <github_username> --pwd <github_password> \[--force] \[--debug] \[--help]**

Creates or updates github credentials configuration file.

If the file already exists, a user is informed and asked to:
- Cancel the operation
- Continue the operation (done automatically with **--force** option). In this case the existing github credentials configuration file is updated by the new option values provided.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | | no | yes | A path to the github credentials configuration file. A relative or absolute path can be used. If the option is absent, *.impt.github-info* file in the current directory is assumed. |
| --user | -u | yes | yes | GitHub username. |
| --pwd | -w | yes | yes | GitHub password or personal access token. |
| --force | -f | no | no | Forces the github credentials configuration file update (if existed) by the new option values w/o asking a user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Info

**impt test info \[--debug] \[--help]**

Displays information about the current test configuration (if test configuration file *.impt.test* exists in the current directory).
With every call the latest actual information is obtained using impCentral API.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Init
 
**impt test init \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file \[<device_file>]] \[--agent-file \[<agent_file>]] \[--timeout \<timeout>] \[--stop-on-fail \[true|false]] \[--test-file <test_file_name_pattern>] \[--force] \[--debug] \[--help]**

Creates or updates test configuration file *.impt.test* in the current directory.

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

**impt test run \[--tests <testcase_pattern>] \[--github-config <github_credentials_file_name>] \[--builder-config <builder_file_name>] \[--debug] \[--help]**

Runs the tests specified by test configuration file *.impt.test* (if exists in the current directory).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --tests | | no | yes | A pattern for selective test runs, allows to execute a single test or a set of tests from one or several Test Cases. The syntax of the pattern: *\[testFileName]:\[testClass].\[testMethod]* If the option is missed all tests from all test files specified in the test configuration are executed. |
| --github-config | | no | yes | A path to the github credentials configuration file. A relative or absolute path can be used. If the option is absent, *.impt.github-info* file in the current directory is assumed. |
| --builder-config | | no | yes | A path to the file with *Builder* variables. A relative or absolute path can be used. If the option is absent, *.impt.builder* file in the current directory is assumed. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |


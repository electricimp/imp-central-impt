# impt Commands Manual

## General

### List Of Commands

**[impt build delete](#build-delete)**  
**[impt build deploy](#build-deploy)**  
**[impt build get](#build-get)**  
**[impt build info](#build-info)**  
**[impt build list](#build-list)**  
**[impt build run](#build-run)**  
**[impt build update](#build-update)**  

**[impt device assign](#device-assign)**  
**[impt device info](#device-info)**  
**[impt device list](#device-list)**  
**[impt device remove](#device-remove)**  
**[impt device restart](#device-restart)**  
**[impt device unassign](#device-unassign)**  
**[impt device update](#device-update)**  

**[impt dg create](#device-group-create)**  
**[impt dg delete](#device-group-delete)**  
**[impt dg info](#device-group-info)**  
**[impt dg list](#device-group-list)**  
**[impt dg reassign](#device-group-reassign)**  
**[impt dg restart](#device-group-restart)**  
**[impt dg unassign](#device-group-unassign)**  
**[impt dg update](#device-group-update)**  

**[impt help](#help-command)**

**[impt log get](#log-get)**  
**[impt log stream](#log-stream)**  

**[impt login](#login-command)**  
**[impt logout](#logout-command)**  

**[impt product create](#product-create)**  
**[impt product delete](#product-delete)**  
**[impt product info](#product-info)**  
**[impt product list](#product-list)**  
**[impt product update](#product-update)**  

**[impt project create](#project-create)**  
**[impt project delete](#project-delete)**  
**[impt project info](#project-info)**  
**[impt project link](#project-link)**  
**[impt project update](#project-update)**  

**[impt test init](#test-init)**  
**[impt test info](#test-info)**  
**[impt test github](#test-github)**  
**[impt test run](#test-run)**  
**[impt test delete](#test-delete)**

**[impt webhook create](#webhook-create)**  
**[impt webhook delete](#webhook-delete)**  
**[impt webhook info](#webhook-info)**  
**[impt webhook list](#webhook-list)**  
**[impt webhook update](#webhook-update)**  

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
- IP address
- Device Name

#### Build Identifier
Option: **--build <BUILD_IDENTIFIER>**

Attributes accepted as <BUILD_IDENTIFIER> (in order of search):
- Deployment Id (always unique)
- sha
- tag
- origin

### Device Group Type

The tool commands accept the following constants to specify a type of Device Group:
- *development* - for impCentral API "development_devicegroup" type
- *pre-factory* - for impCentral API "pre_factoryfixture_devicegroup" type
- *pre-production* - for impCentral API "pre_production_devicegroup" type
- *factory* - for impCentral API "factoryfixture_devicegroup" type
- *production* - for impCentral API "production_devicegroup" type

### Auth File

Auth File is *.impt.auth* file. It stores authentication and other information necessary to execute the tool commands. There are two types of Auth File - local and global. The both types have identical format and store similar information.

#### Local Auth File

Local Auth File is Auth File located in the directory from where a tool command is called. Different directories may contain different Local Auth Files. One directory may contain not more than one Local Auth File.

Any command called from a directory where Local Auth File exists is executed in the context (with authentication and other settings) defined by that Local Auth File.
If the current directory does not contain Local Auth File, the command is executed in the context defined by [Global Auth File](#global-auth-file).

#### Global Auth File

Global Auth File affects the tool commands which are called from a directory where [Local Auth File](#local-auth-file) does not exist. There may be not more than one Global Auth File per the tool installation. It is located in the tool specific place.

Any command called from a directory where [Local Auth File](#local-auth-file) does not exist is executed in the context (with authentication and other settings) defined by the Global Auth File. If the both Local Auth File and Global Auth File do not exist, the command fails.

### Project File

Project File is *.impt.project* file located in a directory. Different directories may contain different Project Files. One directory may contain not more than one Project File.

Project File contains settings for a project - an entity which links the source files in the current directory with a concrete Device Group.
Project File references the linked Device Group (of the [types](#device-group-type) *development* or *pre-factory* only) and, correspondingly, the Product which contains that Device Group, Devices assigned to the Device Group, Deployments created for that Device Group, etc.

Project File may affect commands called from the directory where the file is located. Product, Device Group, Devices, Deployment, source files referenced by Project File may be assumed by a command when they are not specified explicitly.

### Test Configuration File

Test Configuration File is *.impt.test* file located in a directory. Different directories may contain different Test Configuration Files. One directory may contain not more than one Test Configuration File.

Test Configuration File contains settings to run unit tests that are built with the [*impUnit*](https://github.com/electricimp/impUnit) test framework.

Test Configuration File affects [Test Commands](#test-commands) only.

## Commands Description

In alphabetical order.

### Account Manipulation Commands

**TBD**

### Build Manipulation Commands

#### Build Delete

**impt build delete --build <BUILD_IDENTIFIER> \[--force] \[--debug] \[--help]**

Deletes the specified build (Deployment).

The command fails if:
- the Deployment has *"flagged"* attribute set to *true*. Use [**impt build update**](#build-update) command to update the attribute.
- it is the most recent Deployment of a Device Group.

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes | yes | [Build Identifier](#build-identifier). |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

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
| --origin | -o | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Get

**impt build get \[--build <BUILD_IDENTIFIER>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--device-only] \[--agent-only] \[--force] \[--debug] \[--help]**

Downloads the source files of the specified build (Deployment) and displays information about the build.

If the files with the specified names already exist in the current directory, user is asked to confirm their overwriting (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-file | -x | yes/[project](#project-file) | yes | Name of a file to where download the source code for IMP device. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --agent-file | -y | yes/[project](#project-file) | yes | Name of a file to where download the source code for IMP agent. If not specified, the file referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --device-only | | no | yes | Downloads the source code for IMP device only. |
| --agent-only | | no | yes | Downloads the source code for IMP agent only. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Info

**impt build info \[--build <BUILD_IDENTIFIER>] \[--debug] \[--help]**

Displays information about the specified build (Deployment).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build List

**impt build list \[--my] \[--sha <deployment_sha>] \[--tag \<tag>] \[--flagged \[true|false]] \[--product-id <product_id>] \[--product-name <product_name>] \[--dg-type <device_group_type>] \[--dg-id <device_group_id>] \[--dg-name <device_group_name>] \[--debug] \[--help]**

Displays information about all builds (Deployments) available to the current logged-in account.

The returned list of the builds may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| **TBD** --my | | no | no | Builds owned by the current logged-in account only. |
| --sha | | no | yes | Builds with the specified *SHA* only. |
| --tag | | no | yes | Builds with the specified tag only. |
| --flagged | | no | no | If *true* or no value, builds with the flagged attribute set to *true* only. If *false*, builds with the flagged attribute set to *false* only. |
| --product-id | | no | yes | Builds deployed to Device Groups which belong to the specified Product only. |
| --product-name | | no | yes | Builds deployed to Device Groups which belong to the specified Product only. |
| --dg-type | | no | yes | Builds deployed to Device Groups of the specified [type](#device-group-type) only. |
| --dg-id | | no | yes | Builds deployed to the specified Device Group only. |
| --dg-name | | no | yes | Builds deployed to the specified Device Group only. |

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
| --origin | -o | no | yes | A free-form key to store the source of the code. |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --flagged | | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this option back to *false*. If *false* or the option is not specified, the build can be deleted. |
| --log | -l | no | no | Starts displaying logs from the Devices assigned to the specified Device Group (see **[impt log stream](#log-stream)** command description). To stop displaying the logs press *\<Ctrl-C>*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Build Update

**impt build update \[--build <BUILD_IDENTIFIER>] \[--descr <build_description>] \[--tag \<tag>] \[--remove-tag \<tag>] \[--flagged \[true|false]] \[--debug] \[--help]**

Updates Description, tags and flagged attribute (whatever specified) of the specified build (Deployment).
Fails if the specified build (Deployment) does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --build | -b | yes/[project](#project-file) | yes | [Build Identifier](#build-identifier). If not specified, the most recent Deployment for the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the build (Deployment). |
| --tag | -t | no | yes | A tag applied to this build (Deployment). This option may be repeated several times to apply several tags. |
| --remove-tag | -r | no | yes | A tag removed from this build (Deployment). This option may be repeated several times to remove several tags. |
| --flagged | | no | no | If *true* or no value, this build (Deployment) cannot be deleted without first setting this attribute back to *false*. If *false*, the build can be deleted. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |


### Device Manipulation Commands

#### Device Assign

**impt device assign --device <DEVICE_IDENTIFIER> \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Assigns the specified Device to the specified Device Group.
Fails if the specified Device Group does not exist.

User is asked to confirm the operation (confirmed automatically with **--force** option) when:
- the specified Device Group is of the [types](#device-group-type) *production* or *pre-production* **TBD** - does it work at all?
- the specified Device is already assigned to another Device Group. If operation is confirmed, the Device is reassigned to the new Device Group, but may fail for some combinations of the Device Groups.

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

Displays information about all Devices available to the current logged-in account.

The returned list of the Devices may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times.

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
| --product-name | | no | yes | Devices assigned to Device Groups which belong to the specified Product only. |
| --dg-type | | no | yes | Devices assigned to Device Groups of the specified [type](#device-group-type) only. |
| --dg-id | | no | yes | Devices assigned to the specified Device Group only. |
| --dg-name | | no | yes | Devices assigned to the specified Device Group only. |

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
| --unbond | | no | yes | Unbond key is required to unassign Device from Device Group of the [type](#device-group-type) *production*. |
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

Creates a new Device Group for the specified Product.
Fails if Device Group with the specified Name already exists in the specified Product.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | yes | yes | Name of the Device Group. Must be unique among all Device Groups in the specified Product. |
| --type | | yes | yes | [Type](#device-group-type) of the Device Group. If the value is invalid, the command fails. |
| --product | -p | yes/[project](#project-file) | yes | [Product Identifier](#product-identifier) of the Product which the Device Group belongs to. If not specified, the Product referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --descr | -s | no | yes | Description of the Device Group. |
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being created Device Group. May be specified for the being created Device Group of the [type](#device-group-type) *factory* or *pre-factory* only. The target Device Group must be of the [type](#device-group-type) *production* or *pre-production* correspondingly and belongs to the specified Product. Otherwise the command fails. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Device Group Delete

**impt dg delete \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--force] \[--debug] \[--help]**

Deletes the specified Device Group.

The command fails if:
- there are Devices assigned to this Device Group. Use [**impt dg unassign**](#device-group-unassign) or [**impt dg reassign**](#device-group-reassign) commands to unassign the Devices.
- the Device Group has any Deployments with *"flagged"* attribute set to *true*. Use [**impt build update**](#build-update) command to update that attribute.
- the Device Group is the production target of another Device Group of the [type](#device-group-type) *factory* or *pre-factory*. Use [**impt dg update**](#device-group-update) to update the production target of that Device Group.

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

Displays information about all Device Groups available to the current logged-in account.

The returned list of the Device Groups may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --my | | no | no | Device Groups owned by the current logged-in account only. |
| --type | | no | yes | Device Groups of the specified [type](#device-group-type) only. |
| --product-id | | no | yes | Device Groups which belong to the specified Product only. |
| --product-name | | no | yes | Device Groups which belong to the specified Product only. |

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
| --unbond | | no | yes | Unbond key is required to unassign Devices from a Device Group of the [type](#device-group-type) *production*. |
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
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being updated Device Group. May be specified for the being updated Device Group of the [type](#device-group-type) *factory* or *pre-factory* only. The target Device Group must be of the [type](#device-group-type) *production* or *pre-production* correspondingly and belongs to the same Product as the being updated Device Group. Otherwise the command fails. |
| --load-code-after-blessing | | no | no | Applicable to Device Group of the [type](#device-group-type) *production* (**TBD** for pre-production) only. If *true* or no value, production code is immediately loaded by the device after blessing. If *false*, production code will be loaded the next time the device connects as part of BlinkUp, whether successful or not. Note, the newly created production Device Group always has this option *true*. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Help Command

**impt help**

Displays the list of all commands (w/o command options). To display the details of every command use the command’s **--help** option.

### Log Manipulation Commands

#### Log Get

**impt log get \[--device <DEVICE_IDENTIFIER>] \[--page-size <number_of_entries>] \[--page-number <page_number>] \[--debug] \[--help]**

Displays historical logs for the specified Device.
The logs are displayed starting from the most recent one.

Note, a limited number of log entries are kept for a limited period of time.

If **--page-number** option is specified, the command displays the specified page of the log entries and finishes.

If **--page-number** option is not specified, the command displays all saved log entries by pages, starting from the page with the most recent log entries. After every page of log entries is displayed the command is paused:
- to display the next page press *\<Enter>*
- to abort the command execution press *\<Ctrl-C>*

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | yes/[project](#project-file) | yes | [Device Identifier](#device-identifier). If not specified and there is one and only one Device in the Device Group referenced by [Project File](#project-file) in the current directory, then this Device is assumed (if no Project File or the Device Group has zero or more than one Devices, the command fails). |
| --page-size | | no | no | Number of log entries in one page. Default value: 20 |
| --page-number | | no | no | Ordinal page number with the log entries to display. Must have a positive value. Page 1 is a page with the most recent log entries. If specified, the command displays this page of the log entries only. If not specified, the command displays all saved log entries. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Log Stream

**impt log stream \[--device <DEVICE_IDENTIFIER>] \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Creates a log stream and displays logs from the specified Devices in real-time.

No one command can be called while the logs are being streamed.
To stop displaying the logs press *\<Ctrl-C>*.

Note, one account can have a limited number of log streams at a time. If the limit is reached and a new log stream is created, an existing one is automatically closed.

The command allows to specify several Devices which logs will be added to the newly created log stream. It is also possible to specify one or several Device Groups. Logs from all Devices assigned to the specified Device Groups as well as from directly specified Devices will be displayed in the newly created log stream.

Note, there is a limit to the number of Devices in one log stream. If the number of the specified Devices more than the limit, **TBD**

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --device | -d | no | yes | [Device Identifier](#device-identifier) of the Device which logs will be added to the log stream. This option may be repeated several times to specify several Devices. |
| --dg | -g | no/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). This option may be repeated several times to specify several Device Groups. Logs from all Devices assigned to the specified Device Groups will be added to the log stream. **--device** and **--dg** options are cumulative. If the both **--device** and **--dg** options are not specified but there is [Project File](#project-file) in the current directory, all Devices assigned to the Device Group referenced by the [Project File](#project-file) are assumed. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Login Command

**impt login \[--local] \[--endpoint <endpoint_url>] (--user <user_id> --pwd \<password> | --login-key <login_key>) \[--debug] \[--help]**

Global or local login.

Creates [Global](#global-auth-file) or [Local](#local-auth-file) Auth File.
If the corresponding Auth File already exists, it is overwritten.

The options for one and only one of the following authentication methods must be specified in the command:
- using an account identifier and password (**--user** and **--pwd** options)
- **TBD** using a login key (**--login-key** option)

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --local | -l | no | no | If specified, creates/replaces [Local Auth File](#local-auth-file) in the current directory. If not specified, creates/replaces [Global Auth File](#global-auth-file). |
| --endpoint | -e | no | yes | impCentral API endpoint. Default value: **TBD** |
| --user | -u | yes/no | yes | The account identifier: username or email address. If specified, **--pwd** option must be specified as well. |
| --pwd | -w | yes/no | yes | The account password. If specified, **--user** option must be specified as well. |
| **TBD** --login-key | -k | yes/no | yes | The login key. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Logout Command

**impt logout \[--local] \[--debug] \[--help]**

Global or local logout.

Deletes [Global](#global-auth-file) or [Local](#local-auth-file) Auth File.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --local | -l | no | no | If specified, deletes [Local Auth File](#local-auth-file) (if existed in the current directory). If not specified, deletes [Global Auth File](#global-auth-file) (if existed). |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

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

The command fails if the Product has one or several Device Groups. Use [**impt dg delete**](#device-group-delete) command to delete a Device Group.

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

Displays information about all Products available to the current logged-in account.

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

### Project Manipulation Commands

#### Project Create

**impt project create --product <PRODUCT_IDENTIFIER> \[--create-product] --name <device_group_name> \[--descr <device_group_description>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--create-files] \[--pre-factory] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--create-target] \[--force] \[--debug] \[--help]**

Creates a new Device Group for the specified Product and creates new [Project File](#project-file) in the current directory by linking it to the new Device Group.

The command fails if:
- the specified Product does not exist and **--create-product** option is not specified. Use either **--create-product** option, or [**impt product create**](#product-create) command to create the Product before the Project.
- Device Group with the specified name already exist in the specified Product. Use [**impt project link**](#project-link) command to create the Project linked to that Device Group.
- optionally specified production target Device Group does not exist and **--create-target** option is not specified. Use either **--create-target** option, or [**impt dg create**](#project-link) command to create the required Device Group of the [type](#device-group-type) *pre-production*.

User is asked to confirm the operation if the current directory already contains [Project File](#project-file) (confirmed automatically with **--force** option). If confirmed, the existed [Project File](#project-file) is overwritten.

The created Device Group is of the [type](#device-group-type) *development* or *pre-factory* (depends on **--pre-factory** option).

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --product | -p | yes | yes | [Product Identifier](#product-identifier). |
| --create-product | | no | no | If the Product specified by **--product** option does not exist, it is created. In this case, the value of **--product** option is considered as a Name of the new Product. If the Product specified by **--product** option exists, **--create-product** option is ignored. |
| --name | -n | yes | yes | Name of the new Device Group. Must be unique among all Device Groups in the specified Product. |
| --descr | -s | no | yes | Description of the Device Group. |
| --device-file | -x | no | yes | Name of a file for IMP device source code. Default value: *device.nut* |
| --agent-file | -y | no | yes | Name of a file for IMP agent source code. Default value: *agent.nut* |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) specified by **--device-file**, **--agent-file** options does not exist. |
| --pre-factory | | no | no | If not specified, the new Device Group is of the [type](#device-group-type) *development*. If specified, the new Device Group is of the [type](#device-group-type) *pre-factory*. |
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the being created Device Group. May be specified if and only if **--pre-factory** option is specified. The specified target Device Group must be of the [type](#device-group-type) *pre-production* and belongs to the specified Product. Otherwise the command fails. |
| --create-target | | no | no | If the Device Group specified by **--target** option does not exist, it is created. In this case, the value of **--target** option is considered as a Name of the new Device Group. If **--target** option is not specified or the Device Group specified by **--target** option exists, **--create-target** option is ignored. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Delete

**impt project delete \[--dg] \[--files] \[--force] \[--debug] \[--help]**

**TBD**:
- add --product as alternative to --dg - to delete the Product (with DG), fails if there are other DGs in the Product ?

Deletes [Project File](#project-file) in the current directory and, optionally, the Device Group referenced by the Project File and the local source files.
Does nothing if there is no [Project File](#project-file) in the current directory.

User is informed about all entities which are going to be deleted or updated and asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | no | no | Also deletes the Device Group referenced by [Project File](#project-file). All Devices assigned to this Device Group to be unassigned. All Deployments for this Device Group which have *"flagged"* attribute with value *true* to be updated to set it to *false* - **TBD** for flagged. |
| --files | | no | no | Also deletes the files referenced by [Project File](#project-file) as files with IMP device and agent source code. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Info

**impt project info \[--debug] \[--help]**

Displays information about the project.
Fails if there is no [Project File](#project-file) in the current directory.
With every call the latest actual information is obtained using impCentral API.

Informs user if the Device Group referenced by [Project File](#project-file) does not exist. [Project File](#project-file) is not deleted in this case. To delete it - explicitly call [**impt project delete**](#project-delete) command.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Link

**impt project link --dg <DEVICE_GROUP_IDENTIFIER> \[--device-file <device_file>] \[--agent-file <agent_file>] \[--create-files] \[--force] \[--debug] \[--help]**

Creates new [Project File](#project-file) in the current directory by linking it to the specified Device Group.

The command fails if:
- the specified Device Group does not exist or is not unique.
- the specified Device Group is not of the [type](#device-group-type) *development* or *pre-factory*.

User is asked to confirm the operation if the current directory already contains [Project File](#project-file) (confirmed automatically with **--force** option). If confirmed, the existed [Project File](#project-file) is overwritten.

The command does not download any Deployment. To download source code from a Deployment - explicitly call [**impt build get**](#build-get) command.

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes | yes | [Device Group Identifier](#device-group-identifier). |
| --device-file | -x | no | yes | Name of a file for IMP device source code. Default value: *device.nut* |
| --agent-file | -y | no | yes | Name of a file for IMP agent source code. Default value: *agent.nut* |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) specified by **--device-file**, **--agent-file** options does not exist. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Project Update

**impt project update \[--name <device_group_name>] \[--descr <device_group_description>] \[--device-file <device_file>] \[--agent-file <agent_file>] \[--rename-files] \[--create-files] \[--target <DEVICE_GROUP_IDENTIFIER>] \[--debug] \[--help]**

Updates the project settings and/or Name, Description, production target of the Device Group referenced by [Project File](#project-file).
Fails if there is no [Project File](#project-file) in the current directory.

Informs user if the Device Group referenced by [Project File](#project-file) does not exist. [Project File](#project-file) is not updated or deleted in this case. To delete it - explicitly call [**impt project delete**](#project-delete) command.

At the end of the command execution information about the project is displayed (as by [**impt project info**](#project-info) command).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --name | -n | no | yes | New Name of the Device Group referenced by [Project File](#project-file). Must be unique among all Device Groups in the Product. |
| --descr | -s | no | yes | New Description of the Device Group referenced by [Project File](#project-file). |
| --device-file | -x | no | yes | New name of a file for IMP device source code. |
| --agent-file | -y | no | yes | New name of a file for IMP agent source code. |
| --rename-files | -r | no | no | Renames file(s) (if existed) which were referenced by [Project File](#project-file) as the file(s) with IMP device/agent source code to the new name(s) specified by **--device-file**, **--agent-file** options. Should not be specified together with **--create-files** option. |
| --create-files | -c | no | no | Creates empty file(s) if the file(s) specified by **--device-file**, **--agent-file** options does not exist. Should not be specified together with **--rename-files** option. |
| --target | | no | yes | [Device Group Identifier](#device-group-identifier) of the production target Device Group for the Device Group referenced by [Project File](#project-file). May be specified if the Device Group referenced by [Project File](#project-file) is of the [type](#device-group-type) *pre-factory* only. The specified target Device Group must be of the [type](#device-group-type) *pre-production* and belongs to the same Product as the Device Group referenced by [Project File](#project-file). Otherwise the command fails. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Test Commands

#### Test Delete

**impt test delete \[--github-config \[<github_credentials_file_name>]] \[--builder-config \[<builder_file_name>]] \[--force] \[--debug] \[--help]**

Deletes (if existed):
- [Test Configuration File](#test-configuration-file) in the current directory
- *Builder* cache (*.builder-cache* directory) in the current directory
- the specified github credentials configuration file
- the specified file with *Builder* variables

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --github-config | | no | no | A path to the github credentials configuration file that should be deleted. A relative or absolute path can be used. If the value of the option is not specified, *.impt.github-info* file in the current directory is assumed. |
| --builder-config | | no | no | A path to the file with *Builder* variables that should be deleted. A relative or absolute path can be used. If the value of the option is not specified, *.impt.builder* file in the current directory is assumed. |
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

Displays information about the tests configuration defined by [Test Configuration File](#test-configuration-file) in the current directory.
With every call the latest actual information is obtained using impCentral API.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Test Init
 
**impt test init \[--dg <DEVICE_GROUP_IDENTIFIER>] \[--device-file \[<device_file>]] \[--agent-file \[<agent_file>]] \[--timeout \<timeout>] \[--stop-on-fail \[true|false]] \[--builder-cache \[true|false]] \[--test-file <test_file_name_pattern>] \[--force] \[--debug] \[--help]**

Creates or updates [Test Configuration File](#test-configuration-file) in the current directory.

User is asked to confirm the operation if the current directory already contains Test Configuration File (confirmed automatically with **--force** option). If confirmed, the existed Test Configuration File is updated by the new option values provided, options which are not specified in the command keep their previous values from the existed Test Configuration File.

At the end of the command execution information about the tests configuration is displayed (as by [**impt test info**](#test-info) command).

| Option | Alias | Mandatory? | Value Required? | Description | When option is not specified and test configuration file does not exist in the current directory |
| --- | --- | --- | --- | --- | --- |
| --dg | -g | no | yes | [Device Group Identifier](#device-group-identifier) of a group whose devices are used for tests execution. | The command is stopped with an error. |
| --device-file | -x | no | no | A path to a file with the device source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. | No additional device code is deployed. |
| --agent-file | -y | no | no | A path to a file with the agent source code that is deployed along with the tests. A relative or absolute path can be used. Specify this option w/o a value to remove this file from the test configuration. | No additional agent code is deployed. |
| --timeout | -t | no | yes | A timeout period (in seconds) after which the tests are interrupted and considered as failed. | 30 seconds. |
| --stop-on-fail | | no | no | If *true* or no value: the tests execution is stopped after a test failure. If *false* value: the tests execution is not stopped after a failure. | *false* |
| --builder-cache | | no | no | If *true* or no value: cache external libraries in the local *.builder-cache* directory. If *false* value: do not cache external libraries. | By default: *false* |
| --test-file | | no | yes | Test file name or pattern. All files located in the current directory (and its subdirectories) which names match this pattern are considered as files with Test Cases. This option may be repeated several times to specify several names and/or patterns. | *"\*.test.nut" "tests/\*\*/\*.test.nut"* |
| --force | -f | no | no | Forces the test configuration file update (if existed) by the new option values w/o asking a user. | n/a |
| --debug | -z | no | no | Displays debug info of the command execution. | n/a |
| --help | -h | no | no | Displays description of the command. Ignores any other options. | n/a |

#### Test Run

**impt test run \[--tests <testcase_pattern>] \[--github-config \[<github_credentials_file_name>]] \[--builder-config \[<builder_file_name>]] \[--builder-cache \[true|false]] \[--debug] \[--help]**

Runs the tests specified by [Test Configuration File](#test-configuration-file) in the current directory.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --tests | | no | yes | A pattern for selective test runs, allows to execute a single test or a set of tests from one or several Test Cases. The syntax of the pattern: *\[testFileName]:\[testClass].\[testMethod]* If the option is missed all tests from all test files specified in [Test Configuration File](#test-configuration-file) are executed. |
| --github-config | | no | no | A path to the github credentials configuration file. A relative or absolute path can be used. If the value of the option is not specified, *.impt.github-info* file in the current directory is assumed. |
| --builder-config | | no | no | A path to the file with *Builder* variables. A relative or absolute path can be used. If the value of the option is not specified, *.impt.builder* file in the current directory is assumed. |
| --builder-cache | | no | no | If *true* or no value: cache (if not cached yet) external libraries in the local *.builder-cache* directory and use them from the cache for this test run. If *false* value: do not use external libraries from the cache even if they are cached. If not specified, the behavior is defined by the corresponding settings in [Test Configuration File](#test-configuration-file) that was initialized/updated by [**impt test init**](#test-init) command. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

### Webhook Manipulation Commands

#### Webhook Create

**impt webhook create \[--dg <DEVICE_GROUP_IDENTIFIER>] --url <target_url> --event <triggered_event> --mime <content_type> \[--debug] \[--help]**

Creates a new Webhook for the specified Device Group.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --dg | -g | yes/[project](#project-file) | yes | [Device Group Identifier](#device-group-identifier). If not specified, the Device Group referenced by [Project File](#project-file) in the current directory is assumed (if no Project File, the command fails). |
| --url | | yes | yes | The Webhook's target URL. |
| --event | | yes | yes | The event that triggers the Webhook. Valid values: "blessing", "blinkup", "deployment". |
| --mime | | yes | yes | The MIME content-type of the event data. Valid values: "json", "urlencoded". |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook Delete

**impt webhook delete --wh <webhook_id> \[--force] \[--debug] \[--help]**

Deletes the specified Webhook.

User is asked to confirm the operation (confirmed automatically with **--force** option).

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --force | -f | no | no | Forces the operation w/o asking a confirmation from user. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook Info

**impt webhook info --wh <webhook_id> \[--debug] \[--help]**

Displays information about the specified Webhook.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

#### Webhook List

**impt webhook list \[--url <target_url>] \[--event <triggered_event>] \[--product-id <product_id>] \[--product-name <product_name>] \[--dg-type <device_group_type>] \[--dg-id <device_group_id>] \[--dg-name <device_group_name>] \[--debug] \[--help]**

Displays information about all Webhooks associated with the logged-in account.

The returned list of the Webhooks may be filtered. Filtering is possible by any combination of the described Filter Options. Every Filter Option may be repeated several times.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |
| Filter Options: | | | | |
| --url | | no | yes | Webhooks with the specified target URL only. |
| --event | | no | yes | Webhooks for the specified event only. Valid values: "blessing", "blinkup", "deployment". |
| --product-id | | no | yes | Webhooks created for Device Groups which belong to the specified Product only. |
| --product-name | | no | yes | Webhooks created for Device Groups which belong to the specified Product only. |
| --dg-type | | no | yes | Webhooks created for Device Groups of the specified [type](#device-group-type) only. |
| --dg-id | | no | yes | Webhooks created for the specified Device Group only. |
| --dg-name | | no | yes | Webhooks created for the specified Device Group only. |

#### Webhook Update

**impt webhook update --wh <webhook_id> \[--url <target_url>] \[--mime <content_type>] \[--debug] \[--help]**

Updates the specified Webhook by a new target URL and/or MIME content-type.
Fails if the specified Webhook does not exist.

| Option | Alias | Mandatory? | Value Required? | Description |
| --- | --- | --- | --- | --- |
| --wh | -w | yes | yes | The Webhook id. |
| --url | | no | yes | The Webhook's new target URL. |
| --mime | | no | yes | New MIME content-type of the event data. Valid values: "json", "urlencoded". |
| --debug | -z | no | no | Displays debug info of the command execution. |
| --help | -h | no | no | Displays description of the command. Ignores any other options. |

## List of Aliases

| Command Option Alias | Command Option Full Name(s) |
| --- | --- |
| -a |   |
| -b | --build  |
| -c | --create-files  |
| -d | --device  |
| -e | --endpoint  |
| -f | --force  |
| -g | --dg  |
| -h | --help  |
| -i |   |
| -j |   |
| -k | --login-key  |
| -l | --log, --local  |
| -m |   |
| -n | --name  |
| -o | --origin  |
| -p | --product  |
| -q |   |
| -r | --remove-tag, --rename-files  |
| -s | --descr  |
| -t | --tag, --timeout  |
| -u | --user  |
| -v |   |
| -w | --wh, --pwd  |
| -x | --device-file  |
| -y | --agent-file  |
| -z | --debug  |



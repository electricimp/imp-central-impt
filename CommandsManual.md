# climp Commands Manual

## General

### List Of Commands

**[help](#help)**

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

#### Product Identification
Option: **--product <PRODUCT_IDENTIFIER>**

Attributes accepted as <PRODUCT_IDENTIFIER> (in order of search):
- Product Id (always unique)
- Product Name (unique for all Products owned by a particular user)

#### Device Group Identification
Option: **--dg <DEVICE_GROUP_IDENTIFIER>**

Attributes accepted as <DEVICE_GROUP_IDENTIFIER> (in order of search):
- Device Group Id (always unique)
- Device Group Name (unique for all Device Groups in a Product)

#### Device Identification
Option: **--device <DEVICE_IDENTIFIER>**

Attributes accepted as <DEVICE_IDENTIFIER> (in order of search):
- Device Id (always unique)
- MAC address
- IP address
- IMP Agent Id
- Device Name

#### Build Identification
Option: **--build <BUILD_IDENTIFIER>**

Attributes accepted as <BUILD_IDENTIFIER> (in order of search):
- Deployment Id (always unique)
- sha
- tag
- origin


## Commands Description

In alphabetical order.

### Help Commands

#### Help

**help**

Displays the list of all commands (w/o command options). To display the details of every command use the command’s **--help** option.



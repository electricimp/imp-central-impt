# climp Commands Manual

## General

### Command Syntax

**climp <command_group> <command_name> \[\<options>]**
  
All commands (except login/logout ) are named by the two mandatory parts:
- **<command_group>** - a logical group of commands
- **<command_name>** - a command name unique inside the group

Most of commands have **\<options>** - one or more options applicable to a corresponded command. Options may be written in any order. An option has the following format:
  
**--<option_name> [<option_value>]** or **-<option_alias> [<option_value>]**, where:
- **<option_name>** - is unique across a particular command. For a user convenience many of the option names are reused across different commands.
- **<option_alias>** - a one letter alias for the option, unique for a particular command. Not all but many options have aliases.
- **<option_value>** - a value of the option. Not all options require value. If option value has spaces it must be put into double quotes (“”).


## Commands Description

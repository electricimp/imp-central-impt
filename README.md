# impt

impt is a command-line tool which allows to interact with the Electric Imp impCentral API (**link TBD**) for different purposes - development, testing, device and product management, creating deployments for factory and production, etc.

The impt tool supersedes [build-cli](https://github.com/electricimp/build-cli) and [impTest](https://github.com/electricimp/impTest) tools and includes much more additional functionality provided by the impCentral API.

This readme covers all basic and common aspects of the impt tool. Read it first. More details you can find in the following documentation:
- Development Guide (**link TBD**),
- Testing Guide (**link TBD**),
- Factory/Production Guide (**link TBD**),
- [impt Commands Manual](./CommandsManual.md).

The impt tool is written in Node.js and uses Electric Imp impCentral API JavaScript library (**link TBD**).

## Installation

**TBD**

## Syntax and Command Groups

All commands of the tool follow the unified format and [syntax](./CommandsManual.md#command-syntax): `impt <command_group> <command_name> [<options>]`.

The commands are logically divided into groups.

Most of the groups directly maps to the corresponding groups of the Electric Imp impCentral API (**link TBD**) and provides access to the impCentral API functionality:
- [Product Manipulation Commands](./CommandsManual.md#product-manipulation-commands) - `impt product <command_name> [<options>]`,
- [Device Group Manipulation Commands](./CommandsManual.md#device-group-manipulation-commands) - `impt dg <command_name> [<options>]`,
- [Device Manipulation Commands](./CommandsManual.md#device-manipulation-commands) - `impt device <command_name> [<options>]`,
- [Build (Deployment) Manipulation Commands](./CommandsManual.md#build-manipulation-commands) - `impt build <command_name> [<options>]`,
- [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) - `impt log <command_name> [<options>]`,
- [Webhook Manipulation Commands](./CommandsManual.md#webhook-manipulation-commands) - `impt webhook <command_name> [<options>]`,
- [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) - `impt loginkey <command_name> [<options>]`.

There is one more group which covers the impCentral API functionality but provides it in a way convenient for a user:
- [Authentication Commands](./CommandsManual.md#authentication-commands) - `impt auth <command_name> [<options>]`.

There are two additional groups that include commands convenient for code development and testing:
- [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) - `impt project <command_name> [<options>]`,
- [Test Commands](./CommandsManual.md#test-commands) - `impt test <command_name> [<options>]`.

The most of commands has `<options>`. Options may be written in any order. As a general rule, the same option should not be specified many times in the same command, but exceptions exist. Some options require values, some not. If option value has spaces it must be put into double quotes - `“option value with spaces”`. Many options have one letter [aliases](./CommandsManual.md#list-of-aliases). Options applicable for every command, the aliases and every option explanation are detailed in [Commands Description](./CommandsManual.md#commands-description).

Examples of the syntax and commands with options:  
`impt product create --name TestProduct --descr "My test product"`  
`impt dg create --name "TestDG" --type development -p TestProduct`  
`impt device assign -g TestDG -d "my device 1"`  

## Help

Every command has `--help` option (`-h` option alias). If it is specified, any other specified options are ignored, the command is not executed but the tool displays full description of the command - the format, explanation, options. 

[Help option](./CommandsManual.md#help-option) is also applicable to a not fully specified command. It may be used to list all available command groups or to list all commands available in one group.

List all command groups:  
**TBD** screenshot, leave only 3-4 first groups in the output

List all commands in one group:  
**TBD** screenshot

Display a command description:  
**TBD** screenshot for a command with few options

## Debug

## Authentication

## Project

## Entity Identification

## Entity Listing



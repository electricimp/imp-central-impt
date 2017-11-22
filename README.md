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

The most of commands has `<options>`. Options may be written in any order. As a general rule, the same option should not be repeated in the same command, but there are exceptions. Some options require values, some not. If option value has spaces it must be put into double quotes (“”). Options for every command are described in details in the command specification.

**TBD** - examples of commands with options.

## Help

## Debug

## Authentication

## Project

## Entity Identification

## Entity Listing



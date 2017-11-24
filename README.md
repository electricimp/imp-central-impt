# impt

impt is a command-line tool which allows to interact with the Electric Imp impCentral API (**link TBD**) for different purposes - development, testing, device and product management, creating deployments for factory and production, etc.

The impt tool supersedes [build-cli](https://github.com/electricimp/build-cli) and [impTest](https://github.com/electricimp/impTest) tools and includes much more additional functionality provided by the impCentral API.

This readme covers all basic and common aspects of the impt tool. Read it first. More details you can find in the following documentation:
- Development Guide (**link TBD**),
- Testing Guide (**link TBD**),
- Factory/Production Guide (**link TBD**),
- [impt Commands Manual](./CommandsManual.md).

The impt tool is written in [Node.js](https://nodejs.org) and uses [Electric Imp impCentral API JavaScript library](https://github.com/electricimp/imp-central-api).

## Installation

**TBD**

## Syntax and Command Groups

All commands of the tool follow the unified format and [syntax](./CommandsManual.md#command-syntax): `impt <command_group> <command_name> [<options>]`.

The commands are logically divided into groups.

Most of the groups directly maps to the corresponding groups of the Electric Imp impCentral API (**link TBD**) and provides access to the impCentral API functionality:
- [Product Manipulation Commands](./CommandsManual.md#product-manipulation-commands) - `impt product <command_name> [<options>]`
- [Device Group Manipulation Commands](./CommandsManual.md#device-group-manipulation-commands) - `impt dg <command_name> [<options>]`
- [Device Manipulation Commands](./CommandsManual.md#device-manipulation-commands) - `impt device <command_name> [<options>]`
- [Build (Deployment) Manipulation Commands](./CommandsManual.md#build-manipulation-commands) - `impt build <command_name> [<options>]`
- [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) - `impt log <command_name> [<options>]`
- [Webhook Manipulation Commands](./CommandsManual.md#webhook-manipulation-commands) - `impt webhook <command_name> [<options>]`
- [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) - `impt loginkey <command_name> [<options>]`

There is one more group which covers the impCentral API functionality but provides it in a way convenient for a user:
- [Authentication Commands](./CommandsManual.md#authentication-commands) - `impt auth <command_name> [<options>]`

There are two additional groups that include commands convenient for code development and testing:
- [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) - `impt project <command_name> [<options>]`
- [Test Commands](./CommandsManual.md#test-commands) - `impt test <command_name> [<options>]`

The most of commands has `<options>`. Options may be written in any order. As a general rule, the same option should not be specified many times in the same command, but exceptions exist. Some options require values, some not. If option value has spaces it must be put into double quotes - `“option value with spaces”`. Many options have one letter [aliases](./CommandsManual.md#list-of-aliases). Options applicable for every command, the aliases and every option explanation are detailed in [Commands Description](./CommandsManual.md#commands-description).

Examples - the syntax and commands with options:  
`impt product create --name TestProduct --descr "My test product"`  
`impt dg create --name "TestDG" --type development -p TestProduct`  
`impt device assign -g TestDG -d "my device 1"`  

## Help

Every command has `--help` option (`-h` option alias). If it is specified, any other specified options are ignored, the command is not executed but the tool displays full description of the command - the format, explanation, options. 

[Help option](./CommandsManual.md#help-option) is also applicable to a not fully specified command. It may be used to list all available command groups or to list all commands available in one group.

Example - list all command groups:  
**TBD** screenshot, leave only 3-4 first groups in the output

Example - list all commands in one group:  
**TBD** screenshot

Example - display a command description:  
**TBD** screenshot for a command with few options

## Debug

Every command has `--debug` option (`-z` option alias). If it is specified, the tool displays debug information of the command execution, including impCentral API requests and responses.

Example:  
**TBD** screenshot with not a huge output

## Scripts Support

The tool's commands are designed to be "friendly" for processing by scripts.

Interaction with a user is minimal. Only commands which delete entities ask a confirmation from user. But all these commands have `--force` option (`-f` option alias). If it is specified, the command is executed without asking the confirmation from user. Scripts can use this option.

An output of every command execution always contains one of the two predefined phrases - `IMPT SUCCESS` or `IMPT FAIL` (**TBD** final phrases). Scripts can parse a command output to find these standard phrases to quickly realize when the command execution is completed and does the command succeed or fail.

Example - a successful command execution:  
**TBD** screenshot - success command with --force option

Example - a failed command execution:  
**TBD** screenshot - failed command

## Authentication

To access the impCentral API you need to be authenticated first. The impt tool provides the following ways of authentication by the [login command](./CommandsManual.md#auth-login):
- using an account identifier (an email address or a username) and password - `impt auth login --user <user_id> --pwd <password>`
- using a [login key](#login-key) - `impt auth login --lk <login_key_id>`

The tool takes care of obtaining an access token and refreshing it using an obtained refresh token or the provided login key (depends on the way of the authentication). It means, in general, you need to login only once and can continue using the tool while the refresh token / the login key is valid (not deleted by you). For this purpose the tool stores the access token and the refresh token / the login key in [Auth File](./CommandsManual.md#auth-file).

The impt tool never stores an account identifier and password. If you do not want the tool to store a refresh token / a login key, use `--temp` option of the [login command](./CommandsManual.md#auth-login). In this case you will not be able to work with the impCentral API after the access token is expired (usually it happens in about one hour but depends on the impCentral). You will have to login again to continue the work.

At any time you can call the [logout command](./CommandsManual.md#auth-logout) - `impt auth logout` - to delete [Auth File](./CommandsManual.md#auth-file). Usually you will not be able to work with the impCentral API right after the logout and will have to login again to continue the work. But see the explanation about global and local login/logout below.

During the login you can specify an alternative impCentral API endpoint using `--endpoint` option of the [login command](./CommandsManual.md#auth-login). You may need this if you work with a private impCloud installation. The default endpoint is [https://api.electricimp.com/v5](https://api.electricimp.com/v5)

There are two types of login - global and local.

**Global login** is the default one. It is enough to use only it if you always work on behalf of the same user with the same impCentral
API endpoint. [Global Auth File](./CommandsManual.md#global-auth-file) - only one per the impt tool installation - is created for the global login. It is located in the tool specific place. Every impt command is executed in the context of the global login when a local login is not applicable.

**Local login** works for a particular directory. It may be convenient if you often work on behalf of different users or use different impCentral API endpoints. In this case, you may choose a directory and in this directory call the [login command](./CommandsManual.md#auth-login) with `--local` option. If the authentication is successful, [Local Auth File](./CommandsManual.md#local-auth-file) is created in this directory. After that, every impt command called from this directory is executed in the context of the local login.

There can be only one [Local Auth File](./CommandsManual.md#local-auth-file) in a directory, but any number of directories with local Auth Files, i.e. any number of local logins. And all of them are independent from each other and from [Global Auth File](./CommandsManual.md#global-auth-file). You do not need to have the global login in order to use local logins. Note, that local Auth File affects the current directory only and does not affect any subdirectories - they may or may not contain their own local Auth Files.

The [logout command](./CommandsManual.md#auth-logout) with `--local` option deletes [Local Auth File](./CommandsManual.md#local-auth-file), if it exists in the current directory. After that, any next command called from this directory will be executed in the context of the global login. The [logout command](./CommandsManual.md#auth-logout) without `--local` option deletes [Global Auth File](./CommandsManual.md#global-auth-file).

Summary of the **impt command execution context**:
- If the current directory contains Auth File, this file is considered as [Local Auth File](./CommandsManual.md#local-auth-file) and a command called from this directory is executed in the context of the local login defined by this file.
- Otherwise, if [Global Auth File](./CommandsManual.md#global-auth-file) exists, a command is executed in the context of the global login defined by that file.
- Otherwise, a command fails (global or local login is required).

At any time you can get known the login status related to any directory. Call the [auth info command](./CommandsManual.md#auth-info) - `impt auth info` - from the required directory. The returned information includes but may be not limited to:
- a type of the login applicable to the current directory at this moment - whether [global](./CommandsManual.md#global-auth-file) or [local](./CommandsManual.md#local-auth-file) Auth File is applicable to commands called from the current directory,
- what was used for the login - username/password or login key (their values are not displayed),
- when will the current access token expire,
- whether the refresh token / the login key is stored for automatic refreshing of the access token.

If you call the [auth info command](./CommandsManual.md#auth-info) with `--try` option, it additionally makes sure the login information is actual and you have access to the impCentral API at this moment.

Example - global login:  
**TBD** screenshot - impt auth login --user <user_id> --pwd <password>

Example - local login using a login key, specifying a endpoint, without storing the login key:  
**TBD** screenshot - impt auth login --local --lk <login_key_id> --temp --endpoint https://api.electricimp.com/v5

Example - display login status:  
**TBD** screenshot - impt auth info --try

Example - local logout:  
**TBD** screenshot - impt auth logout --local

## Login Key

[login key](./CommandsManual.md#login-key-manipulation-commands)

## Project

## Entity Identification

## Entity Listing



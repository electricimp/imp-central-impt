# impt

impt is a command line tool which allows to interact with the [Electric Imp impCentral&trade; API](https://apidoc.electricimp.com) for different purposes - development, testing, device and product management, creating deployments for factory and production, etc.

The impt tool supersedes [build-cli](https://github.com/electricimp/build-cli) and [impTest](https://github.com/electricimp/impTest) tools and includes much more additional functionality.

This readme covers all basic and common aspects of the impt tool. Read it first. More details you can find in the following documentation:
- Development Guide (**link TODO**),
- Testing Guide (**link TODO**),
- Factory/Production Guide (**link TODO**),
- [impt Commands Manual](./CommandsManual.md).

The impt tool is written in [Node.js](https://nodejs.org) and uses the [Electric Imp impCentral&trade; API JavaScript library](https://github.com/electricimp/imp-central-api).

## Installation

[Node.js](https://nodejs.org/en/) is required. You can download the Node.js [pre-built binary](https://nodejs.org/en/download/) for your platform, or install Node.js via [package manager](https://nodejs.org/en/download/package-manager). Once `node` and `npm` are installed, you need to execute the following command to set up the *impt* tool:

```bash
npm install -g imp-central-impt
```

## Syntax and Command Groups

All commands of the tool follow the unified format and [syntax](./CommandsManual.md#command-syntax): `impt <command_group> <command_name> [<options>]`. All commands and options are case sensitive.

The commands are logically divided into groups.

Most of the groups directly maps to the corresponding groups of the [Electric Imp impCentral&trade; API](https://apidoc.electricimp.com) and provides access to the impCentral API functionality:
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

For similar operations in different command groups the impt tool uses similar command names, like `create`, `update`, `delete`, `list`, `info`.

The most of commands have optional arguments called options - `<options>`. Options may be written in any order. As a general rule, the same option should not be specified many times in the same command, but exceptions exist. Some options require values, some not. If option value has spaces it must be put into double quotes - `“option value with spaces”`. Many options have one letter [alias](./CommandsManual.md#list-of-aliases). The options and aliases are detailed in the [Commands Description](./CommandsManual.md#commands-description).

**Examples** - the syntax and commands with options:  
`impt product create --name TestProduct --descr "My test product"`  
`impt dg create --name "TestDG" --type development -p TestProduct`  
`impt device assign -g TestDG -d "my device 1"`  

## Help

Every command has `--help` option (`-h` option alias). If it is specified, any other specified options are ignored, the command is not executed but the tool displays full description of the command - the format, explanation, options. 

[Help option](./CommandsManual.md#help-option) is also applicable to a not fully specified command. It may be used to list all available command groups or to list all commands available in one group.

**Example** - list all command groups:  
**TODO** screenshot, leave only 3-4 first groups in the output

**Example** - list all commands in one group:  
**TODO** screenshot

**Example** - display a command description:  
**TODO** screenshot for a command with few options

## Debug

Every command has `--debug` option (`-z` option alias). If it is specified, the tool displays debug information of the command execution, including impCentral API requests and responses.

**Example**:  
**TODO** screenshot with not a huge output

## Scripts Support

The tool's commands are designed to be "friendly" for processing by scripts.

Interaction with a user is minimal. Only few commands, for example [delete entities](#entity-deletion) commands, ask a confirmation from user. But all these commands have `--confirmed` option. If it is specified, the command is executed without asking additional confirmation from user. Scripts can use this option.

Output of a command execution contains one of the two predefined phrases - `IMPT COMMAND SUCCEEDS` or `IMPT COMMAND FAILS`. Scripts can parse a command's output to find these standard phrases to quickly realize does the command succeed or fail. If any command fails, `IMPT COMMAND FAILS` phrase is always on the last line of the command's output. If a command succeeds, `IMPT COMMAND SUCCEEDS` phrase is also on the last line of the output for the most of the commands. Logging-related commands may have additional `IMPT COMMAND SUCCEEDS` phrases in their output. If the [help option](#help) is specified for a command, it's output does not contain neither predefined phrase.

**Example** - a successful command execution:  
**TODO** screenshot - success command with --confirmed option

**Example** - a failed command execution:  
**TODO** screenshot - failed command

## Authentication

To access the impCentral API you need to be authenticated first. The impt tool provides the following ways of authentication by the [login command](./CommandsManual.md#auth-login):
- using an account identifier (an email address or a username) and password - `impt auth login --user <user_id> --pwd <password>`
- using a [login key](#login-key) - `impt auth login --lk <login_key_id>`

The tool takes care of obtaining an access token and refreshing it using an obtained refresh token or the provided login key (depends on the way of the authentication). It means, in general, you need to login only once and can continue using the tool while the refresh token / the login key is valid (not deleted by you). For this purpose the tool stores the access token and the refresh token / the login key in [Auth File](./CommandsManual.md#auth-file).

The impt tool never stores an account identifier and password. If you do not want the tool to store a refresh token / a login key, use `--temp` option of the [login command](./CommandsManual.md#auth-login). In this case you will not be able to work with the impCentral API after the access token is expired (usually it happens in about one hour but depends on the impCentral). You will have to login again to continue the work.

At any time you can call the [logout command](./CommandsManual.md#auth-logout) - `impt auth logout` - to delete [Auth File](./CommandsManual.md#auth-file). Usually you will not be able to work with the impCentral API right after the logout and will have to login again to continue the work. But see the explanation about global and local login/logout below.

You do not need to use the logout command if you want just to re-login using other credentials. A new login command overwrites [Auth File](./CommandsManual.md#auth-file), if that existed and the operation is confirmed by user.

During the login you can specify an alternative impCentral API endpoint using `--endpoint` option of the [login command](./CommandsManual.md#auth-login). You may need this if you work with a private impCloud&trade; installation. The default endpoint is `https://api.electricimp.com/v5`

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

At any time you can get known the login status related to any directory. Call the [auth info command](./CommandsManual.md#auth-info) from the required directory - `impt auth info`. The returned information includes a type of the login applicable to the current directory, access token status, your account Id and other details.

**Example** - global login:  
**TODO** screenshot - impt auth login --user <user_id> --pwd <password>

**Example** - local login using a login key, specifying a endpoint, without storing the login key:  
**TODO** screenshot - impt auth login --local --lk <login_key_id> --temp --endpoint https://api.electricimp.com/v5

**Example** - display login status:  
**TODO** screenshot - impt auth info

**Example** - local logout:  
**TODO** screenshot - impt auth logout --local

## Login Key

The tool provides a set of [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) which allows you to fully control the login keys of your account - list the existent login keys, create a new one, delete, etc. Of course, you need to be logged-in in order to use that commands. Some commands additionally requires the password.

**Example** - login key list? :  
**TODO** screenshot - login key command

## Project

Project is an artificial entity introduced to help developers to align their work with the impCentral API. It is similar to Workspace in the impCentral IDE. Project is any directory where [Project File](./CommandsManual.md#project-file) is located. Project relates to one and only one Device Group of the impCentral API.

Project is intended for developers and described in details in the Development Guide (**link TODO**). The tool provides a set of [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) to operate with Project.

But many other commands may be affected when called from a directory where [Project File](./CommandsManual.md#project-file) is located. Product, Device Group, Devices, Deployment referenced by the Project File may be assumed by a command when they are not specified in the command's options explicitly. If you want to avoid that, always specify the mandatory options of the commands. All such options are detailed in the [Commands Description](./CommandsManual.md#commands-description).

**Example** - unassign all Devices from Device Group. A Device Group is not specified in the command below. But the current directory contains Project File. All Devices are unassigned from the Device Group referenced by that Project File:  
**TODO** screenshot - impt dg unassign

## Entity Identification

Many impt tool commands have options which specify an impCentral API entity - a concrete Product, Device Group, Device, Deployment, etc. You can use an entity Id (Product Id, Device Group Id, etc.) that is always unique. But sometime it may be more convenient to use other attributes to specify an entity. For example, Product Name, Device Group Name, Device MAC address, Device agent Id, Build sha, Build tag, etc. The tool provides such a possibility. You can specify different attributes as an option value and the tool searches the specified value among different attributes.

If you want to use this feature, please first read [here](./CommandsManual.md#entity-identification) the rules how the tool searches an entity and the lists of attributes acceptable for different entities. Command's options, to which the complex entity identification is applicable, are detailed in the [Commands Description](./CommandsManual.md#commands-description). Note, if more than one entity is found, then, depending on a particular command, that may be considered as a success (for all [Entity Listing](#entity-listing) commands) or as a fail (for all other commands).

When it is hard to uniquely specify an entity without knowing the entity Id, use [Entity Listing](#entity-listing) commands to list the entities basing on some attributes, choose the required entity, notice it's Id and use it in the required command.

**Example** - an entity is found successfully:  
**TODO** screenshot - device by MAC ?

**Example** - an entity is not unique, the command fails:  
**TODO** screenshot - build by tag but there are two deployments with this tag ?

## Entity Listing

Many groups of commands contain a command to list entities - list Products, list Device Groups, list Devices, etc. By default, such a command returns the list of all entities available to the current logged-in account. But the returned list may be filtered using the specified attributes - Filter Options - additional options of a list command. There are the common rules applicable to all list commands:
- Every Filter Option may be repeated several times.
- At first, all Filter Options with the same option name are combined by logical OR.
- After that, all Filter Options with different option names are combined by logical AND.

Some Filter Options have the same name and meaning in several list commands. They are summarized [here](./CommandsManual.md#common-filter-options). At the same time, a particular command may have specific Filter Options as well. Filter Options applicable to every concrete list command are detailed in the [Commands Description](./CommandsManual.md#commands-description).

Note, for some list commands the returned default list of entities available to the current logged-in account includes the entities owned by this account as well as the entities owned by the collaborators. But for other list commands - only the entities owned by the current account. It is impCentral specific behavior, not controlled by the impt tool. But you can always specify a concrete Account Id, email or username as a value of the `--owner <value>` Filter Option and get the entities owned by that account, if they are available to you as to a collaborator. Also, you can always specify the `--owner me` Filter Option and get the entities owned by you only.

**Example**:  
**TODO** screenshot - a complex list command, with AND and OR, with not a huge output

**Example**:  
**TODO** screenshot - another list command, with --owner me and some other filters, with not a huge output

## Entity Information

The most of command groups contain `info` command which returns information about the specified entity. Some of that commands have `--full` option. When it is specified, the command returns additional details about the related entities. For example, additional information about Device Groups which belong to the specified Product.

**Example**:  
**TODO** screenshot - impt device info

**Example**:  
**TODO** screenshot - impt product info --full, not a huge output

## Entity Deletion

By default, the commands which delete impCentral entities (like Product, Device Group, Deployment) have the same limitations like the corresponding impCentral API functionality. For example, a Product deletion fails if the Product has Device Groups; a build (Deployment) fails if the Deployment has the *"flagged"* attribute set to *true*. If you specify the `--force` option (`-f` option alias) of the delete command, the tool implicitly update or delete all other required entities in order to delete the target entity. For example, the tool deletes all Device Groups of the Product in order to delete the Product; the tool updates the *"flagged"* attribute of the Deployment in order to delete the Deployment.

Also by default, every delete command asks a confirmation of the operation from user. Before that the command lists all the entities which are going to be deleted or updated. If you specify the `--confirmed` option, the operation is executed without asking additional confirmation from user.

**Example** - a failed delete command execution:  
**TODO** screenshot - failed delete something w/o --force, use --confirmed

**Example** - a successful delete command execution:  
**TODO** screenshot - the same command succeeds with --force, now w/o --confirmed

## License

The impt tool is licensed under the [MIT License](./LICENSE)

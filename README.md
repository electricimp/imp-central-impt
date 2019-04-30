# impt #

*impt* is a command line tool which allows you to interact with the Electric Imp impCloud™ via the [impCentral™ API](https://apidoc.electricimp.com) for the development, testing and deployment of application and factory code, and for device and product management.

*impt* replaces the [*build-cli*](https://github.com/electricimp/build-cli) and [*impTest*](https://github.com/electricimp/impTest) tools, and provides additional functionality.

This guide covers the basic and common usage of *impt*, and should be read first. Depending on your primary activity, you can then find further information in the following documentation:

- [*impt* Development Guide](./DevelopmentGuide.md)
- [*impt* Testing Guide](./TestingGuide.md)
- [*impt* Production Guide](./ProductionGuide.md)
- [*impt* Commands Manual](./CommandsManual.md)

*impt* is written in [Node.js](https://nodejs.org) and uses [Electric Imp’s impCentral API JavaScript library](https://github.com/electricimp/imp-central-api).

![Build Status](https://cse-ci.electricimp.com/app/rest/builds/buildType:(id:ImpCentralImpt_BuildAndTest)/statusIcon)

## Contents ##

- [Installation](#installation)
- [Version](#version)
- [Proxy Setup](#proxy-setup)
- [Syntax and Command Groups](#syntax-and-command-groups)
- [Help](#help)
- [Command Output](#command-output)
- [Authentication](#authentication)
- [Login Keys](#login-keys)
- [Projects](#projects)
- [Entity Identification](#entity-identification)
- [Entity Listing and Ownership](#entity-listing-and-ownership)
- [Entity Information](#entity-information)
- [Entity Deletion](#entity-deletion)
- [Non-atomic Transactions](#non-atomic-transactions)
- [Testing](#testing)
- [License](#license)

## Installation ##

*impt* requires [Node.js](https://nodejs.org/en/) version 8 or higher. You can download a Node.js [pre-built binary](https://nodejs.org/en/download/) for your platform, or install Node.js via the [Node Package Manager](https://nodejs.org/en/download/package-manager). Once *node* and *npm* are installed, you need to execute the following command to set up *impt*:

```bash
npm install -g imp-central-impt
```

## Version ##

Call `impt --version` or `impt -v` to display the version of the installed *impt*.

```bash
> impt --version
2.5.2
```

## Proxy Setup ##

If *impt* is going to connect to the impCentral API via a proxy, one or both of the following environment variables should be set to a value in URL format:

- `HTTPS_PROXY` (or `https_proxy`) &mdash; for the proxy which passes HTTPs requests.
- `HTTP_PROXY` (or `http_proxy`) &mdash; for the proxy which passes HTTP requests.

**Note** The default impCentral API endpoint works over HTTPs.

```bash
HTTPS_PROXY=https://proxy.example.net
```

## Syntax And Command Groups ##

All commands follow a unified format and [syntax](./CommandsManual.md#command-syntax):

```bash
impt <command_group> <command_name> [<options>]
```

All commands and options are case sensitive.

The commands are logically divided into groups. Most of the groups directly map to the corresponding groups of the [impCentral API](https://apidoc.electricimp.com) and provide access to its functionality:

- [Product Manipulation Commands](./CommandsManual.md#product-manipulation-commands) &mdash; `impt product <command_name> [<options>]`
- [Device Group Manipulation Commands](./CommandsManual.md#device-group-manipulation-commands) &mdash; `impt dg <command_name> [<options>]`
- [Device Manipulation Commands](./CommandsManual.md#device-manipulation-commands) &mdash; `impt device <command_name> [<options>]`
- [Build (Deployment) Manipulation Commands](./CommandsManual.md#build-manipulation-commands) &mdash; `impt build <command_name> [<options>]`
- [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) &mdash; `impt log <command_name> [<options>]`
- [Webhook Manipulation Commands](./CommandsManual.md#webhook-manipulation-commands) &mdash; `impt webhook <command_name> [<options>]`
- [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) &mdash; `impt loginkey <command_name> [<options>]`
- [Account Information Commands](./CommandsManual.md#account-information-commands) &mdash; `impt account <command_name> [<options>]`

A further group of commands covers API access:

- [Authentication Commands](./CommandsManual.md#authentication-commands) &mdash; `impt auth <command_name> [<options>]`

There are two additional groups that include commands for code development and testing:

- [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) &mdash; `impt project <command_name> [<options>]`
- [Test Commands](./CommandsManual.md#test-commands) &mdash; `impt test <command_name> [<options>]`

For similar operations in different command groups *impt* uses similar command names, like `create`, `update`, `delete`, `list` and `info`.

The most of commands have optional arguments: `--<options>`. Options may be written in any order. As a general rule, the same option should not be specified multiple times in the same command, but exceptions exist. Some options require values, some do not. If an option value contains spaces it must be placed between double quotes, eg. `--<option> "option value with spaces"`. Some options may accept an empty value, which should be specified as `--<option> ""`.

Every option has a one letter [alias](./CommandsManual.md#list-of-aliases). The aliases are unique for a particular command but may be reused for different options in different commands. The same option in different commands always has the same alias. The options and aliases are detailed in the [Command Description](./CommandsManual.md#command-description).

##### Examples #####

```bash
impt product create --name TestProduct --descr "My test product"
```

```bash
impt product update --product TestProduct -s ""
```

```bash
impt dg create --name "TestDG" -y development -p TestProduct
```

```bash
impt device assign -g TestDG -d myDevice1
```

## Help ##

Every command has a `--help` option (alias: `-h`). If it is specified, any other specified options are ignored. The command is not executed but the tool displays full description of the command &mdash; the format, explanation and options.

The [help option](./CommandsManual.md#the-help-option) is applicable to a partially specified command, but also may be used to list all available command groups or to list all commands available in one group.

##### Example 1: List All Command Groups #####

```bash
> impt --help

Usage: impt <command> [options]

Commands:
  impt account   Account information commands.
  impt auth      Authentication commands.
  impt build     Build manipulation commands.
  impt device    Device manipulation commands.
  impt dg        Device Group manipulation commands.
  impt log       Logs manipulation commands.
  impt loginkey  Login Key manipulation commands.
  impt product   Product manipulation commands.
  impt project   Project manipulation commands.
  impt test      Test manipulation commands.
  impt webhook   Webhook manipulation commands.

Options:
  --version, -v  Displays the version of impt.                         [boolean]
  --help, -h     Displays a description of the command.                [boolean]
```

##### Example 2: List All Of The Commands In One Group #####

```bash
> impt product --help

Usage: impt product <command> [options]

Product manipulation commands.

Commands:
  impt product create  Creates a new Product.
  impt product delete  Deletes the specified Product.
  impt product info    Displays information about the specified Product.
  impt product list    Displays information about all or filtered Products.
  impt product update  Updates the specified Product.

Options:
  --help, -h  Displays a description of the command. Ignores any other options.
                                                                       [boolean]
```

##### Example 3: Display A Command Description #####

```bash
> impt product create --help

Usage: impt product create --name <product_name> [--descr <product_description>]
[--owner <ACCOUNT_IDENTIFIER>] [--output <mode>] [--help]

Creates a new Product. Fails if a Product with the specified name already
exists.

Options:
  --help, -h    Displays a description of the command. Ignores any other
                options.                                               [boolean]
  --name, -n    The Product's name. Must be unique among all of the current
                account's Products.                          [string] [required]
  --descr, -s   An optional description of the Product.                 [string]
  --owner, -o   The Product will be created in the specified Account. If not
                specified, the current account is assumed.              [string]
  --output, -z  Adjusts the command's output.
                                  [string] [choices: "minimal", "json", "debug"]
```

## Command Output ##

*impt* is intended to satisfy the needs of many different types of users: developers, testers, product and factory administrators, etc. Each kind of user may have different requirements for the verbosity level and the format of the output generated by the tool.

The default verbose output is primarily intended for developers and testers who are manually interacting with the tool at the command line. However, every command has the `--output <mode>` option (alias: `-z`) which can be used to adjust the default output generated by a command. You might use this option to reduce a command’s output to a minimum, or to generate the output in a format that is more convenient for processing by scripts. The supported output modes are described in the [Commands Manual](./CommandsManual.md#command-output).

### Command Execution Result ###

Irrespective of the output mode, a command returns non-zero exit code if it fails. Otherwise, the command returns an exit code of zero.

Additionally, the default output contains one of the two predefined phrases: `IMPT COMMAND SUCCEEDS` or `IMPT COMMAND FAILS`. If any command fails, `IMPT COMMAND FAILS` is always the last line of the command’s output. If a command succeeds, `IMPT COMMAND SUCCEEDS` is the last line of the output for the most but not all of the commands. Logging-related commands may have additional `IMPT COMMAND SUCCEEDS` phrases in their output. If the [help option](./CommandsManual.md#the-help-option) is specified for a command, its output does not contain either predefined phrase.

##### Example 1: A Successful Command Execution #####

```bash
> impt product delete --product TestProduct --confirmed
Product "TestProduct" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

##### Example 2: A Failed Command Execution #####

```bash
> impt product delete --product TestProduct --confirmed
Error: Product "TestProduct" is not found.
IMPT COMMAND FAILS
```

### Debugging ###

If the `--output debug` mode is specified, *impt* displays debug information for the command being executed, including impCentral API requests and responses.

### Script Support ###

*impt* makes it easy for scripts to process its output. User interaction is minimal. Only a few commands, such as [delete](#entity-deletion), ask for a confirmation from the user. However, all of these commands support the `--confirmed` option (alias: `-q`), which, if specified, prevents the command from requiring confirmation from the user. Scripts should use this option.

Scripts can also use the [result of the command execution](#command-execution-result) &mdash; an exit code or a predefined phrase &mdash; to determine command outcomes.

Additional output modes, eg. `--output json`, are also intended to present the generated output in formats that are more convenient for processing by scripts.

### Output Examples ###

The following examples execute the same command but use different output modes:

##### Example 1: Default Output #####

```bash
> impt product create --name TestProduct --descr "My test product"
Product "TestProduct" is created successfully.
Product:
  id:   94a2b60b-a4d4-5e5f-e43b-bc0486a0efee
  name: TestProduct
IMPT COMMAND SUCCEEDS
```

##### Example 2: Default Output With Debug Information #####

```bash
> impt product create --name TestProduct --descr "My test product" --output debug
Doing the request with options:
{
  "url": "https://api.electricimp.com/v5/products",
  "method": "POST",
  "headers": {
    "Content-type": "application/vnd.api+json",
    "Authorization": "[hidden]"
  },
  "json": true,
  "qs": null,
  "body": {
    "data": {
      "type": "product",
      "attributes": {
        "name": "TestProduct",
        "description": "My test product"
      }
    }
  },
  "qsStringifyOptions": {
    "arrayFormat": "repeat"
  }
}

Response code: 201
Response headers: {
  "date": "Sun, 22 Jul 2018 11:27:49 GMT",
  "content-type": "application/vnd.api+json",
  "content-length": "477",
  "connection": "close",
  "server": "nginx/1.4.6 (Ubuntu)",
  "content-language": "en",
  "x-node": "api04",
  "accept": "application/vnd.api+json",
  "x-ratelimit-limit": "40",
  "x-ratelimit-reset": "1",
  "x-ratelimit-remaining": "39",
  "strict-transport-security": "max-age=1209600"
}
Response body: {
  "data": {
    "type": "product",
    "id": "4e264cef-3316-cdfa-7f39-7a5d458994b3",
    "links": {
      "self": "https://api.electricimp.com/v5/products/4e264cef-3316-cdfa-7f39-7a5d458994b3"
    },
    "attributes": {
      "name": "TestProduct",
      "description": "My test product",
      "created_at": "2018-07-22T11:27:49.633Z",
      "updated_at": "2018-07-22T11:27:49.633Z"
    },
    "relationships": {
      "owner": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c8dc-d43e6742cae3"
      },
      "creator": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c8dc-d43e6742cae3"
      }
    }
  }
}
Product "TestProduct" is created successfully.
Product:
  id:   4e264cef-3316-cdfa-7f39-7a5d458994b3
  name: TestProduct
IMPT COMMAND SUCCEEDS
```

##### Example 3: Minimal Output #####

```bash
> impt product create --name TestProduct --descr "My test product" --output minimal
Product:
  id:   7ffda462-5502-091f-377b-a789fb47d74c
  name: TestProduct
```

##### Example 4: Minimal Output In JSON Format #####

```bash
> impt product create --name TestProduct --descr "My test product" --output json
{
  "Product": {
    "id": "1299f725-7d22-7200-5c9c-0aa55a45fcfa",
    "name": "TestProduct"
  }
}
```

## Authentication ##

Calls to the impCentral API need to be authenticated by one of the two ways:

- Using an account identifier (an email address or a username) and password.
- Using a [login key](#login-keys).

During authentication you may specify an alternative impCentral API endpoint (the API base URL). You will need to do this if you work with a Private impCloud. The default endpoint is `https://api.electricimp.com/v5`.

*impt* provides the two methods of authentication:

- Using [auth files](./CommandsManual.md#auth-files) and the [login command](./CommandsManual.md#auth-login).
- Using [environment variables](./CommandsManual.md#auth-environment-variables).

The Command Execution Context rules (how *impt* determines authentication and other settings for a command execution) are described in the [Commands Manual](./CommandsManual.md#command-execution-context).

### Auth Files And Login Command ###

*impt* includes the [login command](./CommandsManual.md#auth-login) which you may use to authenticate by a [login key](#login-keys):

```bash
impt auth login --lk <login_key>
```

or by an account identifier:

```bash
impt auth login --user <user_id> --pwd <password>
```

**Note** If your username or password contains certain special characters, such as the "!", you may need to wrap the `<user_id>` and `<password>` in single quotes to avoid [potential bash interpretation issues](https://ss64.com/bash/bang.html), eg. `impt auth login --user 'AUserId' --pwd 'A!Password'`.

You may specify credentials (identifier and password, or login key) directly in the [login command](./CommandsManual.md#auth-login) options. If credentials are not specified, *impt* asks you to choose an authentication method and to input the corresponding credentials. If multi-factor authentication is enabled for the account, *impt* additionally asks to input one-time password.

The tool takes care of obtaining an access token and refreshing it using an obtained refresh token or a provided login key. Typically, you need only log in once and can continue using the tool while the refresh token or login key remains valid (ie. not deleted by you). For this purpose, the tool stores the access token and the refresh token/login key in an [auth file](./CommandsManual.md#auth-files).

*impt* never stores an account identifier and password. If you do not want the tool to store a refresh token/login key, use the [login command’s](./CommandsManual.md#auth-login) `--temp` option. In this case you will not be able to work with the impCentral API after the access token has expired (usually one hour after issue), and you will have to log in again to continue.

At any time, you can call the [logout command](./CommandsManual.md#auth-logout), `impt auth logout`, to delete the [auth file](./CommandsManual.md#auth-files). Usually you will not be able to work with the impCentral API after logging out and will have to log in again to continue working, but see the [Command Execution Context](./CommandsManual.md#command-execution-context) rules.

You do not need to use the logout command if you just want to re-login using other credentials. A new login command overwrites the [auth file](./CommandsManual.md#auth-files) if it exists and the operation is confirmed by the user.

### Global And Local Auth Files ###

There are two types of auth file: [global](./CommandsManual.md#global-auth-file) (which affects all calls) and [local](./CommandsManual.md#local-auth-file) (which affects commands called from the directory where the file is located).

By default, the [login](./CommandsManual.md#auth-login) and [logout](./CommandsManual.md#auth-logout) commands work with the [global auth file](./CommandsManual.md#global-auth-file).

To work with a [local auth file](./CommandsManual.md#local-auth-file), specify the `--local` option (alias: `-l`) in the [login](./CommandsManual.md#auth-login) and [logout](./CommandsManual.md#auth-logout) commands.

There can be only one [local auth file](./CommandsManual.md#local-auth-file) in a directory, but any number of directories with local auth files. All of them are independent of each other and of the [global auth file](./CommandsManual.md#global-auth-file). The local auth file only affects the current directory and does not affect any sub-directories, which may contain their own local auth files.

### Auth Environment Variables ###

Environment variables recognized by *impt* are described in the [Commands Manual](./CommandsManual.md#auth-environment-variables).

The `IMPT_AUTH_FILE_PATH` variable may be used to specify a concrete [auth file](./CommandsManual.md#auth-files) with authentication information for commands execution.

The `IMPT_LOGINKEY`, `IMPT_USER`, `IMPT_PASSWORD` and `IMPT_ENDPOINT` variables may be used as an alternative method of specifying authentication information for commands execution, ie. without storing the information in any [auth file](./CommandsManual.md#auth-files).

### Authentication Tips ###

- Make sure you know and understand the [Command Execution Context](./CommandsManual.md#command-execution-context) rules.

- If you always work on behalf of the same user with the same impCloud, it is sufficient to use the [global auth file](./CommandsManual.md#global-auth-file) and the [login command](./CommandsManual.md#auth-login) for it.

- If you have a project/product on an alternative impCloud and/or belonging to an alternative user, you may create a [local auth file](./CommandsManual.md#local-auth-file) in a directory with this project. Login by calling the [login command](./CommandsManual.md#auth-login) with the `--local` option (alias: `-l`).

- You may have as many different [local auth files](./CommandsManual.md#local-auth-file) as you want and run *impt* commands with different authentication information in parallel (eg. for different projects/products) by running them from different processes (eg. consoles). But you should note that a [local auth file](./CommandsManual.md#local-auth-file) affects commands called from the directory where the file is located only, not from sub-directories.

- If you want to run *impt* commands in parallel in different processes (eg. consoles) with different authentication information and call them from any directory, you can utilize the [environment variables](./CommandsManual.md#auth-environment-variables):

    - Option 1 &mdash; Create the required number of [auth files](./CommandsManual.md#auth-files) with different authentication information; in every process specify its own path to the required auth file using the `IMPT_AUTH_FILE_PATH` environment variable.

    - Option 2 &mdash; In every process specify its own required authentication information using the `IMPT_LOGINKEY`, `IMPT_USER`, `IMPT_PASSWORD` and `IMPT_ENDPOINT` environment variables.

- If you do not want to have the user credentials visible in the console (shell) history, call the [login command](./CommandsManual.md#auth-login) without specifying the credentials; *impt* will prompt to enter them.

- If you do not want to store any authentication information in files, use the `IMPT_LOGINKEY`, `IMPT_USER`, `IMPT_PASSWORD` and `IMPT_ENDPOINT` environment variables for authentication.

- At any time, and in any directory, you can get the execution context currently applicable to this directory and the login status. Call the [`impt auth info`](./CommandsManual.md#auth-info) command from the required directory. The returned information includes a type of the authentication applicable to the current directory, access token status, account ID and other details.

##### Example 1: Login (Global Auth File) #####

```bash
> impt auth login --user username --pwd password
Global login is successful.
IMPT COMMAND SUCCEEDS
```

##### Example 2: Login (Global Auth File) With No Credential Options #####

```bash
> impt auth login
Choose authentication method:
 (1) User/Password
 (2) Login Key
Enter 1 or 2: 1
Enter username or email address: username
Enter password:
Global login is successful.
IMPT COMMAND SUCCEEDS
```

##### Example 3: Login (Local Auth File) Using A Login Key, Setting An Endpoint, Not Storing The Login Key #####

```bash
> impt auth login --local --lk 7d8e6670aa285e9d --temp --endpoint https://api.electricimp.com/v5
Local login is successful.
IMPT COMMAND SUCCEEDS
```

##### Example 4: Display Authentication Status #####

```bash
> impt auth info
Auth:
  Auth type:                 Local Auth file
  impCentral API endpoint:   https://api.electricimp.com/v5
  Access token auto refresh: false
  Access token:              expires in 59 minutes
  Username:                  username
  Email:                     user@email.com
  Account id:                c1d61eef-d544-4d09-c8dc-d43e6742cae3
IMPT COMMAND SUCCEEDS
```

##### Example 5: Logout (Local Auth File) #####

```bash
> impt auth logout --local
Local logout is successful.
IMPT COMMAND SUCCEEDS
```

## Login Keys ##

*impt* provides a set of [Login Key manipulation commands](./CommandsManual.md#login-key-manipulation-commands) which allows you to fully control your account’s login keys: list the existent login keys, create a new one, delete one, etc. You must be logged in in order to use the commands, which may additionally require your password.

##### Example #####

```bash
> impt loginkey list
Login Key list (1 items):
Login Key:
  id:     7d8e6670aa285e9d
  usages: 1
IMPT COMMAND SUCCEEDS
```

## Projects ##

A Project is an *impt* entity introduced to help developers manage their work. A Project is any directory containing a [project File](./CommandsManual.md#project-files). One Project references one Device Group.

Projects are intended for developers and are described in detail in the [*impt* Development Guide](./DevelopmentGuide.md). The tool provides a set of [Project manipulation commands](./CommandsManual.md#project-manipulation-commands). However, many other commands are affected when called from a directory where a [Project file](./CommandsManual.md#project-files) is located. Product, Device Group, Devices, Deployment referenced by the Project file may be assumed by a command when they are not specified in the command’s options explicitly. If you want to avoid that, always specify the mandatory options of the commands. All such options are detailed in the [Command Description](./CommandsManual.md#command-description).

##### Example: Unassign All Devices From A Device Group #####

A Device Group is not specified in the command below, but the current directory contains a Project File. All Devices are unassigned from the Device Group referenced by that Project File.

```bash
> impt dg unassign
The following Devices are unassigned successfully from Device Group "dfcde3bd-3d89-6c75-bf2a-a543c47e586b":
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
Device:
  id:            23522f6938a609ee
  name:          myDevice2
  mac_address:   0c:2a:69:03:ea:f0
  agent_id:      5t0B6z6c4nHF
  device_online: true
IMPT COMMAND SUCCEEDS
```

## Entity Identification ##

Many *impt* commands have options which specify an impCentral API entity: a concrete Product, Device Group, Device or Deployment, etc. You can use an entity ID (Product ID, Device Group ID, etc.) as it is always unique. But sometimes it may be more convenient to use other attributes to specify an entity, and *impt* allows you to do this. For example, Product name, Device Group name, device MAC address, device agent ID, build SHA, build tag, etc. These attributes may not be unique. You can specify different attributes as an option value and the tool searches for the specified value among different attributes.

If you want to use this feature, please read the [Commands Manual](./CommandsManual.md#entity-identification) first. It contains the rules governing how the tool searches an entity, and the lists of attributes acceptable for different entities. Command options, to which the complex entity identification is applicable, are detailed in the [Command Description](./CommandsManual.md#command-description). Note that if more than one entity is found, then, depending on a particular command, it may be considered as a success (for all [Entity Listing](#entity-listing-and-ownership) commands) or as a fail (for all other commands).

When it is hard to uniquely specify an entity without knowing the entity ID, use [entity listing](#entity-listing-and-ownership) commands to view the entities basing on some attributes, choose the required entity and use its entity ID in the required command.

For some impCentral entities, such as Products and Device Groups, *impt* provides the ability, when using hierarchical identifiers, to identify them solely by their name. This is particularly helpful when you are developing scripts: you can pass the name of an entity and then call all manipulation commands with that entity (create, update, delete, etc.) without first obtaining the ID of the entity. The format and details of every concrete hierarchical identifier are described in the [Commands Manual](./CommandsManual.md#entity-identification).

##### Example 1: An Entity Is Found Successfully**

```bash
> impt device info --device 0c:2a:69:05:0d:62
Device:
  id:                      234776801163a9ee
  name:                    myDevice1
  agent_id:
  agent_url:
  device_online:           true
  device_state_changed_at: 2018-01-21T22:08:53.017Z
  agent_running:           false
  agent_state_changed_at:
  last_enrolled_at:        2018-01-19T14:15:39.247Z
  imp_type:                imp001
  ip_address:              93.80.11.190
  mac_address:             0c:2a:69:05:0d:62
  free_memory:             84720
  rssi:                    -51
  swversion:               1ae4c87 - release-36.13 - Wed Dec 20 10:52:30 2017 - production
  plan_id:
IMPT COMMAND SUCCEEDS
```

##### Example 2: An Entity Is Not Unique, So The Command Fails #####

```bash
> impt dg info --dg TestDG
Error: Multiple Device Groups "TestDG" are found:
Device Group:
  id:      3667ed96-12cd-ea20-9c09-0b2f32d1f73b
  type:    development
  name:    TestDG
  Product:
    id:   2390fed8-d14c-cd55-2176-30e370b23519
    name: TestProduct
Device Group:
  id:      60faac39-1d5a-8494-d4d2-5f0744e67c27
  type:    development
  name:    TestDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Impossible to execute the command.
IMPT COMMAND FAILS
```

##### Example 3: Using A Hierarchical Identifier #####

```bash
> impt dg info --dg {me}{TestProduct}{TestDG}
Device Group:
  id:          3667ed96-12cd-ea20-9c09-0b2f32d1f73b
  type:        development
  name:        TestDG
  description:
  region:
  created_at:  2018-11-12T12:25:06.777Z
  updated_at:  2018-11-12T12:25:06.777Z
  Product:
    id:   2390fed8-d14c-cd55-2176-30e370b23519
    name: TestProduct
IMPT COMMAND SUCCEEDS
```

## Entity Listing And Ownership ##

Many groups of commands contain a command to list entities: [Products](./CommandsManual.md#product-list), [Device Groups](./CommandsManual.md#device-group-list), [Devices](./CommandsManual.md#device-list), [Builds](./CommandsManual.md#build-list) and [Webhooks](./CommandsManual.md#webhook-list). By default, such a command returns the list of all entities available to the current (ie. logged in) account. But the returned list may be filtered using filter options. These are the common rules applicable to all list commands:

- Every filter option may be repeated several times.
- At first, all filter options with the same name are combined by logical OR.
- After that, all filter options with different names are combined by logical AND.

Some filter options have the same name and meaning across list commands. They are summarized [here](./CommandsManual.md#common-filter-options). A particular command may have specific filter options too. Filter options applicable to every concrete list command are detailed in the [Command Description](./CommandsManual.md#command-description).

For some list commands, the default returned list includes not only entities owned by the current account but also entities owned by accounts for which the current account is a collaborator. For other list commands, only the entities owned by the current account are returned. This is impCentral API-specific behavior not controlled by *impt*. However, you can always specify a concrete Account ID, email or username as a value of the `--owner <value>` filter option (alias: `-o`) and get the entities owned by the specified account, if they are available to you as to a collaborator. You can specify the `--owner me` filter option to get only your own entities.

As a general rule, if an entity is owned by the current logged-in account, information about the Owner is not displayed. If an entity is owned by another account, then the Account ID and email of the Owner are displayed for the entity. This rule applies to all *impt* commands which display details of an entity: entity listing, [entity information](#entity-information) and other.

To display the Account ID and email of the current account, use [`impt auth info`](./CommandsManual.md#auth-info).

To display the Account ID, email and other attributes of any available account, use the [Account Information Commands](./CommandsManual.md#account-information-commands) [`impt account list`](./CommandsManual.md#account-list) and [`impt account info`](./CommandsManual.md#account-info).

##### Example 1: List All Products Owned By Me And My Collaborators #####

```bash
> impt product list
Product list (4 items):
Product:
  id:   30f19176-2b38-838d-62fd-38f5f3602ea4
  name: MyProduct
Product:
  id:    c4e006ed-85b9-3513-fa99-0700333c3ad7
  name:  MyProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
    username: username
Product:
  id:   885dfd24-e8f6-0621-32fc-556d24ed4cab
  name: SmartFridge
Product:
  id:    2390fed8-d14c-cd55-2176-30e370b23519
  name:  TestProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
    username: username
IMPT COMMAND SUCCEEDS
```

##### Example 2: List All Factory Device Groups Owned By A Specified Account #####

```bash
> impt dg list --owner user@email.com --dg-type pre-factory --dg-type factory
Device Group list (2 items):
Device Group:
  id:      3fad5031-8b4e-da7a-dee3-df410e06bb5f
  type:    pre-factory
  name:    MyPreFactoryDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
    username: username
Device Group:
  id:      b26aae4c-92d7-7e60-7c71-3fe2486e352f
  type:    factory
  name:    MyFactoryDG
  Product:
    id:   ffa85f81-83a7-ae85-d571-8875b3bd29d6
    name: MyFactoryProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
    username: username
IMPT COMMAND SUCCEEDS
```

##### Example 3: List All Device Groups Owned By Me And Belonging To The Specified Products #####

```bash
> impt dg list --owner me --product MyProduct --product TestProduct
Device Group list (4 items):
Device Group:
  id:      bbe4605c-6464-ad89-7745-78579c4705f7
  type:    development
  name:    MyDevDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      3fad5031-8b4e-da7a-dee3-df410e06bb5f
  type:    pre-factory
  name:    MyPreFactoryDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      da27eb09-61d7-100b-095e-47578bada966
  type:    pre-production
  name:    MyPreProductionDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      3667ed96-12cd-ea20-9c09-0b2f32d1f73b
  type:    development
  name:    TestDG
  Product:
    id:   2390fed8-d14c-cd55-2176-30e370b23519
    name: TestProduct
IMPT COMMAND SUCCEEDS
```

##### Example 4: List All Available Accounts To Which I Have Access #####

```bash
> impt account list
Account list (3 items):
Account:
  id:       c1d61eef-d544-4d09-c8dc-d43e6742cae3
  email:    user@email.com
  username: username
Account:
  id:       8047f481-5040-ac99-7e72-af156da4b497
  email:    user2@email.com
  username: username2
IMPT COMMAND SUCCEEDS
```

## Entity Information ##

Most command groups contain the `info` command, which displays information about the specified entity. Some of that commands have a `--full` option (alias: `-u`). When it is specified, the command displays additional details about the related entities. For example, `impt product info --full` displays the full structure of the Product: details about every Device Group that belongs to the Product, and about devices assigned to the Device Groups.

##### Example #####

```bash
> impt product info --product MyProduct --full
Product:
  id:            c4e006ed-85b9-3513-fa99-0700333c3ad7
  name:          MyProduct
  description:
  created_at:    2018-01-21T22:07:59.711Z
  updated_at:    2018-01-21T22:07:59.711Z
  Device Groups:
    Device Group:
      id:                       dfcde3bd-3d89-6c75-bf2a-a543c47e586b
      type:                     development
      name:                     MyDevDG
      Current Deployment:
        id:      bf485681-37c3-a813-205a-e90e19b1a817
        sha:     4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
        tags:    MyRC1
        flagged: true
      Min supported Deployment:
        id:  6dfda2e3-20c9-d6aa-259e-a25bff906af5
        sha: a2a40343f62f172a873ecffd99e741e0cc2107b4c3bae38445baa31bec11d8b5
      Devices:
        Device:
          id:            234776801163a9ee
          name:          myDevice1
          mac_address:   0c:2a:69:05:0d:62
          agent_id:      T1oUmIZ3At_N
          device_online: true
IMPT COMMAND SUCCEEDS
```

## Entity Deletion ##

By default, commands which delete impCentral entities (eg. Product, Device Group, Deployment, etc.) have the same limitations as the corresponding impCentral API functionality. For example, a Product deletion fails if the Product contains one or more Device Groups; a build (Deployment) fails if the Deployment has the *flagged* attribute set to `true`. If you specify the delete command’s `--force` option (alias: `-f`), the tool implicitly deletes all dependent entities in order to delete the target entity. For example, the tool deletes all Device Groups of the Product in order to delete the Product; if necessary, the tool updates each Deployment’s *flagged* attribute in order to delete the Deployment.

By default, every delete command asks a confirmation of the operation from user. Before that the command lists all the entities which are to be deleted or updated. If you specify the `--confirmed` option (alias: `-q`), the operation is executed without requesting confirmation from the user.

##### Example 1: A Failed Delete Command Execution #####

```bash
> impt dg delete --dg MyDevDG --confirmed
Error: Flagged Deployments Exist: Cannot delete a devicegroup with flagged deployments; delete those first.
IMPT COMMAND FAILS
```

##### Example 2: A Successful Delete Command Execution #####

```bash
> impt dg delete --dg MyDevDG --force
The following entities will be deleted:
Device Group:
  id:   dfcde3bd-3d89-6c75-bf2a-a543c47e586b
  type: development
  name: MyDevDG

The following Deployments are marked "flagged" to prevent deleting. They will be modified
by setting "flagged" attribute to false:
Deployment:
  id:      bf485681-37c3-a813-205a-e90e19b1a817
  sha:     4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:    MyRC1
  flagged: true

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Deployment "bf485681-37c3-a813-205a-e90e19b1a817" is updated successfully.
Device Group "MyDevDG" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

## Non-atomic Transactions ##

Many *impt* commands combine several impCentral API requests which change impCentral API entities (like update, delete, etc.) to perform one operation. *impt* does its best to pre-check all conditions before starting every operation. At the same time, it does not guarantee an operation is atomic. It is always possible that the first impCentral API update request succeeds but the next one fails &mdash; if the connection is lost, for example. In this case, the operation is partially completed, *impt* does not restore the original state of already changed entities, and the command reports a failure. You can check an actual state of any impCentral entity using [entity information](#entity-information) commands.

## Testing ##

There are [Jasmine](https://www.npmjs.com/package/jasmine) tests available to verify *impt* implementation itself. This [Read Me](./spec/README.md) describes how to run the tests and extend them, if necessary.

## License ##

*impt* is licensed under the [MIT License](./LICENSE)

# impt

impt is a command line tool which allows to interact with the [Electric Imp impCentral&trade; API](https://apidoc.electricimp.com) for different purposes - development, testing, device and product management, creating deployments for factory and production, etc.

The impt tool supersedes [build-cli](https://github.com/electricimp/build-cli) and [impTest](https://github.com/electricimp/impTest) tools and includes much more additional functionality.

This readme covers all basic and common aspects of the impt tool. Read it first. More details you can find in the following documentation:
- [impt Development Guide](./DevelopmentGuide.md),
- [impt Testing Guide](./TestingGuide.md),
- [impt Production Guide](./ProductionGuide.md),
- [impt Commands Manual](./CommandsManual.md).

The impt tool is written in [Node.js](https://nodejs.org) and uses the [Electric Imp impCentral&trade; API JavaScript library](https://github.com/electricimp/imp-central-api).

Table Of Contents:
- [Installation](#installation)
- [Syntax and Command Groups](#syntax-and-command-groups)
- [Help](#help)
- [Debug](#debug)
- [Scripts Support](#scripts-support)
- [Authentication](#authentication)
- [Login Key](#login-key)
- [Project](#project)
- [Entity Identification](#entity-identification)
- [Entity Listing and Owning](#entity-listing-and-owning)
- [Entity Information](#entity-information)
- [Entity Deletion](#entity-deletion)
- [No Atomic Transaction](#no-atomic-transaction)
- [License](#license)

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

The most of commands have optional arguments called options - `<options>`. Options may be written in any order. As a general rule, the same option should not be specified many times in the same command, but exceptions exist. Some options require values, some not. If option value has spaces it must be put into double quotes - `“option value with spaces”`. Every option has one letter [alias](./CommandsManual.md#list-of-aliases). The aliases are unique for a particular command but may be reused for different options in different commands. The same option in different commands always has the same alias. The options and aliases are detailed in the [Commands Description](./CommandsManual.md#commands-description).

*Examples*  
*The syntax and commands with options:*  
`impt product create --name TestProduct --descr "My test product"`  
`impt dg create --name "TestDG" -y development -p TestProduct`  
`impt device assign -g TestDG -d "my device 1"`  

## Help

Every command has `--help` option (`-h` option alias). If it is specified, any other specified options are ignored, the command is not executed but the tool displays full description of the command - the format, explanation, options. 

[Help option](./CommandsManual.md#help-option) is also applicable to a not fully specified command. It may be used to list all available command groups or to list all commands available in one group.

*Example*  
*List all command groups:*  
```
impt --help

Usage: impt <command> [options]

Commands:
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
  --help, -h  Displays description of the command. Ignores any other options.
                                                                       [boolean]
```

*Example*  
*List all commands in one group:*  
```
impt product --help

Usage: impt product <command> [options]

Product manipulation commands.

Commands:
  impt product create  Creates a new Product.
  impt product delete  Deletes the specified Product.
  impt product info    Displays information about the specified Product.
  impt product list    Displays information about all or filtered Products.
  impt product update  Updates the specified Product.

Options:
  --help, -h  Displays description of the command. Ignores any other options.
                                                                       [boolean]
```

*Example*  
*Display a command description:*
```
impt product create --help

Usage: impt product create --name <product_name> [--descr <product_description>]
[--debug] [--help]

Creates a new Product. Fails if Product with the specified Name already exists.

Options:
  --help, -h   Displays description of the command. Ignores any other options.
                                                                       [boolean]
  --name, -n   Name of the Product. Must be unique among all Products owned by
               the logged-in account.                        [string] [required]
  --descr, -s  Description of the Product.                              [string]
  --debug, -z  Displays debug info of the command execution.           [boolean]
```

## Debug

Every command has `--debug` option (`-z` option alias). If it is specified, the tool displays debug information of the command execution, including impCentral API requests and responses.

*Example*:  
```
impt product create --name TestProduct --descr "My test product" --debug
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
  "date": "Sun, 21 Jan 2018 21:40:22 GMT",
  "content-type": "application/vnd.api+json",
  "content-length": "477",
  "connection": "close",
  "server": "nginx/1.4.6 (Ubuntu)",
  "content-language": "en",
  "x-node": "api03",
  "accept": "application/vnd.api+json",
  "x-ratelimit-limit": "40",
  "x-ratelimit-reset": "1",
  "x-ratelimit-remaining": "39",
  "strict-transport-security": "max-age=1209600"
}
Response body: {
  "data": {
    "type": "product",
    "id": "91f2e41a-3c5c-00bf-1ddd-1c0a2fdbeadd",
    "links": {
      "self": "https://api.electricimp.com/v5/products/91f2e41a-3c5c-00bf-1ddd-1c0a2fdbeadd"
    },
    "attributes": {
      "name": "TestProduct",
      "description": "My test product",
      "created_at": "2018-01-21T21:40:22.631Z",
      "updated_at": "2018-01-21T21:40:22.631Z"
    },
    "relationships": {
      "owner": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c9dc-d53e6742cae3"
      },
      "creator": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c9dc-d53e6742cae3"
      }
    }
  }
}
Product "TestProduct" is created successfully.
IMPT COMMAND SUCCEEDS
```

## Scripts Support

The tool's commands are designed to be "friendly" for processing by scripts.

Interaction with a user is minimal. Only few commands, for example [delete entities](#entity-deletion) commands, ask a confirmation from user. But all these commands have `--confirmed` option (`-q` option alias). If it is specified, the command is executed without asking additional confirmation from user. Scripts can use this option.

Output of a command execution contains one of the two predefined phrases - `IMPT COMMAND SUCCEEDS` or `IMPT COMMAND FAILS`. Scripts can parse a command's output to find these standard phrases to quickly realize does the command succeed or fail. If any command fails, `IMPT COMMAND FAILS` phrase is always on the last line of the command's output. If a command succeeds, `IMPT COMMAND SUCCEEDS` phrase is also on the last line of the output for the most of the commands. Logging-related commands may have additional `IMPT COMMAND SUCCEEDS` phrases in their output. If the [help option](./CommandsManual.md#help-option) is specified for a command, it's output does not contain neither predefined phrase.

*Example*  
*A successful command execution:*  
```
impt product delete --product TestProduct --confirmed
Product "TestProduct" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

*Example*  
*A failed command execution:*  
```
impt product delete --product TestProduct --confirmed
ERROR: Product "TestProduct" is not found.
IMPT COMMAND FAILS
```

## Authentication

To access the impCentral API you need to be authenticated first. The impt tool provides the following ways of authentication by the [login command](./CommandsManual.md#auth-login):
- using an account identifier (an email address or a username) and password - `impt auth login --user <user_id> --pwd <password>`
- using a [login key](#login-key) - `impt auth login --lk <login_key_id>`

The tool takes care of obtaining an access token and refreshing it using an obtained refresh token or the provided login key (depends on the way of the authentication). It means, in general, you need to login only once and can continue using the tool while the refresh token / the login key is valid (not deleted by you). For this purpose the tool stores the access token and the refresh token / the login key in [Auth File](./CommandsManual.md#auth-file).

The impt tool never stores an account identifier and password. If you do not want the tool to store a refresh token / a login key, use `--temp` option of the [login command](./CommandsManual.md#auth-login). In this case you will not be able to work with the impCentral API after the access token is expired (usually it happens in about one hour but depends on the impCentral). You will have to login again to continue the work.

At any time you can call the [logout command](./CommandsManual.md#auth-logout) - `impt auth logout` - to delete [Auth File](./CommandsManual.md#auth-file). Usually you will not be able to work with the impCentral API right after the logout and will have to login again to continue the work. But see the explanation about global and local login/logout below.

You do not need to use the logout command if you want just to re-login using other credentials. A new login command overwrites [Auth File](./CommandsManual.md#auth-file), if that existed and the operation is confirmed by user.

During the login you can specify an alternative impCentral API endpoint using `--endpoint` option (`-e` option alias) of the [login command](./CommandsManual.md#auth-login). You may need this if you work with a private impCloud&trade; installation. The default endpoint is `https://api.electricimp.com/v5`

There are two types of login - global and local.

**Global login** is the default one. It is enough to use only it if you always work on behalf of the same user with the same impCentral
API endpoint. [Global Auth File](./CommandsManual.md#global-auth-file) - only one per the impt tool installation - is created for the global login. It is located in the tool specific place. Every impt command is executed in the context of the global login when a local login is not applicable.

**Local login** works for a particular directory. It may be convenient if you often work on behalf of different users or use different impCentral API endpoints. In this case, you may choose a directory and in this directory call the [login command](./CommandsManual.md#auth-login) with `--local` option (`-l` option alias). If the authentication is successful, [Local Auth File](./CommandsManual.md#local-auth-file) is created in this directory. After that, every impt command called from this directory is executed in the context of the local login.

There can be only one [Local Auth File](./CommandsManual.md#local-auth-file) in a directory, but any number of directories with local Auth Files, i.e. any number of local logins. And all of them are independent from each other and from [Global Auth File](./CommandsManual.md#global-auth-file). You do not need to have the global login in order to use local logins. Note, that local Auth File affects the current directory only and does not affect any subdirectories - they may or may not contain their own local Auth Files.

The [logout command](./CommandsManual.md#auth-logout) with `--local` option (`-l` option alias) deletes [Local Auth File](./CommandsManual.md#local-auth-file), if it exists in the current directory. After that, any next command called from this directory will be executed in the context of the global login. The [logout command](./CommandsManual.md#auth-logout) without `--local` option deletes [Global Auth File](./CommandsManual.md#global-auth-file).

Summary of the **impt command execution context**:
- If the current directory contains Auth File, this file is considered as [Local Auth File](./CommandsManual.md#local-auth-file) and a command called from this directory is executed in the context of the local login defined by this file.
- Otherwise, if [Global Auth File](./CommandsManual.md#global-auth-file) exists, a command is executed in the context of the global login defined by that file.
- Otherwise, a command fails (global or local login is required).

At any time you can get known the login status related to any directory. Call the [auth info command](./CommandsManual.md#auth-info) from the required directory - `impt auth info`. The returned information includes a type of the login applicable to the current directory, access token status, your account Id and other details.

*Example*  
*Global login:*  
```
impt auth login --user username --pwd password
Global login is successful.
IMPT COMMAND SUCCEEDS
```

*Example*  
*Local login using a login key, specifying a endpoint, without storing the login key:*  
```
impt auth login --local --lk 7d8e6670aa285e9d --temp --endpoint https://api.electricimp.com/v5
Local login is successful.
IMPT COMMAND SUCCEEDS
```

*Example*  
*Display login status:*  
```
impt auth info
Auth info:
impCentral API endpoint:   https://api.electricimp.com/v5
Auth file:                 Local
Access token auto refresh: false
Access token:              expires in 59 minutes
Username:                  username
Email:                     user@email.com
Account id:                c1d61eef-d544-4d09-c8dc-d43e6742cae3
IMPT COMMAND SUCCEEDS
```

*Example*  
*Local logout:*  
```
impt auth logout --local
Local logout is successful.
IMPT COMMAND SUCCEEDS
```

## Login Key

The tool provides a set of [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) which allows you to fully control the login keys of your account - list the existent login keys, create a new one, delete, etc. Of course, you need to be logged-in in order to use that commands. Some commands additionally requires the password.

*Example*  
*Login key list:*  
```
impt loginkey list
Login Key list (1 items):
Login Key:
  id:     7d8e6670aa285e9d
  usages: 1
IMPT COMMAND SUCCEEDS
```

## Project

Project is an artificial entity introduced to help developers to align their work with the impCentral API. It is similar to Workspace in the impCentral IDE. Project is any directory where [Project File](./CommandsManual.md#project-file) is located. Project relates to one and only one Device Group of the impCentral API.

Project is intended for developers and described in details in the [Development Guide](./DevelopmentGuide.md). The tool provides a set of [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) to operate with Project.

But many other commands may be affected when called from a directory where [Project File](./CommandsManual.md#project-file) is located. Product, Device Group, Devices, Deployment referenced by the Project File may be assumed by a command when they are not specified in the command's options explicitly. If you want to avoid that, always specify the mandatory options of the commands. All such options are detailed in the [Commands Description](./CommandsManual.md#commands-description).

*Example*  
*Unassign all Devices from Device Group. A Device Group is not specified in the command below. But the current directory contains Project File. All Devices are unassigned from the Device Group referenced by that Project File:*  
```
impt dg unassign
Devices assigned to Device Group "dfcde3bd-3d89-6c75-bf2a-a543c47e586b" are unassigned successfully.
IMPT COMMAND SUCCEEDS
```

## Entity Identification

Many impt tool commands have options which specify an impCentral API entity - a concrete Product, Device Group, Device, Deployment, etc. You can use an entity Id (Product Id, Device Group Id, etc.) that is always unique. But sometime it may be more convenient to use other attributes to specify an entity. For example, Product Name, Device Group Name, Device MAC address, Device agent Id, Build sha, Build tag, etc. The tool provides such a possibility. You can specify different attributes as an option value and the tool searches the specified value among different attributes.

If you want to use this feature, please first read [here](./CommandsManual.md#entity-identification) the rules how the tool searches an entity and the lists of attributes acceptable for different entities. Command's options, to which the complex entity identification is applicable, are detailed in the [Commands Description](./CommandsManual.md#commands-description). Note, if more than one entity is found, then, depending on a particular command, it may be considered as a success (for all [Entity Listing](#entity-listing-and-owning) commands) or as a fail (for all other commands).

When it is hard to uniquely specify an entity without knowing the entity Id, use [Entity Listing](#entity-listing-and-owning) commands to list the entities basing on some attributes, choose the required entity, notice it's Id and use it in the required command.

*Example*  
*An entity is found successfully:*  
```
impt device info --device 0c:2a:69:05:0d:62
Device:
  id:                      234776801163a9ee
  name:                    my device 1
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

*Example*  
*An entity is not unique, the command fails:*  
```
impt build info --build MyRC1
ERROR: Multiple Deployments "MyRC1" are found:
Deployment:
  id:           24aa0e91-ebc0-9198-090c-44cca8b977f3
  sha:          4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:         MyRC1
  flagged:      true
  Device Group:
    id:   da27eb09-61d7-100b-095e-47578bada966
    type: pre-production
    name: MyPreProductionDG
Deployment:
  id:           bf485681-37c3-a813-205a-e90e19b1a817
  sha:          4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:         MyRC1
  flagged:      true
  Device Group:
    id:   dfcde3bd-3d89-6c75-bf2a-a543c47e586b
    type: development
    name: MyDevDG
Impossible to execute the command.
IMPT COMMAND FAILS
```

## Entity Listing and Owning

Many groups of commands contain a command to list entities - [list Products](./CommandsManual.md#product-list), [list Device Groups](./CommandsManual.md#device-group-list), [list Devices](./CommandsManual.md#device-list), [list Builds](./CommandsManual.md#build-list), [list WebHooks](./CommandsManual.md#webhook-list). By default, such a command returns the list of all entities available to the current logged-in account. But the returned list may be filtered using the specified attributes - Filter Options - additional options of a list command. There are the common rules applicable to all list commands:
- Every Filter Option may be repeated several times.
- At first, all Filter Options with the same option name are combined by logical OR.
- After that, all Filter Options with different option names are combined by logical AND.

Some Filter Options have the same name and meaning in several list commands. They are summarized [here](./CommandsManual.md#common-filter-options). At the same time, a particular command may have specific Filter Options as well. Filter Options applicable to every concrete list command are detailed in the [Commands Description](./CommandsManual.md#commands-description).

Note, for some list commands the returned default list of entities available to the current logged-in account includes the entities owned by this account as well as the entities owned by the collaborators. But for other list commands - only the entities owned by the current account. It is impCentral specific behavior, not controlled by the impt tool. But you can always specify a concrete Account Id, email or username as a value of the `--owner <value>` Filter Option (`-o` option alias) and get the entities owned by that account, if they are available to you as to a collaborator. Also, you can always specify the `--owner me` Filter Option and get the entities owned by you only.

As a general rule, if an entity is owned by the current logged-in account, information about Owner is not displayed. If an entity is owned by another account, then Account Id and email of the Owner are displayed for the entity. This rule applies to all impt commands which display details of an entity - entity listing, [entity information](#entity-information) and other.

To display Account Id and email of the current logged-in account call the [auth info command](./CommandsManual.md#auth-info) - `impt auth info`.

*Example*:  
**TODO** screenshot - a complex list command, with AND and OR, with Owner details, with not a huge output

*Example*:  
**TODO** screenshot - another list command, with --owner me and some other filters, with not a huge output

## Entity Information

The most of command groups contain `info` command which displays information about the specified entity. Some of that commands have `--full` option (`-u` option alias). When it is specified, the command displays additional details about the related entities. For example, `impt product info --full` command displays the full structure of the Product: Details about every Device Group that belongs to the Product, about Devices assigned to the Device Groups and other.

*Example*:  
```
impt product info --product MyProduct --full
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
          name:          my device 1
          mac_address:   0c:2a:69:05:0d:62
          agent_id:      T1oUmIZ3At_N
          device_online: true
IMPT COMMAND SUCCEEDS
```

## Entity Deletion

By default, the commands which delete impCentral entities (like Product, Device Group, Deployment) have the same limitations like the corresponding impCentral API functionality. For example, a Product deletion fails if the Product has Device Groups; a build (Deployment) fails if the Deployment has the *"flagged"* attribute set to *true*. If you specify the `--force` option (`-f` option alias) of the delete command, the tool implicitly update or delete all other required entities in order to delete the target entity. For example, the tool deletes all Device Groups of the Product in order to delete the Product; the tool updates the *"flagged"* attribute of the Deployment in order to delete the Deployment.

Also by default, every delete command asks a confirmation of the operation from user. Before that the command lists all the entities which are going to be deleted or updated. If you specify the `--confirmed` option (`-q` option alias), the operation is executed without asking additional confirmation from user.

*Example*  
*A failed delete command execution:*  
```
impt dg delete --dg MyDevDG --confirmed
ERROR: Flagged Deployments Exist: Cannot delete a devicegroup with flagged deployments; delete those first.
IMPT COMMAND FAILS
```

*Example*  
*A successful delete command execution:*  
```
impt dg delete --dg MyDevDG --force
The following entities will be deleted:
Device Group:
  id:   dfcde3bd-3d89-6c75-bf2a-a543c47e586b
  type: development
  name: MyDevDG

The following Deployments are marked "flagged" to prevent deleting. They will be modified by setting "flagged" attribute to false:
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

## No Atomic Transaction

Many impt commands use several impCentral API requests which changes impCentral API entities (like update, delete, etc.) to perform one operation. The impt tool does the best to pre-check all conditions before starting every operation. At the same time, the impt tool does not guarantee an operation is atomic. It is always possible that the first impCentral API update request succeeds but the next one fails due to the network connection lost. In this case, the operation is partially completed, the impt tool does not restore the original state of already changed entities, the impt command reports a fail. You can check an actual state of any impCentral entity using [entity information](#entity-information) commands.

## License

The impt tool is licensed under the [MIT License](./LICENSE)

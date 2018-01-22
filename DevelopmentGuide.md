# impt Development Guide

This additional guide is intended for developers who use the impt tool to develop IMP applications and/or [factory firmware](https://developer.electricimp.com/examples/factoryfirmware).

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

Table Of Contents:
- [Project](#project)
- [Development Operations](#development-operations)
  - [Project Creation](#project-creation)
  - [Project Updating](#project-updating)
  - [Device Manipulation](#device-manipulation)
  - [Build Creation and Running](#build-creation-and-running)
  - [Logging](#logging)
  - [Project Info](#project-info)
  - [Project Sharing](#project-sharing)
  - [Project Deletion](#project-deletion)
- [Typical Usecase](#typical-usecase)
  - [Develop IMP Application](#develop-imp-application)
  - [Develop Factory Firmware](#develop-factory-firmware)
  - [Cleanup](#cleanup)

## Project

Project is an artificial entity intended to help developers to align their work with the impCentral API. It:
- links files with IMP device and agent source code to a Device Group.
- simplifies calling of many impt commands.
- allows to easy share and/or move your project between users and/or computers.

Note, Project is not mandatory for a development process. You can do the same actions without using Project. Project just simplifies some of the actions.

One Project is encapsulated in one directory. A directory represents a project if [Project File](./CommandsManual.md#project-file) is located in the directory. There may be one and only one [Project File](./CommandsManual.md#project-file) in a directory. All directories/Projects are independent. A subdirectory may contain a totally different Project, etc.

The main link from Project to impCentral API is Device Group. Project relates to one and only one Device Group. It is specified during Project creation and cannot be changed to another Device Group after that (Project re-creation should be used for that). Only two [types](./CommandsManual.md#device-group-type) of Device Group are supported by Project:
- *development* - for IMP application.
- *pre-factory* - for [factory firmware](https://developer.electricimp.com/examples/factoryfirmware).

Indirectly, Project relates to other impCentral API entities as well. For example, Product which includes the Device Group, the latest Deployment of the Device Group, Devices assigned to the Device Group.

Project always relates to two files - with IMP device source code and IMP agent source code. It is assumed the files are located in the same directory with [Project File](./CommandsManual.md#project-file). At any time Project may be updated to link other file(s). Anyone or the both files may not exist in reality. All project-related operations still work in this case. When you ask to deploy a new build and one or the both files do not exist, the Deployment is created with empty corresponding source code.

When you call impt commands from a directory with [Project File](./CommandsManual.md#project-file) all the related entities (Device Group, Product, Deployment, Devices, files) are assumed by default. I.e. you may not specify them explicitly in the corresponding commands. 

Note, the impt tool, as well as impCentral API, does not provide any source code version control or software configuration management functionality. That may be done by other appropriate tools. The impt Project just links the source files to impCentral API entities.

For Project management the impt tool includes a special group of commands - [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands).

## Development Operations

It is assumed that all commands are called from the directory where your Project is located.

### Project Creation

Project creation is a creation of [Project File](./CommandsManual.md#project-file) in a directory from where a project creation command is called. If the directory already contains [Project File](./CommandsManual.md#project-file), it is overwritten after confirmation from a user, i.e. you can quickly create a new Project at the place of the previous one. In some cases it may be convenient. But in a general case it is recommended to [explicitly delete](#project-deletion) the previous Project.

There are two ways to create Project - [base on an existing Device Group](#link-device-group) or [create a new one](#create-new-device-group).

#### Link Device Group

By [**impt project link**](./CommandsManual.md#project-link) command.

It creates Project which relates to already existent Device Group, just links it to the source files. The source files can be specified directly - using `--device-file <device_file>` and `--agent-file <agent_file>` options. Or the default names can be used. When `--create-files` option is specified and the file(s) does not exist, the command creates the empty file(s).

*Example*  
```
> impt project link -g MyDG -c
Device source file "device.nut" is created successfully.
Agent source file "agent.nut" is created successfully.
Project is linked successfully.
Project info:
Device file:  device.nut
Agent file:   agent.nut
Device Group:
  id:          27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9
  type:        development
  name:        MyDG
  description: New description of my DG
  region:
  created_at:  2018-01-22T18:20:28.399Z
  updated_at:  2018-01-22T18:21:10.057Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
IMPT COMMAND SUCCEEDS
```

#### Create New Device Group

By [**impt project create**](./CommandsManual.md#project-create) command.

It creates new Device Group and Project which relates to that Device Group. The Device Group should belong to a Product:
- if you already have/know the Product, specify its Id or Name as a value of `--product <PRODUCT_IDENTIFIER>` option.
- if you want/need to create a new Product, specify Name of the new Product as a value of `--product <PRODUCT_IDENTIFIER>` option and specify `--create-product` option.

By default it is assumed the new Project is going to be used for IMP application development and the new Device Group is of the [type](./CommandsManual.md#device-group-type) *development*.

If you create Project for [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) development, specify `--pre-factory` option. In this case you need to additionally specify a production target Device Group which should be of the [type](./CommandsManual.md#device-group-type) *pre-production* and belong to the same Product:
- if you already have/know the production target Device Group, specify its Id or Name as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option.
- if you want/need to create a new production target Device Group, specify Name of the new Device Group as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option and specify `--create-target` option.

Alternatively, you can pre-create the required impCentral API entities using other impt commands, before creation or linking a new Project. For example, use [**impt product create**](./CommandsManual.md#product-create) command to pre-create the Product, use [**impt dg create**](./CommandsManual.md#device-group-create) command to pre-create the production target Device Group and/or the project's Device Group itself.

*Example*  
```
> impt project create -p MyProduct -n MyDG -c
Device Group "MyDG" is created successfully.
Device source file "device.nut" is created successfully.
Agent source file "agent.nut" is created successfully.
Project is created successfully.
Project info:
Device file:  device.nut
Agent file:   agent.nut
Device Group:
  id:          27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9
  type:        development
  name:        MyDG
  description:
  region:
  created_at:  2018-01-22T18:20:28.399Z
  updated_at:  2018-01-22T18:20:28.399Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
IMPT COMMAND SUCCEEDS
```

### Project Updating

At any time you can update your Project by [**impt project update**](./CommandsManual.md#project-update) command. The following can be updated:
- the project's Device Group Name and Description, the production target Device Group. The same can be done by [**impt dg update**](./CommandsManual.md#device-group-update) command as well.
- change the source files which are linked to the Project. You can specify new file name(s), rename the previous file(s), create empty file(s).

Note, you can update other impCentral API entities related to your Project by using other impt commands. For example, use [**impt product update**](./CommandsManual.md#product-update) command to change Name and Description of the related Product.

*Example - Update Description of the project's Device Group, rename the linked device source file to "device1.nut"*  
```
> impt project update -s "New description of my DG" -x device1.nut -r
Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9" is updated successfully.
Device source file "device.nut" is renamed successfully to "device1.nut".
Project is updated successfully.
Project info:
Device file:  device1.nut
Agent file:   agent.nut
Device Group:
  id:          27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9
  type:        development
  name:        MyDG
  description: New description of my DG
  region:
  created_at:  2018-01-22T18:20:28.399Z
  updated_at:  2018-01-22T18:21:10.057Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
IMPT COMMAND SUCCEEDS
```

### Device Manipulation

At any time you can easily add or remove devices to/from your Project. That means assigning/unassigning Devices to/from the project's Device Group. You just need to know an identifier of the required Device - either Device Id, or Device Name, or MAC address, or IMP Agent Id.
- use [**impt device assign --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-assign) command to add the specified Device to your Project.
- use [**impt dg reassign --from <DEVICE_GROUP_IDENTIFIER>**](./CommandsManual.md#device-group-reassign) command to add all Devices from the specified (by Id or Name) Device Group to your Project.
- use [**impt device unassign --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-unassign) command to remove the specified Device from your Project.
- use [**impt dg unassign**](./CommandsManual.md#device-group-unassign) command to remove all Devices from your Project (the project's Device Group).

If you do not remember an identifier of the required Device, you can use [**impt device list**](./CommandsManual.md#device-list) command to find it.

Usually, it is enough to have one device added to your Project for development/debugging purpose.

*Example*  
```
> impt device assign -d myDevice1
Device "myDevice1" is assigned successfully to Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9".
IMPT COMMAND SUCCEEDS
```

*Example*  
```
> impt dg reassign -f TestDG
The following Devices assigned to Device Group "TestDG" are reassigned successfully to Device Group 
"27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9":
Device:
  id:            23522f6938a609ee
  name:          myDevice2
  mac_address:   0c:2a:69:03:ea:f0
  agent_id:      5t0B6z6c4nHF
  device_online: true
IMPT COMMAND SUCCEEDS
```

### Build Creation and Running

To create a new build (Deployment) without running it immediately use [**impt build deploy**](./CommandsManual.md#build-deploy) command. By default the Deployment will be created from the source files referenced by your Project. When you want/need to run the newly created Deployment:
- use [**impt device restart --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-restart) command to run the new build on a concrete device.
- use [**impt dg restart**](./CommandsManual.md#device-group-restart) command to run the new build on all Devices of your Project (the project's Device Group).

Alternatively, you can use [**impt build run**](./CommandsManual.md#build-run) command. It behaves exactly like [**impt build deploy**](./CommandsManual.md#build-deploy) command followed by [**impt dg restart**](./CommandsManual.md#device-group-restart) command.

*Example - Create a new flagged Deployment with Description and tag*  
```
> impt build deploy -s "my new build" -t TAG1 -f
Deployment "b3cd81d0-0be3-b7a3-f15c-df2ded28a154" is created successfully.
IMPT COMMAND SUCCEEDS
```

*Example - Run the new Deployment*  
```
> impt dg restart
Restart request for Devices assigned to Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9" is successful:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
IMPT COMMAND SUCCEEDS
```

### Logging

impCentral API provides two types of logs:

#### Historical Logs

To display historical logs for a device use [**impt log get**](./CommandsManual.md#log-get) command. You do not need to specify an identifier of the device if there is only one device added to your Project (assigned to the project's Device Group).

The log entries are displayed by pages. The page size may be specified in the command. By default, all pages are displayed one by one, starting from the most recent log entry and pausing after every page. To display the next page - press *\<Enter>*. To stop displaying - press *\<Ctrl-C>*. Alternatively, the command allows to specify a page number to display. In this case, only the specified page is displayed and the command finishes.

Note, a limited number of log entries are kept by impCentral API for a limited period of time.

*Example*  
```
> impt log get -s 5
2018-01-22T18:33:59.537Z [agent.log] { "measureTime": "1516646039", "data": 8 }
2018-01-22T18:33:59.536Z [agent.log] Data published successfully:
2018-01-22T18:33:49.321Z [agent.log] { "measureTime": "1516646028", "data": 7 }
2018-01-22T18:33:49.321Z [agent.log] Data published successfully:
2018-01-22T18:33:39.128Z [agent.log] { "measureTime": "1516646018", "data": 6 }
IMPT COMMAND SUCCEEDS

Press <Enter> to see more logs or <Ctrl-C> to exit.

2018-01-22T18:33:49.321Z [agent.log] Data published successfully:
2018-01-22T18:33:39.128Z [agent.log] { "measureTime": "1516646018", "data": 6 }
2018-01-22T18:33:39.128Z [agent.log] Data published successfully:
2018-01-22T18:33:28.790Z [agent.log] { "measureTime": "1516646008", "data": 5 }
2018-01-22T18:33:28.790Z [agent.log] Data published successfully:
IMPT COMMAND SUCCEEDS

Press <Enter> to see more logs or <Ctrl-C> to exit.
IMPT COMMAND SUCCEEDS
```

#### Real-time Logs

impCentral API allows to get log entries from device(s) in real-time as a log stream. Several devices may be added to one log stream but there is a limit on a number of devices. Also, there is a limit on the number of log streams per one account. The both limits are controlled by the impCentral API, not by the impt tool.

The impt tool provides several commands which start displaying real-time logs:
- the most universal command is [**impt log stream**](./CommandsManual.md#log-stream). You can specify several concrete Devices and/or Device Groups, all the devices are added into new log stream and logs displaying is started. If you do not specify any Device or Device Group, all Devices assigned to your project's Device Group are added to the log stream.
- [**impt build run**](./CommandsManual.md#build-run) command with the option `--log` adds all Devices of the Device Group, for which the new Deployment is created, into new log stream and logs displaying is started.
- [**impt dg restart**](./CommandsManual.md#device-group-restart) command with the option `--log` adds all Devices of the rebooted Device Group into new log stream and logs displaying is started.
- [**impt device restart --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-restart) command with the option `--log` adds the specified Device into new log stream and logs displaying is started.

If the total number of devices requested for adding to one log stream exceeds the limit of devices per stream, not all of them are really added. You may check the command's output to see which devices are added and which are not.

While the logs are being streamed no one command can be called. To stop displaying the logs press *\<Ctrl-C>*. Also, the log stream may be closed by the impCentral API. For example, when a new log stream is requested by the same account and that exceeds the limit of opened streams.

Every above command always creates a new log stream. In case impCentral API allows to have only one opened log stream per account, then it means every successful execution of the new command automatically closes the previous log stream, which was working in another impt tool instance or in the impCentral IDE. Starting a log in the impCentral IDE closes the log stream opened in the impt tool.

*Example - Logging is started for a Device from the project's Device Group*  
```
> impt log stream
Log stream for Device(s) 234776801163a9ee is opened.
IMPT COMMAND SUCCEEDS

Press <Ctrl-C> to exit.
[234776801163a9ee] 2018-01-22T18:36:05.603Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:36:05.603Z [agent.log] { "measureTime": "1516646165", "data": 3 }
[234776801163a9ee] 2018-01-22T18:36:15.683Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:36:15.683Z [agent.log] { "measureTime": "1516646175", "data": 4 }
[234776801163a9ee] 2018-01-22T18:36:26.308Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:36:26.308Z [agent.log] { "measureTime": "1516646185", "data": 5 }
IMPT COMMAND SUCCEEDS
```

### Project Info

At any time you can get known the actual status of your Project configuration - the related Device Group, Product, the linked source files, etc. - by [**impt project info**](./CommandsManual.md#project-info) command. Additional option `--full` provides you even more details. For example, information about Devices added to your Project, the login status related to the directory with your Project - like by [**impt auth info**](./CommandsManual.md#auth-info) command.

Use [**impt product info**](./CommandsManual.md#product-info) command with the option `--full` to review the full structure of the Product related by your Project.

*Example*  
```
> impt project info -u
Project info:
Device file:  device.nut
Agent file:   agent.nut
Device Group:
  id:                       27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9
  type:                     development
  name:                     MyDG
  description:              New description of my DG
  region:
  created_at:               2018-01-22T18:20:28.399Z
  updated_at:               2018-01-22T18:35:42.521Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
  Current Deployment:
    id:      8b59afb0-32c6-1221-fdf8-fc5bf38ed155
    sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
    tags:    TAG1
    flagged: true
  Min supported Deployment:
    id:  e3461b2c-75ae-a3b7-7164-f31ec495030b
    sha: 4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  Devices:
    Device:
      id:            234776801163a9ee
      name:          myDevice1
      mac_address:   0c:2a:69:05:0d:62
      agent_id:      T1oUmIZ3At_N
      device_online: true
Auth info:
impCentral API endpoint:   https://api.electricimp.com/v5
Auth file:                 Global
Access token auto refresh: true
Login method:              User/Password
Username:                  username
Email:                     user@email.com
Account id:                c1d61eef-d544-4d09-c8dc-d43e6742cae3
IMPT COMMAND SUCCEEDS
```

### Project Sharing

Your Project can be easily shared, copied or moved, if required by your. For example, copied from one computer to another. Just copy the whole directory with your Project - with [Project File](./CommandsManual.md#project-file) and the linked source files - and continue use the impt tool commands from the new directory.

Note, the directory with your Project can also include [Local Auth File](./CommandsManual.md#local-auth-file). If you do not want to share/copy it, exclude it from copying.

On the contrary, if you want to share/copy the authentication information along with your Project but the directory does not include [Local Auth File](./CommandsManual.md#local-auth-file) (i.e. you use global login), call [**impt auth login**](./CommandsManual.md#auth-login) command with the option `--local` and with the same credentials and endpoint as you used for global login, [Local Auth File](./CommandsManual.md#local-auth-file) will be created and you will be able to copy it as well.

### Project Deletion

There are several levels of Project deletion:
- [**impt project delete**](./CommandsManual.md#project-delete) command without additional options deletes [Project File](./CommandsManual.md#project-file) only. I.e. simply removes a link between Device Group and the source files. The same effect happens when you [create new Project](#project-creation) at the place of the previous one that overwrites the previous [Project File](./CommandsManual.md#project-file).
- [**impt project delete**](./CommandsManual.md#project-delete) command with the option `--files` additionally deletes the linked source files. The same effect happens when you manually remove the directory with your Project.
- [**impt project delete**](./CommandsManual.md#project-delete) command with the option `--entities` additionally deletes the related impCentral API entities - Device Group(s), Product, Deployments, etc. See [the command specification](./CommandsManual.md#project-delete) for more details and explanation. Use this option, for example, when you want/need to cleanup all the entities after your temporal or test project activities.

Note, [**impt project delete**](./CommandsManual.md#project-delete) command never deletes [Local Auth File](./CommandsManual.md#local-auth-file), if it exists in the directory with your Project. Use [**impt auth logout --local**](./CommandsManual.md#auth-login) command to delete [Local Auth File](./CommandsManual.md#local-auth-file) or remove it manually.

*Example - Delete everything*  
```
> impt project delete -a
The following entities will be deleted:
Device Group:
  id:   27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9
  type: development
  name: MyDG
Deployment:
  id:      8b59afb0-32c6-1221-fdf8-fc5bf38ed155
  sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  tags:    TAG1
  flagged: true
Deployment:
  id:  020c6bdf-54fb-9927-8113-b1a5d0b959fc
  sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
Deployment:
  id:  19c28f78-9ab1-6ba5-25c1-5330f181c24a
  sha: 4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05

The following Devices will be unassigned from Device Groups:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true

The following Deployments are marked "flagged" to prevent deleting. They will be modified by setting "flagged" attribute to false:
Deployment:
  id:      8b59afb0-32c6-1221-fdf8-fc5bf38ed155
  sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  tags:    TAG1
  flagged: true

The following files will be deleted:
Device/agent source files: device.nut, agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "234776801163a9ee" is unassigned successfully.
Deployment "8b59afb0-32c6-1221-fdf8-fc5bf38ed155" is updated successfully.
Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9" is deleted successfully.
Deployment "19c28f78-9ab1-6ba5-25c1-5330f181c24a" is deleted successfully.
Deployment "8b59afb0-32c6-1221-fdf8-fc5bf38ed155" is deleted successfully.
Deployment "020c6bdf-54fb-9927-8113-b1a5d0b959fc" is deleted successfully.
Device/agent source files "device.nut", "agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

## Typical Usecase

### Develop IMP Application

1. Login to impCentral API using global login ([Global Auth File](./CommandsManual.md#global-auth-file))  
  `impt auth login --user <user_id> --pwd <password>`  
```
> impt auth login -u username -w password
Global login is successful.
IMPT COMMAND SUCCEEDS
```

1. Create a new directory called, for example, "dev".

1. Go to the new directory.

1. Create a project for an IMP application: a new Product "MyProduct", a new Device Group "MyDevDG" in that Product, empty files "myapp.device.nut" and "myapp.agent.nut", [Project File](./CommandsManual.md#project-file).   
  `impt project create --product MyProduct --create-product --name MyDevDG --descr "IMP Application" --device-file myapp.device.nut --agent-file myapp.agent.nut --create-files`  
```
> impt project create -p MyProduct -i -n MyDevDG -s "IMP Application" -x myapp.device.nut -y myapp.agent.nut -c
Product "MyProduct" is created successfully.
Device Group "MyDevDG" is created successfully.
Device source file "myapp.device.nut" is created successfully.
Agent source file "myapp.agent.nut" is created successfully.
Project is created successfully.
Project info:
Device file:  myapp.device.nut
Agent file:   myapp.agent.nut
Device Group:
  id:          c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
  type:        development
  name:        MyDevDG
  description: IMP Application
  region:
  created_at:  2018-01-22T17:56:27.973Z
  updated_at:  2018-01-22T17:56:27.973Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
IMPT COMMAND SUCCEEDS
```

1. Write the code of your IMP application in "myapp.device.nut" and "myapp.agent.nut" files.

1. [BlinkUp](https://developer.electricimp.com/blinkup) a device which you plan to use for your application debugging.

1. List all your unassigned devices and find the needed one.  
  `impt device list --unassigned`  
```
> impt device list -u
Device list (2 items):
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  device_online: true
Device:
  id:            23522f6938a609ee
  name:          myDevice2
  mac_address:   0c:2a:69:03:ea:f0
  device_online: true
IMPT COMMAND SUCCEEDS
```

1. Add the needed device to your project. You can specify the device by its Id, Name, MAC, IMP Agent Id.  
  `impt device assign --device <device_id>`  
```
> impt device assign -d myDevice1
Device "myDevice1" is assigned successfully to Device Group "c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5".
IMPT COMMAND SUCCEEDS
```

1. Create a new build, run it and start the logs of your application.  
  `impt build run --log`  
```
> impt build run -l
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is created successfully.
Restart request for Devices assigned to Device Group "c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5" is successful:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is run successfully.
Log stream for Device(s) 234776801163a9ee is opened.
IMPT COMMAND SUCCEEDS

Press <Ctrl-C> to exit.
[234776801163a9ee] 2018-01-22T18:11:33.975Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:11:33.976Z [agent.log] { "measureTime": "1516644693", "data": 1 }
[234776801163a9ee] 2018-01-22T18:11:43.971Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:11:43.971Z [agent.log] { "measureTime": "1516644703", "data": 2 }
[234776801163a9ee] 2018-01-22T18:11:54.329Z [agent.log] Data published successfully:
[234776801163a9ee] 2018-01-22T18:11:54.329Z [agent.log] { "measureTime": "1516644713", "data": 3 }
```
  
1. Review how your application is working.

1. Stop the logging by pressing *\<Ctrl-C>*.  

1. If needed, update your code, create and run a new build by the same command as above.

1. When you satisfied by your code, mark the latest build by a tag, for example, "MyRC1" and set *flagged* attribute to `true` (it saves the build from unintentional deletion).  
  `impt build update --descr "My Release Candidate 1" --tag MyRC1 --flagged`  
```
> impt build update -s "My Release Candidate 1" -t MyRC1 -f
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is updated successfully.
IMPT COMMAND SUCCEEDS
```
  
### Develop Factory Firmware

Note, you need to have appropriate permissions to operate with the impCentral API entities related to pre-factory and pre-production processes.

1. Create a new directory called, for example, "factory".

1. Go to the new directory.

1. Create a project for a [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) which is linked to the existent Product "MyProduct": a new Device Group "MyPreFactoryDG" in that Product, a new Device Group "MyPreProductionDG" that will be a production target, empty files "factory.device.nut" and "factory.agent.nut", [Project File](./CommandsManual.md#project-file).   
  `impt project create --pre-factory --product MyProduct --name MyPreFactoryDG --descr "Factory Firmware" --target MyPreProductionDG --create-target --device-file factory.device.nut --agent-file factory.agent.nut --create-files`  
```
> impt project create -f -p MyProduct -n MyPreFactoryDG -s "Factory Firmware" -t MyPreProductionDG -j -x factory.device.nut -y factory.agent.nut -c
Device Group "MyPreProductionDG" is created successfully.
Device Group "MyPreFactoryDG" is created successfully.
Device source file "factory.device.nut" is created successfully.
Agent source file "factory.agent.nut" is created successfully.
Project is created successfully.
Project info:
Device file:  factory.device.nut
Agent file:   factory.agent.nut
Device Group:
  id:                71c3be05-a7d2-a326-8906-8af3b205bd13
  type:              pre-factory
  name:              MyPreFactoryDG
  description:       Factory Firmware
  region:
  created_at:        2018-01-22T18:17:19.537Z
  updated_at:        2018-01-22T18:17:19.537Z
  Product:
    id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
    name: MyProduct
  Production Target:
    id:   53ca29f4-937d-e684-729b-7e6b6a192c19
    type: pre-production
    name: MyPreProductionDG
IMPT COMMAND SUCCEEDS
```

1. Copy your IMP application's build tagged as "MyRC1" to "MyPreProductionDG" Device Group. It will be a production code for devices blessed by your factory firmware. Attributes of the build are not copied.  
  `impt build copy --build MyRC1 --dg MyPreProductionDG`  
```
> impt build copy -b MyRC1 -g MyPreProductionDG
Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8" is created successfully.
Deployment "MyRC1" is copied successfully to Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8".
IMPT COMMAND SUCCEEDS
```

1. Write the code of your [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) in "factory.device.nut" and "factory.agent.nut" files.

1. [BlinkUp](https://developer.electricimp.com/blinkup) a device which you plan to use as a pre-factory fixture device.

1. List all your unassigned devices and find the needed one.  
  `impt device list --unassigned`  
```
> impt device list -u
Device list (2 items):
Device:
  id:            23522f6938a609ee
  name:          myDevice2
  mac_address:   0c:2a:69:03:ea:f0
  device_online: true
Device:
  id:            5000d8c46a56cfca
  name:          fieldbus
  mac_address:   d8:c4:6a:56:cf:ca
  device_online: true
IMPT COMMAND SUCCEEDS
```

1. Add the needed device to your project. You can specify the device by its Id, Name, MAC, IMP Agent Id.  
  `impt device assign --device <device_id>`  
```
> impt device assign -d 5000d8c46a56cfca
Device "5000d8c46a56cfca" is assigned successfully to Device Group "71c3be05-a7d2-a326-8906-8af3b205bd13".
IMPT COMMAND SUCCEEDS
```

1. Create a new build, run it and start the logs of your factory firmware part that runs on the pre-factory fixture device.  
  `impt build run --log`  
```
> impt build run -l
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is created successfully.
Restart request for Devices assigned to Device Group "71c3be05-a7d2-a326-8906-8af3b205bd13" is successful:
Device:
  id:            5000d8c46a56cfca
  name:          fieldbus
  mac_address:   d8:c4:6a:56:cf:ca
  agent_id:      mRu9cePbSCJY
  device_online: true
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is run successfully.
Log stream for Device(s) 5000d8c46a56cfca is opened.
IMPT COMMAND SUCCEEDS

Press <Ctrl-C> to exit.
```
  
1. BlinkUp, test and bless your pre-production devices by your pre-factory fixture device.

1. Stop the logging by pressing *\<Ctrl-C>*.  

1. If needed, update your factory firmware code, create and run a new build by the same command as above.

1. When you satisfied by your factory firmware code, mark the latest build by a tag, for example, "MyFactoryRC1" and set *flagged* attribute to `true` (it saves the build from unintentional deletion).  
  `impt build update --descr "My Factory Firmware Release Candidate 1" --tag MyFactoryRC1 --flagged`  
```
> impt build update -s "My Factory Firmware Release Candidate 1" -t MyFactoryRC1 -f
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is updated successfully.
IMPT COMMAND SUCCEEDS
```
  
### Cleanup

#### Go To Production

If your development is planned for production you may want/need to keep the impCentral API entities your created, especially the final builds, but still do some minimal cleanup after your development activities.

1. Go to the "factory" directory.  

1. Delete all unnecessary builds of your factory firmware code, *flagged* builds will not be deleted.  
  `impt dg builds --remove`  
```
> impt dg builds -r
The following entities will be deleted:
Deployment:
  id:  a704f4c4-c14b-16ac-ad62-15ef304e37c1
  sha: 610c70b664914e84c539fad3c715e63e93bc2323c4c4b51ae39dc9e0513e7099
Deployment:
  id:  280618fc-9cf1-898f-dfec-a574f60c31df
  sha: 610c70b664914e84c539fad3c715e63e93bc2323c4c4b51ae39dc9e0513e7099

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Deployment "280618fc-9cf1-898f-dfec-a574f60c31df" is deleted successfully.
Deployment "a704f4c4-c14b-16ac-ad62-15ef304e37c1" is deleted successfully.
Deployment list (2 items):
Deployment:
  id:           4a7339e4-1f7c-3caa-2ce5-15c367df9a3f
  sha:          f6f710ce359d1e1bee10b17f62184a8f2a9884d17dd44292b0e9dc640c52daf6
  tags:         MyFactoryRC1
  flagged:      true
  Device Group:
    id:   71c3be05-a7d2-a326-8906-8af3b205bd13
    type: pre-factory
    name: MyPreFactoryDG
Deployment:
  id:           5dbfc968-5c94-fc4c-dd37-424f779b7e40
  sha:          a6d7bd78d62d74b6da74f538dc6c56f8d0f2fcfb7f80383bb6fe4640a1bb7a11
  Device Group:
    id:   71c3be05-a7d2-a326-8906-8af3b205bd13
    type: pre-factory
    name: MyPreFactoryDG
IMPT COMMAND SUCCEEDS
```

1. Unassign your pre-factory fixture device in order to reuse it in your other projects.  
  `impt dg unassign`  
```
> impt dg unassign
The following Devices are unassigned successfully from Device Group "71c3be05-a7d2-a326-8906-8af3b205bd13":
Device:
  id:            5000d8c46a56cfca
  name:          fieldbus
  mac_address:   d8:c4:6a:56:cf:ca
  agent_id:      mRu9cePbSCJY
  device_online: true
IMPT COMMAND SUCCEEDS
```

1. Unassign your pre-production devices in order to reuse them in your other projects.  
  `impt dg unassign --dg MyPreProductionDG`  
```
> impt dg unassign -g MyPreProductionDG
The following Devices are unassigned successfully from Device Group "MyPreProductionDG":
Device:
  id:          235d9e7838a609ee
  mac_address: 0c:2a:69:04:ff:85
  agent_id:    fo4Aq4po7wZa
IMPT COMMAND SUCCEEDS
```

1. If you want, delete your factory firmware project and the source files in this directory. The impCentral API entities will not be deleted, the source files you may keep in your version control / software configuration management tool.  
  `impt project delete --files`  
```
> impt project delete -f
The following files will be deleted:
Device/agent source files: factory.device.nut, factory.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device/agent source files "factory.device.nut", "factory.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

1. Go to the "dev" directory.

1. Delete all unnecessary builds of your IMP application code, *flagged* builds will not be deleted.  
  `impt dg builds --remove`  
```
> impt dg builds -r
The following entities will be deleted:
Deployment:
  id:  4c8a43e9-d3c4-3019-1219-456e30d972ac
  sha: a25ad53b9016dc301265d40685a3b52e756a36a51d5980f7ed2feb218876781d
Deployment:
  id:  3612cbab-8d69-4b2b-65da-6a65e40ebf4e
  sha: 0f379c6dd02bc29b3247bfad8a75bb20726769761c833210e747c7f782135d42
Deployment:
  id:  00e7645f-138f-f0d0-45bd-b7e9b79f0d3f
  sha: 1a65471e9ede213d5548677229ef594598451db83a5c2bccfd434da498e8e6f2
Deployment:
  id:  495c7420-e004-b29e-bb67-a4c1bea66f5b
  sha: 1a65471e9ede213d5548677229ef594598451db83a5c2bccfd434da498e8e6f2

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Deployment "00e7645f-138f-f0d0-45bd-b7e9b79f0d3f" is deleted successfully.
Deployment "4c8a43e9-d3c4-3019-1219-456e30d972ac" is deleted successfully.
Deployment "3612cbab-8d69-4b2b-65da-6a65e40ebf4e" is deleted successfully.
Deployment "495c7420-e004-b29e-bb67-a4c1bea66f5b" is deleted successfully.
Deployment list (4 items):
Deployment:
  id:           e0059ee6-2483-4ab1-50eb-e693e62155b7
  sha:          f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  tags:         MyRC1
  flagged:      true
  Device Group:
    id:   c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
    type: development
    name: MyDevDG
Deployment:
  id:           429c3a4c-947b-3d84-77f8-fa15cf3038b5
  sha:          f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  Device Group:
    id:   c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
    type: development
    name: MyDevDG
IMPT COMMAND SUCCEEDS
```

1. Unassign your device which you used for the application testing.  
  `impt dg unassign`  
```
> impt dg unassign
The following Devices are unassigned successfully from Device Group "c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5":
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
IMPT COMMAND SUCCEEDS
```

1. Display and review the full structure of your Product.  
  `impt product info --full`  
```
> impt product info -u
Product:
  id:            da0800ab-ad5f-c54e-949e-ec986efb0bf1
  name:          MyProduct
  description:
  created_at:    2018-01-22T17:56:27.298Z
  updated_at:    2018-01-22T17:56:27.298Z
  Device Groups:
    Device Group:
      id:                       c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
      type:                     development
      name:                     MyDevDG
      Current Deployment:
        id:      e0059ee6-2483-4ab1-50eb-e693e62155b7
        sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
        tags:    MyRC1
        flagged: true
      Min supported Deployment:
        id:  429c3a4c-947b-3d84-77f8-fa15cf3038b5
        sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
    Device Group:
      id:                       71c3be05-a7d2-a326-8906-8af3b205bd13
      type:                     pre-factory
      name:                     MyPreFactoryDG
      Current Deployment:
        id:      4a7339e4-1f7c-3caa-2ce5-15c367df9a3f
        sha:     f6f710ce359d1e1bee10b17f62184a8f2a9884d17dd44292b0e9dc640c52daf6
        tags:    MyFactoryRC1
        flagged: true
      Min supported Deployment:
        id:  5dbfc968-5c94-fc4c-dd37-424f779b7e40
        sha: a6d7bd78d62d74b6da74f538dc6c56f8d0f2fcfb7f80383bb6fe4640a1bb7a11
      Production Target:
        id:   53ca29f4-937d-e684-729b-7e6b6a192c19
        type: pre-production
        name: MyPreProductionDG
    Device Group:
      id:                       53ca29f4-937d-e684-729b-7e6b6a192c19
      type:                     pre-production
      name:                     MyPreProductionDG
      Current Deployment:
        id:  a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8
        sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
      Min supported Deployment:
        id:  a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8
        sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
      Production Target for:
        Device Group:
          id:   71c3be05-a7d2-a326-8906-8af3b205bd13
          type: pre-factory
          name: MyPreFactoryDG
IMPT COMMAND SUCCEEDS
```

1. If you want, delete your IMP application project and the source files in this directory. The impCentral API entities will not be deleted, the source files you may keep in your version control / software configuration management tool.  
  `impt project delete --files`  
```
> impt project delete -f
The following files will be deleted:
Device/agent source files: myapp.device.nut, myapp.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device/agent source files "myapp.device.nut", "myapp.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

1. If you want, delete the "dev" and the "factory" directories.  

1. If you want, logout from impCentral API.  
  `impt auth logout`  
```
> impt auth logout
Global logout is successful.
IMPT COMMAND SUCCEEDS
```

The impt tool usage for factory and production processes is described in the [impt Production Guide](./ProductionGuide.md).

#### Total Cleanup

If your development was just to try, test or any other temporal purpose you may want to fully cleanup all your development activities, including all impCentral API entities you created.

1. Go to the "factory" directory.  

1. Delete your factory firmware project, the source files and all impCentral API entities. "MyPreFactoryDG" and "MyPreProductionDG" Device Groups and all their builds (including *flagged*) will be deleted, the devices will be unassigned from them. "MyProduct" Product will not be deleted as you still have another project (Device Group) related to it.  
  `impt project delete --all`  
```
> impt project delete -a
The following entities will be deleted:
Device Group:
  id:   53ca29f4-937d-e684-729b-7e6b6a192c19
  type: pre-production
  name: MyPreProductionDG
Device Group:
  id:   71c3be05-a7d2-a326-8906-8af3b205bd13
  type: pre-factory
  name: MyPreFactoryDG
Deployment:
  id:  a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8
  sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
Deployment:
  id:      4a7339e4-1f7c-3caa-2ce5-15c367df9a3f
  sha:     f6f710ce359d1e1bee10b17f62184a8f2a9884d17dd44292b0e9dc640c52daf6
  tags:    MyFactoryRC1
  flagged: true
Deployment:
  id:  5dbfc968-5c94-fc4c-dd37-424f779b7e40
  sha: a6d7bd78d62d74b6da74f538dc6c56f8d0f2fcfb7f80383bb6fe4640a1bb7a11

The following Devices will be unassigned from Device Groups:
Device:
  id:            5000d8c46a56cfca
  name:          fieldbus
  mac_address:   d8:c4:6a:56:cf:ca
  agent_id:      mRu9cePbSCJY
  device_online: true

The following Deployments are marked "flagged" to prevent deleting. They will be modified 
by setting "flagged" attribute to false:
Deployment:
  id:      4a7339e4-1f7c-3caa-2ce5-15c367df9a3f
  sha:     f6f710ce359d1e1bee10b17f62184a8f2a9884d17dd44292b0e9dc640c52daf6
  tags:    MyFactoryRC1
  flagged: true

The following files will be deleted:
Device/agent source files: factory.device.nut, factory.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "5000d8c46a56cfca" is unassigned successfully.
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is updated successfully.
Device Group "71c3be05-a7d2-a326-8906-8af3b205bd13" is deleted successfully.
Device Group "53ca29f4-937d-e684-729b-7e6b6a192c19" is deleted successfully.
Deployment "5dbfc968-5c94-fc4c-dd37-424f779b7e40" is deleted successfully.
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is deleted successfully.
Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8" is deleted successfully.
Device/agent source files "factory.device.nut", "factory.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

1. Go to the "dev" directory.

1. Delete your IMP application project, the source files and all impCentral API entities. "MyDevDG" Device Group and all its builds (including *flagged*) will be deleted, the devices will be unassigned from it. "MyProduct" Product will be deleted.  
  `impt project delete --all`  
```
> impt project delete -a
The following entities will be deleted:
Product:
  id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
  name: MyProduct
Device Group:
  id:   c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
  type: development
  name: MyDevDG
Deployment:
  id:      e0059ee6-2483-4ab1-50eb-e693e62155b7
  sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  tags:    MyRC1
  flagged: true
Deployment:
  id:  429c3a4c-947b-3d84-77f8-fa15cf3038b5
  sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3

The following Devices will be unassigned from Device Groups:
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true

The following Deployments are marked "flagged" to prevent deleting. They will be modified by setting "flagged" attribute to false:
Deployment:
  id:      e0059ee6-2483-4ab1-50eb-e693e62155b7
  sha:     f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
  tags:    MyRC1
  flagged: true

The following files will be deleted:
Device/agent source files: myapp.device.nut, myapp.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device "234776801163a9ee" is unassigned successfully.
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is updated successfully.
Device Group "c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5" is deleted successfully.
Product "da0800ab-ad5f-c54e-949e-ec986efb0bf1" is deleted successfully.
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is deleted successfully.
Deployment "429c3a4c-947b-3d84-77f8-fa15cf3038b5" is deleted successfully.
Device/agent source files "myapp.device.nut", "myapp.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

1. If you want, delete the "dev" and the "factory" directories.  

1. If you want, logout from impCentral API.  
  `impt auth logout`  
```
> impt auth logout
Global logout is successful.
IMPT COMMAND SUCCEEDS
```

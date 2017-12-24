# impt Development Guide

This additional guide is intended for developers who use the impt tool to develop IMP applications and/or [factory firmware](https://developer.electricimp.com/examples/factoryfirmware).

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

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

Project always relates to two files - with IMP device source code and IMP agent source code. It is assumed the files are located in the same directory with [Project File](./CommandsManual.md#project-file). At any time Project may be updated to link other file(s). Anyone or the both files may not exist in reality. The most of project-related operations still work in this case. But the both files are always required if you want to deploy a new build - a file may be empty but it should exist.

When you call impt commands from a directory with [Project File](./CommandsManual.md#project-file) all the related entities (Device Group, Product, Deployment, Devices, files) are assumed by default. I.e. you may not specify them explicitly in the corresponding commands. 

Note, the impt tool, as well as impCentral API, does not provide any source code version control or software configuration management functionality. That may be done by other appropriate tools. The impt Project just links the source files to impCentral API entities.

For Project management the impt tool includes a special group of commands - [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands).

## Development Operations

It is assumed that all commands are called from the directory where your Project is located.

### Project Creation

Project creation is a creation of [Project File](./CommandsManual.md#project-file) in a directory from where a project creation command is called. If the directory already contains [Project File](./CommandsManual.md#project-file), it is overwritten after confirmation from a user. I.e. you can quickly create a new Project at the place of the previous one. In some cases it may be convenient. But in a general case it is recommended to [explicitly delete](#project-deletion) the previous Project.

There are two ways to create Project:

#### Link Device Group

By [**impt project link**](./CommandsManual.md#project-link) command.

It creates Project which relates to already existent Device Group, just links it to the source files. The source files can be specified directly - using `--device-file <device_file>` and `--agent-file <agent_file>` options. Or the default names can be used. When `--create-files` option is specified and the file(s) does not exist, the command creates the empty file(s).

*Example*  
**TODO** screenshot - impt project link -g MyDG -c

#### Create New Device Group

By [**impt project create**](./CommandsManual.md#project-create) command.

It creates new Device Group and Project which relates to that Device Group. The Device Group should belong to a Product:
- if you already have/know the Product, specify it's Id or Name as a value of `--product <PRODUCT_IDENTIFIER>` option.
- if you want/need to create a new Product, specify Name of the new Product as a value of `--product <PRODUCT_IDENTIFIER>` option and specify `--create-product` option.

By default it is assumed the new Project is going to be used for IMP application development and the new Device Group is of the [type](./CommandsManual.md#device-group-type) *development*.

If you create Project for [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) development, specify `--pre-factory` option. In this case you need to additionally specify a production target Device Group which should be of the [type](./CommandsManual.md#device-group-type) *pre-production* and belong to the same Product:
- if you already have/know the production target Device Group, specify it's Id or Name as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option.
- if you want/need to create a new production target Device Group, specify Name of the new Device Group as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option and specify `--create-target` option.

Alternatively, you can pre-create the required impCentral API entities using other impt commands, before creation or linking a new Project. For example, use [**impt product create**](./CommandsManual.md#product-create) command to pre-create the Product, use [**impt dg create**](./CommandsManual.md#device-group-create) command to pre-create the production target Device Group and/or the project's Device Group itself.

*Example*  
**TODO** screenshot - impt project create - one or several examples?  

### Project Updating

At any time you can update your Project by [**impt project update**](./CommandsManual.md#project-update) command. The following can be updated:
- the project's Device Group Name and Description, the production target Device Group. The same can be done by [**impt dg update**](./CommandsManual.md#device-group-update) command as well.
- change the source files which are linked to the Project. You can specify new file name(s), rename the previous file(s), create empty file(s).

Note, you can update other impCentral API entities related to your Project by using other impt commands. For example, [**impt product update**](./CommandsManual.md#product-update) command to change Name and Description of the related Product.

*Example* - update Description of the project's Device Group, rename the linked device source file to "device1.nut"  
**TODO** screenshot - impt project update -s "New description of my DG" -x device1.nut -r  

### Device Manipulation

At any time you can easily add or remove devices to/from your Project. That means assigning/unassigning Devices to/from the project's Device Group. You just need to know an identifier of the required Device - either Device Id, or Device Name, or MAC address, or IMP Agent Id.
- use [**impt device assign --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-assign) command to add a device to your Project.
- use [**impt device unassign --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-unassign) command to remove a device from your Project.
- use [**impt dg unassign**](./CommandsManual.md#device-group-unassign) command to remove all devices from your Project (the project's Device Group).

If you do not remember an identifier of the required Device, you can use [**impt device list**](./CommandsManual.md#device-list) command to find it.

Usually, it is enough to have one device added to your Project for development/debugging purpose.

*Example*  
**TODO** screenshot - impt device assign -d <agent-id>  

*Example*  
**TODO** screenshot - impt dg unassign  

### Build Creation and Running

To create a new build (Deployment) without running it immediately use [**impt build deploy**](./CommandsManual.md#build-deploy) command. By default the Deployment will be created from the source files referenced by your Project. When you want to run the new Deployment:
- use [**impt device restart --device <DEVICE_IDENTIFIER>**](./CommandsManual.md#device-restart) command to run the new build on a concrete device.
- use [**impt dg restart**](./CommandsManual.md#device-group-restart) command to run the new build on all Devices of your Project (the project's Device Group).

Alternatively, you can use [**impt build run**](./CommandsManual.md#build-run) command. It behaves exactly like [**impt build deploy**](./CommandsManual.md#build-deploy) command followed by [**impt dg restart**](./CommandsManual.md#device-group-restart) command.

*Example* - create a new flagged Deployment with Description and tag  
**TODO** screenshot - impt build deploy -s "my new build" -t TAG1 --flagged  

*Example* - run the new Deployment  
**TODO** screenshot - impt dg restart  

### Logging

impCentral API provides two types of logs:

#### Historical Logs

To display historical logs for a device use [**impt log get**](./CommandsManual.md#log-get) command. You do not need to specify an identifier of the device if there is only one device added to your Project (assigned to the project's Device Group).

The log entries are displayed by pages. The page size may be specified in the command. By default, all pages are displayed one by one, starting from the most recent log entry and pausing after every page. To display the next page - press *\<Enter>*. To stop displaying - press *\<Ctrl-C>*. Alternatively, the command allows to specify a page number to display. In this case, only the specified page is displayed and the command finishes.

Note, a limited number of log entries are kept by impCentral API for a limited period of time.

*Example*  
**TODO** screenshot - impt log get --page-size 5 - display 2 pages and Ctrl-C  

#### Realtime Logs

### Pre-Factory Specifics

### Project Info

### Project Sharing

### Project Deletion

## Typical Usecase

1. Create a project for an IMP application

1. Develop and debug

1. Create a build for pre-factory testing

...
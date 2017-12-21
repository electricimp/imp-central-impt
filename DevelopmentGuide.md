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

Project always relates to two files - with IMP device source code and IMP agent source code. It is assumed the files are located in the same directory with [Project File](./CommandsManual.md#project-file). At anytime Project may be updated to link other file(s). Anyone or the both files may not exist in reality. The most of project-related operations still work in this case. But the both files are always required if you want to deploy a new build - a file may be empty but it should exist.

When you call impt commands from a directory with [Project File](./CommandsManual.md#project-file) all the related entities (Device Group, Product, Deployment, Devices, files) are assumed by default. I.e. you may not specify them explicitly in the corresponding commands. 

Note, the impt tool, as well as impCentral API, does not provide any source code version control or software configuration management functionality. That may be done by other appropriate tools. The impt Project just links the source files to impCentral API entities.

For Project management the impt tool includes a special group of commands - [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands).

### Project Creation

Project creation is a creation of [Project File](./CommandsManual.md#project-file) in a directory from where a project creation command is called. If the directory already contains [Project File](./CommandsManual.md#project-file), it is overwritten after confirmation from a user. I.e. you can quickly create a new Project in the place of the previous one. In some cases it may be convenient. But in a general case it is recommended to [explicitly delete](#project-deletion) the previous Project.

There are two ways to create Project:

#### Link Device Group

[**impt project link**](./CommandsManual.md#project-link) command.

It creates Project which relates to already existent Device Group, just links it to the source files. The source files can be specified directly - using `--device-file <device_file>` and `--agent-file <agent_file>` options. Or the default names can be used. When `--create-files` option is specified and the file(s) does not exist, the command creates the empty file(s).

**Example**  
**TODO** screenshot - impt project link -g MyDG -c

#### Create New Device Group

[**impt project create**](./CommandsManual.md#project-create) command.

It creates new Device Group and Project which relates to that Device Group. The Device Group should belong to a Product:
- if you already have/know the Product, specify it's Id or Name as a value of `--product <PRODUCT_IDENTIFIER>` option.
- if you want/need to create a new Product, specify Name of the new Product as a value of `--product <PRODUCT_IDENTIFIER>` option and specify `--create-product` option.

By default it is assumed the new Project is going to be used for IMP application development and the new Device Group is of [type](./CommandsManual.md#device-group-type) *development*.

If you create Project for [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) development, specify `--pre-factory` option. In this case you need to additionally specify a production target Device Group which should be of [type](./CommandsManual.md#device-group-type) *pre-production* and belong to the same Product:
- if you already have/know the production target Device Group, specify it's Id or Name as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option.
- if you want/need to create a new production target Device Group, specify Name of the new Device Group as a value of `--target <DEVICE_GROUP_IDENTIFIER>` option and specify `--create-target` option.

Alternatively, you can pre-create the required impCentral API entities using other impt commands, before creation or linking a new Project. For example, use [**impt product create**](./CommandsManual.md#product-create) command to pre-create the Product, use [**impt dg create**](./CommandsManual.md#device-group-create) command to pre-create the production target Device Group and/or the project's Device Group itself.

**Example**  
**TODO** screenshot - impt project create - one of several examples?

### Project Updating

### Project Info

### Project Sharing

### Project Deletion

## Typical Usecases

1. Create a project for an IMP application

1. Develop and debug

1. Create a build for pre-factory testing

...

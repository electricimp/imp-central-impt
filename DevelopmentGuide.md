# impt Development Guide #

This additional guide is intended for developers who use *impt* to develop Electric Imp application, [BlinkUp™ fixture](https://developer.electricimp.com/examples/factoryfirmware) and/or [device-under-test](https://developer.electricimp.com/examples/factoryfirmware) firmware.

Please read the main [Read Me file](./README.md) first as it covers all the basic *impt* usage and its common components.

The full *impt* commands specification is described in the [*impt* Commands Manual](./CommandsManual.md).

## Contents ##

- [Projects](#projects)
- [Development Tasks](#development-tasks)
    - [Creating Projects](#creating-projects)
    - [Updating Projects](#updating-projects)
    - [Device Manipulation](#device-manipulation)
    - [Creating And Running Builds](#creating-and-running-builds)
    - [Logging](#logging)
    - [Getting Project Information](#getting-project-information)
    - [Sharing Projects](#sharing-projects)
    - [Deleting Projects](#deleting-projects)
- [Typical Use-cases](#typical-use-cases)
    - [Develop Application Firmware](#develop-application-firmware)
    - [Develop Factory Device-Under-Test Firmware](#develop-factory-device-under-test-firmware)
    - [Develop Factory Fixture Firmware](#develop-factory-fixture-firmware)
    - [Cleaning Up](#cleaning-up)

## Projects ##

A Project is an *impt* entity intended to help developers manage their work. It:

- Simplifies the calling of many *impt* commands.
- Uploads device and agent source code files to a Device Group.
- Allows you to easily share and/or move your project between users and/or computers.

**Note** Using Projects is not mandatory; you can perform the same actions without using Projects.

A Project is encapsulated in one directory. A directory represents a Project if it contains a [Project file](./CommandsManual.md#project-files). There can be only one [Project file](./CommandsManual.md#project-files) in a directory. All Projects are independent. A sub-directory may contain a totally different Project.

Each Project references a single Device Group which is specified during Project creation and cannot be changed (you must re-create the Project instead). Only three [types](./CommandsManual.md#device-group-type) of Device Group are supported by a Project:

- *Development* &mdash; for application firmware.
- *Pre-factory* &mdash; for [BlinkUp™ fixture firmware](https://developer.electricimp.com/examples/factoryfirmware#fixture-firmware).
- *Pre-DUT* &mdash; for [device-under-test (DUT) firmware](https://developer.electricimp.com/examples/factoryfirmware#dut-firmware).

A Project implicitly references other impCentral API entities: for example, the Product to which the Project’s Device Group belongs, the latest code Deployment to the Device Group, and Devices assigned to the Device Group.

Each Project always references two files, one containing the device source code, the other containing the agent source code. It is assumed that the files are located in the same directory as the [Project file](./CommandsManual.md#project-files). At any time, the Project may be updated to reference other files. Any one or both files may not exist: for example, you may be working on device code but not agent code. Most Project-related operations can still be carried out in this case, but both device *and* agent files are always required if you want to deploy a new build. Either of these files may be empty but should exist.

When you call *impt* commands from a directory with a [Project file](./CommandsManual.md#project-files), all of the related entities (Device Group, Product, Deployment, Devices, files) are specified by default. You need not specify them explicitly in subsequent commands.

**Note** *impt*, like the impCentral API, does not provide any source code version control or software configuration management functionality. That may be done by other tools. The Project simply links the source files to impCentral API entities.

For Project management, *impt* includes [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands).

## Development Tasks ##

The following documentation assumes that all commands are called from the directory in which your Project is located.

### Creating Projects ###

Project creation centers on the creation of a [Project file](./CommandsManual.md#project-files) in the working directory where the project creation command is called. If the directory already contains a [Project file](./CommandsManual.md#project-files), it will be overwritten after confirmation from the user. However, we recommend that you [explicitly delete](#deleting-projects) the previous Project file first.

There are two ways to create a Project: [base it on an existing Device Group](#link-an-existing-device-group) or [create a new one from scratch](#create-a-new-device-group).

#### Link An Existing Device Group ####

Use the [`impt project link`](./CommandsManual.md#project-link) command. This creates a Project which references the existing Device Group; it links it to the local source files. The source files can be specified directly using the `--device-file <device_file>` and `--agent-file <agent_file>` options. Or the default names can be used. If a specified file does not exist, the command creates it as an empty file.

#### Example ####

```bash
> impt project link --dg MyDG
Device source file "device.nut" is created successfully.
Agent source file "agent.nut" is created successfully.
Project is linked successfully.
Project:
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

#### Create A New Device Group ####

Use the [`impt project create`](./CommandsManual.md#project-create) command. This creates a new Device Group and a Project which references it. The Device Group should belong to a Product:

- If you already have the Product, specify its ID or name as a value of the `--product <PRODUCT_IDENTIFIER>` option.
- If you want to create a new Product, specify its name as a value of the `--product <PRODUCT_IDENTIFIER>` option and add the `--create-product` option.

It is assumed that the new Project is going to be used for application firmware development, so by default the new Device Group will be a Development Device Group.

If you create the Project for [DUT firmware](https://developer.electricimp.com/examples/factoryfirmware) development, specify the `--pre-dut` option to create a Pre-DUT Device Group.

If you create the Project for [BlinkUp fixture firmware](https://developer.electricimp.com/examples/factoryfirmware) development, specify the `--pre-factory` option to create a Pre-Factory Device Group. In this case, you also need to specify two target Device Groups which should belong to the same Product:

1. A Pre-DUT Device Group which should be of the *pre-dut* [type](./CommandsManual.md#device-group-type).
    - If you have already created this Device Group, specify its ID or name as a value of the `--dut <DEVICE_GROUP_IDENTIFIER>` option.
    - If you need to create this Device Group, specify its name as a value of the `--dut <DEVICE_GROUP_IDENTIFIER>` option and add the `--create-dut` option.

2. A Pre-Production Device Group which should be of the *pre-production* [type](./CommandsManual.md#device-group-type).
    - If you have already created this Device Group, specify its ID or name as a value of the `--target <DEVICE_GROUP_IDENTIFIER>` option.
    - If you need to create this Device Group, specify its name as a value of the `--target <DEVICE_GROUP_IDENTIFIER>` option and add the `--create-target` option.

Alternatively, you can create the required impCentral API entities in advance using other *impt* commands. For example, use [`impt product create`](./CommandsManual.md#product-create) to create the Product, and [`impt dg create`](./CommandsManual.md#device-group-create) to create the two target Device Groups and/or the Project’s Device Group itself.

The source code files can be specified directly using the `--device-file <device_file>` and `--agent-file <agent_file>` options. Or the default names can be used. If a specified file does not exist, the command creates it as an empty file.

#### Example ####

```bash
> impt project create --product MyProduct --name MyDG
Device Group "MyDG" is created successfully.
Device source file "device.nut" is created successfully.
Agent source file "agent.nut" is created successfully.
Project is created successfully.
Project:
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

### Updating Projects ####

You can update your Project at any time with the [`impt project update`](./CommandsManual.md#project-update) command. The following can be updated:

- The Project Device Group’s name and description, the Pre-production Device Group target and/or Pre-DUT Device Group target. The same can be done with [`impt dg update`](./CommandsManual.md#device-group-update).
- Change the source files which are linked to the Project.

**Note** You can update other impCentral API entities related to your Project by using other *impt* commands. For example, use [`impt product update`](./CommandsManual.md#product-update) to change the name and/or description of the related Product.

#### Example ####

Update the description of the Project’s Device Group, and change the linked device source file to `device1.nut`:

```bash
> impt project update --descr "New description of my DG" --device-file device1.nut
Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9" is updated successfully.
Device source file "device1.nut" is created successfully.
Project is updated successfully.
Project:
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

### Device Manipulation ###

You can add devices to your Project, or remove them, at any time by assigning/unassigning them to/from the Project’s Device Group. You need to identify the device by its device ID, name, MAC address or agent ID.

- Use [`impt device assign --device <DEVICE_IDENTIFIER>`](./CommandsManual.md#device-assign) to add the specified device to your Project.
- Use [`impt dg reassign --from <DEVICE_GROUP_IDENTIFIER>`](./CommandsManual.md#device-group-reassign) to add all the devices from the specified (by ID or name) Device Group to your Project.
- Use [`impt device unassign --device <DEVICE_IDENTIFIER>`](./CommandsManual.md#device-unassign) to remove the specified device from your Project.
- Use [`impt dg unassign`](./CommandsManual.md#device-group-unassign) to remove all of the devices from your Project (ie. the Project’s Device Group).

You can use [`impt device list`](./CommandsManual.md#device-list) to find an identifier for the required device.

#### Examples ####

```bash
> impt device assign --device myDevice1
Device "myDevice1" is assigned successfully to Device Group "27f8ee81-59cd-a9ad-d2a4-e430e4e19ae9".
IMPT COMMAND SUCCEEDS
```

```bash
> impt dg reassign --from TestDG
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

### Creating And Running Builds ###

To create a new build (a Deployment) without running it immediately, use [`impt build deploy`](./CommandsManual.md#build-deploy). By default, the Deployment will be created from the source files referenced by your Project.

When you want to run the newly created Deployment:

- Use [`impt device restart --device <DEVICE_IDENTIFIER>`](./CommandsManual.md#device-restart) to run the new build on a specific device.
- Use [`impt dg restart`](./CommandsManual.md#device-group-restart) to run the new build on all of the Project’s devices.

Alternatively, you can use [`impt build run`](./CommandsManual.md#build-run). This behaves exactly like the [`impt build deploy`](./CommandsManual.md#build-deploy) command followed by [`impt dg restart`](./CommandsManual.md#device-group-restart).

#### Example 1: Create A New Flagged Deployment With Description And Tag ####

```bash
> impt build deploy --descr "my new build" --tag TAG1 --flagged
Deployment "b3cd81d0-0be3-b7a3-f15c-df2ded28a154" is created successfully.
Deployment:
  id:      b3cd81d0-0be3-b7a3-f15c-df2ded28a154
  sha:     4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:    TAG1
  flagged: true
IMPT COMMAND SUCCEEDS
```

#### Example 2: Run The New Deployment ####

```bash
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

### Logging ###

The impCentral API provides two types of logs: [historical](#historical-logs) and [real-time streams](#real-time-logs).

#### Historical Logs ####

To display historical logs for a device, use [`impt log get`](./CommandsManual.md#log-get). You do not need to specify a device identifier if there is only one device in your Project (ie. assigned to the Project’s Device Group).

The log entries are displayed in pages. The page size may be specified in the command. By default, all pages are displayed one by one, starting from the most recent log entry and pausing after every page. To display the next page, press *Enter*. To stop displaying, press *Ctrl-C*. Alternatively, the command allows you to specify a page number to display. In this case, only the specified page is displayed and the command finishes.

**Note** A limited number of log entries are kept by impCentral API for a limited period of time.

#### Example ####

```bash
> impt log get --page-size 5
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

#### Real-time Logs ####

The impCentral API can stream log entries from devices in real time.

Devices may be added to any one of a limited number of log streams available per account. There is also a limit on the number of devices per stream. The both limits are controlled by the impCentral API, not by *impt*.

*impt* provides several commands which start displaying real-time logs:

- The most universal command is [`impt log stream`](./CommandsManual.md#log-stream). You can specify several devices and/or Device Groups, and all of the devices are added to the new log stream, which is then started. If you do not specify any devices or Device Groups, all devices assigned to your Project’s Device Group are added to the log stream for you.
- The command [`impt build run`](./CommandsManual.md#build-run) with the option `--log` adds all the devices of the Device Group, for which the new Deployment is created, to a new log stream, which is then started.
- The command [`impt dg restart`](./CommandsManual.md#device-group-restart) with the option `--log` adds all the devices of the rebooted Device Group to a new log stream, which is then started.
- The command [`impt device restart --device <DEVICE_IDENTIFIER>`](./CommandsManual.md#device-restart) with the option `--log` adds the specified device to a new log stream, which is then started.

If the total number of devices to be added to a log stream exceeds the per-stream limit, not all of them will be added. Check the command’s output to see which devices were added and which were not.

While the logs are being streamed, no other command can be called. To stop displaying the logs, press *Ctrl-C*.

The log stream may be closed by the impCentral API: for example, when a new log stream is requested by the same account and that exceeds the per-account limit of opened streams.

If the log stream is stopped by an error (eg. due to a disconnection), *impt* tries to automatically reconnect and re-establish the stream. Even if the stream is restored, some log entries may have been lost and will not be displayed.

#### Example: Start Logging For A Device From The Project’s Device Group ####

```bash
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

### Getting Project Information ###

You can get the status of your Project configuration &mdash; the referenced Device Group, its Product, the linked source files, etc. &mdash; with [`impt project info`](./CommandsManual.md#project-info). The option `--full` provides you even more details: for example, information about devices added to your Project, the authentication status of the Project directory (as per [`impt auth info`](./CommandsManual.md#auth-info)).

Use [`impt product info`](./CommandsManual.md#product-info) with the option `--full` to review the full structure of the Product related by your Project.

#### Example ####

```
> impt project info --full
Project:
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
Auth:
  Auth type:                 Global Auth file
  impCentral API endpoint:   https://api.electricimp.com/v5
  Access token auto refresh: true
  Login method:              User/Password
  Username:                  username
  Email:                     user@email.com
  Account id:                c1d61eef-d544-4d09-c8dc-d43e6742cae3
IMPT COMMAND SUCCEEDS
```

### Sharing Projects ###

Your Project can be easily shared, copied or moved: just copy the directory containing the [Project file](./CommandsManual.md#project-files) and the linked source files, and continue using *impt* from the directory at its new location.

**Note** The Project directory may also include a [local auth file](./CommandsManual.md#local-auth-file), which you may not wish to share. If you *do* want to share or copy the authentication information along with your Project but the directory does not include a [local auth file](./CommandsManual.md#local-auth-file), call [`impt auth login`](./CommandsManual.md#auth-login) with the option `--local` and with the credentials and endpoint you would like to share. A [local auth file](./CommandsManual.md#local-auth-file) will be created and you will be able to copy it alongside the other Project files.

### Deleting Projects ###

There are several levels of Project deletion:

- The command [`impt project delete`](./CommandsManual.md#project-delete) without additional options deletes the [Project file](./CommandsManual.md#project-files) only, ie. it simply removes the link between the Device Group and the source files. The same effect occurs when you [create a new Project](#creating-projects) in the same directory to overwrite the previous [Project file](./CommandsManual.md#project-files).
- The command [`impt project delete`](./CommandsManual.md#project-delete) with the option `--files` will also delete the linked source files. This is equivalent to manually deleting the Project directory.
- The command [`impt project delete`](./CommandsManual.md#project-delete) with the option `--entities` will also delete the related impCentral API entities. See [the command’s specification](./CommandsManual.md#project-delete) for more details. Use this option when, for example, you want to clean up all of the entities after working on a temporary test project.

**Note** The command [`impt project delete`](./CommandsManual.md#project-delete) never deletes the [local auth file](./CommandsManual.md#local-auth-file), if it exists in the Project directory. Use [`impt auth logout --local`](./CommandsManual.md#auth-login) to delete the [local auth file](./CommandsManual.md#local-auth-file), or remove it manually.

#### Example: Delete Everything ####

```bash
> impt project delete --all
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

The following Deployments are marked "flagged" to prevent deleting. They will be modified
by setting "flagged" attribute to false:
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

## Typical Use-cases ##

### Develop Application Firmware ###

1. Log in to the impCentral API by creating the [global auth file](./CommandsManual.md#global-auth-file))

```bash
> impt auth login --user username --pwd password
Global login is successful.
IMPT COMMAND SUCCEEDS
```

2. Create a new directory called, for example, `dev`.

```bash
> mkdir dev
```

3. Go to the new directory.

```bash
> cd dev
```

4. Create a Project based on a new Product “MyProduct”, a new Device Group “MyDevDG”, empty files `myapp.device.nut` and `myapp.agent.nut`, and a [Project file](./CommandsManual.md#project-files).

```bash
> impt project create --product MyProduct --create-product --name MyDevDG
    --descr "imp Application Firmware" --device-file myapp.device.nut --agent-file myapp.agent.nut
Product "MyProduct" is created successfully.
Device Group "MyDevDG" is created successfully.
Device source file "myapp.device.nut" is created successfully.
Agent source file "myapp.agent.nut" is created successfully.
Project is created successfully.
Project:
  Device file:  myapp.device.nut
  Agent file:   myapp.agent.nut
  Device Group:
    id:          c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5
    type:        development
    name:        MyDevDG
    description: imp Application Firmware
    region:
    created_at:  2018-01-22T17:56:27.973Z
    updated_at:  2018-01-22T17:56:27.973Z
    Product:
      id:   da0800ab-ad5f-c54e-949e-ec986efb0bf1
      name: MyProduct
IMPT COMMAND SUCCEEDS
```

5. Add your Squirrel code to the two source files.

6. Add a development device to your Electric Imp account using the Electric Imp mobile app.

7. List your unassigned devices to find the new device.

```bash
> impt device list --unassigned
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

8. Add the device to your Project. You can specify the device by its ID, name, MAC or agent ID.

```bash
> impt device assign --device myDevice1
Device "myDevice1" is assigned successfully to Device Group "c675ad8a-9d88-1d0f-e017-4a8c71bb0fd5".
IMPT COMMAND SUCCEEDS
```

9. Create a new build, run it and start logging.

```bash
> impt build run --log
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

10. Review how your application is working.

11. Stop the logging by pressing *Ctrl-C*.

12. If needed, update your code, create and run a new build by using the command listed in Step 9.

13. When you are satisfied with your code, mark the latest build by a tag &mdash; for example, "MyRC1" &mdash; and set the *flagged* attribute to `true` (this protects it from accidental deletion).

```bash
> impt build update --descr "My Release Candidate 1" --tag MyRC1 --flagged
Deployment "e0059ee6-2483-4ab1-50eb-e693e62155b7" is updated successfully.
IMPT COMMAND SUCCEEDS
```

### Develop Factory Device-Under-Test Firmware ###

You develop the factory firmware which will be run on devices under test (DUTs) on your assembly line (ie. DUT firmware) in the same way that you [develop your application firmware](#develop-application-firmware), but the Project will be based on a Pre-DUT Device Group rather than a Development Device Group. Having completed development of your DUT firmware, you can tag it and set its *flagged* attribute to `true` to protect it from accidental deletion, as described in step 13 of [‘Develop Application Firmware’, above](#develop-application-firmware).

### Develop Factory Fixture Firmware ###

You need to have appropriate permission to make use of the impCentral API entities related to pre-production (ie. factory test) processes.

The following discussion assumes:

- You are making use of the Product created in [the use-case above](#develop-application-firmware).
- You already have the [device-under-test (DUT) firmware](#develop-factory-device-under-test-firmware) which will run on DUTs after factory BlinkUp.
- You already have the [application firmware](#develop-application-firmware) which will run on Production Devices after blessing.

1. Create a new directory called, for example, `factory`.

2. Go to the new directory.

3. Create a Project for [fixture firmware](https://developer.electricimp.com/examples/factoryfirmware#fixture-firmware) which is linked to the existing Product "MyProduct"; create new Device Groups "MyPreFactoryDG", "MyPreDUTDG" and "MyPreProductionDG" in that Product, and empty files `factory.device.nut` and `factory.agent.nut`, and a [Project file](./CommandsManual.md#project-files).

```bash
> impt project create --pre-factory --product MyProduct --name MyPreFactoryDG
    --descr "Factory Firmware" --dut MyPreDUTDG --create-dut
    --target MyPreProductionDG --create-target
    --device-file factory.device.nut --agent-file factory.agent.nut
Device Group "MyPreProductionDG" is created successfully.
Device Group "MyPreDUTDG" is created successfully.
Device Group "MyPreFactoryDG" is created successfully.
Device source file "factory.device.nut" is created successfully.
Agent source file "factory.agent.nut" is created successfully.
Project is created successfully.
Project:
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
    DUT Target:
      id:   10c6179c-8608-1af2-7aee-5d1dc5539cda
      type: pre-dut
      name: MyPreDUTDG
IMPT COMMAND SUCCEEDS
```

4. Copy your DUT firmware's build tagged as “MyTestsRC1” to the “MyPreDUTDG” Device Group. “MyTestsRC1” contains the test-and-bless code for devices under test during the factory process. Build attributes are not copied.

```bash
> impt build copy --build MyTestsRC1 --dg MyPreDUTDG
Deployment "26036a34-9751-705b-4f91-3f50c2a9ac47" is created successfully.
Deployment "MyTestsRC1" is copied successfully to Deployment "26036a34-9751-705b-4f91-3f50c2a9ac47".
IMPT COMMAND SUCCEEDS
```

5. Copy your application firmware’s build tagged as “MyRC1” to the “MyPreProductionDG” Device Group. “MyRC1” contains the code for devices blessed during the factory process. Build attributes are not copied.

```bash
> impt build copy --build MyRC1 --dg MyPreProductionDG
Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8" is created successfully.
Deployment "MyRC1" is copied successfully to Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8".
IMPT COMMAND SUCCEEDS
```

6. Write your [fixture firmware](https://developer.electricimp.com/examples/factoryfirmware#fixture-firmware) using the Project’s source code files.

7. Add a BlinkUp fixture to your Electric Imp account as if it were a development device.

8. List all of your unassigned devices and find the test fixture.

```bash
> impt device list --unassigned
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

9. Add the fixture to your project. You can specify it by its ID, Name, MAC or agent ID.

```bash
> impt device assign --device 5000d8c46a56cfca
Device "5000d8c46a56cfca" is assigned successfully to Device Group "71c3be05-a7d2-a326-8906-8af3b205bd13".
IMPT COMMAND SUCCEEDS
```

10. Create a new fixture firmware build, run it and start logging.

```bash
> impt build run --log
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

11. Use the fixture to configure some DUTs. They will connect, then download and run their assigned DUT firmware which will test and bless them.

12. Stop the logging by pressing *Ctrl-C*.

13. If needed, update your fixture firmware, and create and run a new build by using the command listed in Step 10.

14. When you are satisfied with your fixture firmware, mark the latest build by a tag, eg. “MyFactoryRC1”, and set its *flagged* attribute to `true` (this protects it from accidental deletion).

```bash
> impt build update --descr "My Factory Firmware Release Candidate 1" --tag MyFactoryRC1 --flagged
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is updated successfully.
IMPT COMMAND SUCCEEDS
```

### Cleaning Up ###

#### Go To Production ####

If you are developing production firmware, whether application, factory fixture, DUT or all of three of these, you may want to keep the impCentral API entities you created, especially the final builds, but still do some minimal clean-up after your development activities are complete.

1. Go to the `factory` directory.

2. Delete all unnecessary builds of your fixture firmware code (*flagged* builds will not be deleted).

```bash
> impt dg builds --remove
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

3. Unassign your BlinkUp fixture in order to re-use it in other Projects.

```bash
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

4. Unassign your blessed DUTs in order to reuse them in other Projects.

```bash
> impt dg unassign --dg MyPreProductionDG
The following Devices are unassigned successfully from Device Group "MyPreProductionDG":
Device:
  id:          235d9e7838a609ee
  mac_address: 0c:2a:69:04:ff:85
  agent_id:    fo4Aq4po7wZa
IMPT COMMAND SUCCEEDS
```

5. If you want, delete your fixture firmware project and the source files in this directory. The impCentral API entities will not be deleted; you may keep the source files in your version control or software configuration management tool.

```bash
> impt project delete --files
The following files will be deleted:
Device/agent source files: factory.device.nut, factory.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device/agent source files "factory.device.nut", "factory.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

6. Go to the `dev` directory.

7. Delete all unnecessary builds of your application firmware (*flagged* builds will not be deleted).

```bash
> impt dg builds --remove
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
Deployment list (2 items):
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

8. Unassign the development device which you used for application testing.

```bash
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

9. Display and review the full structure of your Product.

```bash
> impt product info --full
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
      id:                 10c6179c-8608-1af2-7aee-5d1dc5539cda
      type:               pre-dut
      name:               MyPreDUTDG
      Current Deployment:
        id:  26036a34-9751-705b-4f91-3f50c2a9ac47
        sha: 5c832c6b984ea536dfa5a8f56707809a8cfac089df49196bd742fda158501b27
      Min supported Deployment:
        id:  26036a34-9751-705b-4f91-3f50c2a9ac47
        sha: 5c832c6b984ea536dfa5a8f56707809a8cfac089df49196bd742fda158501b27
      DUT Target for:
        Device Group:
          id:   71c3be05-a7d2-a326-8906-8af3b205bd13
          type: pre-factory
          name: MyPreFactoryDG
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
      DUT Target:
        id:   10c6179c-8608-1af2-7aee-5d1dc5539cda
        type: pre-dut
        name: MyPreDUTDG
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

10. If you want, delete your application project and the source files in this directory. The impCentral API entities will not be deleted; you may keep the source files in your version control or software configuration management tool.

```bash
> impt project delete --files
The following files will be deleted:
Device/agent source files: myapp.device.nut, myapp.agent.nut

Project File in the current directory will be deleted.
Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Device/agent source files "myapp.device.nut", "myapp.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

11. If you wish, delete the `dev` and `factory` directories.

12. If you wish, log out from the impCentral API.

```bash
> impt auth logout
Global logout is successful.
IMPT COMMAND SUCCEEDS
```

**Note** If you developed the DUT firmware as a project, you may clean it up in the same way that you cleaned your application project (see step 10, above).

Using *impt* for factory and production processes is described more fully in the [*impt* Production Guide](./ProductionGuide.md).

#### Full Clean-up ####

If your development work was temporary, you may want to remove all of your development activities, including all of the impCentral API entities you created.

1. Go to the `factory` directory.

2. Delete your fixture firmware project, the source files and all impCentral API entities. The “MyPreFactoryDG” and “MyPreProductionDG” Device Groups and all their builds (including *flagged* ones) will be deleted, and the devices will be unassigned from them. The “MyProduct” Product will not be deleted as you still have another Project (ie. a Device Group) related to it.

```bash
> impt project delete --all
The following entities will be deleted:
Device Group:
  id:   53ca29f4-937d-e684-729b-7e6b6a192c19
  type: pre-production
  name: MyPreProductionDG
Device Group:
  id:   10c6179c-8608-1af2-7aee-5d1dc5539cda
  type: pre-dut
  name: MyPreDUTDG
Device Group:
  id:   71c3be05-a7d2-a326-8906-8af3b205bd13
  type: pre-factory
  name: MyPreFactoryDG
Deployment:
  id:  a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8
  sha: f4756c7578aa69910a8857d8ec08ff15bc2d7e1a8fc8007caf98e3ea9fca07a3
Deployment:
  id:  26036a34-9751-705b-4f91-3f50c2a9ac47
  sha: 5c832c6b984ea536dfa5a8f56707809a8cfac089df49196bd742fda158501b27
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
Device Group "10c6179c-8608-1af2-7aee-5d1dc5539cda" is deleted successfully.
Deployment "5dbfc968-5c94-fc4c-dd37-424f779b7e40" is deleted successfully.
Deployment "4a7339e4-1f7c-3caa-2ce5-15c367df9a3f" is deleted successfully.
Deployment "26036a34-9751-705b-4f91-3f50c2a9ac47" is deleted successfully.
Deployment "a0e8e599-c6c5-62c0-2a88-a8d4ac3e07d8" is deleted successfully.
Device/agent source files "factory.device.nut", "factory.agent.nut" are deleted successfully.
Project is deleted successfully.
IMPT COMMAND SUCCEEDS
```

3. Go to the `dev` directory.

4. Delete your application firmware project, the source files and all impCentral API entities. The “MyDevDG” Device Group and all its builds (including *flagged* ones) will be deleted, and its devices will be unassigned from it. The “MyProduct” Product will be deleted.

```bash
> impt project delete --all
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

The following Deployments are marked "flagged" to prevent deleting. They will be modified
by setting "flagged" attribute to false:
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

5. If you wish, delete the `dev` and `factory` directories.

6. If you wish, log out from impCentral API.

```bash
> impt auth logout
Global logout is successful.
IMPT COMMAND SUCCEEDS
```

**Note** If you developed the DUT firmware as a project, you may clean it up in the same way that you cleaned your application project (see step 4, above).

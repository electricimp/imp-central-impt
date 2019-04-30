# impt Production Guide #

This additional guide is intended for those customers who use *impt* with [production processes](https://developer.electricimp.com/manufacturing/factoryprocess). You may use scripts on top of *impt* commands to automate some of the operations.

Please read the main [Read Me file](./README.md) first as it covers all the basic *impt* usage and its common components.

The full *impt* tool command specification is described in the [Commands Manual](./CommandsManual.md).

**Note** You need to have appropriate permission to make use of [impCentral™ API](https://apidoc.electricimp.com/) entities and endpoints related to the production process.

## Contents ##

- [Product Creation](#product-creation)
- [Device Group Creation](#device-group-creation)
    - [Production Testing Device Groups](#production-testing-device-groups)
    - [Production Device Groups](#production-device-groups)
- [Devices](#devices)
    - [BlinkUp Fixtures](#blinkup-fixtures)
    - [Devices Under Test (DUTs)](#duts)
    - [Production Devices](#production-devices)
        - [Unblessing Production Devices](#unblessing-production-devices)
    - [Device Logging](#device-logging)
- [Monitoring Production With Webhooks](#monitoring-production-with-webhooks)
- [Deployments](#deployments)
    - [New Application Versions](#new-application-versions)
- [Cleaning Up](#cleaning-up)

## Product Creation ##

Typically, you have just one Product per actual product. A single Product may include all of the software components needed for development, testing, factory operation, device end-user operation, and support of all the different versions of your product.

You can create a Product with [`impt product create`](./CommandsManual.md#product-create):

```bash
impt product create --name MyProduct --descr "My product"
```

## Device Group Creation ##

A Device Group encapsulates a particular software component of your product &mdash; application firmware, BlinkUp™ fixture firmware or device-under-test (DUT) firmware &mdash; and holds the devices which will run that code. Different Device Groups may be deployed with different versions of your software components: a version which is currently under development, a version which is currently under testing, different versions in production, etc. When a new software build (a Deployment) is created, it is assigned to one and only one Device Group.

Device Groups may be of different [types](./CommandsManual.md#device-group-type):

- *Development*, which is used to create and test application firmware during the [development process](./DevelopmentGuide.md).
- *Pre-factory*, *Pre-production* and *Pre-dut* Device Groups, which are used to create and verify the factory process during [development](./DevelopmentGuide.md).
- *Factory*, *Production* and *DUT* Device Groups, which are used during the production process.

For an overview of how the different device groups are using during manufacturing and production see this [overview](https://developer.electricimp.com/manufacturing/factoryprocessinanutshell).

### Production Testing Device Groups ###

Pre-factory, Pre-production and Pre-dut Device Groups are used to develop and test your factory firmware: the code that runs on your BlinkUp fixtures and the separate code that runs on devices-under-test (DUTs) on the assembly line. All device group types prefaced with *pre-* should only be used to develop firmware **NOT** to produce and manage production devices.

A Pre-factory Device Group is used to develop fixture firmware. Unlike the other two pre-production groups, Pre-factory Device Groups have two ‘target’ settings. These are used to bind the group to the two other groups it requires:

- The Pre-dut Device Group to which DUTs will be automatically assigned to after BlinkUp is performed on them by one of the Pre-factory Device Group’s fixtures. You deploy DUT firmware to the pre-dut Device Group; this code runs on the DUT to test and then bless it.
- The Pre-production Device Group to which DUTs will be automatically assigned when they are blessed. You deploy application firmware to the Pre-production Device Group; this code runs on Production Devices (ie. blessed DUTs).

You can create Pre-production and Pre-dut Device Groups with the command [`impt dg create --dg-type <type>`](./CommandsManual.md#device-group-create). For example:

```bash
impt dg create --name MyPreProductionDG --descr "Pre-production Device Group for application"
    --dg-type pre-production --product MyProduct

impt dg create --name MyPreDUTDG --descr "Development DUT Firmware"
    --dg-type pre-dut --product MyProduct    
```

In the case of the Pre-factory Device Group, you need to specify its two targets. If these have have not been created yet, you can do so with the above command, or have them generated automatically by including the `--create-target` (Pre-production Device Group) and `--create-dut` (Pre-dut Device Group) options, as shown below:

```bash
impt project create --pre-factory --product MyProduct --name MyPreFactoryDG
    --descr "Development Fixture Firmware"
    --dut MyPreDUTDG --create-dut
    --target MyPreProductionDG --create-target
    --device-file factory.device.nut --agent-file factory.agent.nut
```

Pre-production Device Groups have an attribute called *load-code-after-blessing*. This defines when your application is loaded onto production devices: in your factory right after blessing, or when the device is activated using BlinkUp. When a new Pre-production Device Group is created, this attribute always has the value `true`. To change the attribute you can use the `--load-code-after-blessing` option of the [`impt dg update`](./CommandsManual.md#device-group-update) command:

```bash
impt dg update --dg MyPreProductionDG --load-code-after-blessing false
```

For detailed instructions on developing factory firmware using Production Testing Device Groups see the [Development Guide Typical Use Cases](https://github.com/electricimp/imp-central-impt/blob/feature/docs/DevelopmentGuide.md#typical-use-cases).

### Production Device Groups ###

Factory, Production and DUT Device Groups are the production equivalents of the [Production Testing Device Groups described above](#production-testing-device-groups). These groups are created in exactly the same way that their pre-production equivalents are, only these device groups are used to manufacture and manage your production devices. 

## Devices ##

### BlinkUp Fixtures ###

[BlinkUp fixtures](https://developer.electricimp.com/manufacturing/factoryprocess#in-the-connected-factory) are the devices that run the Pre-factory or Factory Device Group firmware. These devices are used during manufacturing to configure your DUTs on the assembly line for Internet access, then test and bless the devices that have passed testing. Fixtures must be assigned manually. In order to connect your BlinkUp Fixtures to the factory’s WiFi network, use the Electric Imp mobile app as usual and then assign them to (Pre-)Factory Device Group(s) with [`impt device assign`](./CommandsManual.md#device-assign). You can specify a device in the command by its ID, name, MAC address or agent ID.

```bash
impt device assign --device <device_id> --dg MyFactoryDG
```

### DUTs ###

Devices which run the Device Under Test (DUT) firmware are assigned automatically to the Factory Device Group’s DUT Device Group target, when they undergo factory BlinkUp. When DUTs are blessed (under the control of the DUT firmware), they become production devices and are automatically assigned to the Factory Device Group’s Production Device Group target.

### Production Devices ###

The only way to create a production device is through the manufacturing process. It is not possible to assign a device to a Pre-production or Production Device Group manually. The device is automatically assigned after [successful blessing](https://developer.electricimp.com/manufacturing/factoryprocess#test-and-bless). However, you can manually reassign any number of devices from one (Pre-)Production Device Group to another such group in the same Product.

You can list the devices currently assigned to a Device Group, Production or any other type of Device Group, with [`impt device list`](./CommandsManual.md#device-list). Use the command’s filter options to get device list subsets:

```bash
impt device list --dg MyProductionDG
```

#### Unblessing Production Devices ####

Once a device has been blessed during manufacturing (become a production device) you may move it to other Production Device Groups, however to remove a production device from a Production Device Group you **MUST** have access to your account’s unblessing key. When a production device is unassigned with the unblessing key it becomes a development device and will have to go through the manufacturing process if you wish to assign it to a Production Device Group again. To unassign a production device, specify the unblessing key as the value of the `--unbond` option of the [`impt device unassign`](./CommandsManual.md#device-unassign) command. 

```bash
impt device unassign --device <device_id> --unbond <unbond_key>
```

### Device Logging ###

You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) to view logs for (Pre-)Factory and (Pre-)DUT devices.

```bash
impt log get -device <device_id>
```

## Monitoring Production With Webhooks ##

You may use [Webhooks](https://developer.electricimp.com/manufacturing/webhooks) to monitor your factory test, production and post-production activities. There are three types of Webhooks:

- **blessing** &mdash; Called when a DUT has been successfully blessed, ie. becomes a production device.
- **blinkup** &mdash; Called when an end-user successfully activates a production device using BlinkUp.
- **deployment** &mdash; Called when new code is deployed to a Device Group.

You can create Webhook using [`impt webhook create`](./CommandsManual.md#webhook-create).

```bash
impt webhook create --dg MyProductionDG --url <webhook_url> --event blessing --mime json
```

```bash
impt webhook create --dg MyProductionDG --url <webhook_url> --event blinkup --mime urlencoded
```

## Deployments ##

A Deployment is a code build which has been deployed to a Device Group and therefore runs on all of the devices assigned (manually or automatically, depending on the Device Group type) to that Device Group. To start production you need at least three builds:

- Application firmware which will run on production devices.
- Factory firmware:
    1. [Fixture firmware](https://developer.electricimp.com/examples/factoryfirmware#fixture-firmware) which will run on BlinkUp Fixtures.
    2. [DUT firmware](https://developer.electricimp.com/examples/factoryfirmware#dut-firmware) which will run on DUTs upon BlinkUp.

Later, you may have more builds for different versions of your application or factory firmware.

If you have developed your code and created deployments using the Pre-factory, Pre-production and Pre-dut device groups and wish to create production versions, you can copy these an existing build to a new Deployment with [`impt build copy`](./CommandsManual.md#build-copy). It can be copied with or without the original build attributes.

```bash
impt build copy --build MyAppRC1 --dg MyProductionDG
impt build copy --build MyFixtureFirmwareRC1 --dg MyFixtureDG
impt build copy --build MyDUTFirmwareRC1 --dg MyDUTDG
```

### New Application Versions ###

You may develop new versions of your application. To deploy them to production devices, you:

1. Create a new build (Deployment) for your Production Device Group with [`impt build copy`](./CommandsManual.md#build-copy).
2. Restart the devices in the Production Device Group, for example, with [`impt dg restart`](./CommandsManual.md#device-group-restart).

```bash
impt build copy --build MyRC2 --dg MyProductionDG
impt dg restart --dg MyProductionDG
```

Alternatively, you may want to switch not all but a subset of production devices to the new version of your application. For this purpose you:

1. Create a new Production Device Group with [`impt dg create --dg-type production`](./CommandsManual.md#device-group-create).
2. Reassign the chosen production devices to the new Device Group with [`impt device assign`](./CommandsManual.md#device-assign).

**Note** The [`impt dg reassign`](./CommandsManual.md#device-group-reassign) command reassigns *all* of the devices from one Device Group to another.

## Cleaning Up ##

If at any time you want to clean up old and unused entities created during production &mdash; unneeded Device Groups, old Deployments, obsolete Webhooks, etc. &mdash; use the following commands:

- [`impt build cleanup`](./CommandsManual.md#build-cleanup)
- [`impt dg builds`](./CommandsManual.md#device-group-builds)
- [`impt dg delete`](./CommandsManual.md#device-group-delete)
- [`impt webhook delete`](./CommandsManual.md#webhook-delete)

**Note** The [impCentral API](https://apidoc.electricimp.com/) provides the following features intended to protect important entities from unintentional deletion or other accidental damage: *flagged* Deployment, *min-supported* Deployment, *conditional* restart and others.

To delete the whole Product with all Device Groups and Deployments you can use [`impt product delete --builds --force`](./CommandsManual.md#product-delete):

```bash
impt product delete --product MyProduct --builds --force
```

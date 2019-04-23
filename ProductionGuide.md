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
- [Deployments](#deployments)
    - [New Application Versions](#new-application-versions)
- [Monitoring Production With Webhooks](#monitoring-production-with-webhooks)
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

- *Development*, which is used to create and test application firmware.
- *Pre-factory*, *Pre-production* and *Pre-DUT* Device Groups, which are factory process test groups used during the [development process](./DevelopmentGuide.md).
- *Factory*, *Production* and *DUT* Device Groups, which are used during the production process.

### Production Testing Device Groups ###

Pre-factory, Pre-production and Pre-DUT Device Groups use used to develop and test your factory firmware: the code the runs on your BlinkUp fixtures and the separate code that runs on devices-under-test (DUTs) on the assembly line.

A Pre-factory Device Group is used to develop fixture firmware. Unlike the other two pre-production groups, Pre-factory Device Groups have two ‘target’ settings. These are used to bind the group to the two other groups it requires:

- The Pre-DUT Device Group to which DUTs will be automatically assigned to after BlinkUp is performed on them by one of the Pre-factory Device Group’s fixtures. You deploy DUT firmware to the pre-DUT Device Group; this code runs on the DUT to test and then bless it.
- The Pre-production Device Group to which DUTs will be automatically assigned when they are blessed. You deploy application firmware to the Pre-production Device Group; this code runs on Production Devices (ie. blessed DUTs).

You can create these Device Groups with the command [`impt dg create --dg-type <type>`](./CommandsManual.md#device-group-create). For example:

```bash
impt dg create --name MyPreProductionDG --descr "Pre-production Device Group for application"
    --dg-type production --product MyProduct
```

In the case of the Pre-factory Device Group, you need to specify its two targets. If these have have not been created yet, you can do so with the above command, or have them generated automatically by including the `--create-target` (Pre-production Device Group) and `--create-dut` (Pre-DUT Device Group) options, as shown below:

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

### Production Device Groups ###

Fixture, Production and DUT Device Groups are the production equivalents of the [pre-production groups described above](#production-testing-device-groups). Production groups are used to gather devices of the appropriate type (respectively, BlinkUp fixture, production devices and DUTs) which will then run the code (respectively, fixture firmware, application firmware and DUT firmware) deployed to them. Fixtures must be assigned manually, but DUTs are assigned automatically (to the Factory Device Group’s DUT Device Group target, when they undergo factory BlinkUp). When DUTs are blessed (under the control of the DUT firmware), they become production devices and are automatically assigned to the Factory Device Group’s Production Device Group target.

These groups are created in exactly the same way that their pre-production equivalents are.

## Devices ##

### BlinkUp Fixtures ###

Typically, you need as many [BlinkUp fixtures](https://developer.electricimp.com/manufacturing/factoryprocess#in-the-connected-factory) as you have assembly lines, but more sophisticated assembly processes may require multiple fixtures per line. Each of these will require their own (Pre-)Factory Device Group and (Pre-)DUT Device Group. All (Pre-)Factory Device Groups will also require a target (Pre-)Production Device Group, but only the last (Pre-)Factory Device Group in sequence will actually make use of its target (Pre-)Production Device Group as this will be the only one whose linked (Pre-)DUT firmware will bless DUTs.

In order to connect your BlinkUp Fixtures to the factory’s WiFi network, use the Electric Imp mobile app as usual and then assign them to (Pre-)Factory Device Group(s) with [`impt device assign`](./CommandsManual.md#device-assign). You can specify a device in the command by its ID, name, MAC address or agent ID.

```bash
impt device assign --device <device_id> --dg MyFactoryDG
```

### DUTs ###

DUTs are not added to your account. The are connected using factory BlinkUp mediated by a BlinkUp fixture. DUTs will be automatically added to the (Pre-)Factory Device Group’s target (Pre-)DUT Device Group. When they are blessed, they will be automatically re-assigned to the (Pre-)Factory Device Group’s target (Pre-)Production Device Group.

### Production Devices ###

It is not possible to assign a newly assembled device to a (Pre-)Production Device Group manually. The device is automatically assigned after [successful blessing](https://developer.electricimp.com/manufacturing/factoryprocess#test-and-bless). However, you can manually reassign any number of devices from one (Pre-)Production Device Group to another such group in the same Product.

You can list the devices currently assigned to a (Pre-)Production Device Group (or any other Device Group, or any unassigned devices) with [`impt device list`](./CommandsManual.md#device-list). Use the command’s filter options to get device list subsets:

```bash
impt device list --dg MyProductionDG
```

#### Unblessing Production Devices ####

You may remove a production device from a (Pre-)Production Device Group only if you have access to your account’s unblessing key. Specify that key as the value of the `--unbond` option of the [`impt device unassign`](./CommandsManual.md#device-unassign) command. The device is unblessed and unassigned, and can then be used for development.

```bash
impt device unassign --device <device_id> --unbond <unbond_key>
```

### Device Logging ###

The impCentral API supports logging from BlinkUp fixtures. You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) to view them.

```bash
impt log get -device <device_id>
```

impCentral API logging is not supported for production devices.

## Deployments ##

A Deployment is a code build which has been deployed to a Device Group and therefore runs on all of the devices assigned (manually or automatically, depending on the Device Group type) to that Device Group. To start production you need at least three builds:

- Application firmware which will run on production devices.
- Factory firmware:
    1. [Fixture firmware](https://developer.electricimp.com/examples/factoryfirmware#fixture-firmware) which will run on BlinkUp Fixtures.
    2. [DUT firmware](https://developer.electricimp.com/examples/factoryfirmware#dut-firmware) which will run on DUTs upon BlinkUp.

Later, you may have more builds for different versions or flavors of your application or factory firmware.

This guide assumes you have already developed and tested your application, fixture and DUT firmware, and that these are ready for production. These will exits as Deployments made to your Product’s Development, Pre-factory and Pre-DUT Device Groups. You can copy an existing build to a new Deployment with [`impt build copy`](./CommandsManual.md#build-copy). It can be copied with or without the original build attributes.

```bash
impt build copy --build MyAppRC1 --dg MyProductionDG
impt build copy --build MyFixtureFirmwareRC1 --dg MyFixtureDG
impt build copy --build MyDUTFirmwareRC1 --dg MyDUTDG
```

### New Application Versions ###

You may develop new versions of your application. To deploy them to production devices, you:

1. Create a new build (Deployment) for your (Pre-)Production Device Group with [`impt build copy`](./CommandsManual.md#build-copy).
2. Restart the devices in the (Pre-)Production Device Group, for example, with [`impt dg restart`](./CommandsManual.md#device-group-restart).

```bash
impt build copy --build MyRC2 --dg MyProductionDG
impt dg restart --dg MyProductionDG
```

Alternatively, you may want to switch not all but a subset of production devices to the new version or flavor of your application. For this purpose you:

1. Create a new (Pre-)Production Device Group with [`impt dg create --dg-type production`](./CommandsManual.md#device-group-create).
2. Reassign the chosen production devices to the new Device Group with [`impt device assign`](./CommandsManual.md#device-assign).

**Note** The [`impt dg reassign`](./CommandsManual.md#device-group-reassign) command reassigns *all* of the devices from one Device Group to another.

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
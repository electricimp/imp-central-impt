# impt Production Guide #

This additional guide is intended for those customers who use *impt* with [production processes](https://developer.electricimp.com/manufacturing). You may use scripts on top of *impt* commands to automate some of the operations.

Please read the main [Read Me file](./README.md) first as it covers all the basic *impt* usage and its common components.

The full *impt* tool command specification is described in the [Commands Manual](./CommandsManual.md).

**Note** You need to have appropriate permission to make use of [impCentral™ API](https://apidoc.electricimp.com/) entities and endpoints related to the production process.

## Contents ##

- [Product Creation](#product-creation)
- [Device Group Creation And Management](#device-group-creation-and-management)
  - [Pre-production-typeDevice Groups](#pre-production-type-device-groups)
  - [Production-type Device Groups](#production-type-device-groups)
- [Deployment creation](#deployments)
- [Device management](#devices)
  - [Factory BlinkUp Fixtures](#factory-blinkup-fixtures)
  - [Devices Under Test (DUTs)](#devices-under-test-duts)
  - [Unblessing production devices](#unblessing)
- [Webhooks creation and management](#webhooks)
- [Logging](#logging)
- [New Versions creation](#new-versions)
- [Cleaning Up](#cleaning-up)

## Product Creation ##

Typically, you have just one Product per actual product. A single Product may include all of the software components needed for development, testing, factory operation, device end-user operation, and support of all the different versions of your product.

You can create a Product with [`impt product create`](./CommandsManual.md#product-create):

```
impt product create --name MyProduct --descr "My product"
```

## Device Group Creation And Management ##

A Device Group encapsulates a particular software component of your product &mdash; application firmware, BlinkUp™ fixture firmware or device-under-test (DUT firmware) &mdash; and holds the devices which will run that code. Different Device Groups may be deployed with different versions of your software components: a version which is currently under development, a version which is currently under testing, different versions in production, etc. When a new software build (a Deployment) is created, it is assigned to one and only one Device Group.

Device Groups may be of different [types](./CommandsManual.md#device-group-type):

- *Development*, which is used to create and test application firmware.
- *Pre-fixture*, *pre-production* and *pre-DUT* Device Groups, which factory process test groups used during the [development process](./DevelopmentGuide.md).
- *Fixture*, *production* and *DUT* Device Groups, which are used during the production process.

### Pre-Production-type Device Groups ###

Pre-fixture, pre-production and pre-DUT Device Groups use used to develop and test your factory firmware: code the runs on your BlinkUp fixtures and separate code that runs on devices-under-test (DUTs) on the assembly line. 

A pre-fixture Device Group is used to develop fixture firmware. Unlike the other two pre-production Device Groups, pre-fixture Device Groups have two ‘target’ settings. These are used to connect a pre-fixture Device Group to the two other groups it requires.

The first target indicates which Device Group (of the pre-DUT type) DUTs will be assigned to after BlinkUp is performed on them by one of the pre-fixture Device Group’s BlinkUp fixtures. You deploy DUT firmware to the pre-DUT Device Group; this code runs on the DUT to test and then bless it.

The second target indicates which Device Group (of the pre-production type) DUTs will be assigned to after blessing. You deploy application firmware to the pre-production Device Group; this code runs on Production Devices (ie. blessed DUTs). The application code used is the product of a development Device Group; you don’t use pre-production Device Groups to create code, only to gather devices and deploy code to them.

You can create these Device Groups with the command [`impt dg create --dg-type <type>`](./CommandsManual.md#device-group-create). For example:

```
impt dg create --name MyPreProductionDG --descr "Pre-production Device Group for application" 
    --dg-type production --product MyProduct
```

In the case of the pre-fixture Device Group, you need to specify its two targets. If have not created these yet, you can do so with the above command, or have them generated automatically by including the `--create-target` (pre-production Device Group) and `--create-dut` (DUT Device Group) options, as shown below:

```
impt project create --pre-factory --product MyProduct --name MyPreFactoryDG 
    --descr "Development Fixture Firmware" 
    --dut MyPreDUTDG --create-dut
    --target MyPreProductionDG --create-target 
    --device-file factory.device.nut --agent-file factory.agent.nut
```

Pre-production Device Groups have an attribute called *load-code-after-blessing*. This defines when your application is loaded onto production devices: in your factory right after blessing, or when the device is activated using BlinkUp. When a new Pre-production Device Group is created, this attribute always has the value `true`. To change the attribute you can use the `--load-code-after-blessing` option of the [`impt dg update`](./CommandsManual.md#device-group-update) command:

```
impt dg update --dg MyPreProductionDG --load-code-after-blessing false
```

### Production-type Device Groups ###

Fixture, production and DUT Device Groups are the production equivalents of the pre-production groups [described above](#pre-production-type-device-groups). Unlike those groups, production groups are not used to develop code, just to gather devices of the appropriate type (respectively, BlinkUp fixture, production devices and DUTs) which will then run the code (respectively, fixture firmware, application firmware and DUT firmware) deployed to them. Fixtures must be assigned manually, but DUTs are assigned automatically (to the Fixture Device Group’s DUT Device Group target, when they are factory-enrolled by BlinkUp). When DUTs are blessed (under the control of the DUT firmware), they become production devices &mdash; they are automatically assigned to the Fixture Device Group’s Production Device Group target.

These groups are created in exactly the same way that their pre-production equivlents are.

## Deployments ##

A Deployment is a build which has been deployed to a Device Group and therefore runs on all of the devices assigned to that Device Group. To start production you need at least three builds:

- Application firmware which will run on production devices.
- [Fixture firmware](https://developer.electricimp.com/examples/factoryfirmware) which will run on BlinkUp Fixtures.
- [DUT firmware](https://developer.electricimp.com/examples/factoryfirmware) which will run on DUTs upon BlinkUp.

Later, you may have more builds for different versions or flavors of your application or factory firmware.

This guide assumes you have already developed and tested your application and factory firmware, and that these are ready for production. These will exits as Deployments made to *development*, *pre-fixture* and *pre-DUT* Device Groups of your Product. You can copy an existing build to a new Deployment with [`impt build copy`](./CommandsManual.md#build-copy). It can be copied with or without the original build attributes.

```
impt build copy --build MyAppRC1 --dg MyProductionDG
impt build copy --build MyFixtureFirmwareRC1 --dg MyFixtureDG
impt build copy --build MyDUTFirmwareRC1 --dg MyDUTDG
```

## Devices ##

### BlinkUp Fixtures ###

Typically, you need as many [BlinkUp Fixtures](https://developer.electricimp.com/manufacturing/blinkupfixture_simple) as you have assembly lines, but more sophisticated assembly processes may require multiple fixtures per line. Each of these will require their own Fixture Device Group and DUT Device Group. All Fixture Device Groups will also require a target Production Device Group, but only the last Fixture Device Group in sequence will actually make use of its target Production Device Group as this will be the only one whose linked DUT firmware will bless DUTs.

In order to connect your BlinkUp Fixtures to the factory’s WiFi network, use the Electric Imp mobile app as usual and then assign them to Fixture Device Group(s) with [`impt device assign`](./CommandsManual.md#device-assign). You can specify a device in the command by its ID, name, MAC address or agent ID.

```
impt device assign --device <device_id> --dg MyFactoryDG
```  

### DUTs ###

DUTs are not added to your account. The are connected by BlinkUp from a BlinkUp fixture, and will be automatically added to the Fixture Device Group’s target DUT Device Group. When they are blessed, they will be automatically re-assigned to the Fixture Device Group’s target Production Device Group.

### Production Devices ###

It is not possible to assign a newly assembled device to a Production Device Group manually. The device is automatically assigned after [successful blessing](https://developer.electricimp.com/manufacturing/factoryguide). However, you can manually reassign any number of devices from one Production Device Group to another such group in the same Product.

You can list the devices currently assigned to a Production Device Group (or any other Device Group, or any unassigned devices) with [`impt device list`](./CommandsManual.md#device-list). Use the command’s filter options to get device list subsets:

```
impt device list --dg MyProductionDG
```

### Unblessing ###

You may remove a production device from a Production Device Group only if you have access to your account’s unblessing key. Specify that key as the value of the `--unbond` option of the [`impt device unassign`](./CommandsManual.md#device-unassign) command. The device is unblessed and unassigned, and can then be used for development.

```
impt device unassign --device <device_id> --unbond <unbond_key>
```

## Webhooks ##

You may use [Webhooks](https://developer.electricimp.com/manufacturing/webhooks) to monitor your factory test, production and post-production activities. There are three types of Webhooks:

- **blessing** &mdash; Called when a DUT has been successfully blessed, ie. becomes a production device.
- **blinkup** &mdash; Called when an end-user successfully activates a production device using BlinkUp.
- **deployment** &mdash; Called when new code is deployed to a Device Group.

You can create Webhook using [`impt webhook create`](./CommandsManual.md#webhook-create).

```
impt webhook create --dg MyProductionDG --url <webhook_url> --event blessing --mime json
```

```
impt webhook create --dg MyProductionDG --url <webhook_url> --event blinkup --mime urlencoded
```

## Logging ##

The impCentral API supports logging for Factory BlinkUp Fixtures. You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) to view them.

```
impt log get -device <device_id>
```

impCentral API logging is not supported for production devices.

## New Versions ##

You may develop new versions of your application. To deploy them to production devices, you:

1. Create a new build (Deployment) for your Production Device Group with [`impt build copy`](./CommandsManual.md#build-copy).
2. Restart the devices in the Production Device Group, for example, with [`impt dg restart`](./CommandsManual.md#device-group-restart).

```
impt build copy --build MyRC2 --dg MyProductionDG
impt dg restart --dg MyProductionDG
```

Alternatively, you may want to switch not all but a subset of production devices to the new version or flavor of your application. For this purpose you:

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

```
impt product delete --product MyProduct --builds --force
```

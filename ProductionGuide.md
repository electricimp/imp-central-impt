# impt Production Guide #

**NOTE:** The contents of this guide have **NOT** been updated with the release of v2.5.0 and above (support for DUT device groups), and so some of the contents may be out of date.

This additional guide is intended for those customers who use *impt* with [production processes](https://developer.electricimp.com/manufacturing). You may use scripts on top of *impt* commands to automate some of the operations.

Please read the main [Read Me file](./README.md) first as it covers all the basic *impt* usage and its common components.

The full *impt* tool command specification is described in the [Commands Manual](./CommandsManual.md).

**Note** You need to have appropriate permission to make use of [impCentral™ API](https://apidoc.electricimp.com/) entities and endpoints related to the production process.

## Contents ##

- [Product creation](#product)
- [Device Group creation and management](#device-groups)
  - [Production Device Groups](#production-device-groups)
  - [Factory Device Groups](#factory-device-groups)
- [Deployment creation](#deployments)
- [Device management](#devices)
  - [Factory BlinkUp Fixtures](#factory-blinkup-fixtures)
  - [Devices Under Test (DUTs)](#devices-under-test-duts)
  - [Unblessing production devices](#unblessing)
- [Webhooks creation and management](#webhooks)
- [Logging](#logging)
- [New Versions creation](#new-versions)
- [Cleaning Up](#cleaning-up)

## Product ##

Typically, you have just one Product per actual product. A single Product may include all of the software components needed for development, testing, factory operation, device end-user operation, and support of all the different versions of your product.

You can create a Product with [`impt product create`](./CommandsManual.md#product-create):

```
impt product create --name MyProduct --descr "My product"
```

## Device Groups ##

A Device Group encapsulates a particular software component of your product: test code, an application or factory firmware. Different Device Groups may cover different versions of your software components: a version which is currently under development, a version which is currently under testing, different versions in production, etc. When a new software build (a Deployment) is created, it is assigned to one and only one Device Group.

Device Groups may be of different [types](./CommandsManual.md#device-group-type):
- *development*, *pre-factory* and *pre-production* Device Groups are used during the [development process](./DevelopmentGuide.md).
- *factory* and *production* Device Groups are used during the production process.

### Production Device Groups ###

Your production devices, which are utilized by end-users, are organized into one or more Device Groups of the *production* type. Different Production Device Groups within the same Product may be used to encapsulate and manage different versions or flavors of your application. Production devices are units that have been blessed; up until that point they are referred to as devices under test (DUTs).

You can create a Production Device Group with [`impt dg create --dg-type production`](./CommandsManual.md#device-group-create).

Production Device Groups have an attribute called *load-code-after-blessing*. This defines when your application is loaded onto production devices: in your factory after blessing, or when an end-user activates a device using BlinkUp™. When a new Production Device Group is created, this attribute always has the value `true`. To change the attribute you can use the `--load-code-after-blessing` option of the [`impt dg update`](./CommandsManual.md#device-group-update) command:

```
impt dg create --name MyProductionDG --descr "Production Device Group for application"
    --dg-type production --product MyProduct
impt dg update --dg MyProductionDG --load-code-after-blessing false
```

### Factory Device Groups ###

For your [factory setup](https://developer.electricimp.com/manufacturing/factoryprocessinanutshell) you need one or more [factory BlinkUp fixtures](https://developer.electricimp.com/manufacturing/blinkupfixture_simple). These are imp-enabled devices which configure your DUTs on the assembly line for Internet access. Factory BlinkUp Fixtures are combined in one or more Device Groups of the *factory* type. Different Factory Device Groups within the same Product may be used to configure different versions or flavors of your DUTs.

You can create Factory Device Group with the [`impt dg create --dg-type factory`](./CommandsManual.md#device-group-create) command.

Each Factory Device Group references a single Production Device Group within the same Product. This is the Factory Device Group’s *target* and this the Production Device Group to which DUTs will automatically be assigned once they have been blessed and become production devices. You specify a Factory Device Group’s target by using the `--target` option during Factory Device Group creation:

```
impt dg create --name MyFactoryDG --descr "Factory Device Group for factory firmware"
    --dg-type factory --product MyProduct --target MyProductionDG
```

## Deployments ##

A Deployment is a build which has been deployed to a Device Group and therefore runs on all devices assigned to the Device Group. To start production you need at least two builds:

- Application firmware which will run on production devices.
- [Factory firmware](https://developer.electricimp.com/examples/factoryfirmware) which will run on Factory BlinkUp Fixtures (and on DUTs before blessing).

Later, you may have more builds for different versions or flavors of your application or factory firmware.

This guide assumes you have already developed and tested your application and factory firmware, and that these are ready for production. These will exits as Deployments made to *development* and *pre-factory* Device Groups of your Product. You can copy an existing build to a new Deployment with [`impt build copy`](./CommandsManual.md#build-copy). It can be copied with or without the original build attributes.

```
impt build copy --build MyRC1 --dg MyProductionDG
```

```
impt build copy --build MyFactoryRC1 --dg MyFactoryDG
```

## Devices ##

### Factory BlinkUp Fixtures ###

Usually you need as many [Factory BlinkUp Fixtures](https://developer.electricimp.com/manufacturing/blinkupfixture_simple) as you have assembly lines.

In order to connect your Factory BlinkUp Fixtures to the factory’s WiFi network, use the Electric Imp mobile app as usual and then assign them to Factory Device Group(s) with [`impt device assign`](./CommandsManual.md#device-assign). You can specify a device in the command by its ID, name, MAC address or agent ID.

```
impt device assign --device <device_id> --dg MyFactoryDG
```

### Devices Under Test (DUTs) ###

It is not possible to assign a newly assembled device to a Production Device Group manually. The device is automatically assigned after [successful blessing](https://developer.electricimp.com/manufacturing/factoryguide). You can manually reassign any number of devices from one Production Device Group to another such group in the same Product.

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

You may use [Webhooks](https://developer.electricimp.com/manufacturing/webhooks) to monitor your factory, production and post-production activities. There are three types of Webhooks:

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

**Note** The [impCentral API](https://apidoc.electricimp.com/) provides the following features intended to protect important entities from unintentional deletion or other accidental damages: *flagged* Deployment, *min-supported* Deployment, *conditional* restart and others.

To delete the whole Product with all Device Groups and Deployments you can use [`impt product delete --builds --force`](./CommandsManual.md#product-delete):

```
impt product delete --product MyProduct --builds --force
```

# impt Production Guide

This additional guide is intended for those who use the impt tool in [factory and production processes](https://developer.electricimp.com/manufacturing).

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

Note, you need to have appropriate permissions to operate with the [impCentral API](https://apidoc.electricimp.com/) entities related to factory and production processes.

**TODO - not completed yet**

**TODO - this guide should be carefully reviewed and maybe fully re-written by EI. Screenshots may be added by those who can emulate factory process.**

Table Of Contents: / Process
- **TODO**

## Product

Usually, you need one Product entity for your whole product. One Product may include all software components needed for development, testing, factory, production, support of different versions of your product, etc.

You can create Product by [**impt product create**](./CommandsManual.md#product-create) command.

*Example:*  
`impt product create --name MyProduct --descr "My product"`  

## Device Groups

Device Group is, in fact, an entity which encapsulates a particular software component of your product - an application, a factory firmware. Different Device Groups may cover different versions of your software components - a version which is currently under development, a version which is currently under testing, different versions in production, etc. When a new software build (Deployment) is created it is intended to one and only one concrete Device Group.

Device Group may be of different [types](./CommandsManual.md#device-group-type):
- *development*, *pre-factory* and *pre-production* Device Groups are used during [development process](./DevelopmentGuide.md).
- *factory* and *production* Device Groups are used during factory and production processes.

### Production Device Groups

Your production devices, which are utilized by end users, are combined in one or several Device Groups of *production* type. Different *production* Device Groups of the same Product may be used to encapsulate and manage different versions or flavors of your application.

You can create *production* Device Group by [**impt dg create --dg-type production**](./CommandsManual.md#device-group-create) command.

Pay attention, *production* Device Group has *load-code-after-blessing* attribute - it defines when your application is loaded to the production devices - in your factory or when an end-user activates a device. When a new *production* Device Group is created this attribute always has the value *true*. To change the attribute you can use `--load-code-after-blessing` option of [**impt dg update**](./CommandsManual.md#device-group-update) command.

*Example:*  
`impt dg create --name MyProductionDG --descr "Production Device Group for application" --dg-type production --product MyProduct`  
`impt dg update --dg MyProductionDG --load-code-after-blessing false`  

### Factory Device Groups

For your [factory process](https://developer.electricimp.com/manufacturing/factoryprocessinanutshell) you need [Factory BlinkUp Fixtures](https://developer.electricimp.com/manufacturing/blinkupfixture_simple) - devices which make factory BlinkUp and blessing of your production devices. Factory BlinkUp Fixtures are combined in one or several Device Groups of *factory* type. Different *factory* Device Groups of the same Product may be used to BlinkUp and bless different versions or flavors of your production devices.

You can create *factory* Device Group by [**impt dg create --dg-type factory**](./CommandsManual.md#device-group-create) command.

Device Group of *factory* type should have a reference to a Device Group of *production* type of the same Product. It is a production target of your Factory BlinkUp Fixtures and you should specify it by `--target` option during *factory* Device Group creation.

*Example:*  
`impt dg create --name MyFactoryDG --descr "Factory Device Group for factory firmware" --dg-type factory --product MyProduct --target MyProductionDG`  

## Deployments

Deployment is a build which belongs to a concrete Device Group and runs on all devices assigned to the Device Group.

To start a production you need at least two builds:
- application which will run on production devices,
- [factory firmware](https://developer.electricimp.com/examples/factoryfirmware) which will run on Factory BlinkUp Fixtures (and on production devices before their blessing).

Later, you may have more builds - for different versions or flavors of your application or factory firmware.

This guide assumes you have already developed and tested your application and factory firmware and there are ready for production Deployments which belong to *development* and *pre-factory* Device Groups of your Product. For example, see the [impt Development Guide](./DevelopmentGuide.md).

You can copy a ready build to a new Deployment which belongs to your *factory* or *production* Device Group by [**impt build copy**](./CommandsManual.md#build-copy) command. It can be copied with or without the original build attributes.

*Example:*  
`impt build copy --build MyRC1 --dg MyProductionDG`  
`impt build copy --build MyFactoryRC1 --dg MyFactoryDG`  

## Devices

### Factory BlinkUp Fixtures

Usually you need as many [Factory BlinkUp Fixtures](https://developer.electricimp.com/manufacturing/blinkupfixture_simple) as the number of parallel factory lines you have.

In order to connect your Factory BlinkUp Fixtures to the factory's WiFi network you may [BlinkUp](https://developer.electricimp.com/blinkup) them as usual development devices. And after that, assign them to your *factory* Device Group by [**impt device assign**](./CommandsManual.md#device-assign) command. You can specify a device in the command by its Id, Name, MAC, IMP Agent Id.

*Example:*  
`impt device assign --device <device_id> --dg MyFactoryDG`  

### Production Devices

It is not possible to directly assign a new assembled production device to a *production* Device Group. The device is automatically assigned after successful [blessing during the factory process](https://developer.electricimp.com/manufacturing/factoryguide). But you can directly reassign any number of devices from one *production* Device Group to another *production* Device Group of the same Product.

You can list the devices currently assigned to your *production* Device Group, as well as to any other Device Group or unassigned devices, by [**impt device list**](./CommandsManual.md#device-list) command. Use Filter Options of the command to filter the devices.

*Example:*  
`impt device list --dg MyProductionDG`  

## Webhooks

You may control your factory and production processes by using [Webhooks](https://developer.electricimp.com/manufacturing/webhooks). There are three types of Webhooks:
- *blessing* - it is called when a production device has been successfully blessed.
- *blinkup* - it is called when an end-user successfully activates a production device using BlinkUp.
- *deployment* - it is called when a new code is deployed to a Device Group.

You can create Webhook by [**impt webhook create**](./CommandsManual.md#webhook-create) command.

*Example:*  
`impt webhook create --dg MyProductionDG --url <webhook_url> --event blessing --mime json`  
`impt webhook create --dg MyProductionDG --url <webhook_url> --event blinkup --mime urlencoded`  

## Logging

impCentral API logging is supported for Factory BlinkUp Fixtures. You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) for them.

*Example:*  
`impt log get -device <device_id>`  

impCentral API logging is not supported for production devices. Use [other ways](https://developer.electricimp.com/resources/monitoringapplication/) to monitor the application's behavior on them.

## Post-Production Activities

### New Versions

You may develop new versions of your application. To deploy them on the production devices you can:
- create a new build (Deployment) for your *production* Device Group by [**impt build copy**](./CommandsManual.md#build-copy) command,
- and then restart the devices in the *production* Device Group, for example by [**impt dg restart**](./CommandsManual.md#device-group-restart) command.

*Example:*  
`impt build copy --build MyRC2 --dg MyProductionDG`  
`impt dg restart --dg MyProductionDG`  

Alternatively, you may want to switch not all but a subset of production devices to the new version or flavor of your application. For this purpose you can:
- create a new *production* Device Group by [**impt dg create --dg-type production**](./CommandsManual.md#device-group-create) command,
- and then reassign the needed production devices to the new Device Group by [**impt device assign**](./CommandsManual.md#device-assign) command.

[**impt dg reassign**](./CommandsManual.md#device-group-reassign) command reassigns all devices from one Device Group to another.

### Unblessing


 min-supported deployments, conditional restart, flagged




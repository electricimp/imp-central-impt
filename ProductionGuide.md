# impt Production Guide

This additional guide is intended for those who use the impt tool in [factory and production processes](https://developer.electricimp.com/manufacturing).

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

**TODO - not completed yet**

**TODO - this guide should be carefully reviewed and maybe fully re-written by EI**

Table Of Contents:
- **TODO**

## Involved Entities

There are several impCentral API entities which are involved into factory and production processes.

### Product

Usually, you need one Product entity for your whole product. One Product may include all software components needed for development, testing, factory, production, support of different versions of your product, etc.

You can create Product by [**impt product create**](./CommandsManual.md#product-create) command.

### Device Group

Device Group is, in fact, an entity which encapsulates a particular software component of your product - an application, a factory firmware. Different Device Groups may cover different versions of your software components - a version which is currently under development, a version which is currently under testing, different versions in production, etc. When a new software build (Deployment) is created it is intended to one and only one concrete Device Group.

Device Group may be of different [types](./CommandsManual.md#device-group-type):
- *development*, *pre-factory* and *pre-production* types of Device Group are used during [development process](./DevelopmentGuide.md).
- *factory* and *production* types of Device Group are used during factory and production processes.

describe the meaning of production DGs - versions...

factory DG - production target

### Deployment

### Device

### WebHook

## Factory Process

## Post-Production Process

## Logging

impCentral API logging is supported for factory fixture devices. You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) for them.

impCentral API logging is not supported for production devices. Use [other ways](https://developer.electricimp.com/resources/monitoringapplication/) to monitor the application's behavior on them




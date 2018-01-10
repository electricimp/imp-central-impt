# impt Production Guide

This additional guide is intended for those who use the impt tool in [factory and production processes](https://developer.electricimp.com/manufacturing).

First of all, please read the root [readme file](./README.md) that covers all basic and common aspects of the impt tool.

The full impt tool commands specification is described in the [impt Commands Manual](./CommandsManual.md).

Table Of Contents:
- **TODO**

## Involved Entities

These are the impCentral API entities which are involved into factory and production processes:

### Product

Usually, you need one Product entity for your whole product. One Product may include all components for development, testing, factory, production, support of different versions of your product, etc.

You can create Product by [**impt product create**](./CommandsManual.md#product-create) command.

### Device Group

Device Group is, in fact, an entity which encapsulates a particular target and version of your application - a version under development, a version under testing, a factory firmware version, a version for production, etc.

### Deployment

### Device

### WebHook

## Factory Process

## Post-Production Process

## Logging

impCentral API logging is supported for factory fixture devices. You can use [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) for them.

impCentral API logging is not supported for production devices. Use [other ways](https://developer.electricimp.com/resources/monitoringapplication/) to monitor the application's behavior on them




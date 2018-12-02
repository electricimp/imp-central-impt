class DeviceTestCase extends ImpTestCase {
    function testDeviceServerError() {
        DeviceServerError().sendError();
        assertTrue(true, "Should still get the line executed");
    }
}

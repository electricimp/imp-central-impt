local myVar = null;
device.on("data", function(rcv_data) {
    myVar = rcv_data;
});

@include __PATH__+"/myfile.nut";

class MyTestCase extends ImpTestCase {
    function doWaitForData() {
        local myFunc = null;
        return Promise(function(ok, err) {
            myFunc = function() {
                if (myVar == null) {
                    imp.wakeup(1.0, myFunc);
                } else if ("MYVAR = 3" == myVar) {
                    ok();
                } else {
                    err();
                }
            };
            imp.wakeup(1.0, myFunc);
        });
    }

    function testMe() {
        doWaitForData();
    }

    function testMe_1() {
        doWaitForData();
    }
}

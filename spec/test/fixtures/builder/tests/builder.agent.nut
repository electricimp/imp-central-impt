@include __PATH__+"/myfile.nut";

class MyTestCase extends ImpTestCase {
    function testMe() {
        local myFunc = null;
@include __PATH__+"/../myfile.nut";
        local myLine = "LINE = @{__LINE__}";
        local myFile = "FILE = @{__FILE__}";
        local myEnv = "GGG = #{env:GGG}";
        return Promise(function(ok, err) {
            myFunc = function() {
                if (myVar == null) {
                    imp.wakeup(1.0, myFunc);
                } else if ("MYVAR_2 = 5" == myVar && 
                           "LINE = 7" == myLine &&
                           "FILE = builder.agent.nut" == myFile &&
                            MYVAR_2 == 5) {
                    ok();
                } else {
                    server.log(myVar);
                    server.log(myLine);
                    server.log(myFile);
                    server.log("MYVAR_2 = " + MYVAR_2);
                    err();
                }
            };
            imp.wakeup(1.0, myFunc);
        }.bindenv(this));
    }
}

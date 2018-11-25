@include __PATH__+"/myfile.nut";

local myVar = "MYVAR_2 = " + MYVAR_2;
imp.wakeup(3.0, function(){
    agent.send("data", myVar);
});

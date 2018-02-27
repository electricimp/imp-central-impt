@set MYVAR 3
local myVar = "MYVAR = @{MYVAR}";
imp.wakeup(5.0, function() {
    agent.send("data", myVar);
});

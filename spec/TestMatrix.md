# impt tests summary table  

[Google Doc](https://docs.google.com/spreadsheets/d/1sAOkKtzRiPov6Yq6fYbqpluihLuWpczDOkmuQCYFb9c/edit?usp=sharing)


|Precondition|auth|local|temp|endpoint|confirmed|output|help|Test file|Test name|
|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
|not auth|u/p|||||default||auth/auth_user_pwd.spec.js|global auth login|
|not auth|u/p||||Y|default||auth/auth_user_pwd.spec.js|global auth login with confirm|
|not auth|u/p|||Y||default||auth/auth_user_pwd.spec.js|global auth login with endpoint|
|not auth|u/p|||Y|Y|default||auth/auth_user_pwd.spec.js|global auth login with endpoint and confirm|
|not auth|u/p||Y|||default||auth/auth_user_pwd.spec.js|global temp auth login|
|not auth|u/p||Y||Y|default||auth/auth_user_pwd.spec.js|global temp auth login with confirm|
|not auth|u/p||Y|Y||default||auth/auth_user_pwd.spec.js|global temp auth login with endpoint|
|not auth|u/p||Y|Y|Y|default||auth/auth_user_pwd.spec.js|global temp auth login with endpoint and confirm|
|not auth|u/p|Y||||default||auth/auth_user_pwd.spec.js|local auth login|
|not auth|u/p|Y|||Y|default||auth/auth_user_pwd.spec.js|local auth login with confirm|
|not auth|u/p|Y||Y||default||auth/auth_user_pwd.spec.js|local auth login with endpoint|
|not auth|u/p|Y||Y|Y|default||auth/auth_user_pwd.spec.js|local auth login with endpoint and confirm|
|not auth|u/p|Y|Y|||default||auth/auth_user_pwd.spec.js|local temp auth login|
|not auth|u/p|Y|Y||Y|default||auth/auth_user_pwd.spec.js|local temp auth login with confirm|
|not auth|u/p|Y|Y|Y||default||auth/auth_user_pwd.spec.js|local temp auth login with endpoint|
|not auth|u/p|Y|Y|Y|Y|default||auth/auth_user_pwd.spec.js|local temp auth login with endpoint and confirm|
|not auth|u/p|||||w/o arg||auth/auth_user_pwd.spec.js|login without output argument|
|not auth|u/p|||w/o value||default||auth/auth_user_pwd.spec.js|login without endpoint argument|
|not auth|u/p w/o value |||||default||auth/auth_user_pwd.spec.js|login without user/password|
|not auth|lk|||||default||auth/auth_loginkey.spec.js|global auth loginkey login by loginkey|
|not auth|lk||Y|||default||auth/auth_loginkey.spec.js|global temp loginkey auth login by loginkey|
|not auth|lk|||Y||default||auth/auth_loginkey.spec.js|global auth loginkey login by loginkey with endpoint|
|not auth|lk|Y|Y|||default||auth/auth_loginkey.spec.js|local temp loginkey auth login by loginkey|
|not auth|lk|Y||Y||default||auth/auth_loginkey.spec.js|local loginkey auth login by loginkey with endpoint|
|not auth|lk||Y|Y||default||auth/auth_loginkey.spec.js|global temp loginkey auth login by loginkey with endpoint|
|not auth|lk w/o arg |||||default||auth/auth_loginkey.spec.js|global loginkey auth login without loginkey|
|global u/p auth|u/p||||Y|default||auth/auth_user_pwd.spec.js|repeated global auth login with confirm|
|global u/p auth|u/p|||Y|Y|default||auth/auth_user_pwd.spec.js|repeated global auth login with endpoint and confirm|
|global u/p auth|u/p||Y||Y|default||auth/auth_user_pwd.spec.js|repeated global temp auth login with confirm|
|global u/p auth|u/p||Y|Y|Y|default||auth/auth_user_pwd.spec.js|repeated global temp auth login with endpoint and confirm|
|global u/p auth|lk||Y||Y|default||auth/auth_loginkey.spec.js|repeated global temp loginkey auth login with confirm|
|global u/p auth|lk|||Y|Y|default||auth/auth_loginkey.spec.js|repeated global auth loginkey login with endpoint and confirm|
|global u/p auth|lk|Y|Y||Y|default||auth/auth_loginkey.spec.js|repeated local temp loginkey auth login with confirm|
|global lk auth|u/p||||Y|default||auth/auth_loginkey.spec.js|repeated global auth login with confirm|
|global lk auth|u/p|||Y|Y|default||auth/auth_loginkey.spec.js|repeated global auth login with endpoint and confirm|
|global lk auth|u/p||Y||Y|default||auth/auth_loginkey.spec.js|repeated global temp auth login with confirm|
|global lk auth|u/p|Y|||Y|default||auth/auth_loginkey.spec.js|repeated local auth login with confirm|
|global lk auth|u/p|Y||Y|Y|default||auth/auth_loginkey.spec.js|repeated local auth login with endpoint and confirm|
|global lk auth|u/p|Y|Y||Y|default||auth/auth_loginkey.spec.js|repeated local temp auth login with confirm|
|local u/p auth|u/p|Y|||Y|default||auth/auth_user_pwd.spec.js|repeated local auth login with confirm|
|local u/p auth|u/p|Y||Y|Y|default||auth/auth_user_pwd.spec.js|repeated local auth login with endpoint and confirm|
|local u/p auth|u/p|Y|Y||Y|default||auth/auth_user_pwd.spec.js|repeated local temp auth login with confirm|
|local u/p auth|u/p|Y|Y|Y|Y|default||auth/auth_user_pwd.spec.js|repeated local temp auth login with endpoint and confirm|

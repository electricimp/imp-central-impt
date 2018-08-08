# impt tests summary table  

[Google Doc](https://docs.google.com/spreadsheets/d/1sAOkKtzRiPov6Yq6fYbqpluihLuWpczDOkmuQCYFb9c/edit?usp=sharing)


|Command group|Command name|Precondition||||||||||
|----|-----|----|-----|----|-----|----|-----|----|-----|----|-----|
||||auth|local|temp|endpoint|confirmed|output||||
|auth|login|not auth|user/pwd|||||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global auth login|
||||user/pwd||||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global auth login with confirm|
||||user/pwd|||Y||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global auth login with endpoint|
||||user/pwd|||Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global auth login with endpoint and confirm|
||||user/pwd||Y|||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global temp auth login|
||||user/pwd||Y||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global temp auth login with confirm|
||||user/pwd||Y|Y||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global temp auth login with endpoint|
||||user/pwd||Y|Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |global temp auth login with endpoint and confirm|
||||user/pwd|Y||||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local auth login|
||||user/pwd|Y|||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local auth login with confirm|
||||user/pwd|Y||Y||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local auth login with endpoint|
||||user/pwd|Y||Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local auth login with endpoint and confirm|
||||user/pwd|Y|Y|||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local temp auth login|
||||user/pwd|Y|Y||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local temp auth login with confirm|
||||user/pwd|Y|Y|Y||default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local temp auth login with endpoint|
||||user/pwd|Y|Y|Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |local temp auth login with endpoint and confirm|
|||global auth|user/pwd||||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated global auth login with confirm|
||||user/pwd|||Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated global auth login with endpoint and confirm|
||||user/pwd||Y||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated global temp auth login with confirm|
||||user/pwd||Y|Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated global temp auth login with endpoint and confirm|
|||local auth|user/pwd|Y|||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated local auth login with confirm|
||||user/pwd|Y||Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated local auth login with endpoint and confirm|
||||user/pwd|Y|Y||Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated local temp auth login with confirm|
||||user/pwd|Y|Y|Y|Y|default|[_auth_user_pwd.spec.js](/auth/_auth_user_pwd.spec.js) |repeated local temp auth login with endpoint and confirm|
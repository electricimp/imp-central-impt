# impt Test Summary Table #

## List of main non-covered features ##

- Production 
- Collaboration
- Pre-factory, pre-production, factory and production device group types
- Log stream positive tests
- Interactive user input tests
- Indetified by build sha tests
- Impt test command tests

## List of Tested Commands ##

**[impt auth info](#auth-info)**<br>
**[impt auth login](#auth-login)**<br>
**[impt auth logout](#auth-logout)**<br>

**[impt build cleanup](#build-cleanup)**<br>
**[impt build copy](#build-copy)**<br>
**[impt build delete](#build-delete)**<br>
**[impt build deploy](#build-deploy)**<br>
**[impt build get](#build-get)**<br>
**[impt build info](#build-info)**<br>
**[impt build list](#build-list)**<br>
**[impt build run](#build-run)**<br>
**[impt build update](#build-update)**<br>

**[impt device assign](#device-assign)**<br>
**[impt device info](#device-info)**<br>
**[impt device list](#device-list)**<br>
**[impt device remove](#device-remove)**<br>
**[impt device restart](#device-restart)**<br>
**[impt device unassign](#device-unassign)**<br>
**[impt device update](#device-update)**<br>

**[impt dg builds](#device-group-builds)**<br>
**[impt dg create](#device-group-create)**<br>
**[impt dg delete](#device-group-delete)**<br>
**[impt dg info](#device-group-info)**<br>
**[impt dg list](#device-group-list)**<br>
**[impt dg reassign](#device-group-reassign)**<br>
**[impt dg restart](#device-group-restart)**<br>
**[impt dg unassign](#device-group-unassign)**<br>
**[impt dg update](#device-group-update)**<br>

**[impt log get](#log-get)**<br>
**[impt log stream](#log-stream)**<br>

**[impt loginkey create](#login-key-create)**<br>
**[impt loginkey delete](#login-key-delete)**<br>
**[impt loginkey info](#login-key-info)**<br>
**[impt loginkey list](#login-key-list)**<br>
**[impt loginkey update](#login-key-update)**<br>

**[impt product create](#product-create)**<br>
**[impt product delete](#product-delete)**<br>
**[impt product info](#product-info)**<br>
**[impt product list](#product-list)**<br>
**[impt product update](#product-update)**<br>

**[impt project create](#project-create)**<br>
**[impt project delete](#project-delete)**<br>
**[impt project info](#project-info)**<br>
**[impt project link](#project-link)**<br>
**[impt project update](#project-update)**<br>

**[impt webhook create](#webhook-create)**<br>
**[impt webhook delete](#webhook-delete)**<br>
**[impt webhook info](#webhook-info)**<br>
**[impt webhook list](#webhook-list)**<br>
**[impt webhook update](#webhook-update)**<br>

## Impt auth command group ##

## auth info ##

<table>
<sub>
<tr align="center">
<th height="30" colspan="4"><sub>Precondition</sub></th>
<th colspan="2"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>auth</sub></th>
<th><sub>env</sub></th>
<th><sub>temp</sub></th>
<th><sub>endpoint</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth file path env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH<br>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth file path with loginkey env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH<br>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth file path with user env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth loginkey env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY<br>IMPT_ENDPOINT</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth loginkey with endpoint env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY<br>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth loginkey with user env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER<br>IMPT_PASSWORD</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth user pass env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER<br>IMPT_PASSWORD<br>IMPT_ENDPOINT</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth user pass with endpoint env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth user without password env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>auth info without login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>check global auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>check temp global auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>check global auth info with endpoint login</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth file path env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth loginkey env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth user pass env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_PASSWORD</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth pass env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>check global loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>check temp global loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>check global loginkey auth info with endpoint login</sub></td></tr>
<tr align="center" ><td height="30"><sub>local lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>check local loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>check local auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth file path env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth loginkey env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>auth/auth_environment.spec.js:<br>Auth user env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>auth info without output value</sub></td></tr>
</table>

## auth login ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="7"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr> 
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>auth</sub></th>
<th><sub>local</sub></th>
<th><sub>temp</sub></th>
<th><sub>endpoint</sub></th>
<th><sub>confirmed</sub></th>
 <th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth//auth_user_pwd.spec.js>auth//auth_user_pwd.spec.js:<br>global login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global temp login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global temp login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local temp login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local temp login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>_login without output argument_</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>_login without endpoint argument_</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p w/o value </sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>_login without user/password_</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>global loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>global temp loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>global loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>local temp loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>local loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>global temp loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>global loginkey login without loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated global temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated global temp loginkey login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated global loginkey login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated local temp loginkey login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>auth/auth_loginkey.spec.js:<br>repeated local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>repeated local temp login with endpoint and confirm</sub></td></tr>
</table>

## auth logout ##

<table>
<sub>
<tr align="center">
<th height="30" colspan="3"><sub>Precondition</sub></th>
<th colspan="3"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>auth</sub></th>
<th><sub>temp</sub></th>
<th><sub>endpoint</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global logout without login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>help/help.spec.js:<br>local logout without login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>auth/auth_user_pwd.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global logout</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local logout with global login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global logout with temp login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global logout with endpoint login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>local logout</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>global logout with local login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>:<br>global logout without output value</sub></td></tr>
</table>

## Impt build command group ##

## build cleanup ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>product</sub></th>
<th><sub>unflag</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub>zombie builds<br>exist for<br>product</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_cleanup.spec.js>build/build_cleanup.spec.js:<br>build cleanup by product id</sub></td></tr>
<tr align="center" ><td height="30"><sub>zombie builds<br>exist for<br>product</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_cleanup.spec.js>build/build_cleanup.spec.js:<br>flagged build cleanup by product name</sub></td></tr>
<tr align="center" ><td height="30"><sub>zombie builds<br>exist for<br>other product</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_cleanup.spec.js>build/build_cleanup.spec.js:<br>build cleanup</sub></td></tr>
<tr align="center" ><td height="30"><sub>zombie builds<br>exist for<br>other product</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_cleanup.spec.js>build/build_cleanup.spec.js:<br>flagged build cleanup</sub></td></tr>
<tr align="center" ><td height="30"><sub>product<br>not exist</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_cleanup.spec.js>build/build_cleanup.spec.js:<br>build cleanup by not exist product</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## build copy ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>build</sub></th>
<th><sub>dg</sub></th>
<th><sub>all</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>sha</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>tag</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>origin</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by origin</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by project</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy by not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub>dg not exist</sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_copy.spec.js>build/build_copy.spec.js:<br>build copy to not exist dg</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## build delete ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>build</sub></th>
<th><sub>force</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>build delete by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>sha</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>build delete by sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>tag</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>build delete by tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>origin</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>build delete by origin</sub></td></tr>
<tr align="center" ><td height="30"><sub>build<br>flagged </sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>flagged build delete</sub></td></tr>
<tr align="center" ><td height="30"><sub>build<br>flagged </sub></td><td><sub>id</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>flagged build force delete</sub></td></tr>
<tr align="center" ><td height="30"><sub>dg<br>min-sup-dep</sub></td><td><sub>id</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_delete.spec.js>build/build_delete.spec.js:<br>min supported build delete</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## build deploy ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="9"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>dg</sub></th>
<th><sub>device<br>file</sub></th>
<th><sub>agent<br>file</sub></th>
<th><sub>descr</sub></th>
<th><sub>origin</sub></th>
<th><sub>tag</sub></th>
<th><sub>flagged</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy by dg id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>2x</sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy by dg name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub>project</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy by project</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy by not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub>d-file<br>not exist</sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy by not exist device group</sub></td></tr>
<tr align="center" ><td height="30"><sub>a-file<br>not exist</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy with not exist device file</sub></td></tr>
<tr align="center" ><td height="30"><sub>dg not exist</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_deploy.spec.js>build/build_deploy.spec.js:<br>build deploy with not exist agent file</sub></td></tr>
</table>



## build get ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="8"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>build</sub></th>
<th><sub>device<br>file</sub></th>
<th><sub>agent<br>file</sub></th>
<th><sub>device<br>only</sub></th>
<th><sub>agent<br>only</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by build id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>sha</sub></td><td><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by build sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>tag</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by build tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>origin</sub></td><td><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by build origin</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by project</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get by not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get without device and agent file</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_get.spec.js>build/build_get.spec.js:<br>build get without agent file</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>


## build info ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="3"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>build</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>sha</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>tag</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>origin</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by origin</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by project</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>build info by not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub>build<br>not exist</sub></td><td><sub>id</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_info.spec.js>build/build_info.spec.js:<br>not exist build info</sub></td></tr>
</table>


## build list ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="12"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>owner</sub></th>
<th><sub>product</sub></th>
<th><sub>dg</sub></th>
<th><sub>dg<br>type</sub></th>
<th><sub>sha</sub></th>
<th><sub>tag</sub></th>
<th><sub>flagged</sub></th>
<th><sub>unflagged</sub></th>
<th><sub>non<br>zombie</sub></th>
<th><sub>zombie</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>me</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>development</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by owner me and dg type</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by owner id and product id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by owner name and product name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>email</sub></td><td><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by owner email and dg id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by dg name and sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by sha and tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>2x</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by several tags</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by product id and flagged</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by product id and unflagged</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by product id and zombie</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by product id and not zombie</sub></td></tr>
<tr align="center" ><td height="30"><sub>owner<br>not exist</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>*json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_list.spec.js>build/build_list.spec.js:<br>build list by not exist owner</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## build run ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="11"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>dg</sub></th>
<th><sub>device<br>file</sub></th>
<th><sub>agent<br>file</sub></th>
<th><sub>descr</sub></th>
<th><sub>origin</sub></th>
<th><sub>tag</sub></th>
<th><sub>flagged</sub></th>
<th><sub>cond<br>restart</sub></th>
<th><sub>log</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run by dg id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>2x</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run by dg name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub>project</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run by project</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run by not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub>d-file<br>not exist</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run with not exist device file</sub></td></tr>
<tr align="center" ><td height="30"><sub>a-file<br>not exist</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run with not exist agent file</sub></td></tr>
<tr align="center" ><td height="30"><sub>dg<br>not exist</sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run by not exist device group</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without dg value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without device file value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without agent file value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without description value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without origin value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_run.spec.js>build/build_run.spec.js:<br>build run without tag value</sub></td></tr>
</table>

## build update ##

<table>
<sub>
<tr align="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="7"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center">
<th height="30"><sub>build</sub></th>
<th><sub>descr</sub></th>
<th><sub>tag</sub></th>
<th><sub>remove<br>tag</sub></th>
<th><sub>flagged</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>

<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>defaut</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>sha</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update flagged by sha</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>tag</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update descr by tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>origin</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update tag by origin</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update remove tag by project</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub>3x</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update several tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>2x</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update remove several tag</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td><sub>project</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./build/build_update.spec.js>build/build_update.spec.js:<br>build update by not exist project</sub></td></tr>
</table>

## Impt device command group ##

## device assign ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>dg</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>id</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>device assign to dg by name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>mac</sub></td><td><sub>id</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>device assign to dg by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub>project</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>device assign to project</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>id</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>repeat device assign</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>project<br>not exist</sub></td><td align="left"><sub>id</sub></td><td><sub>project</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>device assign to not exist project</sub></td></tr>
<tr align="center" ><td height="30"><sub>dg<br>not exist</sub></td><td align="left"><sub>id</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_assign.spec.js>device/device_assign.spec.js:<br>device assign to not exist device group</sub></td></tr>
</table>
 
## device info ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="3"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>id</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>device info by id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>mac</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>device info by mac</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>agent id</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>device info by agent id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>device info by name</sub></td></tr>
<tr align="center" ><td height="30"><sub>unassigned<br>device</sub></td><td align="left"><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>unassigned device info</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>not exist</sub></td><td align="left"><sub>name</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>not exist device info</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>w/o value</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_info.spec.js>device/device_info.spec.js:<br>device info without device value</sub></td></tr>
</table>

## device list ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" colspan="10"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>owner</sub></th>
<th><sub>product</sub></th>
<th><sub>dg</sub></th>
<th><sub>dg-type</sub></th>
<th><sub>unassigned</sub></th>
<th><sub>assigned</sub></th>
<th><sub>offline</sub></th>
<th><sub>online</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub>me</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by owner me</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by product id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by product name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by dg id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>development</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by dg type</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by product name and dg id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub>x2</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>device list by two dg</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>assigned device list</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>unassigned device list</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>online device list</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>json</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_list.spec.js>device/device_list.spec.js:<br>offline device list</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## device remove ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>force</sub></th>
<th><sub>confirmed</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub>device<br>unassigned</sub></td><td align="left"><sub>id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>remove device by id</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>unassigned</sub></td><td align="left"><sub>mac</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>remove device by mac</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>unassigned</sub></td><td align="left"><sub>agent id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>remove device by agent id</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>unassigned</sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>remove device by name</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>id</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>force remove assigned device</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>id</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_remove.spec.js>device/device_remove.spec.js:<br>remove assigned device</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## device restart ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>conditional</sub></th>
<th><sub>log</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>id</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart device by device id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>mac</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart device by device mac</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>agent id</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart device by agent id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart device by device name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart device with log</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>not exist</sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_restart.spec.js>device/device_restart.spec.js:<br>restart not exist device</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
</table>

## device unassign ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>unbond</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>id</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>unassign device by device id</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>mac</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>unassign device by device mac</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>agent id</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>unassign device by agent id</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>unassign device by device name</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>assigned</sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>repeat unassign device</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>not exist</sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_unassign.spec.js>device/device_unassign.spec.js:<br>unassign not exist device</sub></td></tr>
</table>

## device update ##

<table>
<sub>
<tr align="center"  valign="center">
<th height="30" rowspan="2"><sub>Precondition</sub></th>
<th colspan="5"><sub>Command options</sub></th>
<th rowspan="2"><sub>Test name</sub></th>
</sub>
</tr>
<sub>
<tr align="center"  valign="center">
<th height="30"><sub>device</sub></th>
<th><sub>name</sub></th>
<th><sub>output</sub></th>
<th><sub>help</sub></th>
</sub>
</tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>id</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update by device id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>mac</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update by device mac</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>agent id</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update by agent id</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update by device name</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>help/help.spec.js:<br>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub>name</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update without new value</sub></td></tr>
<tr align="center" ><td height="30"><sub></sub></td><td align="left"><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>device update without device value</sub></td></tr>
<tr align="center" ><td height="30"><sub>device<br>not exist</sub></td><td align="left"><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./device/device_update.spec.js>device/device_update.spec.js:<br>not exist device update</sub></td></tr>
</table>

## Impt dg command group ##

## device group builds ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="7" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>unflag</sub></th><th><sub>unflag
old</sub></th><th><sub>remove</sub></th><th><sub>confirmed</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>Y</sub></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td><sub>Y</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>project</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_builds.spec.js">dg/device_group_builds.spec.js:<br>dg/device_group_builds.spec.js</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>help/help.spec.js</a></sub></td></tr>
</tbody></table>

## device group create ##

<table><tbody><tr><th colspan="1"
 rowspan="2"><sub>Precondition</sub></th><th
 colspan="7" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>name</sub></th><th><sub>dg-type</sub></th><th><sub>product</sub></th><th><sub>descr</sub></th><th><sub>target</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>Y</sub></td><td></td><td><sub>id</sub></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>device
group create by product id</a></sub></td></tr>
<tr><td></td><td><sub>Y</sub></td><td><sub>development</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>device
group create by product name</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>Y</sub></td><td></td><td><sub>project</sub></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>device
group create by project</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>Y</sub></td><td></td><td><sub>project</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>device
group create by not exist project</a></sub></td></tr>
<tr><td><sub>dg exist already</sub></td><td><sub>Y</sub></td><td></td><td><sub>name</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>create
duplicate device group</a></sub></td></tr>
<tr><td><sub>product not exist</sub></td><td><sub>Y</sub></td><td></td><td><sub>name</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_create.spec.js">dg/device_group_create.spec.js:<br>device
group create by not exist product</a></sub></td></tr>
</tbody></table>

## device group delete ## 

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="6" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>builds</sub></th><th><sub>force</sub></th><th><sub>confirmed</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group by id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group by name</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>project</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group by project</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>force
delete device group by name</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group with builds</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group by not exist project</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
not exist device group</a></sub></td></tr>
<tr><td></td><td><sub>empty</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group by empty name</a></sub></td></tr>
<tr><td></td><td><sub>w/o value</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_delete.spec.js">dg/device_group_delete.spec.js:<br>delete
device group without dg value</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## device group info ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="4" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>full</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_info.spec.js">dg/device_group_info.spec.js:<br>device
group info by id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_info.spec.js">dg/device_group_info.spec.js:<br>device
group full info by name</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>project</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_info.spec.js">dg/device_group_info.spec.js:<br>device
group full info by project</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_info.spec.js">dg/device_group_info.spec.js:<br>device
group info by not exist project</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_info.spec.js">dg/device_group_info.spec.js:<br>not
exist device group info</a></sub></td></tr>
<tr><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## device group list ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="5" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>owner</sub></th><th><sub>product</sub></th><th><sub>dg-type</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>me</sub></td><td></td><td></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by owner me</a></sub></td></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by owner id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td><sub>deployment</sub></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by owner name</a></sub></td></tr>
<tr><td></td><td><sub>email</sub></td><td></td><td><sub>deployment</sub></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by owner email</a></sub></td></tr>
<tr><td></td><td></td><td><sub>id</sub></td><td></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by product id</a></sub></td></tr>
<tr><td></td><td></td><td><sub>name</sub></td><td></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by product name</a></sub></td></tr>
<tr><td></td><td></td><td><sub>2x</sub></td><td></td><td><sub>json</sub></td><td></td><td><sub><a
 href="./dg/device_group_list.spec.js">dg/device_group_list.spec.js:<br>device
group list by several product name</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## device group reassign ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="4" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>from</sub></th><th><sub>to</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td><sub>id</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device by device group id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device by device group name</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>project</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device by project</a></sub></td></tr>
<tr><td><sub>from dg not exist</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device from not exist device group</a></sub></td></tr>
<tr><td><sub>to dg not exist</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device to not exist device group</a></sub></td></tr>
<tr><td><sub>dg without device</sub></td><td><sub>name</sub></td><td><sub>name</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
not exist device</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>name</sub></td><td><sub>project</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_reassign.spec.js">dg/device_group_reassign.spec.js:<br>reassign
device to not exist project</a></sub></td></tr>
<tr><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table> 

## device group restart ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="5" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>conditional</sub></th><th><sub>log</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device by device group id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device by device group name</a></sub></td></tr>
<tr><td></td><td><sub>project</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device by project</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device with log display</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device by not exist project</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
device by not exist device group</a></sub></td></tr>
<tr><td><sub>no devices</sub></td><td><sub>name</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_restart.spec.js">dg/device_group_restart.spec.js:<br>restart
not exist device</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table> 

## device group unassign ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="4" rowspan="1" align="center"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>unbond</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
device by device group id</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
device by device group name</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>project</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
device by project</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
device by not exist project</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
device by not exist device group</a></sub></td></tr>
<tr><td><sub>dg without device</sub></td><td><sub>name</sub></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_unassign.spec.js">dg/device_group_unassign.spec.js:<br>unassign
not exist device</a></sub></td></tr>
<tr><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## device group update ##

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="8" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2"><sub>Test name</sub></th></tr>
<tr><th><sub>dg</sub></th><th><sub>name</sub></th><th><sub>desc</sub></th><th><sub>target</sub></th><th><sub>load
code</sub></th><th><sub>min sup depl</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr><td></td><td><sub>id</sub></td><td></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_update.spec.js">dg/device_group_update.spec.js:<br>dg/device_group_update.spec.js</a></sub></td></tr>
<tr><td></td><td><sub>name</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_update.spec.js">dg/device_group_update.spec.js:<br>dg/device_group_update.spec.js</a></sub></td></tr>
<tr><td><sub>project exist</sub></td><td><sub>project</sub></td><td></td><td><sub>Y</sub></td><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_update.spec.js">dg/device_group_update.spec.js:<br>dg/device_group_update.spec.js</a></sub></td></tr>
<tr><td><sub>project not exist</sub></td><td><sub>project</sub></td><td><sub>Y</sub></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_update.spec.js">dg/device_group_update.spec.js:<br>dg/device_group_update.spec.js</a></sub></td></tr>
<tr><td><sub>dg not exist</sub></td><td><sub>name</sub></td><td><sub>Y</sub></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td></td><td><sub><a
 href="./dg/device_group_update.spec.js">dg/device_group_update.spec.js:<br>dg/device_group_update.spec.js</a></sub></td></tr>
<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>help/help.spec.js</a></sub></td></tr>
</tbody></table>

## Impt log command group ##

## log get ##

<table><tbody><tr><th colspan="1"
 rowspan="2"><sub>Precondition</sub></th><th
 colspan="5" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr><th><sub>device</sub></th><th><sub>p-size</sub></th><th><sub>p-num</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td><sub>one device in project</sub></td><td><sub>project</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td
 left="" align=""><sub><a
 href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by project</a></sub></td></tr>
<tr align="left"><td></td><td><sub>device id</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by device id</a></sub></td></tr>
<tr align="left"><td></td><td><sub>mac adr</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by device mac</a></sub></td></tr>
<tr align="left"><td></td><td><sub>agent id</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by agent id</a></sub></td></tr>
<tr align="left"><td></td><td><sub>name</sub></td><td></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by device name</a></sub></td></tr>
<tr align="left"><td></td><td><sub>device id</sub></td><td><sub>4</sub></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get with page size</a></sub></td></tr>
<tr align="left"><td></td><td><sub>device id</sub></td><td><sub>4</sub></td><td><sub>3</sub></td><td><sub>default</sub></td><td></td><td
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get with page size and number</a></sub></td></tr>
<tr align="left"><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td
 align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
<tr align="left"><th><sub>project not exist</sub></th><th><sub>project</sub></th><th></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get by not exist project</a></sub></th></tr>
<tr align="left"><th></th><th><sub>w/o value</sub></th><th></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without device value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>empty</sub></th><th></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without device value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th><sub>-4;0</sub></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get with incorrect page size value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th><sub>-3;0</sub></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get with incorrect page number value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th><sub>w/o
value</sub></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without size and num values</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th><sub>w/o
value</sub></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without size and num values</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th></th><th><sub>invalid
value</sub></th><th></th><th align="left"><sub><a
 href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without output value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th></th><th><sub>w/o
value</sub></th><th></th><th align="left"><sub><a
 href="./log/log_get.spec.js">log/log_get.spec.js:<br>log
get without output value</a></sub></th></tr>
</tbody></table> 

## log stream ## 

<table>
<tbody><tr><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th
 colspan="4" rowspan="1"><sub>Options</sub></th><th
 colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr><th><sub>device</sub></th><th><sub>dg</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td></td><td><sub>device id</sub></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td><sub>mac adr</sub></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td><sub>agent id</sub></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td><sub>name</sub></td><td></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td></td><td><sub>name</sub></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td></td><td><sub>id</sub></td><td><sub>default</sub></td><td></td><td
 align="left"><sub>planned</sub></td></tr>
<tr align="left"><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td
 align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
<tr align="left"><th><sub>project not exist</sub></th><th></th><th><sub>project</sub></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream by not exist project</a></sub></th></tr>
<tr align="left"><th></th><th><sub>w/o value</sub></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream without device value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>empty</sub></th><th></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream without device value</a></sub></th></tr>
<tr align="left"><th></th><th></th><th><sub>w/o
value</sub></th><th><sub>default</sub></th><th></th><th
 align="left"><sub><a href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream without dg value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th><sub>invalid
value</sub></th><th></th><th align="left"><sub><a
 href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream without output value</a></sub></th></tr>
<tr align="left"><th></th><th><sub>device id</sub></th><th></th><th><sub>w/o
value</sub></th><th></th><th align="left"><sub><a
 href="./log/log_stream.spec.js">log/log_stream.spec.js:<br>log
stream without output value</a></sub></th></tr>
</tbody></table>

## Impt login key command group ##

## login key create ##

<table>
<tbody><tr align="left"><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th colspan="4" rowspan="1"><sub>Options</sub></th><th colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr align="left"><th><sub>pass</sub></th><th><sub>desc</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_create.spec.js">loginkey_create.spec.js:<br>loginkey
create</a></sub></td></tr>
<tr align="left"><td></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_create.spec.js">loginkey_create.spec.js:<br>loginkey
create without description</a></sub></td></tr>
<tr align="left"><td></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_create.spec.js">loginkey_create.spec.js:<br>loginkey
create without password</a></sub></td></tr>
<tr align="left"><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## login key delete ##

 <table>
<tbody><tr align="left"><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th colspan="5" rowspan="1"><sub>Options</sub></th><th colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr align="left"><th><sub>lk</sub></th><th><sub>pass</sub></th><th><sub>confirmed</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td colspan="1" rowspan="1"></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_delete.spec.js">loginkey_delete.spec.js:<br>loginkey
delete</a></sub></td></tr>
<tr align="left"><td rowspan="1"></td><td><sub>Y</sub></td><td></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_delete.spec.js">loginkey_delete.spec.js:<br>loginkey
delete without password</a></sub></td></tr>
<tr align="left"><td></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_delete.spec.js">loginkey_delete.spec.js:<br>loginkey
delete without confirmation</a></sub></td></tr>
<tr align="left"><th><sub>lk not exist</sub></th><th><sub>Y</sub></th><th><sub>Y</sub></th><th><sub>Y</sub></th><th><sub>default</sub></th><th></th><th align="left"><sub><a href="./loginkey/loginkey_delete.spec.js">loginkey_delete.spec.js:<br>not
exist loginkey delete</a></sub></th></tr>
<tr align="left"><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## login key info ##

 <table>
<tbody><tr align="left"><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th colspan="3" rowspan="1"><sub>Options</sub></th><th colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr align="left"><th><sub>lk</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td><sub>lk id exist</sub></td><td><sub>lk
id</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_info.spec.js">loginkey_info.spec.js:<br>loginkey
info</a></sub></td></tr>
<tr align="left"><th><sub>lk id not exist</sub></th><th><sub>lk
id</sub></th><th><sub>default</sub></th><th></th><th align="left"><sub><a href="./loginkey/loginkey_info.spec.js">loginkey_info.spec.js:<br>not
exist loginkey info</a></sub></th></tr>
<tr align="left"><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## login key list ##

<table>
<tbody><tr align="left"><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th colspan="2" rowspan="1"><sub>Options</sub></th><th colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr align="left"><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr left="" align=""><td><sub>several
lk exist</sub></td><td><sub>json</sub></td><td></td><td left="" align=""><sub><a href="./loginkey/loginkey_list.spec.js">loginkey_list.spec.js:<br>loginkey
list</a></sub></td></tr>
<tr align="left"><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody><tbody></tbody></table>

## login key update ##

<table>
<tbody><tr align="left"><th colspan="1" rowspan="2"><sub>Precondition</sub></th><th colspan="5" rowspan="1"><sub>Options</sub></th><th colspan="1" rowspan="2" align="left"><sub>Test
name</sub></th></tr>
<tr align="left"><th><sub>lk</sub></th><th><sub>pass</sub></th><th><sub>desc</sub></th><th><sub>output</sub></th><th><sub>help</sub></th></tr>
<tr align="left"><td colspan="1" rowspan="1"></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td></td><td align="left"><sub><a href="./loginkey/loginkey_update.spec.js">loginkey_update.spec.js:<br>loginkey
update description</a></sub></td></tr>
<tr align="left"><td rowspan="1"></td><th><sub>Y</sub></th><th><sub>Y</sub></th><th></th><th><sub>default</sub></th><th></th><th align="left"><sub><a href="./loginkey/loginkey_update.spec.js">loginkey_update.spec.js:<br>loginkey
update without new values</a></sub></th></tr>
<tr align="left"><td></td><th><sub>Y</sub></th><th></th><th><sub>Y</sub></th><th><sub>default</sub></th><th></th><th align="left"><sub><a href="./loginkey/loginkey_update.spec.js">loginkey_update.spec.js:<br>loginkey
update description without password</a></sub></th></tr>
<tr align="left"><th><sub>lk not exist</sub></th><th><sub>Y</sub></th><th><sub>Y</sub></th><th><sub>Y</sub></th><th><sub>default</sub></th><th></th><th align="left"><sub><a href="./loginkey/loginkey_update.spec.js">loginkey_update.spec.js:<br>not
exist loginkey update</a></sub></th></tr>
<tr align="left"><td></td><td></td><td></td><td></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href="./help/help.spec.js">help/help.spec.js:<br>impt
help pages test suite</a></sub></td></tr>
</tbody></table>

## Impt product command group ##

## product create ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="4" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>name</sub></th>
      <th><sub>desc</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>descr exist</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./%22product/product_create.spec.js%22">product/product_create.spec.js:<br>
product create with duplicated description</a></sub></td>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="5"><sub>name
not exist</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without description</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without output value</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>undefined</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without output value</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>Y</sub></th>
      <th><sub>empty</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create with empty description</a></sub></th>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="2"><sub>name
exist</sub></td>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
create duplicated product</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>Y</sub></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
create duplicated product with description</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>empty</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create with empty name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create with empty name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>Y</sub></th>
      <th><sub>w/o value</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_create.spec.js">product/product_create.spec.js:<br>
product create without description value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## product delete ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="6" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>product</sub></th>
      <th><sub>build</sub></th>
      <th><sub>force</sub></th>
      <th><sub>confirmed</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="3"><sub>product
exist</sub></td>
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by name</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>id</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by id</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete without confirmation</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>empty</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by empty name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>w/o value</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by name without value</a></sub></td>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="2"><sub>product
with<br>
devicegroup</sub></td>
      <td><sub>project</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by project</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
delete product with devicegroup</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>product not exist</sub></td>
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
delete not exist product</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>project not exist</sub></td>
      <td><sub>project</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_delete.spec.js">product/product_delete.spec.js:<br>
product delete by not exist project</a></sub></td>
    </tr>
  </tbody>
</table>

## product info ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="4" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>product</sub></th>
      <th><sub>full</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="4"><sub>product
exist</sub></td>
      <td><sub>name</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info by name</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>id</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info by id</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>project</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info by project</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product full info by name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>name</sub></th>
      <th></th>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info without output value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info without product name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>empty</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info with empty product name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product info with empty product name</a></sub></th>
    </tr>
    <tr align="center">
      <td><sub>product<br>
not exist</sub></td>
      <th><sub>name</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
not exist product info</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## product list ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="3" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>owner</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>product exist</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>me</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list with owner by me</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list with owner by name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>email</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list with owner by email</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>id</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list with owner by id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>w/o value</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list without owner value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th></th>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_info.spec.js">product/product_info.spec.js:<br>
product list without output value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## product update ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="5" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>product</sub></th>
      <th><sub>name</sub></th>
      <th><sub>desc</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td colspan="1" rowspan="7"><sub>product
exist</sub></td>
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product name </a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product description </a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product name and description </a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td></td>
      <td><sub>empty</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product to empty description</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>id</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product name by id</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>project</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product name and description by project</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product without new values</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>name</sub></th>
      <th><sub>empty</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product to empty name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>name</sub></th>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product to name without value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>name</sub></th>
      <th></th>
      <th><sub>w/o value</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product to description without value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>empty</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product by empty name</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>w/o value</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product by name without value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <th><sub>name</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>w/o value</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update product without output value</a></sub></th>
    </tr>
    <tr align="center">
      <td><sub>product
not exist</sub></td>
      <th><sub>name</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th align="left"><sub><a
 href="./product/product_update.spec.js">product/product_update.spec.js:<br>
update not existing product</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody><tbody>
  </tbody>
</table>

## Impt project command group ##

## project create ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="10" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>product / create</sub></th>
      <th><sub>name</sub></th>
      <th><sub>desc</sub></th>
      <th><sub>d-file</sub></th>
      <th><sub>a-file</sub></th>
      <th><sub>pre-factory</sub></th>
      <th><sub>target/create</sub></th>
      <th><sub>confirmed</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="left">
      <td><sub>product exist</sub></td>
      <td><sub>id</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create by product id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create by product name with device file</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create by product name with agent file</a></sub></td>
    </tr>
    <tr align="center">
      <td><sub>product<br>
not exist</sub></td>
      <td><sub>name / Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create with product creating</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create with not existing product</a></sub></td>
    </tr>
    <tr align="center">
      <th></th>
      <th><sub>w/o value</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_create.spec.js">project_create.spec.js:<br>
project create without product value</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## project delete ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="6" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>entities</sub></th>
      <th><sub>files</sub></th>
      <th><sub>all</sub></th>
      <th><sub>confirmed</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>project<br>
exist</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete project</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete project with entities</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete project with files</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete project with all</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete project with entities and files</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>project<br>
not exist</sub></th>
      <th></th>
      <th></th>
      <th></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_delete.spec.js">project_delete.spec.js:<br>
delete not exist project</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## project info ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="3" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>full</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>project<br>
exist</sub></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_info.spec.js">project_info.spec.js:<br>
project info</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_info.spec.js">project_info.spec.js:<br>
project full info</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>dg not exist</sub></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_info.spec.js">project_info.spec.js:<br>
project info with not exist device group</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>project<br>
not exist</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_info.spec.js">project_info.spec.js:<br>
project info without project file</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## project link ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="6" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>dg</sub></th>
      <th><sub>d-file</sub></th>
      <th><sub>a -file</sub></th>
      <th><sub>confirmed</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>dg exist</sub></td>
      <td><sub>id</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_link.spec.js">project_link.spec.js:<br>
project link to dg by id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_link.spec.js">project_link.spec.js:<br>
project link to dg by name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## project update ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="7" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>name</sub></th>
      <th><sub>desc</sub></th>
      <th><sub>d-file</sub></th>
      <th><sub>a -file</sub></th>
      <th><sub>target</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>project<br>
exist</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./project/project_update.spec.js">project_update.spec.js:<br>
prodject update</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>dg not exist</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_update.spec.js">project_update.spec.js:<br>
project update without project file</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>project<br>
not exist</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./project/project_update.spec.js">project_update.spec.js:<br>
project update with not exist device group</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## Impt webhook command group ##

## webhook create ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="6" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>dg</sub></th>
      <th><sub>url</sub></th>
      <th><sub>event</sub></th>
      <th><sub>mime</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>dg exist</sub></td>
      <td><sub>dg id</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>deployment</sub></td>
      <td><sub>json</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_create.spec.js">wh_create.spec.js:<br>
webhook create by dg id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>name</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>deployment</sub></td>
      <td><sub>json</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_create.spec.js">wh_create.spec.js:<br>
webhook create by dg name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>project</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>deployment</sub></td>
      <td><sub>urlencoded</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_create.spec.js">wh_create.spec.js:<br>
webhook create by project</a></sub></td>
    </tr>
    <tr align="center">
      <th></th>
      <th><sub>name</sub></th>
      <th><sub>invalid url</sub></th>
      <th><sub>deployment</sub></th>
      <th><sub>urlencoded</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_create.spec.js">wh_create.spec.js:<br>
webhook create with invalid url</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>dg not exist</sub></th>
      <th><sub>name</sub></th>
      <th><sub>Y</sub></th>
      <th><sub>deployment</sub></th>
      <th><sub>json</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_create.spec.js">wh_create.spec.js:<br>
webhook create with not exist dg</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## webhook delete ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="4" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name&gt;</sub></th>
    </tr>
    <tr>
      <th><sub>wh</sub></th>
      <th><sub>confirmed</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>wh id exist</sub></td>
      <td><sub>wh id</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_delete.spec.js">wh_delete.spec.js:<br>
webhook delete</a></sub></td>
    </tr>
    <tr align="center">
      <th></th>
      <th><sub>w/o value</sub></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_delete.spec.js">wh_delete.spec.js:<br>
webhook delete without id</a></sub></th>
    </tr>
    <tr align="center">
      <th><sub>wh id not exist</sub></th>
      <th><sub>wh id</sub></th>
      <th><sub>Y</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_delete.spec.js">wh_delete.spec.js:<br>
delete not exist webhook</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## webhook info ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="3" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>wh</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>wh id exist</sub></td>
      <td><sub>wh id</sub></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_info.spec.js">wh_info.spec.js:<br>
webhook info</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>wh id not exist</sub></th>
      <th><sub>wh id</sub></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_info.spec.js">wh_info.spec.js:<br>
not exist webhook info</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## webhook list ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="8" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>owner</sub></th>
      <th><sub>product</sub></th>
      <th><sub>dg</sub></th>
      <th><sub>dg-type</sub></th>
      <th><sub>url</sub></th>
      <th><sub>event</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>several wh id<br>
exists with<br>
different dg</sub></td>
      <td><sub>me</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by owner</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>id</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by product id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by product name</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td><sub>id</sub></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by dg id</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td><sub>name</sub></td>
      <td></td>
      <td></td>
      <td><sub>Y</sub></td>
      <td><sub>deployment</sub></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by product name url and event</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>x2</sub></td>
      <td></td>
      <td><sub>json</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_list.spec.js">wh_list.spec.js:<br>
webhook list by several url</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>

## webhook update ##

<table>
  <tbody>
    <tr>
      <th colspan="1" rowspan="2"><sub>Precondition</sub></th>
      <th colspan="5" rowspan="1"><sub>Options</sub></th>
      <th colspan="1" rowspan="2"><sub>Test
name</sub></th>
    </tr>
    <tr>
      <th><sub>wh</sub></th>
      <th><sub>url</sub></th>
      <th><sub>mime</sub></th>
      <th><sub>output</sub></th>
      <th><sub>help</sub></th>
    </tr>
    <tr align="center">
      <td><sub>wh id exist</sub></td>
      <td><sub>wh id</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>Y</sub></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_update.spec.js">wh_update.spec.js:<br>
webhook update url and mime</a></sub></td>
    </tr>
    <tr align="center">
      <td></td>
      <td><sub>wh id</sub></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td></td>
      <td align="left"><sub><a
 href="./wh_update.spec.js">wh_update.spec.js:<br>
webhook update without url and mime</a></sub></td>
    </tr>
    <tr align="center">
      <th><sub>wh id not exist</sub></th>
      <th><sub>wh id</sub></th>
      <th><sub>Y</sub></th>
      <th></th>
      <th><sub>default</sub></th>
      <th></th>
      <th style="text-align: left;"><sub><a
 href="./wh_update.spec.js">wh_update.spec.js:<br>
update not exist webhook</a></sub></th>
    </tr>
    <tr align="center">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td><sub>default</sub></td>
      <td><sub>Y</sub></td>
      <td align="left"><sub><a
 href="./help/help.spec.js">help/help.spec.js:<br>
impt help pages test suite</a></sub></td>
    </tr>
  </tbody>
</table>


# impt Test Summary Table #

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

**[impt test create](#test-create)**<br>
**[impt test delete](#test-delete)**<br>
**[impt test github](#test-github)**<br>
**[impt test info](#test-info)**<br>
**[impt test run](#test-run)**<br>
**[impt test update](#test-update)**<br>

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
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>login without output argument</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>login without endpoint argument</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p w/o value </sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth/auth_user_pwd.spec.js:<br>login without user/password</sub></td></tr>
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

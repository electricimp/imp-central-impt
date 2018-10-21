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
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth file path env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH<br>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth file path with loginkey env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH<br>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth file path with user env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth loginkey env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY<br>IMPT_ENDPOINT</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth loginkey with endpoint env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_LOGINKEY<br>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth loginkey with user env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER<br>IMPT_PASSWORD</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth user pass env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER<br>IMPT_PASSWORD<br>IMPT_ENDPOINT</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth user pass with endpoint env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth user without password env info</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth info without login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>check global auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>check temp global auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>check global auth info with endpoint login</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth file path env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth loginkey env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth user pass env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td align="left"><sub>IMPT_PASSWORD</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth pass env and global auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>check global loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>check temp global loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>check global loginkey auth info with endpoint login</sub></td></tr>
<tr align="center" ><td height="30"><sub>local lk auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>check local loginkey auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>check local auth info </sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_AUTH_FILE_PATH</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth file path env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_LOGINKEY</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth loginkey env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub>IMPT_USER</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_environment.spec.js>Auth user env and local auth info</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td align="left"><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>auth info without output value</sub></td></tr>
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
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth//auth_user_pwd.spec.js>global login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global temp login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global temp login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local temp login</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local temp login with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>login without output argument</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>login without endpoint argument</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>u/p w/o value </sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>login without user/password</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>global loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>global temp loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>global loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>local temp loginkey login by loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>local loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>global temp loginkey login by loginkey with endpoint</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub>lk w/o value</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>global loginkey login without loginkey</sub></td></tr>
<tr align="center" ><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>impt help pages test suite</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated global temp login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated global temp loginkey login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated global loginkey login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global u/p auth</sub></td><td><sub>lk</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated local temp loginkey login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated global login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated global login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated global temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>global lk auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_loginkey.spec.js>repeated local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated local login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated local login with endpoint and confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated local temp login with confirm</sub></td></tr>
<tr align="center" ><td height="30"><sub>local u/p auth</sub></td><td><sub>u/p</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>repeated local temp login with endpoint and confirm</sub></td></tr>
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

<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout without login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local logout without login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>not auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub>Y</sub></td><td align="left"><sub><a href=./help/help.spec.js>impt help pages test suite</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local logout with global login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout with temp login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>global u/p auth</sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout with endpoint login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>Y</sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>local logout</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>default</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout with local login</sub></td></tr>
<tr align="center" valign="center"><td height="30"><sub>local u/p auth</sub></td><td><sub></sub></td><td><sub></sub></td><td><sub></sub></td><td><sub>w/o value</sub></td><td><sub></sub></td><td align="left"><sub><a href=./auth/auth_user_pwd.spec.js>global logout without output value</sub></td></tr>
</table>


  
  

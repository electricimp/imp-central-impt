# impt tests summary table  

[Google Doc](https://docs.google.com/spreadsheets/d/1sAOkKtzRiPov6Yq6fYbqpluihLuWpczDOkmuQCYFb9c/edit?usp=sharing)

<sub>
<table>
<tr>
<th>Precondition</th>
<th>auth</th>
<th>local</th>
<th>temp</th>
<th>endpoint</th>
<th>confirmed</th>
 <th>output</th>
<th>?</th>
<th>Test file</th>
<th>Test name</th>
</tr>
<tr><td>not auth</td><td>u/p</td><td colspan="4"><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global auth login</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global auth login with confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td></td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global auth login with endpoint</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global auth login with endpoint and confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td>Y</td><td></td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global temp auth login</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global temp auth login with confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td>Y</td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global temp auth login with endpoint</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>global temp auth login with endpoint and confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td></td><td></td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local auth login</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local auth login with confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td></td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local auth login with endpoint</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local auth login with endpoint and confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td>Y</td><td></td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local temp auth login</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local temp auth login with confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td>Y</td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local temp auth login with endpoint</td></tr>
<tr><td>not auth</td><td>u/p</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>local temp auth login with endpoint and confirm</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td></td><td></td><td></td><td>w/o arg</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>login without output argument</td></tr>
<tr><td>not auth</td><td>u/p</td><td></td><td></td><td>w/o value</td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>login without endpoint argument</td></tr>
<tr><td>not auth</td><td>u/p w/o value </td><td></td><td></td><td></td><td></td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>login without user/password</td></tr>
<tr><td>not auth</td><td>lk</td><td></td><td></td><td></td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>global auth loginkey login by loginkey</td></tr>
<tr><td>not auth</td><td>lk</td><td></td><td>Y</td><td></td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>global temp loginkey auth login by loginkey</td></tr>
<tr><td>not auth</td><td>lk</td><td></td><td></td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>global auth loginkey login by loginkey with endpoint</td></tr>
<tr><td>not auth</td><td>lk</td><td>Y</td><td>Y</td><td></td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>local temp loginkey auth login by loginkey</td></tr>
<tr><td>not auth</td><td>lk</td><td>Y</td><td></td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>local loginkey auth login by loginkey with endpoint</td></tr>
<tr><td>not auth</td><td>lk</td><td></td><td>Y</td><td>Y</td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>global temp loginkey auth login by loginkey with endpoint</td></tr>
<tr><td>not auth</td><td>lk w/o arg </td><td></td><td></td><td></td><td></td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>global loginkey auth login without loginkey</td></tr>
<tr><td>global u/p auth</td><td>u/p</td><td></td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated global auth login with confirm</td></tr>
<tr><td>global u/p auth</td><td>u/p</td><td></td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated global auth login with endpoint and confirm</td></tr>
<tr><td>global u/p auth</td><td>u/p</td><td></td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated global temp auth login with confirm</td></tr>
<tr><td>global u/p auth</td><td>u/p</td><td></td><td>Y</td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated global temp auth login with endpoint and confirm</td></tr>
<tr><td>global u/p auth</td><td>lk</td><td></td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated global temp loginkey auth login with confirm</td></tr>
<tr><td>global u/p auth</td><td>lk</td><td></td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated global auth loginkey login with endpoint and confirm</td></tr>
<tr><td>global u/p auth</td><td>lk</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated local temp loginkey auth login with confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td></td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated global auth login with confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td></td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated global auth login with endpoint and confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td></td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated global temp auth login with confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td>Y</td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated local auth login with confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated local auth login with endpoint and confirm</td></tr>
<tr><td>global lk auth</td><td>u/p</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_loginkey.spec.js</td><td>repeated local temp auth login with confirm</td></tr>
<tr><td>local u/p auth</td><td>u/p</td><td>Y</td><td></td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated local auth login with confirm</td></tr>
<tr><td>local u/p auth</td><td>u/p</td><td>Y</td><td></td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated local auth login with endpoint and confirm</td></tr>
<tr><td>local u/p auth</td><td>u/p</td><td>Y</td><td>Y</td><td></td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated local temp auth login with confirm</td></tr>
<tr><td>local u/p auth</td><td>u/p</td><td>Y</td><td>Y</td><td>Y</td><td>Y</td><td>default</td><td></td><td>auth/auth_user_pwd.spec.js</td><td>repeated local temp auth login with endpoint and confirm</td></tr>
</sub>

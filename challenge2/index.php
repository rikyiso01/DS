<?php

if (isset($_POST["username"])) {
    $username = trim($_POST["username"]);
    $password = trim($_POST["password"]);
    $connection = mysqli_connect("challenge2-db", "test", "test", "test");
    $result = mysqli_query($connection, "select * from users where username = '$username' and password = '$password'");
    echo (mysqli_num_rows($result) > 0) ? "Logged in: flag{0x4b986c55ea9496ccf30b437bb4577e5c6003049f4ce399061f52e074e97b5b92}" : "Wrong credentials";
}

?>


<form method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username">
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password">
    </div>
    <input type="submit">
</form>

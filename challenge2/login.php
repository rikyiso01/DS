<?php

if (isset($_POST['username'])) {
    $db=getenv("DB");
    $connection = new SQLite3($db);
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);
    $result = $connection->query("select * from users where username = '$username' and password = '$password'");
    $flag = getenv('FLAG');
    for ( $nrows = 0; is_array($result->fetchArray()); ++$nrows );
    echo ($nrows > 0) ? "Logged in: $flag" : 'Wrong credentials';
}

?>

<a href="login-source.php">source</a>

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

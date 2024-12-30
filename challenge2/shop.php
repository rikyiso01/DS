<?php

session_start();

if (!isset($_SESSION['money'])) {
    $_SESSION['money'] = 999;
}

$PRICES = [0 => 100, 1 => 1000];
$NAMES = [0 => 'Cute cat', 1 => 'Nuclear code'];

if (isset($_POST['id']) && isset($_POST['quantity'])) {
    $id = $_POST['id'];
    $quant = $_POST['quantity'];
    $price = $PRICES[$id] * $quant;
    if ($_SESSION['money'] >= $price) {
        $_SESSION['money'] -= $price;
        for ($i = 0; $i < $quant; ++$i) {
            if ('Nuclear code' === $NAMES[$id]) {
                $flag=getenv("FLAG2");
                echo "<script>alert('$flag');</script>";
            }
            echo "<script>alert('You bought a {$NAMES[$id]}');</script>";
        }
    } else {
        echo "<script>alert('You don\'t have enough money');</script>";
    }
}

?>

<a href="shop-source.php">source</a>

<h1>Buy something</h1>

<p>Your credit is <?php echo $_SESSION['money']; ?> $ </p>

<div>
    <h2>Cute cat 🐱</h2>
    <p>Price: 100$</p>
    <form method="post">
        <input type="hidden" name="id" value="0">
        <select name="quantity">
            <option>1</option>
            <option>2</option>
            <option>3</option>
        </select>
        <input type="submit">
    </form>
</div>

<div>
    <h2>Nuclear launch code ☢️</h2>
    <p>Price: 1000$</p>
    <form method="post">
        <input type="hidden" name="id" value="1">
        <select name="quantity">
            <option>1</option>
            <option>2</option>
            <option>3</option>
        </select>
        <input type="submit">
    </form>
</div>

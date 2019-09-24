<?php 
$file = pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME);
?>

<header>
    <a href="http://www.byui.edu"><img src="/assignment/Week02/byui-logo.jpg" class="byui-logo"></a>
    <div class="div-header">
        <a href="/assignment/Week02/home.php" <?php if ($file === "home") echo 'active' ?> class="a-header"><label>Home</label></a>
        <a href="/assignment/Week02/assignment.php" <?php if ($file === "assignment") echo 'active' ?> class="a-header"><label>Assignment</label></a>
        <span id='time'> 
            <?php
            date_default_timezone_set("America/Denver");
            echo "Mountain Time " . date("l, m-d-Y"); 
            ?>
        </span>
    </div>
    <hr>
    <script src="home.js"></script>
</header>
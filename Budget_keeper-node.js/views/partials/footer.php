<?php 
$file = pathinfo($_SERVER['PHP_SELF'], PATHINFO_FILENAME);
?>

<footer>
    <hr>
    <div class="div-footer">
        <p>Contact:</p>
        <p>
            <span><a href="https://www.facebook.com/adrian.yim.00"><img src="/assignment/Week02/facebook-logo.png" class="img-footer"></a></span>
            
            <span><a href="https://www.linkedin.com/in/adrian-yim/"><img src="/assignment/Week02/linkedin-logo.png" class="img-footer"></a></span>
        </p>
        <p>© <?php echo date("Y");?></p>
    </div>
</footer>
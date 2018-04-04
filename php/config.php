<?php
	$db_host = "localhost";
	$db_name = "address_book";
	$username = "root";
	$password = "";
	$link = mysqli_connect($db_host, $username, $password, $db_name) or die ("cannot connect");

	if (!$link) {
	    die("ERROR: " . mysqli_error($link));
	}
?>
<?php
include('config.php');
mysqli_query($link, "SET NAMES utf8");

// Verify if user exists for login
if( isset($_POST['email']) && isset($_POST['password']) && isset($_POST['nickname']) ){

$email = $_POST['email'];
$psw = $_POST['password'];
$nickname = $_POST['nickname'];

$sql = "SELECT * FROM USERS WHERE email='". $email . "'" or die ("ERROR: ".mysqli_error());
$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
$getUser_RecordCount = mysqli_num_rows($result);

if ($getUser_RecordCount > 0) {
	die('Пользователь с таким email уже существует.');
} else {
	$add_sql = "INSERT INTO USERS (avatar,nickname,email,password,contacts) VALUES ('','" .$nickname . "','" . $email . "','" . $psw . "','[]')" or die ("ERROR: ".mysqli_error());

	$add_result = mysqli_query($link, $add_sql) or die (mysqli_error($link));

	echo 'success';
}
} else {
	echo 'Some field is undefined!';
}

mysqli_close($link);
?>
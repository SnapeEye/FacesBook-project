<?php
include('config.php');
mysqli_query($link, "SET NAMES utf8");

// Verify if user exists for login
if(isset($_GET['email']) && isset($_GET['password'])){

$email = $_GET['email'];
$psw = $_GET['password'];

$sql = "SELECT * FROM USERS WHERE email='". $email . "' AND password = '" . $psw . "'" or die ("ERROR: ".mysqli_error());
$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
$getUser_result =  mysqli_fetch_assoc($result);
$getUser_RecordCount = mysqli_num_rows($result);

if($getUser_RecordCount < 1){
	die('Пользователь с такими данными не найден.');
} else {
	$id = $getUser_result['id'];
	$avatar = $getUser_result['avatar'];
	$nickname = $getUser_result['nickname'];
	$contacts = $getUser_result['contacts'];
    $obj = (object) [ "id" => $id, "avatar" => $avatar, "nickname" => $nickname, "contacts" => $contacts ];

    header("Access-Control-Allow-Origin: *");
    $jsonObj = json_encode($obj, JSON_FORCE_OBJECT);
	echo $jsonObj;
}
}

mysqli_close($link);
?>
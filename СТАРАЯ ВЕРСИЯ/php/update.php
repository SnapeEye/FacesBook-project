<?php
include('config.php');
mysqli_query($link, "SET NAMES utf8");

if(isset($_POST['id']) && isset($_POST['contacts']) && isset($_POST['avatar'])){

$id = $_POST['id'];
$contacts = $_POST['contacts'];
$avatar = $_POST['avatar'];

$sql = "UPDATE USERS SET contacts='" . $contacts . "', avatar='" . $avatar . "' WHERE id='". $id . "'";

if (mysqli_query($link, $sql)){
	//echo 'Recieved data: id:' . $id . ', contacts:' . $contacts . ', avatar:' . $avatar;
	echo "Data has been saved successfully!";
} else {
	die (mysqli_error($link));
}
}

mysqli_close($link);
?>
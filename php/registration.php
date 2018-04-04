<?php
	include('config.php');
	mysqli_query($link, "SET NAMES utf8");

	if( isset($_POST['args']) ) {
		$args = json_decode($_POST['args'], true);
		if ( !isset($args['key']) || strlen($args['key']) !== 32 ) {
			die('Key value is not set or invalid!');
		}
		if ( !isset($args['fio']) || !isset($args['email']) || !isset($args['password']) ) {
			die('Some value is undefined');
		}

		$sql = "SELECT association FROM CodeTable WHERE regKey='". $args['key'] . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$sqlObj =  mysqli_fetch_assoc($result);
		$regData = json_decode($sqlObj['association'], true);
		if ( !isset($regData['company']) || !isset($regData['category']) ) {
			die('Server data is harmed! Contact administrator for more info.');
		}

		$sql = "SELECT id FROM CategoriesTable WHERE name='". $regData['company'] . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$sqlObj =  mysqli_fetch_assoc($result);
		$categoriesId = $sqlObj['id'];

		$sql = "SELECT id FROM UsersTable WHERE email='". $args['email'] . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$getUser_RecordCount = mysqli_num_rows($result);

		if ($getUser_RecordCount > 0) {
			die('The email is already linked to an account.');
		} else {
			$sql = "INSERT INTO UsersTable (fio,email,password,category,categoriesId) VALUES ('" . $args['fio'] . "','" . $args['email'] . "','" . md5($args['password']) . "','" . $regData['category'] . "','" . $categoriesId . "')" or die ("ERROR: ".mysqli_error());
			mysqli_query($link, $sql) or die (mysqli_error($link));
			echo 'success';
		}
	} else {
		echo 'No args recieved!';
	}

	mysqli_close($link);
?>
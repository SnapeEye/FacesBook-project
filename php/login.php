<?php
	include('config.php');
	mysqli_query($link, "SET NAMES utf8");

	if( isset($_GET['args']) ) {
		$args = json_decode($_GET['args'], true);
		if ( !isset($args['email']) || !isset($args['password']) ) {
			die('Some value is undefined');
		}

		$sql = "SELECT id,fio FROM UsersTable WHERE email='". $args['email'] . "' AND password='" . md5($args['password']) . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$result_counter = mysqli_num_rows($result);
		if($result_counter < 1) {
			die('Email or password is incorrect! Validate your data and try again.');
		}

		$resultData =  mysqli_fetch_assoc($result);
		$retObj = (object)  [ 	"id" => $resultData['id'],
		    					"fio" => $resultData['fio'],
		   					];

		header("Access-Control-Allow-Origin: *");
		$jsonObj = json_encode($retObj, JSON_FORCE_OBJECT);
		echo $jsonObj;
	} else {
		die('No args recieved!');
	}

	mysqli_close($link);
?>
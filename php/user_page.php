<?php
	include('config.php');
	mysqli_query($link, "SET NAMES utf8");

	if( isset($_GET['args']) ) {
		$args = json_decode($_GET['args'], true);
		if ( !isset($args['id']) ) {
			die('Some value is undefined!');
		}

		$sql = "SELECT fio,category,contactData FROM UsersTable WHERE id='". $args['id'] . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$resultData =  mysqli_fetch_assoc($result);
		$result_counter = mysqli_num_rows($result);

		if($result_counter < 1) {
			die('No data found! Please, contact administrator.');
		}

		if (strlen($resultData['contactData']) > 0) {
			$contactData = json_decode($resultData['contactData'], true);
		} else {
			$contactData['number'] = '';
			$contactData['description'] = '';
		}
		if ( !isset($contactData['description']) || !isset($contactData['number']) ) {
			die("User's contact data is harmed. Please, contact administrator.");
		}

		$retObj = (object)  [	"fio" => $resultData['fio'],
		    					"category" => $resultData['category'],
		    					"description" => $contactData['description'],
		    					"number" => $contactData['number'],
		   					];

		header("Access-Control-Allow-Origin: *");
		$jsonObj = json_encode($retObj, JSON_FORCE_OBJECT);
		echo $jsonObj;
	} else {
		die('No args recieved!');
	}

	mysqli_close($link);
?>
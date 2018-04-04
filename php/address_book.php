<?php
	include('config.php');
	mysqli_query($link, "SET NAMES utf8");

	if( isset($_GET['args']) ) {
		$args = json_decode($_GET['args'], true);
		if ( !isset($args['id']) ) {
			die('Some value is undefined');
		}

		$sql = "SELECT categoriesId FROM UsersTable WHERE id='". $args['id'] . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$result_counter = mysqli_num_rows($result);
		if($result_counter < 1) {
			die('Loss of data (UT)! Please, contact administrator.');
		}
		$categoriesIdData =  mysqli_fetch_assoc($result);
		$categoriesId = $categoriesIdData['categoriesId'];

		$sql = "SELECT categories FROM CategoriesTable WHERE id='". $categoriesId . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$result_counter = mysqli_num_rows($result);
		if($result_counter < 1) {
			die('Loss of data (CT)! Please, contact administrator.');
		}
		$categoriesData =  mysqli_fetch_assoc($result);
		$categories = $categoriesData['categories'];

		$sql = "SELECT fio,category,contactData FROM UsersTable WHERE categoriesId='". $categoriesId . "'" or die ("ERROR: ".mysqli_error());
		$result  = mysqli_query($link, $sql) or die (mysqli_error($link));
		$result_counter = mysqli_num_rows($result);
		$company_contacts = [];

		for ($i = 0; $i < $result_counter; $i++) { 
			$currentUserData =  mysqli_fetch_assoc($result);
			$contactData = json_decode($currentUserData['contactData'], true);
			$currentUser = (object)	[
										'fio' => $currentUserData['fio'],
										'category' => $currentUserData['category'],
										'number' => $contactData['number'],
										'description' => $contactData['description'],
									];
			array_push($company_contacts, $currentUser);
		}

		$retObj = (object)  [ 	'categories' => $categories,
								'company_contacts' => $company_contacts,
		   					];
		header("Access-Control-Allow-Origin: *");
		$jsonObj = json_encode($retObj, JSON_UNESCAPED_UNICODE);
		echo $jsonObj;
	} else {
		die('No args recieved!');
	}

	mysqli_close($link);
?>
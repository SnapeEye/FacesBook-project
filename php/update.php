<?php
	include('config.php');
	mysqli_query($link, "SET NAMES utf8");

	if( isset($_POST['args']) ) {
		$args = json_decode($_POST['args'], true);
		if ( !isset($args['fio']) || !isset($args['contactData']) || !isset($args['id']) ) {
			die('Some argument is undefined.');
		}

		$sql = "UPDATE UsersTable SET contactData='" . $args['contactData'] . "', fio='" . $args['fio'] . "' WHERE id='". $args['id'] . "'";
		if (mysqli_query($link, $sql)){
			echo "Data has been saved successfully!";
		} else {
			die (mysqli_error($link));
		}
	} else {
		die('No args recieved!');
	}

	mysqli_close($link);
?>
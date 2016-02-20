<?php	
	$email = $_POST["email"];
	$password = $_POST["password"];
	$verifyPassword = $_POST["verifyPassword"];
	
	$result = array();
	if ($email == "jakeonaut@gmail.com"){
		$result = array(
			'success' => false
		);
	}else{
		$result = array(
			'success' => ($password == $verifyPassword);
		);
	}
	echo json_encode($result);
?>
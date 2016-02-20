<?php	
	$email = $_POST["email"];
	$password = $_POST["password"];
	
	$result = array();
	if (($email == "jakeonaut@gmail.com" || $email == "annamoyer@gmail.com") && $password == "password"){
		$result = array(
			'success' => true
		);
	}else{
		$result = array(
			'success' => false
		);
	}
	echo json_encode($result);
?>
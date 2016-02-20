<!--Idea here is to give a new ID that is unique to their recipes-->
<!--I did not implement that and just returning 1 since just is just a placeholder-->
<?php	
	$email = $_POST["email"];
	$password = $_POST["password"];
	
	$result = array();
	if ($email == "jakeonaut@gmail.com" && $password == "password"){
		$result = array(
			'success' => true,
			'recipe_id' => 1
		);
	}else{
		$result = array(
			'success' => false,
			'recipe_id' => 1
		);
	}
	echo json_encode($result);
?>
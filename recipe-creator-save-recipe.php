<?php

$email = $_POST["email"];
$password = $_POST["password"];
$recipeID = $_POST["recipeID"];
$recipeTitle = $_POST["recipeTitle"];
$recipeHTML = $_POST["recipeHTML"];
$recipeDateTime = $_POST["recipeDateTime"];

$result = array(
	'success' => true
);
if (!true){
	$result = array(
		'success' => false
	);
}
echo json_encode($result);

?>
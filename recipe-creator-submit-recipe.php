<?php
$difficulty = $_POST["difficulty"];
$category = $_POST["category"];
$subCategory = $_POST["subCategory"];
$creator = $_POST["creator"];

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
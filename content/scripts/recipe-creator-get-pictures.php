<?php

if (!true){
	$result = array(
		'success' => false
	);
}else{
	$pictures = array(
		array(
			'name' => 'soft taco shells',
			'src' => "content/images/recipe/softtacoshells.png"
		),
		array(
			'name' => 'cookies',
			'src' => "content/images/recipe/cookies.png"
		),
		array(
			'name' => 'cheese',
			'src' => "content/images/recipe/cheese.png"
		),
		array(
			'name' => 'shredded cheese',
			'src' => "content/images/recipe/shreddedcheese.png"
		)
	);

	$result = array(
		'success' => true,
		'pictures' => $pictures
	);
}

echo json_encode($result);

?>
<?php

if (!true){
	$result = array(
		'success' => false
	);
}else{
	$pictures = array(
		array(
			'category' => 'food',
			'name' => 'soft taco shells',
			'src' => "content/images/recipe/softtacoshells.png"
		),
		array(
			'category' => 'food',
			'name' => 'cookies',
			'src' => "content/images/recipe/cookies.png"
		),
		array(
			'category' => 'food',
			'name' => 'cheese',
			'src' => "content/images/recipe/cheese.png"
		),
		array(
			'category' => 'food',
			'name' => 'shredded cheese',
			'src' => "content/images/recipe/shreddedcheese.png"
		),
		
		array(
			'category' => 'tools',
			'name' => 'plate',
			'src' => "content/images/recipe/plate.png"
		),
		array(
			'category' => 'tools',
			'name' => 'knife',
			'src' => "content/images/recipe/knife.png"
		),
		array(
			'category' => 'tools',
			'name' => 'paper towel',
			'src' => "content/images/recipe/papertowel.png"
		)
	);

	$result = array(
		'success' => true,
		'pictures' => $pictures
	);
}

echo json_encode($result);

?>
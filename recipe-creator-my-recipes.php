<?php
$email = $_POST["email"];

if (!true){
	$result = array(
		'success' => false
	);
}else{
	$recipes = array(
		array(
			'title' => 'Cheese Quesadilla',
			'data' => "<div class='recipe_page' id='recipe_page_0'><div class='creatable_section_outer big_section_header outer_color_red' id='section_0'><div class='creatable_section_middle middle_color_red'><div class='creatable_title_inner' contenteditable='true'>Cheese Quesadilla</div><div class='creatable_title_pict'><div class='editable_image' style='left: 0px; top: 0px;'><img src='content/images/recipe/cheese.png'></div></div></div></div><div class='creatable_section_container' id='section_1_container'><div class='creatable_section_outer small_section_header outer_color_blue' id='section_1'><div class='creatable_section_middle middle_color_blue'><div class='creatable_section_inner' contenteditable='true'>you will need:</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div><div class='creatable_section_container' id='section_2_container'><div class='creatable_section_outer small_section_header outer_color_green' id='section_2'><div class='creatable_section_middle middle_color_green'><div class='creatable_section_inner' contenteditable='true'>tools:</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div><div class='creatable_section_outer big_section_header outer_color_red' id='section_3'><div class='creatable_section_middle middle_color_red'><div class='creatable_title_inner' contenteditable='true'>steps</div><div class='creatable_title_pict'></div></div></div></div><div class='recipe_page' id='recipe_page_1'><div class='creatable_section_container' id='section_4_container'><div class='creatable_section_outer small_section_header small_section_number outer_color_red outer_color_white' id='section_4'><div class='creatable_section_middle middle_color_red middle_color_white'><div class='creatable_section_inner'>1</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div></div>",
			'datetime' => "27/12/2014 18:37 PM"
		),
		array(
			'title' => 'Cookies',
			'data' => "<div class='recipe_page' id='recipe_page_0'><div class='creatable_section_outer big_section_header outer_color_red' id='section_0'><div class='creatable_section_middle middle_color_red'><div class='creatable_title_inner' contenteditable='true'>Chocolate Cookies</div><div class='creatable_title_pict'><div class='editable_image' style='left: 0px; top: 0px;'><img src='content/images/recipe/cookies.png'></div></div></div></div><div class='creatable_section_container' id='section_1_container'><div class='creatable_section_outer small_section_header outer_color_blue' id='section_1'><div class='creatable_section_middle middle_color_blue'><div class='creatable_section_inner' contenteditable='true'>you will need:</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div><div class='creatable_section_container' id='section_2_container'><div class='creatable_section_outer small_section_header outer_color_green' id='section_2'><div class='creatable_section_middle middle_color_green'><div class='creatable_section_inner' contenteditable='true'>tools:</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div><div class='creatable_section_outer big_section_header outer_color_red' id='section_3'><div class='creatable_section_middle middle_color_red'><div class='creatable_title_inner' contenteditable='true'>steps</div><div class='creatable_title_pict'></div></div></div></div><div class='recipe_page' id='recipe_page_1'><div class='creatable_section_container' id='section_4_container'><div class='creatable_section_outer small_section_header small_section_number outer_color_red outer_color_white' id='section_4'><div class='creatable_section_middle middle_color_red middle_color_white'><div class='creatable_section_inner'>1</div></div></div><div class='creatable_clearer' style='margin-left: 154px;'></div></div></div>",
			'datetime' => "27/12/2014 18:37 PM"
		)
	);

	$result = array(
		'success' => true,
		'recipes' => $recipes
	);
}

echo json_encode($result);

?>
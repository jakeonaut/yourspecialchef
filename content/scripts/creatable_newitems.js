Creatable.insertPageBreakBefore = function(element){
	var breaker = document.createElement('div');
	breaker.className = "recipe_page_break";
	$(element).before($(breaker));

	var page = $(breaker).parent();
	var page_height = Creatable.height(page) + Creatable.offset(page).top;
	var boffset = Creatable.offset($(breaker)).top;
	var bheight = page_height - boffset;

	Creatable.setHeight($(breaker), bheight);
	Creatable.UpdatePages();
	Creatable.UpdateImageDragDropEvents();
}

Creatable.ResizePageBreak = function(breaker){
	var page = $(breaker).parent();
	var page_height = Creatable.height(page) + Creatable.offset(page).top;
	var boffset = Creatable.offset($(breaker)).top;
	var bheight = page_height - boffset;

	Creatable.setHeight($(breaker), bheight);
}

Creatable.NewPage = function(){
	var page = document.createElement('div');
	page.className = "recipe_page";
	page.id = "recipe_page_"+Creatable.CountPages();
	return page;
}

function CreateNewTitle(color, text, is_small){
	var outer_section = document.createElement('div');
	outer_section.className = "creatable_section_outer big_section_header";
	outer_section.className += " " + "outer_color_" + color;
	outer_section.id = "new_title";

	var middle_section = document.createElement('div');
	middle_section.className = "creatable_section_middle";
	middle_section.className += " " + "middle_color_" + color;

	var inner_section = document.createElement('div');
	inner_section.className = "creatable_title_inner";
	inner_section.contentEditable = true;
	inner_section.innerHTML = text;

	var pict_section = document.createElement('div');
	pict_section.className = "creatable_title_pict"

	var image = document.createElement('div');
	image.className = "editable_image";
	$(image).css("left", "0px");
	$(image).css("top", "0px");
	var img = document.createElement('img');
	img.src = "content/images/recipe/cheese.png";
	image.appendChild(img);

	if (is_small){
		outer_section.style.width = "144px";
		outer_section.style.height = "72px";
		outer_section.style.fontSize = "24px";
		outer_section.style.lineHeight = "24px";
		inner_section.style.width = "100px";
		inner_section.style.paddingLeft = "8px";
		inner_section.style.marginTop = "10px";
		inner_section.style.marginBottom = "10px";
		pict_section.style.width = "54px";
		pict_section.style.height = "54px";
		pict_section.style.right = "2px";
		pict_section.style.top = "0px";
	}
	pict_section.appendChild(image);
	middle_section.appendChild(inner_section);
	middle_section.appendChild(pict_section);
	outer_section.appendChild(middle_section);

	return outer_section;
}

function CreateNewSectionContainer(section){
	var container = document.createElement('div');
	container.className = "creatable_section_container";
	container.id = section.id+"_container";
	container.appendChild(section);

	var clear = document.createElement('div');
	clear.className = "creatable_clearer";
	container.appendChild(clear);
	return container;
}

function CreateNewSection(color, text, is_small){
	var outer_section = document.createElement('div');
	outer_section.className = "creatable_section_outer small_section_header";
	outer_section.className += " " + "outer_color_" + color;
	outer_section.id = "new_small_section";

	var middle_section = document.createElement('div');
	middle_section.className = "creatable_section_middle";
	middle_section.className += " " + "middle_color_" + color;

	var inner_section = document.createElement('div');
	inner_section.className = "creatable_section_inner";
	inner_section.contentEditable = true;
	inner_section.innerHTML = text;

	middle_section.appendChild(inner_section);
	outer_section.appendChild(middle_section);
	if (is_small){
		outer_section.style.width = "96px";
		outer_section.style.height = "96px";
		outer_section.style.fontSize = "20px";
		outer_section.style.lineHeight = "20px";
		inner_section.style.marginTop = "10px";
		inner_section.style.marginBottom = "10px";
	}
	return outer_section;
}

function CreateNewSectionNumber(color, text, is_small){
	var outer_section = document.createElement('div');
	outer_section.className = "creatable_section_outer small_section_header small_section_number";
	outer_section.className += " outer_color_" + color + " outer_color_white";
	outer_section.id = "new_small_number";

	var middle_section = document.createElement('div');
	middle_section.className = "creatable_section_middle";
	middle_section.className += " middle_color_" + color + " middle_color_white";

	var inner_section = document.createElement('div');
	inner_section.className = "creatable_section_inner";
	//inner_section.contentEditable = true;
	inner_section.innerHTML = text;

	middle_section.appendChild(inner_section);
	outer_section.appendChild(middle_section);

	if (is_small){
		outer_section.style.width = "33px";
		outer_section.style.height = "96px";
		outer_section.style.fontSize = "32px";
		outer_section.style.lineHeight = "32px";
		inner_section.style.marginTop = "10px";
		inner_section.style.marginBottom = "10px";
	}
	return outer_section;
}

function CreateNewItem(color, text, is_small){
	var outer_section = document.createElement('div');
	outer_section.className = "creatable_item_outer";
	outer_section.className += " " + "outer_color_" + color;
	outer_section.id = "new_item";

	var middle_section = document.createElement('div');
	middle_section.className = "creatable_item_middle";
	middle_section.className += " " + "middle_color_" + color;

	var image_container = document.createElement("div");
	image_container.className = "creatable_item_pict_inner";

	var image = document.createElement('div');
	image.className = "editable_image";
	$(image).css("left", "0px");
	$(image).css("top", "0px");
	/*var img = document.createElement('img');
	img.src = "content/images/recipe/shreddedcheese.png";
	image.appendChild(img);*/

	var inner_text = document.createElement('div');
	inner_text.className = "creatable_item_text_inner";
	inner_text.contentEditable = true;
	inner_text.innerHTML = text;

	if (is_small){
		image.style.width = "70px";
		image.style.height = "70px";
		image_container.style.width = "70px";
		image_container.style.height = "70px";

		inner_text.style.minHeight = "23px";

		outer_section.style.width = "80px";
		outer_section.style.height = "96px";
		outer_section.style.fontSize = "16px";
		outer_section.style.lineHeight = "16px";
	}

	image_container.appendChild(image);
	middle_section.appendChild(image_container);
	middle_section.appendChild(inner_text);
	outer_section.appendChild(middle_section);
	return outer_section;
}

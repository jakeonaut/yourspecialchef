Creatable.DragItemOntoPage = function(item, page, x, y){
	var sections = $(".creatable_section_container, .big_section_header").not("[id^=new]");
	var lowest_y = 0; 
	var lowest_section = null;
	if (sections.length > 0){
		lowest_y = Creatable.offset(sections[0]).top + Creatable.height(sections[0]);
		lowest_section = sections[0];
		for (var i = 1; i < sections.length; i++){
			var new_y = Creatable.offset(sections[i]).top + Creatable.height(sections[i]);
			/*if (new_y > y){
				break;
			}*/
			
			if (new_y > lowest_y){
				lowest_y = new_y;
				lowest_section = sections[i];
			}
		}
	}
	var num_children = 0;
	if (lowest_section !== null){
		num_children = $(lowest_section).children().length;
		if ($(item).parents(lowest_section).length > 0)
			num_children--;
	}
	if (page !== null && y > lowest_y && (lowest_section === null || num_children >= 3 || $(lowest_section).hasClass("big_section_header"))){
		if (Creatable.dragObj !== null) Creatable.dragObj.is_new = false;
		//Let's create that new section row and append a number to it...?
		var count = CreatableCountSections();
		var number_num = 1;

		var color = "red";
		var section = CreateNewSectionNumber(color, number_num, false);
		section.id = "section_" + count;
		//Wait, if the lowest section is a normal section, let's just make a new one of those instead
		if (!$($(lowest_section).children()[0]).hasClass("small_section_number") /*|| /*$($(lowest_section).hasClass("big_section_header"))*/){
			color = Creatable.RandomColor();
			section = CreateNewSection(color, "section "+count, false);
			section.id = "section_" + count;
		}
		
		element = document.createElement('div');
		element.className = "creatable_section_container";
		element.className += " " + "creatable_try_to_delete";
		element.id = "section_" + count + "_container";
		element.appendChild(section);
		element.appendChild(item);
		var clear = document.createElement('div');
		clear.className = "creatable_clearer";
		element.appendChild(clear);
		if (lowest_section === null){
			page.appendChild(element);
		}else{
			$(lowest_section).after(element);
		}
		
		Creatable.ChangeSectionColor(element, color);
		return true;
	}
	return false;
}

Creatable.TryToDelete = function(){
	//IF the newly created section ends with no children, delete it because the user didn't try to drag anything to it and it's now useless
	var deletable = $(".creatable_try_to_delete");
	if (deletable.length <= 0) return;
	
	if (deletable.children().length - 2 < 1){
		var selected = $(".selected_element");
		Creatable.SelectElement(deletable);
		Creatable.deleteElem();
		
		Creatable.SelectElement(selected);
	}else{
		deletable.removeClass("creatable_try_to_delete");
	}
}

Creatable.RenumberNumbers = function(){
	var section_containers = $(".creatable_section_container");
	var sections = [];
	for (var i = 0; i < section_containers.length; i++){
		if ($($(section_containers[i]).children()[0]).not("[id^=new]") !== [])
			sections.push($(section_containers[i]).children()[0]);
	}
	
	var on_numbers = false;
	var count = 0;
	for (var i = 0; i < sections.length; i++){
		if ($(sections[i]).hasClass("small_section_number")){
			if (on_numbers){
				count++;
				$($($(sections[i]).children()[0]).children()[0]).html(count.toString());
			}else{
				$($($(sections[i]).children()[0]).children()[0]).html("1");
				on_numbers = true;
				count = 1;
			}
		}else{
			on_numbers = false;
		}
	}
}

/********************MOUSE EVENT UTILS*********************/
Creatable.Within = function(x, y, e){
	e = $(e);
	for (var i = 0; i < e.length; i++){
		var left = Creatable.offset(e[i]).left;
		var top = Creatable.offset(e[i]).top;
		if (left < x && left + Creatable.width(e[i]) > x &&
			top < y && top + Creatable.height(e[i]) > y){
				return true;
		}
	}
	return false;
}

Creatable.WithinIgnoreZoom = function(x, y, e){
	e = $(e);
	for (var i = 0; i < e.length; i++){
		if ($(e[i]).offset().left < x && $(e[i]).offset().left + $(e[i]).width() > x &&
			$(e[i]).offset().top < y && $(e[i]).offset().top + $(e[i]).height() > y){
			return true;
		}
	}
	return false;
}

Creatable.FindElement = function(x, y, elems, ignore, search_new){
	if (search_new === undefined) search_new = true;
	for (var i = 0; i < elems.length; i++){
		var e = elems[i];
		if (!search_new && (e.id === "new_item" || e.id === "new_small_section" || e.id === "new_title"))
			continue;
		if (e === ignore) continue;
		if (Creatable.Within(x, y, e)){
			return e;
		}
	}
	return null;
}

Creatable.FindElementIgnoreZoom = function(x, y, elems, ignore, search_new){
	if (search_new === undefined) search_new = true;
	for (var i = 0; i < elems.length; i++){
		var e = elems[i];
		if (!search_new && (e.id === "new_item" || e.id === "new_small_section" || e.id === "new_title"))
			continue;
		if (e === ignore) continue;
		if (Creatable.WithinIgnoreZoom(x, y, e)){
			return e;
		}
	}
	return null;
}

//TRASH CAN MAINTENANCE
Creatable.UpdateTrash = function(e){
	var x = e.pageX;
	var y = e.pageY;
	
	//Look for the trashcan (this needs to be modified a bit
	var trash = Creatable.FindElementIgnoreZoom(x, y, $("#trashcan"));
	if (trash !== null){
		Creatable.ActivateTrash();
	}else{ 
		Creatable.DeactivateTrash();
	}
}

Creatable.ActivateTrash = function(){
	$("#trashlid")[0].style.marginTop = "-10px";
	$("#trashlid")[0].style.marginBottom = "10px";
	is_trash_active = true;
}

Creatable.DeactivateTrash = function(){
	$("#trashlid")[0].removeAttribute("style"); 
	is_trash_active = false;
}

//**********************IMAGE DRAG AND DROP************************/
//UPDATE TITLES AND ITEMS FOR CORRECT DRAG DROP EVENTS

/**********************OFFSET AND WIDTH FIXES FOR ZOOM BUG****************/
Creatable.zoomBugTestDiv = function(){
	var test = $("#zoom_test_div");
	var test_offset = test.offset().left;
	if (test[0].style.zoom !== undefined){
		test[0].style.zoom = Creatable.zoom_amount + "%";
	}
	else {
		test[0].style.oTransform  = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
		test[0].style.mozTransform = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
	}
	return test;
}

Creatable.offset = function(element){
	var test = Creatable.zoomBugTestDiv();
	if (~~(Creatable.zoom_amount) === 100 || ~~(test.offset().left) === 100){
		return $(element).offset();
	}
	
	var offset = {left: $(element).offset().left * (Creatable.zoom_amount / 100.0),
			top: $(element).offset().top * (Creatable.zoom_amount / 100.0)};
	return offset;
}

Creatable.offsetLeft = function(element, value){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) !== 100 && ~~(test.offset().left) !== 100){
		value = value * (100.0 / Creatable.zoom_amount);
	}
	$(element)[0].style.left = value;
}

Creatable.offsetTop = function(element, value){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) !== 100 && ~~(test.offset().left) !== 100){
		value = value * (100.0 / Creatable.zoom_amount);
	}
	$(element)[0].style.top = value;
}

Creatable.width = function(element){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) === 100 || ~~(test.width()) !== 100){
		return $(element).width();
	}
	
	return $(element).width() * (Creatable.zoom_amount / 100.0);
}

Creatable.setWidth = function(element, value){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) === 100 || ~~(test.width()) !== 100){
		$(element).width(value);
	}
	else{
		$(element).width(value * (100.5 / Creatable.zoom_amount));
	}
}

Creatable.height = function(element){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) === 100 || ~~(test.height()) !== 100){
		return $(element).height();
	}
	
	return $(element).height() * (Creatable.zoom_amount / 100.0);
}

Creatable.setHeight = function(element, value){
	var test = Creatable.zoomBugTestDiv();
	
	if (~~(Creatable.zoom_amount) === 100 || ~~(test.height()) !== 100){
		$(element).height(value);
	}
	else{
		$(element).height(value * (100.5 / Creatable.zoom_amount));
	}
}
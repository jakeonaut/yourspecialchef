var is_trash_active = false;
Creatable.dragImg = "";
Creatable.click_element_audio = new Audio('content/click.mp3');
Creatable.delete_element_audio = new Audio('content/delete.mp3');
Creatable.play_sounds = true;
Creatable.play = function(audio){
	if (Creatable.play_sounds){
		audio.play();
	}
}

//http://stackoverflow.com/questions/1418050/string-strip-for-javascript
if(typeof(String.prototype.trim) === "undefined"){
    String.prototype.trim = function(){
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function Creatable(){};
//GETTERS
Creatable.getState = function(){ return Creatable.states[Creatable.state_index]; };
Creatable.getTitle = function(){
	var titles = $(".big_section_header");
	if (titles.length === 1) return "My Recipe";
	else return $(titles.children().children()[1]).text().trim();
};
Creatable.getDateTime = function(){
	//http://jsfiddle.net/yahavbr/dVz7y/
	function AddZero(num) {
		return (num >= 0 && num < 10) ? "0" + num : num + "";
	}

	var now = new Date();
    var strDateTime = [[AddZero(now.getDate()), AddZero(now.getMonth() + 1), now.getFullYear()].join("/"), [AddZero(now.getHours()), AddZero(now.getMinutes())].join(":"), now.getHours() >= 12 ? "PM" : "AM"].join(" ");
    return strDateTime;
};

//SAVING AND LOADING SORT OF
Creatable.MyRecipes = [];
Creatable.LoadRecipe = function(index){
	var current = (" "+$("#creatable").html()+" ").replace(/\s{2,}/g, ' ').replace(/></g,'> <');
	if (YourSpecialChef.Recipe !== null && Creatable.states.length >= 1 && current !== YourSpecialChef.Recipe.data){
		$("#confirm_dialog").css("display", "block");
		$("#confirm_dialog_title").html("Load Recipe?");
		$("#confirm_dialog_body").html("You have unsaved changes on your current recipe.<br/>Loading a recipe will forget these changes.");
		$("#confirm_dialog_button").unbind('click').on('click', function(e){
			Creatable.ActuallyLoadRecipe(index);
			CloseDialogs(null);
		});
		$("#cropper_grey_out").css("display", "block");
		Creatable.resize();
	}else{
		Creatable.ActuallyLoadRecipe(index);
	}
};

Creatable.ActuallyLoadRecipe = function(index){
	var json = Creatable.MyRecipes[index];
	$("#creatable").html(json.data);
	Creatable.saveState();
}

Creatable.KeyDown = function(e){
	var active = $(document.activeElement);
	var prevent = false;
	if (!active.is(".creatable_section_inner") &&
		!active.is(".creatable_item_text_inner") &&
		!active.is(".creatable_item_pict_inner"))
			prevent = true;

	//CTRL + Z
	if (e.keyCode === 90 && e.ctrlKey){
		if (prevent) e.preventDefault();
		Creatable.undo();
	}
	//CTRL + Y
	else if (e.keyCode === 89 && e.ctrlKey){
		if (prevent) e.preventDefault();
		Creatable.redo();
	}

	//CTRL + C
	if (e.keyCode === 67 && e.ctrlKey){
		if (prevent) e.preventDefault();
		Creatable.copy();
	}
	//CTRL + V
	else if (e.keyCode === 86 && e.ctrlKey){
		if (prevent) e.preventDefault();
		Creatable.paste();
	}
	//CTRL + X
	else if (e.keyCode === 88 && e.ctrlKey){
		if (prevent) e.preventDefault();
		Creatable.cut();
	}

	//CTRL + R
	if (e.keyCode === 82 && e.ctrlKey){
		e.preventDefault();
		Creatable.ChangeColor('red');
	}
	//CTRL + G
	else if (e.keyCode === 71 && e.ctrlKey){
		e.preventDefault();
		Creatable.ChangeColor('green');
	}
	//CTRL + B
	else if (e.keyCode === 66 && e.ctrlKey){
		e.preventDefault();
		Creatable.ChangeColor('blue');
	}

	//DELETE
	if (e.keyCode === 46){
		if (prevent) e.preventDefault();
		Creatable.deleteElem();
	}

	//ENTER
	if (e.keyCode === 13){
		if (prevent) e.preventDefault();
		if ($(".selected_element").length > 1)
			Creatable.insertPageBreakBefore($(".selected_element"));
	}
};

/************************COPY/PASTE FUNCTIONALITY***********************************/
Creatable.clipboard = null;
Creatable.clipboardSelf = null;
Creatable.SelectElement = function(element){
	$(".selected_element").removeClass("selected_element");
	if (element === null || $(element) === []) return;

	element = $(element)[0];

	//If it's a section head
	if (element.className.indexOf("creatable_section_outer") >= 0 && element.className.indexOf("big_section_header") < 0){
		element.parentNode.className += " selected_element";
		Creatable.clipboardSelf = element.parentNode;
	}else{
		element.className += " selected_element";
		if (Creatable.clipboard !== null && Creatable.clipboard !== undefined && (Creatable.clipboard.className.indexOf("creatable_item_outer") < 0 || element.className.indexOf("creatable_item_outer") >= 0))
			Creatable.clipboardSelf = element;
	}
}

Creatable.DeselectElements = function(){
	Creatable.SelectElement(null);
}

Creatable.copy = function(){
	if (Creatable.imageEditMode){
		if ($(".editable_image_selected").length === 0) return;
		Creatable.CopyImageEditableSelected();
	}else{
		if ($(".selected_element").length === 0) return;
		Creatable.clipboard = $(".selected_element")[0].cloneNode(true);
		Creatable.clipboardSelf = $(".selected_element")[0];
		$(Creatable.clipboard).removeClass("selected_element");
		Creatable.clipboard.removeAttribute("style");
	}
}

Creatable.paste = function(){
	if (Creatable.imageEditMode){
		if (Creatable.copiedImage === null) return;
		Creatable.PasteImageEditable();
	}else{
		if (Creatable.clipboard === null) return;
		var new_elem = Creatable.clipboard.cloneNode(true);
		var self = Creatable.clipboardSelf;

		//IF IT'S A section
		if (new_elem.className.indexOf("creatable_section_outer") >= 0){
			new_elem.id = "section_" + CreatableCountSections();
		}
		//IF IT'S AN ITEM
		else if (new_elem.className.indexOf("creatable_item_outer") >= 0){
			new_elem.id = "item_" + CreatableCountItems();
		}
		//IF IT'S A CONTAINER
		if (new_elem.className.indexOf("creatable_section_container") >= 0){
			for (var i = 0; i < $(new_elem).children().length; i++){
				var e = $(new_elem).children()[i];
				if (e.className.indexOf("creatable_section_outer") >= 0){
					e.id = "section_" + CreatableCountSections();
				}
				//IF IT'S AN ITEM
				else if (e.className.indexOf("creatable_item_outer") >= 0){
					e.id = "item_" + CreatableCountItems();
				}
			}
			new_elem.id = $(new_elem).children()[0].id + "_container";
		}

		if (new_elem.className.indexOf("creatable_item_outer") >= 0 && self.className.indexOf("creatable_section_container") >= 0){
			console.log("!");
			if ($(self).children().length > 0){
				$(new_elem).insertBefore($($(self).children()[$(self).children().length-1]));
			}else{
				$(self).append(new_elem);
			}
		}else{
			if ($(self).length > 0){
				$(new_elem).insertAfter($(self));
			}
			else{
				console.log($($(".recipe_page")[0]));
				$($(".recipe_page")[0]).append(new_elem);
			}
		}

		Creatable.UpdateItemRows();
		Creatable.SelectElement(new_elem);
		Creatable.saveState();
	}
}

Creatable.cut = function(){
	if (Creatable.imageEditMode){
		Creatable.CopyImageEditableSelected();
		Creatable.DeleteImageEditableSelected();
	}else{
		Creatable.copy();
		if ($(".selected_element").length === 0) return;

		Creatable.PartiallyUpdatePages(true);
		var scroll = Creatable.pageScroll;
		Creatable.deleteElem();
		Creatable.UpdatePages(false);
		Creatable.UpdateImageDragDropEvents();
		Creatable.pageScroll = scroll;
		$("#creatable_container").scrollTop(Creatable.pageScroll);
	}
}

Creatable.deleteElem = function(){
	if (Creatable.imageEditMode){
		Creatable.DeleteImageEditableSelected();
	}else{
		if ($(".selected_element").length === 0){
			return;
		}
		var selected = $(".selected_element");
		if (selected.hasClass("creatable_item_outer") && selected.prev().length >= 1 && !selected.prev().hasClass("creatable_item_outer") && selected.next().length >= 1 && $(selected.next()[0]).hasClass("creatable_item_outer")){
			Creatable.SelectElement(selected.next()[0]);
		}
		else if (selected.prev().length >= 1){
			Creatable.SelectElement(selected.prev()[0]);
		}else Creatable.clipboardSelf = [];
		selected.remove();
		Creatable.UpdateItemRows();
		Creatable.saveState();

		Creatable.play(Creatable.delete_element_audio);
	}
}

/**********************************UNDO/REDO FUNCTIONALITY***********************************************/
Creatable.states = [];
Creatable.state_limit = 10;
Creatable.state_index = -1;
Creatable.should_save = false;

Creatable.saveState = function(){
	Creatable.UpdatePages();
	Creatable.UpdateImageDragDropEvents();

	//If we haven't changed anything, don't try to save!
	var current = (" "+$("#creatable").html()+" ").replace(/\s{2,}/g, ' ').replace(/></g,'> <');
	var old = Creatable.states[Creatable.state_index];
	if (Creatable.states.length >= 1 && current === old){
		return;
	}

	//Reset it so we forget all the "REDOs" after we change something
	Creatable.states = Creatable.states.slice(0, Creatable.state_index+1);

	//If we have reached the max number of state saves...
	if (Creatable.states.length >= Creatable.state_limit){
		//We need to forget a previous state!!!
		var start = Creatable.states.length-Creatable.state_limit;
		Creatable.states = Creatable.states.slice(start, Creatable.states.length);
		Creatable.state_index = Creatable.states.length-1;
	}

	Creatable.states.push(current);
	Creatable.state_index++;
	Creatable.should_save = false;

    YourSpecialChef.SaveLastRecipe();
};
Creatable.restoreState = function(index){
	$("#creatable").html(Creatable.states[index]);
	Creatable.state_index = index;

    YourSpecialChef.SaveLastRecipe();
};

Creatable.undo = function(){
	if (Creatable.state_index <= 0) return;

	Creatable.restoreState(Creatable.state_index-1);
	if (Creatable.state_index <= 0 && ($("#undo").css("background-color") === "#43A536" || $("#undo").css("background-color") === "rgb(67, 165, 54)")){
		$("#undo").css("background-color","#cccccc");
		$("#undo").css("cursor", "default");
	}
	Creatable.UpdateImageDragDropEvents();

	Creatable.DisableImageEditables();
};

Creatable.redo = function(){
	if (Creatable.state_index >= Creatable.states.length-1) return

	Creatable.restoreState(Creatable.state_index+1);

	if (Creatable.state_index >= Creatable.states.length-1 && ($("#redo").css("background-color") === "#43A536" || $("#redo").css("background-color") === "rgb(67, 165, 54)")){
		$("#redo").css("background-color","#cccccc");
		$("#redo").css("cursor", "default");
	}
	Creatable.UpdateImageDragDropEvents();

	Creatable.DisableImageEditables();
};

//ZOOM FUNCTIONS
Creatable.zoom_amount = 100.0;
Creatable.zoom_level = 2;
Creatable.zoomIn = function(){
	Creatable.zoom(1);
	if (Creatable.zoom_level >= 4){
		$("#zoom_in").css("background-color", "#cccccc");
		$("#zoom_in").css("cursor", "default");
	}
};

Creatable.zoomOut = function(){
	Creatable.zoom(-1);
	if (Creatable.zoom_level <= 0){
		$("#zoom_out").css("background-color", "#cccccc");
		$("#zoom_out").css("cursor", "default");
	}
};

Creatable.zoom = function(change){
	Creatable.zoom_level += change;
	Creatable.setZoomAmount();

	var creatable = $("#creatable")[0];
	if (creatable.style.zoom !== undefined)
		creatable.style.zoom = Creatable.zoom_amount + "%";
	else {
		creatable.style.oTransform = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
		creatable.style.mozTransform = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
	}
};

Creatable.setZoomAmount = function(){
	if (Creatable.zoom_level > 4) Creatable.zoom_level = 4;
	if (Creatable.zoom_level < 0) Creatable.zoom_level = 0;

	switch (Creatable.zoom_level){
		case 0:
			Creatable.zoom_amount = 50.00;
			break;
		case 1:
			Creatable.zoom_amount = 75.00;
			break;
		case 2:
			Creatable.zoom_amount = 100.0;
			break;
		case 3:
			Creatable.zoom_amount = 150.0;
			break;
		case 4:
			Creatable.zoom_amount = 200.0;
			break;
	}
};

//CHANGE COLOR
Creatable.ChangeSectionColor = function(item, color){
	var selected = $(".selected_element");
	selected.removeClass("selected_element");

	$(item).addClass("selected_element");
	Creatable.ChangeColor(color);

	$(item).removeClass("selected_element");
	$(selected).addClass("selected_element");
}

Creatable.ChangeColor = function(color){
	var recur = function(item, color){
		var classes = item.className.split(' ');
		for (var i = 0; i < classes.length; i++){
			if (classes[i].indexOf("outer_color") >= 0){
				if (classes[i].indexOf("white") >= 0)
					classes[i] = "outer_color_"+color+" outer_color_white"
				else classes[i] = "outer_color_"+color;
			}
			if (classes[i].indexOf("middle_color") >= 0){
				if (classes[i].indexOf("white") >= 0)
					classes[i] = "middle_color_"+color+" middle_color_white"
				else classes[i] = "middle_color_"+color;
			}
		}
		classes = classes.join(' ');
		item.className = classes;

		//Recursively!!!
		var children = $(item).children();
		for (var i = 0; i < children.length; i++){
			recur(children[i], color);
		}
	}
	var items = $(".selected_element");
	for (var i = 0; i < items.length; i++){
		recur(items[i], color);
	}

	Creatable.saveState();
}

Creatable.ChangeToColor = function(section_container, item){
	var section = $(section_container).children()[0];
	var colors = ["red", "green", "blue"];
	for (var i = 0; i < colors.length; i++){
		if (section.className.indexOf(colors[i]) > 0){
			var selected = $(".selected_element");
			selected.removeClass("selected_element");
			Creatable.SelectElement(item);
			Creatable.ChangeColor(colors[i]);
			$(item).removeClass("selected_element");
			selected.addClass("selected_element");
		}
	}
}

Creatable.copiedImage = null;
Creatable.copiedImageParent = null;

Creatable.CopyImageEditableSelected = function(){
	var color = "#ff00ff";
	var element = $(".editable_image_selected");
	Creatable.DestroyImageEditable(element, color);

	Creatable.copiedImage = $(element).clone();

	Creatable.CreateImageEditable(element, color);
	$(element).mousedown();
}

Creatable.PasteImageEditable = function(){
	var color = "#ff00ff";

	if (Creatable.copiedImage === null) return;
	if ($(".image_selected_element").length <= 0) return;

	var newImage = $(Creatable.copiedImage).clone();
	Creatable.CreateImageEditable(newImage, color, $(Creatable.copiedImageParent).parent().parent());
	$(Creatable.copiedImageParent).append(newImage);
}

Creatable.DeleteImageEditableSelected = function(){
	$(".editable_image_selected").remove();
}

Creatable.SetImageEditable = function(element, value, color, color2){
	if (value === undefined) value = true;
	if (color === undefined){
		color = "#ff00ff";
	}
	if (color2 === undefined){
		color2 = "#00ffff";
	}
	$(element).css("outline-color", color2);

	if (value){
		try{
			$(element).removeClass("selected_element");
		}catch(err){}
		$(element).addClass("image_selected_element");
	}else{
		$(element).css("outline-color", '');
	}
	Creatable.imageEditMode = value;

	for (var i = 0; i < $(element).children().length; i++){
		Creatable.SetImageEditableRecursive($(element).children()[i], value, color);
	}
}

Creatable.SetImageEditableRecursive = function(element, value, color){
	if ($(element).hasClass("editable_image")){
		Creatable.copiedImageParent = $(element).parent();
		if (value){
			Creatable.CreateImageEditable(element, color);
		}else{
			Creatable.DestroyImageEditable(element, color);
		}
	}else{
		for (var i = 0; i < $(element).children().length; i++){
			Creatable.SetImageEditableRecursive($(element).children()[i], value, color);
		}
	}
}

Creatable.CreateImageEditable = function(element, color, parent){
	if (parent === undefined){
		parent = $(element).parent().parent().parent();
	}
	var aspect_ratio = 1 / 1;
	var max_size = 250;
	var min_size = 100;
	if (parent.attr('id').indexOf("item") >= 0){
		max_size = 125;
		min_size = 50;
	}
	var dull_color = "#cccccc";

	$(element).resizable({
		aspectRatio: aspect_ratio,
		maxHeight: max_size,
		maxWidth: max_size,
		minHeight: min_size,
		minWidth: min_size
	});
	$(element).draggable(/*{ containment: parent }*/);
	$(element).selectable();
	$(element).on('mousedown', function(ev){
		$(".editable_image").removeClass("editable_image_selected");
		$(".editable_image").css("outline-color", dull_color);
		if (ev.which === RIGHT) return;
		$(element).addClass("editable_image_selected");
		$(element).css("outline-color", color);
		$(element).parent().append($(element));
		$(element).data("should_delete", !Creatable.Within(ev.pageX, ev.pageY, $(".ui-resizable-handle")));
	});
	$(element).on('mousemove', function(ev){
		var x = ev.pageX;
		var y = ev.pageY;
		var should_delete = $(element).data('should_delete');
		if (!Creatable.Within(x, y, parent) && should_delete){
			$(element).css("cursor", "no-drop");
			//Creatable.ActivateTrash();
		}else{
			$(element).css("cursor", "move");
			//Creatable.DeactivateTrash();
		}
	});
	$(element).on('mouseup', function(ev){
		var x = ev.pageX;
		var y = ev.pageY;
		var should_delete = $(element).data("should_delete");
		if (!Creatable.Within(x, y, parent) && should_delete){
			Creatable.DeleteImageEditableSelected();
		}else{
			$(element).css("cursor", "move");
			$(element).data("should_delete", false)
		}
		//Creatable.DeactivateTrash();
	});

	$(element).css("outline-color", dull_color);
	$(element).css("outline-style", "dashed");
	$(element).css("outline-width", "2px");
}

Creatable.DestroyImageEditable = function(element, color){
	try{
		$(element).resizable('destroy');
		$(element).draggable('destroy');
		$(element).selectable('destroy');
	}catch (err){}
	$(element).css("outline-style", "");
	$(element).data("image_edit_selected", false)
	$(element).unbind('mousedown');
	$(element).removeClass("editable_image_selected");
}

Creatable.DisableImageEditables = function(){
	Creatable.imageEditMode = false;

	var editables = $(".image_selected_element");
	for (var i = 0; i < editables.length; i++){
		$(editables[i]).removeClass("image_selected_element");
		Creatable.SetImageEditable(editables[i], false);
	}
}

/***************************************************************/
Creatable.UpdateImageDragDropEvents = function(){
	//Also allow images to be dragged onto the page!!
	var pages = $(".recipe_page");
	for (var i = 0; i < pages.length; i++){
		$(pages[i]).unbind('dragover').on('dragover', function(e){
			e.preventDefault();
			e.originalEvent.dataTransfer.effectAllowed = "copy";
			e.originalEvent.dataTransfer.dropEffect = "copy";
		});
		$(pages[i]).unbind('drop').on('drop', function(e){
			var imageUrl = e.originalEvent.dataTransfer.getData('text/html');
			var name = "picture";
			var url = "";
			if($(imageUrl).children().length > 0 ){
				name = $(imageUrl).find('img').attr('name');
				url = $(imageUrl).find('img').attr('src');
			}else{
				name = $(imageUrl).attr('name');
				url = $(imageUrl).attr('src');
			}

			var x = e.originalEvent.pageX;
			var y = e.originalEvent.pageY;
			console.log(x + ", " + y);
			e.preventDefault();
			e.stopPropagation();

			var page = e.target;
			var item = CreateNewItem("red", name, false);
			item.id = "item_" + CreatableCountItems();
			var pict_container = item.children[0].children[0];

			var image = document.createElement('div');
			image.className = 'editable_image';
			$(image).css("left", "0px");
			$(image).css("top", "0px");
			$(image).css("width", "100px");
			$(image).css("height", "100px");
			var img = document.createElement('img');
			img.src = url;
			image.appendChild(img);
			pict_container.innerHTML = "";
			pict_container.appendChild(image);

			if (Creatable.DragItemOntoPage(item, page, x, y))
				Creatable.play(Creatable.click_element_audio);
		});
	}

	//ALSO allow images to be dragged onto section containers
	var section_containers = $(".creatable_section_container");
	for (var i = 0; i < section_containers.length; i++){
		$(section_containers[i]).unbind('dragover').on('dragover', function(e){
			e.preventDefault();
			e.originalEvent.dataTransfer.effectAllowed = "copy";
			e.originalEvent.dataTransfer.dropEffect = "copy";
		});

		$(section_containers[i]).unbind('drop').on('drop', function(e){
			var imageUrl = e.originalEvent.dataTransfer.getData('text/html');
			var name = "picture";
			var url = "";
			if($(imageUrl).children().length > 0 ){
				name = $(imageUrl).find('img').attr('name');
				url = $(imageUrl).find('img').attr('src');
			}else{
				name = $(imageUrl).attr('name');
				url = $(imageUrl).attr('src');
			}

			e.preventDefault();
			e.stopPropagation();

			var section_container = e.target;
			var item = CreateNewItem("red", name, false);
			item.id = "item_" + CreatableCountItems();
			var pict_container = item.children[0].children[0];

			var image = document.createElement('div');
			image.className = 'editable_image';
			$(image).css("left", "0px");
			$(image).css("top", "0px");
			$(image).css("width", "100px");
			$(image).css("height", "100px");
			var img = document.createElement('img');
			img.src = url;
			image.appendChild(img);
			pict_container.innerHTML = "";
			pict_container.appendChild(image);

			//Then append this image to the nearest section!! (or create one)
			var children = $(section_container).children();
			$(children[children.length-1]).before(item);
			Creatable.ChangeToColor(section_container, item);

			Creatable.play(Creatable.click_element_audio);
		});
	}

	var titles = $(".big_section_header");
	for (var i = 0; i < titles.length; i++){
		$(titles[i]).unbind('contextmenu').on("contextmenu", function(e){
			e.preventDefault();
		});
		$(titles[i].children[0].children[0]).unbind('dragover').on("dragover", function(e){ e.preventDefault(); });
		$(titles[i]).unbind('dragover').on("dragover", function(e){
			e.preventDefault();
			var title = e.target;
			while (title.className.indexOf("outer") < 0){
				title = title.parentNode;
			}
			var pict_container = title.children[0].children[1];
			if (pict_container.children.length >= 5){
				e.originalEvent.dataTransfer.effectAllowed = "none";
				e.originalEvent.dataTransfer.dropEffect = "none";
			}else{
				e.originalEvent.dataTransfer.effectAllowed = "copy";
				e.originalEvent.dataTransfer.dropEffect = "copy";
			}
		});
		$(titles[i]).unbind('drop').on("drop", function(e){
			//http://stackoverflow.com/questions/21143504/drag-and-drop-how-to-get-the-url-of-image-being-dropped-if-image-is-a-link-not
			var imageUrl = e.originalEvent.dataTransfer.getData('text/html');
			if($(imageUrl).children().length > 0 ){
				var url = $(imageUrl).find('img').attr('src');
			}else{
				var url = $(imageUrl).attr('src');
			}
			e.preventDefault();
			e.stopPropagation();
			var title = e.target;
			while (title.className.indexOf("outer") < 0){
				title = title.parentNode;
			}
			var pict_container = title.children[0].children[1];
			//DON'T LET DRAG IF THERE ARE ALREADY TOO MANY IMAGES
			if (pict_container.children.length >= 5) return false;

			var image = document.createElement('div');
			image.className = 'editable_image';
			$(image).css("left", "0px");
			$(image).css("top", "0px");
			$(image).css("width", "100px");
			$(image).css("height", "100px");
			var img = document.createElement('img');
			img.src = url;
			image.appendChild(img);
			pict_container.appendChild(image);

			Creatable.DisableImageEditables();
			Creatable.SetImageEditable(pict_container.parentNode.parentNode);
			return false;
		});
	}

	var sections = $(".small_section_header");
	for (var i = 0; i < sections.length; i++){
		var text = $(sections[i].children[0].children[0]);
		text.unbind('dragstart dragenter dragover').on("dragstart dragenter dragover", function(e){
			e.stopPropagation();
			e.preventDefault();
			e.originalEvent.dataTransfer.effectAllowed = "none";
			e.originalEvent.dataTransfer.dropEffect = "none";
			return false;
		});

	}

	var items = $(".creatable_item_outer");
	for (var i = 0; i < items.length; i++){
		$(items[i]).unbind('contextmenu').on("contextmenu", function(e){
			e.preventDefault();
		});
		$(items[i].children[0].children[1]).unbind('dragover').on("dragover", function(e){
			e.stopPropagation();
			e.preventDefault();
			e.originalEvent.dataTransfer.effectAllowed = "none";
			e.originalEvent.dataTransfer.dropEffect = "none";
			//return false;
		});
		$(items[i]).unbind('dragover').on("dragover", function(e){
			e.preventDefault();
			var item = e.target;
			while (item.className.indexOf("outer") < 0){
				item = item.parentNode;
			}
			var pict_container = item.children[0].children[0];
			if (pict_container.children.length >= 5){
				e.originalEvent.dataTransfer.effectAllowed = "none";
				e.originalEvent.dataTransfer.dropEffect = "none";
			}else{
				e.originalEvent.dataTransfer.effectAllowed = "copy";
				e.originalEvent.dataTransfer.dropEffect = "copy";
			}
		});
		$(items[i]).unbind('drop').on("drop", function(e){
			var imageUrl = e.originalEvent.dataTransfer.getData('text/html');
			if($(imageUrl).children().length > 0 ){
				var url = $(imageUrl).find('img').attr('src');
			}else{
				var url = $(imageUrl).attr('src');
			}

			e.preventDefault();
			e.stopPropagation();
			var item = e.target;
			while (item.className.indexOf("outer") < 0){
				item = item.parentNode;
			}
			var pict_container = item.children[0].children[0];
			//DON'T LET DRAG IF THERE ARE ALREADY TOO MANY IMAGES
			if (pict_container.children.length >= 5) return false;

			var image = document.createElement('div');
			image.className = 'editable_image';
			$(image).css("left", "0px");
			$(image).css("top", "0px");
			$(image).css("width", "100px");
			$(image).css("height", "100px");
			var img = document.createElement('img');
			img.src = url;
			$(img).removeAttr('class');
			image.appendChild(img);
			pict_container.appendChild(image);

			Creatable.DisableImageEditables();
			Creatable.SetImageEditable(pict_container.parentNode.parentNode);

			$(image).mousedown();
		});
	}
}

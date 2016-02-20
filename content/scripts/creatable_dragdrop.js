Creatable.imageEditMode = false;

/***********************************DRAG AND DROP FUNCTIONALITY**********************************************/
Creatable.dragObj = null;

Creatable.SetDraggable = function(x, y, element, is_item, is_new, ignored_zoom){
	if (is_new === undefined) is_new = false;
	var click_x = x - Creatable.offset(element).left - $("#creatable_container").scrollLeft();
	var click_y = y - Creatable.offset(element).top - $("#creatable_container").scrollTop();
	if (ignored_zoom){
		click_x = x - $(element).offset().left - $("#creatable_container").scrollLeft();
		click_y = y - $(element).offset().top - $("#creatable_container").scrollTop();
	}
	click_x += $("#creatable_container").offset().left;
	click_y += $("#creatable_container").offset().top;

	if (is_new){
		element = element.cloneNode(true);
		RemoveStyleFamilyTree(element);
		//Need to properly name the item if it is new
		if (is_item){
			element.id = "item_" + CreatableCountItems();
			var img = element.children[0].children[0].children[0];
			$(img).css("left", "0px");
			$(img).css("top", "0px");
			$(img).css("width", "100px");
			$(img).css("height", "100px");
		}
		//Or properly Set up the container structure if it is a new section head
		else if (element.id === "new_title"){
			element.id = "section_" + CreatableCountSections();
			var img = element.children[0].children[1].children[0];
			$(img).css("left", "0px");
			$(img).css("top", "0px");
		}else{
			var count = CreatableCountSections();
			var section = element.cloneNode(true);
			section.id = "section_" + count;
			element = document.createElement('div');
			element.className = "creatable_section_container";
			element.id = "section_" + count + "_container";
			element.appendChild(section);
			var clear = document.createElement('div');
			clear.className = "creatable_clearer";
			element.appendChild(clear);
		}
	}

	var draggable = element.cloneNode(true);
	draggable.style.opacity = "0.8";
	draggable.style.filter = "alpha(opacity=80)";
	draggable.style.zIndex = 200;
	draggable.style.margin = "0px";
	draggable.style.position = "absolute";
	if (draggable.style.zoom !== undefined)
		draggable.style.zoom = Creatable.zoom_amount + "%";
	else {
		draggable.style.oTransform = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
		draggable.style.mozTransform = "scale(" + (Creatable.zoom_amount / 100.00) + ")";
	}

	Creatable.offsetLeft(draggable, (x - click_x));
	Creatable.offsetTop(draggable, (y - click_y));
	if (!is_new){
		Creatable.setWidth(draggable, Creatable.width(element));
		Creatable.setHeight(draggable, Creatable.height(element));
	}

	$(element).css("opacity", "0.2");
	$(element).removeClass("selected_element");

	DisableEditableFamilyTree(draggable);
	$("#creatable_container")[0].appendChild(draggable);

	Creatable.dragObj = {
		click_x: click_x
		,click_y: click_y
		,scroll_x: $("#creatable_container").scrollLeft()
		,scroll_y: $("#creatable_container").scrollTop()
		,draggable: draggable
		,item: element
		,is_item: is_item
		,is_new: is_new
	};
}

/*******************ACTUAL MOUSE EVENT HANDLERS******************/
Creatable.CheckDragAndDropAllowed = function(){
	var dialogs = $(".dialog_container");
	for (var i = 0; i < dialogs.length; i++){
		if ($(dialogs[i]).css("display") !== "none") return false;
	}
	return true;
}

Creatable.MouseDown = function(e){
	if (!Creatable.CheckDragAndDropAllowed())
		return;

	var x = e.pageX;
	var y = e.pageY;

	var element = null;
	var is_item = false;
	var is_new = false;
	var ignore_zoom = false;

	//Need to account for trying to drag over new item
	//new items in sidebar are unaffected by creatable zoom level
	if (x <= $("#sidebar").width()) ignore_zoom = true;
	else if (Creatable.WithinIgnoreZoom(x, y, $("#quickbar")) ||
		!Creatable.WithinIgnoreZoom(x, y, $("#creatable_container"))
		|| Creatable.WithinIgnoreZoom(x, y, $("#color-menu"))){
		return;
	}

	//If we're inside a textarea, don't try to move the item
	if (Creatable.FindElement(x, y, $(".creatable_section_inner")) !== null ||	            Creatable.FindElement(x, y, $(".creatable_item_text_inner")) !== null || Creatable.FindElement(x, y, $(".creatable_title_inner")) !== null){
		return;
	}

	//Else, find out if we're trying to drag a section or an item box
	if (ignore_zoom)
		element = Creatable.FindElementIgnoreZoom(x, y, $(".creatable_section_outer"));
	else element = Creatable.FindElement(x, y, $(".creatable_section_outer"));
	if (element === null){
		if (ignore_zoom)
			element = Creatable.FindElementIgnoreZoom(x, y, $(".creatable_item_outer"));
		else element = Creatable.FindElement(x, y, $(".creatable_item_outer"));
		if (element !== null){
			is_item = true;

			if (element.id === "new_item"){
				is_new = true;
			}
		}
	}else{
		var classNames = element.className.split(" ");
		if (classNames.indexOf("small_section_header") >= 0){
			if (element.id === "new_small_section"){
				is_new = true;
			}else{
				element = document.getElementById(element.id + "_container");
			}
		}else if (classNames.indexOf("big_section_header") >= 0){
			if (element.id === "new_title"){
				is_new = true;
			}
		}
	}

	//LOGIC FOR HANDLING WHETHER WE ARE NORMAL DRAGGING/SELECTING
	//OR WHETHER WE ARE IN IMAGE EDIT MODE (OR NEED TO ENABLE/DISABLE IT)
	if (element !== null){
		e.preventDefault();
		Creatable.dragObj = 0;
		if (!Creatable.imageEditMode && e.which === LEFT){
			//Normal drag drop selection
			Creatable.SetDraggable(x, y, element, is_item, is_new, ignore_zoom);
			if (!is_new)
				Creatable.SelectElement(element);
		}else if (Creatable.imageEditMode && e.which === RIGHT){
			//We are disabling image edit mode
			if ($(element).hasClass("image_selected_element")){
				Creatable.DisableImageEditables();
				Creatable.saveState();
				Creatable.SelectElement(element);
			}
			//We are enabling image edit mode (on another item)
			else{
				Creatable.DisableImageEditables();
				Creatable.SetImageEditable(element);
			}
		}else if (!Creatable.imageEditMode && e.which === RIGHT){
			//We are enabling image edit mode (on a new item)
			Creatable.DeselectElements();
			Creatable.SetImageEditable(element);
		}else{
			Creatable.dragObj = 0;
		}
	}
}

Creatable.MouseMove = function(e){
	var x = e.pageX;
	var y = e.pageY;
	var should_save = false;

	if (Creatable.dragObj !== null && Creatable.dragObj !== 0){
		e.preventDefault();
		var scrollLeftOffset = $("#creatable_container").scrollLeft() - Creatable.dragObj.scroll_x;
		var scrollTopOffset = $("#creatable_container").scrollTop() - Creatable.dragObj.scroll_y;
		Creatable.offsetLeft(Creatable.dragObj.draggable, (x - Creatable.dragObj.click_x) + scrollLeftOffset);
		Creatable.offsetTop(Creatable.dragObj.draggable, (y - Creatable.dragObj.click_y) + scrollTopOffset);

		//Creatable.UpdateTrash(e);

		//Arrange items differently than section heads
		if (Creatable.dragObj.is_item){
			var item = Creatable.FindElement(x, y, $(".creatable_item_outer"), Creatable.dragObj.draggable, false);
			//IF USER IS DRAGGING CURRENT ITEM INTO POSITION OF ANOTHER ITEM
			if (item !== null && item.id !== Creatable.dragObj.item.id){
				//If item isn't on the same row as the item we're trying to swap with
				//We'll append the item to this row first
				if (Creatable.dragObj.item.parentNode === null || item.parentNode.id !== Creatable.dragObj.item.parentNode.id){
					Creatable.dragObj.is_new = false;
					MoveNodeToParent(Creatable.dragObj.item, item.parentNode);
					ChangeItemColor(Creatable.dragObj, item.parentNode);
				}

				//Swap the two nodes
				ShiftNodes(item, Creatable.dragObj.item);

				should_save = true;
			}
			//EVEN IF ITEM ISN"T BEING DRAGGED ONTO ANOTHER ITEM
			//we need to check to see if it is being dragged to the end of a row
			else if (item === null){
				var section = Creatable.FindElement(x, y, $(".creatable_section_container"), Creatable.dragObj.draggable);
				if (section !== null && (Creatable.dragObj.item.parentNode === null || section.id !== Creatable.dragObj.item.parentNode.id)){
					Creatable.dragObj.is_new = false;
					MoveNodeToParent(Creatable.dragObj.item, section);
					ChangeItemColor(Creatable.dragObj, section);

					should_save = true;
				}
				//ELSE if we are trying to drag this on a potential new section
				else{
					var page = Creatable.FindElement(x, y, $(".recipe_page"));
					should_save = Creatable.DragItemOntoPage(Creatable.dragObj.item, page, x, y);
				}
			}
		}
		//Arrange section heads different than items
		else{
			var section = Creatable.FindElement(x, y, $(".creatable_section_container"), Creatable.dragObj.draggable, false);
			if (section === null){
				section = Creatable.FindElement(x, y, $(".creatable_section_outer"), $(Creatable.dragObj.draggable).children()[0], false);
			}else{
			}

			if (section === Creatable.dragObj.draggable) section = null;
			if (section !== null && section.id !== Creatable.dragObj.item.id){
				var should_swap = true;
				//If we're trying to drag a section onto a title,
				//Don't do it if it doesn't fit within the middle and top part of the title
				//This is to fix weird wobbling back and forth
				if (y > Creatable.offset(section).top + Creatable.height(Creatable.dragObj.item)){
					should_swap = false;
				}

				if (should_swap){
					if (Creatable.dragObj.is_new){
						MoveNodeToParent(Creatable.dragObj.item, section.parentNode);
					}

					Creatable.dragObj.is_new = false;
					//LET'S SWAP THEM...
					ShiftNodes(section, Creatable.dragObj.item);

					should_save = true;
				}
			}

			//If can't find any item, try to drag it right onto the page
			if (section === null && Creatable.dragObj.is_new){
				var page = Creatable.FindElement(x, y, $(".recipe_page"));
				if (page !== null){
					page.appendChild(Creatable.dragObj.item);
					Creatable.dragObj.is_new = false;

					should_save = true;
				}
			}
		}
	}

	if (should_save){
		Creatable.should_save = true;
		Creatable.UpdatePages();
	}
}

Creatable.MouseUp = function(e){
	if (!Creatable.CheckDragAndDropAllowed())
		return;

	var x = e.pageX;
	var y = e.pageY;

	if (Creatable.dragObj !== null){
		if (Creatable.dragObj !== 0){
			e.preventDefault();
			try{
				Creatable.dragObj.draggable.parentNode.removeChild(Creatable.dragObj.draggable);
			}catch(err){
				console.log(err);
			}

			$(Creatable.dragObj.item).removeAttr("style");
			$(Creatable.dragObj.item).addClass("selected_element");
			Creatable.UpdateItemRows();

			/*if (is_trash_active){
				Creatable.dragObj.item.parentNode.removeChild(Creatable.dragObj.item);
				Creatable.play(Creatable.delete_element_audio);
				Creatable.UpdatePages();
				Creatable.UpdateImageDragDropEvents();
			}*/

			//Save the state for undo/redo
			if (Creatable.should_save){
				/*if (!is_trash_active)
					Creatable.play(Creatable.click_element_audio);*/
				Creatable.should_save = false;
				Creatable.saveState();
			}
		}
	}else{
		if (x > $("#sidebar").width() && !Creatable.WithinIgnoreZoom(x, y, $("#quickbar")) && Creatable.WithinIgnoreZoom(x, y, $("#creatable_container")) && !Creatable.WithinIgnoreZoom(x, y, $("#color-menu")) && !Creatable.Within(x, y, $(".editable_image"))){
			Creatable.DisableImageEditables();
			$(".selected_element").removeClass("selected_element");
		}
	}
	//Creatable.TryToDelete();
	Creatable.dragObj = null;
	//Creatable.DeactivateTrash();
}

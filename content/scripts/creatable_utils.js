Creatable.pageScroll = 0;

Creatable.RandomColor = function(){
	var randi = Math.floor((Math.random() * 3)+1);
	switch(randi){
		case 0:
			return "red";
		case 1:
			return "green";
		case 2:
			return "blue";
		default: return "red";
	}
}

Creatable.UpdateItemRows = function(){
	var containers = $(".creatable_section_container");
	for (var i = 0; i < containers.length; i++){
		var children = $(containers[i]).children();
		var y = ~~(Creatable.offset(children[0]).top);
		for (var j = 1; j < children.length; j++){
			$(children[j]).css("margin-left", "");
		}
		
		for (var j = 1; j < children.length; j++){
			var y_temp = ~~(Creatable.offset(children[j]).top);
			if (y_temp > y){
				y = y_temp;
				$(children[j]).css("margin-left", "154px");
			}
		}
	}
}

Creatable.PartiallyUpdatePages = function(updateScroll){
	if (updateScroll) Creatable.pageScroll = $("#creatable_container").scrollTop();
		
	//First, delete existing pages, and put all items into one master page
	//Easier to do it like this so removing items will correctly move items up onto previous pages
	var new_page = Creatable.NewPage();
	var pages = $(".recipe_page");
	for (var i = 0; i < pages.length; i++){
		var page_contents = $(pages[i]).children();
		for (var j = 0; j < page_contents.length; j++){
			try{
				$(new_page).append(page_contents[j]);
			}catch(err){
				console.log(err.message);
			}
		}
	}
	$("#creatable").html("");
	new_page.id = "recipe_page_0";
	$("#creatable").append(new_page);
	
	Creatable.RenumberNumbers();
	
	Creatable.UpdateItemRows();
}

Creatable.UpdatePages = function(updateScroll){
	if (typeof(updateScroll) === 'undefined') updateScroll = true;
	Creatable.PartiallyUpdatePages(updateScroll);
	
	//Then, loop through and correctly move items that are hanging off the page onto another page, as we go down
	pages = $(".recipe_page");
	for (var i = 0; i < pages.length; i++){
		var page = pages[i];
		var page_contents = $(page).children();
		for (var j = 0; j < page_contents.length; j++){
			if ($(page_contents[j]).hasClass("recipe_page_break")){
				Creatable.ResizePageBreak($(page_contents[j]));
			}else{
				var y = Creatable.offset(page_contents[j]).top + Creatable.height(page_contents[j]);
				var page_y = Creatable.offset(page).top + Creatable.height(page);
			
				//if the items are hanging off the page!!!
				if (y > page_y){
					var move_us = page_contents.splice(j);
					
					//create a new page
					new_page = Creatable.NewPage();
					//move all the items onto this new page
					for (var k = 0; k < move_us.length; k++){
						$(new_page).append(move_us[k]);
					}
					$("#creatable").append(new_page);
					break;
				}
			}
		}
	
		//update the page list just in case a new one was created
		pages = $(".recipe_page");
	}
	$("#creatable_container").scrollTop(Creatable.pageScroll);
}

//http://stackoverflow.com/questions/4406206/how-to-swap-position-of-html-tags
function SwapNodes(node1, node2){
	node2_copy = node2.cloneNode(true);
	node1.parentNode.insertBefore(node2_copy, node1);
	node2.parentNode.insertBefore(node1, node2);
	node2.parentNode.replaceChild(node2, node2_copy);
}

function ShiftNodes(node1, node2){
	var parentNode = node1.parentNode;
	//Need to account for nodes being on seperate pages
	if (node2.parentNode !== parentNode){
		MoveNodeToParent(node2, parentNode);
	}
	
	var node1index = 0;
	var node2index = 0;
	for (var i = 0; i < parentNode.children.length; i++){
		if (parentNode.children[i] === node1)
			node1index = i;
		if (parentNode.children[i] === node2)
			node2index = i;
	}
	
	if (node1index < node2index){
		for (var i = node2index; i > node1index; i--){
			SwapNodes(parentNode.children[i], parentNode.children[i-1]);
		}
	}else{
		for (var i = node2index; i < node1index; i++){
			SwapNodes(parentNode.children[i], parentNode.children[i+1]);
		}
	}
}

function MoveNodeToParent(node, parent){
	if (node.parentNode !== null)
		node.parentNode.removeChild(node);
	if (parent !== null){
		$(node).insertBefore($(parent).children().last());
		//parent.appendChild(node);
	}
}

function ChangeItemColor(cdrag, section){
	var section_header = section.children[0];
	var outer_color = "";
	var middle_color = "";
	
	var classes = section_header.className.split(' ');
	for (var i = 0; i < classes.length; i++){
		if (classes[i].indexOf("outer_color") >= 0 && classes[i].indexOf("white") < 0)
			outer_color = classes[i];
		if (classes[i].indexOf("middle_color") >= 0 && classes[i].indexOf("white") < 0)
			middle_color = classes[i];
	}
	
	classes = cdrag.item.className.split(' ');
	for (var i = 0; i < classes.length; i++){
		if (classes[i].indexOf("outer_color") >= 0 && classes[i].indexOf("white") < 0)
			classes[i] = outer_color;
		if (classes[i].indexOf("middle_color") >= 0 && classes[i].indexOf("white") < 0)
			classes[i] = middle_color;
	}
	cdrag.item.className = classes.join(' ');
	cdrag.draggable.className = classes.join(' ');
}

Creatable.SetStyleRecursive = function(element, prop, value, exclude_parent){
	if (typeof(exclude_parent) === 'undefined') exclude_parent = false;
	if (!exclude_parent)
		$(element).css(prop, value);
	var children = $(element).children();
	for (var i = 0; i < children.length; i++){
		Creatable.SetStyleRecursive(children[i], prop, value, false);
	}
}

function RemoveStyleFamilyTree(parent){
	if (parent.removeAttribute !== undefined)
		parent.removeAttribute("style");
	var children = parent.childNodes;
	for (var i = 0; i < children.length; i++){
		RemoveStyleFamilyTree(children[i]);
	}
}

function DisableEditableFamilyTree(parent){
	parent.contentEditable = false;
	var children = parent.childNodes;
	for (var i = 0; i < children.length; i++){
		DisableEditableFamilyTree(children[i]);
	}
}

Creatable.CountPages = function(){
	var count = 0;
	var pages = $(".recipe_page").sort();
	for (var i = 0; i < pages.length; i++){
		var id = pages[i].id;
		id = id.substr("recipe_page_".length);
		id = parseInt(id);
		if (id >= count){
			count = id+1;
		}
	}
	return count;
}

function CreatableCountItems(is_item){
	//Find the next available id (skipping ones that have been deleted *shrug*
	var count = 0;
	var items = [];
	is_item = is_item === undefined || is_item;
	if (is_item)
		items = $(".creatable_item_outer");
	else items = $(".creatable_section_outer");
	items = items.sort();
	for (var i = 0; i < items.length; i++){
		var id = items[i].id;
		if (is_item)
			id = id.substr("item_".length);
		else
			id = id.substr("section_".length);
		
		id = parseInt(id);
		if (id >= count){
			count = id+1;
		}
	}
	return count;
}

function CreatableCountSections(){ return CreatableCountItems(false); }
function DeselectButtons(buttons){
	for (var i = 0; i < buttons.length; i++){
		buttons[i].className = buttons[i].className.replace(/\s*selected\s*/g, "");
	}
}

function FillerToHD(){
	var elements = $(".col_filler");
	for (var i = 0; i < elements.length; i++){
		var hd = document.createElement('div');
		hd.className = 'hd';
		elements[i].innerHTML = "";
		elements[i].appendChild(hd);
		elements[i].className = "horizontal_divider";
		$(elements[i]).css("height", "");
	}
}

/*******************SELECT TITLEBAR BUTTONS********************/
//http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
var createDownloadLink = function(anchorSelector, str, fileName){
	if(window.navigator.msSaveOrOpenBlob) {
		var fileData = [str];
		blobObject = new Blob(fileData);
		$(anchorSelector).click(function(){
			window.navigator.msSaveOrOpenBlob(blobObject, fileName);
		});
	} else {
		var url = "data:application/xml;charset=utf-8," + encodeURIComponent(str);
		$(anchorSelector).attr("download", fileName);
		$(anchorSelector).attr("href", url);
	}
}

function SelectTitle(e){
	var button = e.toElement || e.target;
    if (button.id === "title"){
        window.open("http://www.yourspecialchef.net/",'_blank');
    }
	if (button.id === "new_recipe"){
		$("#new_dialog").css("display", "block");
		$("#cropper_grey_out").css("display", "block");
		Creatable.resize();
	}
	//if (button.id === "my_recipes") MyRecipes();
	if (button.id === "save_recipe"){
		var json = JSON.stringify({html: $("#creatable").html()});
		var title = "Your Special Chef Recipe";
		try{
			title = $(".creatable_title_inner")[0].innerHTML;
		}catch(e){}
		title += ".yscRecipe";
		createDownloadLink("#save_your_recipe_link", json, title);
		$("#save_your_recipe_link")[0].click();
	}
	if (button.id === "load_recipe"){
		$("#load_dialog").css("display", "block");
		$("#cropper_grey_out").css("display", "block");
		Creatable.resize();
	}
	/*if (button.id === "submit_recipe"){
		$("#submit_dialog").css("display", "block");
		$("#cropper_grey_out").css("display", "block");
		if (YourSpecialChef.account_email !== null)
			$("#submit_username").val(YourSpecialChef.account_email);
		Creatable.resize();
	}*/
	if (button.id === "print_recipe") PrintRecipe();
	/*if (button.id === "account_button"){
		if (YourSpecialChef.IsSignedIn()){
			$("#logout_dialog").css("display", "block");
			$("#cropper_grey_out").css("display", "block");
			$("#login_password").val("");
			Creatable.resize();
		}
		else{
			$("#account_dialog").css("display", "block");
			$("#cropper_grey_out").css("display", "block");
			Creatable.resize();
		}
	}*/
}

function LoadRecipe(){
		var fileinput = $(document.createElement("input"));

		fileinput.attr('type', "file");
		fileinput.attr('accept', ".yscRecipe");
		fileinput.on('change', function(e){
			var file = fileinput[0].files[0];
			var reader = new FileReader();
			reader.onload = function(e){
				var data = reader.result;

				try{
					var obj = JSON.parse(data);
					$("#creatable").html(obj.html);
				}catch(e){
					console.log(e);
				}
			}
			reader.readAsText(file);
		});
		$(fileinput).click();
}

/*function MyRecipes(){
	if ($("#my_recipe_list").css("display") === "block"){
		$("#my_recipe_list").css("display", "none");
	}
	else{
		//LOAD THE RECIPES INTO Creatable.MyRecipes
		YourSpecialChef.MyRecipes(function(){
			CloseDialogs(null);
			$("#my_recipe_list").html("");

			//Create filler top of list
			var li = document.createElement('li'); li.className = "no_hover";
			$("#my_recipe_list").append(li);

			//Append my recipe list with all the LOADED RECIPES
			for (var i = 0; i < Creatable.MyRecipes.length; i++){
				var li = document.createElement('li');
				$(li).html(Creatable.MyRecipes[i].title);
				//make the selection actually load from Creatable.MyRecipes[i]
				$(li).bind('click', { index: i}, function(event){
					Creatable.LoadRecipe(event.data.index);
					YourSpecialChef.Recipe = Creatable.MyRecipes[event.data.index];
					$("#my_recipe_list").css("display", "none");
				});
				$("#my_recipe_list").append(li);
			}
			//Create filler bottom of list
			var li = document.createElement('li'); li.className = "no_hover";
			$("#my_recipe_list").append(li);

			//Set the correct css
			$("#my_recipe_list").css("display", "block");
			$("#my_recipe_list").css("left", $("#my_recipes").offset().left);
			$("#my_recipe_list").css("top", 18+$("#my_recipes").offset().top+$("#my_recipes").height());
		});
	}
}*/

function PrintRecipe(){
	var selected = $(".selected_element");
	$(".selected_element").removeClass("selected_element");
	Creatable.SelectElement(null);

	try{
		var pri = window.open('', 'yourspecialchef recipe');
		pri.document.write('<html><head><title>recipe</title>');
		pri.document.write('<link rel="stylesheet" href="content/creatable.css" type="text/css"/>');
		pri.document.write('</head><body>');
		pri.document.write($("#creatable").html());
		pri.document.write("</body></html>");
		setTimeout(function(){pri.print();}, 3000);
		//pri.close();
	}catch(e){
		alert(e);
		console.log(e);
	}

	selected.addClass("selected_element");
}

/*******************SELECT SIDEBAR BUTTONS**********************/
function SelectSide(e){
	Creatable.DeselectElements();
	var button = e.toElement || e.target;
	DeselectButtons($(".col_button"));
	FillerToHD();
	button.className += " selected";

	//SET THE FILLER
	var row = button.nextSibling;
	while (row && row.nodeType != 1){
		row = row.nextSibling;
	}
	row.className = "col_filler";

	//POPULATE THE FILLER
	if (button.id === "add_step"){
		$(row).height($(window).height() - $(row).offset().top - (90));
		SelectAddStep(row);
	}
	if (button.id === "add_picture"){
		$(row).height($(window).height() - $(row).offset().top - (45));
		SelectAddPicture(row);
	}
	if (button.id === "upload_picture"){
		$(row).height($(window).height() - $(row).offset().top - (1));
		$(row).css("overflow-x", "hidden");
		SelectUploadPicture(row);
	}
}

function SelectAddStep(filler){
	filler.innerHTML = ""; //clear the filler
	var info = document.createElement('div');
	info.className = "sidebar_info";
	info.innerHTML = "Drag and Drop steps onto the Recipe";
	filler.appendChild(info);

	//Append new title
	var title = CreateNewTitle("red", "title", true);
	title.style.margin = "12px";
	title.style.marginBottom = "0px";
	filler.appendChild(title);

	//Append new section
	var section = CreateNewSection("blue", "section", true);
	section.style.margin = "12px";
	filler.appendChild(section);

	//Append new section number
	/*var number = CreateNewSectionNumber("1", true);
	number.style.margin = "12px";
	number.style.marginLeft = "0px";
	filler.appendChild(number);*/

	//Append new item
	var item = CreateNewItem("blue", "item", true);
	item.style.margin = "12px";
	item.style.marginTop = "0px";
	filler.appendChild(item);
}

function SelectAddPicture(filler){
	$(filler).html('');
	var info = document.createElement('div');
	info.className = "sidebar_info";
	info.innerHTML = "Drag and Drop Pictures to create or edit items.<br/>(Can also edit title pictures)";

	var search = document.createElement('div');
	search.className = "sidebar_search";
	search.innerHTML = "<input type='text' id='picture_search'><span class='search_image' title='Search for pictures by name or category'></span>";

	var waiting = document.createElement('div');
	waiting.className = "waiting";
	filler.appendChild(waiting);

	YourSpecialChef.GetPictures(function(pictures){
		$(filler).html('');
		$(filler).append($(info));
		$(filler).append($(search));
		$("#picture_search").unbind("keyup").on("keyup", function(e){
			var search_text = $("#picture_search").val();
			var pict_buttons = $('.picture_button');
			for (var i = 0; i < pict_buttons.length; i++){
				var name = $($(pict_buttons[i]).children()[1]).html();
				if (name.indexOf(search_text) >= 0){
					$(pict_buttons[i]).css("display", "block");
				}else{
					$(pict_buttons[i]).css("display", "none");
				}
			}
		});

		Creatable.AppendPicturesToFiller(filler, pictures, true);
		var clear = document.createElement('div');
		clear.style.clear = "both";
		filler.appendChild(clear);
	});
}

//http://deepliquid.com/content/Jcrop_Download.html
function SelectUploadPicture(filler){
	filler.innerHTML = "";
	var info = document.createElement('div');
	info.className = "sidebar_info";
	info.innerHTML = "Upload your pictures.<br/>Drag them onto steps.";
	filler.appendChild(info);
	filler.appendChild(document.createElement('br'));

	var input = document.createElement('input');
	input.type = "file";
	input.accept = ".png, .PNG, .jpg, .JPG, .jpeg, .JPEG";
	input.style.margin = "5px";
	//http://stackoverflow.com/questions/8890064/html5-image-upload

	$(input).on("change", function(e){
		var files = e.target.files;
		var reader = new FileReader();
		reader.onload = (function(ev){UploadImage(ev, filler);});
		//Read in the image file as a data URL
		reader.readAsDataURL(files[0]);
		$(input).val(null);
	});

	filler.appendChild(input);
	var upload_drag = document.createElement('div');
	upload_drag.className = "upload_drag";
	filler.appendChild(upload_drag);
	var p = document.createElement('div');
	p.style.margin = "0 auto";
	p.innerHTML = "or drag an image to upload it";
	filler.appendChild(p);

	filler.appendChild(document.createElement('br'));
	var pictures = Creatable.uploadedImagesCache;
	Creatable.AppendPicturesToFiller(filler, pictures);
	var clear = document.createElement('div');
	clear.className = "filler_clearer";
	clear.style.clear = "both";
	filler.appendChild(clear);

	//Allow images to be dragged and dropped
	$(filler).unbind('dragover').on("dragover", function(e){
		e.preventDefault();
		e.originalEvent.dataTransfer.effectAllowed = "copy";
		e.originalEvent.dataTransfer.dropEffect = "copy";
	});
	$(filler).unbind('drop').on('drop', function(e){
		e.preventDefault();
		e.stopPropagation();
		var imageUrl = e.originalEvent.dataTransfer.getData('text/html');
		if($(imageUrl).children().length > 0 ){
			var url = $(imageUrl).find('img').attr('src');
		}else{
			var url = $(imageUrl).attr('src');
		}
		if (url !== undefined && url !== null){
			var ev = { target: { result: url } };
			UploadImage(ev);
		}else{
			var files = e.originalEvent.dataTransfer.files;
			var reader = new FileReader();
			reader.onload = (UploadImage);

			//Read in the image file as a data URL
			reader.readAsDataURL(files[0]);
		}
	});
}

Creatable.AppendPicturesToFiller = function(filler, pictures, use_categories){
	if (use_categories === undefined) use_categories = false;

	if (use_categories){
		pictures.sort(function(a, b){
			return a.category.localeCompare(b.category);
		});
	}

	var category = null;
	var category_div = null;
	for (var i = 0; i < pictures.length; i++){
		if (use_categories){
			if (category !== pictures[i].category){
				if (category_div !== null){
					var clear = document.createElement('div');
					$(clear).css("clear", "both").css("margin-bottom", "5px");
					category_div.appendChild(clear);
					filler.appendChild(category_div);
				}
				category = pictures[i].category;
				category_div = document.createElement('div');
				var cat_div_header = document.createElement('div');
				cat_div_header.className = "sidebar_info_invert";
				$(cat_div_header).css("outline-top","1px solid black");
				$(cat_div_header).css("cursor", "pointer");
				$(cat_div_header).html(category);

				$(cat_div_header).on('click', function(){
					var children = $(this).parent().children();
					var clearer = $(children[children.length-1]);
					var header = $(children[0]);
					children = children.slice(1, children.length-1);
					if ($(children[1]).css("display") === "block"){
						children.css("display", "none");
						clearer.css('margin-bottom', '5px');
					}else{
						children.css("display", "block");
						clearer.css('margin-bottom', '10px');
					}
				});
				category_div.appendChild(cat_div_header);
			}
		}
		var uploaded_images = !use_categories;

		var img = document.createElement('img');
		img.src = pictures[i].src;
		img.name = pictures[i].name;
		$(img).on("drag", function(e){
			var img = e.target;
			e.originalEvent.dataTransfer.setData("URL", img.src);
		});

		var pict = document.createElement('div');
		pict.className = "picture_button";
		pict.appendChild(img);
		var pict_name = document.createElement('div');
		pict_name.className = "picture_button_name";
		pict_name.innerHTML = img.name;
		$(pict_name).attr('category', category);
		//pict_name.contentEditable = true;

		pict.appendChild(pict_name);

		//add delete button...
		if (uploaded_images){
			var close = document.createElement("div");
			close.style.position = "absolute";
			close.style.right = "6px";
			close.style.top = "3px";
			close.style.color = "red";
			close.style.fontSize = "16px";
			close.style.textShadow = "-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white";
			close.innerHTML = "X";
			close.style.cursor = "pointer";
			close.style.zIndex = "999";
			close.title = "delete image";

			close.onclick = function(i){
				uploaded_image_to_be_deleted_index = i;
				$("#delete_image_dialog").css("display", "block");
				$("#cropper_grey_out").css("display", "block");
				Creatable.resize();
			}.bind(this, i);

			pict.appendChild(close);
		}

		if (use_categories){
			$(pict).css("display", "none");
			category_div.appendChild(pict);
		}else{
			filler.appendChild(pict);
		}
	}
	if (use_categories){
		if (category_div !== null){
			var clear = document.createElement('div');
			$(clear).css("clear", "both").css("margin-bottom", "5px");
			category_div.appendChild(clear);
			filler.appendChild(category_div);
		}
	}
}

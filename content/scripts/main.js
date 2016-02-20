var CloseDialogs;
var LEFT = 1;
var RIGHT = 3;

$(function(){
	//DRAGGING AND DROPPING ELEMENTS
	$(document).mousedown(Creatable.MouseDown);
	$(document).mousemove(Creatable.MouseMove);
	$(document).mouseup(Creatable.MouseUp);
	//CTRL+Z, CTRL+Y and other shortcuts
	$(document).keydown(Creatable.KeyDown);

	//The functions listed here (SelectTitle, SelectSide, etc)
	//can be found in buttons.js
	$(".row_button").click(SelectTitle);
	$("#my_recipes").hover(function(){}, function(){$("#my_recipe_list").css("display", "none");});
	$(".col_button").click(SelectSide);
	$("#add_picture").click();

	$(window).resize(Creatable.resize);

	//the YourSpecialChef object can be found in api_interaction.js
	//Need to initially save the state?
    if(typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if (!YourSpecialChef.RememberLastRecipe())
            YourSpecialChef.New();
        YourSpecialChef.RememberUploadedImages();
    } else {
        // Sorry! No Web Storage support..
        YourSpecialChef.New();
    }
	//YourSpecialChef.Save();
	Creatable.saveState();
	$("#undo").click(Creatable.undo);
	$("#undo").hover(function(e){
		if (Creatable.state_index <= 0){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#redo").click(Creatable.redo);
	$("#redo").hover(function(e){
		if (Creatable.state_index >= Creatable.states.length-1){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#zoom_out").click(Creatable.zoomOut);
	$("#zoom_out").hover(function(e){
		if (Creatable.zoom_level <= 0){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#zoom_in").click(Creatable.zoomIn);
	$("#zoom_in").hover(function(e){
		if (Creatable.zoom_level >= 4){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#cut").click(Creatable.cut);
	$("#delete").click(Creatable.deleteElem)
	$("#copy").click(Creatable.copy);
	$("#copy, #cut, #delete").hover(function(e){
		if ($(".selected_element").length === 0 && $(".editable_image_selected").length === 0){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#paste").click(Creatable.paste);
	$("#paste").hover(function(e){
		if ((Creatable.clipboard === null && !Creatable.imageEditMode) || (Creatable.copiedImage === null && Creatable.imageEditMode)){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
		}
		else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
		}
	});
	$("#paint").hover(function(e){
		if ($(".selected_element").length === 0){
			$(this).css("background-color", e.type === "mouseenter"?"#cccccc":"transparent");
			$(this).css("cursor", "default");
			$("#color-menu").css("display", "none");
		}else{
			$(this).css("background-color", e.type === "mouseenter"?"#43A536":"transparent");
			$(this).css("cursor", "pointer");
			$("#color-menu").css("display", e.type === "mouseenter"?"block":"none");
			$("#color-menu").css("top", ($(this).offset().top));
			$("#color-menu").css("left", ($(this).offset().left-$("#color-menu").width()));
		}
	});
	$("#color-menu-option-1").click(function(e){Creatable.ChangeColor('red');});
	$("#color-menu-option-2").click(function(e){Creatable.ChangeColor('green');});
	$("#color-menu-option-3").click(function(e){Creatable.ChangeColor('blue');});

	//Allow contenteditables to be recognized by undo/redo
	$('body').on('focus', '[contenteditable]', function(){
		var $this = $(this);
		$this.data('before', $this.html());
		return $this;
	}).on('blur', '[contenteditable]', function(){
		var $this = $(this);
		if ($this.data('before') !== $this.html()){
			//Save the state!!!
			Creatable.saveState();
		}
		return $this;
	});

	//Signup Account clientside verification
	$("#signup_username, #signup_password, #verify_signup_password").on('keyup', function(){
		var email_re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		//VALIDATE EMAILS
		$("#signup_username_verification").css("color", "#ffaaaa");
		if ($("#signup_username").val().length <= 0){
			$("#signup_username_verification").html("An email is required.");
		}else if (!email_re.test($("#signup_username").val())){
			$("#signup_username_verification").html("Email is invalid.");
		}else{
			$("#signup_username_verification").css("color", "#00aa00");
			$("#signup_username_verification").html("Valid email :)");
		}

		var password_strength = zxcvbn($("#signup_password").val());
		//VALIDATE PASSWORD
		$("#signup_password_verification").css("color", "#ffaaaa");
		if ($("#signup_password").val().length <= 0){
			$("#signup_password_verification").html("A password is required.");
		}else{
			switch (password_strength.score){
				default:case 0:
					$("#signup_password_verification").css("color", "#ff0000");
					$("#signup_password_verification").html("Password is very weak.");
					break;
				case 1:
					$("#signup_password_verification").html("Password is weak.");
					break;
				case 2:
					$("#signup_password_verification").css("color", "#ff8c00");
					$("#signup_password_verification").html("Password is OK.");
					break;
				case 3:
					$("#signup_password_verification").css("color", "#00ff00");
					$("#signup_password_verification").html("Password is strong.");
					break;
				case 4:
					$("#signup_password_verification").css("color", "#00aa00");
					$("#signup_password_verification").html("Password is very strong.");
					break;
			}
		}

		if ($("#signup_password").val() !== $("#verify_signup_password").val()){
			$("#verify_signup_password_verification").css("color", "#ffaaaa");
			$("#verify_signup_password_verification").html("Passwords must match");
		}else{
			$("#verify_signup_password_verification").css("color", "#00aa00");
			$("#verify_signup_password_verification").html("Passwords match");
		}
	});

	CloseDialogs = function(e){
		$(".dialog_container").css("display", "none");
		$("#cropper_grey_out").css("display", "none");
	};
	$(".close_container").on('click', CloseDialogs);

	//Just resize everything at the end please
	Creatable.resize();
});

Creatable.resize = function(reclick){
	/*if (reclick === undefined) reclick = true;
	if (reclick) $(".col_button.selected").click();*/

	var crop = "#uploaded_picture_cropper_container";
	$(crop).width(640);
	try{
		var target = $($(".jcrop-tracker")[1]);
		var preview = "#preview-pane";
		$(preview).offset({
			left: $(target).offset().left + ($(target).width() - $(preview).width())/2,
			top:($(target).offset().top + $(target).height() + 10)});

		$(crop).height(($(preview).offset().top + $(preview).height()) - $(crop).offset().top + 80);
		$("#cropper_div").height(($(preview).offset().top + $(preview).height() - $("#cropper_div").offset().top) - 25);
	}catch(e){
		//console.log(e);
	}

	var dialogs = $(".dialog_container");
	for (var i = 0; i < dialogs.length; i++){
		$(dialogs[i]).offset({
			left: ($(window).width()-$(dialogs[i]).width())/2,
			top: ($(window).height()-$(dialogs[i]).height())/2,
		});
	}
}

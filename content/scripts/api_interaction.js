function YourSpecialChef(){};
YourSpecialChef.Recipe = null;
YourSpecialChef.account_email = null;
YourSpecialChef.account_password = null;

//ACCOUNT LOG IN/SIGN IN
Creatable.ProcessingRequest = function(){
	$("#message_dialog").css("display", "block");
	$("#message_dialog_title").html("Processing");
	$("#message_dialog_body").html("The request is processing.<br/><br/><div class='waiting'></div>");
	$("#cropper_grey_out").css("display", "block");
	Creatable.resize();
}

YourSpecialChef.New = function(){
	var current = (" "+$("#creatable").html()+" ").replace(/\s{2,}/g, ' ').replace(/></g,'> <');
	//EMPTY THE RECIPE
	$("#creatable").html("");

	//CREATE AND APPEND THE FIRST PAGE
	var page = Creatable.NewPage();
	var title = CreateNewTitle("red", "my recipe");
	title.id = "section_0";
	var section = CreateNewSection("blue", "you will need:");
	section.id = "section_1";
	var section_container = CreateNewSectionContainer(section);
	section = CreateNewSection("green", "tools:");
	section.id = "section_2";
	var section_container2 = CreateNewSectionContainer(section);

	page.appendChild(title);
	page.appendChild(section_container);
	page.appendChild(section_container2);

	//CREATE AND APPEND THE SECOND PAGE!!
	title = CreateNewTitle("red", "steps");
	title.id = "section_3";
	$($($(title).children()[0]).children()[1]).html("");
	var number = CreateNewSectionNumber("red", "1");
	number.id = "section_4";
	section_container = CreateNewSectionContainer(number);

	page.appendChild(title);
	page.appendChild(section_container);
	$("#creatable")[0].appendChild(page);
	Creatable.insertPageBreakBefore(title);

	Creatable.saveState();

	YourSpecialChef.Recipe = {
		id:YourSpecialChef.GetNewRecipeID(),
		title:Creatable.getTitle(),
		data:Creatable.getState(),
		datetime:Creatable.getDateTime()
	};
}

//BUILT IN IMAGES
YourSpecialChef.GetPictures = function(callback){
	//TODO::
	//I don't know what the client will look like :)
    $.get("./recipe-creator-get-pictures.json", { },
        function(result){
            result = $.parseJSON(result);
			if (result.success){
				callback(result.pictures);
				//Array of picture objects of this form
				/*picture = {
					"category": "food",
					"name": "soft taco shells",
					"src": "content/images/recipe/softtacoshells.png"
				};*/
			}
        }
    );
}

YourSpecialChef.SaveLastRecipe = function(){
	var recipe_json = Creatable.getState();
    if (typeof(Storage) !== "undefined")
        localStorage.setItem("yourspecialchef_recipe", recipe_json);
}

YourSpecialChef.RememberLastRecipe = function(){
    if (typeof(Storage) === "undefined") return false;

    try{
        var recipe_json = localStorage.getItem("yourspecialchef_recipe");
        if (recipe_json === null || recipe_json === undefined || recipe_json === "null")
            return false;
        $("#creatable").html(recipe_json);
    }catch(e){
        console.log(e);
        return false;
    }
    return true;
}

YourSpecialChef.SaveUploadedImages = function(){
    var uploaded_images_json = JSON.stringify(Creatable.uploadedImagesCache);
    if (typeof(Storage) !== "undefined")
        localStorage.setItem("yourspecialchef_uploadedimages", uploaded_images_json);
}

YourSpecialChef.RememberUploadedImages = function(){
    if (typeof(Storage) === "undefined") return false;

    try{
        var uploaded_images_json = localStorage.getItem("yourspecialchef_uploadedimages");
        Creatable.uploadedImagesCache = JSON.parse(uploaded_images_json);
    }catch(e){
        console.log(e);
    }

    if (Creatable.uploadedImagesCache === null || Creatable.uploadedImagesCache === undefined ||
        Creatable.uploadedImagesCache === "null"){
            Creatable.uploadedImagesCache = [];
    }
}

/*YourSpecialChef.LogIn = function(){
	//username is email, should error check?
	var email = $("#login_username").val();
	var password = $("#login_password").val();

	Creatable.ProcessingRequest();

	//TODO...
	//I don't know what the client will look like :)
	$.post("recipe-creator-log-in.php",
		{ email: email,
			password: password,
		},
		function(result){
			result = $.parseJSON(result);
			$("#message_dialog").css("display", "block");

			if (result.success){
				YourSpecialChef.account_email = email;
				YourSpecialChef.account_password = password;

				$("#message_dialog_title").html("Log In Success");
				$("#message_dialog_body").html("You have successfully logged into the account.");

				$("#account_button").html("LOG OUT");
			}else{
				YourSpecialChef.account_email = null;
				YourSpecialChef.account_password = null;

				$("#message_dialog_title").html("Log In Failure");
				$("#message_dialog_body").html("Email or Password is incorrect.");
			}
			$("#cropper_grey_out").css("display", "block");
			Creatable.resize();
		}
	);
}

YourSpecialChef.SignUp = function(){
	//username is email, should error check?
	//TODO:: error check email, error check password verification
	var email = $("#signup_username").val();
	var password = $("#signup_password").val();
	var verify_password = $("#signup_verify_password").val();

	Creatable.ProcessingRequest();

	//TODO::
	//I don't know what the client will look like :)
	$.post("recipe-creator-sign-up.php",
		{ email: email,
			password: password,
			verifyPassword: verify_password
		},
		function(result){
			$("#message_dialog").css("display", "block");
			result = $.parseJSON(result);
			if (result.success){
				YourSpecialChef.account_email = email;
				YourSpecialChef.account_password = password;

				$("#message_dialog_title").html("Sign Up Success");
				$("#message_dialog_body").html("You have successfully signed up for the account.<br/>You are now logged in.");

				$("#account_button").html("LOG OUT");
			}else{
				YourSpecialChef.account_email = null;
				YourSpecialChef.account_password = null;

				$("#message_dialog_title").html("Sign Up Failure");
				$("#message_dialog_body").html("Email is already in use.<br/>Or passwords do not match.");
			}

			$("#cropper_grey_out").css("display", "block");
			Creatable.resize();
		}
	);
}

YourSpecialChef.IsSignedIn = function(){
	return (YourSpecialChef.account_email !== null);
}

YourSpecialChef.LogOut = function(){
	YourSpecialChef.account_email = null;
	YourSpecialChef.account_password = null;
}*/

YourSpecialChef.GetNewRecipeID = function(){
	var recipe_id = 0;
	if (YourSpecialChef.account_email !== null){
		$.post("recipe-creator-new-recipe-id.php",
			{ email: YourSpecialChef.account_email,
				password: YourSpecialChef.account_password
			},
			function(result){
				result = $.parseJSON(result);
				if (result.success){
					recipe_id = result.recipe_id;
				}
			}
		);
	}
	return recipe_id;
}

/*YourSpecialChef.Save = function(){
	Creatable.saveState();
	YourSpecialChef.Recipe = {
		id: YourSpecialChef.Recipe.id,
		title: Creatable.getTitle(),
		data: Creatable.getState(),
		datetime:Creatable.getDateTime()
	}
	var recipe_json = JSON.stringify(YourSpecialChef.Recipe);

	//TODO...
	//I don't know what the client will look like :)
	if (YourSpecialChef.account_email === null){
		$("#message_dialog").css("display", "block");
		$("#message_dialog_title").html("Not Logged In");
		$("#message_dialog_body").html("Must create an account to save recipes.");
	}else{
		Creatable.ProcessingRequest();

		$.post("recipe-creator-save-recipe.php",
			{ email: YourSpecialChef.account_email,
				password: YourSpecialChef.account_password,
				recipeID: YourSpecialChef.Recipe.id,
				recipeTitle: YourSpecialChef.Recipe.title,
				recipeHTML: YourSpecialChef.Recipe.data,
				recipeDateTime: YourSpecialChef.Recipe.datetime
			},
			function(result){
				result = $.parseJSON(result);
				if (result.success){
					$("#message_dialog").css("display", "block");
					$("#message_dialog_title").html("Saved");
					$("#message_dialog_body").html("Your Recipe has been saved.");
				}else{
					$("#message_dialog").css("display", "block");
					$("#message_dialog_title").html("Failure");
					$("#message_dialog_body").html("An error occured while trying to save.");
				}

				$("#cropper_grey_out").css("display", "block");
				Creatable.resize();
			}
		);
	}
}*/

/*YourSpecialChef.Submit = function(){
	var difficulty = $("#submit_difficulty").val();
	var category = $("#submit_category").val();
	var sub_category = $("#submit_sub_category").val();
	var creator = $("#submit_creator").val();

	Creatable.ProcessingRequest();

	//TODO::
	//I don't know what the client will look like :)
	$.post("recipe-creator-submit-recipe.php",
		{ difficulty: difficulty,
			category: category,
			subCategory: sub_category,
			creator: creator,
			recipeID: YourSpecialChef.Recipe.id,
			recipeTitle: YourSpecialChef.Recipe.title,
			recipeHTML: YourSpecialChef.Recipe.data,
			recipeDateTime: YourSpecialChef.Recipe.datetime
		},
		function(result){
			result = $.parseJSON(result);
			if (result.success){
				$("#message_dialog").css("display", "block");
				$("#message_dialog_title").html("Submitted");
				$("#message_dialog_body").html("Your Recipe has been submitted and will be under review.");
			}else{
				$("#message_dialog").css("display", "block");
				$("#message_dialog_title").html("Failure");
				$("#message_dialog_body").html("An error occured while trying to submit.");
			}

			$("#cropper_grey_out").css("display", "block");
			Creatable.resize();
		}
	);
}*/

/*YourSpecialChef.MyRecipes = function(callback){
	//Creatable.ProcessingRequest();
	//TODO::
	//I don't know what the client will look like :)
	$.post("recipe-creator-my-recipes.php",
		{ email: YourSpecialChef.account_email },
		function(result){
			result = $.parseJSON(result);
			if (result.success){
				Creatable.MyRecipes = result.recipes;
				callback();
				//Array of recipe objects of this form
				/*Recipe = {
					title:"Cheese Quesadilla",
					data:Creatable.getState(), //the html markup of the recipe
					datetime:Creatable.getDateTime() //time recipe wasa saved
				};
				//Each individual recipe from the array is of the same format
				//as the recipe object sent to server through the YourSpecialChef.Save method
			}
		}
	);
}*/

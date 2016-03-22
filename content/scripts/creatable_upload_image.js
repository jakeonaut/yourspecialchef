var cui_width;
var cui_height;
var cui_mLeft;
var cui_mTop;

Creatable.uploadedImagesCache = [];

//sorry my code is so messy and gross
var uploaded_image_to_be_deleted_index; //this is set in buttons.js when the delete X is clicked
var DeleteUploadedImage = function(){
	YourSpecialChef.DeleteUploadedImage(uploaded_image_to_be_deleted_index);
	$("#upload_picture").click();
}

var UploadImage = function(ev, filler){
	$("#uploaded_picture_cropper_container").css("display", "block");
	$("#cropper_grey_out").css("display", "block");

	SetupImageCropDialog(ev);
	$("#image_name_input").css("margin-bottom", "10px");
	$("#cropper_submit").unbind('click').bind('click', function(e){
		var img = document.createElement("img");
		img.src = ev.target.result;
		$(img).css("display", "none");
		$("body").append($(img));

		var ratio = $(img).width() / $("#target").width();

		var co = document.createElement('canvas');
		console.log($(img).width() + ", " + $(img).height());
		co.width = $(img).width();
		co.height = $(img).height();
		co.getContext('2d').drawImage(img, 0, 0, co.width, co.height);

		var c = document.createElement('canvas');
		c.width = cui_width*ratio;
		c.height = cui_height*ratio;
		c.getContext('2d').drawImage(co,
			cui_mLeft*ratio, cui_mTop*ratio,
			cui_width*ratio, cui_height*ratio,
			0, 0, c.width, c.height);

		var csmall = document.createElement('canvas');
		var width = c.width > 256 ? 256 : c.width;
		var height = c.height > 256 ? 256 : c.height;
		csmall.width = width;
		csmall.height = height;
		csmall.style.width = width+"px";
		csmall.style.height = height+"px";
		csmall.getContext('2d').drawImage(c,
			0, 0, c.width, c.height,
			0, 0, csmall.width, csmall.height);

		var img_name = $("#image_name_input").val();

		Creatable.uploadedImagesCache.push({name: img_name, src: csmall.toDataURL()});
    	YourSpecialChef.SaveUploadedImages();
		CloseDialogs();
		SelectUploadPicture(filler);
		$(img).remove();
	});
	$("#cropper_submit").focus();
};

var SetupImageCropDialog = function(ev){
	//Reset the cropper html
	$("#cropper_div").html('');
	var target = document.createElement('img');
	target.id = 'target';

	var preview_pane = document.createElement('div');
	preview_pane.id = 'preview-pane';
	preview_pane.innerHTML = "preview";

	var preview_container = document.createElement('div');
	preview_container.className = 'preview-container';

	var img = document.createElement('img');
	img.className = "jcrop-preview";

	var image_name_input = document.createElement('input');
	image_name_input.type = "text";
	image_name_input.value = "Picture " + (Creatable.uploadedImagesCache.length + 1);
	image_name_input.maxLength = "20";
	image_name_input.marginBottom = "10px";
	image_name_input.id = "image_name_input";

	var title_text = document.createElement("h3");
	title_text.innerHTML = "Picture Title: ";
	title_text.style.marginTop = "0px";
	title_text.style.marginBottom = "3px";

	$("#cropper_div").append(title_text);
	$("#cropper_div").append(image_name_input);
	$("#cropper_div").append(target);
	preview_container.appendChild(img);
	preview_pane.appendChild(preview_container);
	$("#cropper_div").append(preview_pane);

	//Render thumbnail
	$("#target")[0].src = ev.target.result;
	$("#preview-pane .preview-container img")[0].src = ev.target.result;
	//Creatable.uploadedImagesCache.push(ev.target.result);
	// Create variables (in this scope) to hold the API and image size
	var jcrop_api,
		boundx,
		boundy,

		// Grab some information about the preview pane
		$preview = $('#preview-pane'),
		$pcnt = $('#preview-pane .preview-container'),
		$pimg = $('#preview-pane .preview-container img'),

		xsize = $pcnt.width(),
		ysize = $pcnt.height();

	$('#target').Jcrop({
	  onChange: updatePreview,
	  onSelect: updatePreview,
	  aspectRatio: xsize / ysize
	},function(){
	  // Use the API to get the real image size
	  var bounds = this.getBounds();
	  boundx = bounds[0];
	  boundy = bounds[1];
	  // Store the API in the jcrop_api variable
	  jcrop_api = this;

	  // Move the preview into the jcrop container for css positioning
	  $preview.appendTo(jcrop_api.ui.holder);
	});

	var src = ev.target.result;
	function updatePreview(c)
	{
	  if (parseInt(c.w) > 0)
	  {
		var rx = xsize / c.w;
		var ry = ysize / c.h;

		cui_width = c.w;
		cui_height = c.h;
		cui_mLeft = c.x;
		cui_mTop = c.y;

		$pimg.css({
		  width: Math.round(rx * boundx) + 'px',
		  height: Math.round(ry * boundy) + 'px',
		  marginLeft: '-' + Math.round(rx * c.x) + 'px',
		  marginTop: '-' + Math.round(ry * c.y) + 'px'
		});
	  }
	};
	var c = {w:0, h:0, x:0, y:0};
	if ($("#target").width() > $("#target").height()){
		c.w = $("#target").height();
	}else{ c.w = $("#target").width(); }
	c.h = c.w;
	updatePreview(c);

	Creatable.resize(false);
}

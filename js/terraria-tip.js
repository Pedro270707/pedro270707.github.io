const textInput = document.getElementById("terraria-text-input");
const itemInputText = document.getElementById("item-input-text");
const itemOutput = document.getElementById("item-output");
const outputItem = document.getElementById("output-item");
const terrariaTip = document.getElementById("terraria-tip");
const tipTextLine = document.getElementById("tip-text-line");
const tipShadowLine = document.getElementById("tip-shadow-line");
const outputTextLine = document.getElementById("output-text-line");
const outputShadowLine = document.getElementById("output-shadow-line");
const itemCount = document.getElementById("item-count");
const itemCountInput = document.getElementById("item-count-input");

var favoriteCursor = false;
var favoriteSlot = false;

function updateItem(event) {
	itemInputText.innerHTML = "Alterar imagem do item";
	outputItem.src = URL.createObjectURL(event.target.files[0]);
}

$(document).on('input propertychange', textInput, function () {
	textOutputFormatted = textInput.value.replace(/&el/g, '§r<br class="empty-line">');
	textOutputFormatted = textOutputFormatted.replace(/&nbsp/g, '§r<div class="no-break-space"></div>');
	textOutputFormatted = textOutputFormatted.replace(/&/g, '&amp;');
	textOutputFormatted = textOutputFormatted.replace(/</gi, "&lt;");
	textOutputFormatted = textOutputFormatted.replace(/</g, "&gt;");
	textOutputFormatted = textOutputFormatted.replace(/\\\\/g, '&#92;');
	textOutputFormatted = textOutputFormatted.replace(/\\n/g, '§r<br class="break">');
	textOutputFormatted = textOutputFormatted.replace(/\\/g, '');
	textOutputFormatted = textOutputFormatted.replace(/§a/g, '</span><span class="c-1">');
	textOutputFormatted = textOutputFormatted.replace(/§b/g, '</span><span class="c0">');
	textOutputFormatted = textOutputFormatted.replace(/§c/g, '</span><span class="c1">');
	textOutputFormatted = textOutputFormatted.replace(/§d/g, '</span><span class="c2">');
	textOutputFormatted = textOutputFormatted.replace(/§e/g, '</span><span class="c3">');
	textOutputFormatted = textOutputFormatted.replace(/§f/g, '</span><span class="c4">');
	textOutputFormatted = textOutputFormatted.replace(/§g/g, '</span><span class="c5">');
	textOutputFormatted = textOutputFormatted.replace(/§h/g, '</span><span class="c6">');
	textOutputFormatted = textOutputFormatted.replace(/§i/g, '</span><span class="c7">');
	textOutputFormatted = textOutputFormatted.replace(/§j/g, '</span><span class="c8">');
	textOutputFormatted = textOutputFormatted.replace(/§k/g, '</span><span class="c9">');
	textOutputFormatted = textOutputFormatted.replace(/§l/g, '</span><span class="c10">');
	textOutputFormatted = textOutputFormatted.replace(/§m/g, '</span><span class="c11">');
	textOutputFormatted = textOutputFormatted.replace(/§n/g, '</span><span class="c-11">');
	textOutputFormatted = textOutputFormatted.replace(/§o/g, '</span><span class="c-12">');
	textOutputFormatted = textOutputFormatted.replace(/§p/g, '</span><span class="c-13">');
	textOutputFormatted = textOutputFormatted.replace(/§z/g, '<i class="co">');
	textOutputFormatted = textOutputFormatted.replace(/§r/g, '</span></b></i></n></m>');

	if (textOutputFormatted == '') {
		tipTextLine.innerHTML = "Nomes de itens do Terraria";
		tipShadowLine.innerHTML = "Nomes de itens do Terraria";
		outputTextLine.innerHTML = "Nomes de itens do Terraria";
		outputShadowLine.innerHTML = "Nomes de itens do Terraria";
	} else {
		tipTextLine.innerHTML = textOutputFormatted;
		tipShadowLine.innerHTML = textOutputFormatted;
		outputTextLine.innerHTML = textOutputFormatted;
		outputShadowLine.innerHTML = textOutputFormatted;
	}
});

$(document).on('input propertychange', itemCountInput, function () {
	itemCount.innerHTML = itemCountInput.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
});

$('.slot-item').mouseover(function(event) {
        var $PosTop = $(this).position().top;
        var $PosLeft = $(this).position().left;
});

$(".terraria-item").mouseover(function(event) {
  $(terrariaTip).css("display", "block");
  // Sets X position of the tip, considering possible overflow to the right
  if (window.innerWidth - event.pageX - 11 < $(terrariaTip).outerWidth(true)) {
	var x = event.pageX - $(terrariaTip).outerWidth(true);  
  } else {
	var x = event.pageX + 14;
  }
  
  var y = event.pageY + 14;
  
  $(terrariaTip).css("left", x);
  $(terrariaTip).css("top", y);
});

$(".terraria-item").mousemove(function(event) {
  // Sets X position of the tip, considering possible overflow to the right
  if (window.innerWidth - event.pageX - 11 < $(terrariaTip).outerWidth(true)) {
	var x = event.pageX - $(terrariaTip).outerWidth(true);  
  } else {
	var x = event.pageX + 14;
  }
  
  var y = event.pageY + 14;
  
  $(terrariaTip).css("left", x);
  $(terrariaTip).css("top", y);
});

$(".terraria-item").mouseout(function(event) {
  $(terrariaTip).css("display", "none");
});

document.addEventListener("keydown", function(event) {
    if (event.key == "Control"){
        itemOutput.classList.add("favorite-cursor");
		favoriteCursor = true;
	}
});

document.addEventListener("keyup", function(event) {
    if (event.key == "Control"){
        itemOutput.classList.remove("favorite-cursor");
		favoriteCursor = false;
	}
});

itemOutput.onclick = function() {
	if (favoriteCursor == true) {
		if (favoriteSlot == true) {
			itemOutput.classList.remove("favorite");
			favoriteSlot = false;
		} else {
			itemOutput.classList.add("favorite");
			favoriteSlot = true;
		}
	}
}

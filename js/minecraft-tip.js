const textInput = document.getElementById("minecraft-text-input");
const itemInputText = document.getElementById("item-input-text");
const outputItem = document.getElementById("output-item");
const mcTip = document.getElementById("minecraft-tip");
const itemGlow = document.getElementById("item-glow");
const obfuscatedTextManager = document.getElementById("k-manager");
const tipTextLine = document.getElementById("tip-text-line");
const tipShadowLine = document.getElementById("tip-shadow-line");
const outputTextLine = document.getElementById("output-text-line");
const outputShadowLine = document.getElementById("output-shadow-line");
const limitKCheckbox = document.getElementById("k-limited");
const numberKCheckbox = document.getElementById("k-numbers-only");
const superSecretSettings = document.getElementById("super-secret-settings");

function updateItem(event) {
	itemInputText.innerHTML = "Alterar imagem do item";
	outputItem.src = URL.createObjectURL(event.target.files[0]);
}

/*
 * @author Kyrptonaught
 * @link github.com/kyrptonaught
 */
function replace(input, beginStr, endStr, match, replaceWith) {
	let beginIndex = input.indexOf(beginStr);
	let endIndex = input.indexOf(endStr, beginIndex);

	while (beginIndex > -1 && endIndex > -1) {
		let matchIndex = input.indexOf(match, beginIndex);

		while (matchIndex > beginIndex && matchIndex < endIndex) {
			input = input.substring(0, matchIndex) + replaceWith + input.substring(matchIndex + match.length);

			matchIndex = input.indexOf(match, beginIndex);
		}


		beginIndex = input.indexOf(beginStr, endIndex);
		endIndex = input.indexOf(endStr, beginIndex);
	}
	return input;
}
	
$(document).on('input propertychange', "textarea[name='Texto do Minecraft']", function () {
	textOutputFormatted = textInput.value.replace(/</gi, "&lt;");
	textOutputFormatted = textOutputFormatted.replace(/</g, "&gt;");
	textOutputFormatted = textOutputFormatted.replace(/\\\\/g, '&#92;');
	textOutputFormatted = textOutputFormatted.replace(/\\n/g, '§r<br class="break">');
	textOutputFormatted = textOutputFormatted.replace(/\\/g, '');
	textOutputFormatted = textOutputFormatted.replace(/&el/g, '§r<br class="empty-line">');
	textOutputFormatted = textOutputFormatted.replace(/&nbsp/g, '§r<div class="no-break-space"></div>');
	if (!textOutputFormatted.substring(textOutputFormatted.lastIndexOf("§k")).includes("§r")) {
		textOutputFormatted += "§r"
	}
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§0", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§1", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§2", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§3", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§4", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§5", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§6", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§7", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§8", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§9", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§a", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§b", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§c", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§d", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§e", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§f", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§g", "");
	textOutputFormatted = replace(textOutputFormatted, "§k", "§r", "§h", "");
	textOutputFormatted = textOutputFormatted.replace(/§0/g, '</span><span class="c-0">');
	textOutputFormatted = textOutputFormatted.replace(/§1/g, '</span><span class="c-1">');
	textOutputFormatted = textOutputFormatted.replace(/§2/g, '</span><span class="c-2">');
	textOutputFormatted = textOutputFormatted.replace(/§3/g, '</span><span class="c-3">');
	textOutputFormatted = textOutputFormatted.replace(/§4/g, '</span><span class="c-4">');
	textOutputFormatted = textOutputFormatted.replace(/§5/g, '</span><span class="c-5">');
	textOutputFormatted = textOutputFormatted.replace(/§6/g, '</span><span class="c-6">');
	textOutputFormatted = textOutputFormatted.replace(/§7/g, '</span><span class="c-7">');
	textOutputFormatted = textOutputFormatted.replace(/§8/g, '</span><span class="c-8">');
	textOutputFormatted = textOutputFormatted.replace(/§9/g, '</span><span class="c-9">');
	textOutputFormatted = textOutputFormatted.replace(/§a/g, '</span><span class="c-a">');
	textOutputFormatted = textOutputFormatted.replace(/§b/g, '</span><span class="c-b">');
	textOutputFormatted = textOutputFormatted.replace(/§c/g, '</span><span class="c-c">');
	textOutputFormatted = textOutputFormatted.replace(/§d/g, '</span><span class="c-d">');
	textOutputFormatted = textOutputFormatted.replace(/§e/g, '</span><span class="c-e">');
	textOutputFormatted = textOutputFormatted.replace(/§f/g, '</span><span class="c-f">');
	textOutputFormatted = textOutputFormatted.replace(/§g/g, '</span><span class="c-g">');
	textOutputFormatted = textOutputFormatted.replace(/§h/g, '</span><span class="c-6-bedrock">');
	textOutputFormatted = textOutputFormatted.replace(/§l/g, '<b class="c-l">');
	textOutputFormatted = textOutputFormatted.replace(/§o/g, '<i class="c-o">');
	textOutputFormatted = textOutputFormatted.replace(/§n/g, '<n class="c-n">');
	textOutputFormatted = textOutputFormatted.replace(/§m/g, '<m class="c-m">');
	textOutputFormatted = textOutputFormatted.replace(/§k/g, '<k class="c-k">');
	textOutputFormatted = textOutputFormatted.replace(/§r/g, '</span></b></i></n></m></k>');
	obfuscatedTextManager.innerHTML = textOutputFormatted.replace(/<k class="c-k">/g, '<k class="c-k-manager">');

	if (textOutputFormatted == '</span></b></i></n></m></k>') {
		tipTextLine.innerHTML = "Nomes de itens do Minecraft";
		tipShadowLine.innerHTML = "Nomes de itens do Minecraft";
		outputTextLine.innerHTML = "Nomes de itens do Minecraft";
		outputShadowLine.innerHTML = "Nomes de itens do Minecraft";
	} else {
		tipTextLine.innerHTML = textOutputFormatted;
		tipShadowLine.innerHTML = textOutputFormatted;
		outputTextLine.innerHTML = textOutputFormatted;
		outputShadowLine.innerHTML = textOutputFormatted;
	}
	
	if (textOutputFormatted == 'supersecretsettings</span></b></i></n></m></k>') {
		superSecretSettings.style.display = "block";
	}
});

limitKCheckbox.addEventListener('change', () => {
  if (limitKCheckbox.checked) {
    numberKCheckbox.disabled = true;
  } else {
    numberKCheckbox.disabled = false;
  }
});

numberKCheckbox.addEventListener('change', () => {
  if (numberKCheckbox.checked) {
    limitKCheckbox.disabled = true;
  } else {
    limitKCheckbox.disabled = false;
  }
});

$('.slot-item').mouseover(function(event) {
        var $PosTop = $(this).position().top;
        var $PosLeft = $(this).position().left;
        $(itemGlow).insertAfter($(this)).css({display: 'block', top: $PosTop + 2, left: $PosLeft + 2});
		$(itemGlow).attr("data-mctitle", $(this).attr("data-mctitle"));
		if($(this).attr("data-mclore") != undefined) {
			$(itemGlow).attr("data-mclore", $(this).attr("data-mclore"));
		} else {
			$(itemGlow).removeAttr("data-mclore");
		}
});
$('.item-output').mouseover(function() {
        $(itemGlow).css("display", "block");
});
$('.item-output').mouseout(function() {
        $(itemGlow).css("display", "none");
});

$(".minecraft-item").mouseover(function(event) {
  $(mcTip).css("display", "block");
  // Sets X position of the tip, considering possible overflow to the right
  if (window.innerWidth - event.pageX - 11 - event.pageX % 2 < $(mcTip).outerWidth(true)) {
	var x = event.pageX - event.pageX % 2 - $(mcTip).outerWidth(true);  
  } else {
	var x = event.pageX + 13 - event.pageX % 2;
  }
  // Sets Y position of the tip, considering possible overflow to the top
  if (event.pageY - 28 - event.pageY % 2 < $(document).scrollTop()) {
	  var y = event.pageY + 17 - event.pageY % 2 - $(document).scrollTop();
  } else {
	  var y = event.pageY - 31 - event.pageY % 2 - $(document).scrollTop();
  }
  $(mcTip).css("left", x);
  $(mcTip).css("top", y);
});

$(".minecraft-item").mousemove(function(event) {
  // Sets X position of the tip, considering possible overflow to the right
  if (window.innerWidth - event.pageX - 11 - event.pageX % 2 < $(mcTip).outerWidth(true)) {
	var x = event.pageX - event.pageX % 2 - $(mcTip).outerWidth(true);  
  } else {
	var x = event.pageX + 13 - event.pageX % 2;
  }
  // Sets Y position of the tip, considering possible overflow to the top
  if (event.pageY - 28 - event.pageY % 2 < $(document).scrollTop()) {
	  var y = event.pageY + 17 - event.pageY % 2 - $(document).scrollTop();
  } else {
	  var y = event.pageY - 31 - event.pageY % 2 - $(document).scrollTop();
  }
  $(mcTip).css("left", x);
  $(mcTip).css("top", y);
});

$(".minecraft-item").mouseout(function(event) {
  $(mcTip).css("display", "none");
});

setInterval(function() {
  randomizeText();
}, 50);

function randomizeText(obftext) {
	for (var group = 0; group < document.getElementsByClassName("c-k-manager").length; group++) {
		var length = document.getElementsByClassName("c-k-manager")[group].textContent.length;
		var result = "";
		if (limitKCheckbox.checked) {
			var widthNine = 'æÆ';
			var widthSeven = 'øØ';
			var widthSix = '@~«»';
			var widthFive = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdeghjmnopqrsuvwxyzÀÁÂÈÊËÓÔÕÚßãõ0123456789#$%&-=_+\\/?ÇüéâäàåçêëèÄÅÉôöòûùÖÜ£×áóúñÑ¿®¬±÷';
			var widthFour = 'fk<>°';
			var widthThree = '¨I[]{}()^î*ïîtÍ';
			var widthTwo = 'íìl´`'
			var widthOne = "iı'!,.:;|¡·";
		} else if (numberKCheckbox.checked) {
			var largeCharacters = '0123456789';
			var smallCharacters = "i'!,.:;|¡";
		} else {
			var largeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjklmnopqrstuvwxyzÀÁÂÈÊËÍÓÔÕÚßãõğİıŒœŞşŴŵžȇ#$%&"*+-/0123456789<=>?@[\]^_`{}~ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αβΓπΣσμτΦΘΩδ∞∅∈∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■';
			var smallCharacters = "i'!,.:;|¡";
		}
			
		for (var i = 0; i < length; i++) {
			if (limitKCheckbox.checked) {
				if (widthNine.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthNine.charAt(Math.floor(Math.random() * widthNine.length));
				} else if (widthSeven.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthSeven.charAt(Math.floor(Math.random() * widthSeven.length));
				} else if (widthSix.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthSix.charAt(Math.floor(Math.random() * widthSix.length));
				} else if (widthFour.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthFour.charAt(Math.floor(Math.random() * widthFour.length));
				} else if (widthThree.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthThree.charAt(Math.floor(Math.random() * widthThree.length));
				} else if (widthTwo.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthTwo.charAt(Math.floor(Math.random() * widthTwo.length));
				} else if (widthOne.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthOne.charAt(Math.floor(Math.random() * widthOne.length));
				} else {
					result += widthFive.charAt(Math.floor(Math.random() * widthFive.length));
				}
			} else {
				if (smallCharacters.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += smallCharacters.charAt(Math.floor(Math.random() * smallCharacters.length));
				} else {
					result += largeCharacters.charAt(Math.floor(Math.random() * largeCharacters.length));
				}
			}
		}
		
		tipTextLine.getElementsByClassName("c-k")[group].innerHTML = result;
		tipShadowLine.getElementsByClassName("c-k")[group].innerHTML = result;
		outputTextLine.getElementsByClassName("c-k")[group].innerHTML = result;
		outputShadowLine.getElementsByClassName("c-k")[group].innerHTML = result;
	}
}
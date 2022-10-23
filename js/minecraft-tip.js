var textInput = document.getElementById("minecraft-text-input");
var itemInputText = document.getElementById("item-input-text");
var outputItem = document.getElementById('output-item');
var mcTip = document.getElementById("minecraft-tip");
var itemGlow = document.getElementById("item-glow");
var obfuscatedTextManager = document.getElementById("k-manager");
var tipTextLine = document.getElementById("tip-text-line");
var tipShadowLine = document.getElementById("tip-shadow-line");
var outputTextLine = document.getElementById("output-text-line");
var outputShadowLine = document.getElementById("output-shadow-line");

var breakCount = 0

function updateItem(event) {
	itemInputText.innerHTML = "Alterar item (.png)";
	outputItem.src = URL.createObjectURL(event.target.files[0]);
}

textInput.onkeyup = function() {
	textOutputFormatted = textInput.value.replace(/</gi, "&lt;");
	textOutputFormatted = textOutputFormatted.replace(/</g, "&gt;");
	textOutputFormatted = textOutputFormatted.replace(/&br/g, '§r<br class="break">');
	textOutputFormatted = textOutputFormatted.replace(/&el/g, '§r<br class="empty-line">');
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
	
	if (textOutputFormatted.match(/<br class="break">/g) != null) {
		breakCount = textOutputFormatted.match(/<br class="break">/g).length;
	} else {
		breakCount = 0;
	}

	tipTextLine.innerHTML = textOutputFormatted;
	tipShadowLine.innerHTML = textOutputFormatted;
	outputTextLine.innerHTML = textOutputFormatted;
	outputShadowLine.innerHTML = textOutputFormatted;
}

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
  if (window.innerWidth - event.pageX - 17 - event.pageX % 2 < $(mcTip).outerWidth(true)) {
	var x = event.pageX - event.pageX % 2 - $(mcTip).outerWidth(true);  
  } else {
	var x = event.pageX + 9 - event.pageX % 2;
  }
  // Sets Y position of the tip, considering possible overflow to the top
  if (event.pageY - 28 - event.pageY % 2 - breakCount * 22 < $(document).scrollTop()) {
	  var y = event.pageY + 20 - event.pageY % 2 - $(document).scrollTop();
  } else {
	  var y = event.pageY - 28 - event.pageY % 2 - breakCount * 22 - $(document).scrollTop();
  }
  $(mcTip).css("left", x);
  $(mcTip).css("top", y);
});

$(".minecraft-item").mousemove(function(event) {
  // Sets X position of the tip, considering possible overflow to the right
  if (window.innerWidth - event.pageX - 17 - event.pageX % 2 < $(mcTip).outerWidth(true)) {
	var x = event.pageX - event.pageX % 2 - $(mcTip).outerWidth(true);  
  } else {
	var x = event.pageX + 9 - event.pageX % 2;
  }
  // Sets Y position of the tip, considering possible overflow to the top
  if (event.pageY - 28 - event.pageY % 2 - breakCount * 22 < $(document).scrollTop()) {
	  var y = event.pageY + 20 - event.pageY % 2 - $(document).scrollTop();
  } else {
	  var y = event.pageY - 28 - event.pageY % 2 - breakCount * 22 - $(document).scrollTop();
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
		var largeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyzÀÁÂÈÊËÍÓÔÕÚßãõğİıŒœŞşŴŵžȇ#$%&"*+-/0123456789<=>?@[\]^_`{}~ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αβΓπΣσμτΦΘΩδ∞∅∈∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■';
		var smallCharacters = "i'!,.:;|¡";
			
		for (var i = 0; i < length; i++) {
			if (smallCharacters.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
				result += smallCharacters.charAt(Math.floor(Math.random() * 9));
			} else {
				result += largeCharacters.charAt(Math.floor(Math.random() * 246));
			}
		}
		
		tipTextLine.getElementsByClassName("c-k")[group].innerHTML = result;
		tipShadowLine.getElementsByClassName("c-k")[group].innerHTML = result;
		outputTextLine.getElementsByClassName("c-k")[group].innerHTML = result;
		outputShadowLine.getElementsByClassName("c-k")[group].innerHTML = result;
	}
}
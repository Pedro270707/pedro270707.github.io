var textOutput = document.getElementById("minecraft-text-output");
var textInput = document.getElementById("minecraft-text-input");
var itemInputText = document.getElementById("item-input-text");
var outputItem = document.getElementById('output-item');
var mcTip = document.getElementById("minecraft-tip");
var itemGlow = document.getElementById("item-glow");
var obfuscatedTextManager = document.getElementById("k-manager");

var breakCount = 0

function updateItem(event) {
	itemInputText.innerHTML = "Alterar item (.png)";
	outputItem.src = URL.createObjectURL(event.target.files[0]);
}

textInput.onkeyup = function() {
	textOutputFormatted = textInput.value.replace(/</gi, "&lt;");
	textOutputFormatted = textOutputFormatted.replace(/</g, "&gt;");
	// textOutputFormatted = textOutputFormatted.replace(/&el/g, '<br><br>');
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
	obfuscatedTextManager.innerHTML = textOutputFormatted.replace(/<k class="c-k">/g, '<k id="c-k-manager">');
	var textOutputArray = textOutputFormatted.split("&br");
	
	breakCount = textOutputArray.length - 1;

	var textOutputReformatted = "";
	textOutputArray.forEach(function(element, index, array) {
		textOutputReformatted += "<p class='tip-line'>" + element + "</span></m><shadow class='shadow'>" + element + "</span></shadow></p>";
		if (index + 1 != array.length) {
			textOutputReformatted += "<br class='break'>";
		}
		if (textOutputReformatted != "<p class='tip-line'></span></m><shadow class='shadow'></span></shadow></p>") {
			textOutput.innerHTML = textOutputReformatted;
			mcTip.innerHTML = textOutputReformatted;
		} else {
			textOutput.innerHTML = "Nomes de itens do Minecraft";
			mcTip.innerHTML = "Nomes de itens do Minecraft";
		}
	});
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

/* setInterval(function() {
  randomizeText();
}, 50);

function randomizeText(obftext) {
		for (var group = 0; group < document.querySelectorAll("k#c-k-manager").length; group++) {
			var length = document.querySelectorAll("k#c-k-manager")[group].textContent.length;
			var result = "";
			var largeCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyzÀÁÂÈÊËÍÓÔÕÚßãõğİıŒœŞşŴŵžȇ#$%&"*+-/0123456789<=>?@[\]^_`{}~ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αβΓπΣσμτΦΘΩδ∞∅∈∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■';
			var smallCharacters = "i'!,.:;|¡";
			
			for (var i = 0; i < length; i++) {
				if (smallCharacters.includes(document.querySelectorAll("k#c-k-manager")[group].textContent.charAt(i))) {
					result += smallCharacters.charAt(Math.floor(Math.random() * 9));
				} else {
					result += largeCharacters.charAt(Math.floor(Math.random() * 246));
				}
			}
			
		//if(document.querySelectorAll("k.c-k")[group].firstChild.nodeName == '#text') {
		//	for (i = 0; i < document.getElementsByClassName("tip-line").length; i++) {
		//		document.querySelectorAll("k.c-k")[group].firstChild.textContent = result;
		//		document.querySelectorAll(".shadow")[group].firstChild.firstChild.textContent = result;
		//	}
		//} else if(document.querySelectorAll("k.c-k")[group].firstChild.firstChild.nodeName == '#text') {
		//	for (i = 0; i < document.getElementsByClassName("tip-line").length; i++) {
		//		document.querySelectorAll("k.c-k")[group].firstChild.firstChild.textContent = result;
		//		document.querySelectorAll(".shadow")[group].firstChild.firstChild.textContent = result;
		//	}
		// }
		
		for (var i = 1; i <= document.querySelectorAll("k#c-k-manager").length * 4; i++) {
			if(document.querySelectorAll("k.c-k")[group].firstChild.nodeName == '#text') {
				document.querySelectorAll("k.c-k")[group].firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length].firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length * 2].firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length * 3].firstChild.textContent = result;
			}
			if(document.querySelectorAll("k.c-k")[group].children != ) {
				document.querySelectorAll("k.c-k")[group].firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length].firstChild.firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length * 2].firstChild.firstChild.textContent = result;
				document.querySelectorAll("k.c-k")[group + document.querySelectorAll("k#c-k-manager").length * 3].firstChild.firstChild.textContent = result;
			}
		}
		
		// if(document.querySelectorAll("k.c-k")[group].firstChild.nodeName == '#text') {
			// document.querySelectorAll("k.c-k")[group].firstChild.textContent = result;
		// } else if(document.querySelectorAll("k.c-k")[group].firstChild.firstChild.nodeName == '#text') {
			// document.querySelectorAll("k.c-k")[group].firstChild.firstChild.textContent = result;
		// }
	}
} */
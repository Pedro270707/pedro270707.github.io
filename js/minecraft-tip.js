var textOutput = document.getElementById("minecraft-text-output");
var textInput = document.getElementById("minecraft-text-input");
var itemInput = document.getElementById("item-input");
var outputItem = document.getElementById('output-item');
var mcTip = document.getElementById("minecraft-tip");
var itemGlow = document.getElementById("item-glow");

var breakCount = 0

function updateItem(event) {
	itemInput.classList.add("hidden");
	outputItem.src = URL.createObjectURL(event.target.files[0]);
}

textInput.onkeyup = function() {
	textOutputFormatted = textInput.value.replace(/</gi, "&lt;");
	textOutputFormatted = textOutputFormatted.replace(/</gi, "&gt;");
	textOutputFormatted = textOutputFormatted.replace(/§br§/gi, '<br class="break">');
	textOutputFormatted = textOutputFormatted.replace(/§el§/gi, '<br><br>');
	textOutputFormatted = textOutputFormatted.replace(/§0/gi, '</span><span class="c-0">');
	textOutputFormatted = textOutputFormatted.replace(/§1/gi, '</span><span class="c-1">');
	textOutputFormatted = textOutputFormatted.replace(/§2/gi, '</span><span class="c-2">');
	textOutputFormatted = textOutputFormatted.replace(/§3/gi, '</span><span class="c-3">');
	textOutputFormatted = textOutputFormatted.replace(/§4/gi, '</span><span class="c-4">');
	textOutputFormatted = textOutputFormatted.replace(/§5/gi, '</span><span class="c-5">');
	textOutputFormatted = textOutputFormatted.replace(/§6/gi, '</span><span class="c-6">');
	textOutputFormatted = textOutputFormatted.replace(/§7/gi, '</span><span class="c-7">');
	textOutputFormatted = textOutputFormatted.replace(/§8/gi, '</span><span class="c-8">');
	textOutputFormatted = textOutputFormatted.replace(/§9/gi, '</span><span class="c-9">');
	textOutputFormatted = textOutputFormatted.replace(/§a/gi, '</span><span class="c-a">');
	textOutputFormatted = textOutputFormatted.replace(/§b/gi, '</span><span class="c-b">');
	textOutputFormatted = textOutputFormatted.replace(/§c/gi, '</span><span class="c-c">');
	textOutputFormatted = textOutputFormatted.replace(/§d/gi, '</span><span class="c-d">');
	textOutputFormatted = textOutputFormatted.replace(/§e/gi, '</span><span class="c-e">');
	textOutputFormatted = textOutputFormatted.replace(/§f/gi, '</span><span class="c-f">');
	textOutputFormatted = textOutputFormatted.replace(/§g/gi, '</span><span class="c-g">');
	textOutputFormatted = textOutputFormatted.replace(/§h/gi, '</span><span class="c-6-bedrock">');
	textOutputFormatted = textOutputFormatted.replace(/§l/gi, '<b class="c-l">');
	textOutputFormatted = textOutputFormatted.replace(/§o/gi, '<i class="c-o">');
	textOutputFormatted = textOutputFormatted.replace(/§n/gi, '<n class="c-n">');
	textOutputFormatted = textOutputFormatted.replace(/§m/gi, '<m class="c-m">');
	textOutputFormatted = textOutputFormatted.replace(/§r/gi, '</span></b></i></n></m>');
	textOutputFormatted = textOutputFormatted + "</span>"
	if (textOutputFormatted == "" || textOutputFormatted == "</span>") {
		textOutputFormatted = "Nomes de itens do Minecraft";
	}
	if (textOutputFormatted.match("<br") != null) {
		breakCount = [...textOutputFormatted.matchAll("<br")].length;
	} else {
		breakCount = 0
	}
	textOutput.innerHTML = textOutputFormatted;
	mcTip.innerHTML = textOutputFormatted;
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
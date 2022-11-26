const textInput = document.getElementById("minecraft-text-input");
const textOutputContainer = document.getElementById('minecraft-text-output-container');
const itemCountInput = document.getElementById("item-count-input");
const itemInputText = document.getElementById("item-input-text");
const outputItem = document.getElementById("output-item");
const mcTip = document.getElementById("minecraft-tip-container");
const itemCount = document.getElementById("item-count");
const itemGlow = document.getElementById("item-glow");
const obfuscatedTextManager = document.getElementById("k-manager");
const tipTextLine = document.getElementById("tip-text-line");
const tipShadowLine = document.getElementById("tip-shadow-line");
const outputTextLine = document.getElementById("output-text-line");
const outputShadowLine = document.getElementById("output-shadow-line");
const limitKCheckbox = document.getElementById("k-limited");
const numberKCheckbox = document.getElementById("k-numbers-only");
const superSecretSettings = document.getElementById("super-secret-settings");
const resolutionSlider = document.getElementById('resolution-slider');
const downloadOverlay = document.getElementById('download-overlay');
var translate = new Translate();

document.getElementById("item-input-upload").addEventListener('change', function(event) {
	itemInputText.innerHTML = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 374.116 374.116\" style=\"enable-background:new 0 0 374.116 374.116; fill: currentColor; width: 16px; vertical-align: -2px;\" xml:space=\"preserve\"><g><path d=\"M344.058,207.506c-16.568,0-30,13.432-30,30v76.609h-254v-76.609c0-16.568-13.432-30-30-30c-16.568,0-30,13.432-30,30v106.609c0,16.568,13.432,30,30,30h314c16.568,0,30-13.432,30-30V237.506C374.058,220.938,360.626,207.506,344.058,207.506z\"/><path d=\"M123.57,135.915l33.488-33.488v111.775c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30V102.426l33.488,33.488c5.857,5.858,13.535,8.787,21.213,8.787c7.678,0,15.355-2.929,21.213-8.787c11.716-11.716,11.716-30.71,0-42.426L208.271,8.788c-11.715-11.717-30.711-11.717-42.426,0L81.144,93.489c-11.716,11.716-11.716,30.71,0,42.426C92.859,147.631,111.855,147.631,123.57,135.915z\"/></g></svg> " + getKeyWrapped('minecrafttooltips-changeitem');
	outputItem.src = URL.createObjectURL(event.target.files[0]);
});

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
	var textOutputFormatted = textInput.value.replace(/&/g, '&amp;')
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/&amp;el/g, '§r<br class="empty-line">')
		.replace(/&amp;nbsp/g, '§r<div class="no-break-space"></div>')
		.replace(/\\\\/g, '&#92;')
		.replace(/\\n/g, '§r<br class="break">')
		.replace(/\\/g, '');
	
	if (!textOutputFormatted.substring(textOutputFormatted.lastIndexOf("§k")).includes("§r")) {
		textOutputFormatted += "§r";
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
	
	textOutputFormatted = textOutputFormatted.replace(/§0/g, '</span><span class="c-0">')
		.replace(/§1/g, '</span><span class="c-1">')
		.replace(/§2/g, '</span><span class="c-2">')
		.replace(/§3/g, '</span><span class="c-3">')
		.replace(/§4/g, '</span><span class="c-4">')
		.replace(/§5/g, '</span><span class="c-5">')
		.replace(/§6/g, '</span><span class="c-6">')
		.replace(/§7/g, '</span><span class="c-7">')
		.replace(/§8/g, '</span><span class="c-8">')
		.replace(/§9/g, '</span><span class="c-9">')
		.replace(/§a/g, '</span><span class="c-a">')
		.replace(/§b/g, '</span><span class="c-b">')
		.replace(/§c/g, '</span><span class="c-c">')
		.replace(/§d/g, '</span><span class="c-d">')
		.replace(/§e/g, '</span><span class="c-e">')
		.replace(/§f/g, '</span><span class="c-f">')
		.replace(/§g/g, '</span><span class="c-g">')
		.replace(/§h/g, '</span><span class="c-6-bedrock">')
		.replace(/§l/g, '<b class="c-l">')
		.replace(/§o/g, '<i class="c-o">')
		.replace(/§n/g, '<n class="c-n">')
		.replace(/§m/g, '<m class="c-m">')
		.replace(/§k/g, '<k class="c-k">')
		.replace(/§r/g, '</span></b></i></n></m></k>');
	
	obfuscatedTextManager.innerHTML = textOutputFormatted.replace(/<k class="c-k">/g, '<k class="c-k-manager">');

	if (textOutputFormatted == '</span></b></i></n></m></k>') {
		tipTextLine.innerHTML
		= tipShadowLine.innerHTML
		= outputTextLine.innerHTML
		= outputShadowLine.innerHTML
		= getKeyWrapped('minecrafttooltips-defaulttooltip');
	} else {
		tipTextLine.innerHTML
		= tipShadowLine.innerHTML
		= outputTextLine.innerHTML
		= outputShadowLine.innerHTML
		= textOutputFormatted;
	}
	
	if (textInput.value.trim() == 'supersecretsettings') {
		superSecretSettings.style.display = "block";
	}
});

$(document).on('input propertychange', "textarea[name='Número de itens']", function () {
	itemCount.innerHTML = itemCountInput.value.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
});

limitKCheckbox.addEventListener('change', () => {
  if (!limitKCheckbox.checked) {
    numberKCheckbox.disabled = false;
	return;
  }
  numberKCheckbox.disabled = true;
});

numberKCheckbox.addEventListener('change', () => {
  if (!numberKCheckbox.checked) {
    limitKCheckbox.disabled = false;
	return;
  }
  limitKCheckbox.disabled = true;
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

var randomizeTextInterval = setInterval(function() {
  randomizeText();
}, 50);

function randomizeText() {
	for (var group = 0; group < document.getElementsByClassName("c-k-manager").length; group++) {
		var length = document.getElementsByClassName("c-k-manager")[group].textContent.length;
		var result = "";
		if (limitKCheckbox.checked) {
			var widthNine = 'æÆ';
			var widthEight = '░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀'
			var widthSeven = 'øØ∞∅⌠⌡∙';
			var widthSix = '@~«»≡≈√';
			var widthFive = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdeghjmnopqrsuvwxyzÀÁÂÈÊËÓÔÕÚßãõ0123456789#$%&-=_+\\/?ÇüéâäàåçêëèÄÅÉôöòûùÖÜ£×áóúñÑ¿®¬±÷∈≥≤π';
			var widthFour = 'fk<>°ⁿ⁰²³⁴⁵⁶⁷⁸⁹ªº';
			var widthThree = '¨I[]{}()^î*ïîtÍ¹';
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
				} else if (widthEight.includes(document.getElementsByClassName("c-k-manager")[group].textContent.charAt(i))) {
					result += widthEight.charAt(Math.floor(Math.random() * widthEight.length));
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
		
		tipTextLine.getElementsByClassName("c-k")[group].innerHTML
		= tipShadowLine.getElementsByClassName("c-k")[group].innerHTML
		= outputTextLine.getElementsByClassName("c-k")[group].innerHTML
		= outputShadowLine.getElementsByClassName("c-k")[group].innerHTML
		= result;
	}
}

var resize = function(img, scale, id) {

  var zoom=parseInt(img.zoom*scale);
  if(zoom<1){
    console.log('Cannot recale image to less than original size');
    return;
  }

  // get the pixels from the original img using a canvas
  var c1=document.createElement('canvas');
  var cw1=c1.width=img.width;
  var ch1=c1.height=img.height;
  var ctx1=c1.getContext('2d');
  ctx1.drawImage(img,0,0);
  var imgData1=ctx1.getImageData(0,0,cw1,ch1);
  var data1=imgData1.data;

  // create a canvas to hold the resized pixels
  var c2=document.createElement('canvas');
  c2.id=id;
  c2.zoom=zoom;
  var cw2=c2.width=cw1*scale;
  var ch2=c2.height=ch1*scale;
  var ctx2=c2.getContext('2d');
  var imgData2=ctx2.getImageData(0,0,cw2,ch2);
  var data2=imgData2.data;

  // copy each source pixel from c1's data1 into the c2's data2
  for(var y = 0; y/2<ch2; y += 2) {
    for(var x = 0; x/2<cw2; x += 2) {
      var i1=(Math.floor((y+1)/(2 * scale))*cw1+Math.floor((x+1)/(2 * scale)))*4;
      var i2 =(y*cw2+x)*2;            
      data2[i2]   = data1[i1];
      data2[i2+1] = data1[i1+1];
      data2[i2+2] = data1[i1+2];
      data2[i2+3] = data1[i1+3];
    }
  }

  // put the modified pixels back onto c2
  ctx2.putImageData(imgData2,0,0);

  // return the canvas with the zoomed pixels
  return(c2);
}

function downloadTooltip(canvasScale = 1) {
	clearInterval(randomizeTextInterval);
	$('#minecraft-output-border').css("left", "calc(950% + 2px)");
	
	domtoimage.toPng(textOutputContainer, {width: textOutputContainer.clientWidth * 20, height: textOutputContainer.clientHeight * 20, style: {transform: 'scale(20)', transformOrigin: 'top center'}})
		.then(function (dataUrl) {
			var img = new Image;
			img.onload = function() {
				let resizedImg = resize(resize(img, 0.05, 'canvasResized'), canvasScale, 'canvasResized');
				let link = document.createElement('a');
				let today = new Date();
				link.download = translate.getKey('minecrafttooltips-tooltipfile') + ' ' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds() + '.' + today.getMilliseconds() + '.png';
				link.href = resizedImg.toDataURL();
				link.click();
			}
			img.src = dataUrl;
			
			$('#minecraft-output-border').css("left", "2px");
			randomizeTextInterval = setInterval(function() {
				randomizeText();
			}, 50);
		})
		.catch(function (error) {
			console.error('Algo deu errado na geração da imagem', error);
			
			$('#minecraft-output-border').css("left", "2px");
			randomizeTextInterval = setInterval(function() {
				randomizeText();
			}, 50);
		});
}

function downloadItem(canvasScale = 1) {
	$('#output-item').css("left", "calc(" + (canvasScale - 1) * 50 + "% + 2px)");
	$('#item-count').css("right", "calc(-" + (canvasScale - 1) * 50 + "%");
	domtoimage.toPng(document.getElementById('item-output'), {width: document.getElementById('item-output').clientWidth * canvasScale, height: document.getElementById('item-output').clientHeight * canvasScale, style: {transform: 'scale(' + canvasScale + ')', transformOrigin: 'top center', marginTop: '0'}, quality: 1.0})
		.then(function (dataUrl) {
			let link = document.createElement('a');
			let today = new Date();
			link.download = translate.getKey('minecrafttooltips-itemfile') + ' ' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds() + '.' + today.getMilliseconds() + '.png';
			link.href = dataUrl;
			link.click();
			$('#output-item').css("left", "2px");
			$('#item-count').css("right", "0");
		})
		.catch(function (error) {
			console.error('Algo deu errado na geração da imagem', error);
			$('#output-item').css("left", "2px");
			$('#item-count').css("right", "0");
		});
}

var fixResolution = function(resolution) {
	if (resolution.value == '' || parseInt(resolution.value, 10) < 1) {
		resolution.value = 1;
	} else if (parseInt(resolution.value, 10) > 50) {
		resolution.value = 50;
	}
}

document.getElementById('download-tooltip').onclick = function() {
	downloadOverlay.style.display = 'flex';
	document.getElementById('download-overlay-download-button').onclick = function() {
		downloadOverlay.style.display = 'none';
		fixResolution(resolutionSlider);
		downloadTooltip(Math.round(resolutionSlider.value));
	}
}

document.getElementById('download-item').onclick = function() {
	downloadOverlay.style.display = 'flex';
	fixResolution(resolutionSlider);
	document.getElementById('download-overlay-download-button').onclick = function() {
		downloadOverlay.style.display = 'none';
		fixResolution(resolutionSlider);
		downloadItem(Math.round(resolutionSlider.value));
	}
}

document.getElementById('download-overlay-background').onclick = function() {
	downloadOverlay.style.display = 'none';
}

resolutionSlider.oninput = function() {
	document.getElementById('image-resolution').innerHTML = resolutionSlider.value;
	if (resolutionSlider.value > 5) {
		document.getElementById('resolution-warning').style.display = 'inline';
	} else {
		document.getElementById('resolution-warning').style.display = 'none';
	}
}
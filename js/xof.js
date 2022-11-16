var iterationNumber = 1;

const generateNewXof = function() {
	iterationNumber += 1;
	if (iterationNumber.toString().slice(-2) != "11" && iterationNumber.toString().slice(-2) != "12" && iterationNumber.toString().slice(-2) != "13") {
		switch (iterationNumber % 10) {
			case 1:
				var iterationOrdinal = "st";
				break;
			case 2:
				var iterationOrdinal = "nd";
				break;
			case 3:
				var iterationOrdinal = "rd";
				break;
			default:
				var iterationOrdinal = "th";
		}
	} else {
		var iterationOrdinal = "th";
	}
	document.getElementsByClassName("xof-button")[document.getElementsByClassName("xof-button").length - 1].disabled = true;
	document.getElementsByClassName("xof-button")[document.getElementsByClassName("xof-button").length - 1].setAttribute( "onclick", "" );
	var newButton = document.createElement("button");
	newButton.classList.add("small-button");
	newButton.classList.add("blue-button");
	newButton.classList.add("xof-button");
	newButton.setAttribute( "onClick", "javascript: generateNewXof();" );
	newButton.innerHTML = "xof";
	document.body.appendChild(newButton);
	var newXof = document.createElement("div");
	newXof.classList.add("xof-container");
	newXof.innerHTML="<img src=\"/assets/xof/xof.gif\"> The " + iterationNumber + iterationOrdinal + " Iteration"
	document.body.appendChild(newXof);
}
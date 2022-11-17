const goldenXof = 5000;
const arcticXof = 1000;

if (localStorage.iterationnumber == undefined) {
	localStorage.iterationnumber = "1";
}

const generateXof = function(iterationNumber, disableLastButton) {
	if (iterationNumber.toString().slice(-2) != "11" && iterationNumber.toString().slice(-2) != "12" && iterationNumber.toString().slice(-2) != "13") {
		switch (parseInt(iterationNumber, 10) % 10) {
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
	if (disableLastButton) {
		document.getElementsByClassName("xof-button")[document.getElementsByClassName("xof-button").length - 1].disabled = true;
		document.getElementsByClassName("xof-button")[document.getElementsByClassName("xof-button").length - 1].setAttribute( "onclick", "" );
	}
	var newXof = document.createElement("div");
	newXof.classList.add("xof-container");
	if (parseInt(iterationNumber, 10) % goldenXof == 0) {
		newXof.innerHTML="<div class=\"xof-image\"><img src=\"/assets/xof/golden-xof.gif\"></div> The " + iterationNumber + iterationOrdinal + " Iteration";
	} else if (parseInt(iterationNumber, 10) >= arcticXof) {
		newXof.innerHTML="<div class=\"xof-image\"><img src=\"/assets/xof/arctic-xof.gif\"></div> The " + iterationNumber + iterationOrdinal + " Iteration";
	} else {
		newXof.innerHTML="<div class=\"xof-image\"><img src=\"/assets/xof/xof.gif\"></div> The " + iterationNumber + iterationOrdinal + " Iteration"
	}
	document.body.appendChild(newXof);
	var newButton = document.createElement("button");
	newButton.classList.add("small-button");
	newButton.classList.add("blue-button");
	newButton.classList.add("xof-button");
	newButton.setAttribute( "onClick", "javascript: generateNewXof();" );
	newButton.innerHTML = "xof";
	document.body.appendChild(newButton);
}

const generateNewXof = function() {
	localStorage.iterationnumber = String(parseInt(localStorage.iterationnumber, 10) + 1);
	generateXof(localStorage.iterationnumber, true);
}

if (parseInt(localStorage.iterationnumber, 10) < 2000) {
	for (i = 1; i <= parseInt(localStorage.iterationnumber, 10); i++) {
		generateXof(i);
	}
} else {
	generateXof(parseInt(localStorage.iterationnumber, 10));
}
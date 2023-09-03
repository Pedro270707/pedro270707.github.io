var darkModeButton = document.getElementById("dark-mode-toggle");

if (localStorage.darkmode == undefined) {
	localStorage.darkmode = "false";
} else if (localStorage.darkmode == "true") {
	document.body.classList.add("dark-mode");
	if (darkModeButton) {
		translate.translateString('mainpage-disabledarkmode').then(str => {
			darkModeButton.innerHTML = str;
		});
		darkModeButton.dataset.string = 'mainpage-disabledarkmode';
	}
}

function toggleDarkMode() {
	if (localStorage.darkmode == "false") {
		document.body.classList.add("dark-mode");
		localStorage.darkmode = "true";
		translate.translateString('mainpage-disabledarkmode').then(str => {
			darkModeButton.innerHTML = str;
		});
		darkModeButton.dataset.string = 'mainpage-disabledarkmode';
	} else {
		document.body.classList.remove("dark-mode");
		localStorage.darkmode = "false";
		translate.translateString('mainpage-enabledarkmode').then(str => {
			darkModeButton.innerHTML = str;
		});
		darkModeButton.dataset.string = 'mainpage-enabledarkmode';
	}
}
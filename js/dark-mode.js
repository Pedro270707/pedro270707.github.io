var darkModeButton = document.getElementById("dark-mode-toggle");
var translate = new Translate();

if (localStorage.darkmode == undefined) {
	localStorage.darkmode = "false";
} else if (localStorage.darkmode == "true") {
	document.body.classList.add("dark-mode");
	darkModeButton.innerHTML = translate.getKey('mainpage-disabledarkmode');
	darkModeButton.dataset.string = 'mainpage-disabledarkmode';
}

function toggleDarkMode() {
	if (localStorage.darkmode == "false") {
		document.body.classList.add("dark-mode");
		localStorage.darkmode = "true";
		darkModeButton.innerHTML = translate.getKey('mainpage-disabledarkmode');
		darkModeButton.dataset.string = 'mainpage-disabledarkmode';
	} else {
		document.body.classList.remove("dark-mode");
		localStorage.darkmode = "false";
		darkModeButton.innerHTML = translate.getKey('mainpage-enabledarkmode');
		darkModeButton.dataset.string = 'mainpage-enabledarkmode';
	}
}
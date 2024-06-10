var darkModeButton = document.getElementById("dark-mode-toggle");

if (localStorage.darkmode == undefined) {
	localStorage.darkmode = "false";
} else if (localStorage.darkmode == "true") {
	document.body.classList.add("dark-mode");
	if (darkModeButton) {
		translate.whenLoaded(() => {
			darkModeButton.innerHTML = translate.translateString('mainpage-disabledarkmode');
		});
		darkModeButton.dataset.string = '{"translate":"mainpage-disabledarkmode"}';
	}
}

function toggleDarkMode() {
	if (localStorage.darkmode == "false") {
		document.body.classList.add("dark-mode");
		localStorage.darkmode = "true";
		translate.whenLoaded(() => {
			darkModeButton.innerHTML = translate.translateString('mainpage-disabledarkmode');
		});
		darkModeButton.dataset.string = '{"translate":"mainpage-disabledarkmode"}';
	} else {
		document.body.classList.remove("dark-mode");
		localStorage.darkmode = "false";
		translate.whenLoaded(() => {
			darkModeButton.innerHTML = translate.translateString('mainpage-enabledarkmode');
		});
		darkModeButton.dataset.string = '{"translate":"mainpage-enabledarkmode"}';
	}
}
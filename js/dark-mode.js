let darkModeButton;

document.addEventListener("DOMContentLoaded", () => {
	darkModeButton = document.getElementById("dark-mode-toggle");
	if (localStorage.darkmode == undefined) {
		localStorage.darkmode = "false";
	} else if (localStorage.darkmode == "true") {
		document.body.classList.add("dark-mode");
		if (darkModeButton) {
			translate.whenLoaded(() => {
				darkModeButton.innerHTML = translate.translateString('mainpage-disabledarkmode');
			});
			translate.setAttribute(darkModeButton, "string", new TranslatableText("mainpage-disabledarkmode"));
		}
	}
});

function toggleDarkMode() {
	if (localStorage.darkmode == "false") {
		document.body.classList.add("dark-mode");
		localStorage.darkmode = "true";
		translate.whenLoaded(() => {
			darkModeButton.innerHTML = translate.translateString('mainpage-disabledarkmode');
		});
		translate.setAttribute(darkModeButton, "string", new TranslatableText("mainpage-disabledarkmode"));
	} else {
		document.body.classList.remove("dark-mode");
		localStorage.darkmode = "false";
		translate.whenLoaded(() => {
			darkModeButton.innerHTML = translate.translateString('mainpage-enabledarkmode');
		});
		translate.setAttribute(darkModeButton, "string", new TranslatableText("mainpage-enabledarkmode"));
	}
}
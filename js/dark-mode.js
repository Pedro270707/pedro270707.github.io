var darkModeButton = document.getElementById("dark-mode-toggle");

if (localStorage.darkmode == undefined) {
	localStorage.darkmode = "false";
} else if (localStorage.darkmode == "true") {
	document.body.classList.add("dark-mode");
	darkModeButton.innerHTML = "[ativar modo claro]";
}

function toggleDarkMode() {
	if (localStorage.darkmode == "false") {
		document.body.classList.add("dark-mode");
		localStorage.darkmode = "true";
		darkModeButton.innerHTML = "[ativar modo claro]";
	} else {
		document.body.classList.remove("dark-mode");
		localStorage.darkmode = "false";
		darkModeButton.innerHTML = "[ativar modo escuro]";
	}
}
var cookieCounter = document.getElementById("cookie-counter");
var workerCounter = document.getElementById("worker-counter");
var clickerLevelCounter = document.getElementById("clicker-level-counter");

var workerButtonText = document.getElementById("hire-worker-text");
var upgradeClickerButtonText = document.getElementById("upgrade-clicker-text");

console.log("Loaded");

if (!localStorage.getItem("cookie-clicker")) {
	localStorage.setItem("cookie-clicker", defaultCookieClickerData());
} else {
	let json = JSON.parse(localStorage.getItem("cookie-clicker"));
	cookieAmount = json["cookies"];
	workerAmount = json["workers"];
	clickerLevel = json["clicker-level"];
}
recountAll();

function defaultCookieClickerData() {
	return '{"cookies":0,"workers":0,"clicker-level":1}'
}

setInterval(function () {
	cookieAmount += workerAmount;
	recountCookies();
}, 1000);

function recountAll() {
	recountCookies();
	recountWorkers();
	recountClickerLevel();
	workerCost = Math.ceil(Math.pow(workerAmount / 1.75, 2));
	clickerCost = Math.ceil(Math.pow(clickerLevel / 1.5, 2));
}

function recountClickerLevel() {
	clickerCost = Math.ceil(Math.pow(clickerLevel / 1.5, 2));
	translate.setAttribute(clickerLevelCounter, "string", new TranslatableText("cookieclicker-clickerlevel", clickerLevel));
	translate.setAttribute(upgradeClickerButtonText, "string", new TranslatableText("cookieclicker-clickerlevelbutton", clickerCost));
}

function recountCookies() {
	switch (cookieAmount) {
		case 0:
			setCookieString('cookieclicker-zerocookies', cookieAmount);
			break;
		case 1:
			setCookieString('cookieclicker-onecookie', cookieAmount);
			break;
		case 2:
			setCookieString('cookieclicker-twocookies', cookieAmount);
			break;
		default:
			setCookieString('cookieclicker-pluralcookies', cookieAmount);
	}
	let json = JSON.parse(localStorage.getItem("cookie-clicker"));
	json["cookies"] = cookieAmount;
	localStorage.setItem("cookie-clicker", JSON.stringify(json));
}

function recountWorkers() {
	workerCost = Math.ceil(Math.pow(workerAmount / 1.75, 2));
	workerButtonText.innerHTML = translate.getKeyWrapped('cookieclicker-hireworkerbutton', workerCost);
	switch (workerAmount) {
		case 0:
			setWorkerString('cookieclicker-zeroworkers', workerAmount);
			break;
		case 1:
			setWorkerString('cookieclicker-oneworker', workerAmount);
			break;
		case 2:
			setWorkerString('cookieclicker-twoworkers', workerAmount);
			break;
		default:
			setWorkerString('cookieclicker-pluralworkers', workerAmount);
	}
	let json = JSON.parse(localStorage.getItem("cookie-clicker"));
	json["workers"] = workerAmount;
	localStorage.setItem("cookie-clicker", JSON.stringify(json));
}

function cookieClicked() {
	cookieAmount += clickerLevel;
	recountCookies();
}

function hireWorker() {
	if (cookieAmount >= workerCost) {
		cookieAmount -= workerCost
		workerAmount += 1;
		recountCookies();
		recountWorkers();
	}
}

function upgradeClicker() {
	if (cookieAmount >= clickerCost) {
		cookieAmount -= clickerCost
		recountCookies();
		clickerLevel += 1;
		recountClickerLevel();
	}
	let json = JSON.parse(localStorage.getItem("cookie-clicker"));
	json["clicker-level"] = clickerLevel;
	localStorage.setItem("cookie-clicker", JSON.stringify(json));
}

function setCookieString(key, cookieAmount) {
	translate.setAttribute(cookieCounter, "string", new TranslatableText(key, cookieAmount));
}

function setWorkerString(key, workerAmount) {
	translate.setAttribute(workerCounter, "string", new TranslatableText(key, workerAmount));
}
var cookieCounter = document.getElementById("cookie-counter");
var workerCounter = document.getElementById("worker-counter");
var clickerLevelCounter = document.getElementById("clicker-level-counter");

var workerButtonText = document.getElementById("hire-worker-text");
var upgradeClickerButtonText = document.getElementById("upgrade-clicker-text");
var translate = new Translate();

console.log("Loaded");
if (cookieAmount == undefined) {
	var cookieAmount = 0;
}

if (workerAmount == undefined) {
	var workerAmount = 0;
}

if (clickerLevel == undefined) {
	var clickerLevel = 1;
}

if (workerCost == undefined) {
	var workerCost = 10;
}

if (clickerCost == undefined) {
	var clickerCost = 10;
}

function recountCookies() {
	switch (cookieAmount) {
		case 0:
			cookieCounter.innerHTML = cookieAmount + " " + getKeyWrapped('cookieclicker-zerocookies');
			break;
		case 1:
			cookieCounter.innerHTML = cookieAmount + " " + getKeyWrapped('cookieclicker-onecookie');
			break;
		case 2:
			cookieCounter.innerHTML = cookieAmount + " " + getKeyWrapped('cookieclicker-twocookies');
			break;
		default:
			cookieCounter.innerHTML = cookieAmount + " " + getKeyWrapped('cookieclicker-pluralcookies');
	}
}

function recountWorkers() {
	switch (workerAmount) {
		case 0:
			workerCounter.innerHTML = workerAmount + " " + getKeyWrapped('cookieclicker-zeroworkers');
			break;
		case 1:
			workerCounter.innerHTML = workerAmount + " " + getKeyWrapped('cookieclicker-oneworker');
			break;
		case 2:
			workerCounter.innerHTML = workerAmount + " " + getKeyWrapped('cookieclicker-twoworkers');
			break;
		default:
			workerCounter.innerHTML = workerAmount + " " + getKeyWrapped('cookieclicker-pluralworkers');
	}
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
		workerCost = Math.ceil(Math.pow(workerCost / 1.3, 1.2));
		workerButtonText.innerHTML = getKeyWrapped('cookieclicker-hireworkerbutton') + " " + workerCost;
		
		setInterval(function () {
			cookieAmount++
			recountCookies();
		}, 1000);
	}
}

function upgradeClicker() {
	if (cookieAmount >= clickerCost) {
		cookieAmount -= clickerCost
		recountCookies();
		clickerLevel += 1;
		clickerLevelCounter.innerHTML = getKeyWrapped('cookieclicker-clickerlevelbefore') + clickerLevel + getKeyWrapped('cookieclicker-clickerlevelafter');
		
		clickerCost = Math.ceil(Math.pow(clickerCost / 1.3, 1.25));
		upgradeClickerButtonText.innerHTML = getKeyWrapped('cookieclicker-clickerlevelbutton') + " " + clickerCost;
	}
}
var cookieCounter = document.getElementById("cookie-counter");
var workerCounter = document.getElementById("worker-counter");
var clickerLevelCounter = document.getElementById("clicker-level-counter");

var workerButtonText = document.getElementById("hire-worker-text");
var upgradeClickerButtonText = document.getElementById("upgrade-clicker-text");

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
	if (cookieAmount > -2 && cookieAmount < 2) {
		cookieCounter.innerHTML = cookieAmount + " cookie";
	} else {
		cookieCounter.innerHTML = cookieAmount + " cookies";
	}
}

function cookieClicked() {
	cookieAmount = cookieAmount + clickerLevel;
	recountCookies();
}

function hireWorker() {
	if (cookieAmount >= workerCost) {
		cookieAmount = cookieAmount - workerCost
		recountCookies();
		workerAmount = workerAmount + 1;
		if (workerAmount > -2 && workerAmount < 2) {
			workerCounter.innerHTML = workerAmount + " funcionário";
		} else {
			workerCounter.innerHTML = workerAmount + " funcionários";
		}
		workerCost = Math.ceil(Math.pow(workerCost / 1.3, 1.2));
		workerButtonText.innerHTML = "Contratar funcionário por " + workerCost;
	}
}

function upgradeClicker() {
	if (cookieAmount >= clickerCost) {
		cookieAmount = cookieAmount - clickerCost
		recountCookies();
		clickerLevel = clickerLevel + 1;
		clickerLevelCounter.innerHTML = "Cursor nível " + clickerLevel;
		
		clickerCost = Math.ceil(Math.pow(clickerCost / 1.3, 1.25));
		upgradeClickerButtonText.innerHTML = "Melhorar cursor por " + clickerCost;
	}
}

setInterval(function () {
	cookieAmount = cookieAmount + workerAmount
	recountCookies();
}, 1000);
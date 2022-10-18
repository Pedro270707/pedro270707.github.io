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

function cookieClicked() {
	cookieAmount = cookieAmount + clickerLevel;
	if (cookieAmount == 1) {
		cookieCounter.innerHTML = "1 cookie";
	} else {
		cookieCounter.innerHTML = cookieAmount + " cookies";
	}
}

function hireWorker() {
	if (cookieAmount >= workerCost) {
		cookieAmount = cookieAmount - workerCost
		if (cookieAmount == 1) {
			cookieCounter.innerHTML = "1 cookie";
		} else {
			cookieCounter.innerHTML = cookieAmount + " cookies";
		}
		workerAmount = workerAmount + 1;
		if (workerAmount == 0 || workerAmount == 1) {
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
		if (cookieAmount == 1) {
			cookieCounter.innerHTML = "1 cookie";
		} else {
			cookieCounter.innerHTML = cookieAmount + " cookies";
		}
		clickerLevel = clickerLevel + 1;
		clickerLevelCounter.innerHTML = "Cursor nível " + clickerLevel;
		
		clickerCost = Math.ceil(Math.pow(clickerCost / 1.3, 1.25));
		upgradeClickerButtonText.innerHTML = "Melhorar cursor por " + clickerCost;
	}
}

setInterval(function () {
	cookieAmount = cookieAmount + workerAmount
	if (cookieAmount == 1) {
		cookieCounter.innerHTML = "1 cookie";
	} else {
		cookieCounter.innerHTML = cookieAmount + " cookies";
	}
}, 1000);
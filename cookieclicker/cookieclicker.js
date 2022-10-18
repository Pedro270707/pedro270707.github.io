var cookieCounter = document.getElementById("cookie-counter");
var workerCounter = document.getElementById("worker-counter");
var clickerLevelCounter = document.getElementById("clicker-level-counter");
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

function cookieClicked() {
	cookieAmount = cookieAmount + clickerLevel;
	if (cookieAmount == 1) {
		cookieCounter.innerHTML = "1 cookie";
	} else {
		cookieCounter.innerHTML = cookieAmount + " cookies";
	}
}

function hireWorker() {
	if (cookieAmount >= 10) {
		cookieAmount = cookieAmount - 10
		if (cookieAmount == 1) {
			cookieCounter.innerHTML = "1 cookie";
		} else {
			cookieCounter.innerHTML = cookieAmount + " cookies";
		}
		workerAmount = workerAmount + 1;
		if (workerAmount == 1) {
			workerCounter.innerHTML = "1 worker";
		} else {
			workerCounter.innerHTML = workerAmount + " workers";
		}
	}
}

function upgradeClicker() {
	if (cookieAmount >= 10) {
		cookieAmount = cookieAmount - 10
		if (cookieAmount == 1) {
			cookieCounter.innerHTML = "1 cookie";
		} else {
			cookieCounter.innerHTML = cookieAmount + " cookies";
		}
		clickerLevel = clickerLevel + 1;
		clickerLevelCounter.innerHTML = "Level " + clickerLevel + " clicker";
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
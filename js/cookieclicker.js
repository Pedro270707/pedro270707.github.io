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
			cookieCounter.innerHTML = cookieAmount + " <span data-string=\"cookieclicker-zerocookies\">" + translate.getKey('cookieclicker-zerocookies') + "</span>";
			break;
		case 1:
			cookieCounter.innerHTML = cookieAmount + " <span data-string=\"cookieclicker-onecookie\">" + translate.getKey('cookieclicker-onecookie') + "</span>";
			break;
		case 2:
			cookieCounter.innerHTML = cookieAmount + " <span data-string=\"cookieclicker-twocookies\">" + translate.getKey('cookieclicker-twocookies') + "</span>";
			break;
		default:
			cookieCounter.innerHTML = cookieAmount + " <span data-string=\"cookieclicker-pluralcookies\">" + translate.getKey('cookieclicker-pluralcookies') + "</span>";
	}
}

function recountWorkers() {
	switch (workerAmount) {
		case 0:
			workerCounter.innerHTML = workerAmount + " <span data-string=\"cookieclicker-zeroworkers\">" + translate.getKey('cookieclicker-zeroworkers') + "</span>";
			break;
		case 1:
			workerCounter.innerHTML = workerAmount + " <span data-string=\"cookieclicker-oneworker\">" + translate.getKey('cookieclicker-oneworker') + "</span>";
			break;
		case 2:
			workerCounter.innerHTML = workerAmount + " <span data-string=\"cookieclicker-twoworkers\">" + translate.getKey('cookieclicker-twoworkers') + "</span>";
			break;
		default:
			workerCounter.innerHTML = workerAmount + " <span data-string=\"cookieclicker-pluralworkers\">" + translate.getKey('cookieclicker-pluralworkers') + "</span>";
	}
}

function cookieClicked() {
	cookieAmount = cookieAmount + clickerLevel;
	recountCookies();
}

function hireWorker() {
	if (cookieAmount >= workerCost) {
		cookieAmount -= workerCost
		recountCookies();
		workerAmount += 1;
		recountWorkers();
		workerCost = Math.ceil(Math.pow(workerCost / 1.3, 1.2));
		workerButtonText.innerHTML = "<span data-string=\"cookieclicker-hireworkerbutton\">" + translate.getKey('cookieclicker-hireworkerbutton') + "</span> " + workerCost;
		
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
		clickerLevelCounter.innerHTML = "<span data-string=\"cookieclicker-clickerlevelbefore\">" + translate.getKey('cookieclicker-clickerlevelbefore') + "</span>" + clickerLevel + "<span data-string=\"cookieclicker-clickerlevelafter\">" + translate.getKey('cookieclicker-clickerlevelafter') + "</span>";
		
		clickerCost = Math.ceil(Math.pow(clickerCost / 1.3, 1.25));
		upgradeClickerButtonText.innerHTML = "<span data-string=\"cookieclicker-clickerlevelbutton\">" + translate.getKey('cookieclicker-clickerlevelbutton') + "</span> " + clickerCost;
	}
}
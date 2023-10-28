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
}

function recountWorkers() {
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
		translate.getKeyWrapped('cookieclicker-hireworkerbutton', new LiteralText(workerCost)).then(str => {
			workerButtonText.innerHTML = str;
		});
		
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
		translate.getKeyWrapped('cookieclicker-clickerlevel', new LiteralText(clickerLevel)).then(str => {
			clickerLevelCounter.innerHTML = str;
		});
		
		clickerCost = Math.ceil(Math.pow(clickerCost / 1.3, 1.25));
		translate.getKeyWrapped('cookieclicker-clickerlevelbutton', clickerCost).then(str => {
			upgradeClickerButtonText.innerHTML = str;
		});
	}
}

function setCookieString(key, cookieAmount) {
	translate.getKeyWrapped(key, new LiteralText(cookieAmount)).then(str => {
		cookieCounter.innerHTML = str;
	});
}

function setWorkerString(key, workerAmount) {
	translate.getKeyWrapped(key, new LiteralText(workerAmount)).then(str => {
		workerCounter.innerHTML = str;
	});
}
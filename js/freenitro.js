const unlockItem2Button = document.getElementById("unlock-item-2-button");
const unlockItem2ButtonAlternate = document.getElementById("unlock-item-2-button-alternate");
const unlockItem3Button = document.getElementById("unlock-item-3-button");
const item2 = document.getElementById("item-2");
const item3 = document.getElementById("item-3");
const bottom = document.getElementById("bottom");
const nameInput = document.getElementById("name-input");

unlockItem2Button.addEventListener("click", function() {
	unlockItem2Button.disabled = true;
	item2.classList.remove("hidden");
	bottom.classList.remove("hidden");
	unlockItem3Button.classList.remove("hidden");
	nameInterval();
});

unlockItem2ButtonAlternate.addEventListener("click", function() {
	unlockItem2ButtonAlternate.disabled = true;
});

unlockItem3Button.addEventListener("click", function() {
	clearInterval(nameInputListener);
	bottom.classList.add("hidden");
	unlockItem3Button.classList.add("hidden");
	item3.classList.remove("hidden");
});

const nameInputListener = setInterval(function() {
	if (nameInput.value != '') {
		unlockItem3Button.disabled = false;
	} else {
		unlockItem3Button.disabled = true;
	}
}, 50);

const creeperCheckboxAdder = setInterval(function() {
	var creeperPattern = '';
	for (i = 0; i < document.getElementsByClassName("creeper-checkbox").length; i++) {
		creeperPattern += document.getElementsByClassName("creeper-checkbox")[i].checked ? 1 : 0;
	}
	switch (creeperPattern) {
		case '1101111011001000111001010':
			clearInterval(creeperCheckboxAdder);
			break;
		case '0000001010001000111001010':
			clearInterval(creeperCheckboxAdder);
	}
}, 300);

creeperCheckboxInterval();
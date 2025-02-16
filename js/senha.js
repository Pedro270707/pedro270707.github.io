let validCharacters = "aeiou0123456789-_@#$%&*";
let currentLastIndex = -1;
let amountOfCharacters = 5;
let selectedCharacter = -1;
let indicateWrongCharacters = false;

const gameFlexbox = document.getElementById("game-flexbox");
const keyboard = document.getElementById("keyboard");
const amountOfCharactersInput = document.getElementById("amount-of-characters");
const victoryText = document.getElementById("victory");
const restart = document.getElementById("restart");

let randomSequence = "12345";
let numberOfAttempts = 0;

function createCharacterSlot() {
    let characterSlot = document.createElement("span");
    characterSlot.classList.add("character-slot");
    characterSlot.innerHTML = '&nbsp;';
    characterSlot.addEventListener("mouseup", characterSlotMouseUp);
    return characterSlot;
}

function addNewCharacterSlotArray() {
    lockCharacterSlotArray();

    currentLastIndex += 1;
    selectedCharacter = 0;
    let newCharacterSlotArrayContainer = document.createElement("div");
    newCharacterSlotArrayContainer.classList.add("character-slots-container");
    newCharacterSlotArrayContainer.id = "array-container-" + currentLastIndex;

    let newCharacterSlots = document.createElement("div");
    newCharacterSlots.classList.add("character-slots");
    newCharacterSlots.id = "array-" + currentLastIndex;
    for (i = 0; i < amountOfCharacters; i++) {
        newCharacterSlots.appendChild(createCharacterSlot());
    }
    newCharacterSlotArrayContainer.appendChild(newCharacterSlots);
    gameFlexbox.appendChild(newCharacterSlotArrayContainer);
    incrementSlot(0);
}

function addNewGuessesArray(correctInWrongPlace, correctInCorrectPlace) {
    let newGuessesArray = document.createElement("div");
    newGuessesArray.classList.add("guess-container");
    newGuessesArray.id = "guesses-" + currentLastIndex;
    addIndicatorsOfType("correct-in-correct-place", correctInCorrectPlace, newGuessesArray);
    addIndicatorsOfType("correct-in-wrong-place", correctInWrongPlace, newGuessesArray);
    let wrong = amountOfCharacters - (correctInCorrectPlace + correctInWrongPlace);
    addIndicatorsOfType("wrong", wrong, newGuessesArray);

    document.getElementById("array-container-" + currentLastIndex).appendChild(newGuessesArray);
}

function addIndicatorsOfType(type, amount, parent) {
    for (let i = 0; i < amount; i++) {
        let guess = document.createElement("span");
        guess.classList.add("indicator", type);
        parent.appendChild(guess);
    }
}

function lockCharacterSlotArray(index = currentLastIndex, additionalClass) {
    let characterSlots = getCharacterSlotArray(index);
    if (characterSlots) {
        for (const el of characterSlots.children) {
            el.classList.remove("selected");
            el.classList.add("locked");
            if (additionalClass) {
                el.classList.add(additionalClass);
            }
        }
    }
}

function startNewGame(pAmountOfCharacters = 5) {
    numberOfAttempts = 0;
    gameFlexbox.innerHTML = '';
    victoryText.classList.add("invisible");
    amountOfCharacters = pAmountOfCharacters;
    randomSequence = getRandomCharacterSequence(amountOfCharacters);
    translate.whenLoaded(() => {
        console.log(translate.translateString("senha-gamestarted", randomSequence));
    })
    translate.setAttribute(document.getElementById("valid-characters"), "string", new TranslatableText("senha-validcharacters", validCharacters));
    amountOfCharactersInput.max = validCharacters.length;
    updateKeyboard();
    addNewCharacterSlotArray();
}

function updateKeyboard() {
    keyboard.innerHTML = '';
    for (let i = 0; i < validCharacters.length; i++) {
        keyboard.appendChild(createKey(validCharacters[i]));
        if (i == 9 || (validCharacters.length <= 9 && i == validCharacters.length - 1)) {
            keyboard.appendChild(createKey("Backspace"));
        }
    }
    keyboard.appendChild(createKey("Enter"));
}

function createKey(key) {
    let keyElement = document.createElement("button");
    keyElement.classList.add("button", "key");
    keyElement.addEventListener('click', (event) => simulateKeyPress(key));
    keyElement.innerHTML = key;
    return keyElement;
}

function getRandomCharacterSequence(pAmountOfCharacters = amountOfCharacters) {
    return shuffleString(validCharacters).slice(0, pAmountOfCharacters);
}

startNewGame(5);

function getSelectedCharacterSlot(withLetter) {
    let characterSlots = getCharacterSlotArray().children;
    if (characterSlots[selectedCharacter].innerHTML === '&nbsp;' && withLetter) {
        return (characterSlots[selectedCharacter - 1] && characterSlots[selectedCharacter - 1].innerHTML !== '&nbsp;') ? characterSlots[selectedCharacter - 1] : characterSlots[selectedCharacter];
    } else {
        return characterSlots[selectedCharacter];
    }
}

function getCharacterSlotArray(index = currentLastIndex) {
    return document.getElementById("array-" + index);
}

function getCharacterSlotArrayAsString(slotsIndex = currentLastIndex) {
    let characterSlots = getCharacterSlotArray(slotsIndex);
    let characters = '';
    for (const el of characterSlots.children) {
        characters += el.innerHTML;
    }
    return characters.replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&');
}

function incrementSlot(amount) {
    getSelectedCharacterSlot(false).classList.remove("selected");
    selectedCharacter = clamp(selectedCharacter + amount, 0, amountOfCharacters - 1);
    getSelectedCharacterSlot(false).classList.add("selected");
}

document.addEventListener("keyup", (event) => {
    let key = event.key;
    let selectedLetterCharacterSlot = getSelectedCharacterSlot(true);
    if (selectedLetterCharacterSlot.classList.contains("locked")) return;
    if (key === "Backspace") {
        let shouldIncrement = getSelectedCharacterSlot(false).innerHTML === '&nbsp;';
        if (selectedLetterCharacterSlot) {
            selectedLetterCharacterSlot.innerHTML = '&nbsp;';
        }
        if (shouldIncrement) {
            incrementSlot(-1);
        }
    } else if (key === "Enter") {
        let charactersInSlotArray = getCharacterSlotArrayAsString();
        if (!charactersInSlotArray.includes(' ') && !hasDuplicateLetters(charactersInSlotArray)) {
            numberOfAttempts++;
            translate.setAttribute(victoryText, "string", new TranslatableText("senha-victory", numberOfAttempts));
            if (charactersInSlotArray !== randomSequence) {
                addNewGuessesArray(getCorrectInWrongPlace(charactersInSlotArray), getCorrectInCorrectPlace(charactersInSlotArray));
                addNewCharacterSlotArray();
            } else {
                lockCharacterSlotArray(currentLastIndex, "win");
                victoryText.classList.remove("invisible");
            }
        }
        if (hasDuplicateLetters(charactersInSlotArray)) {
            let characterSlots = getCharacterSlotArray();
            for (const slot of Array.from(characterSlots.children)) {
                if (slot.innerHTML === '&nbsp;') {
                    continue;
                }
                if (charactersInSlotArray.split(slot.innerHTML).length - 1 > 1) {
                    pulseSlotError(slot, "duplicate-letter");
                }
            }
        }
        if (charactersInSlotArray.includes(' ')) {
            let characterSlots = getCharacterSlotArray();
            for (const slot of Array.from(characterSlots.children)) {
                if (slot.innerHTML === '&nbsp;') {
                    pulseSlotError(slot);
                }
            }
        }
    } else if (key === "ArrowLeft") {
        incrementSlot(-1);
    } else if (key === "ArrowRight") {
        incrementSlot(1);
    } else if (validCharacters.includes(key.toLowerCase())) {
        let selectedCharacterSlot = getSelectedCharacterSlot(false);
        if (selectedCharacterSlot) {
            selectedCharacterSlot.innerHTML = key.toLowerCase();
        }
        incrementSlot(1);
    }
});

function pulseSlotError(slot, errorClass = "error") {
    slot.style.transition = "none";
    slot.classList.add(errorClass);
    setTimeout(() => {
        slot.style.transition = "border-color 1s";
        slot.classList.remove(errorClass);
    }, 20);
}

function characterSlotMouseUp(event) {
    if (Array.from(event.target.classList).includes("locked")) return;
    let parent = event.target.parentElement;
    for (const child of parent.children) {
        child.classList.remove("selected");
    }
    event.target.classList.add("selected");
    selectedCharacter = Array.from(parent.children).indexOf(event.target);
}

restart.addEventListener("click", (event) => {
    amountOfCharactersInput.value = clamp(amountOfCharactersInput.value || 5, 1, validCharacters.length)
    startNewGame(amountOfCharactersInput.value);
    event.target.blur();
});

function getCorrectInCorrectPlace(input) {
    return Array.from(input).reduce((count, value, index) => count + (value === randomSequence[index] ? 1 : 0), 0);
}

function getCorrectInWrongPlace(input) {
    return Array.from(input).reduce((count, value, index) => count + (randomSequence.split(value).length - 1), 0) - getCorrectInCorrectPlace(input);
}

function setValidCharactersAndStartGame(str) {
    validCharacters = str;
    startNewGame(clamp(amountOfCharacters, 0, validCharacters.length));
}

function simulateKeyPress(key) {
    const event = new KeyboardEvent('keyup', { key });
    document.dispatchEvent(event);
}

function toggleWrongCharacterIndicator() {
    document.body.classList.toggle("indicate-wrong-characters", !indicateWrongCharacters);
    indicateWrongCharacters = !indicateWrongCharacters;
}

// Helper methods
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function hasDuplicateLetters(str) {
    const charCount = {};

    for (let char of str) {
        if (charCount[char]) {
            return true;
        }
        charCount[char] = 1;
    }

    return false;
}
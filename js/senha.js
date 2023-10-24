const validCharacters = "aeiou0123456789-_@#$%&*";
let currentLastIndex = -1;
let amountOfCharacters = 5;
let selectedCharacter = -1;

const gameFlexbox = document.getElementById("game-flexbox");

let randomSequence = "12345";
let numberOfAttempts = 0;

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
        let characterSlot = document.createElement("span");
        characterSlot.classList.add("character-slot");
        characterSlot.innerHTML = '&nbsp;';
        newCharacterSlots.appendChild(characterSlot);
        characterSlot.addEventListener("mouseup", characterSlotMouseUp);
    }
    newCharacterSlotArrayContainer.appendChild(newCharacterSlots);
    gameFlexbox.appendChild(newCharacterSlotArrayContainer);
    incrementSlot(0);
}

function addNewGuessesArray(correctInWrongPlace, correctInCorrectPlace) {
    let newGuessesArray = document.createElement("div");
    newGuessesArray.classList.add("guess-container");
    newGuessesArray.id = "guesses-" + currentLastIndex;
    let wrong = amountOfCharacters;
    for (let i = 0; i < correctInCorrectPlace; i++) {
        wrong--;
        let guess = document.createElement("span");
        guess.classList.add("indicator");
        guess.classList.add("correct-in-correct-place");
        newGuessesArray.appendChild(guess);
    }
    for (let i = 0; i < correctInWrongPlace; i++) {
        wrong--;
        let guess = document.createElement("span");
        guess.classList.add("indicator");
        guess.classList.add("correct-in-wrong-place");
        newGuessesArray.appendChild(guess);
    }
    for (let i = 0; i < wrong; i++) {
        let guess = document.createElement("span");
        guess.classList.add("indicator");
        guess.classList.add("wrong");
        newGuessesArray.appendChild(guess);
    }
    document.getElementById("array-container-" + currentLastIndex).appendChild(newGuessesArray);
}

function lockCharacterSlotArray(index = currentLastIndex) {
    let characterSlots = document.getElementById("array-" + index);
    if (characterSlots) {
        for (const el of characterSlots.children) {
            el.classList.remove("selected");
            el.classList.add("locked");
        }
    }
}

function startNewGame(pAmountOfCharacters = 5) {
    numberOfAttempts = 0;
    gameFlexbox.innerHTML = '';
    document.getElementById("victory").classList.add("invisible");
    amountOfCharacters = pAmountOfCharacters;
    randomSequence = getRandomCharacterSequence(amountOfCharacters);
    console.log("New game started! Random sequence: " + randomSequence);
    document.getElementById("valid-characters").innerHTML = validCharacters;
    addNewCharacterSlotArray();
}

function shuffleString(str) {
    const array = str.split('');
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join('');
}

function getRandomCharacterSequence(pAmountOfCharacters = amountOfCharacters) {
    return shuffleString(validCharacters).slice(0, pAmountOfCharacters);
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

startNewGame(5);

function getSelectedCharacterSlot(withLetter) {
    let characterSlots = document.getElementById("array-" + currentLastIndex).children;
    if (characterSlots[selectedCharacter].innerHTML === '&nbsp;' && withLetter) {
        return (characterSlots[selectedCharacter - 1] && characterSlots[selectedCharacter - 1].innerHTML !== '&nbsp;') ? characterSlots[selectedCharacter - 1] : characterSlots[selectedCharacter];
    } else {
        return characterSlots[selectedCharacter];
    }
}

function getCharactersInSlotArray(slotsIndex = currentLastIndex) {
    let characterSlots = document.getElementById("array-" + slotsIndex);
    let characters = '';
    for (const el of characterSlots.children) {
        characters += el.innerHTML;
    }
    return characters.replaceAll('&nbsp;', ' ').replaceAll('&amp;', '&');
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function incrementSlot(amount) {
    getSelectedCharacterSlot(false).classList.remove("selected");
    selectedCharacter = clamp(selectedCharacter + amount, 0, amountOfCharacters - 1);
    getSelectedCharacterSlot(false).classList.add("selected");
}

document.addEventListener("keyup", (event) => {
    let key = event.key;
    if (key === "Backspace") {
        let shouldIncrement = getSelectedCharacterSlot(false).innerHTML === '&nbsp;';
        let selectedCharacterSlot = getSelectedCharacterSlot(true);
        if (selectedCharacterSlot) {
            selectedCharacterSlot.innerHTML = '&nbsp;';
        }
        if (shouldIncrement) {
            incrementSlot(-1);
        }
    } else if (key === "Enter") {
        let charactersInSlotArray = getCharactersInSlotArray();
        if (!charactersInSlotArray.includes(' ') && !hasDuplicateLetters(charactersInSlotArray)) {
            numberOfAttempts++;
            document.getElementById("number-of-attempts").innerHTML = numberOfAttempts;
            if (charactersInSlotArray !== randomSequence) {
                addNewGuessesArray(getCorrectInWrongPlace(charactersInSlotArray), getCorrectInCorrectPlace(charactersInSlotArray));
                addNewCharacterSlotArray();
            } else {
                lockCharacterSlotArray();
                document.getElementById("victory").classList.remove("invisible");
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

$(".character-slot").on("mouseup", characterSlotMouseUp)

function characterSlotMouseUp(event) {
    if (Array.from(event.target.classList).includes("locked")) return;
    let parent = event.target.parentElement;
    for (const child of parent.children) {
        child.classList.remove("selected");
    }
    event.target.classList.add("selected");
    selectedCharacter = Array.from(parent.children).indexOf(event.target);
}

$("#restart").on("click", (event) => {
    let amountOfCharactersFromInput = document.getElementById("amount-of-characters").value || 3;
    startNewGame(clamp(amountOfCharactersFromInput, 1, validCharacters.length));
    event.target.blur();
});

function getCorrectInCorrectPlace(input) {
    let correctInCorrectPlace = 0;
    for (let i = 0; i < input.length; i++) {
        if (input[i] === randomSequence[i]) {
            correctInCorrectPlace++;
        }
    }
    return correctInCorrectPlace;
}

function getCorrectInWrongPlace(input) {
    let correctInWrongPlace = 0;
    let randomSequenceCopy = randomSequence;
    for (let i = input.length; i >= 0; i--) {
        if (input[i] === randomSequenceCopy[i]) {
            randomSequenceCopy = randomSequenceCopy.substring(0, i) + randomSequenceCopy.substring(i + 1);
        }
    }
    for (let i = 0; i < input.length; i++) {
        let index = randomSequenceCopy.indexOf(input[i]);
        if (index !== -1) {
            correctInWrongPlace++;
            randomSequenceCopy = randomSequenceCopy.substring(0, index) + randomSequenceCopy.substring(index + 1);
        }
    }
    return correctInWrongPlace;
}
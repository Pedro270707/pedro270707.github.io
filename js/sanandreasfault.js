const GameState = Object.freeze({
    START_SCREEN: 0,
    GAME_SCREEN: 1,
    END_SCREEN: 2
});

class QuizOption {
    constructor(option, isAnswer) {
        this.option = option;
        this.isAnswer = isAnswer;
    }
}

class QuizOptions {
    constructor(first, second, third, fourth, fifth) {
        this.first = first;
        this.second = second;
        this.third = third;
        this.fourth = fourth;
        this.fifth = fifth;
    }

    get(i) {
        switch (i) {
            case 0: return this.first;
            case 1: return this.second;
            case 2: return this.third;
            case 3: return this.fourth;
            case 4: return this.fifth;
        }
        return undefined;
    }
}

class QuizQuestion {
    constructor(question, options) {
        this.question = question;
        this.options = options;
    }
}

let gameState = GameState.START_SCREEN;
let timeLeftUntilStart = 0;
const endScreenTime = 200;
const gameScreenTime = 600;
const numberOfQuestions = 5;
const questions = [
    new QuizQuestion('sanandreasfault.questions.0', new QuizOptions(
        new QuizOption('sanandreasfault.questions.0.answer.0', false),
        new QuizOption('sanandreasfault.questions.0.answer.1', false),
        new QuizOption('sanandreasfault.questions.0.answer.2', false),
        new QuizOption('sanandreasfault.questions.0.answer.3', true),
        new QuizOption('sanandreasfault.questions.0.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.1', new QuizOptions(
        new QuizOption('sanandreasfault.questions.1.answer.0', false),
        new QuizOption('sanandreasfault.questions.1.answer.1', true),
        new QuizOption('sanandreasfault.questions.1.answer.2', false),
        new QuizOption('sanandreasfault.questions.1.answer.3', false),
        new QuizOption('sanandreasfault.questions.1.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.2', new QuizOptions(
        new QuizOption('sanandreasfault.questions.2.answer.0', false),
        new QuizOption('sanandreasfault.questions.2.answer.1', true),
        new QuizOption('sanandreasfault.questions.2.answer.2', false),
        new QuizOption('sanandreasfault.questions.2.answer.3', false),
        new QuizOption('sanandreasfault.questions.2.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.3', new QuizOptions(
        new QuizOption('sanandreasfault.questions.3.answer.0', true),
        new QuizOption('sanandreasfault.questions.3.answer.1', false),
        new QuizOption('sanandreasfault.questions.3.answer.2', false),
        new QuizOption('sanandreasfault.questions.3.answer.3', false),
        new QuizOption('sanandreasfault.questions.3.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.4', new QuizOptions(
        new QuizOption('sanandreasfault.questions.4.answer.0', true),
        new QuizOption('sanandreasfault.questions.4.answer.1', false),
        new QuizOption('sanandreasfault.questions.4.answer.2', false),
        new QuizOption('sanandreasfault.questions.4.answer.3', false),
        new QuizOption('sanandreasfault.questions.4.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.5', new QuizOptions(
        new QuizOption('sanandreasfault.questions.5.answer.0', false),
        new QuizOption('sanandreasfault.questions.5.answer.1', false),
        new QuizOption('sanandreasfault.questions.5.answer.2', true),
        new QuizOption('sanandreasfault.questions.5.answer.3', false),
        new QuizOption('sanandreasfault.questions.5.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.6', new QuizOptions(
        new QuizOption('sanandreasfault.questions.6.answer.0', false),
        new QuizOption('sanandreasfault.questions.6.answer.1', true),
        new QuizOption('sanandreasfault.questions.6.answer.2', false),
        new QuizOption('sanandreasfault.questions.6.answer.3', false),
        new QuizOption('sanandreasfault.questions.6.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.7', new QuizOptions(
        new QuizOption('sanandreasfault.questions.7.answer.0', false),
        new QuizOption('sanandreasfault.questions.7.answer.1', false),
        new QuizOption('sanandreasfault.questions.7.answer.2', false),
        new QuizOption('sanandreasfault.questions.7.answer.3', true),
        new QuizOption('sanandreasfault.questions.7.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.8', new QuizOptions(
        new QuizOption('sanandreasfault.questions.8.answer.0', false),
        new QuizOption('sanandreasfault.questions.8.answer.1', false),
        new QuizOption('sanandreasfault.questions.8.answer.2', true),
        new QuizOption('sanandreasfault.questions.8.answer.3', false),
        new QuizOption('sanandreasfault.questions.8.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.9', new QuizOptions(
        new QuizOption('sanandreasfault.questions.9.answer.0', false),
        new QuizOption('sanandreasfault.questions.9.answer.1', false),
        new QuizOption('sanandreasfault.questions.9.answer.2', false),
        new QuizOption('sanandreasfault.questions.9.answer.3', false),
        new QuizOption('sanandreasfault.questions.9.answer.4', true)
    )),
    new QuizQuestion('sanandreasfault.questions.10', new QuizOptions(
        new QuizOption('sanandreasfault.questions.10.answer.0', false),
        new QuizOption('sanandreasfault.questions.10.answer.1', false),
        new QuizOption('sanandreasfault.questions.10.answer.2', false),
        new QuizOption('sanandreasfault.questions.10.answer.3', false),
        new QuizOption('sanandreasfault.questions.10.answer.4', true)
    )),
    new QuizQuestion('sanandreasfault.questions.11', new QuizOptions(
        new QuizOption('sanandreasfault.questions.11.answer.0', true),
        new QuizOption('sanandreasfault.questions.11.answer.1', false),
        new QuizOption('sanandreasfault.questions.11.answer.2', false),
        new QuizOption('sanandreasfault.questions.11.answer.3', false),
        new QuizOption('sanandreasfault.questions.11.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.12', new QuizOptions(
        new QuizOption('sanandreasfault.questions.12.answer.0', true),
        new QuizOption('sanandreasfault.questions.12.answer.1', false),
        new QuizOption('sanandreasfault.questions.12.answer.2', false),
        new QuizOption('sanandreasfault.questions.12.answer.3', false),
        new QuizOption('sanandreasfault.questions.12.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.13', new QuizOptions(
        new QuizOption('sanandreasfault.questions.13.answer.0', false),
        new QuizOption('sanandreasfault.questions.13.answer.1', false),
        new QuizOption('sanandreasfault.questions.13.answer.2', true),
        new QuizOption('sanandreasfault.questions.13.answer.3', false),
        new QuizOption('sanandreasfault.questions.13.answer.4', false)
    ))
];
const hardQuestions = [
    new QuizQuestion('sanandreasfault.questions.hard.0', new QuizOptions(
        new QuizOption('sanandreasfault.questions.hard.0.answer.0', true),
        new QuizOption('sanandreasfault.questions.hard.0.answer.1', false),
        new QuizOption('sanandreasfault.questions.hard.0.answer.2', false),
        new QuizOption('sanandreasfault.questions.hard.0.answer.3', false),
        new QuizOption('sanandreasfault.questions.hard.0.answer.4', false)
    )),
    new QuizQuestion('sanandreasfault.questions.hard.1', new QuizOptions(
        new QuizOption('sanandreasfault.questions.hard.1.answer.0', false),
        new QuizOption('sanandreasfault.questions.hard.1.answer.1', false),
        new QuizOption('sanandreasfault.questions.hard.1.answer.2', false),
        new QuizOption('sanandreasfault.questions.hard.1.answer.3', false),
        new QuizOption('sanandreasfault.questions.hard.1.answer.4', true)
    )),
    new QuizQuestion('sanandreasfault.questions.hard.2', new QuizOptions(
        new QuizOption('sanandreasfault.questions.hard.2.answer.0', false),
        new QuizOption('sanandreasfault.questions.hard.2.answer.1', false),
        new QuizOption('sanandreasfault.questions.hard.2.answer.2', true),
        new QuizOption('sanandreasfault.questions.hard.2.answer.3', false),
        new QuizOption('sanandreasfault.questions.hard.2.answer.4', false)
    ))
];
let questionResults = [];
let currentQuestions = [];

document.addEventListener("DOMContentLoaded", () => {
    const gameContainer = document.getElementById('game-container');
    const gameScreenContainer = document.getElementById('game-screen-container');
    const endScreenContainer = document.getElementById('end-screen-container');
    const startButton = document.getElementById('start-button');
    const gameQuestionResults = document.getElementById('game-question-results');
    const endScreenTitle = document.getElementById('end-screen-title');
    const backToTitleButton = document.getElementById('back-to-title-button');

    setInterval(() => {
        if (gameState === GameState.GAME_SCREEN && questionResults.length === numberOfQuestions) {
            endGame();
            return;
        }
        if (timeLeftUntilStart === 0) {
            gameState = GameState.START_SCREEN;
        } else {
            --timeLeftUntilStart;
        }
        if (gameContainer === null) return;
        for (let i = 0; i < gameContainer.children.length; i++) {
            gameContainer.children[i].classList.toggle('active', i === gameState);
        }
        if (gameScreenContainer === null) return;
        for (let i = 0; i < gameScreenContainer.children.length; i++) {
            gameScreenContainer.children[i].classList.toggle('active', i === questionResults.length);
            if (i < questionResults.length) {
                gameScreenContainer.children[i].classList.add(questionResults[i] ? 'correct' : 'incorrect');
            }
        }
        gameQuestionResults.classList.toggle('active', gameState !== GameState.START_SCREEN);
        updateQuestionResultElement();
    }, 50);

    function endGame() {
        let correctAmount = 0;
        for (let i = 0; i < questionResults.length; i++) {
            if (questionResults[i]) correctAmount++;
        }
        translate.setAttribute(endScreenTitle, 'string', correctAmount === numberOfQuestions ? new TranslatableText('sanandreasfault.end.perfect') : new TranslatableText('sanandreasfault.end', new LiteralText(correctAmount), new LiteralText(numberOfQuestions)));
        gameState = GameState.END_SCREEN;
    }

    function startGame() {
        questionResults = [];
        const possibleQuestions = [];
        possibleQuestions.push(...questions);
        const possibleHardQuestions = [];
        possibleHardQuestions.push(...hardQuestions);
        gameScreenContainer.innerHTML = '';
        for (let i = 0; i < numberOfQuestions; i++) {
            const hard = i === numberOfQuestions - 1;
            let question = hard ? popRandomItem(possibleHardQuestions, hardQuestions) : popRandomItem(possibleQuestions, questions);
            createQuestionCard(question, hard);
        }
        gameScreenContainer.style.gridTemplateColumns = `repeat(${numberOfQuestions}, ${50 / numberOfQuestions}vw)`
        timeLeftUntilStart = gameScreenTime;
        gameState = GameState.GAME_SCREEN;
    }

    function popRandomItem(mainArray, fallbackArray) {
        if (mainArray.length === 0) {
            mainArray.push(...fallbackArray);
        }
        if (mainArray.length === 0) {
            console.error('Fallback array is empty');
        }
        const randomIndex = Math.floor(Math.random() * mainArray.length);
        return mainArray.splice(randomIndex, 1)[0];
    }

    function createQuestionCard(question, hard = false) {
        let index = gameScreenContainer.getElementsByClassName('question-card').length;
        const card = document.createElement('div');
        card.classList.add('question-card', 'question-card__' + (index + 1));
        card.style.zIndex = numberOfQuestions - (index + 1);
        if (hard) {
            card.classList.add('hard');
        }
        const title = document.createElement('h2');
        title.classList.add('question-card-title');
        translate.setAttribute(title, 'string', new TranslatableText(question.question));
        card.appendChild(title);
        for (let i = 0; i < 5; i++) {
            const button = document.createElement('button');
            button.classList.add('sanandreas-button', 'question-card-answer', `question-card-${index}-answer__${i + 1}`);
            button.id = `question-card-${index}-answer__${i + 1}`;
            translate.setAttribute(button, 'string', new TranslatableText(question.options.get(i).option));
            button.addEventListener('click', (event) => {
                questionResults.push(question.options.get(i).isAnswer);
                timeLeftUntilStart = gameScreenTime;
            });
            card.appendChild(button);
        }
        gameScreenContainer.appendChild(card);
    }

    function updateQuestionResultElement() {
        gameQuestionResults.innerHTML = '';
        for (let i = 0; i < numberOfQuestions; i++) {
            const result = document.createElement('span');
            result.classList.add('question-result');
            if (questionResults.length > i) {
                result.classList.add(questionResults[i] ? 'correct' : 'incorrect');
            }
            gameQuestionResults.appendChild(result);
        }
    }

    if (startButton !== null) {
        startButton.addEventListener('click', (event) => {
            startGame();
        });
    }
    if (backToTitleButton !== null) {
        backToTitleButton.addEventListener('click', (event) => {
            gameState = GameState.START_SCREEN;
        });
    }
});

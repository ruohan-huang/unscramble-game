const searchWordApiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"
let searchedWordJSON;

let wordBank;
let currentWord;
let wordDefinition;
let definition = document.getElementById("word-definition");


let slider = document.getElementById("slider");
let output = document.getElementById("slider-value");
output.innerHTML = slider.value;
let playButton = document.getElementById("play-button");
let scrambledWord = document.getElementById("scrambled-word");

let submitButton = document.getElementById("submit-button");
let skipButton = document.getElementById("skip-button");

let displayedScore = document.getElementById("score");
let score = 0;

let startDiv = document.getElementById("start-container");
let gameDiv = document.getElementById("game-container");

window.onload = async () => {
    const response = await fetch("./top_words_10k.json");
    wordBank = await response.json();
    updateScore();
}

slider.oninput = function() {
    output.innerHTML = this.value;
}

playButton.onclick = getNewWord;

async function getNewWord() {
    skipButton.innerHTML = "SKIP";
    document.getElementById("submitted-word").value = "";
    startDiv.style = "display:none";
    gameDiv.style = "display:block";
    let slider = document.getElementById("slider");
    let wordLength = parseInt(slider.value);
    let filteredWordList = wordBank.filter(word => word.length === wordLength);
    let index = Math.floor(Math.random() * filteredWordList.length);
    currentWord = filteredWordList[index];
    scrambledWord.innerHTML = shuffle(currentWord);
    definition.innerHTML = "Show definition";

    try {
        console.log("tried");
        const response = await fetch(searchWordApiUrl + currentWord);
        const json = await response.json();
        console.log(json);
        wordDefinition = json[0].meanings[0].definitions[0].definition;
    } catch {
        wordDefinition = "No definition found";
    }
}

definition.onclick = () => {
    if (definition.innerHTML == wordDefinition) {
        definition.innerHTML = "Show definition";
        definition.style.color = rgb(97, 97, 97);
    } else {
        definition.innerHTML = wordDefinition;
        definition.style.color = "black";
    }
}


submitButton.onclick = () => {
    let submittedInput = document.getElementById("submitted-word");
    if (submittedInput.value == currentWord) {
        score++;
        updateScore();
        let definition = document.getElementById("word-definition");
        definition.innerHTML = "Correct!";
        scrambledWord.innerHTML = currentWord;
        document.getElementById("incorrect-msg").innerHTML = "";
        skipButton.innerHTML = "NEXT";
    } else {
        updateScore();
        document.getElementById("incorrect-msg").innerHTML = "Incorrect";
        skipButton.innerHTML = "SKIP";
    }
}

skipButton.onclick = getNewWord;

function updateScore() {
    displayedScore.innerHTML = "Score: " + score;
}

function shuffle(word) {
    let list = word.split("");
    let len = list.length;

    for (let i = len - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }

    return list.join("");
}
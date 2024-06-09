const searchWordApiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"
let searchedWordJSON;

let wordBank;
let currentWord;
let wordDefinition;
let moreWordDefinitions;
let scrambledWord = document.getElementById("wood-block-container");
let definition = document.getElementById("word-definition");
let moreDefs = document.getElementById("more-definitions");
let popup = document.getElementById("popup");
let popupDefs = document.getElementById("popup-defs");
let closePopupButton = document.getElementById("close-popup");
let bgBlur = document.getElementById("bg-blur");

let slider = document.getElementById("slider");
let output = document.getElementById("slider-value");
output.innerHTML = slider.value;
let playButton = document.getElementById("play-button");

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
    currentWord = filteredWordList[index].toUpperCase();
    scrambledWord.innerHTML = shuffle(currentWord);
    definition.innerHTML = "Show definition";
    submitButton.style = "visibility: visible";
    moreDefs.hidden = "true";
    document.getElementById("incorrect-msg").style = "display:none";

    try {
        const response = await fetch(searchWordApiUrl + currentWord.toLowerCase());
        const json = await response.json();
        const meanings = json[0].meanings[0];
        // console.log(json);
        wordDefinition = meanings.definitions[0].definition;
        let allDefs = "";
        if (meanings.definitions.length === 1) {
            allDefs = "No other definitions found";
        } else {
            allDefs = "<ul>";
            for (let i = 1; i < meanings.definitions.length; i++) {
                allDefs += "<li>" + meanings.definitions[i].definition + "</li>";
            }
            allDefs += "</ul>";
        }
        popupDefs.innerHTML = allDefs;
    } catch {
        wordDefinition = "No definition found";
        popupDefs.innerHTML = "No other definitions found";
    }
}

definition.onclick = () => {
    if (definition.innerHTML == wordDefinition) {
        definition.innerHTML = "Show definition";
        moreDefs.hidden = true;
    } else {
        definition.innerHTML = wordDefinition;
        moreDefs.hidden = false;
        moreDefs.innerHTML = "(...)";
    }
}

moreDefs.onclick = () => {
    bgBlur.style = "display:block";
    popup.style = "display:block";
}

bgBlur.onclick = () => {
    bgBlur.style = "display:none";
    popup.style = "display:none";
}

closePopupButton.onclick = () => {
    bgBlur.style = "display:none";
    popup.style = "display:none";
}

// popup.addEventListener("keydown", function(event) {
//     if (event.key === "Escape" && bgBlur.style === "display: block") {
//         bgBlur.style = "display:none";
//         popup.style = "display:none";
//     }
// });

let submittedInput = document.getElementById("submitted-word");
submittedInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitWord();
    }
});


submitButton.onclick = submitWord;

function submitWord() {
    if (submittedInput.value.toUpperCase() == currentWord) {
        score++;
        updateScore();
        confetti();
        let definition = document.getElementById("word-definition");
        definition.innerHTML = "Correct!";
        scrambledWord.innerHTML = currentWord.split("").map( word => `<div class="wood-block">${word}</div>`).join("");
        document.getElementById("incorrect-msg").style = "display:none";
        submitButton.style = "visibility: hidden";
        skipButton.innerHTML = "NEXT";
        moreDefs.hidden = "true";
    } else {
        updateScore();
        let incorrect = document.getElementById("incorrect-msg");
        incorrect.style = "display: block"
        incorrect.innerHTML = "Incorrect";
        skipButton.innerHTML = "SKIP";
    }
}

skipButton.onclick = skip;

function skip() {
    
}

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

    const blocks = list.map( word => `<div class="wood-block">${word}</div>`);
    return blocks.join("");
}

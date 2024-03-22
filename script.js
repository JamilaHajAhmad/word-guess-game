let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;


let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;

let wordToGuess = "";
let words = ["create","insert","update","delete","master","branch","script"];
wordToGuess = words[Math.floor(Math.random()*words.length)];

let messageArea = document.querySelector(".message");
let numberOfHintsSpan = document.querySelector(".hint span").innerHTML = numberOfHints;

function generateInputs() {
    let inputsContainer = document.querySelector(".inputs");
    for(let i = 1; i <= numberOfTries; i++) {
        let tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        inputsContainer.appendChild(tryDiv);
        if(i !== 1) {
            tryDiv.classList.add("disabled-try");
        }
        for(let j = 1; j <= numberOfLetters; j++) {
            let input = document.createElement("input");
            input.type = "text";
            input.id = `try-${i}-letter-${j}`;
            input.setAttribute("maxLength","1");
            tryDiv.appendChild(input);
        }

    }
    inputsContainer.children[0].children[1].focus();

    let inputsInDisabledDiv = document.querySelectorAll(".disabled-try input");
    inputsInDisabledDiv.forEach((input) => input.disabled = true);

    let inputs = document.querySelectorAll("input");
    inputs.forEach((input,index)=> {
        input.addEventListener("input",function() {
            this.value = this.value.toUpperCase();
            let nextInput = inputs[index+1];
            if(nextInput) {
                nextInput.focus();
            }
        })

        input.addEventListener("keydown",function(event) {
            let currentIndex = Array.from(inputs).indexOf(event.target);
            if(event.key === "ArrowRight") {
                let nextInput = currentIndex + 1;
                if(nextInput < inputs.length)
                inputs[nextInput].focus();
            }
            if(event.key === "ArrowLeft") {
                let previousInput = currentIndex - 1;
                if(previousInput >= 0)
                inputs[previousInput].focus();
            }
            
        })
    })
}
window.onload = () => generateInputs();

let guessButton = document.querySelector(".check");
guessButton.addEventListener("click",handleGuess);

function handleGuess() {
    let successGuess = true;
    let i;
    for(i = 1; i <= numberOfLetters; i++) {
        const inputFiled = document.querySelector(`#try-${currentTry}-letter-${i}`);
        const letter = inputFiled.value.toLowerCase();
        const actualLetter = wordToGuess[i-1];
        if(letter !== "") {
            if(letter === actualLetter) {
            inputFiled.classList.add("in-place");
        }
            else if(wordToGuess.includes(letter) && letter !== "") {
            inputFiled.classList.add("not-in-place");
            successGuess = false;
        }
            else {
            inputFiled.classList.add("wrong");
            successGuess = false;
        }
    }
    }

    if(successGuess && i== 6) {
        let allTries = document.querySelectorAll(".inputs div");
        allTries.forEach((oneTry) => oneTry.classList.add("disabled-try"));
        messageArea.innerHTML = "Congratulations, You win!!!";
        if(numberOfHints === 2 ) {
            messageArea.innerHTML = "Congratulations, You win without using any hint!!!";
        }
        guessButton.disabled = true;
        getHintButton.disabled = true;
    }
    else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-try");
        let currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input)=>input.disabled = true);
        currentTry++;
        let nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input)=>input.disabled = false);
        let tryDiv = document.querySelector(`.try-${currentTry}`);
        if(tryDiv) {
            tryDiv.classList.remove("disabled-try");
            tryDiv.children[1].focus();
        }
        else {
            guessButton.disabled = true;
            getHintButton.disabled = true;
            messageArea.innerHTML = `Game Over :(, the word is <span>${wordToGuess}</span>`;
        }
    }
}
let getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click",getHint);

function getHint() {
    if(numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
        if(numberOfHints == 1) {
            document.querySelector(".hint").innerHTML = `<span>${numberOfHints}</span> Hint`;
        }
    }
    if(numberOfHints === 0) {
        getHintButton.disabled = true;
    }
    let enabledInputs = document.querySelectorAll("input:not([disabled])");
    let emptyEnabledInputs = Array.from(enabledInputs).filter((input)=>input.value === "");
    if(emptyEnabledInputs.length > 0) {
        let randomIndex = Math.floor(Math.random()*emptyEnabledInputs.length);
        let randomInput = emptyEnabledInputs[randomIndex];
        let indexToFill = Array.from(enabledInputs).indexOf(randomInput);
        if(indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
    }
}

function handleBackspace(event) {
    if(event.key === "Backspace") {
        let inputs = document.querySelectorAll("input:not([disabled])");
        let currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0) {
            let currentInput = inputs[currentIndex];
            let previousInput = inputs[currentIndex-1];
            currentInput.value = "";
            previousInput.value = "";
            previousInput.focus();

        }
    }
}
document.addEventListener("keydown",handleBackspace);
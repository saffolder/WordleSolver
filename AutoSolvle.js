/**
 * Class to accomplish Goal 2: auto play the online Wordle with no need for user input
 */
'use strict';

const { default: puppeteer } = require("puppeteer");

let words;
const browser = await puppeteer.launch();
const page = await browser.newPage();

const ENTER = document.querySelectorAll('.Key-module_key__kchQI')[19];

function init() {
    loadWords();
    solve();
}


async function solve() {
    let guess;
    let solved = false;
    let attempts = 0;
    await page.goto('https://www.nytimes.com/games/wordle/index.html');
    // set screen size?
    while (!solved && attempts < 6) {
        // Need to get a word to guess
        guess = getGuess();

        // Need to post the word to NYT
        await makeGuess(guess);

        // Need to check how the guess did
        solved = await checkGuess(attempts);

        // repeat until success
        attempts += 1;
    }
    // TODO: make it save to a .log file with the date, attempts, outcome
}

async function checkGuess(attempt) {
    // need to make sure that I also update the words
    var content = await page.content();
    var rowOfLetters = content.querySelectorAll('.Row-module_row__pwpBq')[attempt].querySelectorAll('.Tile-module_tile__UWEHN');
    for (let i = 0; i < 5; i++) {
        let letter = rowOfLetters[i].textContent;
        let stateOfLetter = rowOfLetters[i].dataset.state; // absent is gray, present is yellow, correct is green
        for (let j = 0; j < words.size(); j++) {
            switch (stateOfLetter) {
                case 'correct': // guessed letter is in final position
                    if (words[j][i] != letter) {
                        words.remove(j);
                        j -= 1;
                    }
                    break;
                case 'present': // remove words that dont have the letter anywhere in it
                    if (!words[j].includes(letter)) {
                        words.remove(j);
                        j -= 1;
                    }
                    break;
                default: // guessed letter isnt in the word
                    if (words[j].includes(letter)) {
                        words.remove(j);
                        j -= 1;
                    }
            }
        }
    }
    updateWords();
    return true;
}

/**
 * Keys in the word to guess to the keyboard and enters
 * @param {String} guess 5 letter word all lower case. The word to be guessed
 */
async function makeGuess(guess) {
    // use the .click() attr of the letter on the keyboard I'm looking for
    for (let i = 0; i < 5; i++) {
        // prolly need to set some delay?
        var key = 'button[data-key=' + guess[i] + ']';
        await page.click(key);
    }
    await page.click(ENTER);
}

/**
 * Get the next possible valid guess, can refactor with NLP later.
 * @returns first valid word
 */
function getGuess() {
    return words[0];
}

/**
 * Read in each word from words.txt into the array words
 */
function loadWords() {
    fetch('words.txt')
        .then((res) => res.text())
        .then((text) => {
            words = text.split('\n');
        })
        .catch((e) => console.error(e));
}

init();
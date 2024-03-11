/**
 * Class to accomplish Goal 2: auto play the online Wordle with no need for user input
 */
'use strict';
(async () => {
const { default: puppeteer } = require("puppeteer");
const fs = require('node:fs');

let words;
const browser = await puppeteer.launch();
const page = await browser.newPage();

/**
 * Initializes a new Solvle. Loads in a dictionary of words and begins.
 */
function init() {
    console.log('made to init');
    loadWords();
    solve();
}

/**
 * Begins solving the Wordle!
 */
async function solve() {
    let guess;
    let solved = false;
    let attempts = 0;
    await page.goto('https://www.nytimes.com/games/wordle/index.html');
    await page.click('button[data-testid=Play]');
    //await page.click('.Modal-module_closeIcon__TcEKb');
    console.log('made it to NYT');
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
    await browser.close();
    console.log('Game complete. Number of guesses: ' + attempts + '.\n');
    if (solved) {
        console.log('VICTORY!');
    } else {
        console.log('DEFEAT');
    }
}

/**
 * Checks how good our guess is, removes words from words that don't fit the "regex"
 * @param {Integer} attempt The number of guesses so far
 * @returns {boolean} Whether the Wordle has been solved
 */
async function checkGuess(attempt) {
    console.log('checking guess');
    let allTiles = await page.$$('.Tile-module_tile__UWEHN');
    console.log(allTiles.length);
    let rowOfLetters = allTiles.slice(attempt * 5, attempt * 5 + 5);
    /*
    Could just query for all 30 boxes and then only look at window of 5 based on attempt * 5
    */
    //let rowOfLetters = gameBoard.childNodes[attempt];
    // then I need to manipulate with [attempt] and then further selcting down where
    // .querySelectorAll('.Tile-module_tile__UWEHN')
    let numCorrect = 0;
    for (let i = 0; i < 5; i++) {
        console.log(rowOfLetters[i].classList);
        return;
        let letter = rowOfLetters[i].textContent;
        let stateOfLetter = rowOfLetters[i].attributes['data-state'].textContent; // absent is gray, present is yellow, correct is green
        if (stateOfLetter == 'correct') {
            numCorrect += 1;
        }
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
    console.log('Number of greens: ' + numCorrect);
    return numCorrect == 5;
}

/**
 * Keys in the word to guess to the keyboard and enters
 * @param {String} guess 5 letter word all lower case. The word to be guessed
 */
async function makeGuess(guess) {
    // use the .click() attr of the letter on the keyboard I'm looking for
    console.log('Attempting to guess: ' + guess);
    // Refactored code:
    await page.type('#wordle-app-game', guess, {delay: 100});
    await page.keyboard.press('Enter');
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
    fs.readFile('words.txt', 'utf-8', (e, text) => {
        if (e) {
            console.error(err);
        } else {
            words = text.split('\n');
        }
    })
}

init();

})();
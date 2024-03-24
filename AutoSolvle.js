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
    await page.waitForSelector('button[data-testid=Play]');
    await page.click('button[data-testid=Play]');
    console.log('made it to NYT');
    // set screen size?
    while (!solved && attempts < 6) {
        // Need to get a word to guess
        guess = getGuess();
        if (guess === null) {
            break;
        }
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
    // TODO: THIS IS THE BOTTLENECK
    let allTilesLetters = await page.$$eval('.Tile-module_tile__UWEHN', (tiles) => {
        return tiles.map(tile => tile.textContent);
    });
    let allTilesStatus = await page.$$eval('.Tile-module_tile__UWEHN', (tiles) => {
        return tiles.map(tile => tile.attributes['data-state'].textContent);
    });
    console.log(allTilesLetters.length);
    console.log('dictionary of words before is size: %d', words.length);
    let rowOfLetters = allTilesLetters.slice(attempt * 5, attempt * 5 + 5);
    let rowOfStates = allTilesStatus.slice(attempt * 5, attempt * 5 + 5);
    let tempWords = [];
    console.log(rowOfStates);
    /*
        Prolly going to refactor my finding algo:
        Criteria for keeping words:
        guess = 'steak', word = words[j]
        if state[i] is green, word[i] HAS to equal guess[i]
        if state[i] is yellow, keep words that 1) MUST contain guess[i] 2) guess[i] != word[i] 3) word[k] == guess[i], state[k] != green
        if state[i] is gray, keep words that DO NOT contain guess[i]
    */
    console.log(rowOfLetters[0]);
    for (let i = 0; i < words.length; i++) {
        let keep = true;
        let j = 0;
        while (keep && j < 5) {
            switch (rowOfStates[j]) {
                case 'correct': // green
                    if (words[i][j] != rowOfLetters[j]) {
                        keep = false;
                    }
                    break;
                case 'present': // yellow
                    if (words[i][j] == rowOfLetters[j]) {
                        keep = false;
                    } else if (!words[i].includes(rowOfLetters[j])) {
                        keep = false;
                    }
                    break;
                case 'absent': // gray
                    if (words[i].includes(rowOfLetters[j])) {
                        keep = false;
                    }
            }
            j += 1;
        }
        if (keep) {
            tempWords.push(words[i]);
        }
    }
    let numCorrect = 0;
    for (let i = 0; i < 5; i++) {
        if (rowOfStates[i] == 'correct') {
            numCorrect += 1;
        }
    }
    words = tempWords;
    console.log('dictionary of tempWords before is size: %d', tempWords.length);
    console.log('Number of greens: ' + numCorrect);
    return numCorrect == 5;
}

/**
 * Keys in the word to guess to the keyboard and enters
 * @param {String} guess 5 letter word all lower case. The word to be guessed
 */
async function makeGuess(guess) {
    console.log('Attempting to guess: ' + guess);
    // Refactored code:
    await page.type('#wordle-app-game', guess)
                .then(async () => {
                    await (await page.$('button[data-key="↵"]')).press('Enter');
                });
    await new Promise((res, rej) => setTimeout(res, 2000));
    // THE TILES TAKE 100MS TO FLIP AFTER A GUESS! SO NEED TO WAIT .5MS BEFORE CHECKING!
}

/**
 * Get the next possible valid guess, can refactor with NLP later.
 * @returns first valid word
 */
function getGuess() {
    if (words.length > 0) {
        return words[0];
    }
   return null;
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
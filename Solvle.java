/**
 * Samuel Affolder 08/10/2022
 * Attempt at making a https://www.nytimes.com/games/wordle/index.html solver
 * Goals: 1) make a naive system that picks the next guess using the next word in the list
 *        2) make it play automatically and online
 *        3) make it play every morning
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class Solvle {

  public static void main(String[] args) throws FileNotFoundException {
    // Create the word list
    List<char[]> words = new ArrayList<>();
    Scanner wordReader = new Scanner(new File("words.txt"));
    while (wordReader.hasNextLine()) {
      char[] word = wordReader.nextLine().trim().toCharArray();
      words.add(word);
    }
    wordReader.close();

    // Setup variables
    Scanner in = new Scanner(System.in);
    boolean notSolved = true;
    int round = 0;
    int removedCount = 0;
    char[] guess;
    Set<String> guessedWords = new HashSet<>();  // use string comparison bc array comparison looks at storage location

    // begin playing
    while (notSolved && round < 6) {
      round++;
      System.out.println("Please enter your guess:\n");
      guess = in.nextLine().trim().toCharArray();
      guessedWords.add(new String(guess));
      for (int i = 0; i < 5; i++) {
        System.out.println("Please enter the correctness of letter " + i + ":\n"); // 0 wrong, 1 green, 2 yellow
        int hit = Integer.parseInt(in.nextLine());
        for (int pos = 0; pos < words.size(); pos++) {
          if (hit == 0 && (guess[i] == words.get(pos)[i] || hasLetter(guess[i], words.get(pos)))) { // this is a wrong letter
            words.remove(pos);
            removedCount++;
            pos--;
          } else if (hit == 1 && guess[i] != words.get(pos)[i]) { // This is a green letter
            words.remove(pos);
            removedCount++;
            pos--;
          } else if (hit == 2 && !hasLetter(guess[i], words.get(pos))) { // This is a yellow
            words.remove(pos);
            removedCount++;
            pos--;
          } else if (hit == 3) {
            continue;
          }
        }
      }
      if (words.size() == 1) { // GAME WON
        notSolved = false;
      } else {
        // ROUND RESULTS
        if (guessedWords.contains(new String(words.get(0)))) {  // why no work?!?!?!
          words.remove(0);
          removedCount--;
        }
        System.out.println("Round " + round + " complete. You've removed: " + removedCount + " words. There are: " + words.size() + " possible words remaining.");
        // SUGGEST A RANDOM WORD REMAINING
        int nextGuess = 0;
        System.out.println("Try guessing: " + new String(words.get(nextGuess)));
      }
    }

    if (notSolved) {
      System.out.println("Game over! :(");
    } else {
      System.out.println("The word is: " + new String(words.get(0)));
      System.out.println("Congrats! You got it in " + round + " tries!");
    }
    in.close();
  }

  /**
   * Checks to see if guess is in word
   * @param guess the letter guessed
   * @param word the word in the library
   * @return true if contains, false if not
   */
  private static boolean hasLetter(char guess, char[] word) {
    for (int i = 0; i < 5; i++) {
      if (guess == word[i])
      return true;
    }
    return false;
  }
}

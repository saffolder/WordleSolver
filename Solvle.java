/**
 * Samuel Affolder 08/10/2022
 * Attempt at making a https://www.nytimes.com/games/wordle/index.html solver
 * Goals: 1) make a naive system that picks the next guess using the next word in the list
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
      String word = wordReader.nextLine();
      words.add(word.toCharArray());
     // System.out.println(word);
    }
    wordReader.close();

    // Setup variables
    Scanner in = new Scanner(System.in);
    boolean notSolved = true;
    int round = 0;
    int removedCount = 0;

    // begin playing
    while (notSolved && round < 6) {
      round++;
      System.out.println("Please enter your guess:\n");
      char[] guess = in.nextLine().toCharArray();
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
          }
        }
      }
      if (words.size() == 1) { // GAME WON
        notSolved = false;
      } else {
        // ROUND RESULTS
        System.out.println("Round " + round + " complete. You've removed: " + removedCount + " words. There are: " + words.size() + " possible words remaining.");
        // SUGGEST A RANDOM WORD REMAINING
        int nextGuess = 0;
        // System.out.println(nextGuess);
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

/**
 * Samuel Affolder 08/10/2022
 * The class to test the AutoSolvler
 */

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

public class TesterSolvle {

  private static List<char[]> testWords = new ArrayList<>();
  private static List<char[]> words;
  public static void main(String[] args) throws FileNotFoundException {
    // Create the list of words to guess from
    Scanner wordReader = new Scanner(new File("words.txt"));
    while (wordReader.hasNextLine()) {
      char[] word = wordReader.nextLine().trim().toCharArray();
      testWords.add(word);
    }
    wordReader.close();
    int wins = 0;
    int losses = 0;
    Set<String> lostGames = new HashSet<>();
    for (char[] target: testWords) {

    words = new ArrayList<>();
    Scanner wordReader1 = new Scanner(new File("words.txt"));
    while (wordReader1.hasNextLine()) {
      char[] word = wordReader1.nextLine().trim().toCharArray();
      words.add(word);
    }

    // Setup variables
    Scanner in = new Scanner(System.in);
    boolean notSolved = true;
    int round = 0;
    char[] guess;
    Set<String> guessedWords = new HashSet<>();  // use string comparison bc array comparison looks at storage location

    // begin playing
    while (notSolved && round < 6) {
      round++;
      if (round == 1) {
        guess = "salet".toCharArray();
      } else {
        guess = words.get(0);
      }
      // System.out.println("Please enter your guess:\n");
      guessedWords.add(new String(guess));
      for (int i = 0; i < 5; i++) {
        // WHY DO I NEED TO GO THROUGH EVERY WORD WHEN I COULD JUST GO THROUGH TARGET AND UPDATE WORDS
          if (!hasLetter(guess[i], target)) { // If a letter in guessed is not in target, remove all words with that letter
            removeContains(guess[i]);
          } else if (guess[i] == target[i]) {
            remove(guess[i], i);  // removes every word that doesnt have a green in that spot
          }
      }
      if (words.size() == 1) {
        notSolved = false;
      } else {
        if (guessedWords.contains(new String(words.get(0)))) {
          words.remove(0);
        }
      }
    }
    if (notSolved) {
      losses++;
      lostGames.add(new String(target));
    } else {
      wins++;
    }
    wordReader1.close();
    in.close();
  }
  System.out.println("Games won: " + wins);
  System.out.println("Games lost: " + losses);
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

  private static void remove(char letter, int index) {
    for (int i = 0; i < words.size(); i++) {
      if (words.get(i)[index] != letter) {
        words.remove(i);
        i--;
      }
    }
  }

  private static void removeContains(char letter) {
    for (int i = 0; i < words.size(); i++) {
      if (hasLetter(letter, words.get(i))) {
        words.remove(i);
        i--;
      }
    }
  }
}

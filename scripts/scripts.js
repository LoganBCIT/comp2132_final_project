const Hangman = {
  words: [
    { word: "unicorn", hint: "A mythical creature with a horn on its forehead." },
    { word: "dragon", hint: "A mythical creature with wings that breathes fire." },
    { word: "pizza", hint: "A delicious dish made with dough, tomato sauce, and cheese." },
    { word: "beach", hint: "A sandy area by the sea where people swim and sunbathe." },
    { word: "camera", hint: "A device used to take photographs and record videos." },
    { word: "penguin", hint: "A flightless bird that lives in cold climates." },
    { word: "rainbow", hint: "A colorful arc in the sky that appears after rain." },
    { word: "pirate", hint: "A sailor who attacks and steals from other ships." },
    { word: "volcano", hint: "A mountain with a crater that erupts lava and ash." },
    { word: "treasure", hint: "A collection of valuable objects that are hidden or buried." },
    { word: "robot", hint: "A machine that can be programmed to perform a variety of tasks." },
    { word: "chocolate", hint: "A sweet food made from roasted and ground cacao seeds." },
    { word: "guitar", hint: "An instrument with 6 strings played by strumming or picking." },
    { word: "tornado", hint: "A violent wind storm that is characterized by rotating air." },
    { word: "aquarium", hint: "A container filled with water and aquatic creatures." },
    { word: "piano", hint: "An instrument with keys that is played by pressing the keys." },
    { word: "telescope", hint: "An optical instrument used to view distant objects." },
  ],

  maxGuesses: 6,
  remainingGuesses: 0,
  incorrectGuesses: 0,
  stage: 1,
  randomIndex: 0,
  randomWord: '',
  randomHint: '',
  totalCorrectLetters: 0,

  $keyboardButton: $('.key-row button'),
  $classmateImage: $("#classmate-image"),
  $puzzleContainer: $("#puzzle-container"),
  $blankSpace: $("#blank-spaces"),
  $winOrLose: $("#win-or-lose"),
  $winOrLoseMessage: $("#win-or-lose-message"),
  $hint: $("#hint"),
  $popup: $('#popup'),
  $playagain: $("#play-again"),

  init: function() {

    this.maxGuesses = 6; 
    this.remainingGuesses = this.maxGuesses; 
    this.incorrectGuesses = 0;

    this.randomIndex = Math.floor(Math.random() * this.words.length);
    this.randomWord = this.words[this.randomIndex].word;
    this.randomHint = this.words[this.randomIndex].hint;

    for (let i = 0; i < this.randomWord.length; i++) {
      const blankSpaceChar = $("<span>").text("_");
      this.$blankSpace.append(blankSpaceChar);
    }

    const hintContent = $("<p>").text(`Hint: ${this.randomHint}`);
    this.$hint.append(hintContent);

    const $displayIncorrectGuesses = $("#incorrect-guesses");
    $displayIncorrectGuesses.text(`Incorrect Guesses: ${this.incorrectGuesses}/${this.maxGuesses}`);

    this.$keyboardButton.click(function() {
      $(this).attr('disabled', 'disabled');
      const letter = $(this).attr('id');
      Hangman.checkLetter(letter);
    });

    this.$playagain.click(function() {
      Hangman.resetGame();
    });
  },

  checkLetter: function(letter) {
    let correctLetters = 0;

    let randomImage = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < this.randomWord.length; i++) {
      const wordLetter = this.randomWord[i];

      if (letter == wordLetter){
        this.$blankSpace.children().eq(i).text(letter);
        correctLetters += 1;
        this.totalCorrectLetters += 1;
      }
    }


    if (correctLetters < 1) {
      this.remainingGuesses--;
      this.incorrectGuesses++;
      this.stage += 1;
      this.$classmateImage.attr("src", `images/stage ${this.stage}/${randomImage}.png`);
      const $displayIncorrectGuesses = $("#incorrect-guesses");
      $displayIncorrectGuesses.text(`Incorrect Guesses: ${this.incorrectGuesses}/${this.maxGuesses}`);
    }

    //tell the user they lost
    if (this.remainingGuesses == 0) {
      this.$classmateImage.attr("src", `images/lose/${randomImage}.png`);
      shakeImage(this.$classmateImage);
      this.$winOrLose.text("You LOSE!");
      this.$winOrLoseMessage.text("You couldn't guess the word, and now your partner has failed the class. For your terrible performance, the teacher failed you too. However, you can try to redeem yourself by playing again!");
      this.$keyboardButton.attr('disabled', true);
      this.showPopup();
    }

    //tell the user they won
    if (this.totalCorrectLetters == this.randomWord.length) {
      this.$classmateImage.attr("src", `images/win/1.png`);
      this.$winOrLose.text("You WIN!");
      this.$winOrLoseMessage.text("You guessed the word! Your partner is relieved, and says he trusted you all along. Moreover, you can try to show the class who's boss once again by playing again!");
      this.$keyboardButton.attr('disabled', true);
      this.showPopup();
    }

    console.log("Remainaing guesses: ", this.remainingGuesses);
    console.log("Incorrect guesses: ", this.incorrectGuesses);
  },

  resetGame: function() {
    this.remainingGuesses = this.maxGuesses;
    this.incorrectGuesses = 0;
    const $displayIncorrectGuesses = $("#incorrect-guesses");
    $displayIncorrectGuesses.text(`Incorrect Guesses: ${this.incorrectGuesses}/${this.maxGuesses}`);
    this.stage = 1;
    this.randomIndex = Math.floor(Math.random() * this.words.length);
    this.randomWord = this.words[this.randomIndex].word;
    this.randomHint = this.words[this.randomIndex].hint;
    this.totalCorrectLetters = 0;
    this.$classmateImage.attr("src", `images/stage ${this.stage}/1.png`);
    stopShaking(this.$classmateImage);
    this.$blankSpace.empty();
    this.$keyboardButton.removeAttr('disabled');
    this.hidePopup();
    for (let i = 0; i < this.randomWord.length; i++) {
      const blankSpaceChar = $("<span>").text("_");
      this.$blankSpace.append(blankSpaceChar);
    }
    const hintContent = $("<p>").text(`Hint: ${this.randomHint}`);
    this.$hint.html(hintContent);
  },

  showPopup: function() {
    this.$popup.removeClass('hidden');
    this.$popup.css('transition', 'opacity 1s');
  },

  hidePopup: function() {
    this.$popup.addClass('hidden');
    this.$popup.css('transition', 'opacity 1s');
  }
};

function shakeImage(image) {
  image.addClass('shake');
}

function stopShaking(image) {
  image.removeClass('shake');
}

Hangman.init();

//game summary hiding:

const $gameSummaryH2 = $(".game-summary h2");
const $gameSummaryP = $(".game-summary p");

$gameSummaryH2.click(function(){
  if ($gameSummaryP.is(":hidden")) {
    $gameSummaryP.slideDown();
  } else {
    $gameSummaryP.slideUp();
  }
});

class traditionalGame {
  constructor(totalTime, cards) {
    this.cardsArray = cards;
    this.totalTime = totalTime;
    this.timeRemaining = totalTime;
    this.timer = document.getElementById('time-remaining');
    this.counter = document.getElementById('totalMoves');
  }
  /* Here we grab the stars from the DOM and reset them, clear the countdown timer, clear the matched cards array and run shuffle cards */

  startGame() {
    let finalRating = document.getElementById('finalRating');
    while (finalRating.hasChildNodes()) {
      finalRating.removeChild(finalRating.lastChild);
    }
    this.stars = document.querySelectorAll('.fa-star');
    this.cardToCheck = null;
    this.totalMoves = 0;
    this.timeRemaining = this.totalTime;
    this.matchedCards = [];
    this.busy = true;

    if (this.countDown) {
      clearInterval(this.countDown);
    }

    this.stars[2].classList.add('checked3');
    this.stars[1].classList.add('checked2');

    setTimeout(() => {
      this.shuffleCards();
      this.countDown = this.startCountDown();
      this.busy = false;
    }, 250);
    this.hideCards();
    this.timer.innerText = this.timeRemaining;
    this.counter.innerText = this.totalMoves;
  }

  hideCards() {
    this.cardsArray.forEach(card => {
      card.classList.remove('visible');
      card.classList.remove('matched');
    });
  }

  flipCard(card) {
    if (this.canFlipCard(card)) {
      this.totalMoves++;
      this.counter.innerText = this.totalMoves;
      card.classList.add('visible');
      if (this.totalMoves >= 25 && this.totalMoves <= 30) {
        this.stars[2].classList.remove('checked3');
      }

      if (this.totalMoves >= 31) {
        this.stars[1].classList.remove('checked2');
      }

      if (this.cardToCheck) this.checkForCardMatch(card);
      else this.cardToCheck = card;
    }
  }

  checkForCardMatch(card) {
    if (this.getCardType(card) === this.getCardType(this.cardToCheck))
      this.cardMatch(card, this.cardToCheck);
    else this.cardNoMatch(card, this.cardToCheck);

    this.cardToCheck = null;
  }

  cardMatch(card1, card2) {
    this.matchedCards.push(card1);
    this.matchedCards.push(card2);
    card1.classList.add('matched');
    card2.classList.add('matched');
    if (this.matchedCards.length === this.cardsArray.length) this.victory();
  }

  cardNoMatch(card1, card2) {
    this.busy = true;
    setTimeout(() => {
      card1.classList.remove('visible');
      card2.classList.remove('visible');
      this.busy = false;
    }, 1000);
  }

  getCardType(card) {
    return card.getElementsByClassName('card-value')[0].src;
  }

  startCountDown() {
    return setInterval(() => {
      this.timeRemaining--;
      this.timer.innerText = this.timeRemaining;
      if (this.timeRemaining === 0) this.gameOver();
    }, 1000);
  }

  gameOver() {
    clearInterval(this.countDown);
    document.getElementById('game-over-text').classList.add('visible');
  }

  victory() {
    clearInterval(this.countDown);
    let finalRating = document.getElementById('finalRating');
    let starRating = document.querySelector('.stars').cloneNode(true);
    document.getElementById('finalTime').innerText = this.totalTime - this.timeRemaining;
    finalRating.appendChild(starRating);
    document.getElementById('victory-text').classList.add('visible');
  }

  shuffleCards() {
    for (let i = this.cardsArray.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      this.cardsArray[randomIndex].style.order = i;
      this.cardsArray[i].style.order = randomIndex;
    }
  }

  canFlipCard(card) {
    return (
      !this.busy &&
      !this.matchedCards.includes(card) &&
      card !== this.cardToCheck
    );
  }
}

/* This function initialises the game, adds any event listeners and runs startGame() in the traditionalGame Class */

function ready() {
  let overlays = Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card'));
  let restart = document.querySelector('.restart');
  let game = new traditionalGame(90, cards);

  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => {
      overlay.classList.remove('visible');
      game.startGame();
    });
  });

  restart.addEventListener('click', () => {
    game.startGame();
  });

  cards.forEach(card => {
    card.addEventListener('click', () => {
      game.flipCard(card);
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ready());
} else {
  ready();
}

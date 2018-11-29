export class CardClass {
  constructor(fv, s, id) {
    this.face_value = fv.toString()
    this.suit = s
    this.id = id
    this.flipped = false
    this._sd = {
      s: ['♠', 'black'],
      h: ['♥', 'red'],
      c: ['♣', 'black'],
      d: ['♦', 'red']
    }
    this._fd = {
      "K": 10,
      "Q": 10,
      "J": 10,
      "A": 11
    }
  }
  get value() {
    if (this.face_value.isNaN()) {
      return Number(this._fd[this.face_value])
    } else {
      return Number(this.face_value)
    }
  }
  get colour() {
    return this._sd[this.suit][1]
  }
  get icon() {
    return this._sd[this.suit][0]
  }
  down() {
    this.flipped = true;
  }
  up() {
    this.flipped = false;
  }
}

export class HandClass {
  constructor(id, colour, isPlayer, cards, isDealer, threshold, isAi) {
    this.cards = cards || [];
    this.isPlayer = isPlayer || false;
    this.isDealer = isDealer || false;
    this.isAi = isAi || false;
    this.threshold = threshold;

    this.colour = colour;
    this.id = id;
    this.hasStood = false;
    this.isTurn = false;

    this.hasWon = false;
    this.hasTied = false;
    this.hasLost = false;
    this.emitMessages = [];

    this.showButtons = false;
    this.killButtons = true;
    this.showStood = false;
  }
  reset() {
    this.cards = [];
    this.hasStood = false;
    this.emitMessages = [];
  }
  value() {
    var total = 0;

    // Value dictionary for face non-numeric face values
    var vd = {
      "K": 10,
      "Q": 10,
      "J": 10,
      "A": 11
    }

    var ace_count = 0;

    // Loop through all card objects
    var cards = this.cards;
    for (var i = 0; i < cards.length; i++) {
      var fv_letter = cards[i].face_value.toString().toUpperCase();
      if (fv_letter in vd) {
        total += vd[fv_letter];
        if (fv_letter == "A") {
          ace_count += 1;
        }
      } else {
        total += Number(cards[i].face_value);
      }
    }
    while (total > 21 && ace_count > 0) {
      total -= 10;
      ace_count -= 1;
    }
    return total
  }
  value_display() {
    return !this.value_obscured() ? this.value() : "~~"
  }
  value_compare() {
    if (this.bust()) {
      return 0
    }
    return this.value()
  }
  value_obscured() {
    var has_flipped = false;
    for (var i = 0; i < this.cards.length; i++) {
      if (this.cards[i].flipped) {
        has_flipped = true;
        break
      }
    }
    if (has_flipped) {
      return true;
    } else {
      return false;
    }
  }
  blackjack() {
    if (this.value() == 21) {
      return true
    } else {
      return false
    }
  }
  bust() {
    if (this.value() > 21) {
      return true
    } else {
      return false
    }
  }
  quick_status() {
    if (this.value_obscured() || this.hasTied) {
      return 0
    } else if (this.bust() || this.hasLost) {
      return 2
    } else if (this.blackjack() || this.hasWon) {
      return 1
    } else if (this.showStood) {
      return 3
    } else {
      return 0
    }
  }
  canAcceptCard() {
    if (this.blackjack() || this.bust() || this.hasStood) {
      return false;
    } else {
      return true;
    }
  }
  addCard(card) {
    if (this.canAcceptCard()) {
      if (card instanceof CardClass) {
        this.cards.push(card)
      } else {
        this.cards.push(new CardClass(card.face_value, card.suit, card.id))
      }
    } else {
      // eslint-disable-next-line
      console.error('Hand - Card added to hand without checking addCard() !');
      return card
    }
  }
  removeCard(position) {
    this.cards.splice(position, 1)
  }
  clearHand() {
    this.cards = []
  }
  stand() {
    this.hasStood = true;
    this.showStood = true;
  }
  notPlayer() {
    var oldPlayer = this;
    if (this.isPlayer) {
      oldPlayer.isPlayer = false;
      oldPlayer.showButtons = false;
      setTimeout(function() {
        oldPlayer.killButtons = true
      }, 0)
    }
  }
  setPlayer() {
    var newPlayer = this;
    newPlayer.isPlayer = true;
    newPlayer.killButtons = false;
    setTimeout(function() {
      newPlayer.showButtons = true;
    }, 800)
  }
  buttonsDisabled() {
    return !this.canAcceptCard() || !this.isTurn;
  }
  getMove() {
    if (this.isAi) {
      if (this.hasStood) {
        return false;
      }
      if (this.value() >= this.threshold) {
        this.hasStood = true;
        return false
      } else {
        return true
      }
    } else {
      // eslint-disable-next-line
      console.error("getMove() called on player object.")
    }
  }
  dealerWillAccept() {
    if (this.isDealer) {
      if (this.value() >= this.threshold) {
        return false
      } else {
        return true
      }
    }
  }
  showAllCards() {
    for (var i = 0; i < this.cards.length; i++) {
      this.cards[i].up()
    }
  }
}

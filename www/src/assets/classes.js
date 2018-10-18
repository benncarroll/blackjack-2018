class CardClass {
  constructor(fv, s, id) {
    this.face_value = fv
    this.suit = s
    this.id = id
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
    if (this.face_value.isNan()) {
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
}

class HandClass {
  constructor(colour, isPlayer, id, cards) {
    this.cards = cards || [];
    this.isPlayer = isPlayer || false;
    this.colour = colour;
    this.id = id;
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
  blackjack() {
    if (this.hand_value() == 21) {
      return true
    } else {
      return false
    }
  }
  bust() {
    if (this.hand_value() > 21) {
      return true
    } else {
      return false
    }
  }
  quick_status() {
    if (this.bust()) {
      return 2
    } else if (this.blackjack()) {
      return 1
    } else {
      return 0
    }
  }
  canAcceptCard() {
    if (this.blackjack() || this.bust()) {
      return true;
    } else {
      return false;
    }
  }
  addCard(card) {
    if (this.canAcceptCard()) {
      this.cards.push(card)
    } else {
      // eslint-disable-next-line
      console.error('Hand - Card added to hand without checking addCard() !');
      return card
    }
  }

}

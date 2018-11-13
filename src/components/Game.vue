<template>
<div class='main noselect'>
  <div class="dealer-bar">
    <Dealer v-bind:dObject="dealer" v-on:deal="dealAll" v-on:superDeal="superDeal" />

    <button id="setup" class="hide" v-on:click="runGame('setup')">Setup</button>

  </div>
  <div class="hand-bar">
    <Hand v-for="hand in players" v-bind:key="hand.id" v-bind:hObject="hand" v-on:action="handEvent" v-on:setPlayer="setPlayer(hand.id)" />
  </div>
</div>
</template>

<script>
import Card from './Card.vue'
import Hand from './Hand.vue'
import Dealer from './Dealer.vue'
import {
  CardClass,
  HandClass
} from '../assets/classes.js'

export default {
  name: 'Game',
  components: {
    Card,
    Hand,
    Dealer
  },
  created() {
    // this.createHands();
    // createDeck();
    function eventFire(el, etype) {
      if (el.fireEvent) {
        (el.fireEvent('on' + etype));
      } else {
        var evObj = document.createEvent('Events');
        evObj.initEvent(etype, true, false);
        el.dispatchEvent(evObj);
      }
    }

    setTimeout(function() {
      eventFire(document.getElementById('setup'), 'click')
    }, 200)
  },
  data() {
    return {
      dealer: new HandClass(0, 'black', false, [], true, this.$parent.dealer_threshold),

      player_count: this.$parent.player_count,
      deck_count: this.$parent.deck_count,
      hideAICards: this.$parent.hideAICards,

      players: [],
      player_id: Math.floor(this.$parent.player_count / 2),

      fv_array: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      su_array: ['s', 'c', 'h', 'd'],

      card_id_counter: 0,
      player_id_counter: 0,

      deck: [],

      shuffleAmount: 100000,

      timerList: [],
      turnLength: 1000

    }
  },
  methods: {
    createHands() {
      // create player objects
      var deg = 0;
      for (var i = 0; i < this.player_count; i++) {
        var isAi = true;
        if (i == this.player_id) {
          isAi = false;
        }

        var threshold = this.$parent.ai_threshold;

        var pObject = new HandClass(this.player_id_counter++, "hsla(" + deg + ", 50%, 45%, 1)", false, [], false, threshold, isAi);

        // cycle colour
        deg += 360 / this.player_count;

        this.players.push(pObject)
      }
    },
    dealAll() {
      this.selectiveDeal(this.playersAccepting())
    },
    giveCard(player) {
      if (player.canAcceptCard()) {
        var card = this.popCard()
        if (this.hideAICards) {
          if (player.isAi) {
            card.down()
          }
        }
        player.addCard(card)
        return true;
      }
      return false;
    },
    playersAccepting() {
      var playersAccepting = [];
      for (var i = 0; i < this.players.length; i++) {
        if (this.players[i].canAcceptCard()) {
          playersAccepting.push(i)
        }
      }
      return playersAccepting;
    },
    generateRange(start, end) {
      if (start === undefined || end === undefined) {
        return [];
      }
      return Array(end - start + 1).fill().map((_, idx) => start + idx)
    },
    cullRange(range) {
      var newRange = [];
      for (var i = 0; i < range.length; i++) {
        if (this.players[range[i]].canAcceptCard()) {
          newRange.push(range[i])
        }
      }
      return newRange;
    },
    selectiveDeal(playersAccepting, dealer, iTime_import, callback_import, turnHighlighting, cycleAllPlayers_import) {
      var x = -1;
      var b = this;
      var iTime = iTime_import || 200;
      var callback = callback_import || function() {};

      var cycleRange = cycleAllPlayers_import || [];
      if (cycleRange.length == 2) {
        cycleRange = this.generateRange(cycleRange[0], cycleRange[1]);
        x = cycleRange[0] - 1;
      } else if (cycleRange.length == 1) {
        cycleRange = this.generateRange(cycleRange[0], this.players.length - 1);
        x = cycleRange[0] - 1;
      } else if (cycleRange.length == 0) {
        cycleRange = playersAccepting
        x = playersAccepting[0] - 1;
      }
      // cycleRange = this.cullRange(cycleRange);

      var intervalID = setInterval(function() {
          x++;
          if (x > cycleRange[cycleRange.length - 1]) {
            window.clearInterval(intervalID);
            callback();
          } else {
            var player = b.players[x]
            if (turnHighlighting) {
              player.isTurn = true;
              var timeoutID1 = setTimeout(function() {
                b.giveCard(player);
                if (player.hasStood) {
                  player.showStood = true;
                }
                var timeoutID2 = setTimeout(function() {
                  player.isTurn = false;
                }, iTime / 2)
                b.timerList.push(timeoutID2);
              }, iTime / 2)
              b.timerList.push(timeoutID1);
            } else {
              b.giveCard(player)
            }
          }
        },
        iTime);
      b.timerList.push(intervalID);
      // dealer values
      // 0 = none, 1 = normal, 2 = flipped
      if (dealer != 0) {
        var timeoutID = setTimeout(function() {
          if (b.dealer.canAcceptCard()) {
            var card = b.popCard()
            if (dealer == 2) {
              card.down()
            }
            b.dealer.addCard(card)
          }
        }, iTime * (cycleRange.length + 1));
        b.timerList.push(timeoutID);
      }

    },
    superDeal() {
      var b = this;
      for (var i = 0; i < 6; i++) {
        var timeoutID = setTimeout(function() {
          b.dealAll()
        }, i * 1000)
        b.timerList.push(timeoutID);
      }
    },
    dealCard(pObject) {
      var d = this.deck;
      if (d.length == 0) {
        // eslint-disable-next-line
        console.error('Deck out of cards.');
      }
      pObject.cards.push(this.popCard())

    },
    popCard() {
      if (this.deck.length == 0) {
        this.createDecks();
      }
      return this.deck.pop(Math.floor(Math.random() * this.deck.length))
    },
    chooseRandomItem(myArray) {
      return myArray[Math.floor(Math.random() * myArray.length)];
    },
    createDecks() {
      for (var i = 0; i < this.deck_count; i++) { // For every deck
        for (var s = 0; s < this.su_array.length; s++) { // For every suit
          for (var f = 0; f < this.fv_array.length; f++) { // For every value
            this.deck.push(new CardClass(
              this.fv_array[f],
              this.su_array[s],
              this.card_id_counter++
            ))
          }
        }
      }
      this.shuffleDeck();
    },
    shuffleDeck() {
      for (var i = 0; i < this.shuffleAmount; i++) {

        var c1 = Math.floor(Math.random() * this.deck.length)
        var c2 = Math.floor(Math.random() * this.deck.length)

        var temp = this.deck[c1]
        this.deck[c1] = this.deck[c2]
        this.deck[c2] = temp

      }
    },
    setPlayer(id) {
      for (var i = 0; i < this.players.length; i++) {
        this.players[i].notPlayer();
      }
      this.players[id].setPlayer();
    },
    handEvent(arg) {
      var action = arg[1];
      if (action == "hit") {
        this.selectiveDeal([arg[0]], 0);
      } else if (action == "stand") {
        this.players[arg[0]].stand()
      }
      this.runGame('roundSecondHalf');
    },
    stopGame() {
      this.runGame()
    },
    runGame(a) {
      var b = this;
      if (a == 'setup') {

        window.globalGameHook = b;
        window.stopGame = this.stopGame;

        b.runGame('reset');
        b.createDecks();
        b.createHands();
        var timeoutID1 = setTimeout(function() {
          b.dealAll();
          var timeoutID2 = setTimeout(function() {
            b.selectiveDeal(b.playersAccepting(), 2, undefined, b.runGameNewRound)
            var timeoutID3 = setTimeout(function() {
              b.players[b.player_id].setPlayer();
            }, 1500)
            b.timerList.push(timeoutID3);
          }, 1200)
          b.timerList.push(timeoutID2);
        }, 1500)
        b.timerList.push(timeoutID1);
      } else if (a == 'reset') {
        for (var i = 0; i < this.timerList.length; i++) {
          try {
            clearInterval(this.timerList[i])
          } catch (e) {
            clearTimeout(this.timerList[i])
          }
        }
        this.timerList = [];
        this.players = [];
        this.player_id_counter = 0;
        this.card_id_counter = 0;
        this.deck = []
        this.dealer.clearHand()
        this.$emit('reset');
      } else if (a == 'round') {
        var goAgain = false;
        for (var iRound = 0; iRound < this.players.length; iRound++) {
          if (this.players[iRound].canAcceptCard()) {
            goAgain = true;
          }
        }
        if (goAgain) {
          this.runGame('roundFirstHalf');
        } else {
          this.runGame('dealersTurn');
        }
      } else if (a == 'roundFirstHalf') {
        var playersAccepting = [];
        for (var iFirstHalf = 0; iFirstHalf < this.players.slice(0, this.player_id).length; iFirstHalf++) {
          // returns true for hit, false for stand
          if (this.players[iFirstHalf].getMove()) {
            playersAccepting.push(this.players[iFirstHalf].id);
          }
        }
        this.selectiveDeal(playersAccepting, 0, this.turnLength, this.runGameFirstHalfCallback, true, [0, this.player_id - 1]);
      } else if (a == 'firstHalfCallback') {
        var player = this.players[this.player_id];
        if (!player.canAcceptCard()) {
          this.runGame('roundSecondHalf');
        } else {
          player.isTurn = true;
        }
      } else if (a == 'roundSecondHalf') {
        var timeoutID = setTimeout(() => {
          this.players[this.player_id].isTurn = false;
        }, 750)
        this.timerList.push(timeoutID);
        playersAccepting = [];
        for (var j = this.player_id + 1; j < this.players.length; j++) {
          // returns true for hit, false for stand
          if (!this.players[j].getMove()) {
            playersAccepting.push(this.players[j].id);
          }
        }

        this.selectiveDeal(playersAccepting, 0, this.turnLength, this.runGameNewRound, true, [this.player_id + 1]);
      } else if (a == 'dealersTurn') {
        this.dealer.cards[1].up()
        this.giveDealer();
      } else if (a == 'finalise') {

        var winners = []
        var losers = []

        for (i = 0; i < this.players.length; i++) {

          var val = this.players[i].value()
          if (val <= 21 && val > this.dealer.value_compare()) {
            this.players[i].hasWon = true;
            // console.log(i, 'has won.');
            // console.log(this.players[i].hasWon);
            winners.push(this.players[i]);
            if (i == this.player_id) {
              this.$emit('playerWin');
            }
            // console.log("player", i, 'has won.');
          } else if (val == this.dealer.value() && val > 21) {
            this.players[i].hasLost = true;
          }
          else if (val == this.dealer.value()) {
            this.players[i].hasTied = true;
            // console.log("player", i, 'has tied.');
          } else {
            this.players[i].hasLost = true;
            losers.push(this.players[i]);
            // console.log("player", i, 'has lost.');
          }
          this.players[i].showAllCards()
        }

        setTimeout(function() {
          b.runGame('setup');
        }, 6000)

      }
    },
    runGameFirstHalfCallback() {
      this.runGame('firstHalfCallback');
    },
    runGameNewRound() {
      this.runGame('round');
    },
    giveDealer() {
      var b = this;
      if (this.dealer.dealerWillAccept()) {
        var timeoutID1 = setTimeout(function() {
          b.giveCard(b.dealer)
          b.giveDealer();
        }, 500)
        b.timerList.push(timeoutID1)
      } else {
        this.runGame('finalise')
      }

    }

  }
}
</script>

<style>
.hand-bar {
  position: fixed;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  bottom: 0;
}

.dealer-bar {
  position: fixed;
  width: 100%;
  top: 0;
}

.button {
  margin: 5px 0px 5px 0px;
  padding: 5px;
  font-size: 20px;
  font-weight: bold;
  height: 1.5em;
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  background: white;
  cursor: pointer;
  color: rgb(40, 40, 40);
}

.button.btn-disabled {
  filter: contrast(0.4);
  cursor: default;
}

.darken {
  filter: brightness(0.5) !important;
  transition: filter 1s;
}

.hand-main {
  filter: brightness(1);
  transform: scale(1);
  transition: 1s;
}

.fill {
  width: 100%;
}

.flex {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.flex-horizontal {
  flex-direction: row;
}

.flex-vertical {
  flex-direction: column;
}

.m-l-15 {
  margin-left: 15px;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.disabled {
  background: rgb(150, 150, 150);
}
</style>

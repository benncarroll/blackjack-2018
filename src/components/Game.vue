<template>
<div class='main noselect'>

  <div class="dealer-bar">
    <Dealer v-bind:dObject="dealer" />
    <button id="setup" class="hide" v-on:click="runGame('setup')">Setup</button>
  </div>

  <div class="event-text">
    {{ eventText }}
  </div>

  <div class="hand-bar">
    <Hand v-for="(hand, index) in players" v-bind:key="hand.id" v-bind:hObject="hand" v-on:action="handEvent" v-on:setPlayer="setPlayer(hand.id)" v-bind:ref="'playerComponent'+index.toString()" />
  </div>

</div>
</template>

<script>
import Hand from './Hand.vue'
import Dealer from './Dealer.vue'
import {
  CardClass,
  HandClass
} from '../assets/classes.js'

export default {
  name: 'Game',
  components: {
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


    window.num2str = function(num) {
      return window.num2str.convert(num);
    }
    window.num2str.ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    window.num2str.tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    window.num2str.teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    window.num2str.convert_tens = function(num) {
      if (num < 10) return this.ones[num];
      else if (num >= 10 && num < 20) return this.teens[num - 10];
      else {
        return this.tens[Math.floor(num / 10)] + " " + this.ones[num % 10];
      }
    }
    window.num2str.convert = function(num) {
      if (num == 0) return "zero";
      else return this.convert_tens(num);
    }

    window.toTitleCase = function(str) {
      return str.replace(
        /\w\S*/g,
        function(txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
      );
    }

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
      turnLength: 1000,

      eventText: ""

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
    initialDeal() {
      var b = this;
      b.setEventText('Dealing cards...')
      b.selectiveDeal(b.playersAccepting())
      b.createTimer(0, function() {
        b.selectiveDeal(b.playersAccepting(), 2)
      }, 200 * this.players.length);
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

      var dealIntervalID = b.createTimer(1, function() {
          x++;
          if (x > cycleRange[cycleRange.length - 1]) {
            window.clearInterval(dealIntervalID);
            callback();
          } else {
            var player = b.players[x]
            if (turnHighlighting) {
              player.isTurn = true;
              b.createTimer(0, function() {
                b.giveCard(player);
                if (player.hasStood) {
                  player.showStood = true;
                }
                b.createTimer(0, function() {
                  player.isTurn = false;
                }, iTime / 2)
              }, iTime / 2)
            } else {
              b.giveCard(player)
            }
          }
        },
        iTime);
      // dealer values
      // 0 = none, 1 = normal, 2 = flipped
      if (dealer != 0) {
        b.createTimer(0, function() {
          if (b.dealer.canAcceptCard()) {
            var card = b.popCard()
            if (dealer == 2) {
              card.down()
            }
            b.dealer.addCard(card)
          }
        }, iTime * (cycleRange.length + 1));
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
        this.dealCard(this.players[arg[0]], 0);
      } else if (action == "stand") {
        this.players[arg[0]].stand()
      }
      this.playerHook(this.players[arg[0]])
    },
    sendEmit(player_id, text) {
      var obj = this.$refs["playerComponent" + player_id.toString()][0]
      obj.emitAction(text);
    },
    setEventText(text) {
      this.eventText = text;
    },
    createTimer(type, f, time) {
      // type = 0 for timeout, 1 for interval
      var id;
      if (type == 1) {
        id = setInterval(f, time)
      } else if (type == 0) {
        id = setTimeout(f, time)
      }
      this.timerList.push(id)
      return id
    },
    runGame(a, c) {
      var b = this;
      if (a == 'setup') {

        window.globalGameHook = b;
        window.stopGame = b.stopGame;

        b.runGame('reset');
        b.createDecks();
        b.createHands();
        b.createTimer(0, function() {
          b.initialDeal();
          b.createTimer(0, function() {
            b.players[b.player_id].setPlayer();
            b.createTimer(0, function() {
              b.runGame('startTurn', 0)
            }, 1000)
          }, 200 * b.players.length * 2 + 500)
        }, 1500)

      } else if (a == 'reset') {

        for (var i = 0; i < b.timerList.length; i++) {
          try {
            clearInterval(b.timerList[i])
          } catch (e) {
            clearTimeout(b.timerList[i])
          }
        }
        b.timerList = [];
        b.players = [];
        b.player_id_counter = 0;
        b.card_id_counter = 0;
        b.deck = []
        b.dealer.clearHand()
        b.$emit('reset');

      } else if (a == 'startTurn') {

        var playerID = c;
        if (c !== parseInt(c, 10)) {
          // eslint-disable-next-line
          console.error("Player ID provided was not a number. Value: ", c)
          return;
        }

        var player = b.players[playerID]

        player.isTurn = true;

        if (player.isPlayer) {
          b.setEventText('Your turn...')
        } else {
          b.setEventText('Player ' + window.toTitleCase(window.num2str(playerID + 1)) + "'s turn...")
        }

        if (!player.isPlayer) {
          b.createTimer(0, function() {
            if (player.getMove()) {
              b.giveCard(player);

              // hit
              b.sendEmit(c, 'hit');
            }
            if (player.hasStood) {
              player.showStood = true;

              // stand
              b.sendEmit(c, 'stand');
            }
            if (player.bust()) {

              // bust
              b.sendEmit(c, 'bust');
            }
            b.createTimer(0, function() {
              b.playerHook(player)
            }, b.turnLength / 2)
          }, b.turnLength / 2)
        } else {
          if (!player.canAcceptCard()) {
            b.createTimer(0, function() {
              b.playerHook(player)
            }, b.turnLength / 2)
            b.sendEmit(c, 'stand');
          }
        }
      } else if (a == 'dealersTurn') {
        b.setEventText('Dealer will now play...');
        setTimeout(function() {
          b.dealer.cards[1].up()
          b.giveDealer();
        }, 500);
      } else if (a == 'finalise') {

        for (i = 0; i < b.players.length; i++) {
          var state = ""
          var val = b.players[i].value()
          if (val <= 21 && val > b.dealer.value_compare()) {
            b.players[i].hasWon = true;
            state = 'won';
          } else if (val == b.dealer.value() && val > 21) {
            b.players[i].hasLost = true;
            state = 'lost';
          } else if (val == b.dealer.value()) {
            b.players[i].hasTied = true;
            state = 'tied';
          } else {
            b.players[i].hasLost = true;
            state = 'lost';
          }
          if (i == b.player_id) {
            if (state == 'won') {
              b.$emit('playerWin'); // start fireworks
              b.setEventText('You won!')
            } else {
              b.setEventText('You ' + state + '.')
            }
          }
          b.players[i].showAllCards()
        }

        b.createTimer(0, function() {
          b.setEventText('Resetting...')
          b.runGame('setup');
        }, 6000)

      }
    },
    giveDealer() {
      var b = this;
      if (this.dealer.dealerWillAccept()) {
        b.createTimer(0, function() {
          b.giveCard(b.dealer)
          b.giveDealer();
        }, 1000)
      } else {
        this.runGame('finalise')
      }

    },
    playerHook(player) {
      if (player.canAcceptCard()) {
        this.runGame("startTurn", player.id)
      } else {
        player.isTurn = false;
        if (this.players.length > player.id + 1) {
          this.runGame("startTurn", player.id + 1)
        } else {
          this.runGame("dealersTurn")
        }
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

.event-text {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  color: orange;
  text-align: center;
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

.disabled {
  background: rgb(150, 150, 150);
}
</style>

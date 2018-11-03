<template>
<div class='main'>
  <div class="dealer-bar">
    <Dealer v-bind:dObject="dealer" v-on:deal="dealAll" v-on:superDeal="superDeal" />

    <input type="number" name="inumber" min=1 max=8 v-model="deck_count">
    <button type="button" name="button" v-on:click="makeDeck">Make {{ deck_count }} decks.</button>
    <br>
    <input type="number" name="inumber" min=1 max=5 rows=2 v-model="player_count">
    <button v-on:click="createHands">Create {{ player_count }} Players</button>
    <br>
    <button v-on:click="assignPlayer">Assign Player</button>
    <br>
    <button v-on:click="clearAll">Clear</button>
  </div>
  <div class="hand-bar">
    <Hand v-for="hand in players" v-bind:key="hand.id" v-bind:hObject="hand" v-on:action="handEvent" />
  </div>
</div>
</template>

<script>
import Card from './Card.vue'
import Hand from './Hand.vue'
import Dealer from './Dealer.vue'
import {
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
  },
  data() {
    return {
      dealer: new HandClass(0, 'black', false, []),

      player_count: 5,

      players: [],

      fv_array: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      su_array: ['s', 'c', 'h', 'd'],

      card_id_counter: 0,
      player_id_counter: 0,

      deck_count: 6,

      deck: [],

      shuffleAmount: 100000,

    }
  },
  methods: {
    createHands() {
      // make player objects
      var deg = 0;
      for (var i = 0; i < this.player_count; i++) {
        var pObject = new HandClass(this.player_id_counter++, "hsla(" + deg + ", 50%, 45%, 1)", false, []);

        // cycle colour
        deg += 360 / this.player_count;

        this.players.push(pObject)
      }
    },
    dealAll() {
      // eslint-disable-next-line
      // console.log('Dealing to all players...');
      var x = -1;
      var b = this;
      var iTime = 100;
      var acceptArr = [];
      for (var i = 0; i < b.players.length; i++) {
        if (b.players[i].canAcceptCard()) {
          acceptArr.push(i)
        }
      }
      var intervalID = setInterval(function() {
        x++;
        if (x >= acceptArr.length) {
          window.clearInterval(intervalID);
        } else {
          if (b.players[acceptArr[x]].canAcceptCard()) {
            b.players[acceptArr[x]].addCard(b.popCard())
          }
        }

      }, iTime);
      setTimeout(function() {
        if (b.dealer.canAcceptCard()) {
          b.dealer.addCard(b.popCard())
        }
      }, iTime * (acceptArr.length + 1));

    },
    superDeal() {
      var b = this;
      for (var i = 0; i < 6; i++) {
        setTimeout(function() {
          b.dealAll()
        }, i * 1000)
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
        this.makeDeck();
        console.log('New deck loaded.');
      }
      return this.deck.pop(Math.floor(Math.random() * this.deck.length))
    },
    chooseRandomItem(myArray) {
      return myArray[Math.floor(Math.random() * myArray.length)];
    },
    makeDeck() {
      for (var i = 0; i < this.deck_count; i++) { // For every deck
        for (var s = 0; s < this.su_array.length; s++) { // For every suit
          for (var f = 0; f < this.fv_array.length; f++) { // For every value
            this.deck.push({
              face_value: this.fv_array[f],
              suit: this.su_array[s],
              id: this.card_id_counter++
            })
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
    assignPlayer() {
      this.player_id = Math.floor(this.players.length / 2)

      this.players[this.player_id].isPlayer = true;

    },
    handEvent(arg) {
      // eslint-disable-next-line
      console.log(arg);
    },
    clearAll() {
      this.players = []
      this.dealer.clearHand()
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

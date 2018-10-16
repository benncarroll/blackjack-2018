<template>
<div id="app">
  <div class="overlay-padding">
    <div class="overlay-box">
      <p>Your screen size is too small to play Blackjack!</p>
      <p>Try it on a different screen or if on a mobile device, flip horizontally.</p>
    </div>
  </div>
  <div class="dealer-bar">
    <Dealer v-bind:dObject="dealer" v-on:deal="dealAll" />
  </div>
  <div class="hand-bar">
    <Hand v-for="hand in players" v-bind:key="hand.id" v-bind:colour="hand.colour" v-bind:cards="hand.cards" />
  </div>
</div>
</template>

<script>
import Card from './components/Card.vue'
import Hand from './components/Hand.vue'
import Dealer from './components/Dealer.vue'

export default {
  name: 'app',
  components: {
    Card,
    Hand,
    Dealer
  },
  created() {
    this.createHands();
    // createDeck();
  },
  data() {
    return {
      dealer: {
        id: 0,
        cards: [{
          face_value: '10',
          suit: 'c',
          id: 37
        }]
      },

      playercount: 5,

      players: [],

      fv_array: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
      su_array: ['s', 'c', 'h', 'd'],

      card_id_counter: 0

    }
  },
  methods: {
    createHands() {
      // make player objects
      var deg = 0;
      var id = 1;
      var cid = 0;
      for (var i = 0; i < this.playercount; i++) {
        var pObject = {
          cards: []
        };

        // set id
        pObject.id = id;
        id++;

        // choose colour
        pObject.colour = "hsla(" + deg + ", 50%, 45%, 1)";
        deg += 360 / this.playercount;

        // give random cards
        pObject.cards = []
        // pObject.cards.push({
        //   face_value: chooseRandomItem(fv_array),
        //   suit: chooseRandomItem(su_array),
        //   id: cid
        // })
        cid++;

        this.players.push(pObject)
      }
      console.log(this.players);
    },
    dealAll() {
      console.log('Dealing to all players...');
      var x = 0;
      var b = this;
      var iTime = 100
      var intervalID = setInterval(function() {

        b.dealCard(b.players[x])

        if (++x === b.players.length) {
          window.clearInterval(intervalID);
        }
      }, iTime);
      setTimeout(function() {
        b.dealCard(b.dealer)
      }, iTime * (b.players.length + 1));

    },
    dealCard(pObject) {
      pObject.cards.push({
        face_value: this.chooseRandomItem(this.fv_array),
        suit: this.chooseRandomItem(this.su_array),
        id: this.card_id_counter++
      })

    },
    chooseRandomItem(myArray) {
      return myArray[Math.floor(Math.random() * myArray.length)];
    }

  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

body {
  background-color: #EEEEEE;
  font-family: 'Montserrat', sans-serif;
  /* display: grid;
  grid-template-rows: auto;
  justify-items: center; */
  /* align-items: center; */
}

body,
html {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  width: 100%;
}

body {
  background-color: rgb(26, 26, 26);
  font-family: 'Montserrat', sans-serif;
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
}

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

.overlay-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80vw;
  height: 80vh;
  padding: 10vh 10vw 10vh 10vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
}

@media only screen and (min-width: 300px) {
  .overlay-box {
    display: none;
  }
}
</style>

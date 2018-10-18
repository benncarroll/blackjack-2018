<template lang="html">
  <div class="main">
  <div class="value" v-on:click="removeCard(0)"> {{ hand_value() }} </div>

<div class="hand" v-bind:style="{backgroundColor: hObject.colour}">

  <div class="flex flex-horizontal">

      <div class="card-column">



        <Card v-for="card in hObject.cards" v-bind:key="card.id" v-bind:cObject="card" v-bind:hand_stat="stat_gen()"/>

        <!-- <div class="add-wrapper" v-bind:class="{hidden: blockAdd()}">
          <input maxlength="3" size="3" v-on:keyup="keymonitor" v-model="inputContent" type="text">
          &nbsp;
          <i class="fa fa-plus-circle" v-on:click="addCard()"></i>
        </div> -->

      </div>

      <template v-if="hObject.isPlayer">
        <div class="flex flex-vertical m-l-15">
          <div class="button fill" @click="$emit('hit', [hObject.id, 'hit'])">
            <span>HIT</span>
          </div>
          <div class="button fill" @click="$emit('action', [hObject.id, 'stand'])">
            <span>STAND</span>
          </div>
        </div>
      </template>

    </div>

      <!-- {{ hand_value() }}
      {{ blackjack() }}
      {{ border() }} -->

</div>
</div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'Hand',
  props: ['hObject'], //'colour', 'cards', 'player'],
  components: {
    Card
  },
  data() {
    return {
      value: 0,
      inputContent: ""
    }
  },
  methods: {
    removeCard(id) {
      this.hObject.cards.splice(id, 1)
    },
    addCard() {

      if (this.blockAdd()) {
        return
      }

      var letterReg = /[scdh]+/gi // regex to match suits (s, c, d, h)
      var numberReg = /((((1)(0))|[2-9])|[akqj]){1}/gi // regex to match value (2-10, A, K, Q, J)

      var face = this.inputContent.match(numberReg)
      var suit = this.inputContent.match(letterReg)

      // If either one of the regex's don't match, return
      if (!face || !suit) {
        return;
      }

      this.cards.push({
        face_value: face[0],
        suit: suit[0].toLowerCase(),
        id: this.getRandomInt(100, 10000000)
      })

      this.inputContent = "";
    },
    keymonitor: function(event) {
      if (event.key == "Enter") {
        this.addCard()
      }
    },
    hand_value() {
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
      var cards = this.hObject.cards;
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
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    },
    blackjack() {
      if (this.hand_value() == 21) {
        return true
      } else {
        return false
      }
    },
    bust() {
      if (this.hand_value() > 21) {
        return true
      } else {
        return false
      }
    },
    stat_gen() {
      if (this.bust()) {
        return 2
      } else if (this.blackjack()) {
        return 1
      } else {
        return 0
      }
    }
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.hand {
  background: rgba(199, 199, 199, 1);
  padding: 10px;
  margin-right: 5px;
  margin-left: 5px;
  text-align: center;
  border: 2px solid transparent;
  border-color: transparent;
  border-radius: 10px 10px 0px 0px;
  min-width: 60px;
  transition: height 1s;
}

i.fa {
  float: right;
  cursor: pointer;
}

.add-wrapper {
  color: rgb(255, 255, 255);
  margin-top: 10px;
  text-align: center;
}

.card-column {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
}

input {
  background-color: #808080;
  color: white;
  border: none;
}

.hidden {
  display: none;
}

.value {
  color: white;
  text-align: center;
  width: 100%;
}
</style>

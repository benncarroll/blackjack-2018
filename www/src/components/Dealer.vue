<template lang="html">
<div class="dealer">
      <div class="card-row">

        <span class="value" v-on:click="removeCard(0)"> {{ hand_value() }} </span>

        <Card v-for="card in dObject.cards" v-bind:key="card.id" v-bind:cObject="card" v-bind:hand_stat="stat_gen()"/>

        <!-- <div class="add-wrapper" v-bind:class="{hidden: blockAdd()}">
          <input maxlength="3" size="3" v-on:keyup="keymonitor" v-model="inputContent" type="text">
          &nbsp;
          <i class="fa fa-plus-circle" v-on:click="addCard()"></i>
        </div> -->

        <div class="button deal" @click="$emit('deal')">
          <span>DEAL</span>
        </div>

      </div>
      <!-- {{ hand_value() }}
      {{ blackjack() }}
      {{ border() }} -->

</div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'Dealer',
  props: ['dObject'],
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
      this.dObject.cards.splice(id, 1)
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

      this.dObject.cards.push({
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
      for (var i = 0; i < this.dObject.cards.length; i++) {
        var fv_letter = this.dObject.cards[i].face_value.toUpperCase();
        if (fv_letter in vd) {
          total += vd[fv_letter];
          if (fv_letter == "A") {
            ace_count += 1;
          }
        } else {
          total += Number(this.dObject.cards[i].face_value);
        }
      }
      while (total > 21 && ace_count > 0) {
        total -= 10;
        ace_count -= 1;
      }
      return total
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
    },
    blockAdd() {
      if (this.blackjack() || this.bust()) {
        return true;
      } else {
        return false;
      }
    },
    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
  }
}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.dealer {
  background: rgba(70, 70, 70, 1);
  padding: 10px;
  margin-right: 5px;
  margin-left: 5px;
  text-align: center;
  border: 2px solid transparent;
  border-color: transparent;
  border-radius: 0px 0px 10px 10px;
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

.card-row {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.card-row .card {
  margin: 0px 10px 0px 10px;
}
@media only screen and (min-width: 500px) {
  /* .card-row .card {
    margin: 0px;
  } */
  .card-row {
    justify-content: center;
  }
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

</style>

<template lang="html">
<div class="dealer">
      <div class="card-row">

        <span class="value" v-on:click="dObject.removeCard(0)"> {{ dObject.value() }} </span>

        <Card v-for="card in dObject.cards" v-bind:key="card.id" v-bind:cObject="card" v-bind:hand_stat="dObject.quick_status()"/>

        <div class="button deal" @click="$emit('deal')">
          <span>DEAL</span>
        </div>
        <div class="button deal" @click="$emit('superDeal')">
          <span>SUPER DEAL</span>
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
.deal {
  margin-left: 10px;
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
</style>

<template lang="html">
  <div class="main">
  <div class="value" v-on:click="hObject.removeCard(0)"> {{ hObject.value() }} </div>

<div class="hand" v-bind:style="{backgroundColor: hObject.colour}">

  <div class="flex flex-horizontal">

      <div class="card-column">



        <Card v-for="card in hObject.cards" v-bind:key="card.id" v-bind:cObject="card" v-bind:hand_stat="hObject.quick_status()"/>

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

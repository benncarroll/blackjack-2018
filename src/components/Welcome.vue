<template lang="html">

<div class="main">
  <div class="flex flex-vertical max">
    <div class="center-box" id="center-box">

      <h1>Welcome to Blackjack!</h1>

      <p>In Blackjack, you play against the dealer, or the <i>house</i>. <br> The other players have no effect on you.</p>

      <p>The aim of the game is to get as close to <b>21</b> as possible, <b>without going over</b>. <br> A hand value of 22 or above is called <b>bust</b>, and you will forfeit any chance of winning. <br>
        <i>(this also applies to the dealer)</i> </p>

      <p>You'll start with two cards, and on your turn choose whether you'd like <br> another card. <br>
        <ul class="welcome-list">
          <li>If you're done and don't think you need any more cards, click <span class="fake-button">STAND</span></li>
          <li>If you want another card, click <span class="fake-button">HIT</span> and you'll be dealt another card and be able <br>
            to make another choice.</li>
        </ul>
      </p>

      <p>Your turn will end if you choose to stand or your hand goes bust.</p>

      <p><i>*Note: Picture cards have a value of 10 while aces can have a value of 11 or 1,<br>
        and the game will decide this automatically for you.</i></p>

      <p>To win, the value of your hand must be less than or equal to 21, but over the dealer's value. <br>
        If the dealer's hand is bust and yours is not, you will win.
      </p>

      <div class="game-options">
        <!-- <input type="number" min="1" max="5" v-model="$parent.player_count"> -->
        <!-- <VueNumberInput class="smaller-input" v-model="$parent.player_count" :value="3" :min="1" :max="5" :inputtable="false" inline controls small></VueNumberInput> -->

        <h4>Options:
          <span @click="showOptions = !showOptions" class="showOptions-button noselect"><span v-if="showOptions">↑</span><span v-else>↓</span></span>
        </h4>

        <div class="options-inner" v-if="showOptions">
          <div class="game-option">
            <CustomInput :value="3" max="21" min="1" v-model="$parent.player_count" /> <span>Player Count</span>
          </div>
          <div class="game-option">
            <CustomInput :value="3" max="12" min="1" v-model="$parent.deck_count" /> Deck Count
          </div>
          <div class="game-option">
            <CustomInput :value="16" max="21" min="1" v-model="$parent.ai_threshold" /> AI Threshold
          </div>
          <div class="game-option">
            <CustomInput :value="17" max="21" min="1" v-model="$parent.dealer_threshold" /> Dealer Threshold
          </div>
          <div class="game-option">
            <CustomInput :value="false" v-model="$parent.hideAICards" /> Hide AI Cards
          </div>
        </div>

      </div>

      <router-link :to="{ name: 'game'}" tag="div" class="start-button">
        <b>start game →</b>
      </router-link>
    </div>
  </div>
</div>

</template>

<script>
import CustomInput from './CustomInput.vue';

export default {
  name: "Welcome",
  components: {
    CustomInput
  },
  data() {
    return {
      showOptions: false
    }
  }
}
</script>

<style lang="css">
h4 {
  margin: 5px 0;
}

.center-box {
  color: white;
  padding: 10px;
}

.fake-button {
  background: white;
  color: black;
  font-weight: bold;
  padding: 0 5px;
  zoom: 0.8;
}

.start-button {
  color: rgb(255, 63, 63);
  text-decoration: none;
  cursor: pointer;
  background: rgba(70, 70, 70, 1);
  border-radius: 10px;
  padding: 10px;
  width: 10em;
  text-align: right;
  float: right;
}

.game-options {
  text-decoration: none;
  background: rgba(70, 70, 70, 1);
  border-radius: 10px;
  padding: 5px;
  min-width: 200px;
  float: left;
  font-size: 0.9em;
}

.game-option {
  margin: 3px 3px 0 0;
}

.options-inner {
  color: rgb(255, 63, 63);
}

.welcome-list {
  margin: 0 0;
}

.showOptions-button {
  float: right;
  cursor: pointer;
  width: 2em;
  text-align: center;
}

/* .smaller-input {
  zoom: 0.75;
  width: 150px;
} */
</style>

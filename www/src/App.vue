<template>
<div id="app">
  <div class="overlay-padding">
    <div class="overlay-box">
      <p>Your screen size is too small to play Blackjack!</p>
      <p>Try it on a different screen or if on a mobile device, flip horizontally.</p>
    </div>
  </div>
  <router-view class="max" tag="div" />
</div>
</template>

<script>
import Game from './components/Game.vue'

export default {
  name: 'app',
  components: {
    Game
  },
  created() {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Montserrat:400,700');

body {
  background-color: #EEEEEE;
  font-family: 'Montserrat', sans-serif;
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

.fill {
  width: 100%;
}

.max {
  width: 100%;
  height: 100%;
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

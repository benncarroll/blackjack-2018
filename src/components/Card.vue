<template lang="html">
<div class="card noselect" v-on:click="cObject.flipped = !cObject.flipped">
  <div class="wrapper" v-bind:style="{color: this.getSuitData('colour', cObject.suit)}" v-bind:class="{blackjack: hand_stat == 1,  bust: hand_stat == 2, overturned: cObject.flipped}" >
    <span class="value">{{ cObject.face_value.toUpperCase() }} </span>

    <span class="icon">{{ getSuitData('icon', this.cObject.suit) }}</span>
  </div>
</div>
</template>

<script>
export default {
  name: 'Card',
  props: ['cObject', 'hand_stat'],
  data() {
    return {
      card_overturned: false
    };
  },
  methods: {
    getSuitData(type, suit) {
      var sd = {
        s: ['♠', 'black'],
        h: ['♥', 'red'],
        c: ['♣', 'black'],
        d: ['♦', 'red']
      }
      var commands = {
        'icon': 0,
        'colour': 1
      }
      if (suit in sd && type in commands) {
        return sd[suit][commands[type]]
      }
    }

  }

}
</script>

<style scoped>
.card {
  margin: 3px 0px 3px 0px;
}

.wrapper {
  padding: 5px;
  font-size: 20px;
  transform: skewX(-10deg);
  font-weight: bold;
  width: 2.5em;
  height: 1.5em;
  text-align: center;
  background: white;
}

.icon {
  font-size: 0.8em;
  vertical-align: sub;
}

.blackjack {
  background: rgb(64, 255, 0);
}

.bust {
  background: rgb(128, 0, 0);
}

.overturned {
  color: transparent !important;

  background: #36c;
  background:
  linear-gradient(115deg, transparent 75%, rgba(255,255,255,.8) 75%) 0 0,
  linear-gradient(245deg, transparent 75%, rgba(255,255,255,.8) 75%) 0 0,
  linear-gradient(115deg, transparent 75%, rgba(255,255,255,.8) 75%) 7px -15px,
  linear-gradient(245deg, transparent 75%, rgba(255,255,255,.8) 75%) 7px -15px,
  #36c;
  background-size: 15px 30px;


  }
  </style>

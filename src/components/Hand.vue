<template lang="html">
<div class="hand-main main" v-bind:class="{darken: !hObject.isTurn, blacken: hObject.hasLost, brighten: hObject.hasWon}">
  <div class="value"> {{ hObject.value_display() }} </div>
  <div class="hand" v-bind:style="{backgroundColor: hObject.colour}" v-bind:class="{wide: hObject.isPlayer}">
    <div class="flex flex-horizontal min-max">
      <div class="card-column">
        <Card v-for="card in hObject.cards" v-bind:key="card.id" v-bind:cObject="card" v-bind:hand_stat="hObject.quick_status()" />
      </div>
      <div class="flex flex-vertical m-l-15 buttonbox" v-bind:class="{minibutton : !hObject.showButtons, hide: hObject.killButtons}">
        <div class="button fill" @click="action('hit')" v-bind:class="{'btn-disabled' : disableActions()}">
          <span>HIT</span>
        </div>
        <div class="button fill" @click="action('stand')" v-bind:class="{'btn-disabled' : disableActions()}">
          <span>STAND</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'Hand',
  props: ['hObject'],
  components: {
    Card
  },
  data() {
    return {
      showButtons: false
    }
  },
  methods: {
    action(arg) {
      var h = this.hObject
      if (!h.buttonsDisabled()) {
        if (arg == 'stand') {
          this.$emit('action', [h.id, 'stand'])
        } else if (arg == 'hit') {
          if (h.canAcceptCard()) {
            this.$emit('action', [h.id, 'hit'])
          }
        }
      }
    },
    disableActions() {
      if (this.hObject.buttonsDisabled()) {
        return true
      } else {
        return false
      }
    },
    setPlayer() {
      this.$emit('setPlayer')
    }
  }

}
</script>

<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
@import url("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");

.hand { background: rgba(199, 199, 199, 1);
padding: 10px;
margin-right: 5px;
margin-left: 5px;
text-align: center;
border: 2px solid transparent;
border-color: transparent;
border-radius: 10px 10px 0px 0px;
min-width: 60px;
min-height: 100px;
width: 60px;
transition: .5s;
}

.buttonbox {
  opacity: 1;
  transition: opacity 0.5s;
}

.minibutton {
  transition: opacity 0.5s;
  opacity: 0;
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
  justify-content: space-between;
  align-items: center;
  min-height: 100%;
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

.wide {
  width: 190px;
  min-height: 100px;
  transition: 1s;
}

.blacken {
  transition: 1s;
  filter: brightness(0.2) !important;
  animation: shake 0.82s cubic-bezier(.36, .07, .19, .97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.brighten {
  transition: 1s;
  filter: brightness(1) !important;
  animation: jump 1.5s ease 0s infinite normal;
}

@keyframes jump {
  0% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-30px);
  }
  50% {
    transform: translateY(0);
  }
  60% {
    transform: translateY(-15px);
  }
  80% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(0);
  }
}
 </style>

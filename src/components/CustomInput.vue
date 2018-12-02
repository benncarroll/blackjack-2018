<template lang="html">
<div class="custom-input">
  <div class="boolean-input" v-if="type == 'boolean'" @click="toggle">
    <div class="value-text">{{ icons[selfValue.toString()] }}</div>
  </div>
  <div class="number-input" v-if="type == 'numeric'">
    <div @click="decrease" class="down input-button"></div>
    <div class="value-text">{{ selfValue }}</div>
    <div @click="increase" class="up input-button"></div>
  </div>
</div>
</template>

<script>
export default {
  name: "CustomInput",
  props: [
    'value',
    'max',
    'min'
  ],
  created() {
    if (typeof this.$props.value === "boolean") {
      this.type = "boolean"
    } else {
      this.type = "numeric"
    }
  },
  data() {
    return {
      type: 'numeric',
      selfValue: this.$props.value,
      icons: {
        'true': '✔',
        'false': '✘'
      }
    }
  },
  watch: {
    value: function (val) {
      this.selfValue = val;
    }
  },
  methods: {
    increase() {
      if (this.selfValue < this.max || this.max == undefined) {
        this.selfValue++;
        this.update();
      }
    },
    decrease() {
      if (this.selfValue > this.min || this.min == undefined) {
        this.selfValue--;
        this.update();
      }
    },
    toggle() {
      this.selfValue = !this.selfValue;
      this.update();
    },
    update() {
      this.$emit('input', this.selfValue)
    }
  }
}
</script>

<style lang="css" scoped>
.custom-input {
  display: inline-block;
  max-width: 100%;
  width: 6rem;
  min-width: 6rem;
  position: relative;
  background: rgb(26, 26, 26);
  border-radius: 3px;
  /* width: 200px; */
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 2.13rem;

}
.number-input, .boolean-input {
  padding: 0.25rem;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  height: calc(100% - 0.5rem);

}
.boolean-input {
  cursor: pointer;
}

.input-button {
  background-color: transparent;
  border: 0;
  border-radius: .25rem;
  bottom: .0625rem;
  position: absolute;
  top: .0625rem;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.down {
  border-right: .0625rem solid rgba(221, 221, 221, 0.5);
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  left: .0625rem;
}

.up {
  border-left: .0625rem solid rgba(221, 221, 221, 0.5);
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  right: .0625rem;
}

.input-button::after, .input-button::before {
  background-color: #ddd;
  content: "";
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: background-color .15s;
}
.input-button:hover::after, .input-button:hover::before {
  background-color: #0074d9;

}

.input-button::before {
  height: .0625rem;
  width: 50%;
}

.input-button::after {
  height: 50%;
  width: .0625rem;
}

.down::after {
  visibility: hidden;
}

.up::after {}

</style>

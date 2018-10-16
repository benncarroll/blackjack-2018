<template>
<keep-alive>
  <div class="hello">

    <div class="holder">

      <form @submit.prevent="addSkill">
        <input type="text" placeholder="Hey!" v-model="todo" v-validate="'length:5,30'" name="todo">

      </form>

      <ul>
        <transition-group name="list" enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutRight">
          <li v-for="(data, index) in todos" :key='index'>
            {{ data.todo }}

            <i class="fa fa-minus-circle" v-on:click="remove(index)"></i>
          </li>
        </transition-group>

        <p>Here are your todos.</p>

      </ul>
    </div>

  </div>
</keep-alive>
</template>

<script>
export default {
  name: 'Todos',
  data() {
    return {
      todo: "",
      todos: [],
    }
  },
  methods: {
    addSkill() {
      this.$validator.validateAll().then((result => {
        if (result) {
          this.todos.push({
            todo: this.todo
          });
          this.todo = "";
        }
      }))
    },
    remove(id) {
      this.todos.splice(id, 1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@import url("https://cdn.jsdelivr.net/npm/animate.css@3.5.1");
@import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css";

.holder {
  background: #fff;
}

ul {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul li {
  padding: 20px;
  font-size: 1.3em;
  background-color: #E0EDF4;
  border-left: 5px solid #3EB3F6;
  margin-bottom: 2px;
  color: #3E5252;
  word-wrap: break-word;
}

p {
  text-align: center;
  padding: 30px 0;
  color: gray;
}

.container {
  box-shadow: 0px 0px 40px lightgray;
}

input {
  width: calc(100% - 40px);
  border: 0;
  padding: 20px;
  font-size: 1.3em;
  background-color: #323333;
  color: #687F7F;
}

.alert {
  background: #ffa4a4;
  /* font-weight: bold; */
  display: inline-block;
  /* padding: 5px; */
  /* margin-top: -20px; */
  width: 100%;
  /* height: 20px; */
}

i.fa {
  float: right;
  cursor: pointer;
}
</style>

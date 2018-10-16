/*jshint esversion: 6 */

import Vue from 'vue';
import Router from 'vue-router';
import Todos from './components/Todos.vue';
import About from './components/About.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path:'/',
      name: 'todos',
      component: Todos
    },
    {
      path:'/about/:name',
      name:'about',
      component: About
    }
  ]
});

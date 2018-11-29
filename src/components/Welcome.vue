<template lang="html">

<div class="main">
  <div class="flex flex-horizontal max zoom">
  <router-link :to="{ name: 'game'}">
    zoom →
  </router-link>
  </div>
</div>

</template>

<script>
export default {}
</script>

<style lang="css">
.zoom a {
  z-index: 1000;
  color: red;
  text-decoration: none;
}
</style>

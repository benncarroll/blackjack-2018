<template lang="html">
  <div class="about">
    <h1>Hello {{ their_name }}, welcome to the About page!</h1>
    <p>La dee daa</p>
  </div>
</template>

<script>
export default {
  name: 'About',
  data() {
    return {
      their_name: this.$route.params.name
    }
  }
}
</script>

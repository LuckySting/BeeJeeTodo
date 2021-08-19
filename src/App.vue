<template>
  <div>
    {{ counter }}
    <button @click="increment">inc</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    increment() {
      this.$store.commit('todoStore/counterIncrement')
    }
  },
  computed: {
    counter() {
      return this.$store.getters['todoStore/counterGetter']
    }
  }
}
</script>

<style>
</style>

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
      this.$store.commit('todo/counterIncrement')
    }
  },
  computed: {
    counter() {
      return this.$store.getters['todo/counterGetter']
    }
  }
}
</script>

<style>
</style>

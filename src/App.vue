<template>
  <div>
    {{ currentUrl }}
    <button class="bg-green-300" @click="act">test</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    act() {
      this.$store.commit('currentUrlMutation', this.currentUrl + 'a')
    }
  },
  computed: {
    counter() {
      return this.$store.getters['todo/counterGetter']
    },
    currentUrl() {
      return this.$store.getters.currentUrlGetter
    }
  }
}
</script>

<style>
</style>

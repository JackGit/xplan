<template>
  <div class="c-showEarth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Earth from '@/assets/js/earth'
import Controller from '@/assets/js/controller'

export default {
  earth: null,

  props: {
    target: String
  },

  data () {
    return {}
  },

  mounted () {
    let earth = new Earth(this.$refs.mountNode)
    this.$options.earth = window.earth = earth
    setTimeout(() => window.controller = new Controller(earth, window.is), 1000)
  }
}
</script>

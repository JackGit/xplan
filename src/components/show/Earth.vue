<template>
  <div class="c-showEarth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Scene from '@/assets/js/earth/scene'

export default {
  earth: null,

  props: {
    target: String
  },

  data () {
    return {}
  },

  mounted () {
    this.$options.earth = window.earth = new Scene(this.$refs.mountNode)
  }
}
</script>

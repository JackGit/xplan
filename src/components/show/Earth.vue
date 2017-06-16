<template>
  <div class="c-earth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Earth from '@/assets/js/earth'

export default {
  earth: null,

  data () {
    return {}
  },

  mounted () {
    let earth = new Earth(this.$refs.mountNode)
    this.$options.earth = earth
  }
}
</script>

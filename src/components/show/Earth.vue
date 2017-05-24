<template>
  <div class="c-showEarth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Earth from '@/assets/js/earth'

export default {
  mounted () {
    let earth = new Earth(this.$refs.mountNode)
    earth.start()
  }
}
</script>

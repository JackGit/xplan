<template>
  <div class="c-showEarth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Earth from '@/assets/js/earth'

export default {
  mounted () {
    window.earth = new Earth(this.$refs.mountNode)
  }
}
</script>

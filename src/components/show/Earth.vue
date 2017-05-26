<template>
  <div class="c-showEarth">
    <div ref="mountNode"></div>
  </div>
</template>

<script>
import Earth from '@/assets/js/earth'

export default {
  earth: null,

  props: {
    target: String
  },

  data () {
    return {}
  },

  watch: {
    target (value) {
      this.moveTo(value)
    }
  },

  mounted () {
    this.$options.earth = window.earth = new Earth(this.$refs.mountNode)
  },

  methods: {
    moveTo (target) {
      let earth = this.$options.earth
      if (earth) {
        earth.rotateTo(target, () => {
          console.log('done1')
          earth.zoomInTo(target, () => {
            console.log('done2')
            earth.zoomOutTo(target, () => {
              console.log('done3')
            })
          })
        })
      }
    }
  }
}
</script>

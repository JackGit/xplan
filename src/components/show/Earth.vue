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

  /* watch: {
    target (value) {
      this.moveTo(value)
    }
  }, */

  mounted () {
    this.$options.earth = window.earth = new Scene(this.$refs.mountNode)
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

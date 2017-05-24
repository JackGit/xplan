<template>
  <div class="c-page">
    <div class="c-page__wrapper" ref="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import '@/assets/css/page.css'
import Constants from '@/assets/js/constants'
import CenterIt from 'center-it'
const WIDTH = Constants.PAGE_WIDTH
const HEIGHT = Constants.PAGE_HEIGHT

export default {
  wrapper: null,

  mounted () {
    this.$options.wrapper = this.$refs.wrapper
    window.addEventListener('resize', () => {
      this.resize()
    })
    this.resize()
  },

  methods: {
    resize () {
      let $wrapper = this.$options.wrapper
      let ratio = new CenterIt({
        containerWidth: window.innerWidth,
        containerHeight: window.innerHeight,
        originWidth: WIDTH,
        originHeight: HEIGHT,
        centerType: 'contain'
      }).ratio()
      $wrapper.style.transform = `scale(${ratio})`
    }
  }
}
</script>

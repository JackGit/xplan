<template>
  <div class="c-page">
    <div class="c-page__wrapper" ref="wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import '@/assets/css/page.css'
import { PAGE_WIDTH, PAGE_HEIGHT } from '@/assets/js/constants'
import CenterIt from 'center-it'

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
        originWidth: PAGE_WIDTH,
        originHeight: PAGE_HEIGHT,
        centerType: 'contain'
      }).ratio()
      $wrapper.style.transform = `scale(${ratio})`
    }
  }
}
</script>

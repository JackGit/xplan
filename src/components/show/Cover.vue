<template>
  <div class="c-showCover">
    <div class="c-showCover__cover"></div>
    <div class="c-showCover__coord" v-show="showCoord" :style="{backgroundPosition}"></div>
    <div class="c-showCover__tips" v-show="showTips">
      <div class="c-showCover__hand"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTips: {
      type: Boolean,
      default: true
    },
    showCoord: {
      type: Boolean,
      default: true
    },
    coordIndex: {
      type: Number,
      default: 0
    }
  },

  data () {
    let map = ['0px 0px', '0px -19px', '0px -38px', '0px -57px', '0px -76px']
    return {
      backgroundPosition: map[this.coordIndex]
    }
  }
}
</script>

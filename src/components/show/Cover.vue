<template>
  <div class="c-earthCover">
    <div class="c-earthCover__cover"></div>
    <div class="c-earthCover__coord" v-show="showCoord" :style="{backgroundPosition}"></div>
    <transition name="fade">
      <div class="c-earthCover__tips" v-show="showTips">
        <div class="c-earthCover__hand"></div>
      </div>
    </transition>
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
    return {
      backgroundPosition: ''
    }
  },

  watch: {
    coordIndex (value) {
      this.setBackgroundPosition(value)
    }
  },

  methods: {
    setBackgroundPosition (index) {
      this.backgroundPosition = ['0px 0px', '0px -19px', '0px -38px', '0px -57px', '0px -76px'][index]
    }
  }
}
</script>

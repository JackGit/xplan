<template>
  <div class="c-endCover">
    <div class="c-endCover__texts">
      <div class="c-endCover__text line1"></div>
      <div class="c-endCover__text line2"></div>
      <div class="c-endCover__text line3"></div>
      <div class="c-endCover__text line4"></div>
    </div>
    <div class="c-endCover__slogan"></div>
    <div class="c-endCover__actions" ref="actions">
      <span class="c-endCover__backBtn" @click="handleBack"></span>
      <span class="c-endCover__registerBtn" @click="handleRegister"></span>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: false
    }
  },

  mounted () {
    setTimeout(() => {
      this.active = true
    }, 9000)
  },

  methods: {
    handleBack () {
      if (this.active) {
        this.$emit('back')
      }
    },
    handleRegister () {
      if (this.active) {
        window.location.href = 'https://kandian.qq.com/mqq/activity/html/qqexplore.html'
      }
    }
  }
}
</script>

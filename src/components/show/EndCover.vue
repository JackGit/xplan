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
  methods: {
    handleBack () {
      // when opacity of actions is 1, then it's clickable
      if (window.getComputedStyle(this.$refs.actions).opacity === '1') {
        this.$emit('back')
      }
    },
    handleRegister () {
      // when opacity of actions is 1, then it's clickable
      if (window.getComputedStyle(this.$refs.actions).opacity === '1') {
        window.location.href = 'https://kandian.qq.com/mqq/activity/html/qqexplore.html'
      }
    }
  }
}
</script>

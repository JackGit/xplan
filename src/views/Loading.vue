<template>
  <page>
    <div class="c-loading">
      <div class="c-loading__text"></div>
      <div class="c-loading__orbits"></div>
      <div class="c-loading__progress">{{progress}}%</div>
      <div class="c-loading__tips">打开声音体验更佳</div>
    </div>
  </page>
</template>

<script>
import '@/assets/css/loading.css'
import Page from '@/components/Page'

export default {
  components: {
    'page': Page
  },

  props: {
    progress: {
      type: Number,
      default: 0
    }
  }
}
</script>

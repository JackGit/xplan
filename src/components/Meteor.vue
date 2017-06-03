<template>
  <div class="c-meteor"></div>
</template>

<script>
import Meteor from '@/assets/js/meteor'

export default {
  mounted () {
    /* eslint-disable no-new */
    new Meteor(this.$el)
  }
}
</script>

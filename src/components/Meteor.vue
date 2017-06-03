<template>
  <div class="c-meteor"></div>
</template>

<script>
import Meteor from '@/assets/js/meteor'

export default {
  mounted () {
    new Meteor(this.$el)
  }
}
</script>

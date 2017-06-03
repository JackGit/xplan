<template>
  <div class="c-actions">
    <span :class="{'c-actions__longPressText': true, 'is-active': showPressButton}"></span>
    <span :class="{'c-actions__longPress': true, 'is-active': showPressButton}" @touchstart="handleStart" @touchend="handleEnd" @touchcancel="handleEnd"></span>
    <span :class="{'c-actions__xplan': true, 'is-active': showXplanButton}"></span>
  </div>
</template>

<script>
export default {
  props: {
    showPressButton: Boolean,
    showXplanButton: Boolean
  },

  methods: {
    handleStart () {
      this.$emit('hold')
    },

    handleEnd () {
      this.$emit('release')
    }
  }
}
</script>

<template>
  <div class="c-clouds">
    <div ref="container" class="c-clouds__spriteContainer"></div>
  </div>
</template>

<script>
import ImageSprite from 'image-sprite'
import { PAGE_WIDTH, PAGE_HEIGHT } from '@/assets/js/constants'

function getCloudImages (resources) {
  return new Array(13).fill('').map((item, index) => {
    return resources[`cloud${index}`].data
  })
}

export default {
  imageSprite: null,

  mounted () {
    this.createImageSprite()
  },

  methods: {
    createImageSprite () {
      let images = getCloudImages(window.loader.resources)
      let imageSprite = new ImageSprite(this.$refs.container, {
        interval: 80,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        images: images
      })

      this.$options.imageSprite = imageSprite
    }
  }
}
</script>

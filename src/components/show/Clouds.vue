<template>
  <div class="c-clouds">
    <div ref="container" style="display: none"></div>
  </div>
</template>

<script>
import ImageSprite from 'image-sprite'

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
        width: window.innerWidth,
        height: window.innerHeight,
        images: images
      })

      this.$options.imageSprite = imageSprite
    }
  }
}
</script>

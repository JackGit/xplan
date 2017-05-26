<template>
  <div class="c-clouds">
    <transition name="fade">
      <div ref="container" v-show="show"></div>
    </transition>
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

  props: {
    play: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      show: false
    }
  },

  mounted () {
    this.createImageSprite()
  },

  watch: {
    play (value) {
      if (value === 'in') {
        this.zoomIn()
      }
      if (value === 'out') {
        this.zoomOut()
      }
    }
  },

  methods: {
    createImageSprite () {
      let that = this
      let images = getCloudImages(window.loader.resources)
      let imageSprite = new ImageSprite(this.$refs.container, {
        interval: 80,
        width: window.innerWidth,
        height: window.innerHeight,
        images: images,
        onLoaded () { console.log('loaded') },
        onUpdate () {
          if (
            this.currentFrameIndex === 11 && this.direction === 'forward' ||
            this.currentFrameIndex === 1 && this.direction === 'backward'
          ) {
            that.show = false
          }
        }
      })

      window.is = this.$options.imageSprite = imageSprite
    },

    zoomIn () {
      if (this.$options.imageSprite) {
        this.show = true
        this.$options.imageSprite.play({ toFrame: 12 })
      }
    },

    zoomOut () {
      if (this.$options.imageSprite) {
        this.show = true
        this.$options.imageSprite.play({ toFrame: 0, direction: 'backward' })
      }
    }
  }
}
</script>

<template>
  <page>
    <div :class="{'c-show': true, 'low-position': isEnd}">
      <show-earth ref="earth"></show-earth>
    </div>
  </page>
</template>

<script>
import '@/assets/css/show.css'
import Controller from '@/assets/js/controller'
import Page from '@/components/Page'
import ShowEarth from '@/components/show/Earth'

export default {
  controller: null,

  components: {
    'page': Page,
    'show-earth': ShowEarth
  },

  data () {
    return {
      isEnd: false,
      showTips: true,
      showCoord: false,
      showXplanButton: false,
      coordIndex: -1,
      revealed: false
    }
  },

  mounted () {
    this.addDocumentTouchMove()
    // this.createController()
  },

  methods: {
    addDocumentTouchMove () {
      document.documentElement.addEventListener('touchmove', this.handleDocumentTouchMove.bind(this))
    },
    handleHold () {
      this.$options.controller.start()
    },
    handleRelease () {
      this.$options.controller.end()
    },
    handleKnowMore () {
      this.isEnd = true
    },
    handleBack () {
      this.isEnd = false
    },
    handleDocumentTouchMove (e) {
      if (this.showTips) {
        this.showTips = false
      }
      e.preventDefault()
    },
    handleAudioSpriteEnd () {
      this.$options.controller.nextTarget()
    },
    createController () {
      let that = this
      let earth = this.$refs.earth.$options.earth
      let cloudSprite = this.$refs.cloudSprite.$options.imageSprite
      let videoSprite = this.$refs.videoSprite.$options.videoSprite
      let audioSprite = this.$refs.audioSprite.$options.audioSprite
      let controller = new Controller({
        earth: earth,
        cloud: cloudSprite,
        videoSprite,
        audioSprite,
        onTargetChange () {
          that.showCoord = false
        },
        onStateChange (stateName) {
          if (stateName === 'idle') {
            that.showXplanButton = true
          } else {
            that.showXplanButton = false
          }
          if (stateName === 'zooming') {
            that.showCoord = true
            that.coordIndex = controller.target.coordSpriteIndex
          }
          if (stateName === 'presenting') {
            that.revealed = true
          }
        }
      })
      setTimeout(_ => controller.nextTarget(), 1000)
      this.$options.controller = controller
    }
  }
}
</script>

<template>
  <page>
    <div :class="{'c-show': true, 'low-position': isEnd}">
      <transition name="fade">
        <show-cover v-show="!isEnd" :show-tips="showTips" :show-coord="showCoord" :coord-index="coordIndex"></show-cover>
      </transition>

      <show-end-cover v-if="isEnd" @back="handleBack"></show-end-cover>
      <show-earth ref="earth"></show-earth>
      <show-clouds ref="cloudSprite"></show-clouds>
      <show-video-sprite ref="videoSprite"></show-video-sprite>
      <show-audio-sprite ref="audioSprite" @spriteend="handleAudioSpriteEnd"></show-audio-sprite>

      <transition name="fade">
        <show-actions v-show="!isEnd"
                      :show-press-button="!showTips"
                      :show-xplan-button="showXplanButton && revealed"
                      @hold="handleHold"
                      @release="handleRelease"
                      @knowmore="handleKnowMore"></show-actions>
      </transition>
    </div>
  </page>
</template>

<script>
import '@/assets/css/show.css'
import { initWX } from '@/assets/js/wx'
import Controller from '@/assets/js/controller'
import Page from '@/components/Page'
import ShowCover from '@/components/show/Cover'
import ShowEndCover from '@/components/show/EndCover'
import ShowEarth from '@/components/show/Earth'
import ShowClouds from '@/components/show/Clouds'
import VideoSprite from '@/components/show/VideoSprite'
import AudioSprite from '@/components/show/AudioSprite'
import ShowActions from '@/components/show/Actions'

export default {
  controller: null,

  components: {
    'page': Page,
    'show-cover': ShowCover,
    'show-end-cover': ShowEndCover,
    'show-earth': ShowEarth,
    'show-clouds': ShowClouds,
    'show-video-sprite': VideoSprite,
    'show-audio-sprite': AudioSprite,
    'show-actions': ShowActions
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
    this.createController()

    setTimeout(initWX, 300)
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

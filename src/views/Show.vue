<template>
  <page>
    <div class="c-show">
      <show-cover :show-tips="showTips" :show-coord="true" :coord-index="2"></show-cover>
      <show-earth ref="earth" :target="target"></show-earth>
      <show-clouds ref="cloudSprite"></show-clouds>
      <show-video-sprite ref="videoSprite"></show-video-sprite>
      <show-audio-sprite ref="audioSprite" @spriteend="handleAudioSpriteEnd"></show-audio-sprite>
      <show-actions :show-press-button="true" :show-xplan-button="false" @hold="handleHold" @release="handleRelease"></show-actions>
    </div>
  </page>
</template>

<script>
import '@/assets/css/show.css'
import Controller from '@/assets/js/controller'
import Page from '@/components/Page'
import ShowCover from '@/components/show/Cover'
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
    'show-earth': ShowEarth,
    'show-clouds': ShowClouds,
    'show-video-sprite': VideoSprite,
    'show-audio-sprite': AudioSprite,
    'show-actions': ShowActions
  },

  props: {
    target: String
  },

  data () {
    return {
      showTips: true
    }
  },

  mounted () {
    this.addDocumentTouchMove()
    this.createController()
  },

  methods: {
    addDocumentTouchMove () {
      document.documentElement.addEventListener('touchmove', this.handleDocumentTouchMove.bind(this))
    },
    handleHold () {
      controller.start()
    },
    handleRelease () {
      controller.end()
    },
    handleDocumentTouchMove () {
      if (this.showTips) {
        this.showTips = false
      }
    },
    handleAudioSpriteEnd () {
      controller.nextTarget()
    },
    createController () {
      let earth = this.$refs.earth.$options.earth
      let cloudSprite = this.$refs.cloudSprite.$options.imageSprite
      let videoSprite = this.$refs.videoSprite.$options.videoSprite
      let audioSprite = this.$refs.audioSprite.$options.audioSprite
      let controller = new Controller({
        earth: earth,
        cloud: cloudSprite,
        videoSprite,
        audioSprite
      })
      setTimeout(_ => controller.nextTarget(), 1000)
      this.$options.controller = window.controller = controller
    }
  }
}
</script>

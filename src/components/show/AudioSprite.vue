<template>
  <div class="c-audioSprite" style="display:none"></div>
</template>

<script>
import MediaSprite from 'media-sprite'
import { MEDIA_URLS, LOCATIONS } from '@/assets/js/constants'

function getSpriteInfo () {
  let spriteInfo = {}
  LOCATIONS.forEach(location => {
    spriteInfo[location.name] = location.soundSprite
  })
  return spriteInfo
}

export default {
  audioSprite: null,

  mounted () {
    this.createAudioSprite()
  },

  methods: {
    createAudioSprite () {
      let audioSprite = new MediaSprite({
        media: MEDIA_URLS.audioSprite,
        mediaType: 'audio',
        sprites: getSpriteInfo(),
        onReady () {},
        onSpriteEnd: this.handleSpriteEnd.bind(this)
      })
      this.$options.audioSprite = audioSprite

      window.wx.ready(() => {
        audioSprite.media.play()
        audioSprite.media.pause()
      })
    },
    handleSpriteEnd () {
      this.$emit('spriteend')
    }
  }
}
</script>

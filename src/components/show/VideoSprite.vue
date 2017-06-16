<template>
  <div class="c-videoSprite">
    <video ref="video" :src="videoSrc" class="c-videoSprite__video" webkit-playsinline playsinline></video>
  </div>
</template>

<script>
import MediaSprite from 'media-sprite'
import { MEDIA_URLS, LOCATIONS } from '@/assets/js/constants'

function getSpriteInfo () {
  let spriteInfo = {}
  LOCATIONS.forEach(location => {
    spriteInfo[location.name] = location.videoSprite
  })
  return spriteInfo
}

export default {
  videoSprite: null,

  data () {
    return {
      videoSrc: MEDIA_URLS.videoSprite
    }
  },

  mounted () {
    this.createVideoSprite()
  },

  methods: {
    createVideoSprite () {
      let videoSprite = new MediaSprite({
        media: this.$refs.video,
        mediaType: 'video',
        sprites: getSpriteInfo()
      })
      this.$options.videoSprite = videoSprite

      window.wx.ready(() => {
        videoSprite.media.play()
        videoSprite.media.pause()
      })
    }
  }
}
</script>

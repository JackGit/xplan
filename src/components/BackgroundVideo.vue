<template>
  <div class="c-backgroundVideo" id="video" style="display: none">
    <!-- <video id="v" :src="videoSrc"></video> -->
  </div>
</template>

<script>
import MediaSprite from 'media-sprite'
import videoSrc from '@/assets/videos/video_sprite.mp4'
import audioSrc from '@/assets/sounds/music_sprite.mp3'

export default {
  data () {
    return {
      videoSrc
    }
  },

  mounted () {
    let videoSprite = new MediaSprite({
      media: videoSrc,
      mediaType: 'video',
      sprites: {f: [1, 2], s: [4, 10]},
      onReady: function () {
        console.log('ready')
        videoSprite.play('s')
      },
      onSpriteEnd: function () {
        console.log('spriteend')
      }
    })
    window.videoSprite = videoSprite
    videoSprite.media.style.position = 'fixed'
    videoSprite.media.setAttribute('webkit-playsinline', '')
	  videoSprite.media.setAttribute('playsinline', '')
    videoSprite.media.style.zIndex = 100

    let audioSprite = new MediaSprite({
      media: audioSrc,
      mediaType: 'audio',
      sprites: {greenland: [48, 58.10938775510204], namibia: [0, 10.057142857142857]},
      onReady: function () {
        console.log('ready')
        audioSprite.play('greenland')
      },
      onSpriteEnd: function () {
        console.log('audio spriteend')
      }
    })
    window.audioSprite = audioSprite
  }
}
</script>

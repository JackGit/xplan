<template>
  <div id="app">
    <loading :progress="progress" v-show="loading"></loading>
    <show v-if="!loading" :target="target"></show>
    <meteor v-if="!loading"></meteor>
    <background-audio></background-audio>
  </div>
</template>

<script>
import '@/assets/js/jweixin-1.2.0'
import '@/assets/css/app.css'
import Loader from 'resource-loader'
import Loading from '@/views/Loading'
import Show from '@/views/Show'
import Meteor from '@/components/Meteor'
import { IMAGE_URLS } from '@/assets/js/constants'
import BackgroundAudio from '@/components/BackgroundAudio'

export default {
  name: 'app',
  components: {
    'loading': Loading,
    'show': Show,
    'meteor': Meteor,
    'background-audio': BackgroundAudio
  },

  data () {
    return {
      progress: 13,
      loading: true,
      target: ''
    }
  },

  mounted () {
    this.initLoader()
  },

  methods: {
    initLoader () {
      let loader = new Loader()

      Object.keys(IMAGE_URLS).forEach(name => {
        loader.add(name, IMAGE_URLS[name])
      })

      loader.onProgress.add(() => {
        this.progress = Math.round(loader.progress)
      })

      loader.onComplete.add(() => {
        setTimeout(() => {
          this.loading = false
        }, 500)
      })

      loader.load()
      window.loader = loader
    }
  }
}
</script>

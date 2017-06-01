<template>
  <div id="app">
    <loading :progress="progress" v-show="loading"></loading>
    <show v-if="!loading" :target="target"></show>
    <meteor v-if="!loading"></meteor>
    <clouds v-if="!loading"></clouds>
    <background-video></background-video>
  </div>
</template>

<script>
import '@/assets/css/app.css'
import Loader from 'resource-loader'
import Loading from '@/views/Loading'
import Show from '@/views/Show'
import Meteor from '@/components/Meteor'
import Clouds from '@/components/Clouds'
import BackgroundVideo from '@/components/BackgroundVideo'
import { IMAGE_URLS } from '@/assets/js/constants'

export default {
  name: 'app',
  components: {
    'loading': Loading,
    'show': Show,
    'meteor': Meteor,
    'clouds': Clouds,
    'background-video': BackgroundVideo
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

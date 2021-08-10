<template>
  <div id="app">
    <loading :progress="progress" v-show="loading"></loading>
    <show v-if="!loading"></show>
    <meteor v-if="!loading"></meteor>
    <background-audio></background-audio>
    <footer style="position:fixed;z-index:100;bottom:18px;width:100%;padding:4px;color:rgba(255,255,255,.7);text-align:center;font-size:14px">
      ygjack414@hotmail.com <a href="https://github.com/JackGit/xplan">Github</a>
    </footer>
    <footer style="position:fixed;z-index:100;bottom:0;width:100%;padding:4px;color:rgba(255,255,255,.7);text-align:center;font-size:12px">
      <a href="https://beian.miit.gov.cn">鄂ICP备16000816号-1</a>
    </footer>
  </div>
</template>

<script>
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
      loading: true
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

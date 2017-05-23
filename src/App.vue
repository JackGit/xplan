<template>
  <div id="app">
    <loading :progress="progress" v-show="loading"></loading>
    <show v-show="!loading"></show>
  </div>
</template>

<script>
import '@/assets/css/app.css'
import Loader from 'resource-loader'
import Loading from '@/views/Loading'
import Show from '@/views/Show'

export default {
  name: 'app',
  components: {
    'loading': Loading,
    'show': Show
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

      ;[
        'http://qiniu.jackyang.me/h5/image/sniper_view.png',
        'http://qiniu.jackyang.me/h5/image/cloud_01.png',
        'http://qiniu.jackyang.me/h5/image/cloud_02.png',
        'http://qiniu.jackyang.me/h5/image/logo.png',
        'http://qiniu.jackyang.me/h5/image/logo_text.png',
        'http://qiniu.jackyang.me/h5/image/logo_text_small.png'
      ].forEach(url => {
        loader.add(url, url)
      })

      loader.onProgress.add(() => {
        this.progress = Math.round(loader.progress)
      })

      loader.onComplete.add(() => {
        setTimeout(() => {
        //  this.showLoading = false
        }, 500)
      })

      loader.load()
      window.loader = loader
    }
  }
}
</script>

<template>
  <div id="app">
    <show v-if="!loading"></show>
  </div>
</template>

<script>
import '@/assets/css/app.css'
import Loader from 'resource-loader'
import Loading from '@/views/Loading'
import Show from '@/views/Show'
import { IMAGE_URLS } from '@/assets/js/constants'

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

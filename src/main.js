import Vue from 'vue'
import App from './App'
import '@/assets/js/jweixin-1.2.0'
import { initWX } from '@/assets/js/wx'

Vue.config.productionTip = false

window.loader = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  mounted () {
    setTimeout(initWX, 300)
  }
})

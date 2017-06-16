import 'whatwg-fetch'
import '@/assets/js/jweixin-1.2.0'
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

window.loader = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

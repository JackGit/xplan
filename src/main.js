import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

window.loader = null

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})

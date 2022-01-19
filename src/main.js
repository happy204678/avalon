import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import 'xe-utils'

// require styles 引入樣式

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

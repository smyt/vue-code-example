import Vue from 'vue'
import App from './App.vue'
import store from './store'

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  render: h => h(App),
})

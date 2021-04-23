import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import VModal from 'vue-js-modal'
Vue.use(VModal)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

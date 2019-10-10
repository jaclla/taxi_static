import Vue from 'vue'
import home from './components/Home.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import axios from 'axios'
import qs from 'qs';
import {Vue2Storage} from 'vue2-storage'

Vue.use(Vue2Storage)
// You can pass options
Vue.use(Vue2Storage, {
  prefix: 'app_',
  driver: 'local'
})
Vue.prototype.$qs = qs;
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(router)
Vue.use(Element)
Vue.use(MintUI)

new Vue({
  router, MintUI,
  render: h => h(home),
  created () {
    // The configuration of the plugin can be changed at any time.
    // Just call the setOptions method and pass the object with the settings to it.
    this.$storage.setOptions({
      prefix: 'app_',
      driver: 'local',
      ttl: 60 * 1000
    })
  }
}).$mount('#app')

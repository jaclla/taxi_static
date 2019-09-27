import Vue from 'vue'
import home from './components/Home.vue'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import qs from 'qs';
Vue.prototype.$qs = qs;
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(router)
Vue.use(Element)
new Vue({
  router,
  render: h => h(home)
}).$mount('#app')

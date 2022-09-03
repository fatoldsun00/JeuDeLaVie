import Vue from 'vue'
import axios from 'axios'

import App from './App'

/* eslint-disable no-new,no-multi-assign,global-require */

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  template: '<App/>',
}).$mount('#app')
/* eslint-enable no-new,no-multi-assign,global-require */

import Vue from 'vue'
import axios from 'axios'
import APP_CONFIG from '@/app.config'

// import ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/element-ui/theme/index.css'

// import ECharts
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/custom'

import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markLine'

// import print
import Print from '@plugins/print'

// import Normal style
import '@/assets/css/normal.css'

import App from './App'
import router from './router'
import store from './store'

// 注册全局组件
import SiteHead from './components/SiteHead/SiteHead';
Vue.component('SiteHead', SiteHead);

// 配置Mock Data
if (APP_CONFIG['DEBUG']){
	let Mock = require('@/Mock/mock');
}

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = !!APP_CONFIG['DEPLOY'];
Vue.use(ElementUI)
Vue.use(Print)
Vue.component('v-chart', ECharts)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

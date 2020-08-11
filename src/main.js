import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//import global.css
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
//配置请求的根路径
// axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//导入插件
import TreeTable from 'vue-table-with-tree-grid'

//路由守卫
axios.interceptors.request.use((config)=> {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

//注册tree-table插件为全局组件
Vue.component('tree-table',TreeTable)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

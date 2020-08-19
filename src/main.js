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
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'

//导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

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

Vue.filter('dateFormat',function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2,'0')
  const d = (dt.getDate()+'').padStart(2,'0')

  const ho = (dt.getHours()+'').padStart(2,'0')
  const mi = (dt.getMinutes()+'').padStart(2,'0')
  const se = (dt.getSeconds()+'').padStart(2,'0')

  return `${y}-${m}-${d} ${ho}:${mi}:${se}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

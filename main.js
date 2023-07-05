import Vue from 'vue'
import App from './App'
import store from './store/store.js'
import { $http } from '@escook/request-miniprogram'
import Vuex from 'vuex'
Vue.config.productionTip = false
Vue.use(Vuex);//vue的插件机制
Vue.prototype.$store = store
uni.$http = $http
//配置请求根路径
$http.baseUrl = 'https://api.pingcc.cn'
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '加载中...',
  })
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()
}
// 封装的展示消息提示的方法
uni.$showMsg = function (title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none',
  })
}

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()

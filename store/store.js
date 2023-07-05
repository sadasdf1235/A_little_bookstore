// 1. 导入 Vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
import book from './book/book.js'
import video from './video/video.js'
import cartoon from './cartoon/cartoon.js'
// 2. 将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)
// 3. 创建 Store 的实例对象
const store = new Vuex.Store({
  //挂载 store 模块
  modules: {
    book,
    video,
    cartoon
  },
})

// 4. 向外共享 Store 的实例对象
export default store
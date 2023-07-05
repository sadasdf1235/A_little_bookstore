const state = {
  //漫画浏览记录
  cartoons:JSON.parse(uni.getStorageSync('cartoons') || '[]')
}
const actions = {}
const mutations = {
  cartoonFilter(state,id){
    state.cartoons = state.cartoons.filter(item=>item.cartoon.comicId!=id);
  },
  //增加浏览记录
  addCartoon(state,cartoon){
    mutations.cartoonFilter(state,cartoon.cartoon.comicId)
    state.cartoons.unshift(cartoon);
    //存储数据
    uni.setStorageSync('cartoons', JSON.stringify(state.cartoons));
  },
  //删除浏览记录
  removeCartoon(state,id){
    mutations.cartoonFilter(state,id)
    uni.setStorageSync('cartoons', JSON.stringify(state.cartoons));
  }
}
const getters = {}
export default {
  // 为当前模块开启命名空间
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
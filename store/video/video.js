const state = {
  //视频浏览记录
  videos:JSON.parse(uni.getStorageSync('videos') || '[]')
}
const actions = {}
const mutations = {
  videoFilter(state,id){
    state.videos = state.videos.filter(item=>item.video.videoId!=id);
  },
  //增加浏览记录
  addVideo(state,video){
    mutations.videoFilter(state,video.video.videoId)
    state.videos.unshift(video);
    //存储数据
    uni.setStorageSync('videos', JSON.stringify(state.videos));
  },
  //删除浏览记录
  removeVideo(state,id){
    mutations.videoFilter(state,id)
    uni.setStorageSync('videos', JSON.stringify(state.videos));
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
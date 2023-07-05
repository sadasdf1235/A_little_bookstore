  // 模块的 state 数据
   const state= {
     //书架数据
    books:JSON.parse(uni.getStorageSync('bookrack') || '[]')
  }
   const actions = {
    
  }
  // 模块的 mutations 方法
  const mutations= {
    //加入书架
   addBooks(state,book){
     state.books.unshift(book);
   },
   //更新
   updateBooks(state,books){
     state.books = books
   },
   //删除书架中的书籍
   deleteBook(state,id){
     //filter过滤是创建了一个新的数组
     state.books = state.books.filter((item)=>{
       return item.fictionId != id
     })
     //清除该书 本地存储的数据
     uni.removeStorageSync(id+'-chapterList')
     uni.removeStorageSync(id+'-chapterPages')
     uni.removeStorageSync(id+'currentIndex')
     uni.removeStorageSync(id+'-chapterIndex')
   },
   //本地存储书籍信息
   saveStorage(state){
     //去重
     state.books = [...new Set(state.books)]
      uni.setStorageSync('bookrack', JSON.stringify(state.books))
   }
  }

  // 模块的 getters 属性
const getters= {}
export default {
  // 为当前模块开启命名空间
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
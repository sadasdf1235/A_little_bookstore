<template>
  <view>
    <!-- 顶部 -->
    <view class="book-top">
      <text>全部</text>
      <uni-icons type="search" @click="goToSearch" size="32"color="balck"></uni-icons>
    </view>
    <!-- 书架区域 -->
    <commonList :items="books" :options="options" @into="intoBook" @onClick="onClick" @change="change">
      <template v-slot="{item}">
        <view class="bottom-right">
          <text>{{item.title}}</text>
          <text>{{item.author}}</text>
          <text>{{item.fictionType}}</text>
        </view>
      </template>
    </commonList>
  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  import options from '@/common/options.js'
  export default {
    data() {
      return {
        //书籍的id
        id:''
      };
    },
    computed: {
        ...mapState('book', ['books']),
        options(){
          return options;
        }
      },
    methods:{
      //删除书籍 本地存储
      ...mapMutations('book', ['deleteBook','saveStorage']),
      //跳转到搜索模块
      goToSearch(){
        uni.navigateTo({
          url:'/commonPag/search/search?fromPage=book'
        })
      },
      //阅读书籍
      intoBook(book){
          uni.navigateTo({
            url:'/bookPag/readBook/readBook?book=' + JSON.stringify(book)
          })
      },
      //右滑
      onClick(e){
        //点击了删除
        if(e.content.text == '删除'){
          this.deleteBook(this.id)
          this.saveStorage()
        }
      },
       //右滑
      change(e){
        this.id = e.fictionId
      }
    },
  }
</script>

<style lang="less">
.book-top{
  background-color:#acff7f ;
  color: black;
  display: flex;
  justify-content: space-between;
}
.bottom-right{
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          :first-child{
            font-size: 48rpx;
            font-weight: bold;
            margin-top:0
          }
          text{
            margin: 30rpx;
          }
        }
</style>

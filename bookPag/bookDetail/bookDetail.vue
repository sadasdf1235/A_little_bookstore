<template>
  <view class="main">
    <view class="top">
      <uni-title type="h1" title="书籍信息" class="top-title"></uni-title>
      <img :src="book.cover" alt="">
      <uni-title type="h2" :title="book.title "></uni-title>
    </view>
    <view class="middle">
      <text>作者:{{book.author}}</text>
      <text>{{book.descs}}</text>
    </view>
    <view class="footer">
    <text v-if="isShow" class="footer-nav" style="background-color:#ff0000 ;color: #fff;" @click="buttonAdd">加入书架</text>
    <text v-else class="footer-nav" style="background-color:#ff0000 ;color: #fff;" @click="buttonDelete">删除书籍</text>
    <text class="footer-nav"  style="background-color:#ffa200 ;color: #fff;" @click="read">阅读</text>
    </view>
  </view>
</template>

<script>
  import { mapMutations,mapState } from 'vuex'//引入mapMutations
  export default {
    data() {
      return {
        //当前书籍
        book:{},
        //书架书籍列表
        books:[],
        //是否在书架中 在为false
        isShow:true
      };
    },
    onLoad(options) {
      this.book = JSON.parse(options.book||"[]")
      this.books = JSON.parse(uni.getStorageSync('bookrack') || '[]')
    },
    onReady() {
      this.inBookrack()
    },
    computed:{
      //书架数据
      // ...mapState('book', ['books']),
    },
    methods:{
      //添加书籍 本地存储 更新书籍
      ...mapMutations('book', ['addBooks','saveStorage','updateBooks']),
      //加入书架
      buttonAdd(){
        this.addBooks(this.book);
        this.saveStorage();
        this.isShow = false;
      },
      // 删除书籍
      buttonDelete(){
          this.isShow = true
          let deleteBooks = this.books.filter((item)=>{
            return item.fictionId != this.book.fictionId
          })
          this.updateBooks(deleteBooks) 
          this.saveStorage();
      },
      //阅读按钮
      read(){
        uni.navigateTo({
          // url:'/bookPag/readBook/readBook?id='+ this.book.fictionId
          url:'/bookPag/readBook/readBook?book='+ JSON.stringify(this.book)
        })
      },
      //判断书是否已经在书架中
      inBookrack(){
        this.books.forEach((item)=>{
          //如果书在书架中 按钮就为删除书籍 否则为加入书架
          if(item.fictionId == this.book.fictionId){
            this.isShow = false
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .top{
    .top-title{
      margin-top: -30rpx;
    }
    text-align: center;
    img{
      width: 50%;
     }
  }
  .middle{
    text:first-child{
      display: block;
      margin-bottom: 30rpx;
    }
    text:last-child{
      display: block;
      text-indent:56rpx;
    }
  }
.footer{
  display: flex;
  justify-content: space-around;
  .footer-nav{
    width: 50%;
    height: 100rpx;
    text-align: center;
    line-height: 100rpx;
    margin-top: 40rpx;
  }
}
</style>

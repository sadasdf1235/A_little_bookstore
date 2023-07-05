<template>
    <view class="search-bottom">
      <view class="search-bottom-list" v-for="(book,index) in valueList" :key="index" @click="toBookDetail(book)">
        <img :src="book.cover" alt="" srcset="">
        <view class="search-bottom-list-right">
          <text>{{book.title}}</text>
          <text>作者：{{book.author}}</text>
          <text class="tag">{{book.fictionType}}</text>
          <text>简介：{{book.descs}}</text>
        </view>
      </view>
    </view>
</template>

<script>
  export default {
    name:"bookDetail",
    data() {
      return {
        
      };
    },
    props:['valueList'],
    methods:{
      toBookDetail(book){
        this.$emit('toBookDetail',book)
      }
    }
  }
</script>

<style lang="less">
.search-bottom{
  .search-bottom-list{
    display: flex;
    margin-bottom: 30rpx;
    img{
      width: 33%;
    }
    .search-bottom-list-right{
      width: 66%;
      height: 400rpx;
      margin-left: 20rpx;
      display: flex;
      flex-direction: column;
      text:first-child{
        font-size: 40rpx;
        font-weight: bold;
      }
      .tag{
        width: 200rpx;
        text-align: center;
        height: 40rpx;
        border: 2rpx solid black;
        background-color: #B22222;
        color: white;
      }
      text:last-child{
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
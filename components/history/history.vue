<template>
    <!-- 历史区域 -->
    <view class="search-history"  v-if="!list.length">
        <view class="search-history-top">
          <text>搜索历史</text>
          <text @click="clearHistory">清除</text>
        </view>
        <view class="search-history-bottom">
          <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" class="uni-tag" @click="toSearch(item)"></uni-tag>
        </view>
  </view>
</template>

<script>
  export default {
    name:"history",
    props:["list","historyList"],
    data() {
      return {
        
      };
    },
    methods:{
      //清除历史
      clearHistory(){
        this.$emit("clearHistory")
      },
      //搜索
      toSearch(item){
        this.$emit("toSearch",item)
      }
    }
  }
</script>

<style lang="less">
.search-history{
    .search-history-top{
      display: flex;
      justify-content: space-between;
    }
    .search-history-bottom{
      .uni-tag{
        margin: 30rpx 20rpx 0 0;
      }
    }
}
</style>
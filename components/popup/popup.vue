<template>
  <view>
    <!-- 上方弹框开始 -->
    <view class="top_title">
    	<uni-icons type="back" size="40" color="white" @click="goBack"></uni-icons>
    </view>
    <!-- 上方弹框结束 -->
    
    <!-- 底部弹框开始 -->
    <view class="bottom">
      <view class="bottom-catalogue" @click="showCatalogue">
        <uni-icons type="list" size="30" color="white"></uni-icons>
        <text>目录</text>
      </view>
      <slot></slot>
    </view>
    <!-- 底部弹框结束 -->
  </view>
</template>

<script>
  export default {
    name:"popup",
    data() {
      return {
        
      };
    },
    methods:{
      goBack(){
        this.$emit('goBack')
      },
      showCatalogue(){
        this.$emit('showCatalogue')
      }
    }
  }
</script>

<style lang="less">
.top_title {
  	position: absolute;
  	z-index: 998;
  	height: 150rpx;
  	width: 100%;
  	line-height: 220rpx;
  	background-color: rgba(100, 100, 100, 0.8);
  	color: #fff;
  	top: 0;
    left: 0;
    display: flex;
    align-items: center;
  	padding-left: 60rpx;
  }
  .bottom{
    z-index: 999;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 20%;
    color: #fff;
    background-color: rgba(100, 100, 100, 0.8);
    display: flex;
    justify-content: space-around;
    align-items: center;
    .bottom-catalogue,.bottom-set{
      display: flex;
      align-items: center;
    }
  }
</style>
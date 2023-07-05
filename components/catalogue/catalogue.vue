<template>
  <view>
    <uni-popup ref="popupLeft" type="left" background-color="#fff" scroll-anchoring="true">
      <scroll-view scroll-y="true" scroll-with-animation="true" show-scrollbar="true" :scroll-into-view="'chapterList'+chapterIndex" class="scroll">
        <view v-for="(chapter,index) in chapterList" :key="index" :id="'chapterList'+index" class="scroll-list" :class="index==chapterIndex?'scrollActive':''" @click="directoryJump(index+1)">
          {{chapter.title}}
        </view>
      </scroll-view>
    </uni-popup>
  </view>
</template>

<script>
  export default {
    name:"catalogue",
    data() {
      return {
        
      };
    },
    props:['chapterIndex','chapterList'],
    methods:{
      directoryJump(index){
        this.$emit('directoryJump',index)
      },
      openCata(){
        this.$refs.popupLeft.open()
      },
      closeCata(){
        this.$refs.popupLeft.close()
      }
    }
  }
</script>

<style lang="less">
  .scroll{
    white-space: nowrap;
    height: 100vh;
    margin-top: 10rpx;
    padding-left: 20rpx;
    .scroll-list{
      padding: 20rpx 0;
      color: #444;
      font-size: 34rpx;
      width: 480rpx;
      overflow: hidden;
      word-break: break-all;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-bottom: 1px solid #444;
    }
    .scrollActive{
      color: #000;
      font-size: 42rpx;
      font-weight: 700;
    }
  }
</style>
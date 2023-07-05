<template>
    <view class="bottom">
      <uni-swipe-action>
        <view class="bottom-for" v-for="(item,index) in items" :key="index" @click="into(item)">
           <uni-swipe-action-item  @click="onClick" @change="change(item)" :right-options="options">
          <view class="bottom-action">
            <view class="bottom-left">
              <img :src="item.cover?item.cover:'' || item.cartoon?item.cartoon.cover:'' ||item.video?item.video.cover:'' ">
            </view>
            <slot :item="item"></slot>
          </view>
          </uni-swipe-action-item>
        </view>
      </uni-swipe-action>
    </view>
</template>

<script>
  export default {
    data() {
      return {
        
      };
    },
    props:["items","options"],
    methods:{
      into(item){
        this.$emit("into",item)
      },
      onClick(e){
        this.$emit("onClick",e)
      },
      change(item){
        this.$emit("change",item)
      },
    }
  }
</script>

<style lang="less">
.bottom{
  .bottom-for{ 
    margin-bottom:30rpx ;
      .bottom-action{
        width: 100%;
        display: flex;
        flex-direction: row;
        .bottom-left{
          img{
            width: 300rpx;
            height: 300rpx;
          }
        }
      }
  }
}
</style>

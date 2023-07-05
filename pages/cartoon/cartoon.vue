<template>
  <view>
    <!-- 顶部 -->
    <view class="cartoon-top">
      <text>全部</text>
      <uni-icons type="search" @click="searchCartonn" size="32" color="balck"></uni-icons>
    </view>
    <commonList :items="cartoons" :options="options" @into="intoCartoonDetail" @change="change" @onClick="onClick">
      <template v-slot="{item}">
        <view class="temp">
          <view class="bottom-text">
            <text>{{item.cartoon.title}}</text>
            <text>{{item.cartoon.author}}</text>
            <text>{{item.cartoon.comicType}}</text>
          </view>
          <view class="bottom-lText">
            <text>{{item.cartoon.cartoonTitle}}</text>
          </view>
        </view>
      </template>
    </commonList>
  </view>
</template>

<script>
  import options from '@/common/options.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data() {
      return {
        id:""
      };
    },
    computed:{
      ...mapState('cartoon',['cartoons']),
      options(){
        return options;
      }
    },
    methods:{
      ...mapMutations('cartoon',['removeCartoon']),
      //进入漫画搜索页
      searchCartonn(){
        uni.navigateTo({
          url:"/commonPag/search/search?fromPage=cartoon"
        })
      },
      intoCartoonDetail(cartoon){
        uni.navigateTo({
          url:'/cartoonPag/cartoonDetail/cartoonDetail?cartoon=' + JSON.stringify(cartoon)
        })
      },
      change(e){
        this.id = e.cartoon.comicId;
      },
      onClick(e){
        //点击了删除
        if(e.content.text == '删除'){
          this.removeCartoon(this.id);
        }
      }
    }
  }
</script>

<style lang="less">
.cartoon-top{
  background-color:#acff7f ;
  color: black;
  display: flex;
  justify-content: space-between;
}
.temp{
  display: flex;
  justify-content: space-between;
  .bottom-text{
    display: flex;
    justify-content: center;
    flex-direction: column;
    text{
      display: block;
      margin: 20rpx;
    }
  }
  .bottom-lText{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>

<template>
  <view class="main">
    <!-- 上方分类栏开始 -->
    <view class="nav">
      <uni-card title="分类"  extra=" " >
        <ul>
          <li @click="toSearch(info.message)" v-for="info in classify" :key="info.message">{{info.text}}</li>
        </ul>
      </uni-card>
    </view>
    <!-- 分类栏结束 -->
    <!-- 播放记录开始 -->
    <view class="video-record">
      <text>播放记录</text>
      <scroll-view scroll-y="true" class="scroll-view">
        <commonList :items="videos" :options="options" @onClick="onClick" @change="change" @into="intoVideoDetail">
          <template v-slot="{item}">
            <view class="slot">
              <view class="left">
                <text>{{item.video.title}}</text>
                <text>{{item.video.region}}</text>
                <text>{{item.video.releaseTime}}</text>
              </view>
              <view class="right">
                <text>{{item.chapterList[item.videoIndex].title}}</text>
              </view>
            </view>
          </template>
        </commonList>
      </scroll-view>
    </view>
    <!-- 播放记录结束 -->
  </view>
</template>

<script>
  import options from '@/common/options.js'
  import {mapState,mapMutations} from 'vuex'
  export default {
    data() {
      return {
        //分类列表动态渲染
       classify:[
         {
           text:"标题",
           message:"title"
         },
         {
           text:"导演",
           message:"director"
         },
         {
           text:"主演",
           message:"actor"
         },
         {
           text:"地区",
           message:"region"
         },
         {
           text:"上映",
           message:"releaseTime"
         },
         {
           text:"分类",
           message:"videoType"
         }
       ],
        videoId:''
      };
    },
    computed:{
      ...mapState('video',['videos']),
      options(){
        return options;
      }
    },
    onShow() {
    },
    onReady() {
      //设置标题栏
      uni.setNavigationBarTitle({
      	title: '一点影视'
      });
    },
    methods:{
    ...mapMutations('video',['removeVideo']),
    	//点击分类跳转到搜索
      toSearch(mes){
        uni.navigateTo({
          url:`/commonPag/search/search?mes=${mes}&fromPage=video`
        })
      },
      //点击播放记录跳转播放
      intoVideoDetail(videoObj){
        uni.navigateTo({
          url:"/videoPag/videoDetail/videoDetail?videoObj=" + JSON.stringify(videoObj)
        })
      },
      onClick(e){
        //点击了删除
        if(e.content.text == '删除'){
          this.removeVideo(this.videoId)
        }
      },
      change(e){
        //当最后一个播放记录被删除后，change事件仍会触发，不加判断会有报错
        if(e){
          this.videoId = e.video.videoId
        }
      }
  },
  }
</script>

<style lang="less">
.main{
  .nav{
      ul{
          display: flex;
          flex-direction: row;
          li{
            list-style: none;
            margin: 30rpx; 
          }
          li:first-child{
            margin-left: 0;
          }
        }
  }
  .video-record{
      .scroll-view{
        height: 60vh;
        .slot{
          display: flex;
          justify-content: space-between;
          .left{
            display: flex;
            flex-direction: column;
            text{
              margin:20rpx;
              display: block;
            }
          }
          .right{
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
}
</style>

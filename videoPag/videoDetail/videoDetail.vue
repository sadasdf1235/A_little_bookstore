<template>
  <view class="main">
    <view class="video">
      <video :src="videoPath" autoplay="true"  enable-play-gesture="true" ref="video" id="myVideo" @timeupdate="timeChange" @ended="endToNext" @controlstoggle="changeControl" @play="changeControl" @pause="changeControl">
        <cover-view v-if="showSpeed"  @click="changeSpeed" class="speed">
          x{{speedText}}
        </cover-view>
      </video>
    </view>
    <view class="video-list">
      <!-- 注意：
       这里uniapp v-for 遍历tag是从1开始的，不是从0开始的
       -->
      <view class="tag-view" v-for="(tag,index) in videoChapterList.length" :key="index" @click="changeVideoSrc(index)">
      	<uni-tag :inverted="index == videoIndex?'false':'true'" :text="String(index+1)" :type="index == videoIndex?'warning':'default'"/>
      </view>
    </view>
  </view>
</template>

<script>
import {mapState,mapMutations } from 'vuex'
  export default {
    data() {
      return {
        //视频信息
        video:{},
        //视频章节列表
        videoChapterList:[],
        //视频路径
        videoPath:'',
        //视频播放的进度(时间：秒),用于回到播放的位置
        videoTime:0,
        //视频当前的播放进度
        videoCurrentTime:0,
        //当前播放的为第几个视频
        videoIndex:0,
        //倍速
        speedText:1.0,
        //控制倍速显示隐藏
        showSpeed:true
      };
    },
    onLoad(options) {
      //不是从播放记录跳转来的
      if(!options.videoObj){
        this.video = JSON.parse(options.video||"[]")
        this.getVideoDetail()
      }else{
        //从播放记录跳转来的
        const videoObj = JSON.parse(options.videoObj||"[]")
        this.video = videoObj.video
        this.videoChapterList = JSON.parse(videoObj.chapterList || '[]')
        this.videoIndex = videoObj.videoIndex
        this.videoPath = this.videoChapterList[this.videoIndex].chapterPath
        let videoContext = uni.createVideoContext('myVideo', this)
        videoContext.seek(Number.parseInt(videoObj.videoCurrentTime))
        setTimeout(()=>{
           videoContext.seek(Number.parseInt(videoObj.videoCurrentTime))
        },200)
      }
    },
    computed:{
       ...mapState('video', ['videos']),
    },
    methods:{
    ...mapMutations('video', ['addVideo']),
      //获取视频播放源列表
      async getVideoDetail(){
        let result = await uni.$http.get(`/videoChapter/search/${this.video.videoId}`)
        if(result.data.code == 0){
          this.videoChapterList = result.data.data.chapterList
          //第一个视频路径
          this.videoPath = this.videoChapterList[0].chapterPath
        }else{
          uni.$showMsg()
        }
      },
      //改变视频源
      changeVideoSrc(tag){
        this.videoIndex = tag
         const path = this.videoChapterList[tag].chapterPath
         //微信小程序 无法通过ref获取dom
        if(!this.$refs.video){
          let video = uni.createSelectorQuery().in(this).select('#myVideo');
          video.fields({properties:["src"]},data => {
            if(data.src != path){
              this.videoPath = path
            }
          }).exec()
        }else{
          //不是微信小程序，可以直接ref获取dom
          let video = this.$refs.video;
          if(video.src != path){
            this.videoPath = path
          }
        }
      },
      //视频进度发生变化的函数
      timeChange(e){
        this.videoCurrentTime = e.detail.currentTime
      },
      //视频播放到结尾，自动播放下一个
      endToNext(){
        this.videoIndex = this.videoIndex + 1
        this.videoPath = this.videoChapterList[this.videoIndex].chapterPath
      },
      //控制按钮的显示隐藏触发的事件
      changeControl(e){
        //如果是微信小程序
        if(Object.keys(e.detail).length != 0){
          if(e.detail.show){
            this.showSpeed = true
          }else{
            this.showSpeed = false
          }
          return;
        }
        //不是微信小程序
        this.showSpeed = true;
        let timer;
        clearTimeout(timer);
        timer = setTimeout(()=>{
          this.showSpeed = false
        },5000)
      },
      //切换倍速
      changeSpeed(){
        let timer;
        clearTimeout(timer);
        switch(this.speedText){
          // case 0.5:
          // this.speedText = 0.8;
          // break;
          // case 0.8:
          // this.speedText = 1.0;
          // break;
          case 1.0:
          this.speedText = 1.25;
          break;
          case 1.25:
          this.speedText = 1.5;
          break;
          case 1.5:
          this.speedText = 2.0;
          break;
          case 2.0:
          this.speedText = 1.0;
          break;
        }
        let videoContext = uni.createVideoContext("myVideo", this)
        videoContext.playbackRate(this.speedText)
        timer = setTimeout(()=>{
          this.showSpeed = false;
        },5000)
      }
    },
    //监听页面卸载
    onUnload() {
      //将视频章节列表缓存到本地
     let videoObj = {
       //整体视频信息
       video:this.video,
       //视频章节列表
       chapterList:this.videoChapterList,
       //当前播放的为第几个视频
       videoIndex:this.videoIndex,
       //视频的播放进度
       videoCurrentTime:this.videoCurrentTime
     }
    this.addVideo(videoObj)
    }
  }
</script>

<style lang="less">
.main{
  .video{
    video{
      position: relative;
      .speed{
        position: absolute;
        bottom:25rpx ;
        right: 86rpx;
        color:white;
        z-index: 999;
        line-height: normal;
      }
    }
    width: 100vw;
    video{
     width: 100%; 
    }
  }
  .video-list{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    .tag-view{
      margin: 10rpx;
    }
  }
}
</style>

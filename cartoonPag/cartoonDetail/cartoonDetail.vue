<template>
  <view class="main">
    <yingbing-ReadPage ref="page" style="height:100vh" bgColor="white" :slide="slide"
    :enablePreload="enablePreload"
    :noChapter="noChapter"
    enableClick
    @change="currentChange"
    @loadmore="loadmoreContent"
    @preload="preloadContent"
    @setCatalog="getCartoonChapter"
    @clickTo="clickTo"
    ></yingbing-ReadPage>
    <popup v-if="isShowBottom" @goBack="goBack" @showCatalogue="showCatalogue"></popup>
    <catalogue ref="catalogue" :chapterIndex="chapterIndex" :chapterList="chapterList" @directoryJump="directoryJump"></catalogue>
  </view>
</template>
<script>
  import {mapState,mapMutations } from 'vuex'
  export default{
    data(){
      return{
        slide: 40,
        enablePreload: true,
        noChapter: false,
        cartoon:{},
        chapterList:[],
        isShowBottom:false,
        chapterIndex:0,
        start:0
      }
    },
    computed:{
       ...mapState('cartoon', ['cartoons']),
    },
    onLoad(options) {
      const cartoonInfo = JSON.parse(options.cartoon||"{}");
      this.cartoon = cartoonInfo.cartoon || cartoonInfo
      const info = cartoonInfo.cartoonInfo
      if(info){
        this.chapterList = JSON.parse(info.chapterList || '[]')
        this.chapterIndex = info.chapterIndex || 0
        this.start = info.start || 0
      }
    },
    async onReady() {
      if(this.chapterList.length == 0){
        await this.getCartoonChapter()
      }
      let content =  await this.getCartoonContent(this.chapterList[this.chapterIndex].chapterId)
      let custom = [];
      this.getCustom(content,custom)
      const title = this.chapterList[this.chapterIndex].title
      let contents = [{
                  chapter: this.chapterIndex+1,
                  custom,//自定义页面
                  title,
                  isStart: this.chapterIndex == 0,
                  isEnd: this.chapterIndex == this.chapterList.length-1
              }]
              const { page } = this.$refs
              page.init({
                  contents: contents,
                  currentChapter: this.chapterIndex+1,
                  start: this.start
              })
    },
    methods:{
      ...mapMutations('cartoon', ['addCartoon']),
      //获取custom数组
      getCustom(cartoonContent,custom){
        if(!cartoonContent)return []
        for (let value of cartoonContent) {
          custom.push(`<img src="${value}">`)
        }
      },
       //获取漫画章节
      async getCartoonChapter(){
        let result = await uni.$http.get(`/comicChapter/search/${this.cartoon.comicId}`)
        if(result.data.code == 0){
          this.chapterList = result.data.data.chapterList;
        }else{
        // 搜索错误 或没有内容
        uni.showToast({
          title:'什么都没有搜索到哦',
          duration:1000,
          icon:'none'
        })
        }
      },
      //获取漫画内容
      async getCartoonContent(chapterId){
        let result = await uni.$http.get(`/comicContent/search/${chapterId}`)
        if(result.data.code == 0 ){
          return result.data.data
        }
      },
      currentChange(e){
        this.chapterIndex = e.chapter - 1
        this.start = e.start
      },
      async loadmoreContent(chapter,callback){
        let cartoonContent =  await this.getCartoonContent(this.chapterList[chapter-1].chapterId)
        let custom = []
        this.getCustom(cartoonContent,custom)
        const content = {
          chapter,
          custom,
          isEnd:chapter == this.chapterList.length,
          isStart:chapter==1,
          title:this.chapterList[chapter-1].title
        }
        setTimeout(() => {
           callback('success',content);
        }, 2000)
      },
      async preloadContent(chapters, callback){
        let contents = []
          setTimeout(async () => {
            for ( let i in chapters ) {
                let content = await this.getCartoonContent(this.chapterList[chapters[i]-1].chapterId)
                 let custom = []
                this.getCustom(content,custom)
                contents.push({
                chapter:chapters[i],
                start:0,
                custom,
                title: this.chapterList[chapters[i] - 1].title,
                isStart: chapters[i] == 1,
                isEnd: chapters[i] == this.chapterList.length
               })
            }
            callback('success', contents);
        }, 2000)
      },
      clickTo(){
        let timer;
        clearTimeout(timer);
        this.isShowBottom = !this.isShowBottom;
        if(this.isShowBottom){
          timer = setTimeout(()=>{
            this.isShowBottom = false;
          },2000)
        }
      },
      //展示目录
      showCatalogue(){
        this.isShowBottom = false
        this.$refs.catalogue.openCata()
      },
      //返回
      goBack() {
      	uni.navigateBack({
      		delta: 1
      	})
      },
      //目录跳转
      async directoryJump(chapter){
        this.$refs.catalogue.closeCata()
        const {page} = this.$refs
        let custom = []
        let content = await this.getCartoonContent(this.chapterList[chapter-1].chapterId)
        this.getCustom(content,custom)
        page.change({
          start:0,
          contents:[
            {
              custom,
              chapter,
              isEnd:chapter==this.chapterList.length,
              isStart:chapter==1,
              title:this.chapterList[chapter-1].title
            }
          ],
          currentChapter:chapter
        })
      }
    },
    onUnload() {
      let cartoonObj = {
        cartoon:this.cartoon,
        cartoonInfo:{
          chapterList:this.chapterList,
          chapterIndex:this.chapterIndex,
          start:this.start
        }
      }
      this.addCartoon(cartoonObj)
    }
  }
</script>
<style lang="less">
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
    .bottom-catalogue{
      display: flex;
      align-items: center;
      text{
        font-size: 64rpx;
      }
    }
  }
</style>
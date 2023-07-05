<template>
  <view class="main">
    <!-- 阅读组件开始 -->
    <yingbing-ReadPage 
    ref="page" id="myBook"
     style="height: 100%;"
    :page-type="pageType"
    :font-size="fontsize"
    :line-height="lineHeight"
    :color="color"
    :bgColor="bgColor"
    :slide="slide"
    :enablePreload="enablePreload"
    :noChapter="noChapter"
    enableClick  
    @loadmore="loadmoreContent"
    @preload="preloadContent"
    @change="currentChange"
    @setCatalog="setCatalog"
    @clickTo="clickTo">
    </yingbing-ReadPage>
    <!-- 阅读组件结束 -->
    
    <popup v-if="isShowBottom" @goBack="goBack" @showCatalogue="showCatalogue">
      <template>
        <view class="bottom-set" @click="showSet">
          <uni-icons type="gear" size="30" color="white"></uni-icons>
          <text>设置</text>
        </view>
      </template>
    </popup>
    
    <!-- 设置开始 -->
    <uni-popup ref="popup" type="bottom" background-color="white">
    	<view class="set-box">
    		<view class="font">
    			<view>
    				<span>字体</span>
    				<uni-number-box v-model="fontsize" ></uni-number-box>
    			</view>
    			<view class="lineHeight">
    				<span>行高</span>
    				<uni-number-box v-model="lineHeight" ></uni-number-box>
    			</view>
    		</view>
    		<view class="bgColor">
    			<span>背景</span>
    			<view style="background-color: #fcd281;" @click="changeBgColor('#fcd281')" :class="bgColor=='#fcd281'?'bgColorActive':''"></view>
          <view style="background-color: #C0EdC6;" @click="changeBgColor('#C0EdC6')" :class="bgColor=='#C0EdC6'?'bgColorActive':''"></view>
          <view style="background-color: #F8F8FF;" @click="changeBgColor('#F8F8FF')" :class="bgColor=='#F8F8FF'?'bgColorActive':''"></view>
    		</view>
    		<view class="pages">
    			<span>翻页</span>
    			<view class="item"  @click="changePageType('real')" :class="pageType=='real'?'typeActive':''">
    				仿真
    			</view>
    			<view class="item" @click="changePageType('cover')" :class="pageType=='cover'?'typeActive':''">
    				覆盖
    			</view>
    			<view class="item"  @click="changePageType('scroll')" :class="pageType=='scroll'?'typeActive':''">
    				滚动
    			</view>
    		</view>
    	</view>
    </uni-popup>
    <!-- 设置结束 -->
    
    <!-- 目录开始 -->
    <catalogue ref="catalogue" :chapterIndex="chapterIndex" :chapterList="chapterList" @directoryJump="directoryJump"></catalogue>
    <!-- 目录结束 -->
  </view>
</template>

<script>
  import {mapState,mapMutations } from 'vuex'
  export default {
    data() {
      return {
        pageType: 'real',
        scrollTop: 400,
        fontsize: 20,
        lineHeight: 15,
        color: '#333',
        slide: 40,
        bgColor: '#fcd281',
        enablePreload: true,
        noChapter: false,
        start:0,
        //book对象
        book:{},
        //章节id
        id:'',
        //章节列表
        chapterList:[],
        //章节索引
        chapterIndex:0,
        //是否展示底部弹框
        isShowBottom:false,
      };
    },
    computed:{
       ...mapState('book', ['books']),
    },
    onLoad(options) {
      //获取传过来的book对象
      this.book = JSON.parse(options.book || '{}');
      const bookInfo = JSON.parse(uni.getStorageSync(`book-${this.book.fictionId}`) || '{}')
      //如果书在书架
      if(bookInfo){
        this.chapterList = JSON.parse(bookInfo.chapterList || '[]')
        this.start = bookInfo.start || 0
        this.chapterIndex = bookInfo.chapterIndex || 0
        if(bookInfo.set){
          this.pageType = bookInfo.set.pageType || 'real'
          this.fontsize = bookInfo.set.fontsize || 20
          this.lineHeight = bookInfo.set.lineHeight || 15
          this.color = bookInfo.set.color || '#333'
          this.bgColor  = bookInfo.set.bgColor || '#fcd281'
        }
      }
    },
    async onReady() {
      if(Array.isArray(this.chapterList) && this.chapterList.length == 0){
        await this.setCatalog();
      }
      const chapter = this.chapterIndex;
      const content = await this.returnContent(chapter+1);
      const contents = [];
      contents.push(content);
      const {page} = this.$refs;
      //组件内置方法 初始化小说内容
      page.init({
         contents, 
         start:this.start,
         currentChapter:chapter+1
      });
    },
    methods:{
      //添加书籍 本地存储 更新书籍
      ...mapMutations('book', ['addBooks','saveStorage','updateBooks']),
      //获取章节列表
      async setCatalog(){
        const result = await uni.$http.get(`/fictionChapter/search/${this.book.fictionId}`);
        if(result.data.code == 0){
          //章节列表
          this.chapterList = result.data.data.chapterList;
        }
      },
      //获取内容
      async getContent(chapter){
        const chapterId = this.chapterList[chapter].chapterId
        if(!chapterId)return ''
        const result = await uni.$http.get(`/fictionContent/search/${chapterId}`);
        let content = '';
        for (let value of result.data.data) {
          content += value;
        }
        return content;
      },
      /*
      组件事件开始
      */
      //获取content对象
      async returnContent(chapter){
        //chapter从1开始
        const content = await this.getContent(chapter - 1);
        return {
             chapter,
             content,
             custom: [],
             title: this.chapterList[chapter - 1].title,
             isStart: chapter == 1,
             isEnd: chapter == this.chapterList.length
         }
      },
      //加载章节内容（chapter为需要加载的章节序号，callback为加载回调）
     async loadmoreContent(chapter,callback){
       const content = await this.returnContent(chapter);
       setTimeout(() => {
         callback('success',content);
      }, 2000)
     },
     //预加载章节内容（chapters为需要预加载的章节序号集合，callback为加载回调 
     preloadContent(chapters, callback){
       let contents = []
       setTimeout(async () => {
         for ( let i in chapters ) {
             contents.push({
             chapter:chapters[i],
             content:await this.getContent(chapters[i] - 1),
             start:0,
             custom: [],
             title: this.chapterList[chapters[i] - 1].title,
             isStart: chapters[i] == 1,
             isEnd: chapters[i] == this.chapterList.length
            })
         }
         callback('success', contents);
     }, 2000)
     },
     //阅读页面改变触发事件（返回当前阅读页面信息）
    currentChange (e) {
       this.chapterIndex = e.chapter - 1
       this.start = e.start
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
     /*
     组件事件结束
     */
    /*
    设置开始
    */
   //改变背景颜色
   changeBgColor(bgColor){
     this.bgColor = bgColor;
     this.color = bgColor=='C0EdC6'?'#0B0B0B':bgColor=='#F8F8FF'?"#000000":"#333"
   },
   //翻页模式
   changePageType(type){
     this.pageType = type;
   },
   goBack() {
   	uni.navigateBack({
   		delta: 1
   	})
   },
   //展示目录
   showCatalogue(){
     this.isShowBottom = false;
     this.$refs.catalogue.openCata()
   },
   //展示设置
   showSet(){
     this.isShowBottom = false;
     this.$refs.popup.open()
   },
   //目录跳转
   async directoryJump(chapter){
     this.$refs.catalogue.closeCata()
     const {page} = this.$refs
     page.change({
       start:0,
       contents:[await this.returnContent(chapter)],
       currentChapter:chapter
     })
   },
     /*
     设置结束
     */
    },
    onUnload(){
      const inBooks = this.books.some((item)=>{
        return item.fictionId == this.book.fictionId
      })
      //在书架保存数据，不在书架不保存
      if(!inBooks)return;
      const bookInfo = {
        chapterList:this.chapterList,
        start:this.start,
        chapterIndex:this.chapterIndex,
        set:{
          pageType: this.pageType,
          fontsize: this.fontsize,
          lineHeight: this.lineHeight,
          color: this.color,
          bgColor: this.bgColor,
        }
      }
     uni.setStorageSync(`book-${this.book.fictionId}`,JSON.stringify(bookInfo))
    },
  }
</script>

<style lang="less">
.main{
  width: 100vw;
  height: 100vh;
  .set-box {
  		height: 400rpx;
  		padding: 95rpx 25rpx 0 25rpx;
      color: black;
  		.font {
  			display: flex;
  			align-items: center;
  			view {
  				display: flex;
  				align-items: center;
  
  				span {
  					font-weight: 600;
  					margin-right: 15rpx;
  				}
  			}
  			.lineHeight{
  				margin-left: 30rpx;
  			}
  		}
  
  		.bgColor {
  			margin-top: 30rpx;
  			display: flex;
  			align-items: center;
  			span {
  				font-weight: 600;
  				margin-right: 20rpx;
  			}
  			view {
  				width: 60rpx;
  				height: 60rpx;
  				border-radius: 50%;
  				border: 1px solid #999;
  				margin: 10rpx;
  			}
        .bgColorActive{
          border:1px solid red;
        }
  		}
  	
  		.pages{
  			display: flex;
  			align-items: center;
  			margin-top: 30rpx;
  			span{
  				font-weight: 600;
  			}
  			.item{
  				width: 80rpx;
  				height: 60rpx;
  				border-radius: 35rpx;
  				line-height: 60rpx;
  				text-align: center;
  				border: 1px solid #999;
  				margin: 10rpx;
  				font-size: 28rpx;
  				transition: all 0.4s;
  			}
        .typeActive{
          border: 1px solid red;
        }
  		}
  	}
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
}
</style>

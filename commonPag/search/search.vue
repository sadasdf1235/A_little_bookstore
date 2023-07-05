<template>
  <view>
    <!-- 顶部搜索区域 -->
    <view class="search-top"> 
      <uni-search-bar clearButton="auto" cancelButton="none" radius="100" @confirm="searchClassification(page)" v-model="searchMessage" @clear="clear"  @input="input"></uni-search-bar>
    </view>
    <!-- 历史区域 -->
    <history :list="valueList" :historyList="historyList" @clearHistory="clearHistory" @toSearch="toSearch"></history>
    <!-- 书籍列表展示区 -->
   <bookDetail v-if="isShowBook" :valueList="valueList" @toBookDetail="toDetail"></bookDetail>
    <!-- 视频列表展示区 -->
   <searchSection v-if="isShowVideo" :valueList="valueList" @toDetail="toDetail">
      <template v-slot="{item}">
        <view class="uni-card-right">
          <text>导演:{{item.director}}</text>
          <text>主演:{{item.actor}}</text>
          <text>分类:{{item.videoType}}</text>
          <text>地区:{{item.region}}</text>
          <text>简介:{{item.descs}}</text>
        </view>
      </template>
    </searchSection>
    <!-- 漫画列表展示区 -->
  <searchSection v-if="isShowCartoon" :valueList="valueList" @toDetail="toDetail">
      <template v-slot="{item}">
        <view class="uni-card-right">
          <text>作者:{{item.author}}</text>
          <text>分类:{{item.comicType}}</text>
          <text>简介:{{item.descs}}</text>
        </view>
      </template>
    </searchSection>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        //从什么页面跳转而来
        fromPage:'',
        //搜索框的值
        searchMessage:'',
        //点击视频分类携带的信息
        mes:'',
        //搜索的列表
        valueList:[],
        //定时器
        timer:null,
        // 是否正在请求数据
        isloading: false,
        //当前页
        page:1,
        //总数据
        total:0,
         // 搜索关键词的历史记录
        historyList: []
      };
    },
    computed:{
      isShowBook(){
        return this.fromPage=='book'
      },
      isShowVideo(){
        return this.fromPage=='video'
      },
      isShowCartoon(){
        return this.fromPage=='cartoon'
      }
    },
    onLoad(options) {
      this.fromPage = options.fromPage
      this.mes = options.mes
      //从本地取出历史记录
      this.historyList = JSON.parse(uni.getStorageSync(`${this.fromPage}SearchHistory`) || '[]');
    },
    methods:{
      //对搜索结果进行去重
      removeDuplicates(list,id,result){
        // 将已有的 id 放入 Set
        const idSet = new Set(list.map(item => item[id]));
        // 遍历新加入的数据，如果 id 不存在则添加到 list 和 Set 中
        for (const item of result) {
          if (!idSet.has(item[id])) {
            list.push(item);
            idSet.add(item[id]);
          }
        }
        return list
      },
      //搜索书籍
      async searchBook(e,from = 1,size = 10){
         //打开节流阀
        this.isloading = true
        if(this.searchMessage){
          /*
          因为无法判断用户输入的内容是按照作者还是标题进行搜索的
          所以分别发送两次请求
          最后将结果合并放入书籍列表中
          */
          //按标题进行搜索
         let result1 = await uni.$http.get(`/fiction/search/title/${this.searchMessage}/${from}/${size}`)
         // 按作者进行搜索
         let result2 = await uni.$http.get(`/fiction/search/author/${this.searchMessage}/${from}/${size}`)
         if (result1.statusCode !== 200) return uni.$showMsg()
         if (result2.statusCode !== 200) return uni.$showMsg()
         let list1 = [];
         let list2 = [];
         if(result1.data.data){
           list1 = result1.data.data
         }
         if(result2.data.data){
           list2 = result2.data.data
         }
         this.isloading = false
         this.total = result1.data.count + result2.data.count
         this.valueList = this.removeDuplicates(this.valueList,'fictionId',[...list1,...list2])
      }else{
        // 用户没有输入内容就进行搜索时 触发
        uni.showToast({
          title:'请输入要搜索的内容',
          duration:1000,
          icon:'none'
        })
      }
      this.historyList.unshift(this.searchMessage)
      this.historyList = Array.from(new Set(this.historyList))
      // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('bookSearchHistory', JSON.stringify(this.historyList))
      },
      //搜索视频
      async searchVideo(e,from = 1,size = 10){
        if(this.searchMessage){
          let result = await uni.$http.get(`/video/search/${this.mes}/${this.searchMessage}/${from}/${size}`)
          if(result.data.code == 0){
            this.total = result.data.count
            this.removeDuplicates(this.valueList,'videoId',result.data.data)
          }
          //将搜索关键词放入搜索历史
          this.historyList.unshift(this.searchMessage)
          //去重
          this.historyList = [...new Set(this.historyList)]
          uni.setStorageSync('videoSearchHistory', JSON.stringify(this.historyList))
        }else{
        // 用户没有输入内容就进行搜索时 触发
        uni.showToast({
          title:'请输入要搜索的内容',
          duration:1000,
          icon:'none'
        })
      }
      },
      //搜索漫画
      async searchCartoon(e,from = 1,size = 10){
        let result = await uni.$http.get(`/comic/search/title/${this.searchMessage}/${from}/${size}`)
        if(result.data.code == 0){
              this.total = result.data.count
              this.removeDuplicates(this.valueList,'cartoonId',result.data.data)
            //将搜索关键词放入搜索历史
            this.historyList.unshift(this.searchMessage)
            //去重
            this.historyList = [...new Set(this.historyList)]
            //将历史记录存入本地
            uni.setStorageSync("cartoonSearchHistory",JSON.stringify(this.historyList));
          }else{
          // 用户没有输入内容就进行搜索时 触发
          uni.showToast({
            title:'请输入要搜索的内容',
            duration:1000,
            icon:'none'
          })
        }
      },
      //用户点击清除
      clear(){
        this.searchMessage = ''
        this.valueList = []
      },
      //input
      input(e){
        clearTimeout(this.timer)
         // 重新启动一个延时器，并把 timerId 赋值给 this.timer
         this.timer = setTimeout(() => {
           // 如果 500 毫秒内，没有触发新的输入事件，则为搜索关键词赋值
           this.searchMessage = e
         }, 500)
      },
      // 触底的事件
      onReachBottom() {
        // 判断是否还有下一页数据
        if (this.page* 10 >= this.total) return uni.$showMsg('没有了哦！')
        // 判断是否正在请求其它数据，如果是，则不发起额外的请求
          if (this.isloading) return
          this.page += 1;
          switch(this.fromPage){
            case 'book':
            this.searchBook(this.page)
            break;
            case 'video':
            this.searchVideo(this.page)
            break;
            case 'cartoon':
            this.searchCartoon(this.page)
            }
      },
      // 下拉刷新的事件
      onPullDownRefresh() {
        // 重置关键数据
        this.page = 1
        this.total = 0
        this.isloading = false
        this.valueList = []
        //重新发起请求
        this.searchClassification()
        //手动关闭刷新
        uni.stopPullDownRefresh()
      },
      //进入详情
      toDetail(item){
        item = JSON.stringify(item)
        const from = this.fromPage
        uni.navigateTo({
          url:`/${from}Pag/${from}Detail/${from}Detail?${from}=${item}`
        })
      },
      //搜索分类
      searchClassification(page = 1){
        switch(this.fromPage){
          case 'book':
          this.searchBook(page)
          break;
          case 'video':
          this.searchVideo(page)
          break;
          case 'cartoon':
          this.searchCartoon(page)
          }
      },
      //点击tag自动搜索
      toSearch(item){
        this.searchMessage = item
        this.searchClassification()
      },
      //清除历史
      clearHistory(){
        this.historyList = []
        // 清空本地存储中记录的搜索历史
        uni.setStorageSync(`${this.fromPage}SearchHistory`, '[]')
      }
    },
  }
</script>

<style lang="less">
.search-top{
  background-color:#acff7f ;
}
.uni-card-right{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
}
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

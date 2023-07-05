<template>
    <view class="list">
      <uni-section :title="child.title" type="line" v-for="(child,index) in valueList" :key="index">
      			<uni-card class="uni-card">
      				<image slot='cover' :src="child.cover" @click="toDetail(child)"></image>
      				<slot :item="child"></slot>
      			</uni-card>
      		</uni-section>
    </view>
</template>

<script>
  export default {
    name:"searchSection",
    props:['valueList'],
    methods:{
      toDetail(item){
        this.$emit('toDetail',item)
      }
    },
  }
</script>

<style lang="less">

</style>
<template>
    <div class="search" :style="{ backgroundColor:setStyle?setStyle.bgColor:'#f6f8fa'}">
        <span><img src="../../assets/img/search.png" alt=""></span>
        <div>搜索您想要的商品</div>
    </div>
</template> 
<script>
export default {
  name: "ridingresult",
  props: {
    setStyle: {
      type: Object
    }
  },
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="less">
    .search{
        width: 690px;
        height: 65px;
        display: flex;
        align-items: center;
        background: #fff;
        border-radius: 33px;
        background-color: #f6f8fa;
        span{
            flex-shrink: 0;
            width: 24px;
            height: 24px;
            display: block;
            padding-left: 30px;
            img{
                display: block;
            }
        }
        div{
            margin-right: 20px;
            color: #aeafb2;
            font-size: 28px;           
            margin-left: 20px;
        }

    }
</style>
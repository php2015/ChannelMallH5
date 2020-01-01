<template>
  <div class="special-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="product-search" @click.stop="tapToSearch()">
      <searchFixed></searchFixed>
    </div>
    <van-list
      class="van-list-special"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 广告位 -->
      <div class="ad-box" v-if="cloumnPics.length>0">
        <div class="swiper-box">
          <van-swipe :autoplay="3000" class="special-item-banner">
            <van-swipe-item @click="jumpPage(image.linkUrl)"
              v-for="(image, index) in cloumnPics"
              :key="index"
              v-lazy:background-image="image.picUrl"
            >
              <!-- <img v-lazy="image" /> -->
            </van-swipe-item>
          </van-swipe>
        </div>
      </div>
      <!-- 内容 -->

      <div class="result-box">
        <div class="result-empty" v-show="showNull">
          <no-data-view scene="noData"></no-data-view>
        </div>
        <div class="product-list" v-show="!showNull">
          <div
            class="product-item"
            v-for="(item, index) in list"
            :key="index"
            @click.stop="jumpProductDetail({id:item.channelCommId,columnCommId:item.columnCommId})"
          >
            <goods :goodsData="item" />
          </div>
        </div>
      </div>

      <!-- <div class="product-item">
          <goods/>
      </div>-->
    </van-list>
  </div>
</template>

<script>
import Vue from "vue";
import goods from "./component/goods";
import searchFixed from "../../components/index/searchFixed.vue";
import NoDataView from "../../components/noData/noData";

import { Swipe, SwipeItem, Lazyload, List } from "vant";
Vue.use(Swipe)
  .use(SwipeItem)
  .use(Lazyload, {
    loading: require("@/assets/img/lazy_icon1.png"),
    error: require("@/assets/img/lazy_icon1.png")
  })
  .use(List);

export default {
  name: "specialList",
  data() {
    return {
      showNull: false,
      columnId: this.$route.query.columnId ? this.$route.query.columnId : "1",
      cloumnPics: [],
      list: [],
      current: 1,
      size: 10,
      channelId: this.$store.state.login.header.channelId,
      loading: false,
      finished: false
    };
  },
  components: { goods, searchFixed, NoDataView },
  watch: {
    list(newVal, oldVal) {
      if (newVal.length == 0) {
        this.loading = false;
        this.finished = false;
        this.showNull = true;
      }
    }
  },
  methods: {
    onLoad() {
      if (this.showNull) {
        this.loading = false;
        this.finished = false;
        return false;
      }
      let _this = this;

      let params = {
        header: {},
        body: {
          columnId: this.columnId,
          channelId: this.channelId,
          size: this.size,
          current: this.current
        }
      };
      this.$api.getChannelClassiCommodityList(params).then(res => {
        if (res.code == 0) {
          _this.current++;
          if (res.data.records.length < 10) {
            _this.finished = true;
            _this.list.push.apply(_this.list, res.data.records);
          } else {
            _this.loading = false;
            _this.list.push.apply(_this.list, res.data.records);
          }
        }
      });
    },
    pic(picPositionCode) {
      //轮播图
      let params = {
        header: {},
        body: {
          picPositionCode: picPositionCode
        }
      };
      this.$api.pic(params).then(res => {
        if (res.code == 0) {
          if (picPositionCode == this.$store.state.login.header.channelId +'_6') {
            this.cloumnPics = res.data.pics;
          }
        }
        //   if(picPositionCode == 'DP698'){
        //   //  this.bannerPics = res.data.pics;
        //   }else if(picPositionCode == 'DP650'){
        //    // this.pics = res.data.pics;
        //   }else if(picPositionCode == 'DP225'){
        //   //   let picsLength = res.data.pics.length;
        //   //   let pics = res.data.pics;
        //   //   let classify = [];
        //   //   for(let i = 0; i < parseInt(picsLength/10)+1; i++){
        //   //     let classifyObj = {};
        //   //     classifyObj.classArr = pics.slice(i*10,(i+1)*10);
        //   //     classify.push(classifyObj);
        //   //   }
        //   //  this.classify = classify;
        //   }else if(picPositionCode == 'DP532'){
        //      this.cloumnPics = res.data.pics;
        //   }
        // }
      });
    },
      jumpPage(url){            //跳转
      if(url == ''){
        return false;
      }else if(url.indexOf('productDetail') !=-1){
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let query = this.getUrlProperty(url);
            var flag = JsBridge.callMethod(
            "showPage", {
                url: that.$api.baseUrl+`/ybH5/productDetail?id=${query.id}&columnCommId=${query.columnCommId}`,
                type: 1
            });
            if(!flag){
              this.$router.push({
                path: 'productDetail',
                query: this.getUrlProperty(url)
              });
            }
            return false;
        }

        this.$router.push({
          path: 'productDetail',
          query: this.getUrlProperty(url)
        })
      }else if(url.indexOf('specialList') !=-1){
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let query = this.getUrlProperty(url);
            var flag = JsBridge.callMethod(
            "showPage", {
                url: that.$api.baseUrl+`/ybH5/specialList?columnId=${query.columnId}`,
                type: 1
            });
            if(!flag){
              this.$router.push({
                path: 'specialList',
                query: this.getUrlProperty(url)
              })
            }
            return false;
        }
        this.$router.push({
          path: 'specialList',
          query: this.getUrlProperty(url)
        })
      }else{
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let flag = JsBridge.callMethod(
            "showPage", {
                url: url,
                type: 1
            });
            if(!flag){
                window.location.href = url;
            }
            return false;
        }
        window.location.href = url
      } 
    },
    jumpProductDetail(data) {
      window.event.cancelBubble = true;
      this.$router.push({
        path: "/productDetail",
        query: data
      });
    },
    tapToSearch() {
      this.$store.commit("searchFocusState", true);
      this.$router.push({
        path: "/serach"
      });
    }
  },
  mounted() {
    this.pic(this.$store.state.login.header.channelId +'_6');  //渠道商城-栏目
  },
  activated() {}
};
</script>
<style lang="less">
.special-page {
  width: 100%;
  min-height: 100vh;
  background-color: #fff;
  .product-search {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 11px 0;
  }
  .ad-box {
    width: 100%;
    box-sizing: border-box;
    padding: 20px 30px;
    background-color: #f5f7fa;
    .swiper-box {
      width: 100%;
      height: 160px;
      .special-item-banner {
        .van-swipe__track {
          height: 160px;
          .van-swipe-item {
            border-radius: 10px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
          }
        }
        .van-swipe__indicators {
          bottom: 11px;
        }
      }
    }
  }
  .van-list-special {
    width: 100%;
    .result-box {
      width: 100%;
      .product-list {
        padding: 40px 30px 0;
        box-sizing: border-box;
        width: 100%;
        .product-item {
          width: 100%;
          height: 260px;
          padding-bottom: 40px;
        }
        .product-item:nth-last-child(1) {
          padding-bottom: 0;
        }
      }
    }
  }
}
</style>

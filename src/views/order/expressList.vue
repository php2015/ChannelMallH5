<template>
  <div
    class="expressList-page"
    v-wechat-title="$route.meta.title"
    img-set="./static/img/favicon.ico"
  >
    <div class="header-box">
      <div class="laba-img">
        <img src="../../assets/img/notice_icon.png" />
      </div>
      <span>{{list.length}}个包裹已寄出</span>
    </div>
    <div class="content">
      <div
        class="express-item"
        @click.stop="tapToOther('/express',{expressNo:item.expressNo})"
        v-for="(item, index) in list"
        :key="index"
      >
        <div class="express-name">
          <span>快递公司：{{item.expressName}}</span>
          <span>物流单号：{{item.expressNo}}</span>
        </div>
        <div class="express-first-info">
          <span>{{item.expressType=='1'?'已签收':'配送中'}}</span>
          <span v-html="mobileSplicFun(item.expressDetail)"></span>
        </div>
        <div class="products-box">
          <div class="products">
            <div class="product" v-for="(item2, index2) in item.commImgUrls" :key="index2">
              <img v-lazy="item2" />
            </div>
          </div>
          <div class="t">共{{item.commNum}}件商品</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import {Lazyload } from "vant";
Vue.use(Lazyload, {
    loading: require("@/assets/img/lazy_icon1.png"),
    error: require("@/assets/img/lazy_icon1.png")
  });
export default {
  name: "expressList",
  data() {
    return {
      orderId: this.$route.query.orderId?this.$route.query.orderId:'1',
      list: []
    };
  },
  components: {},
  methods: {
    initFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          orderId: this.orderId
        }
      };
      this.$api.expressList(params).then(res => {
        if (res.code == 0) {
          _this.list = res.data;
        } else {
          _this.list = [];
        }
      });
    },
    mobileSplicFun(t) {
       var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
     // var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9})/g;
      var str = t;
      var phoneNums = str.match(regx);
      if (phoneNums) {
        for (var i = 0; i < phoneNums.length; i++) {
          var temp = phoneNums[i];
          temp = "<strong>" + temp + "</strong>";
          str = str.replace(phoneNums[i], temp);
        }
      }
      return str;
    },
    tapToOther(routerName,data) {
      this.$router.push({
        path: routerName,
        query: data
      });
    }
  },
  mounted() {
    this.initFun();
  },
  activated() {}
};
</script>
<style lang="less">
.expressList-page {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  .header-box {
    width: 100%;
    display: flex;
    align-items: center;
    height: 72px;
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #ffffff;
    font-size: 28px;
    letter-spacing: 0px;
    color: #ff6f26;
    border-radius: 12px;
    .laba-img {
      width: 28px;
      height: 28px;
      padding-left: 20px;
      padding-right: 20px;
      font-size: 0;
    }
  }
  .content {
    width: 100%;
   
    border-radius: 12px;
    .express-item {
      width: 100%;
      margin-bottom: 20px;
      box-sizing: border-box;
      padding: 0 20px 32px;
       background-color: #ffffff;
      .express-name {
        width: 100%;
        border-bottom: 1px solid #ebebeb;
        padding: 30px 0;
        & span {
          display: block;
          font-size: 28px;
          line-height: 32px;
          color: #333333;
        }
      }
      .express-first-info {
        width: 100%;
        & span:nth-child(1) {
          display: block;
          font-size: 28px;
          line-height: 66px;
          color: #ff6f26;
        }
        & span:nth-child(2) {
          display: block;
          font-size: 24px;
          line-height: 30px;
          padding-bottom: 20px;
          color: #333333;
          word-break: break-all;
          & > strong {
            font-weight: normal;
            color: #ff6f26;
          }
        }
      }
      .products-box {
        width: 100%;
        background-color: #fafafa;
        .products {
          width: 100%;
          box-sizing: border-box;
          padding: 8px 20px 0;
          display: flex;
          flex-wrap: wrap;
          .product {
            width: 100px;
            height: 100px;
            background-color: #a1a1a1;
            border-radius: 8px;
            font-size: 0;
            margin-right: 12px;
            margin-top: 12px;
          }
        }
        .t {
          width: 100%;
          box-sizing: border-box;
          padding-left: 20px;
          line-height: 63px;
          font-size: 24px;
          letter-spacing: 0px;
          color: #a8a8a8;
        }
      }
    }
  }
}
</style>

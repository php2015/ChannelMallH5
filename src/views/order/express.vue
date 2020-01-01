<template>
  <div class="express-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="header-t" v-if="expressData">
      <span>快递公司：{{expressData.expressName}}</span>
      <span>物流单号：{{expressData.expressNo}}</span>
    </div>

    <div class="detail-info" v-if="expressData">
      <div class="detail-t">
        <span>时间</span>
        <span>地点和跟踪进度</span>
      </div>
      <div class="content">
        <div class="detail-item" v-for="(item, index) in expressData.details" :key="index">
          <div class="time">
            <span>{{item.time|spplicTime}}</span>
            <span>{{item.time|spplicTime2}}</span>
          </div>
          <div class="xian-t">
            <span></span>
            <div></div>
          </div>
          <div class="detail-text" v-html="mobileSplicFun(item.context)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "express",
  data() {
    return {
      expressNo: this.$route.query.expressNo,
      expressData: null
    };
  },
  components: {},
  filters: {
    spplicTime(t) {
      let n = t;
      return String(n).split(" ")[0];
    },
    spplicTime2(t) {
      let n = t;
      return String(n).split(" ")[1];
    }
  },
  methods: {
    initFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          expressNo: this.expressNo
        }
      };
      this.$api.expressDetail(params).then(res => {
        if (res.code == 0) {
          _this.expressData = res.data;
        } else {
          _this.expressData = null;
        }
      });
    },
    mobileSplicFun(t) {
       var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
    //  var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9})/g;
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
    }
    // tapToOther(routerName) {
    //   this.$router.push({
    //     path: routerName,
    //     query: {}
    //   });
    // }
  },
  mounted() {
    this.initFun();
  }
};
</script>
<style lang="less">
.express-page {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  .header-t {
    width: 100%;
    background-color: #fff;
    font-size: 28px;
    color: #333333;
    box-sizing: border-box;
    padding: 32px 20px;
    margin-top: 20px;
    border-radius: 12px;
    & span {
      font-size: 28px;
      letter-spacing: 0px;
      line-height: 1;
      display: block;
      font-weight: 600;
      color: #333333;
    }
    & span:nth-last-child(1) {
      margin-top: 18px;
    }
  }
  .detail-info {
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 12px;
    .detail-t {
      width: 100%;
      display: flex;
      align-items: center;
      height: 63px;
      font-size: 24px;
      color: #a8a8a8;
      & span:nth-child(1) {
        width: 169px;
        text-align: center;
      }
      & span:nth-child(2) {
        padding-left: 36px;
        text-align: center;
      }
    }
  }
  .content {
    width: 100%;
    padding-bottom: 40px;
    .detail-item {
      width: 100%;
      display: flex;
      .time {
        width: 169px;
        padding-bottom: 40px;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        align-items: center;
        font-size: 24px;
        line-height: 1;
        color: #a8a8a8;
        & > span:nth-last-child(1) {
          padding-top: 8px;
        }
      }
      .xian-t {
        position: relative;
        width: 16px;
        flex-shrink: 0;
        top: 5px;
        & span:nth-child(1) {
          width: 16px;
          height: 16px;
          background-color: #ebebeb;
          border-radius: 8px;
          display: block;
          z-index: 9;
          position: absolute;
        }
        & > div {
          width: 1px;
          height: 100%;
          position: absolute;
          top: 0;
          left: 8px;
          z-index: 1;
          background-color: #ebebeb;
        }
      }
      .detail-text {
        width: 30%;
        flex-grow: 2;
        font-size: 24px;
        line-height: 30px;
        padding-left: 20px;
        color: #a8a8a8;
        padding-bottom: 40px;
        padding-right: 15px;
        word-break: break-all;
        & > strong {
          font-weight: normal;
          color: #ff6f26;
        }
      }
    }
    & > .detail-item:nth-child(1) {
      color: #333333 !important;
      .time {
        color: #333333 !important;
        & > span:nth-last-child(1) {
          color: #333333 !important;
        }
      }
      .detail-text {
        color: #333333 !important;
      }
      .xian-t {
        & span:nth-child(1) {
          background-color: #ff6f26;
        }
      }
    }
    & > .detail-item:nth-last-child(1) {
      .xian-t {
        & > div {
          display: none;
        }
      }
      .detail-text {
        padding-bottom: 0;
      }
    }
  }
}
</style>

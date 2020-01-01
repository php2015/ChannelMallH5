<template>
  <div class="message-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="message-item" v-for="i in 10" :key="i">
      <div class="time">12月02日 16:58</div>
      <div class="info-box">
        <div class="t">订单发货通知</div>
        <div class="info">通快递配送，物流单号为8297390290，请耐心等待！请耐心请耐心请耐心</div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "message",
  data() {
    return {};
  },
  components: {},
  methods: {
    tapToOther(routerName) {
      this.$router.push({
        path: routerName,
        query: {}
      });
    }
  },
  mounted() {},
  activated() {}
};
</script>
<style lang="less">
.message-page {
  width: 100%;
  .message-item {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30px;
    margin-bottom: 2px;
    .time {
      width: 100%;
      text-align: center;
      font-size: 24px;
      line-height: 84px;
      color: #a8a8a8;
    }
    .info-box {
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
      background-color: #ffffff;
      border-radius: 12px;
      .t {
        width: 100%;
        line-height: 66px;
        height: 66px;
        font-size: 28px;
        color: #333333;
        border-bottom: 1px solid #ebebeb;
      }
      .info {
        width: 100%;
        font-size: 28px;
        line-height: 36px;
        letter-spacing: 0px;
        color: #666666;
        padding: 31px 0;
      }
    }
  }
}
</style>

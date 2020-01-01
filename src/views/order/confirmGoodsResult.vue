<template>
  <div
    class="confirmGoodsResult"
    v-wechat-title="$route.meta.title"
    img-set="./static/img/favicon.ico"
  >
    <div class="payResult-header">
      <div class="payResult-pic">
        <span class="success">
          <img src="../../assets/img/order/success_green_icon.png" alt />
        </span>
        <div class="payResult-pic-tip">&nbsp;&nbsp;确认收货成功！</div>
      </div>
    </div>
    <div class="payResult-btn">
      <div class="goPay" v-if="orderId==''" @click.stop="backFun()">返回订单详情</div>
      <div class="goPay" v-if="orderId!=''" @click.stop="backFund()">返回订单详情</div>
      <div  class="goIndex" @click.stop="disDevelop()">去评价</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Toast } from "vant";

export default {
  name: "confirmGoodsResult",
  data() {
    return {
      orderId: this.$route.query.orderId ? this.$route.query.orderId : ""
    };
  },
  methods: {
    //跳转订单详情
    disDevelop(){
        Toast('功能开发中')
    },
    backFun() {
      history.go(-1);
    },
    backFund() {
      this.$router.push({
        path: '/orderDetail',
        query: {orderId:this.orderId}
      });
    }
  },
  mounted() {}
};
</script>
<style lang="less">
.confirmGoodsResult {
  background: #fff;
  .payResult-header {
    background: #fff;
    border-radius: 8px;
    .payResult-pic {
      span {
        &.success {
          display: block;
          width: 140px;
          height: 140px;
          margin: 0 auto;
          padding-top: 100px;
        }
        &.fail {
          display: block;
          width: 142px;
          height: 142px;
          margin: 0 auto;
          padding-top: 62px;
        }
      }
      .payResult-pic-tip {
        text-align: center;
        padding-bottom: 38px;
        padding-top: 32px;
        font-size: 32px;
        line-height: 1;
        color: #333333;
      }
    }
  }
  .payResult-btn {
    display: flex;
    justify-content: center;
    padding-bottom: 100px;
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 240px;
      height: 64px;
      margin: 38px 16px 0;
      border-radius: 35px;
      &.goPay {
        border: solid 1px #3ac756;
        box-sizing: border-box;
        color: #3ac756;
        font-size: 28px;
      }
      &.goIndex {
        border: solid 1px #ff6e26;
        box-sizing: border-box;
        color: #ff6e26;
        font-size: 28px;
      }
    }
  }
}
</style>
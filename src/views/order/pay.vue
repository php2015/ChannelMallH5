<template>
  <div
    class="pay"
    v-wechat-title="$route.meta.title"
    img-set="./static/img/favicon.ico"
    v-if="payData"
  >
    <div class="pay-sc">
      <div>
        <span>订单编号</span>
        <span v-text="payData.orderCode"></span>
      </div>
      <div>
        <span>订单时间</span>
        <span v-text="payData.orderTime"></span>
      </div>
      <div>
        <span>订单金额</span>
        <span class="pay-sc-price">¥{{payData.orderPrice}}</span>
      </div>
    </div>
    <div class="pay-type">
      <div class="pay-type-word">选择支付方式</div>
      <div class="pay-type-wrap">
        <div>
          <span>
            <img src="../../assets/img/wechat.png" alt />
          </span>
          <span>微信支付</span>
          <span @click="payType(1)">
            <img v-if="payTypeIcon == 1" src="../../assets/img/cart-choose.png" alt />
            <img v-if="payTypeIcon != 1" src="../../assets/img/cart-nor.png" alt />
          </span>
        </div>
        <div>
          <span>
            <img src="../../assets/img/alipay.png" alt />
          </span>
          <span>支付宝支付</span>
          <span @click="payType(0)">
            <img v-if="payTypeIcon == 0" src="../../assets/img/cart-choose.png" alt />
            <img v-if="payTypeIcon != 0" src="../../assets/img/cart-nor.png" alt />
          </span>
        </div>
        <div>
          <span>
            <img src="../../assets/img/eb.png" alt />
          </span>
          <span>智慧E保支付</span>
          <span @click="payType(13)">
            <img v-if="payTypeIcon == 13" src="../../assets/img/cart-choose.png" alt />
            <img v-if="payTypeIcon != 13" src="../../assets/img/cart-nor.png" alt />
          </span>
        </div>
      </div>
    </div>
    <div class="pay-fixed">
      <span @click="paySubmit">去支付</span>
    </div>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  name: "pay",
  data() {
    return {
      payTypeIcon: -1,
      payData: null,
      submitFlag: true,
      openId: "",
      appId: ""
    };
  },
  methods: {
    payType(index) {
      this.payTypeIcon = index;
    },
    paySubmit() {
      if (this.payTypeIcon == -1) {
        Toast("请选择支付方式");
        return false;
      }
      if (this.payTypeIcon == 1) {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.getPaywxJSDK();
        } else {
          this.getPay(this.payTypeIcon);
        }
      } else if (this.payTypeIcon == 0) {
        Toast("暂未开通该功能");
      } else if (this.payTypeIcon == 13) {
        Toast("暂未开通该功能");
      }
    },
    //获取订单信息
    getPayInfo() {
      let params = {
        header: {},
        body: {
          orderId: this.$route.query.orderId
        }
      };
      this.$api.getPayInfo(params).then(res => {
        if (res.code == 0) {
          this.payData = res.data;
        }
      });
    },
    //微信支付
    getPay(type) {
      if (!this.submitFlag) {
        return false;
      }
      this.submitFlag = false;

      Toast.loading();
      let params = {
        header: {},
        body: {
          orderId: this.$route.query.orderId,
          type: type
        }
      };
      this.$api.getPay(params).then(res => {
        this.submitFlag = true;
        Toast.clear();
        if (res.code == 0) {
          this.$router.back();
          setTimeout(() => {
            window.location.href = res.data.payUrl;
          }, 50);
        } else {
          Toast(res.message);
        }
      });
    },
    getPaywxJSDK() {
      if (!this.submitFlag) {
        return false;
      }
      this.submitFlag = false;
      let params = {
        header: {},
        body: {
          orderId: this.$route.query.orderId,
          openId: this.$store.state.login.openId //'olhwswTLR4rlrWnZz2Rr_NNXB1kA',//
        }
      };
      this.$api.getWxJsdkPay(params).then(res => {
        this.submitFlag = true;
        if (res.code == 0) {
          this.wxJSDkPayFun(
            this.$store.state.login.appId,
            res.data.timeStamp,
            res.data.nonce_str,
            res.data.prepay_id,
            res.data.paySign,
            res.data.signType
          );
        }else{
         Toast(res.message);   
        }
      });
    },
    wxJSDkPayFun(appid, timeStamp, nonceStr, packages, paySign, signType) {
      let _this=this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: appid,
          timeStamp: String(timeStamp),
          nonceStr: nonceStr,
          package: "prepay_id=" + packages,
          signType: signType,
          paySign: paySign
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            Toast("支付成功");
            setTimeout(() => {
              _this.$router.replace({
                path: "/payResult",
                query: {
                  orderId: _this.$route.query.orderId
                }
              });
            }, 500);
          }
        }
      );
    },
    getWXRequestUrlFun() {
      let params = {
        header: {},
        body: {
          redirectUrl: window.location.href,
          state: ""
        }
      };
      this.$api.getWXRequestUrl(params).then(res => {
        if (res.code == 0) {
          setTimeout(() => {
            // window.location.href = res.data.resultUrl.split("#")[0]+'&connect_redirect=1'+'#wechat_redirect';
            window.location.replace(
              res.data.resultUrl.split("#")[0] +
                "&connect_redirect=1" +
                "#wechat_redirect"
            );
            // window.location.href = res.data.payUrl;
          }, 50);
        }
      });
    },
    getOpenIdAjax() {
      let params = {
        header: {},
        body: {
          code: this.$route.query.code
        }
      };
      this.$api.getSnsapiOpenId(params).then(res => {
        if (res.code == 0) {
          this.$store.commit("openId", res.data.openId);
          this.$store.commit("appId", res.data.appId);
        }
      });
    }
  },
  mounted() {
    //this.getWXRequestUrlFun();
    if (
      navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      if (
        this.$store.state.login.openId &&
        this.$store.state.login.openId != ""
      ) {
        this.getPayInfo();
      } else {
        if (this.$route.query.code) {
          console.log(this.$route.query.code);
          this.getOpenIdAjax();
          this.getPayInfo();
        } else {
          this.getWXRequestUrlFun();
        }
      }
    } else {
      this.getPayInfo();
    }
  }
};
</script>
<style lang="less">
.pay {
  .pay-sc {
    background: #fff;
    border-radius: 8px;
    margin: 20px 30px;
    padding: 14px 24px;
    span {
      line-height: 56px;
      &:first-child {
        color: #666666;
      }
      &:last-child {
        color: #aeafb2;
        margin-left: 31px;
      }
      &.pay-sc-price {
        color: #ff6e26;
      }
    }
  }
  .pay-type {
    background: #fff;
    border-radius: 8px;
    margin: 20px 30px;
    padding: 0 24px;
    .pay-type-word {
      line-height: 88px;
    }
    .pay-type-wrap {
      div {
        display: flex;
        align-items: center;
        padding: 28px 0;
        border-top: 2px solid #e6e6e6;
        span {
          display: inline-block;
          &:first-child {
            width: 67px;
            height: 67px;
            flex-shrink: 0;
          }
          &:nth-child(2) {
            font-size: 28px;
            color: #333;
            font-weight: 600;
            flex-grow: 2;
            margin-left: 18px;
          }
          &:last-child {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
          }
        }
      }
    }
  }
  .pay-fixed {
    position: fixed;
    bottom: 30px;
    left: 0;
    z-index: 1;
    span {
      display: inline-block;
      width: 690px;
      height: 72px;
      background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
        linear-gradient(#f89283, #f89283);
      background-blend-mode: normal, normal;
      border-radius: 36px;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      margin-left: 30px;
    }
  }
}
</style>
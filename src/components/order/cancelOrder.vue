<template>
  <div class="cancel-liyou" v-show="visable">
    <div class="cancel-liyou-position">
      <div class="item-box-b">
        <div class="item-box">
          <span>请选择取消订单的原因</span>
        </div>
      </div>
      <div class="item-box-b">
        <div class="item-box" @click.stop="reasonNum=1">
          <span>地址/电话等信息填写错误</span>
          <div  @click.stop="reasonNum=1">
            <img :src="reasonNum==1?yesUrl:noUrl" alt />
          </div>
        </div>
      </div>
      <div class="item-box-b">
        <div class="item-box" @click.stop="reasonNum=2">
          <span>活动/优惠未生效</span>
          <div  @click.stop="reasonNum=2">
            <img :src="reasonNum==2?yesUrl:noUrl" alt />
          </div>
        </div>
      </div>
      <div class="item-box-b">
        <div class="item-box" @click.stop="reasonNum=3">
          <span>商品降价了</span>
          <div  @click.stop="reasonNum=3">
            <img :src="reasonNum==3?yesUrl:noUrl" alt />
          </div>
        </div>
      </div>
      <div class="item-box-b">
        <div class="item-box" @click.stop="reasonNum=4">
          <span>拍错/多拍/不想要</span>
          <div  @click.stop="reasonNum=4">
            <img :src="reasonNum==4?yesUrl:noUrl" alt />
          </div>
        </div>
      </div>
      <div class="submit-box">
        <div class="bt-box" @click.stop="visable=false">
          <span>暂不取消</span>
        </div>
        <div class="btr-box" @click.stop="submit()">
          <span>确认取消</span>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import Vue from "vue";

import { Toast, Dialog } from "vant";
Vue.use(Toast);
export default {
  name: "cancelOrder",
  props: {
    cancelOrderData: {
      type: Object
    }
  },
  data() {
    return {
      visable: false,
      reasonNum: 0,
      reasonList: [
        "请选择取消订单的原因",
        "地址/电话等信息填写错误",
        "活动/优惠未生效",
        "商品降价了",
        "拍错/多拍/不想要"
      ],
      yesUrl: require("@/assets/img/cart-choose.png"),
      noUrl: require("@/assets/img/cart-nor.png")
    };
  },
  mounted() {},
  methods: {
    isShow() {
      this.reasonNum = 0;
      this.visable = true;
    },
    submit() {
      if (this.reasonNum <= 0) {
        Toast("请选择取消订单的原因");
        return false;
      }
      let _this = this;
      let cancelReason = this.reasonList[this.reasonNum];

      let params = {
        header: {},
        body: {
          orderId: this.cancelOrderData.id,
          cancelReason: cancelReason
        }
      };
      this.$api.cancelOrder(params).then(res => {
        if (res.code == 0) {
          _this.visable = false;
          if (_this.cancelOrderData.orderStatus == "1") {
            Dialog({title:'订单取消成功！', message: "订单金额将在1到7个工作日原路退回", width: "70%" }); 
            this.$emit("getCancelResult", true);
          } else {
            Toast("订单已取消！");
            this.$emit("getCancelResult", true);
            setTimeout(() => {
              Toast.clear();
            }, 1000);
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.cancel-liyou {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 10;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.5);
  .cancel-liyou-position {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 11;
    width: 100%;
    background-color: #fff;
    border-radius: 15px 15px 0 0;
    .item-box-b {
      height: 97px;
      box-sizing: border-box;
      padding-left: 30px;
      width: 100%;
      .item-box {
        background: #fff;
        height: 97px;
        box-sizing: border-box;
        padding-right: 30px;
        width: 100%;
        display: flex;
        align-items: center;
        border-top: 1px solid #ebebeb;
        & > span {
          flex-grow: 2;
        }
        & > div {
          width: 44px;
          height: 44px;
          font-size: 0;
        }
      }
    }
    & .item-box-b:nth-child(1) {
      .item-box {
        border: none;
      }
      span {
        font-size: 28px;
        font-weight: 600;
        letter-spacing: 0px;
        color: #333333;
      }
    }
    .submit-box {
      width: 100%;
      height: 112px;
      background-color: #ffffff;
      box-shadow: 0px -1px 1px 0px rgba(102, 102, 102, 0.05);
      display: flex;
      align-items: center;
      justify-content: space-around;
      .bt-box {
        width: 330px;
        height: 80px;

        border: 1px solid #ff8441;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 40px;
        span {
          font-size: 28px;
          line-height: 48px;
          letter-spacing: 0px;
          color: #ff6e26;
        }
      }
      .btr-box {
        width: 330px;
        height: 80px;
        background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
          linear-gradient(#f89283, #f89283);
        background-blend-mode: normal, normal;
        border-radius: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 28px;
          line-height: 48px;
          letter-spacing: 0px;
          color: #ffffff;
        }
      }
    }
  }
}
</style>
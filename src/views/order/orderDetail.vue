<template>
  <div class="orderDetail-page" v-wechat-title="$route.meta.title">
    <!-- 状态栏 -->
    <div class="order-type" v-if="orderInfo!=null" :style="{backgroundImage:'url('+topbg+')'}">
      <div class="logo">
        <img :src="getOrderHeader(orderInfo.appStatus).headerLogo" alt />
      </div>
      <div class="text-t" v-text="getOrderHeader(orderInfo.appStatus).name"></div>
    </div>
    <!-- 物流 -->
    <div
      class="logistics-info"
      v-if="orderInfo!=null&&orderInfo.receivingSiteSchedule&&orderInfo.receivingSiteSchedule.length>0"
      @click.stop="tapToOtherExp()"
    >
      <div class="orderDetail-address-icon">
        <img src="../../assets/img/order/logistics.png" alt />
      </div>
      <div class="orderDetail-address-center">
        <div>
          <span>物流信息</span>
        </div>
        <div>
          <span v-html="mobileSplicFun(orderInfo.receivingSiteSchedule)"></span>
        </div>
      </div>
      <div class="confirmOrder-address-more">
        <img src="../../assets/img/more.png" alt />
      </div>
    </div>
    <!-- 地址 -->
    <div class="orderDetail-address" v-if="orderInfo!=null">
      <div class="orderDetail-address-icon">
        <img src="../../assets/img/confirm-address.png" alt />
      </div>
      <div class="orderDetail-address-center">
        <div>
          <span>{{orderInfo.receivingSiteName}}</span>
          <span>{{orderInfo.receivingSitePhone}}</span>
        </div>
        <div>
          <span v-show="false">
            <img src="../../assets/img/mo.png" alt />
          </span>
          <span>{{orderInfo.receivingSiteAddress}}</span>
        </div>
      </div>
      <div class="confirmOrder-address-more">
        <img v-show="false" src="../../assets/img/more.png" alt />
      </div>
    </div>
    <!-- 用药人信息 -->
    <div
      class="orderDetail-useDrug"
      v-if="orderInfo!=null&&orderInfo.haveRx&&orderInfo.haveRx=='1'&&orderInfo.patientUserName"
    >
      <div class="orderDetail-useDrug-icon">
        <img src="../../assets/img/useDrug.png" alt />
      </div>
      <div class="orderDetail-useDrug-center">
        <div>
          <span>{{orderInfo.patientUserName}}</span>
          <span>{{orderInfo.patientAge}}岁</span>
          <span>{{orderInfo.patientSex}}</span>
          <span
            class="kaift"
            v-show="!(inquiryOrderData.orderState=='200'||inquiryOrderData.orderState=='300')&&inquiryOrderData.rxAuditState!='1'"
          >医生正在开处方…</span>
        </div>
        <div>
          <span>图文问诊</span>
          <span>赠送问诊费</span>
          <span
            class="more-t"
            v-show="orderInfo.appStatus!='0'||orderInfo.appStatus!='4'"
            @click.stop="tapToOther('/chat',{orderId:orderInfo.officeVisitOrderId})"
          >查看问诊</span>
          <div
            class="confirmOrder-useDrug-more"
            v-show="orderInfo.appStatus!='0'||orderInfo.appStatus!='4'"
          >
            <img src="../../assets/img/more.png" alt />
          </div>
        </div>
      </div>
    </div>
    <!-- 商品 -->

    <div class="product-list" v-if="orderInfo!=null">
      <div class="t">商品清单</div>
      <div class="product-item" v-for="(item, index) in orderInfo.commList" :key="index">
        <div class="img-box">
          <img v-lazy="item.url?item.url.split('；')[0]:''" />
        </div>
        <div class="info">
          <div class="name">{{item.name}}</div>
          <div class="price">
            <span>¥{{item.price}}</span>
            <span>x{{item.num}}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 留言 -->
    <div class="other-message" v-if="orderInfo!=null">
      <div class="t">留言</div>
      <div class="info">{{orderInfo.message?orderInfo.message:'无'}}</div>
    </div>
    <!-- 价格 -->
    <div class="price-box" v-if="orderInfo!=null">
      <div class="real-pay">
        <span>实付金额</span>
        <span>¥{{orderInfo.sumPrice}}</span>
      </div>
      <div class="item-price fist">
        <span>商品总价</span>
        <span>¥{{orderInfo.totalPrice}}</span>
      </div>
      <div class="item-price" v-if="orderInfo.haveRx=='1'">
        <span>问诊费</span>
        <span>¥{{orderInfo.inquiryPrice?orderInfo.inquiryPrice:'0'}}</span>
      </div>
      <div class="item-price">
        <span>运费</span>
        <span>¥{{orderInfo.freight}}</span>
      </div>
    </div>
    <!-- 时间 -->
    <div class="order-time" v-if="orderInfo!=null">
      <div class="item">
        <span>订单编号</span>
        <div>
          <span>{{orderInfo.code}}</span>
          <div id="copyOrder" class="copy-img" :data-clipboard-text="orderInfo.code">
            <img src="../../assets/img/copy_order_icon.png" />
          </div>
        </div>
      </div>
      <div class="item">
        <span>下单时间</span>
        <div>{{orderInfo.createTime}}</div>
      </div>
      <div class="item" v-if="orderInfo.payTime">
        <span>支付方式</span>
        <div>{{orderInfo.payType=='1'?'微信':(orderInfo.payType=='13'?'智慧E保':'支付宝')}}</div>
      </div>
      <div class="item" v-if="orderInfo.payTime">
        <span>付款时间</span>
        <div>{{orderInfo.payTime}}</div>
      </div>
    </div>
    <!-- 操作 -->
    <div class="fix-button" v-if="orderInfo!=null&&orderInfo.appStatus!='5'">
      <div class="left-b">
        <span v-if="!overState">{{daojisihStr}}</span>
      </div>
      <div class="right-b">
        <!-- 订单状态0_待付款,1_待发货,2_已发货,3_已完成,4_已取消,5_售后 -->
        <div
          class="item-bt colorY"
          v-if="orderInfo.appStatus=='2'"
          @click.stop="confirmGoodsFun(orderInfo.id)"
        >
          <span>确认收货</span>
        </div>
        <div class="item-bt colorY" v-if="orderInfo.appStatus=='0'" @click.stop="tapToOther('/pay',{orderId:orderInfo.id})">
          <span>去支付</span>
        </div>
        <div
          @click.stop="showCance()"
          class="item-bt"
          v-if="orderInfo.appStatus=='0'||orderInfo.appStatus=='1'"
        >
          <span>取消订单</span>
        </div>
        <div
          class="item-bt colorY"
          v-if="orderInfo.appStatus=='3'&&orderInfo.haveRx!='1'"
          @click.stop="rebuyCheckFun(1,orderInfo.id,orderInfo.commList)"
        >
          <span>再次购买</span>
        </div>
        <!-- <div class="item-bt colorG" v-if="orderInfo.orderStatus=='3'">
          <span>去评价</span>
        </div> -->
        <div
          class="item-bt"
          v-if="orderInfo.appStatus=='3'&&orderInfo.isApplyRefund!=1"
          @click.stop="jumpSaleAfterDetail($route.query.orderId)"
        >
          <span>申请售后</span>
        </div>
        <div
          class="item-bt colorY"
          v-if="orderInfo.appStatus=='4'&&orderInfo.haveRx!='1'"
          @click.stop="rebuyCheckFun(2,orderInfo.id,orderInfo.commList)"
        >
          <span>重新购买</span>
        </div>
      </div>
    </div>
    <div class="comfirmOrder-div"></div>
    <cancel-order
      v-on:getCancelResult="getCancelResult"
      ref="cancelOrderCD"
      :cancelOrderData="cancelOrderData"
    ></cancel-order>
    <rebuy v-on:getrebuyResult="getrebuyResult" ref="rebuyOrderCO" :rebuyData="rebuyData"></rebuy>
  </div>
</template>
<script>
import Vue from "vue";
import Clipboard from "clipboard";
import cancelOrder from "../../components/order/cancelOrder.vue";
import rebuy from "../../components/order/rebuy.vue";

import { Toast, Lazyload, Dialog } from "vant";
Vue.use(Toast).use(Lazyload, {
  loading: require("@/assets/img/lazy_icon1.png"),
  error: require("@/assets/img/lazy_icon1.png")
});
export default {
  name: "orderDetail",
  data() {
    return {
      topbg:require("@/assets/img/order/topbg.png"),
      message: "",
      orderId: this.$route.query.orderId ? this.$route.query.orderId : "1",
      orderInfo: null,
      daojisihStr: "",
      leftTime: 0,
      overState: false,
      timeO: null,
      cancelOrderData: null,
      rebuyData: null,
      inquiryOrderData: null,
      expressNo: "",
      expressData: null
    };
  },
  components: { cancelOrder, rebuy },
  methods: {
    initFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          id: this.orderId
        }
      };
      this.$api.getOrderDetail(params).then(res => {
        if (res.code == 0) {
          _this.orderInfo = res.data;
          if (res.data.haveRx == 1 && res.data.officeVisitOrderId) {
            _this.getInquiryOrderDetailsFun(res.data.officeVisitOrderId);
          }
          //需求变更，该功能抛弃
          // if (res.data.receivingSiteSchedule.length>0) {
          //   _this.expressNumFun();
          // }
          if (res.data.appStatus == "0") {
            _this.getPayOverTime(res.data.createTimestamp, res.data.payTimeout);
          }
          _this.copyFun();
        } else {
          _this.orderInfo = null;
        }
      });
    },
    expressNumFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          orderId: this.orderId
        }
      };
      this.$api.expressNum(params).then(res => {
        if (res.code == 0) {
          if (res.data.num=='1') {
            _this.expressNo=res.data.expressNo;
             _this.expressData=res.data;
          }
        } else {
        }
      });
    },

    getInquiryOrderDetailsFun(id) {
      let _this = this;
      let params = {
        header: {},
        body: {
          orderId: id
        }
      };
      this.$api.getInquiryOrderDetails(params).then(res => {
        if (res.code == 0) {
          _this.inquiryOrderData = res.data;
        } else {
          _this.inquiryOrderData = null;
        }
      });
    },
    confirmGoodsFun(id) {
      window.event.cancelBubble = true;
      let _this = this;
      Dialog.confirm({
        message: "是否确认收货？",
        width: "70%",
        confirmButtonColor: "#ff6e26"
      })
        .then(() => {
          // on confirm
          _this.confirmGoodsFunA(id);
        })
        .catch(() => {
          // on cancel
        });
    },
    confirmGoodsFunA(id) {
      let _this = this;
      let params = {
        header: {},
        body: {
          id: id
        }
      };
      this.$api.confirmGoods(params).then(res => {
        if (res.code == 0) {
          _this.orderInfo.appStatus = "3";
          _this.tapToOther("/confirmGoodsResult", {});
        } else {
          //未知错误
        }
      });
    },
    getPayOverTime(timestamp, payTimeout) {
      let _this = this;
      let overTime = payTimeout; //设置支付有效时间 毫秒数
      //获取当前时间
      let date = new Date();
      let now = date.getTime();
      //设置截止时间

      let end = timestamp + overTime; //超时的时间戳
      //时间差
      this.leftTime = Math.floor((end - now) / 1000);
      if (this.leftTime > 0) {
        _this.timeO = setInterval(function() {
          _this.leftTime--;
          let d, h, m, s;
          if (_this.leftTime >= 0) {
            d = Math.floor(_this.leftTime / 60 / 60 / 24);
            h = Math.floor((_this.leftTime / 60 / 60) % 24);
            m = Math.floor((_this.leftTime / 60) % 60);
            s = Math.floor(_this.leftTime % 60);
          }
          //将倒计时赋值到div中
          let strT = "支付剩余：";
          if (h > 0) {
            strT = strT + h + "时";
          }
          if (m >= 0) {
            strT = strT + (m <= 9 ? "0" + m : m) + "分";
          }
          if (s >= 0) {
            strT = strT + (s <= 9 ? "0" + s : s) + "秒";
          }
          if (h <= 0 && m <= 0 && s <= 0) {
            _this.overState = true;
            clearInterval(_this.timeO);
            _this.initFun()
          } else {
            _this.daojisihStr = strT;
          }
        }, 1000);
      } else {
        _this.overState = true;
      }
    },
    rebuyCheckFun(type, id, list) {
      let _this = this;
      let listN = list;
      let params = {
        header: {},
        body: {
          orderId: id
        }
      };
      this.$api.rebuyCheck(params).then(res => {
        if (res.code == 0) {
          let defList = res.data.stockoutList;
          let comList = [];
          for (let i in listN) {
            if (defList.length > 0) {
              for (let j in defList) {
                if (
                  listN[i].columnCommId != defList[j].columnCommId &&
                  listN[i].channelCommId != defList[j].channelCommId
                ) {
                  let comListArr = {
                    channelCommId: listN[i].channelCommId,
                    columnCommId: listN[i].columnCommId,
                    qty: listN[i].num
                  };
                  comList.push(comListArr);
                }
              }
            } else {
              let comListArr = {
                channelCommId: listN[i].channelCommId,
                columnCommId: listN[i].columnCommId,
                qty: listN[i].num
              };
              comList.push(comListArr);
            }
          }
          _this.$store.commit("comList", comList);
          if (defList.length > 0) {
            _this.showRebuy(res.data);
          } else {
            _this.goComfirmOrder();
          }
        } else {
          //未知错误
        }
      });
    },
    showRebuy(data) {
      this.rebuyData = data;
      this.$refs.rebuyOrderCO.isShow();
    },
    getrebuyResult() {
      this.goComfirmOrder();
    },
    goComfirmOrder() {
      this.$router.push({
        path: "/confirmOrder"
      });
    },
    copyFun() {
      var clipboard = new Clipboard("#copyOrder");
      clipboard.on("success", e => {
        Toast("复制成功");
        // 释放内存
        clipboard.destroy();
      });
      clipboard.on("error", e => {
        // 不支持复制
        Toast("复制失败，请手动复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    getOrderHeader(state) {
      let obj = {};
      switch (state) {
        case "":
          //全部订单
          obj = {};
          break;
        case "0":
          obj = {
            headerLogo: require("@/assets/img/order/order0.png"),
            name: "待付款"
          };
          //代付款
          break;
        case "1":
          obj = {
            headerLogo: require("@/assets/img/order/order1.png"),
            name: "待发货"
          };
          //
          break;
        case "2":
          obj = {
            headerLogo: require("@/assets/img/order/order2.png"),
            name: "待收货"
          };
          //待收货
          break;
        case "3":
          obj = {
            headerLogo: require("@/assets/img/order/order3.png"),
            name: "已完成"
          };
          //已完成
          break;
        case "4":
          obj = {
            headerLogo: require("@/assets/img/order/order4.png"),
            name: "已取消"
          };
          //已取消
          break;
      }
      return obj;
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
    showCance() {
      this.cancelOrderData = this.orderInfo;
      this.$refs.cancelOrderCD.isShow();
    },
    getCancelResult(i) {
      if (i) {
        this.orderInfo.appStatus = "4";
        this.overState = true;
        this.daojisihStr = '';
        clearInterval(this.timeO);
      }
    },
    tapToOtherExp() {
      //新需求变化，都跳转到物流列表页
      // if (this.expressData&&this.expressData.num=='1') {
      //   this.$router.push({
      //     path: "/express",
      //     query: { expressNo: this.expressNo }
      //   });
      // } else {
        this.$router.push({
          path: "/expressList",
          query: { orderId: this.orderId }
        });
     // }
    },
    tapToOther(routerName, data) {
      if(routerName=='/pay'&&this.overState&&this.leftTime<=0){//待支付订单，订单支付时间已超时
        Toast("该订单已超时");
       // Dialog({title:'该订单已超时！', message: "请重新下单购买", width: "70%" });
       return false;
      }
      this.$router.push({
        path: routerName,
        query: data
      });
    },
    //跳转到售后
    jumpSaleAfterDetail(orderId) {
      this.$router.push({
        path: "saleAfter",
        query: {
          orderId: orderId
        }
      });
    }
  },
  mounted() {
    this.initFun();
    clearInterval(this.timeO);
  }
};
</script>  
<style lang="less">
.orderDetail-page {
  width: 100%;
  .comfirmOrder-div {
    height: 132px;
  }
  .order-type {
    width: 100%;
    height: 110px;
    padding-bottom: 40px;
    background-position: 0 0;
    background-size: 100% auto;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 44px;
      height: 44px;
      font-size: 0;
      padding-right: 11px;
    }
    .text-t {
      font-size: 36px;
      line-height: 70px;
      color: #ffffff;
    }
  }
  .logistics-info {
    display: flex;
    align-items: center;
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 30px 0;
    margin-top: -40px;
    .orderDetail-address-icon {
      width: 31px;
      height: 32px;
      margin: 0 23px 0 20px;
      flex-shrink: 0;
    }
    .orderDetail-address-center-edit {
      display: flex;
      align-items: center;
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
    }
    .orderDetail-address-center {
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
      div {
        &:first-child {
          span {
            &:first-child {
              color: #333;
              font-size: 28px;
              font-weight: 600;
            }
          }
        }
        &:last-child {
          position: relative;
          span {
            margin-top: 15px;

            &:last-child {
              display: inline-block;
              color: #333;
              font-size: 28px;
              line-height: 45px;
              word-break: break-all;
               & > strong {
                font-weight: normal;
                color: #ff6f26;
              }
            }
          }
        }
      }
    }
    .confirmOrder-address-more {
      flex-shrink: 0;
      padding-right: 20px;
      width: 14px;
      height: 26px;
    }
  }
  .orderDetail-address {
    display: flex;
    align-items: center;
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 30px 0;
    .orderDetail-address-icon {
      width: 31px;
      height: 32px;
      margin: 0 23px 0 20px;
      flex-shrink: 0;
    }
    .orderDetail-address-center-edit {
      display: flex;
      align-items: center;
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
    }
    .orderDetail-address-center {
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
      div {
        &:first-child {
          span {
            &:first-child {
              color: #333;
              font-weight: 600;
              font-size: 32px;
            }
            &:last-child {
              color: #333;
              font-weight: 600;
              font-size: 28px;
            }
          }
        }
        &:last-child {
          position: relative;
          span {
            margin-top: 15px;
            &:first-child {
              display: inline-block;
              width: 72px;
              height: 41px;
              position: absolute;
              top: 2px;
              left: 0;
            }
            &:last-child {
              display: inline-block;
              color: #666666;
              font-size: 28px;
              line-height: 45px;
            }
          }
        }
      }
    }
    .confirmOrder-address-more {
      flex-shrink: 0;
      padding-right: 20px;
      width: 14px;
      height: 26px;
    }
  }
  .orderDetail-useDrug {
    display: flex;
    align-items: center;
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 30px 0;
    .orderDetail-useDrug-icon {
      width: 31px;
      height: 32px;
      margin: 0 23px 0 20px;
      flex-shrink: 0;
    }
    .orderDetail-useDrug-center-edit {
      display: flex;
      align-items: center;
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
    }
    .orderDetail-useDrug-center {
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
      div {
        &:first-child {
          display: flex;
          span {
            color: #333;
            display: inline-block;
            font-weight: 600;
            font-size: 28px;
            padding-right: 20px;
          }
          .kaift {
            flex-grow: 2;
            text-align: right;
            font-size: 24px;
            color: #ff6e26;
          }
        }
        &:last-child {
          display: flex;
          align-items: center;
          span {
            margin-top: 13px;
            display: inline-block;
            color: #999;
            font-size: 28px;
            line-height: 45px;
            padding-right: 20px;
          }
          .more-t {
            flex-grow: 2;
            padding-right: 0;
            text-align: right;
          }
          .confirmOrder-useDrug-more {
            flex-shrink: 0;
            padding-left: 10px;
            padding-top: 13px;
            padding-right: 20px;
            width: 14px;
            height: 26px;
          }
        }
      }
    }
  }
  & > .logistics-info:nth-child(2),
  & > .orderDetail-address:nth-child(2),
  & > .orderDetail-useDrug:nth-child(2) {
    margin-top: -40px;
  }
  .product-list {
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 32px 0;
    .t {
      font-size: 28px;
      line-height: 1;
      padding: 0 24px;
      color: #333333;
    }
    .product-item {
      width: 100%;
      padding: 0 24px;
      box-sizing: border-box;
      padding-top: 32px;
      display: flex;
      align-items: center;
      .img-box {
        width: 160px;
        flex-shrink: 0;
        height: 160px;
        border-radius: 12px;
        overflow: hidden;
        font-size: 0;
      }
      .info {
        flex-grow: 2;
        padding-left: 20px;
        display: flex;
        min-height: 160px;
        flex-direction: column;
        justify-content: space-between;
        .name {
          width: 100%;
          height: 78px;
          line-height: 40px;
          font-size: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          color: #333333;
        }
        .price {
          width: 100%;
          line-height: 33px;
          display: flex;
          justify-content: space-between;
          color: #333333;
          font-size: 24px;
          & span:nth-child(2) {
            color: #a8a8a8;
          }
        }
      }
    }
  }
  .other-message {
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    .t {
      font-size: 28px;
      line-height: 29px;
      color: #333333;
      padding: 30px 24px 0;
    }
    .info {
      font-size: 24px;
      line-height: 34px;
      color: #666666;
      margin-top: 6px;
      padding: 0 24px 26px;
    }
  }
  .price-box {
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 8px 24px 16px;
    .real-pay {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      border-bottom: solid 1px #ebebeb;
      & span:nth-child(1) {
        font-size: 28px;
        color: #333;
      }
      & span:nth-child(1) {
        font-size: 30px;
        color: #ff6e26;
      }
    }
    .item-price {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 58px;
      & span:nth-child(1) {
        font-size: 28px;
        color: #666;
      }
      & span:nth-child(1) {
        font-size: 30px;
        color: #666;
      }
    }
    .fist {
      padding-top: 8px;
    }
  }
  .order-time {
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    box-sizing: border-box;
    padding: 16px 24px;
    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 58px;
      font-size: 28px;
      color: #666666;
      white-space: nowrap;
      overflow: hidden;
      & > div {
        display: flex;
        align-items: center;
        overflow: hidden;
        &>span{
              overflow: hidden;
    text-overflow: ellipsis;
        }
        & .copy-img {
          padding: 0 15px 0 11px;
          flex-shrink: 0;
          flex-grow: 0;
          width: 24px;
          height: 24px;
          font-size: 0;
        }
      }
    }
  }
  
}
.fix-button {
    height: 112px;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 31px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    .left-b span {
      font-size: 24px;
      line-height: 38px;
      letter-spacing: 0px;
      color: #ff6e26;
    }
    .right-b {
      display: flex;
      flex-direction: row-reverse;
      & .item-bt {
        margin-left: 25px;
        width: 180px;
        height: 72px;
        border-radius: 36px;
        box-sizing: border-box;
        font-size: 28px;
        color: #333;
        background-color: #fff;
        border: 1px solid #aaaaaa;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      & .colorY {
        color: #fff;
        border: none;
        background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
          linear-gradient(#f89283, #f89283);
        background-blend-mode: normal, normal;
      }
      & .colorG {
        color: #fff;
        border: none;
        background-image: linear-gradient(
            90deg,
            #73e539 0%,
            #57d648 50%,
            #3ac756 100%
          ),
          linear-gradient(#cfcfcf, #cfcfcf);
        background-blend-mode: normal, normal;
      }
    }
  }
</style>
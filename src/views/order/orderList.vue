<template>
  <div class="orderList-page" v-wechat-title="pageTitle" img-set="./static/img/favicon.ico">
    <div class="header-box" v-if="$route.query.orderType!=6&&orderType!=null">
      <div
        class="swiper_item"
        :class="{acitive:orderType==''&orderType!='0'}"
        @click.stop="changeOrderType('');orderType='';firstIn=false"
      >
        <span>
          <span>全部</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
      <div class="swiper_item" :class="{acitive:orderType=='0'}" @click.stop="changeOrderType('0')">
        <span>
          <span>待付款</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
      <div
        class="swiper_item"
        :class="{acitive:orderType=='1'}"
        @click.stop="changeOrderType('1');orderType='1';firstIn=false"
      >
        <span>
          <span>待发货</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
      <div
        class="swiper_item"
        :class="{acitive:orderType=='2'}"
        @click.stop="changeOrderType('5');orderType='2';firstIn=false"
      >
        <span>
          <span>待收货</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
      <div
        class="swiper_item"
        :class="{acitive:orderType=='3'}"
        @click.stop="changeOrderType('3');orderType='3';firstIn=false"
      >
        <span>
          <span>已完成</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
      <div
        class="swiper_item"
        :class="{acitive:orderType=='4'}"
        @click.stop="orderType='4';firstIn=false"
      >
        <span>
          <span>已取消</span>
          <span class="greenL">
            <span></span>
          </span>
        </span>
      </div>
    </div>
    <!-- 正文 -->
    <div class="content">
      <div class="result-empty" v-show="showNull">
        <no-data-view scene="noOrder"></no-data-view>
      </div>
      <div v-show="!showNull">
        <van-list
          class="van-list-special"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getData"
        >
          <div
            class="item-box"
            v-for="(item, index) in list"
            :key="index"
            @click.stop="tapToOther('/orderDetail',{orderId:item.id})"
          >
            <div class="order-num">
              <div class="t">订单号：</div>
              <div class="num">
                <span>{{item.code}}</span>
                <div
                  class="copy-box"
                  @click.stop="copyFun($event)"
                  :data-clipboard-text="item.code"
                >
                  <img src="../../assets/img/copy_order_icon.png" />
                </div>
              </div>
              <div
                class="state"
                :style="{ color:item.orderStatus=='3'||item.orderStatus=='4'?'#a8a8a8':'#ff6e26'}"
              >{{item.orderStatus|getStateText}}</div>
            </div>
            <div class="order-products">
              <div class="item-product" v-for="(item2, index2) in item.orderCommList" :key="index2">
                <div class="img-box">
                  <img v-lazy="item2.url?item2.url.split('；')[0]:''" />
                </div>
                <div class="info">
                  <div class="name">{{item2.name}}</div>
                  <div class="price">
                    <span>￥{{item2.price}}</span>
                    <span>x{{item2.num}}</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- ¥ -->
            <div class="prices">
              共
              <span>{{item.totalQty}}</span>件商品，总计￥
              <span>{{item.totalPrice}}</span>
            </div>
            <div class="operations">
              <!-- 订单状态0_待付款,1_待发货,2_已发货,3_已完成,4_已取消,5_售后 -->
              <div
                class="item-button colorY"
                v-if="item.orderStatus=='2'"
                @click.stop="confirmGoodsFun(item.id,index)"
              >
                <span>确认收货</span>
              </div>
              <div
                class="item-button colorY"
                @click.stop="tapToOther('/pay',{orderId:item.id})"
                v-if="item.orderStatus=='0'"
              >
                <span>去支付</span>
              </div>
              <div
                class="item-button"
                @click.stop="showCance(item)"
                v-if="item.orderStatus=='0'||item.orderStatus=='1'"
              >
                <span>取消订单</span>
              </div>
              <div
                class="item-button colorY"
                v-if="item.orderStatus=='3'&&item.haveRx!=1"
                @click.stop="rebuyCheckFun(1,item.id,item.orderCommList)"
              >
                <span>再次购买</span>
              </div>
              <!-- <div
                class="item-button colorG"
                v-if="item.orderStatus=='3'"
                @click.stop="tapToOther('/evaluate',{orderId:item.id})"
              >
                <span>去评价</span>
              </div>-->
              <div
                class="item-button"
                @click.stop="tapToOther('/saleAfter',{orderId:item.id})"
                v-if="item.orderStatus=='3'&&item.isApplyRefund!=1"
              >
                <span>申请售后</span>
              </div>
              <div
                class="item-button colorY"
                v-if="item.orderStatus=='4'&item.haveRx!=1"
                @click.stop="rebuyCheckFun(2,item.id,item.orderCommList)"
              >
                <span>重新购买</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>
    </div>

    <cancel-order
      v-on:getCancelResult="getCancelResult"
      ref="cancelOrderC"
      :cancelOrderData="cancelOrderData"
    ></cancel-order>
    <rebuy v-on:getrebuyResult="getrebuyResult" ref="rebuyOrderC" :rebuyData="rebuyData"></rebuy>
  </div>
</template>

<script>
import Vue from "vue";
import cancelOrder from "../../components/order/cancelOrder.vue";
import rebuy from "../../components/order/rebuy.vue";

import NoDataView from "../../components/noData/noData";

import Clipboard from "clipboard";
import { Toast, Lazyload, List, Dialog } from "vant";
Vue.use(Toast)
  .use(Lazyload, {
    loading: require("@/assets/img/lazy_icon1.png"),
    error: require("@/assets/img/lazy_icon1.png")
  })
  .use(List);

export default {
  name: "orderList",
  data() {
    return {
      userId: this.$store.state.login.userId,
      orderType: null,
      pageTitle: "",
      showNull: false,
      list: [],
      current: 1,
      loading: false,
      finished: false,
      cancelOrderData: null,
      rebuyData: null,
      clipboard: null,
      firstIn: true,
      clickState: true
    };
  },
  components: { cancelOrder, NoDataView, rebuy },
  watch: {
    orderType(newVal, oldVal) {
      switch (newVal) {
        case "":
          //全部订单
          this.pageTitle = "全部订单";
          break;
        case "0":
          this.pageTitle = "待付款";
          //代付款
          break;
        case "1":
          this.pageTitle = "待发货";
          //待发货
          break;
        case "2":
          this.pageTitle = "待收货";
          //待收货
          break;
        case "3":
          this.pageTitle = "已完成";
          //已完成
          break;
        case "4":
          this.pageTitle = "已取消";
          //已取消
          break;
        case 6:
          this.pageTitle = "待评价";
          //待评价
          break;
      }
      this.$route.meta.title = this.pageTitle; //动态标题
      if (!this.firstIn) {
        this.$router.replace({
          query: {
            orderType: newVal
          }
        });
      }

      this.list = [];
      this.finished = false;
      this.loading = true;
      this.showNull = false;
      this.current = 1;
      this.getData();
    },
    list(newVal, oldVal) {
      if (newVal.length == 0 && this.finished) {
        this.showNull = true;
      }
    }
  },
  filters: {
    getStateText(state) {
      let obj = {};
      switch (state) {
        case "":
          //全部订单
          obj = {};
          break;
        case 0:
          obj = {
            name: "待付款"
          };
          //代付款
          break;
        case 1:
          obj = {
            name: "待发货"
          };
          //
          break;
        case 2:
          obj = {
            name: "待收货"
          };
          //待收货
          break;
        case 3:
          obj = {
            name: "已完成"
          };
          //已完成
          break;
        case 4:
          obj = {
            name: "已取消"
          };
          //已取消
          break;
      }
      return obj.name;
    }
  },
  methods: {
    getData() {
      if (this.orderType == null) {
        return false;
      }
      let _this = this;
      let params = {
        header: {},
        body: {
          userId: this.userId,
          size: 10,
          current: this.current
        }
      };
      if (this.orderType != "" && this.orderType != null) {
        params.body.orderStatus = this.orderType;
      }
      this.$api.getMyOrderList(params).then(res => {
        if (res.code == 0) {
          _this.current++;
          if (res.data.records.length < 10) {
            _this.finished = true;
            _this.list.push.apply(_this.list, res.data.records);
          } else {
            _this.loading = false;
            _this.list.push.apply(_this.list, res.data.records);
          }
        } else {
          _this.list = [];
          _this.finished = true;
          _this.loading = false;
        }
      });
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
    changeOrderType(i) {
      this.firstIn = false;
      if (this.clickState) {
        this.clickState = false;
        this.orderType = i;
      }
      let _this = this;
      setTimeout(() => {
        _this.clickState = true;
      }, 300);
    },
    showRebuy(data) {
      this.rebuyData = data;
      this.$refs.rebuyOrderC.isShow();
    },
    getrebuyResult() {
      this.goComfirmOrder();
    },
    goComfirmOrder() {
      this.$router.push({
        path: "/confirmOrder"
      });
    },
    confirmGoodsFun(id, index) {
      let _this = this;
      Dialog.confirm({
        message: "是否确认收货？",
        width: "70%",
        confirmButtonColor: "#ff6e26"
      })
        .then(() => {
          // on confirm
          _this.confirmGoodsFunA(id, index);
        })
        .catch(() => {
          // on cancel
        });
    },
    showCance(data) {
      this.cancelOrderData = data;
      this.$refs.cancelOrderC.isShow();
    },
    getCancelResult(i) {
      if (i) {
        this.orderType = "4";
      }
    },
    confirmGoodsFunA(id, index) {
      let _this = this;
      let params = {
        header: {},
        body: {
          id: id
        }
      };
      this.$api.confirmGoods(params).then(res => {
        if (res.code == 0) {
          if (_this.orderType == "2") {
            //单独收货订单列表
            this.list.splice(index, 1);
          } else {
            _this.list[index].orderStatus = 3;
          }
          _this.tapToOther("/confirmGoodsResult", { orderId: id });
        } else {
          //未知错误
        }
      });
    },
    copyFun(event) {
      var clipboard = new Clipboard(event.currentTarget);
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
      clipboard.onClick(event); //胡乱弄出来的不知什么玩意
    },

    tapToOther(routerName, data) {
      if (routerName == "/pay") {
        if (
          navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
          "micromessenger"
        ) {
          if (
            this.$store.state.login.openId &&
            this.$store.state.login.openId != ""
          ) {
            this.$router.push({
              path: routerName,
              query: data
            });
          } else {
            this.getWXRequestUrlFun(data.orderId);
          }
        } else {
          this.$router.push({
            path: routerName,
            query: data
          });
        }
      } else {
        this.$router.push({
          path: routerName,
          query: data
        });
      }
    },
    getWXRequestUrlFun(orderId) {
      let params = {
        header: {},
        body: {
          redirectUrl:
            "https://nfys-test.kinglian.cn/ybH5/pay?orderId=" + orderId,
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
    }
  },
  mounted() {
    this.orderType = String(this.$route.query.orderType);
  },
  activated() {}
};
</script>
<style lang="less">
.orderList-page {
  width: 100%;
  .header-box {
    width: 100%;
    height: 80px;
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: space-around;
    .swiper_item {
      height: 100%;
      display: flex;
      align-items: center;
      & > span {
        position: relative;
        display: flex;
        justify-content: center;
        font-size: 28px;
        color: #333333;
        & > span {
          width: 100%;
          height: 80px;
          line-height: 80px;
        }
        .greenL {
          width: 100%;
          height: 6px;
          position: absolute;
          bottom: 18px;
          display: none;
          justify-content: center;
          align-items: center;
          & > span {
            width: 24px;
            height: 6px;
            background-color: #3ac756;
            border-radius: 3px;
            display: block;
          }
        }
      }
    }
    .acitive span {
      font-size: 32px;
      & .greenL {
        display: flex;
      }
    }
  }
  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 30px;
    .item-box {
      width: 100%;
      box-sizing: border-box;
      background-color: #fff;
      padding: 0 20px;
      margin-bottom: 20px;
      &:nth-child(1) {
        margin-top: 20px;
      }
      .order-num {
        width: 100%;
        display: flex;
        align-items: center;
        font-size: 28px;
        color: #333333;
        height: 87px;
        white-space: nowrap;
        overflow: hidden;
        .num {
          flex-grow: 2;
          display: flex;
          align-items: center;
          font-size: 28px;
          color: #333333;
          overflow: hidden;
          & > span {
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .copy-box {
            padding: 0 15px 0 11px;
            flex-shrink: 0;
            flex-grow: 0;
            width: 24px;
            height: 24px;
            font-size: 0;
          }
        }
        .state {
          font-size: 24px;
          color: #a8a8a8;
        }
      }
      .order-products {
        width: 100%;
        border-top: 1px solid #ebebeb;
        border-bottom: 1px solid #ebebeb;
        padding-bottom: 20px;
        .item-product {
          width: 100%;
          padding-top: 20px;
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
              line-height: 40px;
              height: 78px;
              font-size: 28px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              color: #333333;
            }
            .kongwei {
              flex-grow: 2;
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
      .prices {
        width: 100%;
        line-height: 69px;
        text-align: right;
        font-size: 28px;
        color: #666666;
        & span:nth-child(2) {
          color: #ff6f26;
        }
      }
      .operations {
        width: 100%;

        display: flex;
        flex-direction: row-reverse;
        .item-button {
          margin-left: 20px;
          width: 160px;
          height: 60px;
          border-radius: 30px;
          box-sizing: border-box;
          font-size: 28px;
          color: #333;
          background-color: #fff;
          border: 1px solid #aaaaaa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .colorY {
          color: #fff;
          border: none;
          background-image: linear-gradient(90deg, #ffa64c 0%, #ff6f26 100%),
            linear-gradient(#cfcfcf, #cfcfcf);
          background-blend-mode: normal, normal;
        }
        .colorG {
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
  }
}
</style>

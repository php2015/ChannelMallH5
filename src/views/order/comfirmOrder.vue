<template>
  <div
    class="confirmOrder"
    v-wechat-title="$route.meta.title"
    img-set="./static/img/favicon.ico"
    v-if="confirmOrderData != null"
  >
    <!-- 地址 -->
    <div class="confirmOrder-address" @click="jumpAddressList">
      <div class="confirmOrder-address-icon">
        <img src="../../assets/img/confirm-address.png" alt />
      </div>
      <div
        class="comfirmOrder-address-center"
        v-if="confirmOrderData.siteStatus != 1 && (confirmOrderData.siteStatus == 0 || $store.state.orderConfirm.editAddressData)"
      >
        <div>
          <span v-text="confirmOrderData.receivingSite.name"></span>
          <span v-text="confirmOrderData.receivingSite.phone"></span>
        </div>
        <div>
          <span v-if="confirmOrderData.receivingSite.selected == '1'">
            <img src="../../assets/img/mo.png" alt />
          </span>
          <div
            :class="{name:confirmOrderData.receivingSite.selected == '1'}"
          >{{confirmOrderData.receivingSite.provinceName}}{{confirmOrderData.receivingSite.cityName}}{{confirmOrderData.receivingSite.districtName}}{{confirmOrderData.receivingSite.address}}</div>
        </div>
      </div>
      <div
        class="comfirmOrder-address-center-edit"
        v-if="confirmOrderData.siteStatus == 2 && !$store.state.orderConfirm.editAddressData"
      >
        <div class="comfirmOrder-address-edit">请填写地址</div>
      </div>
      <div class="comfirmOrder-address-center-edit" v-if="confirmOrderData.siteStatus == 1">
        <div class="comfirmOrder-address-edit">请新增地址</div>
      </div>
      <div class="confirmOrder-address-more">
        <img src="../../assets/img/more.png" alt />
      </div>
    </div>

    <!-- 用药人信息 -->
    <div
      class="confirmOrder-useDrug"
      @click="jumpUseDrugInfo"
      v-if="confirmOrderData.isInquiry == 1"
    >
      <div class="confirmOrder-useDrug-icon">
        <img src="../../assets/img/useDrug_icom.png" alt />
      </div>
      <div class="comfirmOrder-useDrug-center">
        <div>
          <span>用药人信息</span>
        </div>
        <div v-if="$store.state.orderConfirm.patientInfo">
          <span>{{$store.state.orderConfirm.patientInfo.patientName}}</span>
          <span>{{$store.state.orderConfirm.patientInfo.patientAge}}岁</span>
          <span>{{$store.state.orderConfirm.patientInfo.patientGender == 1 ? '男' : '女'}}</span>
        </div>
        <div v-if="!$store.state.orderConfirm.patientInfo">
          <span>请填写用药人信息</span>
        </div>
      </div>
      <div class="confirmOrder-useDrug-more">
        <img src="../../assets/img/more.png" alt />
      </div>
    </div>

    <div class="cart-item">
      <div class="cart-item-header">商品清单</div>
      <div class="cart-item-wrap" v-for="(item,index) in confirmOrderData.commList" :key="index">
        <div class="cart-item-img">
          <img v-lazy="(item.commImg || '').split(';')[0]" alt />
        </div>
        <div class="cart-item-msg">
          <div class="cart-item-name">
            <i v-if="item.isRx == 1">
              <img src="../../assets/img/Rx.png" alt />
            </i>
            <span :class="{name: item.isRx == 1}" v-text="item.name"></span>
          </div>
          <div class="cart-item-tip" v-if="item.label">
            <span v-for="(list,i) in (item.label || '').split('；')" :key="i" v-text="list"></span>
          </div>
          <div class="cart-item-price-input">
            <div
              class="cart-item-price"
              v-if="item.columnId && item.specialPrice && item.salePrice"
            >
              <span>{{item.specialPrice | pricePre}}</span>
              <span>{{item.specialPrice | priceNext}}</span>
            </div>
            <div
              class="cart-item-price"
              v-if="item.columnId && !item.specialPrice && item.salePrice"
            >
              <span>{{item.salePrice | pricePre}}</span>
              <span>{{item.salePrice | priceNext}}</span>
            </div>
            <div class="cart-item-price" v-if="!item.columnId">
              <span>{{item.salePrice | pricePre}}</span>
              <span>{{item.salePrice | priceNext}}</span>
            </div>
            <div class="cart-item-cart">
              <span @click="subOrder(index)">
                <img src="../../assets/img/cart-sub.png" alt />
              </span>
              <input type="tel" @blur="qtyBlur(index)" v-model="item.qty" />
              <span @click="addOrder(index)">
                <img src="../../assets/img/cart-add.png" alt />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="comfirmOrder-textArea">
      <div>留言</div>
      <van-field
        v-model="remark"
        rows="1"
        autosize
        maxlength="45"
        type="textarea"
        placeholder="备注发货需要注意的事项,如需发票请留言,选填(45字以内）"
      />
    </div>

    <div class="comfirmOrder-money">
      <div>
        <span>商品总价</span>
        <span>¥{{confirmOrderData.commSumPrice.toFixed(2)}}</span>
      </div>
      <div v-if="confirmOrderData.inquiryPrice">
        <span>问诊费</span>
        <span>¥{{confirmOrderData.commSumPrice.toFixed(2)}}</span>
      </div>
      <div>
        <span>运费</span>
        <span>¥{{confirmOrderData.freight.toFixed(2)}}</span>
      </div>
      <div>
        <span>配送方式</span>
        <span class="comfirmOrder-money-ship">快递</span>
      </div>
    </div>

    <div class="comfirmOrder-fixed">
      <div class="comfirmOrder-fixed-left">
        <div>
          <span>总计</span>
          <span>{{confirmOrderData.orderPrice | pricePre}}</span>
          <span>{{confirmOrderData.orderPrice | priceNext}}</span>
        </div>
        <div>已选{{confirmOrderData.commSumQty}}件商品</div>
      </div>
      <div class="comfirmOrder-fixed-right">
        <span @click="jumpPay">提交订单</span>
      </div>
    </div>
    <div class="comfirmOrder-div"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, Toast, Lazyload } from "vant";
Vue.use(Field)
  .use(Lazyload)
  .use(Toast);
export default {
  name: "confirmOrder",
  data() {
    return {
      remark: this.$store.state.orderConfirm.remark || "",
      confirmOrderData: null,
      visitOfficeDrugParam: null,
      submitFlag: true
    };
  },
  filters: {
    pricePre(value) {
      var val = parseInt(value);
      return val;
    },
    priceNext(value) {
      var val = "." + String(parseFloat(value).toFixed(2)).split(".")[1];
      return val;
    }
  },
  watch: {
    remark(newVal, oldVal) {
      this.$store.commit("remark", newVal);
    }
  },
  methods: {
    jumpUseDrugInfo() {
      this.$router.push({ path: "useDrugInfo", query: {} });
    },
    jumpAddressList() {
      if (this.confirmOrderData.siteStatus == 0) {
        this.$router.push({ name: "addressList", query: {} });
      } else if (this.confirmOrderData.siteStatus == 2) {
        this.$router.push({ name: "addressList", query: {} });
      } else {
        this.$router.push({
          name: "addressEdit",
          query: {
            addressEditType: 0,
            selectCode: "110101"
          }
        });
      }
    },
    jumpPay() {
    
      if (this.$route.query.businessTypeId == 9) {
        //平方开药下单
        let ids = [];
        if (!this.$store.state.orderConfirm.patientInfo) {
          Toast("请填写用药人信息");
          return false;
        }
        for (let i in this.$store.state.orderConfirm.comList) {
          ids.push(this.$store.state.orderConfirm.comList[i].channelCommId);
        }
        if (!this.submitFlag) {
          return false;
        }
        this.submitFlag = false;
        this.queryRxDrugs(ids);
      } else {
        //普通商品下
          if (!this.submitFlag) {
            return false;
          }
          this.submitFlag = false;
          this.placeOrder();
      }
    },
    qtyBlur(i) {
      if (
        this.confirmOrderData.commList[i].qty >
        this.confirmOrderData.commList[i].inventory
      ) {
        console.log(this.confirmOrderData.commList[i].inventory);
        this.confirmOrderData.commList[i].qty = this.confirmOrderData.commList[
          i
        ].inventory;
        console.log(this.confirmOrderData.commList[i].qty);
        Toast(`最多只能买${this.confirmOrderData.commList[i].qty}件哦`);
      } else if (this.confirmOrderData.commList[i].qty < 1) {
        this.confirmOrderData.commList[i].qty = 1;
      } else if (
        this.confirmOrderData.commList[i].maxQuantity &&
        this.confirmOrderData.commList[i].qty >
          this.confirmOrderData.commList[i].maxQuantity
      ) {
        this.confirmOrderData.commList[i].qty = this.confirmOrderData.commList[
          i
        ].maxQuantity;
        Toast(`最多只能买${this.confirmOrderData.commList[i].maxQuantity}件哦`);
      }
      this.$store.commit("comList", this.confirmOrderData.commList);
      setTimeout(() => {
        this.perOrder();
      }, 1000);
    },
    perOrder() {
      let params = {
        header: {},
        body: {
          userId: this.$store.state.login.userId,
          comList: this.$store.state.orderConfirm.comList
        }
      };

      //凭方开药
      if (this.$route.query.businessTypeId == 9) {
        params.body.businessTypeId = 9;
      }

      Toast.loading();
      this.$api.perOrder(params).then(res => {
        console.log(res);
        Toast.clear();
        if (res.code == 0) {
          this.confirmOrderData = res.data;
          this.editAddressDataFunc();
        } else {
          Toast(res.message);
        }
      });
    },
    editAddressDataFunc() {
      if (this.$store.state.orderConfirm.editAddressData) {
        let receivingSite = this.confirmOrderData.receivingSite;
        if (!receivingSite) {
          console.log(111);
          this.confirmOrderData.receivingSite = this.$store.state.orderConfirm.editAddressData;
        } else {
          this.confirmOrderData.receivingSite = Object.assign(
            receivingSite,
            this.$store.state.orderConfirm.editAddressData
          );
          console.log(22);
        }
        if (this.confirmOrderData.siteStatus == 1) {
          this.$store.commit("editAddressData", null);
        }

        console.log(this.confirmOrderData.receivingSite);
      }
    },
    subOrder(i) {
      let comList = this.$store.state.orderConfirm.comList;
      if (comList[i].qty <= 1) {
        return false;
      } else {
        comList[i].qty -= 1;
        this.$store.commit("comList", comList);
        this.perOrder();
      }
    },
    addOrder(i) {
      let comList = this.$store.state.orderConfirm.comList;
      if (comList[i].qty >= this.confirmOrderData.commList[i].inventory) {
        Toast("亲，没有这么多库存了~");
        return false;
      } else {
        comList[i].qty += 1;
        this.$store.commit("comList", comList);
        this.perOrder();
      }
    },
    //下单
    placeOrder() {
      if (!this.confirmOrderData.receivingSite) {
        Toast("请填写地址");
        return false;
      }

      let params = {
        header: {},
        body: {
          userId: this.$store.state.login.userId,
          siteId: this.confirmOrderData.receivingSite.id,
          channelId: this.$store.state.login.header.channelId,
          remark: this.remark,
          comList: this.$store.state.orderConfirm.comList,
          delShopCar: this.$route.query.delShopCar != null ? 1 : 0
        }
      };
      console.log(params);
      if (this.$route.query.businessTypeId == 9) {
        params.body.visitOfficeDrugParam = this.visitOfficeDrugParam;
        params.body.inquiryType = 9;
      }
      this.$api.placeOrder(params).then(res => {
        this.submitFlag = true;
        console.log(res);
        if (res.code == 0) {
          this.$router.replace({
            path: "pay",
            query: {
              orderId: res.data.orderId
            }
          });
          // if (
          //   navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
          //   "micromessenger"
          // ) {
          //   if (
          //     this.$store.state.login.openId &&
          //     this.$store.state.login.openId != ""
          //   ) {
          //     this.$router.replace({
          //       path: "pay",
          //       query: {
          //         orderId: res.data.orderId
          //       }
          //     });
          //   } else {
          //     this.getWXRequestUrlFun(res.data.orderId);
          //   }
          // } else {
          //   this.$router.replace({
          //     path: "pay",
          //     query: {
          //       orderId: res.data.orderId
          //     }
          //   });
          // }
        } else {
          Toast(res.message);
        }
      });
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
    },
    queryRxDrugs(channelCommIds) {
      let params = {
        header: {},
        body: {
          channelCommIds
        }
      };
      this.$api.queryRxDrugs(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          let queryRxDrugsTamp = res.data;
          let comListTamp = this.$store.state.orderConfirm.comList;
          for (let i in queryRxDrugsTamp) {
            queryRxDrugsTamp[i].count = comListTamp[i].qty;
          }
          let drugList = queryRxDrugsTamp;

          let visitOfficeDrugParam = {
            roleId: this.$store.state.login.userId,
            roleType: 1,
            clinicId: 90000,
            roleUserId: this.$store.state.login.userId, //
            patientId: this.$store.state.orderConfirm.patientInfo.patientId, //'cb2a60845559425aa133bca77bd2d2d5'
            drugstoreId: "",
            inquiryImgList: this.$store.state.orderConfirm.patientInfo
              .inquiryImgList,
            diagnose: this.$store.state.orderConfirm.patientInfo.diagnose, //'唇单纯疱疹,急性肾小球肾炎，IgA肾病',
            mainSuit: this.$store.state.orderConfirm.patientInfo.mainSuit, //'"1侧头痛恶心2天',
            medicalHistory: this.$store.state.orderConfirm.patientInfo
              .medicalHistory, //'高血压，糖尿病，过劳肥',
            illnessDuration: this.$store.state.orderConfirm.patientInfo
              .illnessDuration, //'一月内',
            allergy: this.$store.state.orderConfirm.patientInfo.allergy, //'青霉素，链霉素，贫穷',
            inquiryType: 9,
            familyMedicalHistory: this.$store.state.orderConfirm.patientInfo
              .familyMedicalHistory, //'无',
            expertId: "",
            drugList: drugList
          };
          this.visitOfficeDrugParam = visitOfficeDrugParam;
          this.placeOrder();
        }
      });
    }
  },
  mounted() {
    this.perOrder();
  }
};
</script>  
<style lang="less">
.confirmOrder {
  .comfirmOrder-div {
    height: 132px;
  }
  .confirmOrder-address {
    display: flex;
    align-items: center;
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 30px 0;
    .confirmOrder-address-icon {
      width: 31px;
      height: 32px;
      margin: 0 23px 0 20px;
      flex-shrink: 0;
    }
    .comfirmOrder-address-center-edit {
      display: flex;
      align-items: center;
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
    }
    .comfirmOrder-address-center {
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
          margin-top: 5px;
          span {
            display: inline-block;
            width: 72px;
            height: 41px;
            position: absolute;
            top: 7px;
            left: 0;
          }
          div {
            display: inline-block;
            color: #666666;
            font-size: 28px;
            line-height: 45px;
          }
          .name {
            text-indent: 82px;
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
  .confirmOrder-useDrug {
    display: flex;
    align-items: center;
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 30px 0;
    .confirmOrder-useDrug-icon {
      width: 31px;
      height: 32px;
      margin: 0 23px 0 20px;
      flex-shrink: 0;
    }
    .comfirmOrder-useDrug-center-edit {
      display: flex;
      align-items: center;
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
    }
    .comfirmOrder-useDrug-center {
      flex-grow: 2;
      border-left: 2px solid #ebebeb;
      padding-left: 20px;
      div {
        &:first-child {
          span {
            color: #333;
            font-weight: 600;
            font-size: 32px;
          }
        }
        &:last-child {
          span {
            margin-top: 13px;
            display: inline-block;
            color: #666666;
            font-size: 28px;
            line-height: 45px;
          }
        }
      }
    }
    .confirmOrder-useDrug-more {
      flex-shrink: 0;
      padding-right: 20px;
      width: 14px;
      height: 26px;
    }
  }
  .cart-item {
    margin: 20px 30px 0;
    border-radius: 12px;
    .cart-item-header {
      padding-top: 30px;
      padding-left: 20px;
      padding-bottom: 5px;
      color: #666666;
    }
    background: #fff;
    .cart-item-wrap {
      display: flex;
      align-items: center;
      padding: 20px 20px 26px 20px;
      .cart-item-img {
        width: 180px;
        height: 180px;
        flex-shrink: 0;
        border-radius: 8px;
        overflow: hidden;
      }
      .cart-item-msg {
        flex-grow: 2;
        padding: 0 0 0 19px;
        box-sizing: border-box;
        .cart-item-name {
          margin-top: -4px;
          position: relative;
          i {
            position: absolute;
            top: 2px;
            left: 0;
            display: inline-block;
            width: 32px;
            height: 26px;
          }
          span {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            line-height: 38px;
          }
          .name {
            text-indent: 38px;
          }
        }
        .cart-item-tip {
          span {
            font-size: 20px;
            line-height: 29px;
            color: #aeafb2;
            margin-right: 10px;
          }
        }
        .cart-item-price-input {
          display: flex;
          margin-top: 30px;
          .cart-item-price {
            flex-shrink: 0;
            display: flex;
            align-items: flex-end;
            span {
              &:first-child {
                font-size: 32px;
                color: #ff6e26;
                &::before {
                  content: "￥";
                  font-size: 24px;
                  margin-right: -4px;
                }
              }
              &:last-child {
                font-size: 24px;
                color: #ff6e26;
                padding-bottom: 2px;
              }
            }
          }
          .cart-item-cart {
            flex-grow: 2;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            input {
              width: 80px;
              height: 40px;
              background-color: #f6f8fa;
              text-align: center;
              color: #666666;
            }
            span {
              display: inline-block;
              width: 40px;
              height: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      }
    }
  }
  .comfirmOrder-textArea {
    margin: 0 30px;
    margin-top: 20px;
    background: #fff;
    border-radius: 12px;
    padding-left: 20px;
    padding-bottom: 23px;
    textarea {
      &::placeholder {
        font-size: 24px;
      }
    }
    .van-cell {
      padding: 0;
    }
    & > div {
      padding-top: 27px;
      padding-bottom: 4px;
    }
  }
  .comfirmOrder-money {
    margin: 20px 30px 0;
    border-radius: 30px;
    background: #fff;
    padding: 18px 0;
    div {
      display: flex;
      padding: 0 20px;
      span {
        line-height: 56px;
        &:first-child {
          flex-grow: 2;
          font-size: 28px;
          color: #666666;
        }
        &:last-child {
          flex-shrink: 0;
          color: #ff6e26;
        }
        &.comfirmOrder-money-ship {
          color: #333333;
        }
      }
    }
  }
  .comfirmOrder-fixed {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 112px;
    z-index: 10;
    background: #fff;
    align-items: center;
    padding: 0 30px 0 49px;
    box-sizing: border-box;
    .comfirmOrder-fixed-left {
      flex-grow: 2;
      div {
        &:first-child {
          display: flex;
          align-items: flex-end;
          span {
            &:nth-child(2) {
              font-size: 36px;
              color: #ff6e26;
              &::before {
                content: "￥";
                font-size: 28px;
                margin-right: -4px;
              }
            }
            &:nth-child(3) {
              margin-left: 2px;
              padding-bottom: 4px;
              color: #ff6e26;
              font-size: 24px;
            }
          }
        }
        &:last-child {
          margin-top: 10px;
          color: #333;
        }
      }
    }
    .comfirmOrder-fixed-right {
      flex-shrink: 0;
      span {
        width: 180px;
        height: 72px;
        background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
          linear-gradient(#f89283, #f89283);
        background-blend-mode: normal, normal;
        border-radius: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }
  }
}
</style>
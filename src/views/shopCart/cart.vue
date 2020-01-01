<template>
  <div class="cart" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div style="height: 44px"></div>
    <div class="cart-containner" v-if="!emptyFlag">
      <div class="cart-item">
        <!-- <div class="cart-item-header">商品来源：儿童用药分类</div> -->
        <div class="cart-item-wrap" v-for="(item,index) in  records" :key="index">
          <div class="cart-item-pic">
            <div @click="selectStatus(index)">
              <img
                v-if="edit == 0 && item.shelveStatus == 0 && item.selected == 1 && item.inventory > 0"
                src="../../assets/img/cart-choose.png"
                alt
              />
              <img
                v-if="edit == 0 && item.shelveStatus == 0 && item.selected == 0 && item.inventory > 0"
                src="../../assets/img/cart-nor.png"
                alt
              />
              <img
                v-if="edit == 0 && (item.shelveStatus != 0 || item.inventory == 0)"
                src="../../assets/img/cart-disable.png"
                alt
              />

              <img v-if="edit == 1 && item.selected == 0" src="../../assets/img/cart-nor.png" alt />
              <img
                v-if="edit == 1 && item.selected == 1"
                src="../../assets/img/cart-choose.png"
                alt
              />
            </div>
          </div>
          <div
            class="cart-item-img"
            @click="jumpProductDetail(item.channelCommId,item.columnCommId)"
          >
            <img v-lazy="(item.commImg || '').split(';')[0]" alt />
            <span v-if="item.inventory < 1">缺货</span>
            <span v-if="item.shelveStatus != 0">下架</span>
            <span v-if="item.shelveStatus != 0 && item.inventory < 1">下架</span>
          </div>
          <div class="cart-item-msg">
            <div class="cart-item-name">
              <i v-if="item.isRx == 1">
                <img src="../../assets/img/Rx.png" alt />
              </i>
              <span :class="{'name': item.isRx == 1}" v-text="item.name"></span>
            </div>
            <div class="cart-item-tip" v-if="item.label">
              <span v-for="(list,index) in item.label.split('；')" :key="index" v-text="list"></span>
            </div>
            <div class="cart-item-store">库存仅剩：{{item.inventory}}</div>
            <div class="cart-item-price-input">
              <div class="cart-item-price">
                <span>{{item.showPrice | pricePre}}</span>
                <span>{{item.showPrice | priceNext}}</span>
              </div>
              <div class="cart-item-cart" v-if="item.shelveStatus == 0 && item.inventory > 0">
                <span @click="subInput(index)">
                  <img src="../../assets/img/cart-sub.png" alt />
                </span>
                <input type="tel" @blur="blurInput(index)" v-model="item.qty" />
                <span @click="addInput(index)">
                  <img src="../../assets/img/cart-add.png" alt />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :class="{'shopCart-fixed': true,'shopCart-fixed-lxj': $store.state.login.channelNum == 2}" v-if="records.length > 0">
      <div class="shopCart-choose" v-if="$store.state.cart.type == 0" @click="chooseAllFunc">
        <i>
          <img v-if="chooseAllFlag" src="../../assets/img/cart-choose.png" alt />
          <img v-if="!chooseAllFlag" src="../../assets/img/cart-nor.png" alt />
        </i>
        <span>全选</span>
      </div>
      <div class="shopCart-price" v-if="edit == 0">
        <div>
          <div class="shopCart-fixed-price">
            <span>总计</span>
            <div>
              <span>{{selectedPrice | pricePre}}</span>
              <span>{{selectedPrice | priceNext}}</span>
            </div>
          </div>
          <div class="shopCart-fixed-num">已选{{selectedNum}}件商品</div>
        </div>
      </div>
      <div class="shopCart-submit" v-if="edit == 0">
        <span @click="jumpConfirmOrder">去下单</span>
      </div>
      <div class="shopCart-clear" @click="clearEfficacy" v-if="edit == 1">
        <span>快速清理失效商品</span>
      </div>
      <div class="shopCart-delete" v-if="edit == 1">
        <span @click="shopCartDelete">删除</span>
      </div>
    </div>
    <div v-if="records.length == 0" style="padding-bottom: 40px;">
      <empty :tip="tip" />
    </div>

    <!-- 失效商品 -->
    <div class="shopCart-efficacy" v-if="efficacyFlag">
      <div class="shopCart-efficacy-wrap">
        <div class="shopCart-efficacy-title">快速清理失效商品</div>
        <div class="shopCart-efficacy-num">一共有{{efficacyLength}}件商品缺货或已下架</div>
        <div class="shopCart-efficacy-containner">
          <div
            class="shopCart-efficacy-item"
            v-for="(item,index) in getUnEfficacyComArr"
            :key="index"
          >
            <span>
              <img v-lazy="(item.imgUrl || '').split(';')[0]" alt />
            </span>
            <div v-if="item.comStatus == 0">缺货</div>
            <div v-if="item.comStatus == 1">下架</div>
          </div>
        </div>
        <div class="shopCart-efficacy-btn">
          <div @click="canncel">取消</div>
          <div @click="sureDelete">确认删除</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import empty from "../../components/common/empty";
import { Lazyload, Toast, Dialog } from "vant";
Vue.use(Lazyload)
  .use(Toast)
  .use(Dialog);
Vue.use(Dialog);

export default {
  name: "cart",
  data() {
    return {
      emptyFlag: false,
      editFlag: false,
      tip: "暂时没有数据哦~~",
      efficacyFlag: false,
      type: this.$store.state.cart.type,
      records: [],
      chooseAllFlag: false,
      selectedNum: 0,
      selectedPrice: 0,
      getUnEfficacyComArr: [],
      efficacyLength: 0
    };
  },
  components: {
    empty
  },
  computed: {
    edit() {
      return this.$store.state.cart.edit;
    },
    getCartData() {
      return this.$store.state.cart.getCartData;
    }
  },
  watch: {
    getCartData(val) {
      if (val) {
        setTimeout(() => {
          this.getShoppingCarComm();
          this.$store.commit("getCartData", false);
        }, 1000);
      }
    }
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
  methods: {
    jumpProductDetail(channelCommId, columnCommId) {
      this.$router.push({
        path: "/productDetail",
        query: {
          id: channelCommId,
          columnCommId
        }
      });
    },
    jumpConfirmOrder() {
      this.chooseOrder();
      if (this.$store.state.orderConfirm.comList.length < 1) {
        Toast("请选择要购买的商品");
        return false;
      }
      this.$store.commit("remark", "");
      if (this.$store.state.cart.type == 1) {
        this.$store.commit("patientInfo", null);
        this.$router.push({
          path: "/confirmOrder",
          query: {
            businessTypeId: 9,
            delShopCar: 1
          }
        });
        return false;
      }
      this.$router.push({
        path: "/confirmOrder",
        query: {
          delShopCar: 1
        }
      });
    },
    clearEfficacy() {
      this.efficacyFlag = this.efficacyFlag ? false : true;
      if (this.efficacyFlag) {
        this.getUnEfficacyCom();
      }
    },
    canncel() {
      this.efficacyFlag = false;
    },
    sureDelete() {
      let ids = [];
      for (let i in this.records) {
        if (
          this.records[i].inventory == 0 ||
          this.records[i].shelveStatus != 0
        ) {
          ids.push(this.records[i].shoppingCarId);
        }
      }
      this.delBatchShopCar(ids);
      this.efficacyFlag = false;
      this.$common.getShopCarNum(this.$store.state.cart.type);
    },
    shopCartDelete() {
      let deleteFlag = true;
      for (var i in this.records) {
        if (this.records[i].selected == 1) {
          deleteFlag = false;
        }
      }
      if (deleteFlag) {
        Toast("请选择要删除的商品");
        return false;
      }
      Dialog.confirm({
        title: "标题",
        message: "是否删除所选的商品？",
        confirmButtonText: "删除",
        confirmButtonColor: "#000",
        cancelButtonText: "取消",
        cancelButtonColor: "#666"
      })
        .then(() => {
          let ids = [];
          for (let i in this.records) {
            if (this.records[i].selected == 1) {
              ids.push(this.records[i].shoppingCarId);
            }
          }
          this.delBatchShopCar(ids);
        })
        .catch(() => {
          // on cancel
        });
    },
    getShoppingCarComm() {
      //获取购物车列表
      let params = {
        header: {},
        body: {
          userId: this.$store.state.login.userId,
          type: this.$store.state.cart.type
        }
      };
      Toast.loading();
      this.$api.getShoppingCarComm(params).then(res => {
        console.log(res);
        Toast.clear();
        if (res.code == 0) {
          let records = res.data.records;
          this.records = records;
          this.chooseAllFlagFunc();
          this.priceAndNum();
        }
      });
    },
    //选中状态
    selectStatus(i) {
      let selected = this.records[i].selected == 0 ? 1 : 0;
      this.changeSelect(i, this.records[i].shoppingCarId, selected);
    },
    //勾选状态请求
    changeSelect(i, shoppingCarId, selected) {
      let params = {
        header: {},
        body: {
          shoppingCarId,
          type: this.$store.state.cart.type,
          userId: this.$store.state.login.userId,
          selected: selected
        }
      };
      this.$api.changeSelect(params).then(res => {
        if (res.code == 0) {
          this.records[i].selected = selected;
          this.chooseAllFlagFunc();
          this.priceAndNum();
        } else {
          Toast(res.message);
        }
      });
    },
    //全选/全不选
    chooseAllFunc() {
      let shoppingCarId = [];
      for (let i in this.records) {
        shoppingCarId.push(this.records[i].shoppingCarId);
      }
      this.chooseAllFlag = this.chooseAllFlag == 0 ? 1 : 0;
      this.chooseAll(shoppingCarId, this.chooseAllFlag);
    },
    chooseAll(shoppingCarId, selected) {
      let params = {
        header: {},
        body: {
          shoppingCarId,
          selected
        }
      };
      Toast.loading();
      this.$api.chooseAll(params).then(res => {
        Toast.clear();
        if (res.code == 0) {
          for (let i in this.records) {
            this.records[i].selected = selected;
            this.priceAndNum();
          }
        }
      });
    },
    //改变选中状态
    chooseAllFlagFunc() {
      for (let i in this.records) {
        if (this.records[i].selected == 0) {
          this.chooseAllFlag = false;
          return false;
        }
        this.chooseAllFlag = true;
      }
    },
    //商品数量减
    subInput(i) {
      
      this.records[i].qty = parseInt(this.records[i].qty);
      if (this.records[i].qty <= 1) {
        return false;
      } else {
        Toast.loading();
        this.records[i].qty -= 1;
        this.changeCarNum(this.records[i].shoppingCarId, this.records[i].qty,i);
      }
    },
    //商品数量加
    addInput(i) {
      Toast.loading();
      this.records[i].qty = parseInt(this.records[i].qty);
      let numOld = this.records[i].qty;

      if (this.records[i].qty >= this.records[i].inventory) {
        this.records[i].qty = this.records[i].inventory;
        Toast(`最多只能买${this.records[i].inventory}件哦`);
      } else {
        //  this.records[i].qty += 1;
        numOld += 1;
        if (
          this.$store.state.cart.type == 1 &&
          this.records[i].maxQuantity &&
          numOld > this.records[i].maxQuantity
        ) {
          this.records[i].qty = this.records[i].maxQuantity;
          Toast(`药品的最大数量不能超过${this.records[i].maxQuantity}个哦！`);
        } else {
          this.changeCarNum(this.records[i].shoppingCarId, numOld, i);
        }
      }
    },
    //输入商品数量
    blurInput(i) {
      this.records[i].qty = parseInt(this.records[i].qty);
      if (this.records[i].qty >= this.records[i].inventory) {
        this.records[i].qty = this.records[i].inventory;
        Toast(`最多只能买${this.records[i].inventory}件哦`);
      } else if (parseInt(this.records[i].qty) < 1) {
        this.records[i].qty = 1;
      } else if (
        this.$store.state.cart.type == 1 &&
        this.records[i].maxQuantity &&
        this.records[i].qty > this.records[i].maxQuantity
      ) {
        this.records[i].qty = this.records[i].maxQuantity;
        Toast(`药品的最大数量不能超过${this.records[i].maxQuantity}个哦！`);
      }
      this.changeCarNum(this.records[i].shoppingCarId, this.records[i].qty,i);
    },
    //修改商品的数量
    changeCarNum(shoppingCarId, qty, i) {
      let params = {
        header: {},
        body: {
          shoppingCarId,
          type: this.$store.state.cart.type,
          userId: this.$store.state.login.userId,
          qty
        }
      };
      this.$api.changeCarNum(params).then(res => {
        Toast.clear();
        if (res.code == 0) {
          this.$store.commit("shopCartNum", res.data.qty);
          this.records[i].qty = qty;
          this.priceAndNum();
        } else {
          setTimeout(() => {
            this.getShoppingCarComm(); //更改数量失败更新页面数据
          }, 1000);
          Toast(res.message);
        }
      });
    },
    //购买价格和商品数量计算
    priceAndNum() {
      this.selectedNum = 0;
      this.selectedPrice = 0;
      for (let i in this.records) {
        if (
          this.records[i].selected == 1 &&
          this.records[i].shelveStatus == 0 &&
          this.records[i].inventory > 0
        ) {
          this.selectedNum += parseInt(this.records[i].qty);
          this.selectedPrice +=
            parseInt(this.records[i].qty) * this.records[i].showPrice;
        }
      }
    },
    //失效商品列表
    getUnEfficacyCom() {
      let params = {
        header: {},
        body: {
          userId: this.$store.state.login.userId,
          type: this.$store.state.cart.type
        }
      };
      this.$api.getUnEfficacyCom(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.getUnEfficacyComArr = res.data;
          this.efficacyLength = res.data.length;
        }
      });
    },
    //批量删除商品
    delBatchShopCar(ids) {
      let params = {
        header: {},
        body: {
          ids,
          type: this.$store.state.cart.type,
          userId: this.$store.state.login.userId
        }
      };
      console.log(params);
      this.$api.delBatchShopCar(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.getShoppingCarComm();
          console.log(this.$store.state.cart.type);
          this.$common.getShopCarNum(this.$store.state.cart.type);
        }
      });
    },
    chooseOrder() {
      let comList = [];
      for (let i in this.records) {
        if (
          this.records[i].inventory > 0 &&
          this.records[i].shelveStatus == 0 &&
          this.records[i].selected == 1
        ) {
          let comListArr = {
            channelCommId: this.records[i].channelCommId,
            columnCommId: this.records[i].columnCommId,
            qty: this.records[i].qty
          };
          comList.push(comListArr);
        }
      }
      this.$store.commit("comList", comList);
    }
  },
  mounted() {
    this.getShoppingCarComm();
  },
  activated() {
    console.log(111);
    this.$common.getShopCarNum(0);
    this.getShoppingCarComm();
  }
};
</script>
<style lang="less">
.cart {
  .cart-containner {
    padding: 0 30px;
    box-sizing: border-box;
    width: 100%;
    .cart-item {
      margin-top: 25px;
      .cart-item-header {
        line-height: 64px;
        padding-left: 20px;
        color: #666666;
      }
      background: #fff;
      .cart-item-wrap {
        display: flex;
        align-items: center;
        padding: 20px 0 26px 0;
        .cart-item-pic {
          width: 40px;
          height: 40px;
          margin: 0 12px 0 20px;
          flex-shrink: 0;
        }
        .cart-item-img {
          width: 180px;
          height: 180px;
          flex-shrink: 0;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          span {
            line-height: 40px;
            display: block;
            width: 100%;
            font-size: 24px;
            background: rgba(51, 51, 51, 0.5);
            color: #fff;
            position: absolute;
            bottom: 0;
            left: 0;
            text-align: center;
            border-radius: 0 0 8px 8px;
          }
        }
        .cart-item-msg {
          flex-grow: 2;
          padding: 0 28px 0 19px;
          box-sizing: border-box;
          .cart-item-name {
            position: relative;
            i {
              position: absolute;
              top: 0;
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
              &.name {
                text-indent: 38px;
              }
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
          .cart-item-store {
            font-size: 24px;
            color: #666666;
            margin-top: 4px;
            display: flex;
            justify-content: flex-end;
          }
          .cart-item-price-input {
            display: flex;
            margin-top: 5px;
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
                height: 36px;
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
  }
  
  .shopCart-fixed {
    position: fixed;
    bottom: 98px;
    left: 0;
    height: 113px;
    width: 100%;
    z-index: 10;
    background: #fff;
    display: flex;
    align-items: center;
    .shopCart-choose {
      margin-left: 50px;
      flex-shrink: 0;
      i {
        display: inline-block;
        width: 40px;
        height: 40px;
      }
    }
    .shopCart-price {
      flex-grow: 2;
      display: flex;
      justify-content: flex-end;
      div {
        .shopCart-fixed-price {
          display: flex;
          margin-bottom: 6px;
          & > span {
            display: flex;
            align-items: flex-end;
            padding-bottom: 2px;
          }
          div {
            span {
              &:first-child {
                font-size: 36px;
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
                margin-left: -4px;
              }
            }
          }
        }
      }
    }
    .shopCart-submit {
      flex-shrink: 0;
      padding: 0 30px 0 10px;
      span {
        display: flex;
        width: 180px;
        height: 73px;
        background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
          linear-gradient(#f89283, #f89283);
        background-blend-mode: normal, normal;
        border-radius: 36px;
        justify-content: center;
        align-items: center;
        color: #fff;
      }
    }
    .shopCart-clear {
      flex-grow: 2;
      display: flex;
      justify-content: flex-end;
      span {
        width: 270px;
        height: 72px;
        border-radius: 36px;
        border: solid 2px #ff6e26;
        color: #ff6e26;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .shopCart-delete {
      flex-shrink: 0;
      margin: 0 60px 0 20px;
      span {
        width: 180px;
        height: 73px;
        background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
          linear-gradient(#f89283, #f89283);
        background-blend-mode: normal, normal;
        border-radius: 36px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .shopCart-fixed-lxj{
    bottom: 0 !important;
  }
  .shopCart-efficacy {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    margin: auto;
    z-index: 1002;
    background: rgba(51, 51, 51, 0.5);
    .shopCart-efficacy-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 10001;
      width: 100%;
      height: 772px;
      background: #fff;
      border-radius: 32px 32px 0px 0px;
      .shopCart-efficacy-title {
        font-size: 32px;
        font-weight: 600;
        color: #333333;
        text-align: center;
        margin-top: 35px;
      }
      .shopCart-efficacy-num {
        text-align: center;
        margin-top: 20px;
      }
      .shopCart-efficacy-containner {
        display: flex;
        flex-wrap: wrap;
        padding: 32px 49px 0;
        height: 500px;

        overflow-y: auto;
        .shopCart-efficacy-item {
          margin-bottom: 20px;
          position: relative;
          width: 148px;
          height: 148px;
          margin-right: 19px;
          &:last-child {
            margin-right: 0;
          }
          span {
            display: inline-block;
            width: 148px;
            height: 148px;
            border-radius: 8px;
            overflow: hidden;
          }
          div {
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 1002px;
            height: 40px;
            width: 100%;
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
          }
        }
      }
      .shopCart-efficacy-btn {
        display: flex;
        height: 112px;
        align-items: center;
        justify-content: center;
        margin-top: 14px;
        div {
          margin: 0 15px;
          &:first-child {
            display: flex;
            width: 330px;
            height: 72px;
            border: 2px solid #ff8441;
            border-radius: 36px;
            justify-content: center;
            align-items: center;
            color: #ff8441;
          }
          &:last-child {
            display: flex;
            width: 330px;
            height: 72px;
            background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
              linear-gradient(#f89283, #f89283);
            background-blend-mode: normal, normal;
            border-radius: 36px;
            border-radius: 36px;
            justify-content: center;
            align-items: center;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
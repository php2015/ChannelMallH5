<template>
  <div class="goods-row">
    <div class="imgB">
      <img v-lazy="goodsData.imgUrl?goodsData.imgUrl.split('；')[0]:''" />
    </div>
    <div class="info">
      <div class="infoB">
        <div class="name" :class="{activecf:goodsData.isRx=='1'}">
          <div class="logoC">
            <img src="../../../assets/img/Rx.png" alt />
          </div>
          <div class="namet">{{goodsData.name}}</div>
        </div>
        <div class="type" v-if="goodsData.label">
          <span v-for="(item2, index2) in goodsData.label.split('；')" :key="index2">{{item2}}</span>
        </div>
      </div>
      <div class="price">
        <div class="priceB">
          <div class="priceC">
            <span>
              <span>¥{{goodsData.salePrice|spplicPrice(goodsData.specialPrice)}}</span>
              <span>.{{goodsData.salePrice|spplicPrice2(goodsData.specialPrice)}}</span>
            </span>
            <span class="logo" v-show="goodsData.specialPrice&&goodsData.specialPrice>0">特惠</span>
          </div>
          <span class="oldP" v-show="goodsData.originalPrice&&goodsData.originalPrice>0">{{goodsData.originalPrice}}</span>
        </div>
        <div class="addimg" v-show="goodsData.isRx!='1'">
          <div @click.stop="saveCommCart(goodsData.columnId,goodsData.originalPrice, goodsData.salePrice, goodsData.specialPrice, goodsData.channelCommId,goodsData.columnCommId, goodsData.isRx)">
            <img :src="addUrl" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import Vue from "vue";
import { Lazyload } from "vant";
Vue.use(Lazyload, {
  loading: require("@/assets/img/lazy_icon1.png"),
  error: require("@/assets/img/lazy_icon1.png")
});

export default {
  name: "ridingresult",
  props: {
    goodsData: {
      type: Object
    }
  },
  data() {
    return {
      addUrl: require("@/assets/img/add_shopCart.png"),
      rxUrl: require("@/assets/img/Rx.png"),
      img: ""
    };
  },
  filters: {
    spplicPrice(a, s) {
      let n = s || a;
      return String(parseFloat(n).toFixed(2)).split(".")[0];
    },
    spplicPrice2(a, s) {
      let n = s || a;
      return String(parseFloat(n).toFixed(2)).split(".")[1];
    }
  },
  mounted() {
    //	console.log(this.confirmData)
  },
  methods: {
    clickYes(i) {
      //this.showState = false;
    },
    saveCommCart(columnId,originalPrice, salePrice, specialPrice, id, columnCommId,isRx) {
      window.event.cancelBubble = true;
      if(!this.$common.isLogin()) return false;

      this.$common.addShopCart(
        columnId,
        originalPrice,
        salePrice,
        specialPrice,
        id,
        columnCommId,
        isRx
      );
    },
  }
};
</script>
<style lang="less">
.goods-row {
  width: 100%;
  height: 100%;
  display: flex;
  .imgB {
    width: 260px;
    height: 260px;
    background-color: #f5f7fa;
    border-radius: 12px;
    overflow: hidden;
  }

  .info {
    width: 30%;
    height: 260px;
    flex-grow: 2;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: 20px;

    .infoB {
      width: 100%;
      position: relative;

      .name {
        width: 100%;
        position: relative;

        .logoC {
          width: 32px;
          height: 26px;
          padding-bottom: 5px;
          position: absolute;
          top: 4px;
          left: 0;
          font-size: 0;
          display: none;
        }
        .namet {
          width: 100%;
          font-size: 28px;
          line-height: 38px;
          color: #333333;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          text-indent: 0;
          -webkit-box-orient: vertical;
        }
      }
      & .activecf {
        .logoC {
          display: block;
        }
        .namet {
          text-indent: 36px;
        }
      }

      .type {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        height: 44px;

        span {
          padding-right: 20px;
          font-size: 24px;
          line-height: 40px;
          color: #aeafb2;
        }
      }
    }

    .price {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .priceB {
        width: 50%;
        flex-grow: 2;
        display: flex;
        align-items: flex-end;

        .priceC {
          position: relative;
          & > span {
            font-size: 0;
            & span:nth-child(1) {
              font-size: 36px;
              line-height: 1;
              color: #ff6e26;
            }
            & span:nth-child(2) {
              font-size: 24px;
              color: #ff6e26;
            }
          }

          .logo {
            width: 46px;
            height: 24px;
            position: absolute;
            right: 0;
            top: -20px;
            right: -20px;
            background-image: linear-gradient(90deg, #ffaf41 0%, #ff6e26 100%),
              linear-gradient(#fb5555, #fb5555);
            background-blend-mode: normal, normal;
            border-radius: 4px 4px 4px 0px;
            text-align: center;
            font-size: 20px;
            line-height: 24px;
            color: #ffffff;
          }
        }

        .oldP {
          padding-left: 7px;
          font-size: 24px;
          line-height: 1;
          color: #d2d2d4;
          text-decoration: line-through;
        }
      }
      .addimg {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;

        div {
          width: 36px;
          height: 36px;
          padding: 10px;
          border-radius: 32px;
          flex-shrink: 0;
        }
      }
    }
  }
}
</style>
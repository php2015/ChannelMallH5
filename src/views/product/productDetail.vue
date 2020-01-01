<template>
  <div class="productDetail" v-if="productDetailData">
    <!-- 轮播 -->
    <div class="productDetail-banner">
      <van-swipe :autoplay="3000" class="productDetail-banner-swipe" v-if="productDetailData.commImg">
        <van-swipe-item  v-for="(image, index) in productDetailData.commImg.split(';')" :key="index">
          <img v-lazy="image" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="productDetail-wrap">
      <!-- 价格 -->
      <div class="productDetail-price" v-if="productDetailData.columnId && productDetailData.specialPrice && productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.specialPrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.specialPrice | priceNext}}</span>
            <span>
              <img v-if="productDetailData.columnId && productDetailData.specialPrice" src="../../assets/img/tehui.png" alt />
            </span>
          </span>
        </div>
        <s v-if="productDetailData.columnId && productDetailData.specialPrice && productDetailData.originalPrice">{{productDetailData.originalPrice}}</s>
      </div>

      <div class="productDetail-price" v-if="productDetailData.columnId && !productDetailData.specialPrice && productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.salePrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.salePrice | priceNext}}</span>
            <span>
              <img v-if="productDetailData.columnId && productDetailData.specialPrice" src="../../assets/img/tehui.png" alt />
            </span>
          </span>
        </div>
        <s v-if="productDetailData.columnId && !productDetailData.specialPrice && productDetailData.originalPrice">{{productDetailData.originalPrice}}</s>
      </div>
      <div class="productDetail-price" v-if="productDetailData.columnId && productDetailData.specialPrice && !productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.specialPrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.specialPrice | priceNext}}</span>
            <span>
              <img v-if="productDetailData.columnId && productDetailData.specialPrice" src="../../assets/img/tehui.png" alt />
            </span>
          </span>
        </div>
        <s v-if="productDetailData.columnId && productDetailData.specialPrice && !productDetailData.originalPrice">{{productDetailData.salePrice}}</s>
      </div>

      <div class="productDetail-price" v-if="productDetailData.columnId && !productDetailData.specialPrice && !productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.salePrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.salePrice | priceNext}}</span>
            <span>
              <img v-if="productDetailData.columnId && productDetailData.specialPrice" src="../../assets/img/tehui.png" alt />
            </span>
          </span>
        </div>
      </div>

      <div class="productDetail-price" v-if="!productDetailData.columnId && productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.salePrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.salePrice | priceNext}}</span>
            <span></span>
          </span>
        </div>
        <s v-if="!productDetailData.columnId && productDetailData.originalPrice">{{productDetailData.originalPrice}}</s>
      </div>

      <div class="productDetail-price" v-if="!productDetailData.columnId && !productDetailData.originalPrice">
        <div>
          <span>{{productDetailData.salePrice | pricePre}}</span>
          <span>
            <span>{{productDetailData.salePrice | priceNext}}</span>
            <span></span>
          </span>
        </div>
      </div>
      
      <div class="productDetail-name">
        <i v-if="productDetailData.isRx == 1">
          <img src="../../assets/img/Rx.png" alt />
        </i>
        <span :class="{'name': productDetailData.isRx == 1}" v-text="productDetailData.commName"></span>
      </div>

      <!-- 主要信息 -->
      <div class="productDetail-tip" v-if="productDetailData.label">
        <span v-for="(item,index) in productDetailData.label.split('；')" :key="index" v-text="item"></span>
      </div>

      <div class="productDetail-other">
        <span>销量 {{productDetailData.volume}}</span>
        <span>库存 {{productDetailData.inventory}}</span>
        <span>{{productDetailData.discountsInfo}}</span>
      </div>

    </div>

    <!-- 商品参数 -->
    <div class="productDetail-can" v-if="productDetailData.commNorm || productDetailData.manufacturer || productDetailData.approvalNumber">
      <div class="productDetail-can-word">
        <span>
          <i></i>
          <span>商品参数</span>
        </span>
        <span class="productDetail-can-more" v-if="productDetailData.drugInfo" @click="showCan">更多</span>
      </div>
      <div class="productDetail-table">
        <div v-if="productDetailData.commNorm">
          <span>商品规格</span>
          <span v-text="productDetailData.commNorm">每瓶装9毫升</span>
        </div>
        <div v-if="productDetailData.manufacturer">
          <span>生产厂家</span>
          <span  v-text="productDetailData.manufacturer">上海中华制药南通有限公司</span>
        </div>
        <div v-if="productDetailData.approvalNumber">
          <span>批准文号</span>
          <span v-text="productDetailData.approvalNumber">国药准字H11020001</span>
        </div>
      </div>
    </div>

    <!-- 商品详情 -->
    <div class="productDetail-content">
      <div class="productDetail-content-word">
        <span>
          <i></i>
          <span>商品详情</span>
        </span>
      </div>
      <div v-html="productDetailData.details"></div>
      <div @click="closePage">联像家测试，可忽略</div>
    </div>

    <!-- 普通商品 -->
    <div class="productDetail-fixed" v-if="productDetailData.isRx == 0">
      <div class="productDetail-service" @click="jumpService">
        <span>
          <img src="../../assets/img/service_icon.png" alt />
        </span>
        <span>咨询客服</span>
      </div>
      <div class="productDetail-addCart">
        <div @click="jumpShopCart">
          <span>
            <img src="../../assets/img/gou_icon.png" alt />
          </span>
          <span>
            <span>购物车</span>
            <i class="num">{{$store.state.cart.shopCartNum > 99 ? '99+' : $store.state.cart.shopCartNum}}</i>
          </span>
        </div>
      </div>
      <div class="productDetail-cart">
        <span @click="saveCommCart()">加入购物车</span>
      </div>
      <div class="productDetail-buy">
        <div @click="jumpConfirmOrder">立即购买</div>
      </div>
    </div>

    <!-- 处方药商品 -->
    <div class="productDetail-fixed" v-if="productDetailData.isRx == 1">
      <div class="productDetail-service" @click="jumpService">
        <span>
          <img src="../../assets/img/service_icon.png" alt />
        </span>
        <span>咨询客服</span>
      </div>
      <div class="productDetail-addCart">
        <div @click="jumpRequirementList">
          <span>
            <img src="../../assets/img/required_list.png" alt />
          </span>
          <span>
            <span>需求清单</span>
            <i class="num">{{$store.state.cart.requerementNum > 99 ? '99+' : $store.state.cart.requerementNum}}</i>
          </span>
        </div>
      </div>
      <div class="productDetail-buy">
        <div @click="saveCommCart">加入需求单</div>
      </div>
    </div>
    <div class="productDetail-can-fixed" v-if="canFlag">
      <div class="productDetail-can-wrap">
        <div class="productDetail-can-wrap-word">商品参数</div>
        <div class="productDetail-can-wrap-scroll">
          <div v-if="productDetailData.drugInfo.commNorm">
            <span>商品规格</span>
            <span v-text="productDetailData.drugInfo.commNorm">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.manufacturer">
            <span>生产厂家</span>
            <span v-text="productDetailData.drugInfo.manufacturer">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.approvalNumber">
            <span>批准文号</span>
            <span v-text="productDetailData.drugInfo.approvalNumber">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.name">
            <span>商品名称</span>
            <span v-text="productDetailData.drugInfo.name">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.usageName">
            <span>用 法</span>
            <span v-text="productDetailData.drugInfo.usageName">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.dosage">
            <span>用 量</span>
            <span v-text="productDetailData.drugInfo.dosage">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.funcIndicat">
            <span>功能主治</span>
            <span v-text="productDetailData.drugInfo.funcIndicat">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.drugTypeName">
            <span>药品分类</span>
            <span v-text="productDetailData.drugInfo.drugTypeName">每瓶装9毫升</span>
          </div>
          <div v-if="productDetailData.drugInfo.periodOfValidity">
            <span>有 效 期</span>
            <span v-text="productDetailData.drugInfo.periodOfValidity">每瓶装9毫升</span>
          </div>
        </div>
        <div class="productDetail-can-wrap-close" @click="closeCan">关闭</div>
      </div>
    </div>
    <div class="productDetail-height"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Swipe, SwipeItem, Lazyload, Toast } from "vant";
Vue.use(Swipe)
  .use(SwipeItem)
  .use(Lazyload);

export default {
  name: "productDetail",
  data() {
    return {
      canFlag: false,
      shopCartFlag: false,
      productDetailData: null
    };
  },
  filters: {
    pricePre(value) {
      var val = parseInt(value);
      return val;
    },
    priceNext(value) {
      if(!value) return false;
      var val = "." + String(parseFloat(value).toFixed(2)).split(".")[1];
      return val;
    }
  },
  methods: {
    closePage(){
      JsBridge.callMethod("closePage", '');
    },
    showCan() {
      this.canFlag = true;
    },
    closeCan() {
      this.canFlag = false;
    },
    jumpRequirementList() {
      this.$store.commit('type',1);
      this.$router.push({ path: "/shopCart", query: {} });
    },
    jumpShopCart() {
      this.$store.commit('type',0);
      this.$router.push({ path: "/shopCart", query: {} });
    },
    //立即下单
    jumpConfirmOrder(){
      if(this.productDetailData.inventory < 1){
        Toast('亲~ 库存不足哦');
        return false;
      }
      if(this.productDetailData.shelveStatus != 0){
        Toast('亲~ 商品已下架');
        return false;
      }
      let comList = [{
        channelCommId: this.productDetailData.channelCommId,
        columnCommId: this.productDetailData.columnCommId,
        qty: 1,
      }]
      this.$store.commit('comList',comList);
      this.$store.commit('remark','')
      this.$router.push({path: '/confirmOrder',query: {}})
    },
    //获取订单详情
    getCommDetails() {
      let params = {
        header: {},
        body: {}
      };
      if (this.$route.query.columnCommId)
        params.body.columnCommId = this.$route.query.columnCommId;
      else params.body.channelCommId = this.$route.query.id;
      this.$api.getCommDetails(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.productDetailData = res.data;
          this.$common.getShopCarNum(res.data.isRx)
        }
      });
    },
    //添加购物车
    saveCommCart(){
      if(this.productDetailData.inventory < 1){
        Toast('亲~ 库存不足哦');
        return false;
      }
      if(this.productDetailData.shelveStatus != 0){
        Toast('亲~ 商品已下架');
        return false;
      }
      if(!this.$common.isLogin()) return false;
      this.$common.addShopCart(
        this.productDetailData.columnId,
        this.productDetailData.originalPrice,
        this.productDetailData.salePrice,
        this.productDetailData.specialPrice,
        this.productDetailData.channelCommId,
        this.productDetailData.columnCommId,
        this.productDetailData.isRx)
    },
    jumpService(e){
      if(this.$store.state.login.userId && this.$store.state.login.token){
        window.location.href = "https://tb.53kf.com/code/app/10157687/1";
      }else{
        this.$router.push({
          path: '/loginBypassword',
          query: {}
        })
      }
    }, 
  },
  mounted() {
    this.getCommDetails();
    console.log(window);
    console.log(window.location.href);
    console.log(this.$store.state.login);
  }
};
</script>
<style lang="less">
.productDetail {
  .productDetail-height {
    height: 120px;
  }
  .productDetail-banner {
    .productDetail-banner-swipe {
      .van-swipe__track {
        height: 750px;
      }
      .van-swipe__indicator--active {
        background: #fff;
      }
    }
  }
  .productDetail-wrap {
    background: #fff;
    padding: 0 30px;
    .productDetail-price {
      display: flex;
      align-items: flex-end;
      padding-top: 24px;
      div {
        & > span {
          &:first-child {
            font-size: 48px;
            color: #ff6e26;
            &::before {
              content: "￥";
              font-size: 36px;
              margin-right: -4px;
            }
          }
          &:last-child {
            color: #ff6e26;
            margin-left: -6px;
            position: relative;
            span {
              &:first-child {
                font-size: 36px;
                color: #ff6f26;
              }
              &:last-child {
                display: block;
                width: 43px;
                height: 21px;
                position: absolute;
                bottom: 45px;
                left: 10px;
                z-index: 1;
              }
            }
          }
        }
      }
      s {
        padding-bottom: 6px;
        color: #d2d2d4;
        margin-left: 20px;
      }
    }
    .productDetail-name {
      margin-top: 21px;
      position: relative;

      i {
        display: block;
        position: absolute;
        top: 3px;
        left: 0;
        z-index: 1;
        width: 32px;
        height: 26px;
      }
      span {
        display: block;
        font-size: 32px;
        font-weight: 600;
        line-height: 45px;
       
      }
      .name{
         text-indent: 35px;
      }
    }
    .productDetail-tip {
      margin-top: 4px;
      span {
        color: #666666;
        font-size: 24px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    .productDetail-other {
      display: flex;
      justify-content: space-between;
      margin-top: 35px;
      padding-bottom: 26px;
      span {
        color: #aeafb2;
        font-size: 24px;
        &:nth-child(2) {
          flex: 1;
          margin-left: 35px;
        }
      }
    }
  }
  .productDetail-can {
    .productDetail-can-word {
      display: flex;
      justify-content: space-between;
      height: 83px;
      align-items: center;
      padding: 0 30px;
      background: #fff;
      margin-top: 20px;
      span {
        color: #333;
        &:first-child {
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            width: 6px;
            height: 28px;
            background-color: #3ac756;
            border-radius: 3px;
            margin-right: 7px;
          }
        }
        &.productDetail-can-more {
          color: #666;
        }
      }
    }
    .productDetail-table {
      background: #fff;
      padding: 0 30px;
      div {
        display: flex;
        &:nth-child(odd) {
          background-color: #f6f8fa;
        }
        span {
          display: inline-block;
          line-height: 64px;
          &:first-child {
            width: 138px;
            flex-shrink: 0;
            padding-left: 22px;
            color: #666666;
          }
          &:last-child {
            flex-grow: 2;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #333;
          }
        }
      }
    }
  }
  .productDetail-content {
    margin-top: 20px;
    .productDetail-content-word {
      display: flex;
      justify-content: space-between;
      height: 83px;
      align-items: center;
      padding: 0 30px;
      background: #fff;
      padding-top: 20px;
      span {
        color: #333;
        &:first-child {
          display: flex;
          align-items: center;
          i {
            display: inline-block;
            width: 6px;
            height: 28px;
            background-color: #3ac756;
            border-radius: 3px;
            margin-right: 7px;
          }
        }
      }
    }
  }
  .productDetail-fixed{
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    background: #fff;
    height: 100px;
    display: flex;
    align-items: center;
    .productDetail-service {
      margin-left: 45px;
      span {
        &:first-child {
          display: block;
          width: 40px;
          height: 40px;
          margin: 0 auto;
        }
        &:last-child {
          display: block;
          font-size: 20px;
          color: #333333;
          margin-top: 9px;
        }
      }
    }
    .productDetail-addCart {
      flex: 1;
      div {
        width: 80px;
        margin-left: 43px;
        position: relative;
        & > span {
          &:first-child {
            display: block;
            width: 40px;
            height: 40px;
            margin: 0 auto;
          }
          &:last-child {
            display: block;
            font-size: 20px;
            color: #333333;
            margin-top: 9px;
            text-align: center;
            i {
              position: absolute;
              top: -20px;
              left: 35px;
              z-index: 101;
              min-width: 48px;
              height: 48px;
              font-size: 40px;
              border: solid 4px #ff6f26;
              border-radius: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-sizing: border-box;
              font-style: normal;
              color: #ff6f26;
              transform: scale(0.5);
              background: #fff;
            }
            span {
              font-size: 20px;
              display: block;
            }
          }
        }
      }
    }
    .productDetail-cart{
      span {
        width: 200px;
        height: 72px;
        border-radius: 36px;
        border: solid 2px #ff6e26;
        margin-left: 0;
        color: #ff6e26;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .productDetail-buy {
      margin-left: 0;
      margin-right: 30px;
      div {
        width: 200px;
        height: 72px;
        margin-left: 20px;
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
  .productDetail-can-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    margin: auto;
    background: rgba(51, 51, 61, 0.5);
    .productDetail-can-wrap {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 830px;
      background: #fff;
      border-radius: 32px 32px 0px 0px;
      padding: 0 30px;
      box-sizing: border-box;
      .productDetail-can-wrap-word {
        color: #333333;
        font-weight: 600;
        line-height: 80px;
      }
      .productDetail-can-wrap-scroll {
        height: 650px;
        overflow-y: auto;
        -webkit-overflow-scrolling: auto;
        div {
          line-height: 70px;
          display: flex;
          span {
            font-size: 24px;
            &:first-child {
              width: 105px;
              color: #666666;
              margin-left: 22px;
              flex-shrink: 0;
              display: block;
              text-align: justify;
              height: 70px;
              &::after {
                content: "";
                display: inline-block;
                width: 100%;
              }
            }
            &:last-child {
              color: #333;
              margin-left: 22px;
              flex-grow: 2;
              display: block;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          &:nth-child(odd) {
            background-color: #f6f8fa;
          }
        }
      }
      .productDetail-can-wrap-close {
        width: 690px;
        height: 72px;
        margin-top: 13px;
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
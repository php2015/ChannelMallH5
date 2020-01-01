<template>
  <div class="rebuy-liyou" v-if="visable">
    <div class="cancel-liyou-position">
      <div class="t">以下商品没货/下架了！</div>
      <div class="t2">一共有{{rebuyData.stockoutList.length}}件商品缺货或已下架</div>
      <div class="stockoutList">
        <div class="p-item"  v-for="(item, index) in rebuyData.stockoutList" :key="index">
           
          <div class="item-img"><img v-lazy="item.imgUrl" /></div>
          <div class="i-logo">{{item.reason}}</div>
        </div>
      </div>

      <div class="submit-box">
        <div class="bt-box" @click="visable=false">
          <span>取消</span>
        </div>
        <div class="btr-box" @click="submit()" v-show="rebuyData.isSellOut!='1'">
          <span>购买其他产品</span>
        </div>
      </div>
    </div>
  </div>
</template> 
<script>
import Vue from "vue";
import { Lazyload} from "vant";
Vue.use(Lazyload, {
    loading: require("@/assets/img/lazy_icon1.png"),
    error: require("@/assets/img/lazy_icon1.png")
  });
export default {
  name: "rebuy",
  props: {
    rebuyData: {
      type: Object
    }
  },
  data() {
    return {
      visable: false,
     
    };
  },
  mounted() {},
  methods: {
    isShow() {
      this.visable = true;
    },
    submit() {
    this.visable = false;
      this.$emit("getrebuyResult", true);
    }
  }
};
</script>
<style lang="less">
.rebuy-liyou {
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
    .t {
      width: 100%;
      text-align: center;
      font-size: 32px;
      padding-top: 23px;
      line-height: 55px;
      color: #333333;
	  font-family: PingFang-SC-Bold;
    }
    .t2{
      width: 100%;
      text-align: center;
      font-size: 28px;
      line-height: 50px;
      color: #666;  
    }
    .stockoutList{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        box-sizing:border-box;
        padding: 10px 39px; 
        .p-item{
            width: 148px;
            height: 148px;
            flex-grow: 0;
            flex-shrink: 0;
            margin: 10px;
            position:relative;
            overflow: hidden;
            border-radius: 8px;
            .item-img{
                width: 100%;
                height: 100%;
                font-size: 0;
            }
            .i-logo{
                position:absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 40px;
                line-height: 40px;
                background-color: #000000;
                color: #fff;
                font-size: 24px;
                text-align: center;
            }
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
<template>
  <div class="saleAfterDetail" v-if="getRefundOrderData">
    <div class="saleAfterDetailList-item-header">
      <span>订单号：{{getRefundOrderData.scCode}}</span>
      <span @click.stop="copyFun($event)" :data-clipboard-text="getRefundOrderData.scCode">
        <img src="../../assets/img/copy_order_icon.png" alt />
      </span>
      <span v-if="getRefundOrderData.dealType == 0" class="saleAfterDetailList-item-ing">未处理</span>
      <span v-if="getRefundOrderData.dealType == 1" class="saleAfterDetailList-item-ing">售后中</span>
      <span v-if="getRefundOrderData.dealType == 2" class="saleAfterDetailList-item-over">已处理</span>
    </div>
    <div class="saleAfterDetail-item">
      <div class="saleAfterDetail-item-header">
        <span>售后商品</span>
      </div>
      <div class="saleAfterDetail-containner">
        <div
          class="saleAfterDetail-wrap"
          v-for="(item,index) in getRefundOrderData.commodityList"
          :key="index"
        >
          <div class="saleAfterDetail-wrap-pic">
            <img v-lazy="item.imgUrl.split(';')[0]" alt />
          </div>
          <div class="saleAfterDetail-wrap-right">
            <div class="saleAfterDetail-wrap-name">
              <div v-text="item.commName"></div>
              <div class="kuanglaoshi">售后数量：{{item.applyNumber}}，已退款数量：{{item.refundNumber}}</div>
            </div>
            <div class="saleAfterDetail-wrap-num"></div>
            <div class="saleAfterDetail-wrap-other">
              <span>￥{{item.price}}</span>
              <span v-if="item.qty">x{{item.qty}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="saleAfterDetail-form">
      <div class="saleAfterDetail-form-item">
        <div class="saleAfterDetail-form-word">售后原因</div>
        <div>
          <span v-text="getRefundOrderData.refundReason"></span>
        </div>
        <div class="saleAfterDetail-form-more"></div>
      </div>
      <div class="saleAfterDetail-form-item">
        <div class="saleAfterDetail-form-word">售后描述</div>
        <div>
          <span class="saleAfterDetail-word" v-if="addressDetail">{{addressDetail}}</span>
          <!-- <van-field
            v-if="addressDetail"
            class="addressEdit-item-textarea"
            v-model="addressDetail"
            type="textarea"
            autosize
            maxlength="300"
            placeholder="请输入您对商品售后申请的描述，如购买商品为多件可说明退货数量等信息，300字以内"
          /> -->
          <span v-if="!addressDetail">无</span>
        </div>
      </div>
      <div class="saleAfterDetail-form-item" v-if="getRefundOrderData.refundImg">
        <div class="saleAfterDetail-form-word">商品拍照</div>
        <div class="saleAfterDetail-form-pic">
          <div v-for="(item,index) in (getRefundOrderData.refundImg || '').split(';')" :key="index">
            <span  @click="prevImage(index)">
              <img v-lazy="item" alt />
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="saleAfterDetail-liyou" v-if="false">
      <div class="saleAfterDetail-liyou-position">
        <div>不想要了</div>
        <div>商品降价了</div>
        <div>商品质量有问题</div>
        <div>其它</div>
        <div>取消</div>
      </div>
    </div>
    <div class="saleAfterDetail-price" v-if="getRefundOrderData.refundResult != 1">
      <div>
        <span>退款金额</span>
        <span
          class="saleAfterDetail-yuan"
          v-if="getRefundOrderData.refundPrice"
        >￥{{getRefundOrderData.refundPrice}}</span>
      </div>
      <div>
        <span>售后结果</span>
        <span class="saleAfterDetail-word" >{{getRefundOrderData.refundMessage}}</span>
        <!-- v-if="getRefundOrderData.refundResult == 0" -->
        <!-- <span class="saleAfterDetail-word" v-if="getRefundOrderData.refundResult == 1">未退款！</span> -->
      </div>
    </div>
    <div class="saleAfterDetail-div"></div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, Uploader, Lazyload, Toast,ImagePreview  } from "vant";
Vue.use(Field)
  .use(Uploader)
  .use(Lazyload)
  .use(Toast)
  .use(ImagePreview );
import Clipboard from "clipboard";

export default {
  name: "saleAfterDetail",
  data() {
    return {
      addressDetail: "",
      fileList: [],
      getRefundOrderData: null,
      clipboard: null
    };
  },
  methods: {
    prevImage(i){
      var that = this;
      let images = that.getRefundOrderData.refundImg.indexOf(';') == -1 ?  that.getRefundOrderData.refundImg : that.getRefundOrderData.refundImg.split(';');
      let imgType = typeof(images);
      let arr = [];
      if(imgType == 'string'){
        arr[0] = images;
      }
      ImagePreview({  
        images: typeof(images) == 'string' ? arr : images,
        startPosition: i,
        onClose() {
        }
      });
    },
    getRefundOrder() {
      let params = {
        header: {},
        body: {
          refundOrderId: this.$route.query.refundOrderId
        }
      };
      this.$api.getRefundOrder(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.getRefundOrderData = res.data;
          this.addressDetail = res.data.description;
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
    }
  },
  mounted() {
    this.getRefundOrder();
  }
};
</script>
<style lang="less">
.saleAfterDetail {
  .saleAfterDetailList-item-header {
    display: flex;
    padding: 30px 20px;
    align-items: center;
    background: #fff;
    margin: 20px 30px 0;
    border-radius: 12px;
    span {
      flex-shrink: 0;
      &:nth-child(2) {
        display: inline-block;
        width: 20px;
        height: 22px;
        margin-left: 10px;
        img {
          display: block;
        }
      }
      &:last-child {
        flex-grow: 2;
        display: flex;
        justify-content: flex-end;
      }
      &.saleAfterDetailList-item-ing {
        color: #ff6f26;
      }
      &.saleAfterDetailList-item-over {
        color: #a8a8a8;
      }
    }
  }
  .saleAfterDetail-item {
    margin: 20px 30px 0;
    background: #fff;
    border-radius: 12px;
    .saleAfterDetail-item-header {
      display: flex;
      padding: 30px 0;
      margin: 0 20px;
      align-items: center;
      border-bottom: 2px solid #ebebeb;
    }
    .saleAfterDetail-containner {
      padding: 20px 0;
      .saleAfterDetail-wrap {
        padding: 10px 0;
        margin: 0 20px;
        display: flex;
        align-items: center;
        .saleAfterDetail-wrap-choose {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          margin: 0 32px 0 12px;
        }
        .saleAfterDetail-wrap-pic {
          flex-shrink: 0;
          width: 160px;
          height: 160px;
        }
        .saleAfterDetail-wrap-right {
          flex-grow: 2;
          margin-left: 20px;
          .saleAfterDetail-wrap-name {
            height: 120px;
            div {
              &:first-child {
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 40px;
              }
              &.kuanglaoshi {
                font-size: 24px;
                color: #ff6f26;
                margin-top: 5px;
              }
            }
          }
          .saleAfterDetail-wrap-other {
            margin-top: 10px;
            display: flex;
            font-size: 24px;
            span {
              &:first-child {
                flex-grow: 2;
              }
              &:last-child {
                flex-shrink: 0;
                color: #a8a8a8;
              }
            }
          }
        }
      }
    }
  }
  .saleAfterDetail-form {
    background: #fff;
    margin: 20px 30px 0;
    border-radius: 12px;
    .saleAfterDetail-form-item {
      display: flex;
      align-items: center;
      padding: 30px 0;
      border-bottom: 2px solid #ebebeb;
      margin: 0 20px;
      .saleAfterDetail-form-word{
        white-space: nowrap;
      } 
      .saleAfterDetail-form-pic{
        display: flex;
        flex-wrap: wrap;
        div{
          width: 140px;
          height: 140px;
          flex-shrink: 0;
          margin-right: 10px;
          border-radius: 8px;
          overflow: hidden;
          .pic {
            height: 140px;
            width: 140px;
            border-radius: 8px;
            overflow: hidden;
          }
        }
        div:nth-child(n+4){
          margin-top: 10px;
        }
      }
      &:nth-child(2) {
        align-items: flex-start;
      }
      & > div {
        line-height: 40px;
        &:nth-child(1) {
          margin-right: 40px;
        }
        .saleAfterDetail-word{
          line-height: 40px;
        }
        &:nth-child(2) {
          flex-grow: 2;
          .van-cell {
            padding: 0;
            .van-field__body {
              margin-right: 0;
              margin-top: -5px;
              textarea {
                min-height: 144px;
              }
            }
            .van-cell__value {
              margin-right: 0;
            }

            textarea {
              width: 100%;
            }
          }
          .van-uploader {
            margin-right: 0;
            display: flex;
            .van-uploader__wrapper {
              display: flex;
            }
            .van-uploader__preview-image {
              display: block;
              width: 140px;
              height: 140px;
            }
            .van-uploader__upload {
              width: 140px;
              height: 140px;
            }
          }
        }
        input {
          background: #fff;
        }
      }
      .saleAfterDetail-form-more {
        width: 14px;
        height: 24px;
        img {
          display: block;
        }
      }
      &:last-child {
        border: none;
      }
    }
  }
  .saleAfterDetail-fixed {
    position: fixed;
    bottom: 30px;
    left: 0;
    z-index: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      width: 690px;
      height: 72px;
      background-image: linear-gradient(90deg, #ffa64c 0%, #ff6f26 100%),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
  }
  .saleAfterDetail-liyou {
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
    .saleAfterDetail-liyou-position {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 11;

      width: 100%;
      background-color: #f7f8fa;
      border-radius: 15px 15px 0 0;
      div {
        background: #fff;
        line-height: 88px;
        text-align: center;
        &:first-child {
          border-radius: 15px 15px 0 0;
        }
        &:last-child {
          margin-top: 20px;
        }
      }
    }
  }
  .saleAfterDetail-price {
    margin: 20px 30px 0;
    background: #fff;
    border-radius: 12px;
    div {
      padding: 33px 0;
      margin: 0 20px;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      &:last-child {
        border: none;
        padding: 27px 0;
        span{
         line-height: 40px; 
        }
      }
      .saleAfterDetail-yuan {
        color: #ff6f26;
        margin-left: 30px;
      }
      & span:nth-child(1){
        white-space: nowrap;
      }
      .saleAfterDetail-word {
        color: #666;
        margin-left: 30px;
        line-height: 40px;
      }
    }
  }
  .saleAfterDetail-div {
    height: 20px;
  }
}
</style>
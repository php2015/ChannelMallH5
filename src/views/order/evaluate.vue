<template>
  <div class="evaluate-page">
    <div class="product-list">
      <div class="product-item" v-for="i in 2" :key="i">
        <div class="img-box">
          <img src="../../assets/img/copy_order_icon.png" />
        </div>
        <div class="info">
          <div class="name">共2件商品，总计￥1198共2件商品，总计￥1198共2件商品</div>
          <div class="price">
            <span>159.22</span>
            <span>x1</span>
          </div>
        </div>
      </div>
    </div>
    <div class="saleAfter-form">
      <div class="saleAfter-form-item">
        <div class="saleAfter-form-word">订单评价</div>
        <div class="xing-logo">
          <div class="xing">
            <img src="../../assets/img/star_selected.png" alt />
          </div>
          <div class="xing">
            <img src="../../assets/img/star_selected.png" alt />
          </div>
          <div class="xing">
            <img src="../../assets/img/star_selected.png" alt />
          </div>
          <div class="xing">
            <img src="../../assets/img/star_selected.png" alt />
          </div>
          <div class="xing">
            <img src="../../assets/img/star_selected.png" alt />
          </div>
        </div>
      </div>
      <div class="saleAfter-form-item">
        <div class="saleAfter-form-word">评价描述</div>
        <div>
          <van-field
            class="addressEdit-item-textarea"
            v-model="addressDetail"
            type="textarea"
            autosize
            maxlength="120"
            placeholder="请填写评价(120字以内)"
          />
        </div>
      </div>
      <div class="saleAfter-form-item">
        <div class="saleAfter-form-word upload-text-top">上传图片</div>
        <div>
          <van-uploader v-model="fileList" multiple :max-count="3" />
           <div class="upload-tip">不超过3张</div>
        </div>
      </div>
     
    </div>

    <div class="saleAfter-fixed">
      <span>提交评价</span>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Field, Uploader } from "vant";
Vue.use(Field).use(Uploader);
export default {
  name: "evaluate",
  data() {
    return {
      addressDetail: "",
      fileList: []
    };
  }
};
</script>
<style lang="less">
.evaluate-page {
  .product-list {
    width: 690px;
    background-color: #ffffff;
    border-radius: 12px;
    margin: 20px auto 0;
    padding: 12px 0 32px;

    .product-item {
      width: 100%;
      padding: 0 24px;
      box-sizing: border-box;
      padding-top: 20px;
      display: flex;
      align-items: center;
      .img-box {
        width: 160px;
        flex-shrink: 0;
        height: 160px;
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
          flex-grow: 2;
          width: 100%;
          line-height: 40px;
          font-size: 28px;
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
  .saleAfter-form {
    background: #fff;
    margin: 20px 30px 0;
    border-radius: 12px;
    .saleAfter-form-item {
      display: flex;
      align-items: center;
      padding: 30px 0;
      border-bottom: 2px solid #ebebeb;
      margin: 0 20px;
      &:nth-child(1) {
        & > .xing-logo {
          display: flex;
          & > .xing {
            width: 48px;
            height: 48px;
            font-size: 0;
            padding-right: 30px;
          }
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
        &:nth-child(2) {
          flex-grow: 2;
          .van-cell {
            padding: 0;
            .van-field__body {
              margin-right: 0;
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
      .saleAfter-form-more {
        width: 14px;
        height: 24px;
        img {
          display: block;
        }
      }
    //   &:nth-last-child(2){
    //       border: none;
    //   }
      &:last-child {
        border: none;
      }
    }
    .upload-text-top{
        position: relative;
    top: -30px;
    }
    .upload-tip {
      width: 100%;
      font-size: 24px;
      box-sizing: border-box;
      color: #a8a8a8;
    }
  }
  .saleAfter-fixed {
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
}
</style>
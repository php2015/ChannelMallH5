<template>
  <div class="saleAfterList">
    <div v-if="getRefundPageData">
      <van-list v-model="loading" :finished="finished" :finished-text="noMoreWord" @load="onLoad">
        <div
          class="saleAfterList-item"
          @click.stop="jumpSaleAfterDetail(item.refundOrderId)"
          v-for="(item,index) in getRefundPageData"
          :key="index"
        >
          <div class="saleAfterList-item-header">
            <span>售后单号：{{item.scCode}}</span>
            <span @click.stop="copyFun($event)" :data-clipboard-text="item.scCode">
              <img src="../../assets/img/copy_order_icon.png" alt />
            </span>
            <span v-if="item.dealType == 0" class="saleAfterList-item-ing">未处理</span>
            <span v-if="item.dealType == 1" class="saleAfterList-item-ing">售后中</span>
            <span v-if="item.dealType == 2" class="saleAfterList-item-over">已处理</span>
          </div>
          <div class="saleAfterList-wrap" v-for="(list,i) in item.comList" :key="i">
            <div class="saleAfterList-wrap-pic">
              <img v-lazy="list.imgUrl.split(';')[0]" alt />
            </div>
            <div class="saleAfterList-wrap-right">
              <div class="saleAfterList-wrap-name" v-text="list.name"></div>
              <div class="saleAfterList-wrap-other">
                <span>售后数量：{{list.applyNumber}}</span>
                <span>￥{{list.price}}</span>
              </div>
            </div>
          </div>
          <div class="saleAfterList-hehe">售后原因：{{item.refundReason}}</div>
        </div>
      </van-list>
    </div>
    <div class="saleAfter-empty" v-if="getRefundPageData && getRefundPageData.length == 0">
      <empty :tip="tip" />
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Lazyload, List, Toast } from "vant";
Vue.use(Lazyload)
  .use(List)
  .use(Toast);
import Clipboard from "clipboard";

import empty from "../../components/common/empty";
export default {
  name: "saleAfterList",
  data() {
    return {
      getRefundPageData: null,
      tip: "暂时没有数据哦~~",
      noMoreWord: "没有更多了",
      loading: false,
      finished: false,
      size: 10,
      current: 1,
      clipboard: null
    };
  },
  components: {
    empty
  },
  methods: {
    getRefundPage() {
      let params = {
        header: {},
        body: {
          roleId: this.$store.state.login.userId,
          current: this.current,
          size: this.size
        }
      };
      Toast.loading();
      this.$api.getRefundPage(params).then(res => {
        Toast.clear();
        console.log(res);
        if (res.code == 0) {
          if (!this.getRefundPageData) {
            this.getRefundPageData = [];
          }
          this.getRefundPageData = this.getRefundPageData.concat(
            res.data.records
          );
          console.log(this.getRefundPageData);
          if (res.data.records.length < 10) {
            this.loading = false;
            this.finished = true;
          } else {
            this.current += 1;
            this.loading = false;
            this.finished = false;
          }
          if (this.getRefundPageData.length == 0) {
            this.noMoreWord = "";
          }
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
    onLoad() {
      this.getRefundPage();
    },
    jumpSaleAfterDetail(refundOrderId) {
      this.$router.push({
        path: "/saleAfterDetail",
        query: {
          refundOrderId: refundOrderId
        }
      });
    }
  },
  mounted() {
    this.getRefundPage();
  }
};
</script>
<style lang="less">
.saleAfterList {
  .saleAfter-empty {
    margin-top: 200px;
  }
  .saleAfterList-item {
    margin: 20px 30px 0;
    background: #fff;
    border-radius: 12px;
    .saleAfterList-item-header {
      display: flex;
      padding: 30px 20px;
      align-items: center;
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
        &.saleAfterList-item-ing {
          color: #ff6f26;
        }
        &.saleAfterList-item-over {
          color: #a8a8a8;
        }
      }
    }
    .saleAfterList-wrap {
      padding: 20px 0;
      margin: 0 20px;
      border-top: 2px solid #ebebeb;
      border-bottom: 2px solid #ebebeb;
      display: flex;
      .saleAfterList-wrap-pic {
        flex-shrink: 0;
        width: 160px;
        height: 160px;
        border-radius: 12px;
      }
      .saleAfterList-wrap-right {
        flex-grow: 2;
        margin-left: 20px;
        .saleAfterList-wrap-name {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          line-height: 40px;
          height: 80px;
        }
        .saleAfterList-wrap-other {
          margin-top: 50px;
          display: flex;
          span {
            &:first-child {
              flex-grow: 2;
            }
            &:last-child {
              flex-shrink: 0;
              color: #ff6f26;
            }
          }
        }
      }
    }
    .saleAfterList-hehe {
      padding: 27px 20px;
      line-height: 40px;
    }
  }
}
</style>
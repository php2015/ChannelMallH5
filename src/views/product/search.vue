<template>
  <div class="search-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="search-box">
      <div class="search-input">
        <div class="content">
          <div>
            <img :src="imgUrl" />
          </div>
          <form action="javascript:void(0);" method="post" @submit="searchFun">
            <input
              v-model="serachValue"
              ref="tagInput"
              type="search"
              @blur="isShowHistory(false)"
              @focus="isShowHistory(true)"
              placeholder="搜索您想要的商品"
            />
          </form>
        </div>
        <span @click.stop="routerBack()">取消</span>
      </div>
      <div class="serach-history" v-show="searchState&&historList.length>0">
        <div class="t">
          <span>搜索历史</span>
          <div @click.stop="historList=[]">
            <img :src="delehistoryUrl" />
          </div>
        </div>
        <div class="c-box">
          <span
            v-for="(item, index) in historList"
            :key="index"
            @click.stop="historySearchFun(item)"
          >{{item}}</span>
        </div>
      </div>
    </div>
    <!-- 搜索结果 -->
    <div class="result-box" v-show="!searchState">
      <div class="result-empty" v-show="showNull">
        <no-data-view scene></no-data-view>
      </div>

      <div class="product-list" v-show="!showNull">
        <van-list
          class="van-list-special"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getData"
        >
          <div
            class="product-item"
            v-for="(item, index) in list"
            :key="index"
            @click.stop="jumpProductDetail({id:item.channelCommId})"
          >
            <goods :goodsData="item" />
          </div>
        </van-list>
      </div>
    </div>
    <fixedIcon v-if="$store.state.login.header.channelId=='lxj'"/>
  </div>
</template>

<script>
import Vue from "vue";
import goods from "./component/goods";
import NoDataView from "../../components/noData/noData";
import fixedIcon from '../../components/common/fixedIcon'

import { List, Toast } from "vant";
Vue.use(List).use(Toast);

export default {
  name: "search",
  data() {
    return {
      searchState: true,
      addUrl: require("@/assets/img/add_shopCart.png"),
      delehistoryUrl: require("@/assets/img/del_history_btn.png"),
      rxUrl: require("@/assets/img/Rx.png"),
      imgUrl: require("@/assets/img/search.png"),
      serachValue: "",
      channelId: this.$store.state.login.header.channelId,
      showNull: false,
      list: [],
      current: 1,
      size: 10,
      loading: false,
      finished: false,
      historList: localStorage.getItem("history")
        ? JSON.parse(localStorage.getItem("history"))
        : []
    };
  },
  components: { 
    goods, 
    NoDataView,
    fixedIcon 
  },
  watch: {
    historList(newVal, oldVal) {
      localStorage.setItem("history", JSON.stringify(newVal));
    },
    list(newVal, oldVal) {
      if (newVal.length == 0 && this.finished) {
        this.loading = false;
        this.finished = false;
        this.showNull = true;
      }
    }
  },
  methods: {
    getData() {
      this.showNull = false;
      let _this = this;
      let params = {
        header: {},
        body: {
          value: this.serachValue,
          size: this.size,
          current: this.current,
          channelId: this.channelId
        }
      };
      this.$api.searchComm(params).then(res => {
        if (res.code == 0) {
          _this.current++;
          if (res.data.records.length < 10) {
            _this.finished = true;
            _this.list.push.apply(_this.list, res.data.records);
          } else {
            _this.loading = false;
            _this.list.push.apply(_this.list, res.data.records);
          }
        }
      });
    },
    routerBack() {
      this.$router.go(-1);
    },
    isShowHistory(b) {
      let _this = this;
      if (b) {
        this.searchState = b;
      } else {
        setTimeout(() => {
          _this.searchState = b;
        }, 100);
      }
    },
    needFocus() {
      this.$refs.tagInput.focus();
    },
    historySearchFun(v) {
      this.serachValue = v;
      this.searchFun();
    },
    searchFun() {
      this.$refs.tagInput.blur();
      this.serachValue = this.serachValue.replace(/(^\s*)|(\s*$)/g, "");
      let v = this.serachValue;
      if (v.length <= 0) {
        Toast("请输入搜索关键字");
        return false;
      }
      if (this.historList.length >= 10) {
        if (this.historList.includes(v)) {
          this.historList.splice(this.historList.findIndex(n => n === v), 1);
          this.historList.unshift(v);
        } else {
          this.historList.splice(9, 1);
          this.historList.unshift(v);
        }
      } else {
        if (this.historList.includes(v)) {
          this.historList.splice(this.historList.findIndex(n => n === v), 1);
          this.historList.unshift(v);
        } else {
          this.historList.unshift(v);
        }
      }
      this.list = [];
      this.loading = true;
      this.finished = false;
      this.current = 1;
      this.getData();
    },
    jumpProductDetail(data) {
      window.event.cancelBubble = true;
      this.$router.push({
        path: "/productDetail",
        query: data
      });
    },
    tapToSearch(isY) {
      if (isY) {
        this.$router.push({
          path: "/serach"
        });
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.serachValue = "";
        this.list = [];
        this.$store.commit("searchFocusState", false);
        this.needFocus();
      }, 200);
    });
  },
  activated() {
    if (this.$store.state.other.searchFocusState) {
      //  setTimeout(() => {
      this.serachValue = "";
      this.list = [];
      this.$store.commit("searchFocusState", false);
      this.needFocus();

      // },100);
    }
  }
};
</script>
<style lang="less">
.search-page {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  .search-box {
    width: 100%;
    .search-input {
      width: 100%;
      height: 88px;
      box-sizing: border-box;
      padding: 12px 0;
      display: flex;
      flex-direction: row;
      span {
        padding-left: 30px;
        font-size: 32px;
        color: #3ac756;
        flex-shrink: 0;
        line-height: 64px;
        padding-right: 30px;
      }
      .content {
        width: 50%;
        flex-grow: 2;
        margin-left: 30px;
        height: 100%;
        border-radius: 32px;
        background-color: #f6f8fa;
        display: flex;
        align-items: center;
        overflow: hidden;
        div {
          width: 24px;
          height: 24px;
          font-size: 0;
          padding-left: 20px;
          flex-shrink: 0;
          flex-grow: 0;
        }
        form {
          width: 30%;
          flex-grow: 2;
          font-size: 0;
          height: 64px;
          padding: 0 17px;
          > input {
            width: 100%;
            font-size: 28px;
            height: 28px;
            line-height: 28px;
            box-sizing: content-box;
            padding: 18px 0;
            background-color: transparent;
            color: #333;
            &::-webkit-input-placeholder {
              color: #aeafb2;
              line-height: 38px;
            }
          }
        }
      }
    }
    .serach-history {
      width: 100%;
      box-sizing: border-box;
      padding: 20px 30px 0;
      .t {
        width: 100%;
        height: 46px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: 28px;
          line-height: 46px;
          color: #333333;
        }
        div {
          width: 32px;
          height: 32px;
        }
      }
      .c-box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        span {
          font-size: 24px;
          padding: 0 34px;
          margin-right: 20px;
          margin-bottom: 20px;
          height: 56px;
          line-height: 56px;
          background-color: #f5f6f7;
          border-radius: 28px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .result-box {
    width: 100%;
    .product-list {
      padding: 29px 30px 0;
      box-sizing: border-box;
      width: 100%;
      background-color: #fff;
      .product-item {
        width: 100%;
        height: 260px;
        padding-bottom: 40px;
      }
    }
  }
}
</style>

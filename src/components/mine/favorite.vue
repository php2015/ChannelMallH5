<template>
  <div class="favorite" v-show="showNull&&list.length>0">
    <div class="t-box">
      <div class="logo">
        <img src="../../assets/img/favorite.png" />
      </div>
      <div class="tx">你可能喜欢</div>
    </div>
    <van-list
      class="van-list-special"
      v-model="loading"
      :finished="finished"
      finished-text
      @load="onLoadf"
    >
      <div class="goods-box">
        <div v-for="(item, index) in list" :key="index">
          <goods :item="item" :addCar="false" />
        </div>
      </div>
    </van-list>
  </div>
</template> 
<script>
import Vue from "vue";
import goods from "../index/goods";
import { List } from "vant";
Vue.use(List);
export default {
  name: "ridingresult",
  props: ["confirmData"],
  data() {
    return {
      showNull: true,
      list: [],
      channelId: this.$store.state.login.header.channelId,
      current: 1,
      size: 10,
      loading: true,
      finished: false
    };
  },
  components: {
    goods
  },
  mounted() {
   // this.isAjaxFun();
  },
  methods: {
    isAjaxFun() {
      if (this.current<=1) {
         this.onLoadf();
      }     
    },
    onLoadf() {
      //this.showState = false;
      let _this = this;

      let params = {
        header: {},
        body: {
          //  channelId: this.channelId,
          size: this.size,
          current: this.current
        }
      };
      this.$api.getRecommendComm(params).then(res => {
        if (res.code == 0) {
          _this.current++;
          if (res.data.total <= 10) {
            //总数小于10时
            if (res.data.total <= 0) {
              _this.list = [];
              _this.finished = true;
              _this.showNull = false;
              _this.loading = false;
            } else {
              _this.finished = true;
              _this.list.push.apply(_this.list, res.data.records);
            }
          } else {
            if (res.data.records.length < 10) {
              _this.finished = true;
              _this.list.push.apply(_this.list, res.data.records);
            } else {
              _this.loading = false;
              _this.list.push.apply(_this.list, res.data.records);
            }
          }
        }
      });
    }
  }
};
</script>
<style lang="less">
.favorite {
  width: 100%;
  .t-box {
    width: 100%;
    height: 41px;
    padding-top: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    .logo {
      width: 31px;
      height: 27px;
      font-size: 0;
    }
    .tx {
      font-size: 28px;
      line-height: 36px;
      color: #333333;
    }
  }
  .goods-box {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 30px;
    border-radius: 12px;
    margin-top: 12px;
    & > div {
      margin-top: 10px;
    }
  }
}
</style>
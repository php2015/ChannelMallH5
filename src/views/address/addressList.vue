<template>
  <div class="addressList">
    <div class="result-empty" v-show="showNull">
      <no-data-view scene="noData"></no-data-view>
    </div>
    <van-swipe-cell class="addressList-item-cell" v-for="(item, index) in list" :key="index">
      <div class="addressList-item"  @click="JumpComfirmOrder(index)">
        <div class="addressList-item-header">
          <span>{{item.name}}</span>
          <span>{{item.phone}}</span>
          <div>
            <span @click.stop="jumpAddressEdit(1,item)">
              <img src="../../assets/img/edit.png" alt />
            </span>
            <span @click.stop="jumpAddressEdit(1,item)">编辑</span>
          </div>
        </div>
        <div class="addressList-item-main" :class="{defaultAddress:item.selected!='1'}">
          <span>
            <img src="../../assets/img/mo.png" alt />
          </span>
          <div>{{item.provinceName+(item.provinceName!=item.cityName?item.cityName:'')+item.districtName+item.address}}</div>
        </div>
      </div>
      <template slot="right">
        <van-button square type="danger" @click="deleAddressFun(item)" text="删除" />
      </template>
    </van-swipe-cell>
    <div class="addressList-fixed">
      <span @click="jumpAddressEdit(0)">新增收货地址</span>
    </div>
  </div>
</template>
<script>
import Vue from "vue";

import { SwipeCell, Button, Toast } from "vant";
Vue.use(SwipeCell)
  .use(Button)
  .use(Toast);
import NoDataView from "../../components/noData/noData";

export default {
  name: "addressList",
  data() {
    return {
      userId: this.$store.state.login.userId,
      showNull: false,
      list: [],
      showState: false,
      addressSource: 1  //来源于地址新增
    };
  },
  components: { NoDataView },
  methods: {
    initFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          userId: this.userId
        }
      };
      this.$api.getAddressList(params).then(res => {
        if (res.code == 0) {
          _this.list = res.data;
          if (_this.list.length <= 0) {
            _this.showNull = true;
          }
        } else {
          //未知错误
        }
      });
    },
    deleAddressFun(item) {
      let _this = this;
      let params = {
        header: {},
        body: {
          id: item.id
        }
      };
      this.$api.deleteAddress(params).then(res => {
        if (res.code == 0) {
          _this.list.splice(_this.list.findIndex(n => n === item), 1);
          if (_this.list.length <= 0) {
            _this.showNull = true;
          }
          Toast("地址已删除！");
           if(this.$store.state.orderConfirm.editAddressData.id == item.id){
            this.$store.commit('setEditAddressData',null);
          }
        } else {
          //未知错误
        }
      });
    },
    jumpAddressEdit(type,item) {
      let selectCode = "";
      if (type==1) {
        this.$store.commit("editAddressEdit", item);
        selectCode=item.district?item.district:(item.city?item.city:(item.province?item.province:''))
      }else{
        type == 0;
        selectCode = '110101'
      }
      this.$router.push({
        path: "addressEdit",
        query: { addressEditType: type,selectCode:selectCode}
      });
    },
    JumpComfirmOrder(i){
      if(this.$route.query.addressListSource == 1) return false;
      let editAddressData = this.list[i];
      this.$store.commit('setEditAddressData',editAddressData);
      this.$router.go(-1);
      
    },
    pushHistory() {
      var state = {
          title: "title",
          url: "#"
      };
      window.history.pushState(state, "title", "#");
    }
  },
  mounted() {
    this.initFun();
    let _this = this;
  }      

  
};
</script>
<style lang="less">
.addressList {
  .addressList-item-cell {
    margin: 20px 30px 0;
    .addressList-item {
      background: #fff;
      padding: 32px 0;
      border-radius: 8px;
      .addressList-item-header {
        display: flex;
        margin: 0 20px 0 25px;
        & > span {
          flex-shrink: 0;
          font-weight: 600;
          &:first-child {
            font-size: 32px;
            margin-right: 15px;
          }
          &:last-child {
            font-size: 28px;
          }
        }
        div {
          flex-grow: 2;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          span {
            display: inline-block;
            &:first-child {
              width: 19px;
              height: 22px;
              flex-shrink: 0;
              img {
                display: block;
              }
            }
            &:last-child {
              flex-shrink: 0;
              color: #aeafb2;
              font-size: 24px;
              margin-left: 5px;
            }
          }
        }
      }
      .addressList-item-main {
        margin: 10px 20px 0 25px;
        position: relative;
        span {
          display: inline-block;
          width: 72px;
          height: 40px;
          position: absolute;
          top: 0;
          left: 0;
        }
        div {
          text-indent: 80px;
          line-height: 40px;
          color: #666666;
        }
      }
      .defaultAddress {
        span {
          display: none;
        }
        div {
          text-indent: 0;
        }
      }
    }
    .van-button--normal {
      height: 100%;
      border-radius: 0 8px 8px 0;
    }
    .van-button--danger {
      background-color: #ff6e6e;
      border-color: #ff6e6e;
    }
  }
  .addressList-fixed {
    position: fixed;
    bottom: 26px;
    left: 0;
    z-index: 2;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    span {
      width: 690px;
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
</style>
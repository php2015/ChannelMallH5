<template>
  <div class="addressEdit" v-wechat-title="title" img-set="./static/img/favicon.ico">
    <div class="addressEdit-wrap">
      <div class="addressEdit-item">
        <span>姓名</span>
        <input type="text" placeholder="请输入姓名" v-model="name" maxlength="10" />
      </div>
      <div class="addressEdit-item">
        <span>联系方式</span>
        <input type="tel" v-model="phone" placeholder="请输入联系方式" maxlength="11" />
      </div>
      <div class="addressEdit-item" @click="showAreaSelset">
        <span>所在区域</span>
        <input type="text" v-model="address" placeholder="请选择区域" disabled />
        <p>
          <img src="../../assets/img/more.png" alt />
        </p>
      </div>
      <div class="addressEdit-item">
        <span>详细地址</span>
        <van-field
          class="addressEdit-item-textarea"
          v-model="addressDetail"
          type="textarea"
          autosize
          maxlength="40"
          placeholder="请输入详细地址"
        />
      </div>
    </div>
    <div class="addressEdit-btn">
      <span>设为默认地址</span>
      <span @click="selected=='1'?selected='0':selected='1'">
        <img v-show="selected!='1'" src="../../assets/img/off.png" alt />
        <img v-show="selected=='1'" src="../../assets/img/on.png" alt /> 
      </span>
    </div>
    <div class="addressEdit-delete" v-if="$route.query.addressEditType == 1">
      <span @click="deleAddressFun()">
        <img src="../../assets/img/delete-icon.png" alt />
      </span>
      <span @click="deleAddressFun()">删除</span>
    </div>
    <div class="addressEdit-fixed" @click="saveAddressFun()">
      <span>保存</span>
    </div>
    <area-select
      v-on:getSelectAddress="getSelectAddress"
      ref="addressArea"
      :selectData="selectData"
    ></area-select>
  </div>
</template>

<script>
import Vue from "vue";
import { Field, Toast } from "vant";
Vue.use(Field).use(Toast);

import areaSelect from "../../components/address/areaSelect";

export default {
  name: "addressEdit",
  data() {
    return {
      title: "",
      selectData: {
        selectCode: String(this.$route.query.selectCode)
      },
      id: "",
      userId: this.$store.state.login.userId,
      name: "",
      phone: "",
      address: "",
      addressArray: null,
      addressDetail: "",
      selected: "0" //默认地址：0否，1是
    };
  },
  components: { areaSelect },
  watch: {
    addressArray(newVal, oldVal) {
      this.address=newVal[0].name+(newVal[0].name!=newVal[1].name?newVal[1].name:'')+(newVal[2].name?newVal[2].name:'')
    }
  },
  methods: {
    saveAddressFun() {
      this.addressDetail = this.addressDetail.replace(/(^\s*)|(\s*$)/g, "");
      this.name = this.name.replace(/(^\s*)|(\s*$)/g, "");
      let v = this.addressDetail;

      if (this.name.length <= 0) {
        Toast("请输入姓名");
        return false;
      }
      if (this.addressArray==null||this.addressArray.length <= 0) {
        Toast("请选择区域");
        return false;
      }
      if (v.length <= 0) {
        Toast("请输入详细地址");
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(this.phone)) {
        Toast("请输入正确的手机号");
        return false;
      }

      let _this = this;
      let params = {
        header: {},
        body: {
          name: this.name,
          phone: this.phone,
          province: this.addressArray[0].code,
          provinceName: this.addressArray[0].name,
          city: this.addressArray[1].code,
          cityName: this.addressArray[1].name,
          district: this.addressArray[2].code,
          districtName: this.addressArray[2].name,
          address: this.addressDetail,
          selected: this.selected,
          userId: this.userId
        }
      };
      if (this.id) {
        //编辑地址
        params.body.id = this.id;
        this.$api.updateAddress(params).then(res => {
          if (res.code == 0) {
            let orderConfirmAddressId=this.$store.state.orderConfirm.editAddressData?this.$store.state.orderConfirm.editAddressData.id:'';
            if(this.id == orderConfirmAddressId){
              let editAddressDataTamp = Object.assign(this.$store.state.orderConfirm.editAddressData,params.body);
              this.$store.commit('setEditAddressData', editAddressDataTamp);
            }else{
              if(this.selected == 1&&this.$store.state.orderConfirm.editAddressData){
                let editAddressData = this.$store.state.orderConfirm.editAddressData;
                editAddressData.selected = 0;
                 this.$store.commit('setEditAddressData', editAddressData);
              }
            }
            Toast("保存成功！");
            history.go(-1)
          } else {
            //未知错误
          }
        });
      } else {
        this.$api.saveAddress(params).then(res => {
          if (res.code == 0) {
            Toast("保存成功！");
            history.go(-1);
          } else {
            //未知错误
          }
        });
      }
    },
    deleAddressFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          id: this.id
        }
      };
      this.$api.deleteAddress(params).then(res => {
        if (res.code == 0) {        
          Toast("地址已删除！");
          if(this.$store.state.orderConfirm.editAddressData.id == this.id){
            this.$store.commit('setEditAddressData',null);
          }
          history.go(-1)
        } else {
          //未知错误
        }
      });
    },
    showAreaSelset() {
      this.$refs.addressArea.isShow();
    },
    getSelectAddress(d) {
      this.addressArray = d;
      console.log("已确定选择的地址", d);
    }
  },
  mounted() {
    let type = this.$route.query.addressEditType;
    this.title = type == 0 ? "新增收货地址" : "编辑收货地址";
    if (type == 1) {
      let dataE = this.$store.state.orderConfirm.editAddressEdit;
      this.id = dataE.id;
      this.name = dataE.name;
      this.phone = dataE.phone;
      this.addressArray = [
        { code: String(dataE.province), name: dataE.provinceName },
        { code: String(dataE.city), name: dataE.cityName },
        { code: String(dataE.district), name: dataE.districtName }
      ];
      this.addressDetail = dataE.address;
      this.selected = dataE.selected;
    }
  },
  activated() {}
};
</script>
<style lang="less">
.addressEdit {
  .addressEdit-wrap {
    background: #fff;
    padding: 0 30px;
    .addressEdit-item {
      display: flex;
      align-items: center;
      padding: 33px 0;
      border-bottom: 2px solid #ebebeb;
      span {
        width: 127px;
        display: inline-block;
        text-align: justify;
        height: 30px;
        margin-right: 40px;
        flex-shrink: 0;
        &::after {
          content: "";
          display: inline-block;
          width: 100%;
        }
      }
      input {
        
        background: #fff;
        flex-grow: 2;
         height: 28px;
          font-size: 28px;
          padding: 15px 0 15px 0;
          line-height: 28px;
          box-sizing: content-box;
          color: #333;
          &::-webkit-input-placeholder {
            color: #aeafb2;
            line-height: 38px;
          }
          
      }
      .addressEdit-item-textarea {
        margin-left: -35px;
      }
      p {
        display: inline-block;
        width: 14px;
        height: 26px;
        font-size: 0;
      }
      &:last-child {
        border: none;
        display: flex;
        align-items: flex-start;
         padding-top: 44px;
        padding-bottom: 30px;
        .van-field {
          padding-top: 0;
          margin-top: -10px;
        }
        textarea {
          &::placeholder {
            color: #aeafb2;
          }
        }
      }
    }
  }
  .addressEdit-btn {
    display: flex;
    align-items: center;
    padding: 25px 30px;
    background: #fff;
    margin-top: 20px;
    span {
      &:first-child {
        flex-grow: 2;
      }
      &:last-child {
        flex-shrink: 0;
        display: inline-block;
        width: 102px;
        height: 63px;
      }
    }
  }
  .addressEdit-delete {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
    background: #fff;
    margin-top: 20px;
    span {
      &:first-child {
        display: inline-block;
        width: 32px;
        height: 32px;
        img {
          display: block;
        }
      }
      &:last-child {
        display: flex;
        align-items: center;
        margin-left: 5px;
        color: #ff6e6e;
      }
    }
  }
  .addressEdit-fixed {
    position: fixed;
    bottom: 30px;
    left: 0;
    z-index: 10;
    width: 100%;
    display: flex;
    justify-content: center;
    span {
      width: 690px;
      height: 72px;
      background-image: linear-gradient(90deg, #ffaf41 0%, #ff8441 100%),
        linear-gradient(#d2d2d4, #d2d2d4);
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

<template>
  <div
    class="edit-personal-page"
    v-wechat-title="$route.meta.title"
    img-set="./static/img/favicon.ico"
  >
    <div class="p-icon">
      <div class="t">头像</div>
      <van-uploader class="upload-box-v" :after-read="afterRead" :max-count="1">
        <div class="personal-img">
          <img :src="personImg?personImg:nomalImg" />
        </div>
        <div class="more">
          <img src="../../assets/img/more.png" />
        </div>
      </van-uploader>
    </div>
    <div class="e-item" @click.stop="tapToOther('/editInput',{editType:'2',realName:realName})">
      <div class="t">姓名</div>
      <div class="e-i">
        <input placeholder="请填写姓名" v-model="realName" disabled type="text" />
      </div>
    </div>
    <div class="e-item" @click.stop="tapToOther('/editInput',{editType:'3',nickname:nickname})">
      <div class="t">昵称</div>
      <div class="e-i">
        <input placeholder="请填写昵称" v-model="nickname" disabled type="text" />
      </div>
    </div>
    <div class="e-item">
      <div class="t">性别</div>
      <div class="e-sex">
        <span :class="{esexacitive:gender=='1'}" @click.stop="genderSelect('1')">男</span>
        <span :class="{esexacitive:gender=='2'}" @click.stop="genderSelect('2')">女</span>
      </div>
    </div>
    <div class="e-item" @click.stop="tapToOther('/editInput',{editType:'5',sfzh:sfzh})">
      <div class="t">身份证</div>
      <div class="e-i">
        <input placeholder="请填写身份证号" v-model="sfzh" disabled type="text" />
      </div>
    </div>
    <div class="e-item" @click.stop="tapToOther('/editInput',{editType:'6'})">
      <div class="t">手机号</div>
      <div class="e-i acitive">{{phone}}</div>
      <div class="more">
        <img src="../../assets/img/more.png" />
      </div>
    </div>
    <!-- <div class="e-item" @click="showAreaSelset()">
      <div class="t">所在地区</div>
      <div class="e-i">请选择地区</div>
      <div class="more">
        <img src="../../assets/img/more.png" />
      </div>
    </div>-->
    <div
      class="e-item"
      style="box-shadow: 0 0 0 0;"
      @click.stop="tapToOther('/editInput',{editType:'8',address:address})"
    >
      <div class="t">详细地址</div>
      <div class="e-i">
        <input placeholder="请填写详细地址" v-model="address" disabled type="text" />
      </div>
    </div>
    <!-- buttom -->
    <div class="submit">
      <div @click.stop="updatePersonInfoFun()">保存</div>
    </div>
    <div @click="outLogin" style="height: 50px;width: 100px;position:fixed;top: 340px;"></div>
    <area-select
      v-on:getSelectAddress="getSelectAddress"
      ref="addressArea"
      :selectData="selectData"
    ></area-select>
  </div>
</template>

<script>
import Vue from "vue";
import { Uploader, Toast, Dialog } from "vant";
Vue.use(Uploader).use(Toast);
import areaSelect from "../../components/address/areaSelect";

export default {
  name: "editPersonalInfo",
  data() {
    return {
      nomalImg: require("@/assets/img/chat/default_user.png"),
      personImg: "",
      fileImg: null,
      selectData: { selectCode: "" },
      personInfo: this.$store.state.login.personInfo
        ? this.$store.state.login.personInfo
        : {},
      editPersonInfoData: this.$store.state.login.editPersonInfoData,
      roleId: this.$store.state.login.userId,
      realName: "",
      phone: this.$store.state.login.personInfo.telephone,
      sfzh: "",
      gender: this.$store.state.login.personInfo.gender,
      address: "",
      nickname: "",
      avatar: this.$store.state.login.personInfo.imageUrl,
      loginFlag: 0
    };
  },
  components: { areaSelect },
  watch: {
    loginFlag() {
      setTimeout(() => {
        this.loginFlag = 0;
      }, 2500);
      if (this.loginFlag == 5) {
        this.$store.commit("token", "");
        this.$store.commit("userId", "");
        this.$store.commit("personInfo", "");
        this.$store.commit("phone", "");
        this.$store.commit("shopCartNum", 0);

        this.$router.push({
          path: "/",
          query: {
            time: new Date()
          }
        });
      }
    }
  },
  methods: {
    outLogin() {
      this.loginFlag += 1;
    },
    updatePersonInfoFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          clinicId: "90000", //兼容老平台参数
          roleType: "1",
          roleId: this.roleId,
          realName: this.realName,
          phone: this.phone,
          sfzh: this.sfzh,
          gender: this.gender,
          address: this.address,
          nickname: this.nickname,
          avatar: this.avatar
        }
      };
      this.$api.updatePersonInfo(params).then(res => {
        if (res.code == 0) {
          Toast("保存成功！");
          _this.personInfo.personName = _this.realName;
          _this.personInfo.personOtherName = _this.nickname;
          _this.personInfo.gender = _this.gender;
          _this.personInfo.idCard = _this.sfzh;
          _this.personInfo.liveAddress = _this.address;
          _this.personInfo.imageUrl = _this.avatar;
          _this.$store.commit("personInfo", _this.personInfo);
          setTimeout(() => {
            Toast.clear();
            history.go(-1);
          }, 1000);
        } else {
          //未知错误
        }
      });
    },
    showAreaSelset() {
      Toast("未开发");
      //this.$refs.addressArea.isShow();
    },
    genderSelect(t) {
      this.gender = t;
      let newO = this.$store.state.login.editPersonInfoData;
      newO.gender = t;
      this.$store.commit("editPersonInfoData", newO);
    },
    getSelectAddress(d) {
      console.log("已确定选择的地址", d);
    },
    afterRead(file) {
      let _this = this;
      this.personImg = file.content ? file.content : "";
      this.$uploadImg(file.file).then((o)=>{
        if (o.code=='0') {
          _this.avatar = o.url;
          let newO = _this.$store.state.login.editPersonInfoData;
          newO.imageUrl = o.url;
          _this.$store.commit("editPersonInfoData", newO);
        }
      })
      // return false;
      // let formData = new FormData();
      // formData.append("file", file.file);
      // this.$api.chatImgUpload(formData).then(res => {
      //   Toast.clear();
      //   if (res.code == 0 && res.message != "未找到文件") {
      //     _this.avatar = res.data.uploadFilePath;
      //     let newO = _this.$store.state.login.editPersonInfoData;
      //     newO.imageUrl = res.data.uploadFilePath;
      //     _this.$store.commit("editPersonInfoData", newO);
      //   } else {
      //     //未知错误
      //     Toast(res.message)
      //   }
      // }).catch(()=>{
      //   Toast.clear();
      //   Toast('服务异常')
      // });

      //fileImg content
    },
    tapToOther(routerName, data) {
      if (data.editType == "5" && this.sfzh.length > 0) {
        Dialog({ message: "身份证一旦绑定无法修改", width: "70%" });
        return false;
      }
      this.$router.push({
        path: routerName,
        query: data
      });
    }
  },
  mounted() {
    let emptyO = {
      realName: "",
      phone: "",
      sfzh: "",
      gender: "-1",
      address: "",
      nickname: "",
      avatar: ""
    };
    let p = this.$store.state.login.personInfo
      ? this.$store.state.login.personInfo
      : emptyO;

    this.personImg = this.editPersonInfoData.imageUrl
      ? this.editPersonInfoData.imageUrl
      : p.imageUrl;

    this.avatar = this.editPersonInfoData.imageUrl
      ? this.editPersonInfoData.imageUrl
      : p.imageUrl;
    this.realName = this.editPersonInfoData.realName
      ? this.editPersonInfoData.realName
      : p.personName;
    this.gender = this.editPersonInfoData.gender
      ? this.editPersonInfoData.gender
      : p.gender;
    this.sfzh = this.editPersonInfoData.sfzh
      ? this.editPersonInfoData.sfzh
      : p.idCard;
    this.address = this.editPersonInfoData.address
      ? this.editPersonInfoData.address
      : p.liveAddress;
    this.nickname = this.editPersonInfoData.nickname
      ? this.editPersonInfoData.nickname
      : p.personOtherName;
  },
  activated() {}
};
</script>
<style lang="less">
.edit-personal-page {
  width: 100%;
  box-sizing: border-box;
  padding-left: 30px;
  margin-top: 20px;
  background-color: #ffffff;
  .p-icon {
    width: 100%;
    display: flex;
    height: 120px;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #ebebeb;
    .t {
      flex-grow: 2;
      font-size: 28px;
      color: #333333;
    }
    .van-uploader__input-wrapper {
      display: flex;
      align-items: center;
    }
    .personal-img {
      width: 80px;
      height: 80px;
      border-radius: 40px;
      overflow: hidden;
      font-size: 0;
      flex-shrink: 0;
    }
    .more {
      width: 14px;
      height: 24px;
      flex-shrink: 0;
      font-size: 0;
      padding-left: 24px;
      padding-right: 30px;
    }
  }
  .e-item {
    width: 100%;
    display: flex;
    height: 88px;
    align-items: center;
    box-shadow: 0px 1px 0px 0px #ebebeb;
    .t {
      font-size: 28px;
      flex-grow: 2;
      color: #333333;
    }
    .e-i {
      flex-grow: 3;
      font-size: 28px;
      color: #a8a8a8;
      text-align: right;
      display: flex;
      flex-direction: row-reverse;
      input {
        text-align: right;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 0;
        margin-right: 0;
      }
      input {
        &::placeholder {
          color: #aeafb2;
        }
        &:disabled {
          color: #333333;
          opacity: 1;
        }
        &[disabled] {
          color: #333333;
          opacity: 1;
        }
        background-color: #fff;
      }
    }
    .acitive {
      font-size: 28px;
      color: #333;
    }
    .e-sex {
      display: flex;
      span {
        width: 72px;
        text-align: center;
        height: 40px;
        line-height: 40px;
        background-color: #f6f6f6;
        border-radius: 8px;
        color: #a8a8a8;
        font-size: 28px;
        margin-left: 12px;
      }
      .esexacitive {
        background-color: #3ac756;
        border-radius: 8px;
        color: #fff;
      }
    }
    .more {
      width: 14px;
      height: 24px;
      flex-shrink: 0;
      font-size: 0;
      padding-left: 24px;
      
    }
    div:nth-last-child(1) {
      margin-right: 30px;
    }
  }
  .e-item:nth-last-child(1) {
    box-shadow: none;
  }
  .submit {
    width: 100%;
    box-sizing: border-box;
    padding: 30px;
    position: fixed;
    bottom: 0;
    left: 0;
    & > div {
      width: 100%;
      height: 72px;
      text-align: center;
      line-height: 72px;
      background-image: linear-gradient(
          90deg,
          #73e539 0%,
          #57d648 50%,
          #3ac756 100%
        ),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 36px;
      color: #fff;
      font-size: 32px;
    }
  }
}
</style>

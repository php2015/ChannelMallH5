<template>
  <div class="editInput-page" v-wechat-title="pageTitle">
    <div class="content-box">
      <div class="phone itme-box">
        <div class="input-box" v-show="editType=='2'">
          <div class="t">姓名</div>
          <input type="text" ref="tagInput" v-model="userName" placeholder="请填写姓名" maxlength="10" />
        </div>
        <div class="input-box" v-show="editType=='3'">
          <div class="t">昵称</div>
          <input type="text" ref="tagInput" v-model="nickName" placeholder="请填写昵称" maxlength="10" />
        </div>
        <div class="input-box" v-show="editType=='5'">
          <div class="t">身份证</div>
          <input
            type="text"
            ref="tagInput"
            v-model="identityNum"
            placeholder="请填写身份证号"
            maxlength="20"
          />
        </div>
        <div class="new-phone" v-show="editType=='6'">
          <div class="t">新手机号</div>
          <input type="tel" maxlength="11" v-model="mobile" placeholder="请填写新的手机号码" />
          <div
            class="send-code"
            :class="{diaAtive:randomCodeNumState}"
            @click.stop="sendMessageFun()"
          >{{randomContent}}</div>
          <!-- diaAtive -->
        </div>
        <div class="input-box" v-show="editType=='6'">
          <div class="t">验证码</div>
          <input type="tel" v-model="messageCode" placeholder="请填写验证码" />
        </div>

        <div class="comfirm-textArea" v-show="editType=='8'">
          <div class="t">详细地址</div>
          <van-field
            ref="tagInput"
            v-model="detailAddress"
            rows="1"
            autosize
            maxlength="40"
            type="textarea"
            placeholder="请填写详细地址"
          />
        </div>
      </div>
      <div class="itme-box"></div>
    </div>
    <div class="submit">
      <div v-if="editType=='6'" @click.stop="updatePhoneNumberFun()">保存</div>
      <div v-if="editType!='6'" @click.stop="submitO()">确定</div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Field, Toast } from "vant";
Vue.use(Field).use(Toast);
export default {
  name: "editInput",
  data() {
    return {
      pageTitle: "",
      editType: "",
      userName: "",
      nickName: "",
      identityNum: "",
      mobile: "",
      messageCode: "",
      detailAddress: "",
      randomCodeNumState: false,
      randomContent: "获取验证码",
      timer: null,
      roleId: this.$store.state.login.userId,
      count: 0,
      personInfo: this.$store.state.login.personInfo
        ? this.$store.state.login.personInfo
        : {}
    };
  },
  components: {},
  watch: {
    editType(newVal, oldVal) {
      switch (newVal) {
        case "":
          this.pageTitle = "编辑";
          break;
        case "0":
          this.pageTitle = "头像编辑";
          break;
        case "1":
          this.pageTitle = "修改头像";
          break;
        case "2":
          this.pageTitle = "修改姓名";
          this.userName = this.$route.query.realName
            ? this.$route.query.realName
            : "";
          break;
        case "3":
          this.pageTitle = "修改昵称";
          this.nickName = this.$route.query.nickname
            ? this.$route.query.nickname
            : "";
          break;
        case "4":
          this.pageTitle = "修改性别";
          break;
        case "5":
          this.pageTitle = "修改身份证号码";
          this.identityNum = this.$route.query.sfzh
            ? this.$route.query.sfzh
            : "";
          this.$refs.tagInput.focus();
          break;
        case "6":
          this.pageTitle = "修改手机号码";
          break;
        case "7":
          this.pageTitle = "修改所在地区";
          break;
        case "8":
          this.pageTitle = "修改详细地址";
          this.detailAddress = this.$route.query.address
            ? this.$route.query.address
            : "";
          this.$refs.tagInput.focus();
          break;
      }
    }
  },
  methods: {
    //发送短信验证吗
    sendMessageFun() {
      if (this.randomCodeNumState) {
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
        Toast("请输入正确的手机号");
        return false;
      }

      let _this = this;
      let params = {
        header: {},
        body: {
          codeType: 5, //换绑手机号
          phone: this.mobile
        }
      };
      this.$api.sendMesForReg(params).then(res => {
        if (res.code == 0) {
          Toast("发送成功");
          _this.timeStart();
        } else {
          //未知错误
          Toast(res.message);
        }
      });
    },
    updatePhoneNumberFun() {
      if (!/^1[3456789]\d{9}$/.test(this.mobile)) {
        Toast("请输入正确的手机号");
        return false;
      }
      if (!this.messageCode) {
        Toast("请输入验证码");
        return false;
      }
      let _this = this;
      let params = {
        header: {},
        body: {
          roleId: this.roleId,
          phonenumber: this.mobile,
          checkcode: this.messageCode
        }
      };
      this.$api.updatePhoneNumber(params).then(res => {
        if (res.code == 0) {
          Toast("手机号码修改成功");

          let newO = _this.$store.state.login.editPersonInfoData;
          newO.phone = _this.mobile;
          _this.$store.commit("editPersonInfoData", newO);

          _this.personInfo.telephone = _this.mobile;
          _this.$store.commit("personInfo", _this.personInfo);
          _this.$store.commit('phone',_this.moblie);//更新当前用户账号的手机号
          history.go(-1);
        } else {
          //未知错误
          Toast(res.message);
        }
      });
    },

    timeStart() {
      var _this = this;
      var TIME_COUNT = 60;
      if (!_this.timer) {
        _this.count = TIME_COUNT;
        _this.randomCodeNumState = true;
        _this.timer = setInterval(function() {
          if (_this.count > 0 && _this.count <= TIME_COUNT) {
            _this.count--;
            _this.randomContent = _this.count + "s后重发";
          } else {
            clearInterval(_this.timer);
            _this.timer = null;
            _this.randomContent = "获取验证码";
            _this.randomCodeNumState = false;
          }
        }, 1000);
      }
    },
    //验证身份证号码合法性
    testIdentity(val) {
      var idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (!idcardReg.test(val)) {
        //不合法身份证号码
        return false;
      }
    },
    submitO() {
      let newO = this.$store.state.login.editPersonInfoData;
       if (this.editType == "5") {
        var idcardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (!idcardReg.test(this.identityNum)) {
          //不合法身份证号码
          Toast("请输入正确身份证号");
          return false;
        }
      }
      switch (this.editType) {
        case "":
          // this.pageTitle = "编辑";
          break;
        case "0":
          //this.pageTitle = "头像编辑";
          break;
        case "1":
          // this.pageTitle = "修改头像";
          break;
        case "2":
          newO.realName = this.userName;
          this.$store.commit("editPersonInfoData", newO);
          history.go(-1);
          break;
        case "3":
          newO.nickname = this.nickName;
          this.$store.commit("editPersonInfoData", newO);
          history.go(-1);
          break;
        case "4":
          // this.pageTitle = "修改性别";
          break;
        case "5":
          newO.sfzh = this.identityNum;
          this.$store.commit("editPersonInfoData", newO);
          history.go(-1);
          break;
        case "6":
          //this.pageTitle = "修改手机号码";
          break;
        case "7":
          //this.pageTitle = "修改所在地区";
          break;
        case "8":
          newO.address = this.detailAddress;
          this.$store.commit("editPersonInfoData", newO);
          history.go(-1);
          break;
      }
    },
    tapToOther(routerName) {
      this.$router.push({
        path: routerName,
        query: {}
      });
    }
  },
  mounted() {
    this.editType = this.$route.query.editType
      ? this.$route.query.editType
      : "";
  },
  activated() {}
};
</script>
<style lang="less">
.editInput-page {
  .content-box {
    margin-top: 20px;
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    background-color: #fff;
    // & div:nth-child(1) {
    //   box-shadow: 0px 1px 0px 0px #ebebeb;
    // }
    .phone {
      width: 100%;
      .new-phone {
        width: 100%;
        padding-right: 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 88px;
        box-shadow: 0px 1px 0px 0px #ebebeb;
        .t {
          width: 110px;
          font-size: 28px;
          color: #333333;
          white-space: nowrap;
        }
        input {
          flex-grow: 2;
          height: 28px;
          font-size: 28px;
          padding: 5px 0 5px 30px;
          line-height: 28px;
          box-sizing: content-box;
          color: #333;
          &::-webkit-input-placeholder {
            color: #aeafb2;
            line-height: 38px;
          }
        }
        .send-code {
          width: 148px;
          height: 48px;
          background-color: #f2fff5;
          border-radius: 8px;
          text-align: center;
          line-height: 48px;
          font-size: 24px;
          color: #3ac756;
        }
        .diaAtive {
          background-color: #fafafa;
          color: #666666;
        }
      }
    }
    .itme-box {
      width: 100%;
      .input-box {
        width: 100%;
        padding-right: 30px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        height: 88px;
        .t {
          width: 110px;
          white-space: nowrap;
          font-size: 28px;
          color: #333333;
        }
        input {
          flex-grow: 2;
          height: 28px;
          font-size: 28px;
          padding: 15px 0 15px 30px;
          line-height: 28px;
          box-sizing: content-box;
          color: #333;
          &::-webkit-input-placeholder {
            color: #aeafb2;
            line-height: 38px;
          }
        }
      }
    }
    .comfirm-textArea {
      background: #fff;
      padding-right: 30px;
      box-sizing: border-box;
      display: flex;
      padding-top: 23px;
      padding-bottom: 23px;
      textarea {
        &::placeholder {
          font-size: 28px;
        }
      }
      .t {
        width: 110px;
        white-space: nowrap;
        font-size: 28px;
        line-height: 48px;
        color: #333333;
        padding-right: 30px;
      }
      .van-cell {
        padding: 0;
      }
    }
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

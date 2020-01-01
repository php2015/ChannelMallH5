<template>
  <div class="loginm-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="content">
      <div class="logo">
        <div class="logo-nf">
          <img src="../../assets/img/nfys_logo.png" />
        </div>
      </div>
      <div class="item-input">
        <input type="tel" v-model="moblie" maxlength="11" placeholder="请输入手机号码" />
        <div class="clear-logo" v-show="moblie" @click="moblie=''">
          <img src="../../assets/img/clear_input.png" />
        </div>
        <div
          class="sendMessage"
          :class="{hadsend:randomCodeNumState}"
          @click="timeStart()"
        >{{randomContent}}</div>
      </div>
      <div class="item-input">
        <input type="tel" v-model="codeMessage" maxlength="6" placeholder="请输入验证码" />
        <div class="clear-logo" v-show="codeMessage" @click="codeMessage=''">
          <img src="../../assets/img/clear_input.png" />
        </div>
      </div>
      <div class="buttom-box">
        <span @click="isLogin" :class="{disableC:!codeMessage||!moblie}">登录</span>
      </div>
      <div class="reset-register">
        <span @click="tapToOther('/register')">开始注册</span>
      </div>
    </div>
    <div class="other-login">
      <span @click="tapToOther('/loginBypassword')">账号密码登录</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from "vant";

export default {
  name: "loginByMessage",
  data() {
    return {
      moblie: "",
      codeMessage: "",
      randomCodeNumState: false,
      randomContent: "获取验证码",
      timer: null
    };
  },
  components: {},
  methods: {
    timeStart() {
      if (!this.moblie) {
        Toast("请填写手机号码");
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(this.moblie)) {
        Toast("请输入正确的手机号码");
        return false;
      }
      if (this.randomCodeNumState) {
        return false;
      }
      var _this = this;
      var TIME_COUNT = 60;

      this.$common.sendMesForReg("", 1, this.moblie).then(e => {
        if (e) {
          if (!_this.timer) {
            _this.count = TIME_COUNT;
            _this.timer = setInterval(function() {
              if (_this.count > 0 && _this.count <= TIME_COUNT) {
                _this.randomCodeNumState = true;
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
        }
      });
    },
    tapToOther(routerName) {
      if (routerName == "/loginBypassword") {
        this.$router.replace({
          path: routerName,
          query: {}
        });
      } else {
        this.$router.push({
          path: routerName,
          query: {}
        });
      }
    },
    isLogin() {
      if (!this.moblie) {
        Toast("请填写手机号码");
        return false;
      }
      if (!/^1[3456789]\d{9}$/.test(this.moblie)) {
        Toast("请输入正确的手机号码");
        return false;
      }
      if (!this.codeMessage) {
        Toast("请填写手机验证码");
        return false;
      }
      let params = {
        header: {},
        body: {
          mobile: this.moblie,
          code: this.codeMessage
        }
      };
      this.$api.loginByMobile(params).then(res => {
        console.log(res);
        if (res.code == 0) {
          this.$store.commit("phone", this.moblie);
          this.$store.commit("userId", res.data.userId);
          this.$store.commit("userName", res.data.userName);
          this.$store.commit("token", res.data.access_token);
          this.$common.getShopCarNum(0);
          this.$router.back();
        } else {
          Toast(res.message);
        }
      });
    }
  },
  mounted() {},
  activated() {}
};
</script>
<style lang="less">
.loginm-page {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  position: relative;
  .content {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    & .logo {
      width: 160px;
      height: 160px;
      font-size: 0;
      padding-top: 80px;
      padding-bottom: 101px;
      flex-shrink: 0;
      flex-grow: 0;
      & > .logo-nf {
        width: 160px;
        height: 160px;
        font-size: 0;
      }
    }
    & .item-input {
      width: 630px;
      height: 88px;
      background-color: #ffffff;
      box-shadow: 0px 1px 0px 0px #ebebeb;
      display: flex;
      align-items: center;
      & input {
        height: 34px;
        line-height: 34px;
        flex-grow: 2;
        color: #333;
        padding-left: 3px;
      }
      & > div:nth-child(2) {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        font-size: 0;
        padding: 10px;
        padding-right: 32px;
      }
      & div:nth-child(3) {
        flex-shrink: 0;
        padding-left: 9px;
        padding-right: 0;
        width: 137px;
        text-align: right;
        height: 44px;
        font-size: 28px;
        white-space: nowrap;
        line-height: 44px;
        color: #3ac756;
      }
      & .hadsend:nth-child(3) {
        color: #a8a8a8;
      }
    }
    & .item-input:nth-child(3) {
      padding-top: 21px;
      margin-top: 1px;
    }
    & .buttom-box {
      width: 630px;
      height: 72px;
      margin-top: 60px;
      & span {
        background-color: #3ac756;
        font-size: 32px;
        line-height: 72px;
        border-radius: 36px;
        color: #ffffff;
        width: 100%;
        display: block;
        text-align: center;
      }
      & .disableC {
        opacity: 0.5;
      }
    }
    & .reset-register {
      margin-top: 30px;
      display: flex;
      align-items: center;
      & span {
        line-height: 46px;
        padding: 0 10px;
        font-size: 28px;
        color: #333333;
      }
      & > span:nth-child(2) {
        font-size: 36px;
      }
    }
  }

  .other-login {
    width: 100%;
    height: 64px;
    text-align: center;
    font-size: 0;
    position: absolute;
    bottom: 60px;
    left: 0;
    & span {
      width: 220px;
      height: 64px;
      background-color: #fafafa;
      border-radius: 32px;
      display: inline-block;
      font-size: 28px;
      line-height: 64px;
      color: #333333;
      text-align: center;
    }
  }
}
</style>

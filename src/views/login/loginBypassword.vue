<template>
  <div class="loginp-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
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
      </div>
      <div class="item-input">
        <input :type="pwdType" v-model="password" maxlength="18" placeholder="请输入登录密码" />
        <div class="clear-logo" v-show="password" @click="password=''">
          <img src="../../assets/img/clear_input.png" />
        </div>
        <div class="eye-logo" @click="changeType()">
          <img :src="openeye" />
        </div>
      </div>
      <div class="buttom-box">
        <span @click="goLogin" :class="{disableC:!password||!moblie}">登录</span>
      </div>
      <div class="reset-register">
        <span @click="tapToOther('/reset')">忘记密码</span>
        <span>|</span>
        <span @click="tapToOther('/register')">开始注册</span>
      </div>
    </div>
    <div class="other-login">
      <span @click="tapToOther('/loginByMessage')">快捷登录</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Toast } from 'vant';

export default {
  name: "loginBypassword",
  data() {
    return {
      pwdType: "password",
      openeye: require("@/assets/img/hide_input_btn.png"),
      moblie: "",
      password: ""
    };
  },
  components: {},
  methods: {
    changeType() {
      //是否明文看密码
      this.pwdType = this.pwdType === "password" ? "text" : "password";
      this.openeye =
        this.openeye == require("@/assets/img/display_input_btn.png")
          ? require("@/assets/img/hide_input_btn.png")
          : require("@/assets/img/display_input_btn.png");
    },
    tapToOther(routerName) {
      if(routerName == '/reset' || routerName == '/register'){
        this.$router.push({
          path: routerName,
          query: {}
        });
      }else if(routerName == '/loginByMessage'){
        this.$router.replace({
        path: routerName,
        query: {}
      });
      }
      
    },
    goLogin(){
      if(!this.moblie){
        Toast('请输入手机号码')
        return false;
      }
       if (!/^1[3456789]\d{9}$/.test(this.moblie)) {
        Toast("请输入正确的手机号码");
        return false;
      }
      if(!this.password){
        Toast('请填写密码')
        return false;
      }
      let params = {
        header: {},
        body: {
          username: this.moblie,
          password: this.password,
          roleType: 1
        }
      }
      console.log(params);
      this.$api.loginByUserName(params).then(res => {
        console.log(res);
        if(res.code == 0){
          this.$store.commit('phone',this.moblie);
          this.$store.commit('userId',res.data.userId);
          this.$store.commit('userName',res.data.userName);
          this.$store.commit('token',res.data.access_token);
          this.$common.getShopCarNum(0);
          this.$router.back();
        }else{
          if (res.message=='当前手机号码不存在!') {
            Toast('该手机号码未注册');
          }else{
            Toast(res.message);
          }
        }
      })
    },
    getOpenIdAjax() {
      let params = {
        header: {},
        body: {
          code: this.$route.query.code
        }
      };
      this.$api.getSnsapiOpenId(params).then(res => {
        if (res.code == 0) {
          this.$store.commit("openId", res.data.openId);
          this.$store.commit("appId", res.data.appId);
        }
      });
    }
  },
  mounted() {
    console.log(window.location.href);
    console.log(this.$store.state.login);
    if (
      navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
      "micromessenger"
    ) {
      if (
        this.$store.state.login.openId &&
        this.$store.state.login.openId != ""
      ) {
      } else {
        if (this.$route.query.code) {
          this.getOpenIdAjax();
        }
      }
    } 
  },
  activated() {}
};
</script>
<style lang="less">
.loginp-page {
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
      & > div:nth-child(3) {
        flex-shrink: 0;
        padding-left: 8px;
        padding-right: 20px;
        width: 44px;
        height: 44px;
        font-size: 0;
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
      &>span:nth-child(2){
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

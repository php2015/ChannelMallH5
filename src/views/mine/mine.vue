<template>
  <div class="mine-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="mine-info">
      <div class="info-box">
        <div class="img-box">
          <img :src="nomalImg" />
        </div>
        <div class="name-box">
          <div class="name" @click.stop="tapToOther('/editPersonalInfo')">
            <span>{{personOtherName}}</span>
            <span>
              <img :src="enditUrl" />
            </span>
          </div>
          <div class="mobile">{{telephone}}</div>
        </div>
      </div>
      <!-- <div class="message-box" @click.stop="tapToOther('/message')">
        <div class="number">
          <span>2</span>
        </div>
        <img :src="messageUrl" />
      </div> -->
    </div>
    <!-- 订单 -->
    <div class="order-box">
      <div class="all-box">
        <span>我的订单</span>
        <span @click.stop="tapToOther('/orderList',{orderType:''})">全部订单</span>
        <span @click.stop="tapToOther('/orderList',{orderType:''})">
          <img :src="moreUrl" />
        </span>
      </div>
      <div class="order-items-box">
        <div class="item" @click.stop="tapToOther('/orderList',{orderType:0})">
          <div class="item-bg">
            <img src="../../assets/img/order_dfk_icon.png" />
          </div>
          <span>待付款</span>
          <div class="number" v-if="orderInfo&&orderInfo.waitPayNum>0">{{orderInfo.waitPayNum}}</div>
        </div>
        <div class="item" @click.stop="tapToOther('/orderList',{orderType:1})">
          <div class="item-bg">
            <img src="../../assets/img/order_dfh_icon.png" />
          </div>
          <span>待发货</span>
          <div class="number" v-if="orderInfo&&orderInfo.waitFHNum>0">{{orderInfo.waitFHNum}}</div>
        </div>
        <div class="item" @click.stop="tapToOther('/orderList',{orderType:2})">
          <div class="item-bg">
            <img src="../../assets/img/order_dsh_icon.png" />
          </div>
          <span>待收货</span>
          <div class="number" v-if="orderInfo&&orderInfo.waitSHNum>0">{{orderInfo.waitSHNum}}</div>
        </div>
        <!-- @click="tapToOther('/orderList',{orderType:6})" -->
        <!-- <div class="item" >
          <div class="item-bg">
            <img src="../../assets/img/order_dpj_icon.png" />
          </div>
          <span>待评价</span>
          <div class="number" v-if="orderInfo&&orderInfo.waitPJNum>0">{{orderInfo.waitPJNum}}</div>
        </div> -->
        <div class="item" @click.stop="jumpSaleAfterList">
          <div class="item-bg">
            <img src="../../assets/img/order_sh_icon.png" />
          </div>
          <span>售后</span>
          <div
            class="number"
            v-if="orderInfo&&orderInfo.waitRefundNum>0"
          >{{orderInfo.waitRefundNum}}</div>
        </div>
      </div>
      <!-- 最新物流信息 -->
      <div
        class="logistics-info"
        v-if="orderInfo&&orderInfo.expressNo!=''&&orderInfo.expressNo!=null"
      >
        <div
          class="logistics-info-box"
          @click.stop="tapToOther('/express',{expressNo:orderInfo.expressNo})"
        >
          <div class="laba">
            <img src="../../assets/img/notice_icon.png" />
          </div>
          <div class="info" v-html="mobileSplicFun(orderInfo.expressSchedule)"></div>
          <div class="more">
            <img src="../../assets/img/arrow_orange.png" />
          </div>
        </div>
      </div>
    </div>
    <!-- 其他 -->
    <div class="other-box">
      <div class="item" @click.stop="tapToOther('/addressList',{addressListSource: 1})">
        <div class="logo">
          <img src="../../assets/img/address_icon.png" />
        </div>
        <div class="info">地址管理</div>
        <div class="more">
          <img :src="moreUrl" />
        </div>
      </div>
      <div class="item" @click.stop="tapToOther('/aboutUs')">
        <div class="logo">
          <img src="../../assets/img/about_us_icon.png" />
        </div>
        <div class="info">关于我们</div>
        <div class="more">
          <img :src="moreUrl" />
        </div>
      </div>
    </div>
    <!-- 你喜欢 -->
    <div class="favorite-box">
      <favorite ref="favoriteRef"></favorite>
    </div>
    <div class="index-height"></div>
  </div>
</template>

<script>
import Vue from "vue";
import favorite from "../../components/mine/favorite";

export default {
  name: "mine",
  data() {
    return {
      nomalImg: require("@/assets/img/chat/default_user.png"),
      messageUrl: require("@/assets/img/notice_black_btn.png"),
      enditUrl: require("@/assets/img/edit_icon.png"),
      moreUrl: require("@/assets/img/more.png"),
      userId: this.$store.state.login.userId,
      orderInfo: null,
      personInfo: null,
      personOtherName: "未设置昵称",
      telephone: ""
    };
  },
  components: { favorite },
  methods: {
    getUserAccountInfoFun() {
      let _this = this;
      let params = {
        header: {},
        body: {
          userId: this.userId,
          roleType: "1",
          clinicId: "90000"
        }
      };
      this.$api.getUserAccountInfo(params).then(res => {
        if (res.code == 0) {
          _this.personInfo = res.data;
          _this.personOtherName =
            res.data.personOtherName.length > 0
              ? res.data.personOtherName
              : "未设置昵称";
          _this.telephone = res.data.telephone;
          if (
            res.data.imageUrl != "undefined" &&
            res.data.imageUrl != "" &&
            res.data.imageUrl != null
          ) {
            _this.nomalImg = res.data.imageUrl;
          }
          _this.$store.commit("personInfo", res.data);
        } else {
          //未知错误
        }
      });
    },
    getOrderCount() {
      let _this = this;
      let params = {
        header: {},
        body: {
          userId: this.userId
        }
      };
      this.$api.getOrderCount(params).then(res => {
        if (res.code == 0) {
          _this.orderInfo = res.data;
        } else {
          //未知错误
        }
      });
    },
    mobileSplicFun(t) {
       var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9}|0[\d]{2,3}-[\d]{7,8}|400[-]?[\d]{3}[-]?[\d]{4})/g;
     // var regx = /(1[1|2|3|4|5|6|7|8|9|0][\d]{9})/g;
      var str = t;
      var phoneNums = str.match(regx);
      if (phoneNums) {
        for (var i = 0; i < phoneNums.length; i++) {
          var temp = phoneNums[i];
          temp = "<strong>" + temp + "</strong>";
          str = str.replace(phoneNums[i], temp);
        }
      }
      return str;
    },
    tapToOther(routerName, data) {
      if (routerName == "/editPersonalInfo") {
        this.$store.commit("editPersonInfoData", {});
      }
      this.$router.push({
        path: routerName,
        query: data
      });
    },
    jumpSaleAfterList() {
      this.$router.push({
        path: "/saleAfterList",
        query: {}
      });
    },
    testwxFun(){
      
      let _this = this;
     let   wxUlr = 'https://nfys-test.kinglian.cn/ybH5/'; 
      let params = {
        header: {
          token: this.$store.state.login.token,
          time_stamp:new Date().getTime()
        },
        body: {
           url: wxUlr,
              endUrl: ''
        }
      };
      this.$api.getWXRequestUrl(params).then(res => {
        if (res.code == 0) {
          
        } else {
          //未知错误
        }
      });
    }
  },
  mounted() {
    this.getUserAccountInfoFun();
    this.testwxFun()
  },
  computed: {
			changeUser() {
				return this.$store.state.login.phone;
			},
  },
  watch: {
			changeUser(phone) {
				if (phone!=''&&phone!=null&&phone!='undefined'&&phone!=this.telephone) {
           this.nomalImg = require("@/assets/img/chat/default_user.png");
          this.getUserAccountInfoFun();
				}
			},
		},
  activated() {
    this.getOrderCount();
    this.$refs.favoriteRef.isAjaxFun();
    if (this.$store.state.login.personInfo) {
      this.personOtherName =this.$store.state.login.personInfo.personOtherName.length > 0? this.$store.state.login.personInfo.personOtherName: "未设置昵称";
      this.telephone =this.$store.state.login.personInfo.telephone;
      if (
            this.$store.state.login.personInfo.imageUrl != "undefined" &&
            this.$store.state.login.personInfo.imageUrl != "" &&
            this.$store.state.login.personInfo.imageUrl != null
          ) {
         this.nomalImg =this.$store.state.login.personInfo.imageUrl;
      }
     
    }
  }
};
</script>
<style lang="less">
.mine-page {
  width: 100%;
  .index-height {
    height: 118px;
  }
  .mine-info {
    width: 100%;
    background-color: #fff;
    height: 176px;
    position: relative;
    .message-box {
      width: 56px;
      height: 56px;
      position: absolute;
      right: 29px;
      top: 20px;
      .number {
        width: 28px;
        height: 28px;
        background-color: #ffffff;
        border: solid 2px #ff6f26;
        box-sizing: border-box;
        text-align: center;
        border-radius: 14px;
        position: absolute;
        top: -8px;
        right: -8px;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 20px;
          color: #ff6f26;
        }
      }
    }
    .info-box {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      .img-box {
        width: 96px;
        height: 96px;
        flex-shrink: 0;
        border-radius: 48px;
        margin-left: 30px;
        overflow: hidden;
      }
      .name-box {
        width: 100%;
        padding-left: 20px;
        .name {
          width: 100%;
          font-size: 0;

          line-height: 1;
          display: flex;
          align-items: flex-end;
          span:nth-child(1) {
            font-size: 32px;
            color: #333333;
          }
          span:nth-child(2) {
            width: 32px;
            height: 32px;
          }
        }
        .mobile {
          font-size: 28px;
          color: #666666;
          line-height: 1;
          padding-top: 19px;
        }
      }
    }
  }
  .order-box {
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    padding: 40px 0;
    .all-box {
      width: 100%;
      box-sizing: border-box;
      padding: 0 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      span:nth-child(1) {
        flex-grow: 2;
        font-size: 32px;
        color: #333333;
      }
      span:nth-child(2) {
        font-size: 28px;
        color: #a8a8a8;
        padding-right: 10px;
      }
      span:nth-child(3) {
        font-size: 0;
        width: 14px;
        height: 24px;
      }
    }
    .order-items-box {
      width: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-top: 39px;
      .item {
        display: flex;
        width: 80px;
        flex-direction: column;
        align-items: center;
        position: relative;
        font-size: 0;
        .item-bg {
          width: 44px;
          height: 44px;
        }
        span {
          font-size: 24px;
          line-height: 1;
          padding-top: 16px;
          color: #333333;
        }
        .number {
          width: 28px;
          height: 28px;
          background-color: #ffffff;
          border: solid 2px #ff6f26;
          line-height: 26px;
          box-sizing: border-box;
          font-size: 20px;
          text-align: center;
          border-radius: 14px;
          color: #ff6f26;
          position: absolute;
          top: -13px;
          right: 10px;
        }
      }
    }
    .logistics-info {
      width: 100%;
      box-sizing: border-box;
      padding: 40px 30px 0;

      .logistics-info-box {
        width: 100%;
        background-color: #fff9f5;
        border-radius: 12px;
        display: flex;
        align-items: center;
        .laba {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          padding-left: 20px;
          padding-right: 20px;
          font-size: 0;
        }
        .info {
          flex-grow: 2;
          font-size: 24px;
          color: #333333;
          line-height: 36px;
          padding: 14px 0;
          word-break: break-all;
          & > strong {
                font-weight: normal;
                color: #ff6f26;
          }
        }
        .more {
          width: 14px;
          height: 24px;
          flex-shrink: 0;
          font-size: 0;
          padding-left: 20px;
          padding-right: 20px;
        }
      }
    }
  }
  .other-box {
    width: 100%;
    box-sizing: border-box;
    padding-left: 30px;
    background-color: #ffffff;
    margin-top: 20px;
    .item {
      width: 100%;
      height: 88px;
      display: flex;
      align-items: center;
      .logo {
        width: 32px;
        height: 32px;
        padding-right: 20px;
        font-size: 0;
      }
      .info {
        flex-grow: 2;
        font-size: 28px;
        color: #333333;
        line-height: 36px;
        padding: 14px 0;
      }
      .more {
        width: 14px;
        height: 24px;
        flex-shrink: 0;
        font-size: 0;
        padding-left: 20px;
        padding-right: 30px;
      }
    }
    .item:nth-child(1) {
      box-shadow: 0px 1px 0px 0px #ebebeb;
    }
  }
  .favorite-box {
    width: 100%;
  }
}
</style>

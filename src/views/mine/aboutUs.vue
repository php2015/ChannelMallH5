<template>
  <div class="about-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="header-box">
      <div class="big-box">
        <div class="logo-nf">
          <img src="../../assets/img/nfys_logo.png" />
        </div>
        <span>南风医生</span>
        <span>当前版本：V1.0.01</span>
      </div>
    </div>
    <div class="other-info">
      <span>公司网址：www.yxjweb.com</span>
      <span>客服热线：400-1118-120</span>
      <span>客服邮箱：kf@nfdoctor.cn</span>
      <span>银川市食品药监局投诉电话：0951-12331</span>
      <span>银川市卫生监督所投诉电话：0951-12345</span>
    </div>
  </div>
</template>


<style lang="less">
.about-page {
  width: 100%;
  background-color: #ffffff;
  .header-box {
    width: 100%;
    height: 432px;
    box-sizing: border-box;
    padding: 0 30px;
    .big-box {
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #ebebeb;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .logo-nf {
        width: 160px;
        height: 160px;
        font-size: 0;
        flex-shrink: 0;
      }
      & span {
        font-size: 32px;
        font-weight: 600;
        line-height: 1;
        padding-top: 32px;
        color: #333333;
      }
      & span:nth-last-child(1) {
        font-size: 28px;
        padding-top: 22px;
        line-height: 1;
        color: #a8a8a8;
      }
    }
  }
  .other-info {
    width: 100%;
    box-sizing: border-box;
    padding: 40px 30px 60px;
    & span {
      display: block;
      font-size: 28px;
      line-height: 48px;
      letter-spacing: 0px;
      color: #333333;
    }
  }
}
</style>

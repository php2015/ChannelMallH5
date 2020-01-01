<template>
  <div class="patientContentBox">
    <!-- <van-nav-bar title="正在问诊" left-arrow @click-left="onClickLeft" /> -->
    <div>
      <img src="https://nfys-static.kinglian.cn/xcx/chat/patientBgImg.png" class="bgImg" />
      <img
        :src="patientObj.patientImgPath?patientObj.patientImgPath:'https://nfys-static.kinglian.cn/xcx/personalCenter/user.png'"
        class="patientImg"
      />
      <div class="patientContent">
        <div class="patientDetails">
          <span class="patientName">{{patientObj.patientName}}</span>
          <span class="patientAge">
            <span v-if="patientObj.patientGender">{{patientObj.patientGender}}/</span>
            <span v-if="patientObj.ageText">{{patientObj.ageText}}岁</span>
          </span>
        </div>
        <div class="patientCell">
          <span class="cellTitle">病情描述</span>
          <span class="cellContent">{{patientObj.healthInfo}}</span>
        </div>
        <div class="patientCell">
          <span class="cellTitle">患病时长</span>
          <span class="cellContent">{{patientObj.sickTime}}</span>
        </div>
        <div class="patientCell">
          <span class="cellTitle">既往病史</span>
          <span class="cellContent">{{patientObj.anamnesis}}</span>
        </div>
        <div class="patientCell">
          <span class="cellTitle">过敏史</span>
          <span class="cellContent">{{patientObj.allergy}}</span>
        </div>
        <div class="patientCell">
          <span class="cellTitle">家族史</span>
          <span class="cellContent">{{patientObj.familyGen}}</span>
        </div>
        <div class="patientInfoImg">
          <div
            class="patientImgBox"
            v-if="patientObj.listImageUrl"
            v-for="(item, index) in patientObj.listImageUrl"
          >
            <img :src="item" :key="index" @click="priewImg(index,item)" style="border-radius:4px"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
export default {
  data() {
    return {
      orderId: "",
      patientObj: {
        patientImgPath: "",
        ageText: "",
        patientName: "",
        patientGender: "",
        healthInfo: "",
        listImageUrl: [],
        familyGen: "无",
        sickTime: "",
        anamnesis: "无",
        allergy: "无"
      },
      show: false,
      index: 0
    };
  },
  components: {
    ImagePreview
  },
  mounted() {
    if (this.$route.params) {
      this.orderId = this.$route.params.orderId;
      this.visitPatientDetail();
    }
  },
  methods: {
    visitPatientDetail() {
      let params = {
        body: {
          orderId: this.orderId
          // orderId: "dba5e88df9164aaf964603edb050f218"
        }
      };
      this.$api
        .visitPatientDetail(params)
        .then(res => {
          if (res.code == 0) {
            this.patientObj = res.data;
            console.log(this.patientObj);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onClickLeft() {
      //返回订单详情页
      this.$router.back();
    },
    priewImg(index, item) {
      ImagePreview({
        images: this.patientObj.listImageUrl,
        startPosition: index
      });
    }
  }
};
</script>
<style scoped>
.patientContentBox .van-nav-bar__title {
  font-size: 36px;
}
.patientContentBox .van-nav-bar .van-icon {
  color: #333;
}

.bgImg {
  width: 100%;
  height: 231px;
}
.patientImg {
  width: 96px;
  height: 96px;
  border-radius: 48px;
  position: absolute;
  left: 327px;
  top: 127px;
  z-index: 999;
}
.patientContent {
  width: 690px;
  height: 1057px;
  background-color: #fff;
  border-radius: 8px;
  position: absolute;
  top: 175px;
  left: 30px;
  padding-top: 38px;
}
.patientDetails {
  margin-top: 35px;
  text-align: center;
  line-height: 70px;
}
.patientName {
  font-size: 36px;
  font-weight: bold;
  margin-right: 14px;
}
.patientAge {
  font-size: 24px;
}
.patientCell text {
  display: inline-block;
}
.patientCell {
  border-top: 1px solid #ebebeb;
  margin: 0 23px;
  padding: 28px 0;
}
.cellTitle {
  width: 130px;
  color: #666666;
  vertical-align: top;
}
.cellContent {
  width: 480px;
  margin-left: 34px;
  line-height: 36px;
}
.patientInfoImg {
  margin: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.patientImgBox {
  width: 145px;
  height: 145px;
}
</style>

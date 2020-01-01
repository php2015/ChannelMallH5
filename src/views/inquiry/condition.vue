<template>
  <div class="condition" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="condition-step">
      <span>第一步，填写用药人信息</span>
      <span class="next">
        <img :src="next" alt />
      </span>
      <span>第二步，填写病情描述</span>
    </div>
    <div class="condition-step-wrap">
      <!-- <div class="condition-step-floor1">
        <div class="condition-floor1-title">1、请确认线下医院已确诊的疾病</div>
        <div class="condition-floor1-ipt">
          <input type="text" v-model="submitParams.diagnose" />
        </div>
        <div class="condition-floor1-tip">
          <span
            v-for="(item,index) in mainSuitTampAttr"
            :key="index"
            v-text="item.name"
            @click="chooseMainSuit(index)"
            :class="{'active': item.flag == true}"
          ></span>
        </div>
      </div> -->
      <div class="condition-step-floor2">
        <div class="condition-floor2-title">1、您目前哪里不舒服</div>
        <div class="condition-floor2-ipt">
          <textarea autoHeight="true" maxlength="200" v-model="submitParams.mainSuit" placeholder="请详细描述您的病情、病症，以便医生更好的为您诊断"></textarea>
          <span>{{submitParams.mainSuit.length}}/200</span>
        </div>
      </div>
      <div class="condition-step-floor3">
        <div class="condition-floor3-title">2、请选择患病时长</div>
        <div class="condition-floor3-tip">
          <span
            v-for="(item,index) in illnessDurationArr"
            @click="illnessDurationArrChoose(index)"
            :key="index"
            v-text="item"
            :class="{'condition-tip-active': illnessDurationIndex == index}"
          ></span>
        </div>
      </div>
      <div class="condition-step-floor4">
        <div class="condition-floor4-title">3、请选择过敏史及异常反应情况</div>
        <!-- <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>请选择既往病史？</div>
            <div>
              <span
                v-for="(item,index) in medicalHistoryArr"
                @click="medicalHistoryArrChoose(index)"
                :key="index"
                v-text="item.name"
                :class="{'condition-tip-active': item.flag}"
              ></span>
            </div>
          </div>
          <div class="condition-floor1-ipt" v-if="medicalHistoryShow">
            <input type="text" @blur="medicalHistoryBlur" v-model="medicalHistoryInput" />
          </div>
        </div> -->
        <!-- <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>请选择过敏史？</div>
            <div>
              <span
                v-for="(item,index) in allergyArr"
                @click="allergyArrChoose(index)"
                :key="index"
                v-text="item.name"
                :class="{'condition-tip-active': item.flag}"
              ></span>
            </div>
          </div>
          <div class="condition-floor1-ipt" v-if="allergyShow">
            <input type="text" @blur="allergyBlur" v-model="allergyInput" />
          </div>
        </div> -->
        <!-- <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>是否有家族史？</div>
            <div>
              <span
                v-for="(item,index) in familyMedicalHistoryArr"
                @click="familyMedicalHistoryArrChoose(index)"
                :key="index"
                v-text="item.name"
                :class="{'condition-tip-active': item.flag}"
              ></span>
            </div>
          </div>
          <div class="condition-floor1-ipt" v-if="familyMedicalHistoryShow == 1">
            <input type="text" @blur="familyMedicalHistoryBlur" v-model="familyMedicalHistoryInput" />
          </div>
        </div> -->
        <!-- <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>上次用药是否出现过异常反应？</div>
            <div>
              <span
                v-for="(item,index) in ycArr"
                @click="ycArrChoose(index)"
                :key="index"
                v-text="item"
                :class="{'condition-tip-active': ycArrIndex == index}"
              ></span>
            </div>
          </div>
        </div> -->
        <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>您有过敏史吗？</div>
            <div>
              <span
                v-for="(item,index) in allergyArr"
                @click="allergyArrChoose(index)"
                :key="index"
                v-text="item.name"
                :class="{'condition-tip-active': item.flag}"
              ></span>
            </div>
          </div>
          <div class="condition-floor1-ipt" v-if="allergyShow">
            <input type="text" @blur="allergyBlur" v-model="allergyInput" />
          </div>
        </div>
        <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>您是否有过手术、放化疗等重大疾病治疗或慢病史？</div>
            <div>
              <span
                v-for="(item,index) in ycArr"
                @click="ycArrChoose(index)"
                :key="index"
                v-text="item"
                :class="{'condition-tip-active': ycArrIndex == index}"
              ></span>
            </div>
          </div>
        </div>
        <div
          class="condition-step-item"
          v-if="$route.query.sex == 2  && $route.query.age > 15 && $route.query.age < 50"
        >
          <div class="condition-floor4-tip">
            <div>您当前是否怀孕或哺乳期？</div>
            <div>
              <span
                v-for="(item,index) in buruArr"
                @click="buruArrChoose(index)"
                :key="index"
                v-text="item"
                :class="{'condition-tip-active': buruArrIndex == index}"
              ></span>
            </div>
          </div>
        </div>
        <!-- <div class="condition-step-item">
          <div class="condition-floor4-tip">
            <div>肝肾功能是否不正常</div>
            <div>
              <span
                v-for="(item,index) in ggnArr"
                @click="ggnArrChoose(index)"
                :key="index"
                v-text="item"
                :class="{'condition-tip-active': ggnArrIndex == index}"
              ></span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="condition-pic">
      <div class="condition-pic-word">
        <div>请上传相关就诊资料（病例、检验检查）</div>
        <div>以便医生更准确的为您确诊</div>
      </div>
      <div class="condition-pic-wrap">
        <van-uploader
          v-model="fileList"
          multiple
          :after-read="afterRead"
          @delete="canncel"
          :max-count="5"
        />
      </div>
    </div>
    <div class="condition-fixed-height"></div>
    <div class="condition-fixed">
      <span @click="isSubmit">提交</span>
    </div>
  </div>
</template>
<script>
import next from "@/assets/img/next.png";
import delete_icon from "@/assets/img/delete.png";
import add_pic from "@/assets/img/add_pic.png";
import Vue from "vue";
import { Toast, Lazyload, Uploader, Dialog } from "vant";
Vue.use(Toast)
  .use(Lazyload)
  .use(Uploader)
  .use(Dialog);

export default {
  name: "condition",
  data() {
    return {
      next,
      delete_icon,
      add_pic,
      illnessDurationArr: ["一周内", "一月内", "半年内", "大于半年"],
      illnessDurationIndex: 0,
      medicalHistoryArr: [
        { name: "无", flag: true },
        { name: "高血压", flag: false },
        { name: "糖尿病", flag: false },
        { name: "其他", flag: false }
      ],
      medicalHistoryIndex: 0,
      medicalHistoryShow: false,
      medicalHistoryInput: "",
      allergyArr: [
        { name: "否", flag: true },
        { name: "是", flag: false }
        // { name: "无", flag: true },
        // { name: "青霉素", flag: false },
        // { name: "氯霉素", flag: false },
        // { name: "其他", flag: false }
      ],
      allergyArrIndex: 0,
      allergyShow: false,
      allergyInput: "",
      familyMedicalHistoryArr: [
        { name: "否", flag: true },
        { name: "是", flag: false }
      ],
      familyMedicalHistoryArrIndex: 0,
      familyMedicalHistoryShow: false,
      familyMedicalHistoryInput: "",
      ycArr: ["否", "是"],
      ycArrIndex: 0,
      buruArr: ["否", "是"],
      buruArrIndex: 0,
      ggnArr: ["否", "是"],
      ggnArrIndex: 0,
      fileList: [],
      submitParams: {
        allergy: "", //过敏史
        diagnose: "", //诊断
        familyMedicalHistory: "", //家庭病史
        illnessDuration: "一周内", //患病时长
        inquiryImgList: [],
        inquiryType: "9", //问诊类型
        isPatientDiagnose: "0", //是否是用户手动编辑的诊断，0否1是
        mainSuit: "", //主诉
        medicalHistory: "", //疾病史
        patientAge: this.$route.query.age,
        patientGender: this.$route.query.sex,
        patientId: this.$route.query.patientId, //就诊人id
        patientName: this.$route.query.name
      },
      mainSuitTampAttr: [],
      patientXian: []
    };
  },
  watch: {
    medicalHistoryInput(val) {
      this.me;
    }
  },
  methods: {
    queryRxDrugs() {
      let params = {};
    },
    chooseMainSuit(i) {
      // console.log(this.mainSuitTampAttr[i].name);
      this.mainSuitTampAttr[i].flag = this.mainSuitTampAttr[i].flag
        ? false
        : true;
      // console.log(this.mainSuitTampAttr);
      this.mainSuitTampAttr = JSON.parse(JSON.stringify(this.mainSuitTampAttr));
      if (this.mainSuitTampAttr[i].flag) {
        this.submitParams.diagnose += this.mainSuitTampAttr[i].name;
      }
    },
    //患病时长
    illnessDurationArrChoose(index) {
      // console.log(index);
      this.illnessDurationIndex = index;
      this.submitParams.illnessDuration = this.illnessDurationArr[
        this.illnessDurationIndex
      ];
    },
    medicalHistoryArrChoose(index) {
      this.medicalHistoryArr[index].flag = this.medicalHistoryArr[index].flag
        ? false
        : true;
      if (this.medicalHistoryArr[index].flag) {
        if (index == 0) {
          this.medicalHistoryShow = false;
          this.medicalHistoryArr[1].flag = false;
          this.medicalHistoryArr[2].flag = false;
          this.medicalHistoryArr[3].flag = false;
          this.medicalHistoryInput = "";
        } else {
          this.medicalHistoryArr[0].flag = false;
          this.medicalHistoryArr[index].flag = true;
          if (index == 3) {
            this.medicalHistoryShow = true;
          }
        }
      } else {
        if (index == 3) {
          this.medicalHistoryShow = false;
          this.medicalHistoryInput = "";
        }
      }
      this.getMedicalHistory();
    },
    //获取既往病史
    getMedicalHistory() {
      let medicalHistory = "";
      for (let i in this.medicalHistoryArr) {
        if (i != 3) {
          if (this.medicalHistoryArr[i].flag == true) {
            medicalHistory += this.medicalHistoryArr[i].name;
          }
        }
      }
      medicalHistory += this.medicalHistoryInput;
      this.submitParams.medicalHistory = medicalHistory;
      // console.log(this.submitParams.medicalHistory);
    },
    medicalHistoryBlur() {
      this.getMedicalHistory();
    },
    allergyArrChoose(index) {
      this.allergyArr[index].flag = this.allergyArr[index].flag ? false : true;
      if (this.allergyArr[index].flag) {
        if (index == 0) {
          this.allergyShow = false;
          this.allergyArr[1].flag = false;
          this.allergyArr[2].flag = false;
          this.allergyArr[3].flag = false;
          this.allergyInput = "";
        } else {
          this.allergyArr[0].flag = false;
          this.allergyArr[index].flag = true;
          if (index == 3) {
            this.allergyShow = true;
          }
        }
      } else {
        if (index == 3) {
          this.allergyShow = false;
          this.allergyInput = "";
        }
      }
      this.getAllergy();
    },
    //获取既往病史
    getAllergy() {
      let allergy = "";
      for (let i in this.allergyArr) {
        if (i != 3) {
          if (this.allergyArr[i].flag == true) {
            allergy += this.allergyArr[i].name;
          }
        }
      }
      allergy += this.allergyInput;
      this.submitParams.allergy = allergy;
      // console.log(this.submitParams.allergy);
    },
    allergyBlur() {
      this.getAllergy();
    },
    familyMedicalHistoryArrChoose(index) {
      this.familyMedicalHistoryArr[index].flag = this.familyMedicalHistoryArr[
        index
      ].flag
        ? false
        : true;
      if (this.familyMedicalHistoryArr[index].flag) {
        if (index == 0) {
          this.familyMedicalHistoryShow = false;
          this.familyMedicalHistoryArr[1].flag = false;
          this.familyMedicalHistoryInput = "";
        } else {
          this.familyMedicalHistoryArr[0].flag = false;
          this.familyMedicalHistoryArr[index].flag = true;
          if (index == 1) {
            this.familyMedicalHistoryShow = true;
          }
        }
      } else {
        if (index == 1) {
          this.familyMedicalHistoryShow = false;
          this.familyMedicalHistoryInput = "";
        }
      }
      this.getFamilyMedicalHistory();
    },
    //获取既往病史
    getFamilyMedicalHistory() {
      let familyMedicalHistory = "";
      for (let i in this.familyMedicalHistoryArr) {
        if (i != 1) {
          if (this.familyMedicalHistoryArr[i].flag == true) {
            familyMedicalHistory += this.familyMedicalHistoryArr[i].name;
          }
        }
      }
      familyMedicalHistory += this.familyMedicalHistoryInput;
      this.submitParams.familyMedicalHistory = familyMedicalHistory;
    },
    familyMedicalHistoryBlur() {
      this.getFamilyMedicalHistory();
    },
    ycArrChoose(index) {
      this.ycArrIndex = index;
      var submitParams = this.submitParams
      submitParams.medicalHistory = this.ycArr[index];
      this.submitParams = JSON.parse(JSON.stringify(submitParams));
    },
    buruArrChoose(index) {
      this.buruArrIndex = index;
    },
    ggnArrChoose(index) {
      this.ggnArrIndex = index;
    },
    isSubmit() {
      // if (!this.submitParams.diagnose) {
      //   Toast("请填写线下医院已确诊的疾病");
      //   return false;
      // }
      if (!this.submitParams.mainSuit) {
        Toast("请填写目前哪里不舒服");
        return false;
      }
      // if (this.ycArrIndex == 1) {
      //   Toast("互联网医院暂不能提供用药异常患者开处方");
      //   return false;
      // }
      // if (this.buruArrIndex == 1) {
      //   Toast("互联网医院暂不能提供孕、哺乳期患者开处方");
      //   return false;
      // }
      // if (this.ggnArrIndex == 1) {
      //   Toast("互联网医院暂不能提供肝肾功能不正常者开处方");
      //   return false;
      // }
      this.xianFunc();
    },
    afterRead(file) {
      if (!file.length) {
        this.uploadFileFunc(file,Number(this.submitParams.inquiryImgList.length));
      } else {
        for (let i in file) {
          this.uploadFileFunc(file[i],Number(this.submitParams.inquiryImgList.length)+Number(i));
        }
      }
    },
    uploadFileFunc(file,index) {
      this.$uploadImg(file.file).then(o => {
        if (o.code == "0") {
          let avatar = o.url;
          this.submitParams.inquiryImgList[index]=avatar;
        }
      });

    //   console.log(file);
    //   let formData = new FormData();
    //   formData.append("file", file.file);
    //   console.log(file.file);
    //   Toast.loading();
    //   this.$api.chatImgUpload(formData).then(res => {
    //     if (res.code == 0 && res.message != "未找到文件") {
    //       Toast.clear();
    //       let avatar = res.data.uploadFilePath;
    //       this.submitParams.inquiryImgList.push(avatar);
    //     }
    //   });
    },
    canncel(e, detail) {
      this.submitParams.inquiryImgList.splice(detail.index, 1);
    },
    queryRxDrugs(channelCommIds) {
      let params = {
        header: {},
        body: {
          channelCommIds
        }
      };
      this.$api.queryRxDrugs(params).then(res => {
        // console.log(res);
        if (res.code == 0) {
          let patientXianTamp = res.data;
          this.patientXian = patientXianTamp;
          let mainSuit = [];
          for (let i in patientXianTamp) {
            if (patientXianTamp[i].preCheck) {
              for (let j in patientXianTamp[i].preCheck.preCheckDiaList) {
                if (patientXianTamp[i].preCheck.preCheckDiaList[j].mainSuit) {
                  mainSuit.push(
                    patientXianTamp[i].preCheck.preCheckDiaList[j].mainSuit
                  );
                }
              }
            }
          }
          let mainSuitTamp = Array.from(new Set(mainSuit));
          let mainSuitTampAttr = [];
          for (let k in mainSuitTamp) {
            let mainSuitTampAttrObje = {
              name: mainSuitTamp[k],
              flag: false
            };
            mainSuitTampAttr.push(mainSuitTampAttrObje);
          }
          this.mainSuitTampAttr = mainSuitTampAttr;
        }
      });
    },
    xianFunc() {
      let that = this;
      let age = this.$route.query.age;
      let sex = this.$route.query.sex;
      let drugNameAge = [];
      let drugNameSex = [];
      let patientXian = this.patientXian;
      if (patientXian.length > 0) {
        for (let i in patientXian) {
          let ageFlag = false;
          let sexFlag = false;
          let sexXian = [];
          if (patientXian[i].preCheck) {
            for (let k in patientXian[i].preCheck.preCheckDiaList) {
              //年龄
              if (
                age > patientXian[i].preCheck.preCheckDiaList[k].maxAge ||
                age < patientXian[i].preCheck.preCheckDiaList[k].minAge
              )
                ageFlag = false;
              else ageFlag = true;
              //性别
              sexXian.push(patientXian[i].preCheck.preCheckDiaList[k].sex);
            }
            //console.log('数组：'+ sexXian);
            if (
              sexXian.indexOf(3) != -1 ||
              sexXian.indexOf(parseInt(sex)) != -1
            )
              sexFlag = true;
            else sexFlag = false;

            if (!ageFlag) drugNameAge.push(patientXian[i].preCheck.apDrugName);
            if (!sexFlag) drugNameSex.push(patientXian[i].preCheck.apDrugName);
          }
        }
        this.submitParams.medicalHistory = this.submitParams.medicalHistory
          ? this.submitParams.medicalHistory
          : "否";
        // this.submitParams.medicalHistory = this.submitParams.medicalHistory
        //   ? this.medicalHistoryInput
        //   : "无";
        this.submitParams.allergy = this.submitParams.allergy
          ? this.allergyInput
          : "无";
        this.submitParams.familyMedicalHistory = this.submitParams
          .familyMedicalHistory
          ? this.familyMedicalHistoryInput
          : "否";
        console.log(this.submitParams);

        //年龄判断
        let drugNameAgeTamp = Array.from(new Set(drugNameAge));
        if (drugNameAgeTamp.length > 0) {
          Dialog.confirm({
            title: "提示",
            message: `用药人的年龄与${drugNameAgeTamp.toString()}药品的使用年龄不一致，确认继续购买？`
          })
            .then(() => {
              that.$store.commit("patientInfo", this.submitParams);
              that.$router.go(-2);
            })
            .catch(() => {
              // on cancel
            });
          return false;
        }

        //性别判断
        let drugNameSexTamp = Array.from(new Set(drugNameSex));
        if (drugNameSexTamp.length > 0) {
          Dialog.confirm({
            title: "提示",
            message: `用药人的性别与${drugNameSexTamp.toString()}药品的使用性别不一致，确认继续购买？`
          })
            .then(() => {
              // on confirm
              that.$store.commit("patientInfo", this.submitParams);
              that.$router.go(-2);
            })
            .catch(() => {
              // on cancel
            });
          return false;
        }

        that.$store.commit("patientInfo", this.submitParams);
        that.$router.go(-2);
      }
    }
  },
  mounted() {
    let ids = [];
    for (let i in this.$store.state.orderConfirm.comList) {
      ids.push(this.$store.state.orderConfirm.comList[i].channelCommId);
    }
    this.queryRxDrugs(ids);
  }
};
</script>
<style lang="less">
.condition {
  .condition-step {
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: inline-block;
      line-height: 72px;
      &:last-child {
        color: #3ac756;
      }
      &.next {
        display: inline-block;
        width: 24px;
        margin: 0 14px;
      }
    }
  }
  .condition-step-wrap {
    background: #fff;
    padding: 0 30px;
    .condition-step-floor1 {
      .condition-floor1-title {
        padding-top: 35px;
        font-weight: 600;
      }
      .condition-floor1-ipt {
        background-color: #f6f8fa;
        border-radius: 8px;
        padding: 15px 22px;
        margin-top: 24px;
        input {
          width: 100%;
          background-color: #f6f8fa;
        }
      }
      .condition-floor1-tip {
        span {
          display: inline-block;
          border-radius: 8px;
          border: 2px solid #ebebeb;
          padding: 9px 17px;
          color: #aeafb2;
          margin: 20px 20px 20px 0;
        }
        .active {
          border: 2px solid #3ac756;
          color: #3ac756;
        }
      }
    }
    .condition-step-floor2 {
      .condition-floor2-title {
        padding-top: 35px;
        font-weight: 600;
      }
      .condition-floor2-ipt {
        background-color: #f6f8fa;
        border-radius: 8px;
        padding: 15px 22px;
        margin-top: 24px;
        textarea {
          width: 100%;
          height: 150px;
          line-height: 1.2;
          background-color: #f6f8fa;
          font-family: "Microsoft yahei";
          border: none;
          outline: none;
        }
        span {
          display: block;
          text-align: right;
          padding-bottom: 8px;
          color: #999999;
        }
      }
    }
    .condition-step-floor3 {
      .condition-floor3-title {
        padding-top: 35px;
        font-weight: 600;
      }
      .condition-floor3-tip {
        span {
          display: inline-block;
          border-radius: 8px;
          border: 2px solid #ebebeb;
          padding: 9px 13px;
          color: #aeafb2;
          margin: 20px 20px 20px 0;
          &.condition-tip-active {
            border: 2px solid #3ac756;
            color: #3ac756;
          }
        }
      }
    }
    .condition-step-floor4 {
      border-bottom: 2px solid #ebebeb;
      padding-bottom: 30px;
      .condition-floor4-title {
        padding-top: 35px;
        font-weight: 600;
        // padding-bottom: 32px;
      }
      .condition-step-item {
        margin-top: 30px;
        .condition-floor4-tip {
          display: flex;
          align-items: center;
          div {
            &:first-child {
              flex-shrink: 0;
              width: 520px;
              line-height:1.3;
            }
            &:last-child {
              flex-grow: 2;
              display: flex;
              justify-content: flex-end;
              span {
                display: block;
                border-radius: 8px;
                border: 2px solid #ebebeb;
                padding: 9px 13px;
                color: #aeafb2;
                margin-right: 19px;
                &.condition-tip-active {
                  border: 2px solid #3ac756;
                  color: #3ac756;
                }
                &:last-child {
                  margin-right: 0;
                }
              }
            }
          }
        }
        .condition-floor1-ipt {
          background-color: #f6f8fa;
          border-radius: 8px;
          padding: 15px 22px;
          margin-top: 24px;
          input {
            width: 100%;
            background-color: #f6f8fa;
          }
        }
      }
    }
  }
  .condition-pic {
    padding: 0 30px;
    background: #fff;
    .condition-pic-word {
      padding-top: 25px;
      color: #666666;
      font-size: 24px;
      div {
        line-height: 43px;
      }
    }
    .condition-pic-wrap {
      background: #fff;
      display: flex;
      flex-wrap: wrap;
      padding: 32px 0;
      .condition-pic-item {
        width: 144px;
        height: 144px;
        border-radius: 8px;
        position: relative;
        margin-right: 23px;
        img {
          &:last-child {
            position: absolute;
            top: -24px;
            left: -24px;
            width: 32px;
            height: 32px;
            z-index: 1;
            padding: 8px;
          }
        }
      }
      .condition-pic-add {
        width: 144px;
        height: 144px;
      }
    }
  }
  .condition-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 112px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    span {
      width: 600px;
      height: 80px;
      background-image: linear-gradient(90deg, #73e539 0%, #3ac756 100%),
        linear-gradient(#ff6e26, #ff6e26);
      background-blend-mode: normal, normal;
      border-radius: 40px;
      text-align: center;
      line-height: 80px;
      color: #fff;
    }
  }
  .condition-fixed-height {
    height: 132px;
  }
}
</style>
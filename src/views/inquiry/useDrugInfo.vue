<template>
    <div class="useDrugInfo" v-wechat-title="$route.meta.title"  img-set="./static/img/favicon.ico">
        <div class="useDrugInfo-step">
            <span>第一步，填写用药人信息</span>
            <span class="next"><img :src="next" alt=""></span>
            <span>第二步，填写病情描述</span>
        </div>
        <div class="useDrugInfo-people" v-if="memberList.length > 0">
            <div v-for="(item,index) in memberList" :key="index" v-show="item.show">
                 <div @click="choosePeople(index)"  :class="{'useDrugInfo-people-item': true, 'active': peopleFlag == index}">
                    <div v-text="item.patientName"></div>
                    <span>{{item.sex == 0 ? '男' : '女' }} {{item.memberAge}}岁</span>
                </div>  
            </div>
           <div @click="addPeople()" v-if="addFlag > 0" class="useDrugInfo-people-item useDrugInfo-people-add">
                <div><img src="../../assets/img/add.png" alt=""></div>
                <span>添加患者</span>
            </div>
        </div>
        <div class="useDrugInfo-msg" v-if="memberList.length > 0">
            <div class="useDrugInfo-msg-item">
                <p class="name">身份证号</p>
                <span class="star">*</span>
                <input type="text" placeholder="请填写身份证号" @blur="idCardBlur" v-model="memberList[peopleFlag].idCard" maxlength="18">
            </div>
            <div class="useDrugInfo-msg-item">
                <p class="name">姓名</p>
                <span class="star">*</span>
                <input type="text" v-model="memberList[peopleFlag].patientName" placeholder="请填写姓名"  maxlength="10">
            </div>
            <div class="useDrugInfo-msg-item">
                <p class="name">性别</p>
                <span class="star">*</span>
                <div>
                    <div @click="chooseSex(1)" :class="{active: memberList[peopleFlag].sex == 1}">男</div>
                    <div @click="chooseSex(2)" :class="{active: (memberList[peopleFlag].sex!=''&& memberList[peopleFlag].sex == 2)}">女</div>
                </div>
            </div>
            <div class="useDrugInfo-msg-item">
                <p class="name">出生日期</p>
                <span class="star">*</span>
                <div class="div" v-if="memberList[peopleFlag].patientDob" v-text="memberList[peopleFlag].patientDob"></div>
                <input type="text" v-model="memberList[peopleFlag].patientDob" v-if="!memberList[peopleFlag].patientDob" disabled placeholder="请填写出生日期"> 
               
            </div>
            <div class="useDrugInfo-msg-item">
                <p class="name">关系</p>
                <span class="star">*</span>
                <div v-if="memberList[peopleFlag].relation == '本人'">
                    <div @click="chooseGuan('本人')" :class="{active: (memberList[peopleFlag].relation == '本人' || andFlag == '本人')}">本人</div>
                </div>
                <div v-else>
                    <div @click="chooseGuan('父母')" :class="{active: memberList[peopleFlag].relation == '父母' || andFlag == '父母'}">父母</div>
                    <div @click="chooseGuan('子女')" :class="{active: memberList[peopleFlag].relation == '子女' || andFlag == '子女'}">子女</div>
                    <div @click="chooseGuan('配偶')" :class="{active: memberList[peopleFlag].relation == '配偶' || andFlag == '配偶'}">配偶</div>
                    <div @click="chooseGuan('其他')" :class="{active: memberList[peopleFlag].relation == '其他' || andFlag == '其他'}">其他</div>
                </div>
            </div>
            <div class="useDrugInfo-msg-item">
                <p class="name">手机号码</p>
                <span class="star"></span>
                <input type="tel" v-model="memberList[peopleFlag].contractPhone" placeholder="请填写手机号码">
            </div>
        </div>
        <div class="useDrugInfo-submit">
            <span @click="useDrugInfoSubmit">提交</span>
        </div>
        <div style="height: 100px;"></div>
        <div class="useDrugInfo-submit-fixed" v-if="dateFlag">
            <div>
                <van-datetime-picker
                v-model="currentDate"
                :min-date="minDate"
                @cancel="cancel"
                @confirm="confirm"
                type="date"/></div>
        </div> 
    </div>
</template>
<script>
import next from '@/assets/img/next.png'
import Vue from 'vue'
import {Toast,DatetimePicker} from 'vant'
Vue.use(Toast).use(DatetimePicker);
export default{
    name: 'useDrugInfo',
    data(){
        return {
            next,
            currentDate: new Date(),
            peopleFlag: 0,
            sexFlag: 0,
            andFlag: null,
            addFlag: false,
            addClick: true,
            memberList: [],
            memberListLength: 0,
            dateFlag: false,
            minDate: new Date('1900-01-01'),
            sex: 0,
            age: 0,
            hasPeoleFlag: false,
            addPeopleFlag: false
        }
    },
    methods:{
        choosePeople(index){
            this.andFlag = null;
            this.peopleFlag = index;
            this.addClick = true;
            this.addPeopleFlag = false;
        },
        chooseSex(i){
            let idCard = this.isCardID(this.memberList[this.peopleFlag].idCard);
            if(idCard){
                Toast('已根据身份证号为您自动匹配出性别，无需手动改动')
                return false;
            }
            this.memberList[this.peopleFlag].sex = i;
            console.log(this.memberList)
            this.memberList = JSON.parse(JSON.stringify(this.memberList))
        },
        chooseDate(){
            this.dateFlag = true;
        },
        cancel(){
            this.dateFlag = false;
        },
        confirm(){
            this.dateFlag = false;
            var yy = this.currentDate.getFullYear();
            var mm = this.currentDate.getMonth()+1;
            var dd = this.currentDate.getDate();
            this.memberList[this.peopleFlag].patientDob = yy + '-' + mm + '-' +dd;
        },
        chooseGuan(index){
            this.andFlag = index;
            this.memberList[this.peopleFlag].relation = index;
            this.memberList = JSON.parse(JSON.stringify(this.memberList));
        },
        useDrugInfoSubmit(){
            console.log(this.isCardID(this.memberList[this.peopleFlag].idCard));
            if(this.hasPeoleFlag &&  this.addPeopleFlag){
                Toast('已有该用药人信息');
                return false;
            }
            if(!this.isCardID(this.memberList[this.peopleFlag].idCard)){
                Toast('请填写用药人的正确身份证号');
                return false;
            }
            if(!this.memberList[this.peopleFlag].patientName){
                Toast('请填写用药人姓名');
                 return false;
            }
            if(!this.memberList[this.peopleFlag].sex){
                Toast('请填写用药人性别');
                 return false;
            } 

            if(!this.memberList[this.peopleFlag].relation){
                Toast('请填写用药人关系');
                 return false;
            } 
            if(this.memberList[this.peopleFlag].contractPhone && this.memberList[this.peopleFlag].contractPhone.length != 11){
                Toast('请填写用药人手机号码');
                 return false;
            }      
            this.savePatientInfo();
        },
        //添加就诊人
        addPeople(){
            this.andFlag = null;
            this.addPeopleFlag = true;
            if(this.addClick){
                this.addClick = false;
                this.addPeopleFunc();
            }
        },
         addPeopleFunc(){
            let memberListTamp = {
                idCard: '',
                patientName: '',
                sex: '',
                patientDob: '',
                relation: '',
                show: false
            }
            this.memberList[this.memberListLength] = memberListTamp;
            this.peopleFlag = this.memberList.length-1;
            console.log(this.memberList);
        },
        getPatientList(){
            let params = {
                header: {},
                body: {
                    roleId:  this.$store.state.login.userId,
                    roleType: "1",
                    roleUserId: this.$store.state.login.userId,
                }
            }
            this.$api.getPatientList(params).then(res => {
                if(res.code == 0){
                    let memberList = res.data.memberList;
                    memberList.unshift(res.data.selfInfo)
                    for(let i in memberList){
                        memberList[i].show = true;
                    }
                    
                    this.memberList = memberList;
                    this.memberListLength = memberList.length;

                    if(memberList.length > 0){
                        this.addFlag = true;
                    }
                    if(this.memberList.length == 0){
                        this.addPeopleFunc();
                    }
                }
            })
        },
        idCardBlur(){
            for(let i = 0 ; i < (this.memberList.length -1); i++){
                if(this.memberList[i].idCard == this.memberList[this.memberList.length -1].idCard &&  this.addPeopleFlag){
                    Toast('已有该用药人信息');
                    this.hasPeoleFlag = true;
                    return false;
                }else{
                    this.hasPeoleFlag = false;
                }
            }
            //if(this.memberList[this.peopleFlag].idCard)
            let idCard = this.isCardID(this.memberList[this.peopleFlag].idCard);
            if(!this.isCardID(this.memberList[this.peopleFlag].idCard)){
                Toast('请填写用药人的正确身份证号');
                return false;
            }
            let memberListTamp = [];
            var patientDob = null;
            if(idCard){
                var nowYear = new Date().getFullYear();
                var year = this.memberList[this.peopleFlag].idCard.slice(6, 10);
                var month = this.memberList[this.peopleFlag].idCard.slice(10, 12);
                var day = this.memberList[this.peopleFlag].idCard.slice(12, 14);
                patientDob = year + '-' + month + '-' + day;
                console.log(patientDob);
                var memberAge = nowYear - year;
                var sex = ''
                if (parseInt(this.memberList[this.peopleFlag].idCard.substr(16, 1)) % 2 == 1) {
                    sex = '1';
                } else {
                    sex = '2';
                }
                this.memberList[this.peopleFlag].sex = sex;
                 memberListTamp = {
                    idCard: this.memberList[this.peopleFlag].idCard,
                    //patientName: '',
                    sex: sex,
                    patientDob: patientDob,
                    //relation: '',
                    //show: false
                }
                console.log(memberListTamp);
                console.log(this.memberList);
                memberListTamp = Object.assign(this.memberList[this.peopleFlag],memberListTamp);
                console.log(memberListTamp);
                console.log(this.peopleFlag);
                this.memberList[this.peopleFlag] = memberListTamp;
                this.memberList = JSON.parse(JSON.stringify(this.memberList));


                console.log(11111);
            }
        },
        savePatientInfo(){
            let params = {
                header: {},
                body: {
                    patientId: this.memberList[this.peopleFlag].patientId ? this.memberList[this.peopleFlag].patientId : null,
                    patientName: this.memberList[this.peopleFlag].patientName,
                    idCard: this.memberList[this.peopleFlag].idCard,
                    contractPhone: this.memberList[this.peopleFlag].contractPhone,
                    patientDob: this.memberList[this.peopleFlag].patientDob,
                    sex: this.memberList[this.peopleFlag].sex,
                    relation: this.memberList[this.peopleFlag].relation,
                    editType: this.memberList[this.peopleFlag].patientId ? 2 : 0,
                    roleId: this.$store.state.login.userId,
                    roleUserId: this.$store.state.login.userId,
                }
            }
            this.$api.savePatientInfo(params).then(res=>{
                console.log(res);
                console.log(new Date().getFullYear() - parseInt(this.memberList[this.peopleFlag].patientDob.substr(0,4)));
                if(res.code == 0){
                    this.$router.push({
                        name: 'condition',
                        query:{
                            sex: this.memberList[this.peopleFlag].sex,
                            age: new Date().getFullYear() - parseInt(this.memberList[this.peopleFlag].patientDob.substr(0,4)),
                            patientId: res.data.patientId,
                            name: this.memberList[this.peopleFlag].patientName
                        }
                    });
                }
            })
        },
        isCardID(sId) {
            var aCity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
            };
            var iSum = 0;
            var info = "";
            if (!/^\d{17}(\d|x)$/i.test(sId))
            return false;

            sId = sId.replace(/x$/i, "a");
            if (aCity[parseInt(sId.substr(0, 2))] == null)
            return false;

            var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
            var d = new Date(sBirthday.replace(/-/g, "/"));
            if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
            return false;

            for (var i = 17; i >= 0; i--) {
            iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
            }
            if (iSum % 11 != 1) return false;
            return true;
        },
    },
    mounted(){
        this.getPatientList();
    }
}
</script>
<style lang="less">
    .useDrugInfo{
        .useDrugInfo-submit-fixed{
            position: fixed;
            bottom: 0;
            left: 0;
            z-index: 100000;
            width: 100%;
        }
        .useDrugInfo-step{
            font-size: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            span{
                display: inline-block;
                line-height: 72px;
                &:first-child{
                    color: #3ac756;
                }
                &.next{
                    display: inline-block;
                    width: 24px;
                    margin: 0 14px;
                }
            }
        }
        .useDrugInfo-people{
            overflow: hidden;
            background: #fff;
            display: flex;
            flex-wrap: wrap;
            padding: 20px 30px; 
            .useDrugInfo-people-item{
                width: 136px;
                height: 88px;
                border: solid 2px #d2d2d4;
                border-radius: 8px;
                margin-right: 30px;
                margin-top: 20px;
                &.active{
                    border-color: #3ac756;
                    background-image: url(../../assets/img/choose_icon.png);
                    background-repeat: no-repeat;
                    background-position: right bottom;
                    background-size: 20% auto;  
                }
                div{
                    width: 100%;
                    text-align: center;
                    margin-top: 17px;
                    overflow: hidden;
                    display:block;
                    white-space:nowrap; 
                    overflow:hidden; 
                    text-overflow:ellipsis;
                }
                span{
                    display: inline-block;
                    text-align: center;
                    width: 100%;
                    margin-top: 2px;
                    color: #aeafb2;
                }
            }
            .useDrugInfo-people-add{
                div{
                    width: 32px;
                    height: 32px;
                    display: block;
                    margin: 10px auto 0;
                }
                span{
                    font-size: 24px;
                }
            }
        }
        .useDrugInfo-msg{
            background: #fff;
            .useDrugInfo-msg-item{
                display: flex;
                align-items: center;
                padding: 40px 30px 40px 0;
                margin-left: 30px;
                border-bottom: 2px solid #ebebeb;
                &:last-child{
                    border-bottom: none;
                }
                span{
                    flex-shrink: 0;
                    letter-spacing: 2px;
                    &.star{
                        color: #ff6e6e;
                        width: 14px;
                    } 
                }
                .name{
                    display: block;
                    text-align: justify;
                    width: 120px;
                    height: 30px;
                    &::after{
                        content:"";
                        display:inline-block;
                        width:100%;
                        height: 0px;
                    }
                }
                input{
                    flex-grow: 2;
                    margin-left: 40px;
                    color: #333333;
                    font-weight: 600;
                    background: #fff;
                    &::placeholder{
                        font-weight: 300;
                    }
                }
                .div{
                    height: 36px;
                }
                div{
                    display: flex;
                    margin-left: 40px;
                    div{
                        margin-left: 0px;
                        margin-right: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border: 2px solid #d2d2d4;
                        height: 48px;
                        width: 80px;
                        color: #aeafb2;
                        font-size: 24px;
                        border-radius: 8px;
                        &.active{
                            color: #3ac756;
                            border-color: #3ac756;
                        }
                    }
                }
            }
        }
        .useDrugInfo-submit{
            position: fixed;
            bottom: 55px;
            left: 0;
            width: 100%;
            z-index: 1;
            display: flex;
            justify-content: center;
            span{
                display: block;
                width: 600px;
                height: 80px;
                background-image: linear-gradient(90deg, 
                    #73e539 0%, 
                    #3ac756 100%), 
                linear-gradient(
                    #3ac756, 
                    #3ac756);
                background-blend-mode: normal, 
                    normal;
                border-radius: 40px;
                text-align: center;
                color: #fff;
                line-height: 80px;
            }
        }
    }
</style>
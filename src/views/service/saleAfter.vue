<template>
  <div class="saleAfter">
    <div class="saleAfter-item">
      <div class="saleAfter-item-header">
        <span>售后商品</span>
      </div>
      <div class="saleAfter-containner">
        <div class="saleAfter-wrap" v-for="(item,index) in saleAfterData" :key="index">
          <div class="saleAfter-wrap-choose" @click="chooseProduct(index)">
            <img v-if="item.selected == 0" src="../../assets/img/cart-nor.png" alt />
            <img v-if="item.selected == 1" src="../../assets/img/cart-choose.png" alt />
          </div>
          <div class="saleAfter-wrap-pic">
            <img v-lazy="item.imgUrl.split(';')[0]" alt/>
          </div>
          <div class="saleAfter-wrap-right">
            <div class="saleAfter-wrap-name">
              <div v-text="item.commName"></div>
            </div>
            <div class="saleAfter-wrap-other">
              <span>￥{{item.commPrice}}</span>
              <span>x{{item.qty}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="saleAfter-form">
      <div class="saleAfter-form-item" @click="showWord">
          <div class="saleAfter-form-word">售后原因</div>
          <div>
            <input v-if="!word" type="text" disabled placeholder="请选择原因">
            <span v-if="word">{{word}}</span>
          </div>
          <div class="saleAfter-form-more"><img src="../../assets/img/more.png" alt=""></div>
      </div>
      <div class="saleAfter-form-item">
          <div class="saleAfter-form-word">售后描述</div>
          <div><van-field class="addressEdit-item-textarea"
                v-model="addressDetail"
                type="textarea"
                autosize
                maxlength="300"
                placeholder="请输入您对商品售后申请的描述，如购买商品为多件可说明退货数量等信息，300字以内"
            />
          </div>
      </div>
      <div class="saleAfter-form-item">
          <div class="saleAfter-form-word">上传图片</div>
          <div>
              <van-uploader
                v-model="fileList"
                multiple
                :after-read="afterRead"
                @delete="canncel"
                :max-count="5"
                />
          </div>
      </div>
    </div>
    <div class="saleAfter-liyou" v-if="showWordFlag">
        <div class="saleAfter-liyou-position">
            <div @click="chooseWord('不想要了')">不想要了</div>
            <div @click="chooseWord('商品降价了')">商品降价了</div>
            <div @click="chooseWord('商品质量有问题')">商品质量有问题</div>
            <div @click="chooseWord('其它')">其它</div>
            <div @click="hideWord">取消</div>
        </div>
    </div>
    <div style="height: 100px;"></div>
    <div class="saleAfter-fixed">
        <span @click="saveRefundOrder">提交售后申请</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue';
import { Field,Uploader,Lazyload, Toast } from 'vant';
Vue.use(Field).use(Uploader).use(Lazyload);
export default {
  name: "saleAfter",
  data() {
    return {
        addressDetail: '',
        fileList: [],
        showWordFlag: false,
        saleAfterData: [],
        word: '',
        refundImg: [],
        newFileList:[],
    };
  },
  methods:{
    showWord(){
      this.showWordFlag = true;
    },
    hideWord(){
      this.showWordFlag = false;
    },
    chooseWord(word){
      this.word = word;
      this.showWordFlag = false;
    },
    chooseProduct(i){
      this.saleAfterData[i].selected = this.saleAfterData[i].selected == 1 ? 0 : 1;
    },
    afterRead(file){
      if(!file.length){
          this.uploadFileFunc(file,1);
      }else{
        this.newFileList=file;
        this.forEarchImg(0);
      }
      console.log(this.fileList);
    },
    forEarchImg(i){
      let file=this.newFileList;
      if (i<=file.length-1) {
        this.uploadFileFunc(file[i],file.length,i);
      }
    },
    uploadFileFunc(file,l,index){

      this.$uploadImg(file.file).then((o)=>{
        if (o.code=='0') {
          let avatar = o.url;
         // this.refundImg[index]=avatar;
          this.refundImg.push(avatar);
          if (l>1&&index<l-1) {
            let nindex=index+1
            this.forEarchImg(nindex)
          }
        }
      })
      // let formData = new FormData();
      // formData.append("file", file.file);
      // console.log(formData);
      // Toast.loading();
      // this.$api.chatImgUpload(formData).then(res => {
      //   if (res.code == 0 && res.message != "未找到文件") {
      //     Toast.clear();
      //     let avatar = res.data.uploadFilePath;
      //     this.refundImg.push(avatar);
      //   }
      // });
    },
    canncel(e,detail){
      this.refundImg.splice(detail.index,1);
    },
    getOrderCommodity(){
      let params = {
        header: {},
        body: {
          orderId: this.$route.query.orderId
        }
      }
      this.$api.getOrderCommodity(params).then(res => {
        console.log(res);
        if(res.code == 0){
          let data = res.data;
          for(var i in data){
            data[i].selected = 0;
          }
          this.saleAfterData = data;
        }
      })
    },
    saveRefundOrder(){
      console.log(this.refundImg.length > 0 ? this.refundImg.join(';') : '');
      let orderCommodityIdList = [];
      for(var i in this.saleAfterData){
        if(this.saleAfterData[i].selected == 1){
          orderCommodityIdList.push(this.saleAfterData[i].orderCommId);
        }
      }
      if(orderCommodityIdList.length < 1){
        Toast('请选择售后商品');
        return false;
      }
      if(!this.word){
         Toast('请填写售后原因');
        return false;
      }
      let params = {
        header: {},
        body: {
          orderId: this.$route.query.orderId,
          description: this.addressDetail,
          refundImg: this.refundImg.length > 0 ? this.refundImg.join(';') : '',
          refundReason: this.word,
          orderCommodityIdList: orderCommodityIdList,
          roleId: this.$store.state.login.userId
        }
      }
      console.log(params);

      this.$api.saveRefundOrder(params).then(res => {
        console.log(res);
        if(res.code == 0){
          this.$router.push({
            path: '/saleAfterDetail',
            query: {
              refundOrderId: res.data.refundOrderId
            }
          })
        }
      })
    }
  },
  mounted(){
    this.getOrderCommodity();
  }
};
</script>
<style lang="less">
.saleAfter {
  .saleAfter-item {
    margin: 20px 30px 0;
    background: #fff;
    border-radius: 12px;
    .saleAfter-item-header {
      display: flex;
      padding: 30px 0;
      margin: 0 20px;
      align-items: center;
      border-bottom: 2px solid #ebebeb;
    }
    .saleAfter-containner {
      padding: 20px 0;
      .saleAfter-wrap {
        padding: 10px 0;
        margin: 0 20px;
        display: flex;
        align-items: center;
        .saleAfter-wrap-choose {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          margin: 0 32px 0 12px;
        }
        .saleAfter-wrap-pic {
          flex-shrink: 0;
          width: 160px;
          height: 160px;
          border-radius: 12px;
          overflow: hidden;
        }
        .saleAfter-wrap-right {
          flex-grow: 2;
          margin-left: 20px;
          
          .saleAfter-wrap-name {
            height: 80px;
           div{
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
               line-height: 40px;
           }
           
            //
          }
          .saleAfter-wrap-other {
            margin-top: 50px;
            display: flex;
            font-size: 24px;
            span {
              &:first-child {
                flex-grow: 2;
              }
              &:last-child {
                flex-shrink: 0;
                color: #a8a8a8;
              }
            }
          }
        }
      }
    }
  }
  .saleAfter-form{
      background: #fff;
      margin: 20px 30px 0;
      border-radius: 12px;
      .saleAfter-form-item{
          display: flex;
          align-items: center;
          padding: 30px 0;
          border-bottom: 2px solid #ebebeb;
          margin: 0 20px;
          &:nth-child(2){
              align-items: flex-start;
          }
          &>div{
              line-height: 40px;
              &:nth-child(1){
                  margin-right: 40px;
              }
              &:nth-child(2){
                 
                  flex-grow: 2;
                  .van-cell{
                      padding: 0;
                      .van-field__body{
                         margin-top: -5px;
                          margin-right: 0;
                          textarea{
                              min-height: 144px;
                          }
                      }
                      .van-cell__value{
                          margin-right: 0;
                      }
                      
                      textarea{
                          width: 100%;
                      }
                  }
                  .van-uploader{
                       margin-right: 0;
                       display: flex;
                      .van-uploader__wrapper{
                          display: flex;
                      }
                      .van-uploader__preview-image{
                          display: block;
                          width: 140px;
                          height: 140px;
                      }
                      .van-uploader__upload{
                          width: 140px;
                          height: 140px;
                      }
                  }
              }
              input{
                  background: #fff;
              }
          }
          .saleAfter-form-more{
              width: 14px;
              height: 24px;
              img{
                  display: block;
              }
          }
          &:last-child{
              border: none;
          }
      }
  }
  .saleAfter-fixed{
      position: fixed;
      bottom: 30px;
      left: 0;
      z-index: 1;
      width: 100%;
      display: flex;
      justify-content: center;
      span{
        width: 690px;
        height: 72px;
        background-image: linear-gradient(90deg, 
            #ffa64c 0%, 
            #ff6f26 100%), 
        linear-gradient(
            #ffffff, 
            #ffffff);
        background-blend-mode: normal, 
            normal;
        border-radius: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
      }
  }
  .saleAfter-liyou{
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(51,51,51,0.5);
      .saleAfter-liyou-position{
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 11;
          
          width: 100%;
          background-color: #f7f8fa;
          border-radius: 15px 15px 0 0;
          div{
              background: #fff;
              line-height: 88px;
              text-align: center;
              &:first-child{
                 border-radius: 15px 15px 0 0;
              }
              &:last-child{
                  margin-top: 20px;
              }
          }
      }
  }
}
</style>
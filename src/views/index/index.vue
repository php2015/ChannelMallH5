<template>
  <div class="index" v-wechat-title="$route.meta.title"  img-set="./static/img/favicon.ico"> 
    <!-- 搜索 -->
    <div v-if="searchShow" class="index-search" @click="tapToSearch()"><search></search></div>
    <div v-if="!searchShow" class="index-search-fixed" @click="tapToSearch()"><searchFixed></searchFixed></div>
    <!-- 轮播图 -->
    <van-swipe :autoplay="autoplay" :height="190" class="index-banner" v-if="$store.state.login.channelNum != 2">
      <van-swipe-item v-for="(image, index) in bannerPics" :key="index" @click="jumpPage(image.linkUrl)" v-lazy:background-image="image.picUrl"></van-swipe-item>
    </van-swipe>
    <!-- 保障承诺 -->
    <div class="index-ensure-div" v-if="$store.state.login.channelNum == 2"></div>
    <div class="index-ensure">
      <div v-for="(item,index) in ensurePic" :key="index">
        <div><img src="../../assets/img/gou.png" alt=""></div>
        <span v-text="item.picTitle"></span>
      </div>
    </div>
    <!-- 焦点广告 -->
    <div class="index-activity" v-if="pics.length > 0" @click="jumpPage(pics[0].linkUrl)" v-lazy:background-image="pics[0].picUrl">
      <!-- <img v-if="pics.length > 0"  :src="pics[0].picUrl" alt=""> -->
    </div>
    <!-- 栏目/分类 -->
    <div class="index-classify" v-if="classify.length > 0">
      <van-swipe  :height="150">
        <van-swipe-item v-for="(item,index) in classify" :key="index">
          <div class="index-classify-item" v-for="(list,i) in item.classArr"  @click="jumpPage(list.linkUrl)" :key="i">
            <div>
              <img v-lazy="list.picUrl" :src="list.picUrl" alt="">
            </div>
            <span v-text="list.picTitle"></span>
          </div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 专题 -->
    <div class="index-hot">
      <div v-for="(item,index) in classifyPics" :key="index" v-lazy:background-image="item.picUrl" @click="jumpPage(item.linkUrl)"></div>
    </div>

    <div class="index-tab" id="tab">
      <div class="index-tab-div">
      <van-tabs  scroll="scrollFunc" @click="onClick" v-model="active" v-if="getColumnListAttr.length > 0" :class="{'index-tab-active': tabActive}">
        <van-tab v-for="(item,index) in getColumnListAttr" :key="index" :title="item.name"></van-tab>
      </van-tabs>
      </div>
      <!-- 栏目banner -->
      <div class="index-tab-banner">
        <van-swipe :autoplay="3000" class="index-item-banner">
          <van-swipe-item v-for="(image, index) in cloumnPics" :key="index" @click="jumpPage(image.linkUrl)"  v-lazy:background-image="image.picUrl"></van-swipe-item>
        </van-swipe>
      </div> 
      <van-list
          v-if="records.length > 0"
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <div class="index-goods">
            <div v-for="(item,index) in records" :key="index">
              <goods :item="item"/>
            </div> 
        </div>
      </van-list>
      <div v-if="records.length == 0"><empty :tip="tip"/></div>
    </div>
    <fixedIcon/>
    <div class="index-height"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import { Swipe, SwipeItem,Lazyload, Tab, Tabs,List, Toast } from 'vant';
Vue.use(Swipe).use(SwipeItem).use(Lazyload).use(Tab).use(Tabs).use(List);

import search from '../../components/index/search'
import goods from '../../components/index/goods'
import searchFixed from '../../components/index/searchFixed'
import empty from '../../components/common/empty'
import fixedIcon from '../../components/common/fixedIcon'

export default {
  name: 'index',
  data(){
    return {
      loop: false,
      tip: '暂时没有数据哦~~',
      autoplay: 3000,
      bannerPics: [],      //banner广告
      ensurePic: [],      //保障
      pics: [],            //焦点广告
      classify: [],        //分类
      classifyPics: [],    //专题
      cloumnPics: [],      //栏目
      active: 0,
      activeFlag: false,
      tabTop: null,
      tabActive: false,
      searchShow: true,
      getColumnListAttr: [],
      columnId: null,
      records: [],
      recordsFlag: false,
      current: 1,
      finished: false,
      loading: false,
      setTime: 0,
      activeFlag: false
    }
  },
  components:{
    search,
    goods,
    searchFixed,
    empty,
    fixedIcon
  },
  methods:{
    onClick(name, title){
      this.toScroller();
      this.recordsFlag = true;
      this.current = 1;
      this.activeFlag = false;
      this.columnId = this.getColumnListAttr[name].id;
      this.getChannelClassiCommodityList();
    },
    scrollToTop () {
      let scrollHeight =  document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollHeight > this.tabTop-46) {
        this.tabActive = true
      } else {
        this.tabActive = false
      }
      if (scrollHeight > 135) {
        this.searchShow = false;
      }else{
        this.searchShow = true;
      }
    },
    toScroller(){
      let scrollHeight =  document.documentElement.scrollTop || document.body.scrollTop;
      if(scrollHeight > this.tabTop -46 ){
         document.documentElement.scrollTop = this.tabTop - 44;
         document.body.scrollTop = this.tabTop - 44;
      }
    },
    pic(picPositionCode){    //轮播图
      let params = {
        header: {},
        body: {
          picPositionCode: picPositionCode
        }
      }
      this.$api.pic(params).then(res => {
        if(res.code == 0){
          if(picPositionCode == this.$store.state.login.header.channelId +'_1'){
            this.bannerPics = res.data.pics;
          }else if(picPositionCode == this.$store.state.login.header.channelId +'_2'){
            this.ensurePic = res.data.pics;
          }else if(picPositionCode == this.$store.state.login.header.channelId +'_3'){
            this.pics = res.data.pics;
          }else if(picPositionCode == this.$store.state.login.header.channelId +'_4'){
            let picsLength = res.data.pics.length;  
            let pics = res.data.pics; 
            let classify = [];                  
            for(let i = 0; i < parseInt(picsLength/10)+1; i++){
              let classifyObj = {};
              classifyObj.classArr = pics.slice(i*10,(i+1)*10);
              classify.push(classifyObj);
            }
            if(classify[classify.length - 1].classArr.length == 0){
              classify.length = classify.length - 1;
            }
            this.classify = classify;
          }else if(picPositionCode == this.$store.state.login.header.channelId +'_5'){
            console.log(picPositionCode);
             this.classifyPics = res.data.pics;
          }else if(picPositionCode == this.$store.state.login.header.channelId +'_6'){
             this.cloumnPics = res.data.pics;
          }
        }
      })
    },
    tapToSearch() {
      if(this.$store.state.login.channelNum == 2){  //兼容联享家 
          var flag = JsBridge.callMethod(
          "showPage", {
              url: this.$api.baseUrl+`/ybH5/serach`,
              type: 1
          });
          return false;
      }
      
      this.$router.push({
        path: "serach",
        query: {}
      });
    },  
    jumpPage(url){            //跳转
      console.log(url);
      if(url == ''){
        return false;
      }else if(url.indexOf('productDetail') !=-1){
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let query = this.getUrlProperty(url);
            var flag = JsBridge.callMethod(
            "showPage", {
                url: that.$api.baseUrl+`/ybH5/productDetail?id=${query.id}&columnCommId=${query.columnCommId}`,
                type: 1
            });
            if(!flag){
              this.$router.push({
                path: 'productDetail',
                query: this.getUrlProperty(url)
              });
            }
            return false;
        }

        this.$router.push({
          path: 'productDetail',
          query: this.getUrlProperty(url)
        })
      }else if(url.indexOf('specialList') !=-1){
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let query = this.getUrlProperty(url);
            var flag = JsBridge.callMethod(
            "showPage", {
                url: that.$api.baseUrl+`/ybH5/specialList?columnId=${query.columnId}`,
                type: 1
            });
            if(!flag){
              this.$router.push({
                path: 'specialList',
                query: this.getUrlProperty(url)
              })
            }
            return false;
        }
        this.$router.push({
          path: 'specialList',
          query: this.getUrlProperty(url)
        })
      }else{
        if(this.$store.state.login.channelNum == 2){  //兼容联享家 
            let that = this;
            let flag = JsBridge.callMethod(
            "showPage", {
                url: url,
                type: 1
            });
            if(!flag){
                window.location.href = url;
            }
            return false;
        }
        window.location.href = url
      } 
    },
    getUrlProperty(url){
      let search = url.split('?')[1];
      let params = search.split('&');
      let paramsTamp = {};
      for(var i in params){
        paramsTamp[params[i].split('=')[0]] = params[i].split('=')[1]
      }
     return paramsTamp;
    },
    urlQueryString(url,name){   //获取路径的参数
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = url.substring(url.indexOf("?")).substr(1).match(reg);
      if(r!=null)return unescape(r[2]); return null;
    },
    onLoad(){
      setTimeout(()=>{
        this.setTime = 500;
        this.getChannelClassiCommodityList();
      },this.setTime)
      
    },
    getChannelClassiCommodityList(size = 10){    //栏目列表商品
      let params = {
        header: {},
        body: {
          columnId: this.columnId,
          current: this.current,
          size: size
        }
      }
      Toast.loading();
      this.$api.getChannelClassiCommodityList(params).then(res=>{
        Toast.clear();
        if(res.code == 0){
          let records = res.data.records;
          if(this.recordsFlag){
            this.records = [];
            this.recordsFlag = false;
          }
          if(records.length < 10){
            this.records = this.records.concat(records);
            this.finished = true;
            this.loading = false;
          }else{
            this.current += 1;
            this.records = this.records.concat(records);    
            this.finished = false;
            this.loading = false;    
          }
        }
      })
    },
    getColumnList(){      //栏目列表
      let params = {
        header: {},
        body: {
          channelId: this.$store.state.login.header.channelId
        }
      }
      console.log(params);
      this.$api.getColumnList(params).then(res=>{
        if(res.code == 0){
          this.getColumnListAttr = res.data;
          this.columnId = res.data[0].id;
          this.getChannelClassiCommodityList(10);
        }
      })
    }
  },
  updated(){
    this.$nextTick(()=>{
      if(!this.activeFlag){
        let tab = document.getElementById("tab");
        if(tab){
          this.tabTop = tab.offsetTop;
          window.addEventListener('scroll', this.scrollToTop, true)
        }
      }
       this.activeFlag = false;
    })
  },
  mounted(){
    setTimeout(()=>{
        this.pic(this.$store.state.login.header.channelId +'_1');  //渠道商城-首页banner
        this.pic(this.$store.state.login.header.channelId +'_2');  //渠道商城-保障
        this.pic(this.$store.state.login.header.channelId +'_3');  //渠道商城-焦点
        this.pic(this.$store.state.login.header.channelId +'_4');  //渠道商城-分类
        this.pic(this.$store.state.login.header.channelId +'_5');  //渠道商城-专题
        this.pic(this.$store.state.login.header.channelId +'_6');  //渠道商城-栏目
    },10)
    this.getColumnList();  
    console.log('test'); 
    console.log(window.location.href);
    console.log(this.$store.state.login);
  }
}
</script>
<style lang="less">
    .index{
      .index-height{
        height: 118px;
      }
      .index-search{
        width: 100%;
        position: fixed;
        top: 11px;
        left: 0;
        z-index: 100;
        display: flex;
        justify-content: center;
        opacity: 0.7;
      }
      .index-search-fixed{
        width: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 100;
        padding: 11px 0;
        display: flex;
        justify-content: center;
        background: #fff;
      }
      .index-banner{
        height: 100%;
        .van-swipe__track{
          height: 380px !important;
            .van-swipe-item{
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
            }
          }
        }
        .van-swipe__indicators{
          bottom: 56px;
          border-radius: 2px;
          .van-swipe__indicator{
            background-color: #ffffff;
          }
      }
      .index-ensure-div{
        margin-top: 30px;
        padding-top: 87px;
      }
      .index-ensure{
        background: #fff;
        display: flex;
        padding-top: 23px;
        padding-bottom: 12px;
        justify-content: center;
        border-radius: 30px 30px 0px 0px;
        margin-top: -30px;
        position: relative;
        div{
          display: flex;
          align-items: center;
          flex-grow: 2;
          justify-content: center;
          div{
            width: 24px;
            height: 24px;
            flex-grow: 0;
          }
          span{
            color: #666666;
            font-size: 20px;
            margin-left: 4px;
          }
        }
      }
      .index-activity{
        background: #fff;
        height: 122px;
        width: 100%;
        padding: 26px 30px 4px;
        box-sizing: border-box;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
      .index-classify{
        justify-content: flex-end;
        padding-top: 40px;
        padding-bottom: 20px;
        background: #fff;
        .van-swipe{
          width: 100%;   
          .van-swipe__track{
            height: 300px !important;
            width:100%;
            .van-swipe-item{
              width: 100%;
              flex-grow: 2;
              display: flex;
              flex-wrap: wrap; 
              justify-content: flex-start; 
              text-align: justify;       
              .index-classify-item{
                display: inline-block;
                padding: 0 24px;
                width: 20%;
                box-sizing: border-box;
                div{
                  width: 88px;
                  height: 88px;
                  margin: 0 auto;
                  img{
                    display: block;
                    border-radius: 100%;
                  }
                }
                span{
                  display: block;
                  font-size: 24px;
                  padding-top: 10px;
                  text-align: center;
                }
              }
            }
          }
          .van-swipe__indicators{
            bottom: 0px;
            z-index: 10;
            .van-swipe__indicator{
              width: 40px;
              height: 4px;
              margin: 0;
              border-radius: 2px;
              background-color: #ebebeb;
              &.van-swipe__indicator--active{
                background-color: #3ac756; 
              }
            }
          }
        }
      }
      .index-hot{
        display: flex;
        padding: 0 30px;
        flex-wrap: wrap;        
        justify-content: space-between;
        background: #fff;
        padding-bottom: 8px;
        div{
          width: 340px;
          height: 180px;
          margin-top: 10px;
          background-color: #fff;
          border-radius: 12px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center; 
        }
      }
      .index-tab-active{
        position: fixed;
        top: 87px;
        left: 0;
        width: 100%;
        z-index: 10;
      }
      .index-tab{
        .index-tab-div{
          height: 80px;
        }
        .van-tabs{
          .van-tabs__wrap{
            height: 80px;
            .van-tabs__nav{
              .van-tab{
                flex-basis: auto !important;
                 padding: 0 16px;
              }
              .van-tab--active{     
                  span{
                    font-size: 32px;
                    font-weight: 600;
                    display: flex;
                    justify-content: center;
                  } 
                }
              .van-tabs__line{
                 display: none;
                
                 bottom: 42px;
                 width: 30px !important;
                 height: 6px;
                 background-color: #3ac756;
                 border-radius: 3px;
              }
            }
          }
        }
        [class*=van-hairline]::after{
          border:none;
        }
        .index-tab-banner{
          padding: 0 30px;  
          margin-top: 20px; 
           .index-item-banner{
             .van-swipe__track{
                height: 160px;
                .van-swipe-item{
                  width: 100%;
                  border-radius: 10px;
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: contain; 
                }
             }   
            .van-swipe__indicators{     
              bottom: 11px;
            }
           }
        }
      }
      .index-goods{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: 0 30px;
        border-radius: 12px;
        margin-top: 12px;
        &>div{
          margin-top: 10px;
        }
      }
    }
    
</style>
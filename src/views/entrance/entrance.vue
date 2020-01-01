<template>
    <div>
        <keep-alive include="index,product,mine"><router-view></router-view></keep-alive>
        <div class="fixed" v-if="$store.state.login.channelNum != 2">
            <router-link :class="{'navbar':true, 'active': navFlag == 0}" :to="{name: 'index',query:{}}">
              <div>
                <div><img :src="index" alt=""></div>
                <span>首页</span>
              </div>
            </router-link>
            <router-link :class="{'navbar':true, 'active': navFlag == 1}" :to="{path: '/product',query:{}}">
              <div>
                <div><img :src="classify" alt=""></div>
                <span>分类</span>
              </div>
            </router-link>
            <router-link @click.native="jumpShopCart" :class="{'navbar':true, 'active': navFlag == 2}" :to="{path: '/shopCart',query:{}}">
              <div>
                <div><img :src="shopCart" alt=""></div>
                <span>购物车</span>
                <i v-if="$store.state.cart.shopCartNum > 0">{{$store.state.cart.shopCartNum > 99 ? '99+' : $store.state.cart.shopCartNum}}</i>
              </div>
            </router-link>
            <div @click="jumpService" :class="{'navbar':true, 'active': navFlag == 3}" :to="{path: '/service',query:{}}">
              <div>
                <div><img :src="service" alt=""></div>
                <span>客服</span>
              </div>
            </div>
            <router-link :class="{'navbar':true, 'active': navFlag == 4}" :to="{path: '/mine',query:{}}">
              <div>
                <div><img :src="mine" alt=""></div>
                <span>我的</span>
              </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import index from '../../assets/img/index.png'
import classify from '../../assets/img/classify.png'
import shopCart from '../../assets/img/shopCart.png'
import service from '../../assets/img/service.png'
import mine from '../../assets/img/mine.png'

import index_active from '../../assets/img/index-active.png'
import classify_active from '../../assets/img/classify-active.png'
import shopCart_active from '../../assets/img/shopCart-active.png'
import service_active from '../../assets/img/service-active.png'
import mine_active from '../../assets/img/mine-active.png'



export default {
  name: 'entrance',
  data(){
    return{
      index: index,
      classify: classify,
      shopCart: shopCart,
      service: service,
      mine: mine,
      navFlag: 0
    }
  },
  methods:{
    jumpService(e){
      if(this.$store.state.login.userId){
        window.location.href = "https://tb.53kf.com/code/app/10157687/1";
      }else{
        this.$router.push({
          path: '/loginBypassword',
          query: {}
        })
      }
    }, 
    routeWatch(name){
      switch(name){
        case 'index':
          this.index = index_active;
          this.classify = classify;
          this.shopCart = shopCart;
          this.service = service;
          this.mine = mine;
          this.navFlag = 0;
          break;
        case 'product':
          this.index = index;
          this.classify = classify_active;
          this.shopCart = shopCart;
          this.service = service;
          this.mine = mine;
          this.navFlag = 1;
          break;
        case 'cart':
           this.index = index;
          this.classify = classify;
          this.shopCart = shopCart_active;
          this.service = service;
          this.mine = mine;
          this.navFlag = 2;
          break;
        case 'requirementList':
           this.index = index;
          this.classify = classify;
          this.shopCart = shopCart_active;
          this.service = service;
          this.mine = mine;
          this.navFlag = 2;
          break;
        case 'service':
          this.index = index;
          this.classify = classify;
          this.shopCart = shopCart;
          this.service = service_active;
          this.mine = mine;
          this.navFlag = 3;
          break;
        case 'mine':
          this.index = index;
          this.classify = classify;
          this.shopCart = shopCart;
          this.service = service;
          this.mine = mine_active;
          this.navFlag = 4;
          break;
        default:
          break;
      }
    },
    jumpShopCart(){
       this.$store.commit('type',0);
    }
  },
  watch:{
    '$route' (to, from){
      console.log(to.name)
      this.routeWatch(to.name);
    }
  },
  mounted(){
    this.routeWatch(this.$route.name);
    this.$common.getShopCarNum(0);
  }
}
</script>
<style lang="less">
  .fixed{
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 98px;
    background-color: #fff;
    display: flex;
    align-items: center;
    .navbar{
      display: inline-block;
      width: 20%;
      text-align: center;
      div{
        position: relative;
        div{
          width: 40px;
          height: 40px;
          margin: 0 auto;
          img{
            display: block;
          }
        }
        span{
          display: block;
          font-size: 22px;
          color: #666666;
          margin-top: 8px;
        }
        i{
          position: absolute;
          right: 25px;
          top: -24px;
          height: 48px;
          min-width: 48px;
          font-size: 40px;
          color: #ff6f26;
          border: 4px solid #ff6f26;
          line-height: 48px;
          font-style: normal;
          border-radius: 26px;
          transform: scale(0.5);
          background: #fff;
        }
      }
    }
    .active{
      div{
        span{
          color: #3ac756;
        } 
      }
     
    }
  }
</style>
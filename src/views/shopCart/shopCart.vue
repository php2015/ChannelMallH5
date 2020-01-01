<template>
  <div class="shopCart">
    <div class="shopCart-wrap">
      <div class="shopCart-empty"></div>
      <div class="shopCart-link">
        <div @click="typeFunc(0)" :class="{'shopCart-link-a': $store.state.cart.type == 0}"><div>购物车</div></div>
        <div @click="typeFunc(1)" :class="{'shopCart-link-a': $store.state.cart.type == 1}"><div>需求清单</div></div>
      </div>
      <div class="shopCart-edit" @click="editFunc">
        <span v-if="$store.state.cart.edit == 0">编辑</span>
        <span v-if="$store.state.cart.edit == 1">完成</span>
      </div>
    </div>

    <div v-if="$store.state.cart.type == 0" class="bb">
      <shopCartIndex/>
    </div>

    <div v-if="$store.state.cart.type == 1" class="aa">
      <requirementList/>
    </div>

    <div><favorite ref="favoriteRef"/> </div>
    <div class="shopCart-div"></div>
  </div>
</template>
<script>
import favorite from '../../components/mine/favorite'
import requirementList from './requirementList'
import shopCartIndex from './shopCartIndex'
export default {
  name: 'cart',
  data(){
    return {
      
    }
  },
  computed:{
    edit(){
       return this.$store.state.cart.edit;
    }
  },
  components:{
    favorite,
    requirementList,
    shopCartIndex
  },
  methods:{
    typeFunc(type){
      this.$store.commit('type',type);  
      this.$store.commit('edit',0);
    },
    editFunc(){
      if(this.$store.state.cart.edit == 0){
        this.$store.commit('edit',1);
      }else if(this.$store.state.cart.edit == 1){
        this.$store.commit('edit',0);
      }
    }
  },
  mounted(){
    this.$refs.favoriteRef.isAjaxFun();
  }
}
</script>
<style lang="less">
  .shopCart{
    .showCart-wrap-div{
      height: 88px;
    }
    .shopCart-div{
       height: 232px;
     }
    .shopCart-wrap{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 88px;
      background: #fff;
      padding: 0 30px;
      box-sizing: border-box;
      .shopCart-link{
        display: flex;
        flex: 1;
        justify-content: center;
        &>div{
          color: #ffaf41;
          box-sizing: border-box;
          &.shopCart-link-a{
            background-color: #ffaf41;
            color: #fff;
            div{
              color: #fff !important;
            }
          }
          &:first-child{
            border-radius: 29px 0px 0px 29px;
            border: solid 1px #ffaf41;
            div{  
              width: 180px;
              height: 58px;
              text-align: center;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 30px;
              color: #ffaf41;
            }
          }
          &:last-child{
            border-radius: 0px 29px 29px 0px;
            border: solid 1px #ffaf41;
            div{
              width: 180px;
              height: 58px;
              text-align: center;
              display: flex;
              justify-content: center;
              font-size: 30px;
              align-items: center;
              color: #ffaf41;
            }
          }
        }
        .router-link-exact-active{
          background-color: #ffaf41;
          color: #fff;
          div{
            color: #fff !important;
          }
        }
      }
      .shopCart-empty{
        width: 55px;
      }
      .shopCart-edit{
        color: #333333;
      }
    } 
  }
</style>
<template>
    <div class="fixedIcon">
        <div v-if="$store.state.login.channelNum == 2" @click="JumpShopCart">
            <img src="../../assets/img/cart_num_btn.png" alt="">
        </div>
        <div v-if="$store.state.login.channelNum == 2" @click="JumpOrderList">
            <img src="../../assets/img/drug.png" alt="">
        </div>
        <div v-if="topActive" @click="JumpTop"><img src="../../assets/img/top.png" alt=""></div>
    </div>
</template> 
<script>
    export default{
        props: ['tip'],
        data(){
            return{
                topActive: false
            }
        },
        methods:{
            JumpShopCart(){   //跳转到购物车  
                this.$store.commit('type',0);

                if(!this.$common.isLogin()) return false;

                if(this.$store.state.login.channelNum == 2){
                    JsBridge.callMethod(
                        "showPage", {
                            url: this.$api.baseUrl+`/ybH5/shopCart`,
                            type: 1
                    });
                    return false;
                }

                this.$router.push({
                    path: 'shopCart',
                    query: {}
                })
            },
            JumpOrderList(){
                if(!this.$common.isLogin()) return false;

                if(this.$store.state.login.channelNum == 2){
                    JsBridge.callMethod(
                        "showPage", {
                            url: this.$api.baseUrl+`/ybH5/orderList?orderType=`,
                            type: 1
                    });
                    return false;
                }
                
                this.$router.push({
                    path: 'orderList',
                    query: {
                        orderType: ''
                    }
                })
            },
            JumpTop(){
                document.documentElement.scrollTop = 0;
                document.body.scrollTop = 0;
            },
            scrollToTop () {
                let scrollHeight =  document.documentElement.scrollTop || document.body.scrollTop;
                if (scrollHeight > 60) {
                    this.topActive = true
                } else {
                    this.topActive = false
                }
            },
        },
        mounted(){
             window.addEventListener('scroll', this.scrollToTop, true)
        }
    }
</script>  
<style lang="less">
    .fixedIcon{
       position: fixed;
       bottom: 150px;
       left: 30px;
       z-index: 10000;
       div{
           display: block;
           width: 90px;
           height: 90px;
           border-radius: 100%;
           margin-top: 15px;
       }
    }
</style>
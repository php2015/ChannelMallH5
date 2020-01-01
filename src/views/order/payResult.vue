<template>
    <div class="payResult" v-wechat-title="$route.meta.title"  img-set="./static/img/favicon.ico">
        <div class="payResult-header">
           <div class="payResult-pic">
                <span class="success" v-if="isPay == 1 || isPay == 2"><img src="../../assets/img/pay-success.png" alt=""></span>
                <span class="fail" v-if="isPay == 0"><img src="../../assets/img/fail.png" alt=""></span>
                <div class="payResult-pic-word" v-text="payWord"></div>
                <div class="payResult-pic-tip" v-if="isPay == 1">您的包裹正整装待发</div>
           </div>
           <div class="payResult-address" v-if="receivingSite != null">
               <div class="payResult-address-pic">
                   <img src="../../assets/img/confirm-address.png" alt="">
               </div>
               <div class="payResult-address-wrap">
                   <div>
                       <span v-text="receivingSite.name"></span>
                       <span v-text="receivingSite.phone"></span>
                   </div>
                   <div>{{receivingSite.provinceName}}{{receivingSite.cityName}}{{receivingSite.districtName}}{{receivingSite.address}}</div>
               </div>
           </div>
        </div>
        <div class="payResult-btn">
            <div v-if="isPay == 0" @click="goPay" class="goPay">继续支付</div>
            <div @click="jumpIndex" class="goIndex">返回首页</div>
            <div @click="jumpOrderDetail" class="goOver">查看订单</div>
        </div>
    </div>
</template>
<script>
import { Toast } from 'vant';
export default {
    name: 'payResult',
    data(){
        return{
            isPay: 2,
            payWord: '支付中,请稍等',
            receivingSite: null
        }
    },  
    watch: {
        isPay(newVal){
            if(newVal == 0){
                this.payWord = '支付失败'
            }else if(newVal == 2){
                 this.payWord = '支付中,请稍等'
            }else if(newVal == 1){
                this.payWord = '支付成功'
            }
        }
    },
    methods:{
        isPayRequest(){
            let params = {
                header: {},
                body: {
                    orderId: this.$route.query.orderId
                }
            }
            this.$api.isPay(params).then(res => {
                console.log(res);
                if(res.code == 0){
                    this.isPay = res.data.isPay;
                    this.receivingSite = res.data.receivingSite;
                    if(res.data.isPay == 0){
                        //Toast('支付失败');
                    }else{
                        Toast('支付成功');
                        setTimeout(()=>{
                            this.$router.replace({
                                path: '/orderDetail',
                                query: {
                                    orderId: this.$route.query.orderId
                                }
                            })
                        },2000)  
                    }
                }
            })
        },
        //继续支付
        goPay(){
            this.$router.replace({
                path: '/pay',
                query: {
                    orderId: this.$route.query.orderId
                }
            });
        },
        //跳转首页
        jumpIndex(){
            this.$router.replace({path: "/",query:{}});
        },
        //完成支付，跳转订单详情
        jumpOrderDetail(){
            this.$router.replace({
                path: '/orderDetail',
                query: {
                    orderId: this.$route.query.orderId
                }
            })
        }
    },
    mounted(){
        setTimeout(()=>{
            this.isPayRequest();  
        },2000);
    }
}
</script>
<style lang="less">
    .payResult{
        .payResult-header{
            background: #fff;
            border-radius: 8px;
            margin: 21px 30px 0;
            padding-bottom: 36px;
            .payResult-pic{
                span{
                    &.success{
                        display: block;
                        width: 167px;
                        height: 142px;
                        margin: 0 auto;
                        padding-top: 62px;
                    }
                    &.fail{
                        display: block;
                        width: 142px;
                        height: 142px;
                        margin: 0 auto;
                        padding-top: 62px;
                    }
                }
                .payResult-pic-word{
                    font-size: 32px;
                    font-weight: 600;
                    color: #333;
                    text-align: center;
                    margin: 22px 0;
                }
                .payResult-pic-tip{
                    text-align: center;
                    padding-bottom: 41px;
                }
            }
            .payResult-address{
                background: rgba(246, 248, 250, 0.5);
                border-radius: 8px;
                display: flex;
                margin: 0 20px;
                align-items: center;
                padding: 32px 0 32px 22px;
                .payResult-address-pic{
                    width: 31px;
                    height: 32px;
                    margin: 0 23px 0 30px;
                    flex-shrink: 0;
                }
                .payResult-address-wrap{
                    border-left: solid 2px #ebebeb;
                    padding-left: 22px;
                    flex-grow: 2;
                    div{
                        &:first-child{
                            span{
                                &:first-child{
                                    font-size: 32px;
                                    font-weight: 600;
                                }
                                &:last-child{
                                    font-size: 28px;
                                    font-weight: 600;
                                }
                            }
                        }
                        &:last-child{
                            color: #666666;
                            margin-top: 16px;
                        }
                    }
                }
            }
        }
        .payResult-btn{
            display: flex;
            justify-content: center;
            div{
                display: flex;
                justify-content: center;
                align-items: center;
                width: 210px;
                height: 72px;
                margin: 54px 15px 0;
                border-radius: 35px;
                &.goPay{
                    border: solid 1px #d2d2d4;
                     box-sizing: border-box;
                    color: #333;
                }
                &.goIndex{
                    color: #fff;
                    border: none;
                    color: #ff6e26;
                    border: 2px solid #ff6e26;
                    box-sizing: border-box;
                }
                &.goOver{
                    background-image: linear-gradient(90deg, 
                        #ffaf41 0%, 
                        #ff8441 100%), 
                    linear-gradient(
                        #f89283, 
                        #f89283);
                    background-blend-mode: normal, 
                        normal;
                    border-radius: 35px;
                    
                    color: #fff;
                }
            }
        }
    }
</style>
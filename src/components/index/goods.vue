<template>
    <div>
        <div class="goods"  @click="jumpProductDetail(item.channelCommId,item.columnCommId)">
            <div class="goods-pic">
                <img v-lazy="(item.imgUrl || '').split(';')[0]"  alt="">
            </div>
            <div class="goods-wrap">
                <div>
                    <div class="goods-wrap-name">
                        <span class="chu" v-if="item.isRx == 1"><img src="../../assets/img/Rx.png" alt=""></span>
                        <span :class="{'name': true, active:item.isRx == 1}" v-text="item.name"></span>
                    </div>
                    <div class="goods-wrap-tip" v-if="item.label">
                        <span v-for="(list,i) in (item.label || '').split('；')" :key="i"  v-text="list"></span>
                    </div>
                </div>
            </div>
            <div class="goods-other">
                <!-- 栏目 -->
                <div class="goods-price" v-if="item.columnId && item.specialPrice && item.originalPrice">
                    <span>{{item.specialPrice | pricePre}}</span>
                    <span>
                        <span>{{item.specialPrice | priceNext}}</span>
                        <span><img v-if="item.columnId && item.specialPrice" src="../../assets/img/tehui.png" alt=""></span>
                    </span>
                </div>
                <s v-if="item.columnId && item.specialPrice && item.originalPrice">{{item.originalPrice}}</s>

                <div class="goods-price" v-if="item.columnId && !item.specialPrice && item.originalPrice">
                    <span>{{item.salePrice | pricePre}}</span>
                    <span>
                        <span>{{item.salePrice | priceNext}}</span>
                        <span><img v-if="item.columnId && item.specialPrice" src="../../assets/img/tehui.png" alt=""></span>
                    </span>
                </div>
                <s v-if="item.columnId && !item.specialPrice && item.originalPrice">{{item.originalPrice}}</s>

                <div class="goods-price" v-if="item.columnId && item.specialPrice && !item.originalPrice">
                    <span>{{item.specialPrice | pricePre}}</span>
                    <span>
                        <span>{{item.specialPrice | priceNext}}</span>
                        <span><img v-if="item.columnId && item.specialPrice" src="../../assets/img/tehui.png" alt=""></span>
                    </span>
                </div>
                <s v-if="item.columnId && item.specialPrice && !item.originalPrice">{{item.salePrice}}</s>


                <div class="goods-price" v-if="item.columnId && !item.specialPrice && !item.originalPrice">
                    <span>{{item.salePrice | pricePre}}</span>
                    <span>
                        <span>{{item.salePrice | priceNext}}</span>
                        <span><img v-if="item.columnId && item.specialPrice" src="../../assets/img/tehui.png" alt=""></span>
                    </span>
                </div>

                <!-- 渠道 -->
                <div class="goods-price" v-if="!item.columnId && item.originalPrice">
                    <span>{{item.salePrice | pricePre}}</span>
                    <span>
                        <span>{{item.salePrice | priceNext}}</span>
                        <span></span>
                    </span>
                </div>
                <s v-if="!item.columnId && item.originalPrice">{{item.originalPrice}}</s>

                <div class="goods-price" v-if="!item.columnId && !item.originalPrice">
                    <span>{{item.salePrice | pricePre}}</span>
                    <span>
                        <span>{{item.salePrice | priceNext}}</span>
                        <span></span>
                    </span>
                </div>

                <div class="goods-shopCart">
                    <span v-if="item.isRx != 1&&addCar" @click.stop="addShopCart(item.columnId,item.originalPrice,item.salePrice,item.specialPrice,item.channelCommId,item.columnCommId,item.isRx)"><img src="../../assets/img/add_shopCart.png" alt=""></span>
                </div>
            </div>
        </div>
    </div>
    
</template> 
<script>
import Vue from 'vue';
import { Lazyload, Toast} from 'vant';
Vue.use(Lazyload, {
  loading:require("@/assets/img/lazy_icon1.png"),
  error:require("@/assets/img/lazy_icon1.png"),
  naturalWidth: '100px',
  naturalHeight: '100px'
});
export default{
    props: {item: Object,addCar:{
        default: true
    }},
    data(){
        return{

        }
    },
    filters: {
        pricePre(value) {
            var val = parseInt(value);
            return val;
        },
        priceNext(value) {
            var val = "." + String(parseFloat(value).toFixed(2)).split(".")[1];
            return val;
        }
    },
    methods:{
        jumpProductDetail(channelCommClassiId,columnCommId){ 
            if(this.$store.state.login.channelNum == 2){  //兼容联享家 
                if(this.$route.name != 'index') return false;
                let that = this;
                let flag = JsBridge.callMethod(
                "showPage", {
                    url: that.$api.baseUrl+`/ybH5/productDetail?id=${channelCommClassiId}&columnCommId=${columnCommId}`,
                    type: 1
                });
                if(!flag){
                    this.$router.push({
                        path:"/productDetail",
                        query: {
                            id:channelCommClassiId,
                            columnCommId
                        }
                    });
                }
                return false;
            }

            this.$router.push({
                path:"/productDetail",
                query: {
                    id:channelCommClassiId,
                    columnCommId
                }
            });
        },
        addShopCart(columnId,originalPrice,salePrice,specialPrice,channelCommId,columnCommId,isRx){
            if(!this.$common.isLogin()) return false;
            if(this.item.inventory < 1){
                Toast('库存不足');
                return false;
            }
            if(this.$route.name == 'cart'){
                this.$common.addShopCart(columnId,originalPrice,salePrice,specialPrice,channelCommId,columnCommId,isRx).then(res=>{
                    console.log(res);
                    this.$store.commit('getCartData',true);
                });
            }else{
                this.$common.addShopCart(columnId,originalPrice,salePrice,specialPrice,channelCommId,columnCommId,isRx);
            }
        }
    }
}
</script>
<style lang="less">
    .goods{
        width: 340px;
        background: #fff;
        border-radius: 12px;
        overflow: hidden;
        .goods-pic{
            width: 340px;
            height: 340px;
        }
        .goods-wrap{
            padding: 0 20px;
            height: 100px;
            .goods-wrap-name{
                overflow: hidden;
                position: relative;
                span{
                    &.chu{
                        display: inline-block;
                        width: 32px;
                        height: 26px;
                        padding-bottom: 5px;
                        position: absolute;
                        top: 0px;
                        left: 0;
                    }
                    &.name{
                        padding-top: 2px;
                        overflow : hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        line-height: 35px;
                    }
                    &.active{
                        text-indent: 36px;
                    }
                }
            }
            .goods-wrap-tip{
                span{
                    font-size: 20px;
                    color: #aeafb2;
                    margin-right: 10px;
                }
                
            }
        }
        .goods-other{
            display: flex;
            align-items: center;
            padding: 0 20px;
            margin-top: 35px;
            .goods-price{
                flex-shrink: 0;
                &>span{
                    
                    &:first-child{
                        font-size: 32px;
                        color: #ff6e26;
                        &::before{
                            content: "￥";
                            font-size: 24px;
                            margin-right: -4px;
                        }
                    }
                    &:last-child{
                        font-size: 24px;
                        margin-left: -5px;
                        position: relative;
                        span{
                            &:first-child{
                                color: #ff6e26;
                            }
                            &:last-child{
                                position: absolute;
                                top: -34px;
                                left: 10px;
                                width: 46px;
                                height: 24px;
                            }
                        }
                    }
                }
            }
            s{
                 flex-shrink: 0;
                font-size: 24px;
                color: #d0d0d0;
                padding-bottom: 2px;
                margin-left: 5px;
            }
            .goods-shopCart{
                flex-grow: 2;
                display: flex;
                justify-content: flex-end; 
                height: 59px;
                span{
                    width: 64px;
                    height: 64px;
                    padding: 16px;
                    margin-top: -5px;
                    margin-right: -16px;
                    box-sizing: border-box;
                }
                
            }
        }
    }
</style>
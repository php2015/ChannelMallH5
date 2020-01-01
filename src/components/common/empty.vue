<template>
    <div class="empty">
        <span><img src="../../assets/img/empty.png" alt=""></span>
        <div>{{tip}}</div>
    </div>
</template> 
<script>
    export default{
        props: ['tip'],
        mounted(){
            console.log(this.tip)
        }
    }
</script>  
<style lang="less">
    .empty{
        span{
            display: block;
            width: 300px;
            height: 192px;
            margin: 96px auto 0;
        }
        div{
            text-align: center;
            font-size: 24px;
            color: #aeafb2;
            margin-top: 37px;
        }
    }
</style>
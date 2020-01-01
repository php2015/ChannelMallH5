import Vue from 'vue'
import axios from 'axios'
import store from '../store/index'
import * as init from '../assets/js/init' 
import router from '@/router/index'
import {Toast} from 'vant'
const service = axios.create({
    timeout: 600000                //请求超时时间
});
var overTokenFlag = store.state.login.overTokenFlag;

service.interceptors.request.use(config => {
    //获取渠道id
    let channelId = router.history.current.query.channelId;
    store.commit('channelId',channelId);   
    //获取渠道token
    let token = localStorage.getItem('token');
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
},error => {
    Rromise.reject(error)
});

service.interceptors.response.use(response => {
    
    return response.data;          //返回数据
},error => {  
    if (error == 'Error: Request failed with status code 401') {
        //store.commit('token',''); 

        //store.commit("overTokenFlag",2);
        //let phone = store.state.login.phone;
        // init.getToken(phone).then(res=>{
        //     Toast('令牌失效，已重新登录');
        //     setTimeout(()=>{
        //         router.replace({
        //             path: '/',
        //             query: {}
        //         })
        //     },1000)
           
        // });    

        
    }
    return Promise.reject(error)
})

export default service
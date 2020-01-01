import Vue from 'vue'
import api from '../../api/index'
import store from '../../store/index'
import * as common from './common'
import {Toast} from 'vant'
Vue.use(Toast)

export const lxjlogin = function(token){
    if(!token) return false;
    if(token.indexOf('_') != -1){
        store.commit('phone','');
        store.commit('token','');
        store.commit('userId','');
        store.commit('userName','');
        return false;
    } 
    return new Promise((resolve,reject)=>{
        let params ={
            header: {},
            body: {
                token,
                opendId: null
            }
        }
        console.log(params);
        store.commit('phone','');
        store.commit('token','');
        store.commit('userId','');
        store.commit('userName','');
        console.log('清除旧token')
        api.lxjlogin(params).then(res =>{
            if(res.code == 0){    
                console.log(res);
                setTimeout(()=>{
                    store.commit('phone',res.data.phone);
                    getToken(res.data.phone);
                },10)  
                
                resolve(true);
            }else{
                reject(false);
            }
        }) 
    })
}

export const getToken = function(phone){
    return new Promise((resolve,reject)=>{
        let params ={
            header: {},
            body: {
                phone
            }
        }
        console.log(params);
        console.log('获取南风医生token')
        api.getToken(params).then(res =>{
            if(res.code == 0){    
                console.log(res);
                store.commit('userId',res.data.userId);
                store.commit('userName',res.data.userName);
                store.commit('token',res.data.access_token);
                console.log('更新南风医生token');
                common.getShopCarNum(0);
                common.getShopCarNum(1);
                resolve(true)
            }else{
                reject(false)
            }
        }) 
    })
}

//联想家渠道获取token值
var defining = {
    setTokenSync: function(token) {
        lxjlogin(token);
    }
};

Object.keys(defining).forEach(key => {
    window[key] = defining[key];
});
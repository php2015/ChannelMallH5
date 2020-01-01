// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import '../static/css/common.css'

Vue.config.productionTip = false

import 'lib-flexible/flexible.js'

import  VConsole  from  'vconsole'
const  vConsole = new VConsole() ;

import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)            //改变title

import {NavBar , NoticeBar, ActionSheet ,Toast} from 'vant';
Vue.use(NavBar );//导航栏
Vue.use(NoticeBar);//通知栏
Vue.use(ActionSheet);//弹框
Vue.use(Toast); //提示

import api from './api/index.js'
Vue.prototype.$api = api          //使用接口

import * as common from './assets/js/common.js'
Vue.prototype.$common = common

import * as init from './assets/js/init.js' //初始化加载
Vue.prototype.$init = init

import {uploadImg} from './assets/js/compressImg.js' //挂载全局图片压缩上传
Vue.prototype.$uploadImg = uploadImg

import './assets/jsBridge/lxjJsBridge'

init.lxjlogin(common.getURLParameter('token'));

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

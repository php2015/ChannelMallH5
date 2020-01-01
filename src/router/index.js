import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: 'ybH5',
  routes: [{
    path: '/',
    component: () =>
      import('@/App'),
      children: [{
      path: '/',

      component: () =>
        import('@/views/entrance/entrance'),
      children: [{
        path: '/',
        name: 'index',

        component: () =>
          import('@/views/index/index'),
        meta: {
          title: '南风医生药房'
        }
      },
      {
        path: 'product',
        name: 'product',
        component: () =>
          import('@/views/product/product'),
        meta: {
          title: '分类'
        }
      },
      {
        path: 'shopCart',
        name: 'cart',
        component: () =>
          import('@/views/shopCart/shopCart'),
          meta: {
            title: '购物车',
            login: true,
          }
      },
      {
        path: 'service',
        name: 'service',
        component: () =>
          import('@/views/service/service'),
        meta: {
          title: '客服'
        }
      },
      {
        path: 'mine',
        name: 'mine',
        component: () =>
          import('@/views/mine/mine'),
        meta: {
          login: true,
          title: '我的'
        }
      }
      ]
    },
    {
      path: '/specialList',
      name: 'specialList',
      component: () =>
        import('@/views/product/specialList'),
      meta: {
        title: '限时特惠'
      }
    },
    {
      path: '/serach',
      name: 'serach',
      component: () =>
        import('@/views/product/search'),
      meta: {
        title: '搜索'
      }
    },
    {
      path: '/productDetail',
      name: 'productDetail',
      component: () =>
        import('@/views/product/productDetail'),
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/useDrugInfo',
      name: 'useDrugInfo',
      component: () =>
        import('@/views/inquiry/useDrugInfo'),
      meta: {
        login: true,
        title: '用药人信息'
      }
    },
    {
      path: '/condition',
      name: 'condition',
      component: () =>
        import('@/views/inquiry/condition'),
      meta: {
        login: true,
        title: '病情描述'
      }
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      component: () =>
        import('@/views/order/comfirmOrder'),
      meta: {
        login: true,
        title: '确认订单'
      }
    },
    {
      path: '/pay',
      name: 'pay',
      component: () =>
        import('@/views/order/pay'),
      meta: {
        title: '支付'
      }
    },
    {
      path: '/payResult',
      name: 'payResult',
      component: () =>
        import('@/views/order/payResult'),
      meta: {
        login: true,
        title: '支付结果'
      }
    },
    {
      path: '/between',
      name: 'between',
      component: () =>
        import('@/views/order/between'),
      meta: {
        title: '南风医生欢迎您'
      }
    },
    {
      path: '/addressList',
      name: 'addressList',
      component: () =>
        import('@/views/address/addressList'),
      meta: {
        login: true,
        title: '地址列表'
      }
    },
    {
      path: '/addressEdit',
      name: 'addressEdit',
      component: () =>
        import('@/views/address/addressEdit'),
      meta: {
        login: true,
        title: '编辑地址'
      }
    },
    {
      path: '/saleAfterList',
      name: 'saleAfterList',
      component: () =>
        import('@/views/service/saleAfterList'),
      meta: {
        login: true,
        title: '售后列表'
      }
    },
    {
      path: '/saleAfter',
      name: 'saleAfter',
      component: () =>
        import('@/views/service/saleAfter'),
      meta: {
        login: true,
        title: '售后申请'
      }
    },
    {
      path: '/saleAfterDetail',
      name: 'saleAfterDetail',
      component: () =>
        import('@/views/service/saleAfterDetail'),
      meta: {
        login: true,
        title: '售后详情'
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: () =>
        import('@/views/chat/chat'),
      meta: {
        login: true,
        title: '问诊'
      }
    },
    {
      path: '/patientInfo',
      name: 'patientInfo',
      component: () => import('@/views/chat/patientInfo'),
      meta: {
        login: true,
        title: '患者信息'
      }
    },
    {
      path: '/prescriptionDetail',
      name: 'prescriptionDetail',
      component: () => import('@/views/chat/prescriptionDetail'),
      meta: {
        login: true,
        title: '处方笺'
      }
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: () => import('@/views/order/orderList'),
      meta: {
        login: true,
        title: '订单列表'
      }
    },
    {
      path: '/orderDetail',
      name: 'orderDetail',
      component: () =>
        import('@/views/order/orderDetail'),
      meta: {
        login: true,
        title: '订单详情'
      }
    },
    {
      path: '/confirmGoodsResult',
      name: 'confirmGoodsResult',
      component: () =>
        import('@/views/order/confirmGoodsResult'),
      meta: {
        login: true,
        title: '收货成功'
      }
    },   
    {
      path: '/evaluate',
      name: 'evaluate',
      component: () =>
        import('@/views/order/evaluate'),
      meta: {
        login: true,
        title: '评价'
      }
    },
    {
      path: '/expressList',
      name: 'expressList',
      component: () =>
        import('@/views/order/expressList'),
      meta: {
        login: true,
        title: '物流包裹'
      }
    },
    {
      path: '/express',
      name: 'express',
      component: () =>
        import('@/views/order/express'),
      meta: {
        login: true,
        title: '物流详情'
      }
    },
    {
      path: '/editPersonalInfo',
      name: 'editPersonalInfo',
      component: () => import('@/views/mine/editPersonalInfo'),
      meta: {
        login: true,
        title: '个人资料'
      }
    },
    {
      path: '/editInput',
      name: 'editInput',
      component: () => import('@/views/mine/editInput'),
      meta: {
        login: true,
        title: '编辑'
      }
    },
    {
      path: '/message',
      name: 'message',
      component: () => import('@/views/mine/message'),
      meta: {
        login: true,
        title: '消息'
      }
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      component: () => import('@/views/mine/aboutUs'),
      meta: {
        title: '关于我们'
      }
    },
    {
      path: '/loginBypassword',
      name: 'loginBypassword',
      component: () => import('@/views/login/loginBypassword'),
      meta: {
        title: '账号密码登录'
      }
    },
    {
      path: '/loginByMessage',
      name: 'loginByMessage',
      component: () => import('@/views/login/loginByMessage'),
      meta: {
        title: '快捷登录'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/login/register'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/reset',
      name: 'reset',
      component: () => import('@/views/login/reset'),
      meta: {
        title: '重置密码'
      }
    }
    ]
  }]
})

import {isgGetWXRequestUrl} from '../assets/js/common.js'
router.beforeEach((to, from, next) => {
  let newuserId=localStorage.getItem('userId');
  let newuserIds=store.state.login.userId;
  console.log(newuserId,newuserIds)
    if (newuserId!=''&&newuserId!=null&&newuserId!='undefined'&&newuserId!=newuserIds&&navigator.userAgent.toLowerCase().match(/MicroMessenger/i) =="micromessenger") {//微信环境判断localStorage问题
      window.location.reload()
      return false;
    }
  if(to.meta.login){     
    if(store.state.login.userId){
      next();
      return false;
    }
    if(store.state.login.channelNum == 2){
      if(!store.state.login.token){
        JsBridge.callMethod("showNativeLogin", '');
      }
     
      next(false);
      return false;
    }
    isgGetWXRequestUrl().then((isNeed)=>{
      if (isNeed) {
        next({name: 'loginBypassword'});
      }
    })
  }else{
    next();
  }
  if(store.state.login.channelNum == 2){
    JsBridge.callMethod("setTitle", {
      title: to.meta.title
    });
  }
  
});

export default router;

import Vue from 'vue'
import api from '../../api/index'
import store from '../../store/index'
import { Toast } from 'vant'
import router from '../../router'
Vue.use(Toast)


/**
 * 
 * @param {*} type 购物车类型：0购物车 1需求清单
 */
export const getShopCarNum = function (type) {   //获取购物车数量
    let params = {
        header: {},
        body: {
            userId: store.state.login.userId,
            type: type
        }
    }
    api.getShopCarNum(params).then(res => {
        if (res.code == 0) {
            if (type == 0)
                store.commit('shopCartNum', res.data.qty);
            if (type == 1)
                store.commit('requerementNum', res.data.qty);
        }
    })
}

/**
 * 
 * @param {*} name 获取Url参数
 */
export const GetURLParameter = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 加入购物车
 * @param {*} columnId      栏目id
 * @param {*} originalPrice 划线价
 * @param {*} salePrice     销售价
 * @param {*} specialPrice  特惠价
 * @param {*} channelCommId 渠道商城id
 * @param {*} columnCommId  栏目id
 * @param {*} isRx          是否是处方药
 */
export const addShopCart = function (columnId = '', originalPrice, salePrice, specialPrice, channelCommId, columnCommId = '', isRx) {
    return new Promise((resolve, reject) => {
        var addPrice = 0;
        var columnId = columnId;
        var originalPrice = originalPrice;
        var salePrice = salePrice;
        var specialPrice = specialPrice;
        if (columnId) {
            if (specialPrice && salePrice) {
                addPrice = specialPrice;
            } else if (!specialPrice && salePrice) {
                addPrice = salePrice;
            } else {
                addPrice = salePrice;
            }
        } else {
            addPrice = salePrice
        }
        let params = {
            header: {},
            body: {
                channelCommId: channelCommId,
                columnCommId: columnCommId,
                qty: 1,
                userId: store.state.login.userId,
                selected: 0,
                addPrice: addPrice,
                isRx: isRx
            }
        }
        console.log(params);
        api.saveComm(params).then(res => {
            if (res.code == 0 && res.data.qty) {
                if (isRx == 0) {
                    Toast("成功添加到购物车");
                    store.commit("shopCartNum", res.data.qty);
                } else {
                    Toast("成功添加到需求清单");
                    store.commit("requerementNum", res.data.qty);
                }
                resolve(true);

            } else {
                Toast(res.message);
                reject(false);
            }
        })
    })

}

/**
 * 
 * @param {*} userName 用户名
 * @param {*} codeType 
 * @param {*} phone    手机号 1为短信登录 2时注册短信 3忘记密码 4微信绑定手机
 */
export const sendMesForReg = function (userName, codeType, phone) {
    return new Promise((resolve, reject) => {
        let params = {
            header: {},
            body: {
                userName,
                codeType,
                phone
            }
        }
        api.sendMesForReg(params).then(res => {
            if (res.code == 0) {
                Toast('信息已发送，请注意查收');
                resolve(true);
            } else {
                Toast(res.message);
                resolve(false);
            }
        })
    })

}

/**
 * 
 * @param {*} name 传入解析的参数
 */
export const getURLParameter = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

/**
 * 判断是否已登录
 */
export const isLogin = function () {
    if (store.state.login.userId && store.state.login.token) {
        return true;
    }
    console.log(store.state.login);
    if (store.state.login.channelNum == 2) {
        JsBridge.callMethod("showNativeLogin", '');
        return false;
    }
    router.push('loginBypassword');
    return false;
}

/**
 * 微信静默授权
 */
export const isgGetWXRequestUrl = function () {
    return new Promise((resolve, reject) => {
        if (
            navigator.userAgent.toLowerCase().match(/MicroMessenger/i) ==
            "micromessenger"
        ) {
            if (
                store.state.login.openId &&
                store.state.login.openId != ""
            ) {
                resolve(true);
            } else {
                resolve(false);
                let params = {
                    header: {},
                    body: {
                        redirectUrl:
                        window.location.protocol +'//'+ window.location.host+"/ybH5/loginBypassword",
                        state: ""
                    }
                };
                api.getWXRequestUrl(params).then(res => {
                    if (res.code == 0) {
                        setTimeout(() => {
                            // window.location.href = res.data.resultUrl.split("#")[0]+'&connect_redirect=1'+'#wechat_redirect';
                            window.location.replace(
                                res.data.resultUrl.split("#")[0] +
                                "&connect_redirect=1" +
                                "#wechat_redirect"
                            );
                            // window.location.href = res.data.payUrl;
                        }, 50);
                    }
                });
            }
        } else {
            resolve(true);
        }
    })
}

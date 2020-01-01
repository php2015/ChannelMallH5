import Vue from 'vue'
import Vuex from 'vuex'
import chat from './modules/chat'
import login from './modules/login'
import cart from './modules/cart'
import orderConfirm from './modules/orderConfirm'
import other from './modules/other'
Vue.use(Vuex)

const modules = {
    chat,
    login,
    cart,
    orderConfirm,
    other
}

const state = {
    chatState: '0', // 判断用户是否正在聊天会话~默认为0表示没有会话,1表示存在会话状态
    chatObject: '0', // 判断用户是否正在与谁聊天会话~默认为0表示与健康管理师聊天中,1表示与专家团队医生聊天中,2表示与全科医生聊天
}

const getters = {}

const mutations = {}

const actions = {}

const store = new Vuex.Store({
    modules,
    state,
    getters,
    mutations,
    actions
});

export default store;
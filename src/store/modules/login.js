
export default {
    state: {
        userId: localStorage.userId || '',  
        token: localStorage.token || '',
        phone: localStorage.phone || '',
        userName: localStorage.userId || '',
        channelNum: localStorage.channelNum || 1,   //亿保1  联享家2
        overTokenFlag: 1,  
        header: {
            AppByClinicId: '90000',
            OsType: 'yb',
            Version: '0.0.01',
            time_stamp: new Date().getTime(),
            roleId: localStorage.userId || '',
            channelId: localStorage.channelId ? localStorage.channelId : 'yb',
            token: localStorage.token,
            userId: localStorage.userId
        },
        personInfo:localStorage.personInfo ? JSON.parse(localStorage.personInfo) : null,
        editPersonInfoData:{},
        sendMag: false,
        openId:localStorage.openId || '',
        appId:localStorage.appId || '',
    },
    getters: {},
    mutations: {
        openId(state, value) {
            localStorage.setItem('openId',value);
            state.openId = value;
        },
        appId(state, value) {
            localStorage.setItem('appId',value);
            state.appId = value;
        },
        userId(state, value) {
            localStorage.setItem('userId',value);
            state.userId = value;
        },
        token(state, value) {
            localStorage.setItem('token',value);
            state.token = value;
        },
        personInfo(state,data){
            localStorage.setItem('personInfo',JSON.stringify(data));
            state.personInfo = data;
        },
        editPersonInfoData(state,data){
            state.editPersonInfoData = data;
        },
        phone(state, value) {
            localStorage.setItem('phone',value);
            state.phone = value;
        },
        userName(state, value) {
            localStorage.setItem('userName',value);
            state.userName = value;
        },
        sendMag(state, value) {
            state.sendMag = value;
        },
        channelId(state,value){
            if(!value) return false;
            if(value == 'yb'){        //亿保
                localStorage.setItem('channelNum',1);
                state.channelNum = 1;
            }else if(value == 'lxj'){ //联享家
                localStorage.setItem('channelNum',2);
                state.channelNum = 2;
            }
            localStorage.setItem('channelId',value);
            state.header.channelId = value;
        },
        overTokenFlag(state, value) {
            localStorage.setItem('overTokenFlag',value);
            state.overTokenFlag = value;
        },
          
    },
    actions: {}
  };



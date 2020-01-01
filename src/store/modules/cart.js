export default {
    state: {
      type: sessionStorage.type != null ? sessionStorage.type : 0,
      shopCartNum: 0,
      requerementNum: 0,
      edit: 0,
      getCartData: false
    },
    getters: {},
    mutations: {
        type(state,data){   
            sessionStorage.setItem('type',data);
            state.type = data;
        },
        shopCartNum(state, data) {
            state.shopCartNum = data;
        },
        requerementNum(state, data) {
            state.requerementNum = data;
        },
        edit(state, data) {
            state.edit = data;
        },
        getCartData(state, data) {
            state.getCartData = data;
        }
    }
  };
  
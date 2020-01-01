export default {
    state: {
        searchFocusState: sessionStorage.searchFocusState ? Boolean(sessionStorage.searchFocusState ): true,
    },
    getters: {},
    mutations: {
        searchFocusState(state,data){
            sessionStorage.setItem('searchFocusState',data);
            state.searchFocusState = data;
        },
    },
    actions: {
 
    }
  };
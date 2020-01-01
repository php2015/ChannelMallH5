export default {
    state: {
        comList: sessionStorage.comList ? JSON.parse(sessionStorage.comList) : [],
        remark: sessionStorage.remark || '',
        editAddressData: sessionStorage.editAddressData ? JSON.parse(sessionStorage.editAddressData) : null,
        editAddressEdit: sessionStorage.editAddressEdit ? JSON.parse(sessionStorage.editAddressEdit) : null,
        patientInfo: sessionStorage.patientInfo ? JSON.parse(sessionStorage.patientInfo) : null,
    },
    getters: {},
    mutations: {
        comList(state,data){
            sessionStorage.setItem('comList',JSON.stringify(data));
            state.comList = data;
        },
        remark(state,data){
            sessionStorage.setItem('remark',data);
            state.remark = data;
        },
        setEditAddressData(state,data){
            sessionStorage.setItem('editAddressData',JSON.stringify(data));
            state.editAddressData = data;
        },
        editAddressEdit(state,data){
            sessionStorage.setItem('editAddressEdit',JSON.stringify(data));
            state.editAddressEdit = data;
        },
        patientInfo(state,data){
            sessionStorage.setItem('patientInfo',JSON.stringify(data));
            state.patientInfo = data;
        }
    },
    actions: {
 
    }
  };
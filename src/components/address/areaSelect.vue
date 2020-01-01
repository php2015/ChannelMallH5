
<template>
  <van-popup v-model="showModel" position="bottom">
    <van-area :area-list="areaList" :value="selectData.selectCode" @confirm="confirmFun" @cancel="cancelFun" />
  </van-popup>
</template>

<script>
import Vue from "vue";
import { Popup, Area } from "vant";
Vue.use(Popup).use(Area);

import areaList from "../../assets/areaDtaa";

export default {
  name: "noData-view",
  props: {
    selectData: {
      type: Object,
      default:{selectCode:''}
    }
  },
  data() {
    return {
      showModel: false,
      areaList: areaList,
      selectCode:''
    };
  },
  methods: {
    isShow() {
      this.showModel = true;
    },
    changeAddress(code) {},
    confirmFun(d) {
      this.showModel = false;
      this.$emit("getSelectAddress", d);
    },
    cancelFun() {
      this.showModel = false;
    }
  },
  mounted() {}
};
</script>

<style scoped>
</style>
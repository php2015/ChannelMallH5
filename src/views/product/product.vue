<template>
  <div class="product-page" v-wechat-title="$route.meta.title" img-set="./static/img/favicon.ico">
    <div class="product-search" @click.stop="tapToSearch()">
      <searchFixed :setStyle="setStyle"></searchFixed>
    </div>
    <div class="content" id="iosxHeight">
      <div class="content-box">
        <div class="lb-box">
          <div class="lb">
            <div
              class="classify"
              :class="{active:productType==item.id}"
              v-for="(item, index) in classList"
              :key="index"
              @click.stop="productType=item.id"
            >
              <span></span>
              <span>{{item.name}}</span>
            </div>
          </div>
        </div>
        <div class="rb-box">
          <div class="rb" v-show="!showNull">
            <van-list
              class="van-list-special"
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="getData2"
            >
              <div
                class="product"
                v-for="(item, index) in list"
                :key="index"
                @click.stop="jumpProductDetail({id:item.channelCommId})"
              >
                <div class="imgB">
                  <img v-lazy="item.imgUrl?item.imgUrl.split('；')[0]:''" />
                </div>
                <div class="info">
                  <div class="infoB">
                    <div class="name" :class="{activecf:item.isRx=='1'}">
                      <div class="logoC">
                        <img src="../../assets/img/Rx.png" alt />
                      </div>
                      <div class="namet">{{item.name}}</div>
                    </div>
                    <div class="type" v-if="item.label">
                      <span v-for="(item2, index2) in item.label.split('；')" :key="index2">{{item2}}</span>
                    </div>
                  </div>
                  <div class="price">
                    <div class="priceB">
                      <div class="priceC">
                        <span>
                          <span>¥{{item.salePrice|spplicPrice(item.specialPrice)}}</span>
                          <span>.{{item.salePrice|spplicPrice2(item.specialPrice)}}</span>
                        </span>
                        <span class="logo" v-show="item.specialPrice&&item.specialPrice>0">特惠</span>
                      </div>
                      <span
                        class="oldP"
                        v-show="item.originalPrice&&item.originalPrice>0"
                      >{{item.originalPrice}}</span>
                    </div>
                    <div class="addimg" v-show="item.isRx!='1'">
                      <div
                        @click.stop="saveCommCart(item.originalPrice, item.salePrice, item.specialPrice, item.channelCommId, item.isRx)"
                      >
                        <img :src="addUrl" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </van-list>
          </div>
          <div class="rb" v-show="showNull">
            <div class="result-empty">
              <no-data-view scene="noData"></no-data-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Lazyload, List } from "vant";
Vue.use(Lazyload, {
  loading: require("@/assets/img/lazy_icon1.png"),
  error: require("@/assets/img/lazy_icon1.png")
}).use(List);

import searchFixed from "../../components/index/searchFixed.vue";
import NoDataView from "../../components/noData/noData";

export default {
  name: "index",
  data() {
    return {
      addUrl: require("@/assets/img/add_shopCart.png"),
      rxUrl: require("@/assets/img/Rx.png"),
      setStyle: { bgColor: "#fff" },
      classList: [],
      productType: "",
      channelId: this.$store.state.login.header.channelId,
      list: [],
      current: 1,
      size: 10,
      loading: true,
      finished: false,
      showNull: false
    };
  },
  components: {
    searchFixed,
    NoDataView
  },
  filters: {
    spplicPrice(a, s) {
      let n = s || a;
      return String(parseFloat(n).toFixed(2)).split(".")[0];
    },
    spplicPrice2(a, s) {
      let n = s || a;
      return String(parseFloat(n).toFixed(2)).split(".")[1];
    }
  },
  watch: {
    productType(newVal, oldVal) {
      this.list = [];
      this.current = 1;
      this.finished = false;
      this.loading = true;
      this.showNull = false;
      this.getData2();
    }
  },
  methods: {
    getData() {
      let _this = this;
      let params = {
        header: {},
        body: { channelId: this.channelId }
      };
      this.$api.getChannelClassification(params).then(res => {
        if (res.code == 0) {
          _this.classList = res.data;
          _this.productType = res.data[0].id;
          //_this.getData2();
        }
      });
    },
    getData2() {
      let _this = this;
      if (this.classList.length <= 0) {
        return false;
      }
      let params = {
        header: {},
        body: {
          channelCommClassiId: this.productType
            ? this.productType
            : this.classList[0].id,
          channelId: this.channelId,
          size: this.size,
          current: this.current
        }
      };
      this.$api.getChannelClassiCommodityList(params).then(res => {
        if (res.code == 0) {
          _this.current++;
          if (res.data.total <= 10) {
            //总数小于10时
            if (res.data.total <= 0) {
              _this.list = [];
              _this.finished = true;
              _this.showNull = true;
              _this.loading = false;
            } else {
              _this.finished = true;
              _this.list.push.apply(_this.list, res.data.records);
            }
          } else {
            _this.showNull = false;
            if (res.data.records.length < 10) {
              _this.finished = true;
              _this.list.push.apply(_this.list, res.data.records);
            } else {
              _this.loading = false;
              _this.list.push.apply(_this.list, res.data.records);
            }
          }
        }
      });
    },
    touchS(e) {
      e.preventDefault();
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 500);
    },
    saveCommCart(originalPrice, salePrice, specialPrice, id, isRx) {
      if (!this.$common.isLogin()) return false;
      this.$common.addShopCart(
        null,
        originalPrice,
        salePrice,
        specialPrice,
        id,
        null,
        isRx
      );
    },
    tapToSearch() {
      this.$store.commit("searchFocusState", true);
      this.$router.push({
        path: "serach",
        query: {}
      });
    },
    jumpProductDetail(data) {
      this.$router.push({
        path: "/productDetail",
        query: data
      });
    }
  },
  mounted() {},
  activated() {
    let mo = function(e) {
      e.preventDefault();
    };
    document.body.style.overflow = "hidden";
    document.removeEventListener("touchmove", mo, false);
    if (this.classList.length <= 0) {
      this.getData();
    }
  },
  deactivated() {
    let mo = function(e) {
      e.preventDefault();
    };
    document.body.style.overflow = "";
    document.removeEventListener("touchmove", mo, false);
  }
};
</script>
<style lang="less">
.product-page {
  background: #fff;
 
  height: 100%;
  width: 100%;
  position: fixed;//iosx各种浏览器环境适配问题
  left: 0;
  top: 0;
  .product-search {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    padding: 11px 0;
    height: 65px;
    flex-shrink: 0;
    z-index: 999;
    background-color: #f6f8fa;
  }
  .content {
    width: 100%;
    position: absolute;
    height: 100%;
    box-sizing: border-box;
    left: 0;
    top: 0;
    background-color: transparent;
    padding-top: 88px;
    padding-bottom: 98px;
    overflow: hidden;
    .content-box {
      width: 100%;
      height: 100%;
      position: relative;
      .lb-box {
        width: 180px;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        overflow: hidden;
        background-color: #f6f8fa;
        z-index: 99;
        .lb {
          width: 180px;
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
          &::-webkit-scrollbar {
            //设置整个滚动条宽高
            width: 0;
            height: 100%;
          }
          &::-webkit-scrollbar-thumb {
            //设置滑块
            width: 0;
            height: 0;
            background-color: transparent;
            border-radius: 0;
          }
          &::-webkit-scrollbar-track {
            border-radius: 0;
            background-color: transparent;
          }
          .classify {
            width: 100%;
            height: 100px;
            box-sizing: border-box;
            position: relative;

            span:nth-child(1) {
              height: 36px;
              width: 6px;
              background-color: #3ac756;
              position: absolute;
              left: 0;
              top: 32px;
              display: none;
            }

            span:nth-child(2) {
              line-height: 100px;
              height: 100px;
              overflow: hidden;
              text-align: center;
              width: 100%;
              font-size: 26px;
              display: block;
              color: #333333;
            }
          }

          .active {
            background-color: #ffffff;

            span:nth-child(1) {
              display: block;
            }

            span:nth-child(2) {
              font-size: 32px;
            }
          }
        }
      }
      .rb-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        left: 0;
        top: 0;
        padding-left: 202px;
        box-sizing: border-box;
        z-index: 1;
        .rb {
          width: 100%;
          height: 100%;
          overflow: auto;
          overflow-y: auto;
          background-color: #fff;
          -webkit-overflow-scrolling: touch;
          &::-webkit-scrollbar {
            //设置整个滚动条宽高
            width: 0;
            height: 100%;
          }
          &::-webkit-scrollbar-thumb {
            //设置滑块
            width: 0;
            height: 0;
            background-color: transparent;
            border-radius: 0;
          }
          &::-webkit-scrollbar-track {
            border-radius: 0;
            background-color: transparent;
          }
          .product {
            width: 100%;
            height: 180px;
            padding: 28px 0;
            border-bottom: solid 1px #ebebeb99;

            display: flex;

            .imgB {
              width: 180px;
              height: 180px;
              flex-shrink: 0;
              border-radius: 8px;
              font-size: 0;
              overflow: hidden;
            }

            .info {
              width: 30%;
              height: 180px;
              flex-grow: 2;
              display: flex;
              justify-content: space-between;
              flex-direction: column;
              padding-left: 19px;
              padding-right: 38px;

              .infoB {
                width: 100%;
                position: relative;
                top: -5px;

                .name {
                  width: 100%;
                  position: relative;
                  .logoC {
                    width: 32px;
                    height: 26px;
                    padding-bottom: 5px;
                    position: absolute;
                    top: 4px;
                    left: 0;
                    font-size: 0;
                    display: none;
                  }
                  .namet {
                    width: 100%;
                    font-size: 28px;
                    line-height: 38px;
                    color: #333333;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    line-clamp: 2;
                    text-indent: 0;
                    -webkit-box-orient: vertical;
                  }
                }
                & .activecf {
                  .logoC {
                    display: block;
                  }
                  .namet {
                    text-indent: 36px;
                  }
                }

                .type {
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  overflow: hidden;
                  height: 28.5px;

                  span {
                    padding-right: 20px;
                    font-size: 20px;
                    line-height: 28.5px;
                    color: #aeafb2;
                  }
                }
              }

              .price {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .priceB {
                  width: 50%;
                  flex-grow: 2;
                  display: flex;
                  align-items: flex-end;

                  .priceC {
                    position: relative;
                    & > span {
                      font-size: 0;
                      & span:nth-child(1) {
                        font-size: 32px;
                        line-height: 1;
                        color: #ff6e26;
                      }
                      & span:nth-child(2) {
                        font-size: 24px;
                        color: #ff6e26;
                      }
                    }

                    .logo {
                      width: 46px;
                      height: 24px;
                      position: absolute;
                      right: 0;
                      top: -20px;
                      right: -20px;
                      background-image: linear-gradient(
                          90deg,
                          #ffaf41 0%,
                          #ff6e26 100%
                        ),
                        linear-gradient(#fb5555, #fb5555);
                      background-blend-mode: normal, normal;
                      border-radius: 4px 4px 4px 0px;
                      text-align: center;
                      font-size: 20px;
                      line-height: 24px;
                      color: #ffffff;
                    }
                  }

                  .oldP {
                    padding-left: 7px;
                    font-size: 24px;
                    line-height: 1;
                    color: #d2d2d4;
                    text-decoration: line-through;
                  }
                }
                .addimg {
                  width: 32px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: center;

                  div {
                    width: 32px;
                    height: 32px;
                    padding: 10px;
                    border-radius: 32px;
                    flex-shrink: 0;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

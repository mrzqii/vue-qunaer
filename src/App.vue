<template>
  <div class="app">
   <v-header :seller="seller"></v-header>
   <div class="tab border-1px">
     <div class="tab-item">
       <router-link to="/goods">商品</router-link></div>
     <div class="tab-item">
       <router-link to="/ratings">评论</router-link></div>
     <div class="tab-item">
       <router-link to="/seller">商家</router-link></div>
   </div>
   <div class="content">
     <!-- 这里需要把seller传到子路由里面去 -->
     <!-- keep-alive主要用于保留组件状态或避免重新渲染。 -->
     <keep-alive>
      <router-view :seller="seller"></router-view>
     </keep-alive>
   </div>
  </div>
</template>

<script>
import header from "./components/header/header.vue";
import {urlParse} from './common/js/util.js'

export default {
  data() {
    return {
      'seller': {
        id: (() => {
          let quertParam = urlParse();
          return quertParam.id;
        })()
      }
    }
  },
  components: {
    "v-header": header
  },
  created(){
    this.axios.get('/api/seller').then((response) => {
      // Object.assign用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      this.seller = Object.assign({}, this.seller, response.data.data);
    
    })
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
@import './common/stylus/mixin.styl';

.app {
  .tab {
    display: flex;
    height: 40px;
    line-height: 40px;
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      & > a {
        display: block;
        color: rgb(77, 85, 93);

        &.router-link-active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>

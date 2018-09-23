// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import goods from './components/goods/goods.vue'
import ratings from './components/ratings/ratings.vue'
import seller from './components/seller/seller.vue'

import './common/stylus/index.styl'
import '../static/css/reset.css'

Vue.use(VueRouter)
Vue.use(VueAxios, axios)

Vue.config.productionTip = false

 

const router = new VueRouter({
  routes: [
    {path: '/goods',component: goods},
    {path: '/ratings',component: ratings},
    {path: '/seller',component: seller}
  ]
})

// const app = new Vue({
//   router,
//   components: { App }
// }).$mount('#app')

new Vue({
  el: '#app',
  router,
  components: { App }
  
})
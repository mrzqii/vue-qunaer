# VUE去哪儿APP项目笔记

`书写这个笔记的目的就是为了把这个项目的一些流程思想知识点都做一个记录，让自己在以后能够快速的复习知识点，对这个项目不会做了就忘记`

---

- 01：  
    安装了node 输入node -v 检查版本  
    输入vue 能看到常见的命令  
    输入vue list 能看到有哪一些模板  
    输入vue init webpack sellapp  
    然后进入到项目文件夹，输入npm install  
    当安装完依赖以后执行npm run dev 就会把项目跑起来了  
- 02：  
    图标字体：  
    把设计师给的svg文件通过 icomoon.io网站来生产图标字体  
    stylus 类似less sass 他的格式就是不需要 { } 和 ;  这些符号，甚至连冒号	都可以不要

- 03:   
    https://segmentfault.com/q/1010000011988039  
    mock数据，我们在本地有个data.json的数据，视频教程说的是在dev-server.js里面写入，但是现在的vue-cli已经变化了，需要参考下面的帖子进行操作，进行数据mock,这样的话我们就可以请求接口的数据咯：http://localhost:8080/api/seller,注意安装依赖npm install --save-dev express
- 04:
    开始测试写一个header的组件；报错：开始是说cant find stylus-loader,然后是cant find stylus, 于是通过npm i --save-dev 把这两个安装了就OK了  

    开始书写样式：tab栏我们使用flex布局，设计稿上面的tab高度是80px，我们写样式的时候只需要写40px就可以了，因为ip6是2倍的屏幕  
    
    安装 npm i vue-router --save, 然后再main.js里面引入；import vueRouter from vue-router ;这里为什么是from vue-router呢？ 我们可以到node_modules 里面找到vue-router文件夹，打开package.json 会看到name的属性就是这个  
    
    如何使用vue-router:首先
```
    
import VueRouter from 'vue-router'
Vue.use(VueRouter)
    
    创建 router 实例，然后传 `routes` 配置
    const router = new VueRouter({
      routes: [
        {path: '/goods',component: goods},
        {path: '/ratings',component: ratings},
        {path: '/seller',component: seller}
      ]
    })
    
    注入路由
    new Vue({
      el: '#app',
      router,
      components: { App }
    })
``` 
- 05:
    一像素边框：在电脑端设置1px，但是在手机端预览会变成两像素；如何能看到？可以找到本机的IP，然后把localhost替换掉，然后在草料上面生成二维码，就可以通过扫描二维码在手机来看了。手机和电脑必须在一个局域网  
    具体实现：  
    原理：在需要设置边框的元素上面设置一个伪元素，然后在这个伪元素上面设置一个边框，然后再设置一个类，这个类会选中当前元素的伪元素，然后对这个伪元素实现transform：scaleY(0.5) 缩放，来达到1px的效果
```
在需要设置边框的元素设置伪元素：
// mixin是stylus的语法类似函数的意思可以传入参数
border-1px($color)
    position relative
    &:after
        display block
        position absolute
        left 0
        bottom 0
        width 100%
        border-top 1px solid $color
        content ' '
        
对这个伪元素实现transform：scaleY(0.5) 缩放
@media(-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5)
    .border-1px
        &::after
            -webkit-transform :scaleY(0.7)
            transform :scaleY(0.7)
@media(-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2)
    .border-1px
        &::after
            -webkit-transform :scaleY(0.5)
            transform :scaleY(0.5)
```

- 06：  
    在main.js里面设置数据请求：  
```
参考：
https://www.npmjs.com/package/vue-axios
https://www.kancloud.cn/yunye/axios/234845

npm install --save axios vue-axios

import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

可以在vue的method 或者created 其他生命周期函数里面发送请求
这个项目是在App.vue里面设置的
created(){
    this.axios.get('/api/seller').then((response) => {
      this.seller = response.data.data
    })
  }
  
解释：  
this表示的是这个vue实例：
this.axios.get(api).then((response) => {
  console.log(response.data)
})

this.$http.get(api).then((response) => {
  console.log(response.data)
})
```

至此项目已经可以开始请求数据了，接下来就是把数据通过prop 传到子组件里面供子组件使用
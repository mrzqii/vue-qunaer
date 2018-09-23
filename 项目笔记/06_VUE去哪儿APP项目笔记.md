### 商家评价页面 rating.vue

> 评价界面主要是两个部分 上半部分是一个店铺整体展示，评分和服务态度，下半部分是关于评价的展示，这一个组件的主要学习内容还是布局的学习，还有就是使用上一篇关于评价的联动

##### 对小屏幕iphone5的兼容
```
 .overview-left
      flex: 0 0 137px
      // 这个地方还设置宽度是为了兼容性
      width: 137px
      padding: 6px 0
      border-right: 1px solid rgba(7, 17, 27, 0.1)
      text-align: center
      // 设置媒体查询兼容iPhone5
      @media only screen and (max-width: 320px)
        flex: 0 0 120px
        width: 120px
```

### 商家页面 seller.vue

> 这个板块有几部分内容，都是之前遇到过的，主要还是复习一下，然后就是个别的知识点，和收藏的功能

在vue的哪个阶段初始化Bscorll不会出现问题  

如何把商家支持的优惠标志动态渲染出来

如何初始化一个水平方向的Bscroll

```
this.$nextTick(() => {
      // 在一个已经有垂直方向的滚动里面添加水平方向的滚动
      if (!this.picScroll) {
        this.picScroll = new BScroll(this.$refs.picWrapper, {
          scrollX: true,
          eventPassthrough: 'vertical'
        });
      } else {
        this.picScroll.refresh();
      }
    });
```
动态计算和设置某一个dom的宽度；

```
let picWidth = 120;
let margin = 6;
let width = (picWidth + margin) * this.seller.pics.length - margin;
this.$refs.picList.style.width = width + 'px';
```

最后是收藏的功能：

> 这里的收藏功能是通过把控制收藏状态的变量储存在localStore 里面，这样的对于切换页面也不会造成状态无法保存，在这里设计的时候添加了在每个商家页面打开会传入一个参数id=xxx在url里面，我们把这个id获取到然后存到本地储存里面用于区分不同商家的本地信息

##### 在App.vue里面

- 给seller增加id属性：  
这里有一个自执行函数的使用，已经urlParse工具函数的封装
```
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
```

- 把上面的seller通过接口返回的数据进行扩展：  
这里注意Object.assign的使用
```
created(){
    this.axios.get('/api/seller').then((response) => {
      // Object.assign用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
      this.seller = Object.assign({}, this.seller, response.data.data);
    
    })
  }
```

- 还有对keep-alive的使用：keep-alive主要用于保留组件状态或避免重新渲染。 
    如果不写他的话，每次切换，组件的生命周期都会重新执行一遍：原理就是把组件的一些状态保存到内存里面
```
<keep-alive>
  <router-view :seller="seller"></router-view>
 </keep-alive>
```
##### 在seller.vue里面
`import {saveToLocal, loadFormlocal} from '../../common/js/store.js'`里面工具函数的封装，以及如何使用；

---

至此项目已经书写完毕，接下来就是打包了

运行`npm run build` 就会生成一个dist的目录，里面就是已经打包好了的文件；  
会看到里面有一个soursemap的文件，这个是调试使用的，可以在`config/index.js/下面的 productionSourceMap: true`, 修改为false关闭它；  

然后就是把这个打包好的文件运行起来。现在需要写一个测试文件来运行这个项目：新建prod.server.js 写入内容。然后运行`node prod.server.js` 就可以把项目跑起来了。这里还要在`config/index.js/下面的build里面写入port：9000。现在项目就已经跑起来了！
 
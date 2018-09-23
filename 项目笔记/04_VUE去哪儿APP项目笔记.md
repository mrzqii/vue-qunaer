### 点击弹出商品详情food组件  

> tips:每个vue组件的模板的内容必须由一个div包着  
---

##### 样式的编写有一些技巧
> 需求是：我们是需要把商品图片按照正方形的方式展示出来，而且是需要自适应屏幕宽度的  

我们可以把父盒子设置为一个正方形，然后图片就按照宽高 100%来书写就可以了
```
html:
<div class="image-header">
  <img :src="food.image" alt="">
</div>

css:

.image-header
        position relative
        width 100%
        height 0
        padding-top 100%  主要是这里：padding的100%是按照父级的宽度来取得的
        img
            position absolute
            top 0
            left 0
            width 100%
            height 100%


```

##### 商品详情页面数据的传递（food组件）
> 场景：点击每个商品，会弹出一个商品详情页，然后把数据传递进去，渲染出该有的数据

首先会在goods组件的每个商品item上面绑定一个点击事件然后把food这个值传递到点击事件的参数里面，然后再在这个点击事件的函数selectFood里面把参数传递进来的food赋值给另外一个属性selectedFood里面，然后再把这个selectedFood传递给子组件food，就完成了值得传递。  
通过点击触发上面那个函数，我们可以使用父组件调用子组件方法的方式，`this.$refs.food.show();`完成详情页的显示；然后对Bscroll初始化，注意这个地方要配置`click:true` 不然组件内容的点击会出现问题
```
show() {
  this.showFlag = true;
  this.$nextTick(() => {
        if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
            click: true
            });
        } else {
            this.scroll.refresh();
        }
    });
},
```

##### 商品详情页点击加入购物车的逻辑（food组件）
> 场景：当点击加入购物车，该商品的数量会为1，然后加入购物车按钮隐藏，下面的购物车cartcontrol组件出现，然后继续点击＋号，数量会继续增加

这里的逻辑比较多：  
点击加入购物车按钮会触发addFirst方法，这个方法会向父级注册add事件，并传递参数，goods组件就能监听到这个事件并触发小球下落的方法，所以点击加入购物车也会有一个小球出现

```
addFirst(event) {
    if (!event._constructed) {
      return;
    }
    this.$emit('add', event.target);
    Vue.set(this.food, 'count', 1);
},
```

然后就是点击cartcontrol组件，内部也会注册add事件，food组件会监听，并触发addFood方法，这个addFood方法又会注册一个add事件，父组件goods来监听这个事件，就这样实现了触发小球下落的动画（这里有一个事件的传递，因为最终执行小球下落的函数是在goods组件里面实现的，所以要传递都goods组件里面去）
```
food组件使用cartcontrol组件

<div class="cartcontrol-wrapper">
    <cartcontrol @add="addFood" :food="food"></cartcontrol>
</div>

food组件的addFood方法

addFood(target) {
      this.$emit('add', target);
  }
```

##### 评价内容的布局
> 这个地方主要是一个知识点：  
当是好评的时候给予点赞，当不好的评价的时候是向下大指母，这里主要是使用了通过`:class="{}"` 的方式来根据条件选择性的展示类名  

```
先写好css: 

.icon-thumb_up, .icon-thumb_down
    margin-right: 4px
    line-height: 16px
    font-size: 12px
.icon-thumb_up
    color: rgb(0, 160, 220)
.icon-thumb_down
    color: rgb(147, 153, 159)
    
然后再DOM里面：
这里的：class 是一个对象，对象里面有两个元素，根据条件就能有选择性的切换类名显示

<div class="text"><span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}</div>
```
##### 在Vue里面引入插件 使用filters

> 如何使用ES6模块化方式书写一个插件 如何引入 已经在Vue里面使用过滤器选项

 
```
@@@这里是一个日期格式化的插件 date.js

export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4- RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

@@@然后是在vue 里面引入
import {formatDate} from '../../common/js/date';

@@@然后在Vue里面的选项里面设置过滤器

//   过滤器的使用
// 传入值，返回处理以后的值
  filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    
@@@使用过滤器

<div class="time">{{rating.rateTime | formatDate}}</div>

```
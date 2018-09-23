### 书写header组件的样式

- 01：
    接收父组件传过来的数据  
    ```
     props: {
        seller: {
          type: Object
        }
      },
      我们在template里面就可以使用seller了
    ```
    在显示有几个折扣的时候,有个注意点：要先判断一下seller.supports是不是为真，因为seller这个数据是通过异步请求得到的，我们默认设置的时候这个seller在父组件是为空对象。所以在没有返回数据的时候 {{seller.supports.length}}会报错
    ```
    <div v-if="seller.supports" class="count-all">
      {{seller.supports.length}}个
      <i class="icon-keyboard_arrow_right"></i>
    </div>
    
    ```
    使用mixin的方法来设置有2倍和3倍的背景图片
    ```
    bg-img($url)
        background-image url($url+"@2x.png")
        @media(-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3) 
          background-image url($url+"@3x.png")   
    使用的时候，一定要记得先引入这个mixin.styl
    bg-img('guarantee_1')
    ```
- 02： 书写弹出层的结构和样式  
    首先弹出层的结构使用了一个sticker-footer的布局用来保障叉叉按钮不会把文字内容覆盖，具体实现可以看我的笔记  
- 03： 书写星级评分组件，具体看我的笔记
- 04：支持哪些服务（surpports）是通过先设置类，然后每个类对应不同的背景图片，通过预先写的数组this.countMap = ["decrease", "discount", "guarantee", "invoice", "special"]，拼接出需要的类，然后显示出不同的背景图片
```
<ul class="supports" v-if="seller.supports">
  <li v-for="(item,index) in seller.supports" :key="index" class="support-item">
    <span class="count-brand" :class="countMap[seller.supports[index].type]"></span>
    <span class="count-name">{{seller.supports[index].description}}</span>
  </li>
</ul> 
```
### goods部分的样式布局
```
    主要是一个左边固定，右边自适应的布局  
    这种一般是使用flex布局  
    首先在父盒子写  
    display:flex  
    固定宽度的子盒子开  
    .menu-wrapper
      flex 0 0 80px
      width 80px  
    自适应的部分  
    .foods-wrapper
      flex 1
```
### 滚动插件better-scroll的使用
https://github.com/ustbhuangyi/better-scroll/blob/master/README_zh-CN.md
https://www.cnblogs.com/xumqfaith/p/7743387.html  

```
安装 npm i better-scrool --save  
import BScroll from 'better-scroll'  
const menuScroll = new BScroll(this.$refs.menuWrapper)
```
关于如何选中一个DOM节点使用ref="xxx",调用的时候this.$refs.xxx  
相当于document.querySelector('xxx')


在创建滚动实例的时候一定要在DOM更新以后执行  
`当你设置 vm.someData = 'new value' ，该组件不会立即重新渲染。当刷新队列时，组件会在事件循环队列清空时的下一个“tick”更新。`
```
this.$nextTick( () => {
  this._initScroll()
  this._calculateHeight()
})
```
### 商品区域滚动带动左边目录的选中
```
 在DOM更新完成以后 创建BScroll的实例和事件的监听
    _initScroll(){
      this.meunScroll = new BScroll(this.$refs.menuWrapper,{})
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
         B-S插件的配置表示每滚动一像素触发一次
        probeType:3 
      })
       监听better-scroll实例的滚动事件，得到当前滚动的位置scrollY
      this.foodsScroll.on('scroll', (pos)=> {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    
     计算每个商品区域的高度组成一个列表
    _calculateHeight(){
      let foodList =  document.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
    
     这里的计算属性通过listHeight获得一个索引值currentIndex
  computed: {
    currentIndex(){
      for(var i=0;i<this.listHeight.length;i++){
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i+1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    }
  },
  
  这里在绑定current类，注意这里绑定class对象语法的使用
  <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}">
```
### 目录区域绑定点击事件，点击可滚动到对应商品
定义一个点击事件的方法：这个方法需要接收参数  
```
selectMenu(index, event){

   这里_constructed是B-S派发事件的时候会有的属性，原生的click事件的event是没有这个属性的
   这里每次发现如果不添加这个判断，会在PC端触发两次的问题
   
  if (!event._constructed) {
      return;
    }
  let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
  let el = foodList[index];
  
   调用B-S插件的接口跳转到设置的元素位置
   
  this.foodsScroll.scrollToElement(el, 300);
},
```
在DOM里面需要这样来传入$event这个是VUE的规定:  

```
<li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}"
         @click="selectMenu(index, $event)">
```
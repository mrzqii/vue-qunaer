### 购物车组件shopCart
在goods组件里面引入购物车组件,传入配送价格，最少起送价格，选择商品的信息 
```
<shopCart 
    :selectFoods="selectFoods" 
    :deliveryPrice="seller.deliveryPrice" 
    :minPrice="seller.minPrice">
</shopCart>
```
购物车组件接收到上面三个参数以后，根据这三个参数，得到了如下的计算属性：
```
//通过父组件传入的selectFoods计算出
      totalCount(){ //购物总数量
          let count = 0;
          this.selectFoods.forEach((food)=> {
              count += food.count
          })
          return count
      },
      //通过父组件传入的selectFoods计算出
      totalPrice(){ //购物总价格
          let total = 0;
          this.selectFoods.forEach((food)=> {
              total += food.count*food.price
          })
          return total
      },
      //通过totalPrice计算出返回值
      payDesc(){ //购物车组件按钮显示的信息
          if(this.totalPrice === 0){
              return `￥${this.minPrice}元起送`
          }else if(this.totalPrice<this.minPrice){
              let diff = this.minPrice-this.totalPrice
              return `还差￥${diff}元起送`
          }else{
              return `去结算`
          }
      },
      //通过totalPrice计算出返回值，这个返回值对应的是一个类名
      payClass(){ //购物车组件按钮显示的样式
          if (this.totalPrice < this.minPrice) {
            return 'not-enough';
            } else {
            return 'enough';
            }
      }
  },
```

然后通过上面的计算属性能够控制购物车组件的样式变化，数量变化

### 选择数量组件cartcontrol
> 在goods组件里点击数量组件cartcontrol会导致shopcart组件里面数量、价格发生变化

在cartcontrol组件里面点击增加按钮会触发addCart()方法，然后会对从父组件goods里面传过来的food这个对象增加一个count的属性`Vue.set(this.food,'count',1)`  
接着会注册一个add事件，父组件可以监听这个事件，传递的参数是点击的这个节点`this.$emit('add', event.target);`   
父组件监听这个事件，然后会触发一个方法：会调用另外一个组件shopcart里面的方法`this.$refs.shopcart.drop(target)`   
在shopcart组件的drop方法里面会组装小球数组，并且每个小球会把前面传过来的节点作为属性绑定上去。 然后操作transform的几个事件来控制小球的动画，这样就完成了一个有动画的小球 

另一方面在改变给food对象增加属性count的过程中，会引起goods组件的一个计算属性selectFoods的变化，而selectFoods这个计算属性是用来传递到shopcart里面的，用来展示数量、价格的  

> 这里总结一下增加数量组件的一些注意和一些知识点: 1:如何给组件增加属性，这个属性也是响应式的 2：子组件注册事件，然后可以传递的参数可以是一个节点3：可以把一个节点作为属性绑定到某个参数上面4：transform的几个事件的使用

### 购物车详情弹出
样式的书写：  
购物车详情首先是绝对定位在购物车组件上面；然后给他设置`transition:translate3d(0, -100%, 0)` 这个组件就能展现出来了；  
然后再购物车组件上面绑定一个点击事件，toggleList就是为了控制这个详情页的弹出和隐藏，每次点击就会切换属性fold的布尔值，初始的时候是true;  
设置一个计算属性listShow他的值是一个布尔值，依赖fold,然后通过v-show绑定在购物车详情弹出的div上面;这样就达到了隐藏和显示的功能.  
这里涉及到了动画样式的书写，以及Bscroll的一些操作。  


<!-- 商品 组件  -->
<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}"
         @click="selectMenu(index, $event)">
          <span class="text">
            <span v-show="item.type>0" class="icon" :class="countMap[item.type]"></span>
          {{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li class="food-list food-list-hook" v-for="(item, index) in goods" :key="index">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li class="food-item" @click="selectFood(food,$event)" v-for="(food, index) in item.foods" :key="index">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- 这里传入到子组件的food，当子组件修改这个food的值得时候，父组件的也会发生变化 -->
                  <!-- 这里的add事件是子组件注册的，监听到这个事件的时候会触发addFood方法 -->
                  <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopCart ref="shopcart" :selectFoods="selectFoods" :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopCart>
  </div>
  <food @add="addFood" :food="selectedFood" ref="food"></food>
</div>
</template>

<script type='text/ecmascript-6'>
import BScroll from 'better-scroll';
import shopCart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'

export default {
  props:{
    // 通过路由传进来的
    seller:{
      type: Object
    },
    
  },
  data () {
    return {
      goods:[],
      listHeight:[],
      scrollY: 0,
      selectedFood:{}
    };
  },

  components: {
    shopCart,
    cartcontrol,
    food
  },
  // 这里的计算属性通过listHeight获得一个索引值currentIndex
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
    },
    // selectFoods的值是依赖food的，food会通过子组件cartcontrol的修改而发生变化（添加count属性和值）
    selectFoods(){
        let foods = []
        this.goods.forEach((good)=> {
          good.foods.forEach((food)=> {
            if(food.count){
              foods.push(food);
            }
          })
        })
        return foods
      }
  },
  created(){
    this.axios.get('/api/goods').then((response) => {
      this.goods = response.data.data;
      this.$nextTick( () => {
          this._initScroll()
          this._calculateHeight()
        })
    });
    this.countMap = ["decrease", "discount", "guarantee", "invoice", "special"]
    // 在DOM完成渲染完成以后执行的内容
  },
  methods: {
    selectMenu(index, event){
      // 这里_constructed是B-S派发事件的时候会有的属性，原生的click事件的event是没有这个属性的
      // 这里每次发现如果不添加这个判断，会在PC端触发两次的问题
      if (!event._constructed) {
          return;
        }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let el = foodList[index];
      // 调用B-S插件的接口跳转到设置的元素位置
      this.foodsScroll.scrollToElement(el, 300);
    },
    
    // 初始化Scroll
    _initScroll(){
      this.meunScroll = new BScroll(this.$refs.menuWrapper,{
        click: true
      })
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper,{
        // B-S插件的配置表示每滚动一像素触发一次
        click: true, 
        probeType:3
      })
      // 监听better-scroll实例的滚动事件，得到当前滚动的位置
      this.foodsScroll.on('scroll', (pos)=> {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    // 计算每个商品区域的高度组成一个列表
    _calculateHeight(){
      let foodList =  this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画,如果同时触发两个3D动画会出现卡顿
      this.$nextTick(() => {
        // 调用shopcart组件里面的drop方法
        this.$refs.shopcart.drop(target);
      });
    },
    // 这里注意当调用的时候是传入$event,而在函数里面使用的时候是event
    // 这个方法是将商品属性food传递到需要被传商品属性food传递到需要被传入点击弹出商品详情food组件里面的数据selectedFood
    selectFood(food, event) { 
      if(!event._constructed){
        return
      }
      this.selectedFood = food;
      // 父组件可以调用子组件的方法：调用组件food的方法
      this.$refs.food.show();
    }
  },
  
}
</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
  @import '../../common/stylus/mixin.styl';
  .goods
    display flex
    position absolute
    top: 174px
    bottom: 46px
    overflow hidden
    .foods-wrapper
      flex 1
      .food-list
        .title
          padding-left 14px
          border-left 2px solid #d9dde1
          background #f3f5f7
          height 26px
          line-height 26px
          font-size: 12px
          color: rgb(147, 153, 159)
        .food-item
          display flex
          margin 18px
          padding-bottom: 18px
          border-1px(rgba(7, 17, 27, 0.1))
          &:last-child
            border-none()
            margin-bottom 0
          .icon
            flex 0 0 57px
            margin-right 10px
            
          .content
            flex 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              line-height: 14px
              font-size: 14px
              color: rgb(7, 17, 27)
            .desc, .extra
              line-height: 10px
              font-size: 10px
              color: rgb(147, 153, 159)
            .desc
              line-height: 12px
              margin-bottom: 8px
            .extra
              .count
                margin-right: 12px
            .price
              font-weight: 700
              line-height: 24px
              .now
                margin-right: 8px
                font-size: 14px
                color: rgb(240, 20, 20)
              .old
                text-decoration: line-through
                font-size: 10px
                color: rgb(147, 153, 159)
            .cartcontrol-wrapper
              position: absolute
              right: 0
              bottom: 12px


    .menu-wrapper
      flex 0 0 80px
      width 80px
      // height 100%
      background #f3f5f7
      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height: 14px
        &.current
          position relative
          margin-top -1px
          background #fefefe
          z-index 10
          .text
            font-weight 700
            border-none()
        .icon 
          display: inline-block
          vertical-align top
          width: 12px
          height: 12px
          margin-right 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease 
            bg-img('decrease_3')
          
          &.discount 
            bg-img('discount_3')
          

          &.guarantee 
            bg-img('guarantee_3')

          &.invoice 
            bg-img('invoice_3')

          &.special 
            bg-img('special_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7,17,27,.1))
          font-size 12px
        
      
        
</style>
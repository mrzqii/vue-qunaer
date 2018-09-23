<template>
<div>
  <div class="shopcart">
    <div class="content" @click="toggleList">
        <div class="content-left">
            <div class="logo-wrapper">
                <!-- 计算属性的使用 -->
                <div class="logo" :class="{highlight:totalPrice>0}">
                    <i class="icon-shopping_cart"></i>
                </div>
                <div class="num" v-show="totalPrice>0">{{totalCount}}</div>
            </div>
            <div class="price" :class="{highlight:totalPrice>0}">
                ￥{{totalPrice}}
            </div>
            <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
            <!-- 计算属性的使用 -->
            <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
    </div>
    <div class="ball-container">
        <div v-for="(ball,index) in balls" :key="index">
          <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
      <transition name="fold">
            <div class="shopcart-list" v-show="listShow">
                <div class="list-header">
                    <h1 class="title">购物车</h1>
                    <span class="empty" @click="empty">清空</span>
                </div>
                <div class="list-content" ref="listContent">
                    <ul>
                        <li class="food" v-for="(food, index) in selectFoods" :key="index">
                            <span class="name">{{food.name}}</span>
                            <div class="price">
                                <span>￥{{food.price*food.count}}</span>
                            </div>
                            <div class="cartcontrol-wrapper">
                                <cartcontrol :food="food"></cartcontrol>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
      </transition>
  </div>
  <transition name="fade">
    <div class="list-mask" @click="hideList" v-show="listShow"></div>
  </transition>
  </div>
</template>

<script type='text/ecmascript-6'>

import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol'

export default {
    props: {
        selectFoods: {
            type : Array,
            default(){
                return [
                    {
                        price: 10,
                        count: 0
                    }
                ]
            }
        },
        deliveryPrice:{
            type:Number
        },
        minPrice:{
            type:Number
        }
    },
  data () {
    return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
    };
  },

  components: {
    cartcontrol
  },
//   注意看模板里面计算属性可以在什么地方使用：和data相同的使用  
  computed: {
    //通过父组件传入的selectFoods计算出
      totalCount(){
          let count = 0;
          this.selectFoods.forEach((food)=> {
              count += food.count
          })
          return count
      },
      //通过父组件传入的selectFoods计算出
      totalPrice(){
          let total = 0;
          this.selectFoods.forEach((food)=> {
              total += food.count*food.price
          })
          return total
      },
      //通过totalPrice计算出返回值
      payDesc(){
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
      payClass(){
          if (this.totalPrice < this.minPrice) {
            return 'not-enough';
            } else {
            return 'enough';
            }
      },
      listShow() {
        //   当操作cartcontrol组件减少数量到达0的时候,将fold设为true,返回false
          if(!this.totalCount){
              this.fold = true
              return false
          }
        //   设置show的值为fold的取反，因为第一次点击购物车组件,fold会被设置为false,如果有商品被选中
        //   购物车详情就应该显示，这里的show就需要被设置为true
          let show = !this.fold;
          if(show){
              this.$nextTick(() => {
                  if(!this.scroll){
                      this.scroll = new BScroll(this.$refs.listContent, {
                        click: true
                      })
                  }else{
                       this.scroll.refresh()
                  }
              })
          }
          return show
      },
  },

//   mounted: {},

  methods: {
      drop(el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;
            ball.el = el;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        //   当数量为空的时候返回
          if(!this.totalCount){
              return
          }
        //   数量不为空的时候就切换this.fold的布尔值，计算属性listShow依赖this.fold
          this.fold = !this.fold
      },
      hideList() {
          this.fold = true
      },
    //   addFood(target) {
    //       this.drop(target)
    //   },
    // 在小球下落之前的回调函数
    beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.top - 22);
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(${x}px,0,0)`;
          }
        }
      },
    //   小球下落过程
      dropping(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done);
        });
      },
    //   下落以后的回调
      afterDrop(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = 'none';
        }
      },
      empty(){
          this.selectFoods.forEach((food)=> {
              food.count = 0
          })
      }


  }
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '../../common/stylus/mixin.styl';
.list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    opacity 1
    z-index: 40
    backdrop-filter: blur(10px)
    background-color rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
        transition: all 0.5s
    &.fade-enter, &.fade-leave-to
        opacity 0
        background: rgba(7, 17, 27, 0)
.shopcart
    position fixed
    left 0
    bottom 0
    z-index: 50
    width 100%
    height 48px
    background-color #141d27
    .content
        display flex
        background: #141d27
        font-size: 0
        color: rgba(255, 255, 255, 0.4)
        .content-left 
            flex 1
            color rgba(225,225,225,.4)
            .logo-wrapper
                position: relative;
                display inline-block
                top: -16px;
                width 50px
                height 50px
                border-radius: 50%
                background: #141d27
                margin 0 15px 2px 15px 
                padding 6px
                .num
                    position: absolute
                    top: 0
                    right: 0
                    width: 24px
                    height: 16px
                    line-height: 16px
                    text-align: center
                    border-radius: 16px
                    font-size: 9px
                    font-weight: 700
                    color: #fff
                    background: rgb(240, 20, 20)
                    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
                .logo
                    width 100%
                    height 100%
                    border-radius: 50%
                    background: #2b343c
                    text-align center
                    .icon-shopping_cart
                        line-height: 44px
                        font-size 24px
                    &.highlight
                        background: #00a0dc
                        .icon-shopping_cart
                            line-height: 44px
                            color #fff 
                            font-weight 700
            .price
                display inline-block
                box-sizing: border-box
                vertical-align: top
                margin-top: 12px
                font-size 16px
                padding-right 12px
                line-height 24px
                border-right 1px solid rgba(225,225,225,0.1)
                &.highlight
                    color: #fff
            .desc
                display: inline-block
                vertical-align: top
                margin: 12px 0 0 12px
                line-height: 24px
                font-size: 10px
     
       .content-right 
            flex 0 0 105px
            width 105px
            .pay
                height: 48px
                line-height: 48px
                text-align: center
                font-size: 12px
                font-weight: 700
                &.not-enough
                    background: #2b333b
                &.enough
                    background: #00b43c
                    color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        // http://cubic-bezier.com/#.57,-0.21,.73,.59
        transition: all 0.4s cubic-bezier(.57,-0.21,.73,.59)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      top: 0  
      left: 0
      width 100%
      z-index: -1
      transform translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all 0.5s
      &.fold-enter, &.fold-leave-to
        transform: translate3d(0, 0, 0)
      .list-header
        height 40px
        line-height 40px
        background #f3f5f7
        padding 0 18px
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
            float left
            font-size 14px
            color rgb(7, 17, 27)
        .empty
            float right
            font-size 12px
            color rgb(0, 160, 220)
      .list-content
        max-height 216px
        padding 0 18px
        background: #fff
        overflow hidden
        .food
            position relative
            height 48px
            border-1px(rgba(7, 17, 27, 0.1))
            .name
                line-height 48px
                font-size 14px
                color rgb(7, 17, 27)
            .price
                position absolute
                top 16px
                right 90px
                line-height: 24px
                font-size: 14px
                font-weight: 700
                color: rgb(240, 20, 20)
            .cartcontrol-wrapper
                position absolute
                top 10px
                right 0px

        


</style>
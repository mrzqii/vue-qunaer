<!-- 点击单个商品详情的弹出组件 -->
<template>
<transition name="move">
    <div v-show="showFlag" class="food" ref="food">
        <div class="food-content">
            <div class="image-header">
                <img :src="food.image" alt="">
                <div class="back" @click="hide">
                    <i class="icon-arrow_lift"></i>
                </div>
            </div>
            <div class="content">
                <h1 class="title">{{food.name}}</h1>
                <div class="detail">
                    <span class="sell-count">月售{{food.sellCount}}份</span>
                    <span class="rating">好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                    <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                </div>
                <transition name="fade">
                    <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">
                    加入购物车
                    </div>
                </transition>
            </div>
            <split v-show="food.info"></split>
            <div class="info" v-show="food.info">
                <h1 class="title">商品信息</h1>
                <p class="text">{{food.info}}</p>
            </div>
            <split></split>
            <div class="rating">
                <h1 class="title">商品评价</h1>
                <ratingselect 
                    @toggle="toggleContent"
                    @select="selectRating"
                    :selectType="selectType"
                    :onlyContent="onlyContent"
                    :ratings="food.ratings"
                    :desc="desc"
                ></ratingselect>
                <div class="rating-wrapper">
                    <ul v-show="food.ratings && food.ratings.length">
                        <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="(rating, index) in food.ratings" :key="index">
                            <div class="user">
                                <span class="name">{{rating.username}}</span>
                                <img :src="rating.avatar" alt="" class="avatar">
                            </div>
                            <div class="time">{{rating.rateTime | formatDate}}</div>
                            <div class="text"><span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}</div>
                            
                        </li>
                    </ul>
                    <div v-show="!food.ratings || !food.ratings.length" class="no-rating">暂无评价</div>
                </div>
            </div>

            
        </div>
    </div>
  </transition>
</template>

<script type='text/ecmascript-6'>
import Vue from 'vue';
// ES6的方式引入一个模块
import {formatDate} from '../../common/js/date';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';
import split from '../split/split';
import ratingselect from '../ratingselect/ratingselect';

const ALL = 2;

export default {
    props:{
        food:{
            type: Object
        },
    },
  data () {
    return {
        showFlag:false,
        // 设置传递到子组件的默认值
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
    };
  },

  components: {
      cartcontrol,
      split,
      ratingselect
  },
//   过滤器的使用
// 传入值，返回处理以后的值
  filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
//   computed: {},

//   mounted: {},

  methods: {
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
      hide() {
          this.showFlag = false
      },
      addFirst(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('add', event.target);
        Vue.set(this.food, 'count', 1);
      },
      addFood(target) {
          this.$emit('add', target);
      },
      selectRating(type) {
          this.selectType = type;
        //   这里可以注释下面代码看区别；没有下面代码，切换评价类型后，DOM的高度不会被撑开
          this.$nextTick(() => {
            this.scroll.refresh();
        });
      },
      toggleContent() {
          this.onlyContent = !this.onlyContent
          this.$nextTick(() => {
            this.scroll.refresh();
        });
      },
    //   这条评价是否需要展示
      needShow(type, text) {
        //   当这条评价内容为空 且 勾选只显示有内容 则返回false 这条内容不显示
          if (!text && this.onlyContent) {
              return false
          }

          if (this.selectType === ALL) {
              return true
          }else{
            //   判断该条评价的类型 如果和点选的类别相同则显示 反之则不显示
              return type === this.selectType
          }
      }
  }
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '../../common/stylus/mixin.styl';
.food 
    position fixed
    top 0
    left 0
    bottom: 48px
    width 100%
    background #fff
    z-index: 30
    transform: translate3d(0, 0, 0)
    &.move-enter-active, &.move-leave-active
        transition: all 0.3s linear
    &.move-enter,&.move-leave-to
        transform: translate3d(100%, 0, 0)
    .image-header
        position relative
        width 100%
        height 0
        padding-top 100%
        img
            position absolute
            top 0
            left 0
            width 100%
            height 100%
        .back
            position absolute
            top 10px
            left 0
            .icon-arrow_lift
                display block
                padding 10px
                font-size 20px
                color #fff
    .content
        position relative
        padding 18px
        .title
            line-height: 14px
            margin-bottom: 8px
            font-size: 14px
            font-weight: 700
            color: rgb(7, 17, 27)
        .detail
            font-size 0
            .sell-count,.rating
                font-size 10px
                line-height 10px
            .sell-count
                margin-right 12px
        .price
            font-weight: 700
            line-height: 24px   
            margin 18px 0
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
            right: 12px
            bottom: 12px
        .buy
            position: absolute
            right: 18px
            bottom: 18px
            z-index: 10
            height: 24px
            line-height: 24px
            padding: 0 12px
            box-sizing: border-box
            border-radius: 12px
            font-size: 10px
            color: #fff
            background: rgb(0, 160, 220)
            opacity: 1
            &.fade-enter-active,&.fade-leave-active
                transition: all 0.4s
            &.fade-enter,&.fade-leave-to
                opacity: 0
                z-index: -1
    .info
        padding 18px
        .title
            line-height: 14px
            margin-bottom: 6px
            font-size: 14px
            color: rgb(7, 17, 27)
        .text
            line-height: 24px
            padding: 0 8px
            font-size: 12px
            color: rgb(77, 85, 93)
    .rating
        
        .title
            padding 0 18px
            line-height: 14px
            margin-bottom: 6px
            margin-top 18px
            font-size: 14px
            color: rgb(7, 17, 27)
        .rating-wrapper
            border-top 2px solid rgba(7,17,27,.1)
            padding 0 18px
            .rating-item
                position relative
                padding 16px 0
                border-1px(rgba(7,17,27,.1))
                .user
                    position absolute
                    top 16px
                    right 0
                    .name
                        font-size 10px
                        color rgb(147,153,159)
                        line-height 12px
                    .avatar
                        width 12px
                        height 12px
                        border-radius 50%  
                .time
                    font-size 10px
                    color rgb(147,153,159)
                    line-height 12px
                    margin-bottom 6px
                .text
                    font-size 12px
                    color rgb(7,17,27)
                    line-height 16px
                    .icon-thumb_up, .icon-thumb_down
                        margin-right: 4px
                        line-height: 16px
                        font-size: 12px
                    .icon-thumb_up
                        color: rgb(0, 160, 220)
                    .icon-thumb_down
                        color: rgb(147, 153, 159)
            .no-rating
                padding: 16px 0
                font-size: 12px
                color: rgb(147, 153, 159)










</style>
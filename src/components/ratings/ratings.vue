<!-- 商家 评价页 -->
<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect 
          @toggle="toggleContent"
          @select="selectRating"
          :selectType="selectType"
          :onlyContent="onlyContent"
          :ratings="ratings"
 
      ></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating, index) in ratings" :key="index" class="rating-item">
            <div class="avatar"> 
              <img width="28" height="28" :src="rating.avatar" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="(item, index) in rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type='text/ecmascript-6'>

import BScroll from 'better-scroll';
import {formatDate} from '../../common/js/date';
import split from '../split/split';
import star from '../star/star';
import ratingselect from '../ratingselect/ratingselect';

const ALL = 2

export default {
  props: {
      seller: {
        type: Object
      }
    },
  data () {
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true,
    };
  },
  // 过滤器的使用
// 传入值，返回处理以后的值
  filters: {
      formatDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
  components: {
    split,
    star,
    ratingselect

  },
  // computed: {},
  created(){
    this.axios.get('/api/ratings').then((response) => {
      this.ratings = response.data.data;
      this.$nextTick( () => {
        this.scroll = new BScroll(this.$refs.ratings, {
              click: true
        })
      })
    });
  },
  methods: {
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
  }
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
  @import "../../common/stylus/mixin.styl"
  .ratings
    // 设置容器撑满屏幕使用绝对定位top bottom属性
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width: 100%
    overflow: hidden
    .ratings-content
      .overview
        display flex
        padding: 18px 0
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
          .score
            margin-bottom: 6px
            line-height: 28px
            font-size: 24px
            color: rgb(255, 153, 0)
          .title
            margin-bottom: 8px
            line-height: 12px
            font-size: 12px
            color: rgb(7, 17, 27)
          .rank
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
        .overview-right
          flex 1
          padding: 6px 0 6px 24px
          @media only screen and (max-width: 320px)
            padding-left: 3px
          .score-wrapper
            margin-bottom: 8px
            font-size: 0
            .title
              display: inline-block
              line-height: 18px
              vertical-align: top
              font-size: 12px
              color: rgb(7, 17, 27)
            .star
              display: inline-block
              margin: 0 12px
              vertical-align: top
            .score
              display: inline-block
              line-height: 18px
              vertical-align: top
              font-size: 12px
              color: rgb(255, 153, 0)
          .delivery-wrapper
            font-size: 0
            .title
              line-height: 18px
              font-size: 12px
              color: rgb(7, 17, 27)
            .delivery
              margin-left: 12px
              font-size: 12px
              color: rgb(147, 153, 159)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          display: flex
          padding: 18px 0
          border-1px(rgba(7, 17, 27, 0.1))
          .avatar
            flex: 0 0 28px
            width: 28px
            margin-right: 12px
            img
              border-radius: 50%
          .content
            position: relative
            flex: 1
            .name
              margin-bottom: 4px
              line-height: 12px
              font-size: 10px
              color: rgb(7, 17, 27)
            .star-wrapper
              margin-bottom: 6px
              font-size: 0
              .star
                display: inline-block
                margin-right: 6px
                vertical-align: top
              .delivery
                display: inline-block
                vertical-align: top
                line-height: 12px
                font-size: 10px
                color: rgb(147, 153, 159)
            .text
              margin-bottom: 8px
              line-height: 18px
              color: rgb(7, 17, 27)
              font-size: 12px
            .recommend
              line-height: 16px
              font-size: 0
              .icon-thumb_up, .item
                display: inline-block
                margin: 0 8px 4px 0
                font-size: 9px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .item
                padding: 0 6px
                border: 1px solid rgba(7, 17, 27, 0.1)
                border-radius: 1px
                color: rgb(147, 153, 159)
                background: #fff
            .time
              position: absolute
              top: 0
              right: 0
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
</style>
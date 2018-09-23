<template>
  <div class="header">
    <div class="header-wrapper">
      <div  class="header-avatar">
        <img :src="seller.avatar" alt="">
      </div>
      <div class="header-content">
        <div class="content-title">
          <span class="title-band"></span>
          <span class="title-name">{{seller.name}}</span>
        </div>
        <div class="content-sender">
          {{seller.description}}/{{seller.deliveryTime}}分钟到达
        </div>
        <div v-if="seller.supports" class="supports">
          <span class="count-brand" :class="countMap[seller.supports[0].type]"></span>
          <span class="count-name">{{seller.supports[0].description}}</span>
        </div>
        <div v-if="seller.supports" class="count-all" @click="showDetail">
          {{seller.supports.length}}个
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <div class="announce" @click="showDetail">
      <span class="announce-brand"></span>
      <span class="announce-name">{{seller.bulletin}}</span>
      <i class="icon-keyboard_arrow_right icon"></i>
    </div>
    <div class="header-bg">
      <img :src="seller.avatar" alt="">
    </div>
    <!-- 弹出层的结构 -->
    <transition name='fade'>
      <div v-show="detailShow" class="detail" >
      <!-- sticky footer 布局 -->
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="title">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <headline :info="`优惠信息`"></headline>
            <ul class="supports" v-if="seller.supports">
              <li v-for="(item,index) in seller.supports" :key="index" class="support-item">
                <span class="count-brand" :class="countMap[seller.supports[index].type]"></span>
                <span class="count-name">{{seller.supports[index].description}}</span>
              </li>
            </ul> 
            <headline :info="`商家公告`"></headline>
            <div class="announce-wrapper">
              {{seller.bulletin}}
            </div>
          </div>
        </div>
        <div class="detail-close" @click="hideDetail">
          <i class="icon-close"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type='text/ecmascript-6'>
  import star from '../star/star.vue'
  import headline from '../headline/headline.vue'

  export default {
    data() {
      return {
        // countMap : ["decrease", "discount", "guarantee", "invoice", "special"],
        detailShow: false
      };
    },
    props: {
      seller: {
        type: Object
      }
    },
    methods: {
      showDetail: function() {
        this.detailShow = true;
      },
      hideDetail: function() {
        this.detailShow = false;
      }
    },

    components: {
      star,
      headline
    },

    computed: {},
    created() {
      this.countMap = ["decrease", "discount", "guarantee", "invoice", "special"]
    }
  };
</script>

<style lang='stylus' rel='stylesheet/stylus' scoped>
@import '../../common/stylus/mixin.styl';

.header {
  position: relative;
  background-color: rgba(7, 17, 27, 0.5);

  .header-wrapper {
    padding: 24px 0 18px 24px;
    font-size: 0;

    .header-avatar {
      display: inline-block;
      vertical-align: top;
      width: 64px;
      height: 64px;
      background: #eee;

      img {
        width: 64px;
        height: 64px;
      }
    }

    .header-content {
      position: relative;
      display: inline-block;
      margin-left: 18px;
      font-size: 0px;

      .content-title {
        margin: 2px 0 8px 0px;

        .title-band {
          display: inline-block;
          width: 30px;
          height: 18px;
          bg-img('brand');
          vertical-align: top;
          background-size: 30px 18px;
          background-repeat: no-repeat;
        }

        .title-name {
          font-size: 16px;
          color: #fff;
          font-weight: bold;
          margin-left: 6px;
        }
      }

      .content-sender {
        font-size: 12px;
        font-weight: 200;
        color: #fff;
        margin-bottom: 10px;
      }

      .supports {
        font-size: 0;
          .count-brand {
            display: inline-block;
            width: 12px;
            height: 12px;
           
            background-size: 12px 12px;
            background-repeat: no-repeat;

            &.decrease {
              bg-img('decrease_1');
            }
            &.discount {
              bg-img('discount_1');
            }

            &.guarantee {
              bg-img('guarantee_1');
            }

            &.invoice {
              bg-img('invoice_1');
            }

            &.special {
              bg-img('special_1');
            }
          }

          .count-name {
            vertical-align: top;
            margin-left: 4px;
            font-size: 10px;
            font-weight: 200;
            color: #fff;
      
        }
      }

      .count-all {
        position: absolute;
        right: -20px;
        bottom: 0;
        padding: 7px 8px;
        color: #fff;
        font-size: 10px;
        font-weight: 200;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
    }
  }

  .announce {
    height: 28px;
    line-height: 28px;
    background-color: rgba(7, 17, 27, 0.2);
    padding: 0 12px;

    .announce-brand {
      display: inline-block;
      vertical-align: top;
      margin-top: 9px;
      width: 22px;
      height: 12px;
      bg-img('bulletin');
      background-size: 22px 12px;
      background-repeat: no-repeat;
    }

    .announce-name {
      display: inline-block;
      width: 85%;
      vertical-align: top;
      font-size: 10px;
      font-weight: 200;
      color: #fff;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }

    .icon {
      display: inline-block;
      vertical-align: middle;
      color: #fff;
    }
  }

  .header-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: -1;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      filter: blur(10px);
    }
  }

  .detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(7, 17, 27, 0.8);
    // filter: blur(10px);
    -webkit-backdrop-filter blur(10px)//iphone下面的背景虚化效果
    overflow: auto; // 关键点
    z-index: 100;

    .detail-wrapper {
      min-height: 100%; // 关键点
      width: 100%;

      .detail-main {
        margin-top: 64px;
        padding-bottom: 64px; // 关键点
        .title{
          font-size 16px;
          font-weight 700;
          text-align center;
          color #fff
        }
        .star-wrapper{
          margin-top 16px
          text-align: center
        }
        .supports {
          padding 0 36px;
          font-size: 0;
          .support-item {
            margin-bottom 12px;
            padding-left 12px;
            .count-brand {
              display: inline-block;
              vertical-align top;
              width: 16px;
              height: 16px;
             
              background-size: 16px 16px;
              background-repeat: no-repeat;

              &.decrease {
                bg-img('decrease_1');
              }
              &.discount {
                bg-img('discount_1');
              }

              &.guarantee {
                bg-img('guarantee_1');
              }

              &.invoice {
                bg-img('invoice_1');
              }

              &.special {
                bg-img('special_1');
              }
            }

            .count-name {
              vertical-align: middle;
              margin-left: 6px;
              font-size: 12px;
              font-weight: 200;
              line-height 15px;
              color: #fff;
            }
          }
        }
        .announce-wrapper{
          padding 0 48px;
          font-size 12px;
          font-weight 200;
          color #fff;
          line-height 24px;
        }
      }
    }

    .detail-close {
      position: relative; // 关键点
      width: 32px;
      height: 32px;
      font-size: 32px;
      color: #fff;
      margin: -64px auto 0 auto; // 关键点
      clear: both; // 关键点
    }
  }
}
</style>
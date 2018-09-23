<!-- 评价组件 全部 推荐 吐槽 -->
<template>
  <div class="ratingselect">
      <div class="rating-type">
          <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
          <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
          <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
      </div>
      <div class="switch">
        <span @click="toggleContent" class="icon-check_circle" :class="{'on':onlyContent}"></span>
        <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>

<script type='text/ecmascript-6'>

const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;

export default {
  data () {
    return {
        flag: false
    };
  },
  props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType:{
          type: Number
      },
      onlyContent:{
          type: Boolean
      },
      desc: {
          type: Object,
          default() {
              return {
                  all: '全部',
                  positive: '满意',
                  negative: '不满意'
              }
          }
      }
  },

//   components: {},

  computed: {
      positive() {
          return  this.ratings.filter((x) => {
              return x.rateType===0;
          })
      },
      negative() {
        return  this.ratings.filter((x) => {
          return x.rateType===1;
        })
      },
  },

//   mounted: {},

  methods: {
      select(type, event) {
        if (!event._constructed) {
            return;
        }
        this.$emit('select', type);

      },
      toggleContent() {
        if (!event._constructed) {
          return;
        }
        this.$emit('toggle');

        }
    },
    
}

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
    @import "../../common/stylus/mixin.styl"
    .ratingselect
        .rating-type
            padding 18px 0
            margin 0 18px
            font-size 0
            border-1px(rgba(7,17,27,.1))
            .block
                display: inline-block
                padding: 8px 12px
                margin-right: 8px
                line-height: 16px
                border-radius: 1px
                font-size: 12px
                color: rgb(77, 85, 93)
                &.active
                    color: #fff
                .count
                    padding-left: 2px
                    font-size: 8px

                &.positive
                    background: rgba(0, 160, 220, 0.2)
                    &.active
                        background: rgb(0, 160, 220)
                &.negative
                    background: rgba(77, 85, 93, 0.2)
                    &.active
                        background: rgb(77, 85, 93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom: 1px solid rgba(7, 17, 27, 0.1)
            color: rgb(147, 153, 159)
            font-size: 0
            
            .icon-check_circle
                &.on
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align: top
                margin-right: 4px
                font-size: 24px
            .text
                display: inline-block
                vertical-align: top
                font-size: 12px




</style>
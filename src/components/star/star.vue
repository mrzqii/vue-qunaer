<!-- 评分系统组件 -->
<template>
  <div class="star" :class="starType">
      <span class="star-item" 
        :class="itemClass" 
        v-for="(itemClass, index) in itemClasses" 
        :key="index">
      </span>
  </div>
</template>

<script type='text/ecmascript-6'>
    const LENGTH = 5;
    const CLS_ON = 'on';
    const CLS_OFF = 'off';
    const CLS_HALF = 'half';

    export default {
        props: {
            size:{
                type:Number
            },
            score:{
                type:Number
            }
        },
    computed: {
        // 将传过来的size转为图片的具体的尺寸
        starType(){
            return 'star-'+this.size
        },
        // 将评分转换为数组
        itemClasses(){
            // 将评分转换为：比如4, 4.5这类数字
            let thisScore = Math.floor((this.score)*2)/2 
            let itemClasses = []
            // 判断是否有半颗星
            let hasHalfStar = thisScore % 1 !== 0
            for(let i=0;i<Math.floor(thisScore);i++){
                itemClasses.push(CLS_ON)
            }
            if(hasHalfStar){
                itemClasses.push(CLS_HALF)
            }
            // 判断是否有空星
            while(itemClasses.length < LENGTH){
                itemClasses.push(CLS_OFF)
            }
            return itemClasses
        }, 
    },
 
    }

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
    @import '../../common/stylus/mixin.styl';
    .star
        .star-item
            display inline-block
            background-repeat no-repeat
        &.star-48
          .star-item
            width 20px
            height 20px
            margin-right 22px
            background-size 20px 20px
            &.on
              bg-img('star48_on')
            &.off
              bg-img('star48_off')
            &.half
              bg-img('star48_half')
        &.star-36
          .star-item
            width 15px
            height 15px
            margin-right 6px
            background-size 15px 15px
            &.on
              bg-img('star36_on')
            &.off
              bg-img('star36_off')
            &.half
              bg-img('star36_half')
        &.star-24
          .star-item
            width 10px
            height 10px
            margin-right 3px
            background-size 10px 10px
            &.on
              bg-img('star24_on')
            &.off
              bg-img('star24_off')
            &.half
              bg-img('star24_half')

</style>
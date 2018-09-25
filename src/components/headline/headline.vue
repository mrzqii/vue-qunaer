<!--  -->
<template>
  <div class="title-wrapper">
      <div class="line"></div>
      <div class="title">{{info}}</div>
      <div class="line"></div>
  </div>
</template>

<script type='text/ecmascript-6'>
    export default{
        props: {
            info:{
                type:String
            },
             
        },
    }

</script>
<style lang='stylus' rel='stylesheet/stylus' scoped>
  .title-wrapper
    display flex
    padding 0 36px
    margin 28px 0 24px 0
    .line
      flex 1
      border-bottom 1px solid rgba(255,255,255,.2)
    .title
      font-size 14px
      font-weight 700
      color #ffffff
      line-height 4px
      padding 0 12px

</style>
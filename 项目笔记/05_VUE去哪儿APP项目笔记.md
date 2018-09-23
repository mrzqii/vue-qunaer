### 点击弹出商品详情food组件  

##### 评价:好评 差评切换 （子组件ratingselect和父组件food通讯）
> 点击显示全部评价 点击的那一项会active

这个地方主要是food 组件和 ratingselect组件通讯，先大概思路说一下：父组件设置data属性selectType来表示显示评价类别，这里默认是显示全部评价，然后把这个值传递到子组件中，子组件通过这个selectType的值来确定哪类评价被选中（高亮，active类生效）；然后点击某一个类别的评价，会触发绑定在他们身上的click事件，并把自己的评价类别传到事件触发的函数里面`@click="select(2,$event)"` 这个函数会派发一个事件，然后把这个参数2（评价类别）传到父组件去，父组件监听到这个事件以后触发自己的函数`selectRating` 然后把this.selectType设置为传递过来的type (这里就是那个2)，这样父组件的data属性selectType就发生了变化，而这个属性会被传递到子组件里面，这样就使子组件发生了切换评价类别  

其实就是一个循环：父组件传递selectType到子组件，子组件根据这个值来确定哪个评价类型被选中，然后子组件点击切换评价类别，传递评价类型到父组件，父组件更新selectType的值，然后再传递到子组件

```
在父组件中传值到子组件 监听select事件：

<ratingselect 
    @toggle="toggleContent"  
    @select="selectRating"   看这里
    :selectType="selectType" 看这里
    :onlyContent="onlyContent"
    :ratings="food.ratings"
></ratingselect>

在子组件中点击触发select方法：

<div class="rating-type">
  <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">全部<span class="count">{{ratings.length}}</span></span>
  <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">积极<span class="count">{{positive.length}}</span></span>
  <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">小鸡<span class="count">{{negative.length}}</span></span>
</div>

select方法传递type到父组件

select(type, event) {
    if (!event._constructed) {
        return;
    }
    this.$emit('select', type);
    
},

父组件修改selectType的值
selectRating(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
    });
  },

```

##### 评价:是否只显示有内容的评价 （子组件ratingselect和父组件food通讯）
> 勾选是，只显示有评价类容的评价

和切换评价类别相似的逻辑；

```
在父组件中传值到子组件 监听toggle事件：

<ratingselect 
    @toggle="toggleContent"    看这里
    @select="selectRating"    
    :selectType="selectType" 
    :onlyContent="onlyContent" 看这里
    :ratings="food.ratings"
></ratingselect>

在子组件中 绑定点击事件，触发toggleContent 方法

<span @click="toggleContent" class="icon-check_circle" :class="{'on':onlyContent}"></span>

上面的方法会派发一个toggle事件，父组件会监听
这个是子组件中的方法：

toggleContent() {
    if (!event._constructed) {
      return;
    }
    this.$emit('toggle');

    }
    
    
在父组件food中，监听toggle事件，触发父组件的toggleContent方法，对onlyContent取反

toggleContent() {
      this.onlyContent = !this.onlyContent
      this.$nextTick(() => {
        this.scroll.refresh();
    });
  },
  
这样子onlyContent就发生了变化，从而导致子组件里面的是否只看类容框发生变化
```

##### 如何将下面的评价列表和上面的评价类别、是否只看内容联动起来
> 点击评价类别或者是否只看内容，下面的评价列表会根据条件做出筛选，然后再显示出来

其实就是通过onlyContent  selectType两个参数的变化而做出的选择

```
这条评价是否需要展示

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
  
  上面的返回值是一个布尔值，然后再每一条评价上面绑定needShow,来控制是否显示
  
  <li v-show="needShow(rating.rateType,rating.text)" class="rating-item" v-for="(rating, index) in food.ratings" :key="index">
  
```

##### 这里一些小的注意事项
```
对于父组件:desc="desc" 这一项我们可以传，可以不传，如果不传就会使用 子组件的默认值

<ratingselect 
    @toggle="toggleContent"
    @select="selectRating"
    :selectType="selectType"
    :onlyContent="onlyContent"
    :ratings="food.ratings"
    :desc="desc" 看这里
></ratingselect>

子组件的props中： 注意默认值default的写法

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
  
  
```

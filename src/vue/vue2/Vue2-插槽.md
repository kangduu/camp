---
title: Vue插槽
category: Vue
---

### 剧场序幕

​	程序媛工作了3年，家里一直催他结婚，而他女朋友必须要有房才同意，所以阿旺现在只能没日没夜的加班，准备先买个一居室（🙁）.....今天我们的剧情就以购房为背景，让你从中学习Vue插槽相关的知识。

> 一个一居室的房子

```vue
<template>
  <span class="one-bedroom">
    <slot>这是一居室的清水房</slot>
  </span>
</template>
```

> 默认插槽

1. 默认插槽的缩写语法> 具名插槽

```html
<slot name='footer' v-bind:column='column'/> // column
// 父组件
<templete v-slot:footer='scopeColumn'> 
  {{scopeColumn.column}}
</templete>
```> 作用域插槽

1. **插槽 prop** ：绑定在 `<slot>` 元素上的 attribute 

   ```html
   <slot :row='row'></slot>  // row
   ```

2. 父级作用域中使用**插槽 prop**

   ```html
   // 父组件
   <templete v-slot:default="scope">
    {{scope.row}}
   </templete>
   ```

3. 不带参数的 `v-slot` 被假定对应默认插槽

   ```

   ```

   ​

4. ​

> 插槽默认值### 拓展阅读

1. 内容分发
2. RFC

  [Vue插槽]: https://cn.vuejs.org/v2/guide/components-slots.html&quot;v-slot【slot和slot-scope已被废弃】&quot;


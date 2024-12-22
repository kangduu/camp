---
title: Vue内置元素
category: Vue
---

## v-for

#### in 操作符

> `v-for="alias in expression"`  

- **alias** 为当前遍历的元素提供别名
- **expression**  预期值：Array | Object | number | string | <u>Iterable (2.6 新增)</u>

###### 不同的expression预期值对应的alias

1. Array

   🌰数组项

   ```html
   <li v-for="value in array" :key="value">
     {{value}}
   </li>
   ```

   🌰数组项 + 索引值

   ```html
   <li v-for="(value,index) in array" :key="value+index">
     {{ value}} {{index}}
   </li>
   ```

   数组可以使用的alias别名仅包括上述两种值，当你再添加其它值，都将得到undefined。

2. Object

   🌰属性值

   ```html
   <li v-for="(propertyValue) in object" :key="propertyValue">
     {{propertyValue}}
   </li>
   ```

   🌰属性值 + 键值

   ```html	
   <li v-for="(propertyValue,key) in object" :key="propertyValue+key">
     {{key}}
     {{propertyValue}}
   </li>
   ```

   key值？自身属性还是包括了继承属性？ 否

   🌰属性值 + 键值 + 索引

   ```html
   <li v-for="(propertyValue,key,index) in object" :key="propertyValue">
     {{key}}
     {{propertyValue}}
     {{index}}
   </li>
   ```

​	索引值是从 0 开始的数字值，对象其实也是散列表、映射、字典。。。

3. number

   🌰值

   ```html
   <li v-for="value in 10" :key="value">
     {{value}}
   </li>
   ```

   注意：页面显示的是 1 - 10 ，而不是 0 - 9 。

   vue内部是如何处理的啦？

   🌰值 + 索引

   ```html
   <li v-for="(value,index) in 10" :key="value">
     {{value}}
     {{index}}
   </li>
   ```

   这种情况下，index表示的就是遍历索引值，0 - 9 。

4. string

   字符串时，同数字一样的情况，有value和index两个属性，分别表示对应字符加索引值。

#### v-for (alias of expression) ?

使用该模式与 in 操作符完全一致

#### 如何处理属性值为null或undefined的情况？

当expression存在属性值为null或undefined时，还是会执行对应循环体，页面显示为空。

实际开发时，针对这种情况需要执行【空值校验】

#### 若expression为Object，属性是否包括继承属性？

v-for(alias in expression)  只循环对象自身属性。
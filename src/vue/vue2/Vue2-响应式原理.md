---
title: Vue专栏之Vue2.x的响应式原理剖析
category: Vue
---

### 简述Vue2.x的响应式原理

在Vue实例初始化数据时，遍历Vue 实例的 `data` 选项，并使用 [`Object.defineProperty`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty) 将其属性转换为 [getter/setter](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects#%E5%AE%9A%E4%B9%89_getters_%E4%B8%8E_setters)。当页面`使用了`对应的属性时，会进行依赖收集（当前组件的watcher），若属性发生变化，则通知相关依赖进行更新操作（发布/订阅）。 参考—— [vue.js-深入响应式原理](https://cn.vuejs.org/v2/guide/reactivity.html)

在js中，数组也是一种对象，但是vue对其数据响应化处理并不能简单的使用对象方式。而是需要重写Array对象的原型方法。

### Vue2.x中如何监测数组变化

使用函数劫持的方式，重写数组原型链上的数组方法（可以改变原数组的7种方法）。

> `push` `pop` `shift` `unshift` `splice`  `reverse`  `sort` 

```javascript
//获取原型
const originalProto = Array.prototype;
// 创建一个新对象，拦截数组的7个方法
const arrayProto = Object.create(originalProto);
['push','pop','shift','unshift','splice','reverse','sort'].forEach(method=>{
  arrayProto[method] = function(){
    // 做你本应该做的事情
    originalProto[method].apply(this,arguments);
    //通知更新
    notifyUpdate()
  }
})
function notifyUpdate(){}
```

### Vue2.x响应式存在的不足

1. 如果需要响应的数据量较大，初始化时递归遍历的性能不好、消耗大；
2. 新增和删除属性无法监听；
3. 数组的响应化需要额外实现，并且只能使用对应的7个原型方法；
4. 对象的修改语法有限制（需要使用vm.$set,直接obj.peroto会出现无法监听的问题）


### 思路解析图

![](http://dukangblog.top/img/vue.observer.watcher.jpg)

- Observer数据监听器：把一个普通的 JavaScript 对象传给 Vue 实例的 data 选项，Vue 将遍历此对象所有的属性，并 **使用Object.defineProperty 方法** 把这些属性全部转成setter、getter方法。当data中的某个属性被访问时，则会调用getter方法；当data中的属性被改变时，则会调用setter方法。
- Compile指令解析器：对每个元素的指令进行解析，替换模板数据，并绑定对应的更新函数，初始化相应的订阅。
- Watcher订阅者：作为连接 Observer 和 Compile 的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数。
- Dep 消息订阅器：内部维护了一个**数组**，用来收集订阅者（Watcher），数据变动触发notify 函数，再调用订阅者的 update 方法
- Updater 更新

###### 数据发生变化时？

1. Observer中的setter方法触发
2. setter立即调用Dep.notify()
3. Dep开始遍历所有的订阅者，并调用订阅者的update方法
4. 订阅者收到通知后对视图进行相应的更新

### 你需要格外注意的

1.  Vue 不支持 IE8 以及更低版本浏览器的原因?

   **Object.defineProperty**是 ES5 中一个无法 shim（可理解为兼容性处理） 的特性

2. ` vm.a === vm.date.a`  ?

   初始化时，使用proxy代理方法，遍历data的属性，并将其代理到vm实例上。

3. 让你实现observer方法？

   ```javascript
   // array handler
   const originalProto = Array.prototype;
   const arrayProto = Object.create(originalProto);
   ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'].forEach(method => {
     arrayProto[method] = function () {
       // 处理本应该做的事
       originalProto[method].apply(this, arguments)

       // 通知更新
       notifyUpdate()
     }
   })
   function observe(options) {
     // check type 
     if (typeof options !== 'object' || options === null) return options
     if (Array.isArray(options)) {
       // array 替换其原型
       Object.setPrototypeOf(options, arrayProto)
     } else {
       // obj 数据劫持
       const keys = Object.keys(options);
       for (let index = 0; index < keys.length; index++) {
         const key = keys[index];
         // 对每一个key执行拦截
         defineReactive(options, key, options[key])
       }
     }
   }
   function defineReactive(object, key, value) {
     //递归遍历value
     observe(value);
     // 重定义getter/setter
     Object.defineProperty(object, key, {
       get() {
         return value
       },
       set(newValue) {
         if (newValue !== value) {
           // 若是对象
           observe(newValue);
           // 通知更新
           notifyUpdate();
           // 更新 值
           value = newValue; // 你应该知道这个value是一个闭包。
         }
       }
     })
   }
   function notifyUpdate() {
     // 通知更新操作
     // ......
   }
   ```

### 结束语

看完以上内容，你应该掌握vue2.x的响应式原理了，那么接下来你应该学习vue3.x的响应式原理。

> 学无止境 啊.......


---
title: Vue
---

## Vue 采用了什么模型？和 MVC 模型有什么区别？

​ vue 采用的是 mvvm 模型。

​ mvvm 模型中，视图和模型无法直接通信，必须依赖 View Model 通信。

​ ViewModel 模型中通常需要实现一个 observer 观察者，其职责就是当数据改变时（model），通知视图做更新，当视图改变（用户操作等）时，通知数据修改。

​ `双向数据绑定` 实现数据在模型和视图的相互转换（更新）。模型-->VM-->视图 （数据绑定）；视图-->VM-->模型（事件监听）

#### MVVM 【模型-视图-视图模型】（Model-View-ViewModel）

- **M（Model）：数据模型层**。<u>js 中的数据</u>，（后端传递的数据，业务逻辑相关的数据对象）；
- **V（View）：视图层**。用户所有**可见页面**；
- **VM（ViewModel）：视图模型层** 。<u>vue 实例化对象</u>，MVVM 的核心，连接 view 和 model 的桥梁；

View 与 ViewModel 之间通过双向绑定（data-binding）建立联系，这样当 View（视图层）变化时，会自动更新到 ViewModel（视图模型），反之亦然。

#### MVC 【模型-视图-控制器】（Model-View-Controller)

- **M（Model）：数据模型层**。是应用程序中用于**处理应用程序数据逻辑**的部分，模型对象**负责在数据库中存取数据**。
- **V（View）：视图层**。是应用程序中**处理数据显示**的部分，视图是依据模型数据创建的。
- **C（Controller）：控制层**。是应用程序中**处理用户交互**的部分，控制器**负责从视图读取数据，控制用户输入，并向模型发送数据**。

#### MVVM 和 MVC 的区别

​ MVC 和 MVVM 的区别并不是 VM 完全取代了 C，ViewModel 存在目的在于抽离 Controller 中展示的业务逻辑，而不是替代 Controller，其它视图操作业务等还是应该放在 Controller 中实现。也就是说 MVVM 实现的是业务逻辑组件的重用。由于 mvc 出现的时间比较早，前端并不那么成熟，很多业务逻辑也是在后端实现，所以前端并没有真正意义上的 MVC 模式。

#### 拓展—前后端数据处理流程

- **Client** - 客户端，一般指浏览器，浏览器可以通过 HTTP 协议向服务器请求数据。
- **Server** - 服务端，一般指 Web 服务器，可以接收客户端请求，并向客户端发送响应数据。
- **Business** - 业务层， 通过 Web 服务器处理应用程序，如与数据库交互，逻辑运算，调用外部程序等。
- **Data** - 数据层，一般由数据库组成。

## 说一说 Vue2.x 的生命周期

[声明周期](http://dukangblog.top/2020/03/17/Vue-2.x%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/)

## vue2 响应式原理 【[深度理解 vue](https://cn.vuejs.org/v2/guide/reactivity.html)】

#### observe 的实现思路

```javascript
// vue2 数组的响应式原理： 覆盖可以修改数组的7个方法（修改原型上的方法）
// 思想(数组)： 从数组原型上获取到这7个方法，并覆盖为可以发送更新通知的函数实现
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto);
["push", "pop", "shift", "unshift", "splice", "reverse", "sort"].forEach((method) => {
  arrayProto[method] = function () {
    //做你本来该做的事
    originalProto[method].apply(this, arguments);

    //通知更新
    notifyUpdate();
  };
});
// vue2 对象的响应式原理： Object.defineProperty() 、 遍历每个key，定义getter、setter
// 思想(对象)： 递归遍历传入的obj，定义每一个属性的拦截
function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  // 判断类型：如果是数组则替换其原型
  if (Array.isArray(obj)) {
    Object.setPrototypeOf(obj, arrayProto);
  } else {
    const keys = Object.keys(obj);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      // 对obj每个key执行拦截
      defineReactive(obj, key, obj[key]);
    }
  }
}
// 具体定义指定的key拦截器
function defineReactive(obj, key, val) {
  //递归遍历，val是否为对象
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        // newVal可能是对象
        observe(newVal);
        // 通知更新
        notifyUpdate();
        val = newVal; // val 不会被释放 ，val 在这里是一个闭包
      }
    },
  });
}
function notifyUpdate() {
  console.log("响应数据更新");
}
const data = { foo: "foo", bar: { a: 0 }, arr: [1, 2, 3] };
observe(data);
// 1. 普通更新
// data.foo = 'foooooooooooooooooooooooooooo'
// 2. 嵌套属性更新
// data.bar.a = 3
// 3. 赋值是对象
// data.bar = { a: 100 }
// 4. 数组的更新
// data.arr.push(4)
```

###### 简单描述 vue2.x 的响应式原理

> 在初始化数据时，使用 Object.definePrototype 重新定义 data 中所有属性的 getter/setter，当页面使用对应的属性时，先进行依赖收集（收集当前组建的 watcher），若属性发生变化会通知相关依赖进行更新操作（发布订阅）。

###### vue2.x 中如何监测数组变化

> 使用函数劫持的方式，重写原型链上的数组方法（七个能够改变原数组，['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']）

```javascript
const originalProto = Array.prototype;
const arrayProto = Object.create(originalProto);
["push", "pop", "shift", "unshift", "splice", "reverse", "sort"].forEach((method) => {
  arrayProto[method] = function () {
    //做你本来该做的事
    originalProto[method].apply(this, arguments);

    //通知更新
    notifyUpdate();
  };
});
```

#### vue2 响应式存在的不足

1. 当需要响应化数据较大时，递归遍历性能不好、消耗较大。（初始化进行）
2. 新增或删除属性无法监听。需使用 vue.set(obj,proName,value)
3. 数组的响应化需要额外实现
4. 对象属性修改语法有限制（需要使用 vm.$set,直接 obj.peroto 会出现无法监听的问题)

## vue3.x 的响应式原理

#### 知识储备

1. Proxy
2. Reflect
3. WeakMap()

#### 响应原理

Vue3.x 改用了 ES6 的 proxy 替代 Object.definePrototype。同时支持优雅降级（**如果浏览器不支持 3.x，则采用 2.x 方法**）

1. proxy 可以监听数组和对象的变化
2. 多达 13 种拦截方法
3. 作为新标准将受到浏览器厂商重点持续的性能优化

###### Proxy 只会代理对象的第一层，那么 Vue3.x 又是怎样处理这个问题的？

> 判断当前 Reflcet.get 的返回值是否为对象 Object，如果是则再通过 reactive 方法做代理，这样便实现了深度代理。

###### 监测数组的时候，可能会触发多次 get/set，那么如何防止触发多次啦？

> 判断 key 是否为当前被代理对象 target 自身属性，也可以判断旧值与新值是否相等，只有满足以上两个条件之一时，才有可能执行 trigger。

## 事件绑定原理

1. **原生事件**绑定是通过`addEventListener`绑定给真实元素的，
2. **组件事件**绑定是通过 Vue 自定义的`$on`实现的。

## 组件间通信

#### 父子组件通信

- [props](https://cn.vuejs.org/v2/guide/components-props.html) (父传子)

- [$on](https://vuejs.bootcss.com/api/#vm-on) [$emit](https://vuejs.bootcss.com/api/#vm-emit) (子传父)

- `$parent` `$children` (获取父子组件实例)

- [ref](https://vuejs.bootcss.com/api/#ref) (获取实例的方式、调用组件的属性或者方法)

- [provide / inject](https://vuejs.bootcss.com/api/#provide-inject) (官方不推荐使用，但是写组件库时很常用)

#### 兄弟组件通信

- Event Bus (实现跨组件通信 `Vue.prototype.$bus = new Vue` )
- Vuex

#### 跨级组件通信

- `Vuex`
- `$attrs、$listeners`
- `provide/inject`

## vue 里 v-model 指令可以缩写成什么？

**<u>似乎是没有缩写</u>**

```html
<input v-model="something" />
等同于下边：
<input v-bind:value="something" v-on:input="something = $event.target.value" />
// 这里的 $event.target.value 是指的js对象的property
```

`v-model`本质就是一个语法糖，可以看成是`value + input`方法的语法糖。 可以通过 model 属性的`prop`和`event`属性来进行自定义。原生的 v-model，会根据标签的不同生成不同的事件和属性。

## v-if 和 v-show

条件不成立时：

v-if **不渲染 DOM 元素**；

v-show 操作样式（display），切换当前 DOM 的显示和隐藏。

## 组件中的 data 为什么是一个函数？

组件被复用多少次，就会创建多少个实例；本质上，`这些实例用的都是同一个构造函数`。

data 是对象（属于引用类型）则会影响到所有的实例。

**保证组件不同的实例之间 data 不冲突**，data 必须是一个函数（return）。

## 特殊属性 [key](https://vuejs.bootcss.com/api/#key) 的作用

**key 的作用是<u>尽可能的复用 DOM 元素</u>。**

新旧 children 中的节点只有顺序是不同的时候，最佳的操作应该是通过移动元素的位置来达到更新的目的。

需要在新旧 children 的节点中保存映射关系，以便能够在旧 children 的节点中找到可复用的节点。key 也就是 children 中节点的唯一标识。

## 探讨[computed](https://vuejs.bootcss.com/api/#computed)和[watch](https://vuejs.bootcss.com/api/#vm-watch)

> `Computed`本质是一个具备[缓存](https://vuejs.bootcss.com/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E7%BC%93%E5%AD%98-vs-%E6%96%B9%E6%B3%95)的 watcher，相关响应式依赖的属性发生变化时重新计算并更新视图。
>
> 适用于计算比较消耗性能的[计算属性](https://vuejs.bootcss.com/guide/computed.html#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7)场景。（有缓存，不用每次都去调用方法）
>
> 标签元素上的表达式过于复杂时，在模板中放入过多逻辑会让模板难以维护，可以将复杂的逻辑放入计算属性中处理。
>
> 计算属性默认只有 getter，不过在需要时你也可以提供一个 setter

> `Watch`没有缓存性，更多的是**观察**的作用，可以监听某些数据执行回调。
>
> **需要在数据变化时<u>执行异步或开销较大</u>的操作时，这个方式最有用（合适）。**
>
> 当我们需要深度监听对象中的属性时，可以打开`deep：true`选项，这样便会对对象中的每一项进行监听。
>
> `deep：true`会带来性能问题，优化的话可以使用`字符串形式`监听，如果没有写到组件中，不要忘记使用`unWatch手动注销`

## [keep-alive](https://vuejs.bootcss.com/api/#keep-alive)的作用

`keep-alive`可以实现组件缓存，当组件切换时不会对当前组件进行卸载。

常用的两个属性`include/exclude`，允许组件有条件的进行缓存(主要用于保留组件状态或避免重新渲染。)。

两个生命周期`activated/deactivated`，用来得知当前组件是否处于活跃状态。

**注意**

1. `<keep-alive>` 是用在**其一个直属的子组件**被开关的情形。
2. **如果你在其中有 `v-for` 则不会工作。**
3. 如果有上述的多个条件性的子元素，`<keep-alive>` 要求同时只有一个子元素被渲染。
4. `<keep-alive>` 不会在[函数式组件](https://cn.vuejs.org/v2/guide/render-function.html#%E5%87%BD%E6%95%B0%E5%BC%8F%E7%BB%84%E4%BB%B6)中正常工作，因为它们没有缓存实例。

## vue 里有一种情况是双向绑定失效，说一说你遇到的例子，怎么解决

> **Vue 无法检测到对象属性的添加或删除**。由于 Vue 会在初始化实例时对属性执行 getter/setter 转化，所以属性必须在 data 对象上存在才能让 Vue 将它转换为响应式的。对于已经创建的实例，Vue 不允许动态添加根级别的响应式属性。但是，可以使用 Vue.set(object, propertyName, value) 方法向嵌套对象添加响应式属性。例如`Vue.set(vm.someObject, 'b', 2)`
>
> 数组方法['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort']之外的方法(修改操作)都无法监听。

```html
<div>{{personal.name}}</div>

<script>
  new Vue({
    el: "#box",
    data: {
      personal: {
        name: "jake",
      },
      arr: [1, 3, 23, 41, 4222],
    },
    methods: {
      submit() {
        this.personal.age = 12; // 这里为personal对象新增 age 属性，不是响应式的。
        //正确做法
        // this.$set(this.personal, 'age', 12)
      },
      mounted() {
        this.$set(this.arr, 0, 1000); // 正确的做法
        this.arr.push(3); // 正确的做法
        this.arr[3] = 12213; // 无效
      },
    },
  });
</script>
```

[检测变化的注意事项](https://cn.vuejs.org/v2/guide/reactivity.html#%E6%A3%80%E6%B5%8B%E5%8F%98%E5%8C%96%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

[Vue 不能检测数组的变动](https://cn.vuejs.org/v2/guide/list.html#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

[Vue 中对象变更检测注意事项](https://cn.vuejs.org/v2/guide/list.html#%E5%AF%B9%E8%B1%A1%E5%8F%98%E6%9B%B4%E6%A3%80%E6%B5%8B%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

## 你理解的 vue 路由是什么？ [Vue Router](https://router.vuejs.org/zh/)

它和 Vue.js 的核心深度集成，让**构建单页面应用变得易如反掌**。包含的功能有：

1. 嵌套的路由/视图表
2. 模块化的、基于组件的路由配置
3. 路由参数、查询、通配符
4. 基于 Vue.js 过渡系统的视图过渡效果
5. 细粒度的导航控制
6. 带有自动激活的 CSS class 的链接
7. HTML5 历史模式或 hash 模式，在 IE9 中自动降级
8. 自定义的滚动条行为

参考： [怎样理解 Vue 中的路由](https://blog.csdn.net/zl13015214442/article/details/89636046)

## vue 和其他框架有什么区别？

[Vue.js 对比其他框架](https://cn.vuejs.org/v2/guide/comparison.html)

## Vue 全局 API [Vue.nextTick(handler)](https://cn.vuejs.org/v2/api/#Vue-nextTick)

**下次 DOM 更新循环结束之后执行延迟回调。** nextTick 使用了**宏任务和微任务** （不知道的就不要说出来）

执行环境不同，采用的方法也不同（按序嗅探）：

1. Promise
2. MutationObserver
3. setImmediate
4. setTimeout

上述操作定义了一个异步方法，如果多次调用 nextTick 会将方法存入队列中，通过这个异步方法来清空当前队列。

```javascript
submit () {
  this.message = 'new';
  // DOM 还没有更新
  this.$nextTick(function () {// 数据更新完成执行的回调函数
    console.log(this) // 注意：this 指向当前Vue实列
    // DOM 更新了
  });
  this.$nextTick().then(function () { // 数据更新完成执行的回调函数
    // DOM 更新了
    console.log(this) // 注意：this 指向window，即定义时环境
    this.message = 'olds';
  })
}
```

`提示：上述两种方案，其this指向不同`

## 虚拟 DOM

**产生原因**

> 浏览器中操作 DOM 是很昂贵的。频繁的操作 DOM，会产生一定的性能问题。

**本质**

> `用一个原生的JS对象去描述一个DOM节点。是对真实DOM的一层抽象。`
>
> 也就是源码中的 VNode 类，它定义在 src/core/vdom/vnode.js 中

虚拟 DOM 映射到真实 DOM 要经历 VNode 的 create、diff、patch 等阶段。

# [VUE SSR 服务端渲染](https://ssr.vuejs.org/zh/)

`将Vue在客户端把标签渲染成HTML的工作放在服务端完成，然后再把html直接返回给客户端`

###### 优点

1. 更好的 SEO
2. 首屏加载速度更快

###### 缺点

1. 开发条件会受到限制，服务器端渲染只支持`beforeCreate`和`created`两个钩子
2. 需要一些外部扩展库时需要特殊处理
3. 服务端渲染应用程序也需要处于 Node.js 的运行环境
4. 服务器会有更大的负载需求。

你必须掌握

1. webpack
2. node.js
3. vue

# Vue 的性能优化

### 编码阶段

- 尽量减少`data`中的数据，`data`中的数据都会增加 getter 和 setter，会收集对应的 watcher
- `v-if`和`v-for`不能同时使用
- 在能够满足需求且不出错的情况下，使用 `v-if` 替代 `v-for`
- 如果需要使用`v-for`给每项元素绑定事件时使用`事件代理`
- `key`保证唯一
- 单页面应用（SPA 页面）采用`keep-alive`缓存组件
- 使用路由懒加载、异步组件
- 防抖、节流
- 第三方模块按需导入
- 长列表滚动到可视区域动态加载
- 图片懒加载

### SEO 优化

- 预渲染
- 服务端渲染 SSR

### 打包优化

- 压缩代码
- webpack 的 [Tree Shaking/Scope Hoisting](https://blog.csdn.net/qq_17175013/article/details/87002440)
- 使用 cdn 加载第三方模块
- webpack 的多线程打包 happypack
- webpack 插件 splitChunks 抽离公共文件
- sourceMap 优化
- dll(一次打包第三方包，无需重复打包)

### 用户体验

- 骨架屏
- PWA（Progressive Web App） 渐进式增强 WEB 应用
- 缓存（客户端缓存、服务端缓存）

## hash 路由和 history 路由

`location.hash`的值实际就是 URL 中`#`后面的东西。

`history`实际采用了 HTML5 中提供的 API 来实现，主要有`history.pushState()`和`history.replaceState()`。

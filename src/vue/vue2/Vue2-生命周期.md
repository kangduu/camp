---
title: Vue专栏之Vue2.x的生命周期钩子
category: Vue
---

## Hooks

### beforeCreate

- `可以`

  - 能获取`$parent`,`$root`
  - 接收父组件传递的`监听器` （$on），并作相应处理；【子组件 beforeCreate 在父组件 beforeMount 后】

- `不可`
  - 获取不到`$children`,`$refs`, `$slots`, `$scopedSlots`；

**特殊的**，$createElemt 是使用 render 函数渲染时的 h 函数，[参考 render 函数](https://cn.vuejs.org/v2/guide/render-function.html)

### created

- `可以`

  - 发送 Ajax 请求（你可以在这里做这件事了）
  - 获取父组件注入的数据（父组件注册，所有子组件[包括孙子]都可获取）[provide / inject](https://vuejs.bootcss.com/api/#provide-inject)
  - ​

- `不可`
  - `$el` 属性不可用；
  - 无法与 DOM 进行交互，只能通过 vm.$nextTick 访问，不建议在这里操作 DOM。

### beforeMount

> 挂载前调用，这之前 template 模板已导入渲染函数编译；
>
> 虚拟 DOM 已创建完成，准备渲染。

### mounted

- `可以`

  获取实例属性 `$slots`, `$scopedSlots`

> 挂载完成调用，el 被新建的 vm.$el 代替；
>
> 真实 DOM 挂载完毕，数据完成双向绑定，可访问 DOM，使用$ref；

### beforeupdate

> 更新前调用——响应式数据发生了更新，虚拟 DOM 重新渲染前；
>
> 修改数据，不会造成重渲染。
>
> 适合在更新之前访问现有的 DOM，比如手动移除已添加的事件监听器。

### updated

> 更新完成调用，组件 DOM 也更新完成；
>
> 可以执行依赖于 DOM 的操作；
>
> **避免在此期间更改状态** ，可能导致无效循环的更新；
>
> 若一定要改变相应状态，那就在 computed 或 watcher 中完成相应逻辑。

### activated

> `keep-alive`缓存的组件**激活时**调用

### deactivated

> `keep-alive`缓存的组件**停用时**调用

### beforeDestory

> 实例销毁之前调用，实例仍然完全可用
>
> 清除定时器、监听器等收尾工作

### destoryed

> 实例销毁后调用
>
> 所以指令被解绑、所以事件监听被移除、所有子实例被销毁

### [errorCaptured](https://cn.vuejs.org/v2/api/#errorCaptured)

> 当**捕获一个来自子孙组件的错误时**被调用。

## Vue 中组件生命周期<u>调用顺序</u>

- 组件调用顺序都是`先父后子` ; **<u>渲染</u>完成**顺序都是`先子后父`
- 组件的销毁操作都是`先父后子` ; **<u>销毁</u>完成**顺序都是`先子后父`

### 加载渲染过程

$父 beforeCreate => 父 create => 父 beforeMount => 子 beforeCreate => 子 create => 子 beforeMount => 子 mounted => 父 mounted $

---

### 子组件更新过程

$父 beforeUpdate => 子 beforeUpdate => 子 updated => 父 updated $

### 父组件更新过程

$父beforeUpdate => 子beforeUpdate$

### 销毁过程

$父beforeDestroy => 子beforeDestroy => 子destroyed => 父destroyed$

## 特别注意

- 所有的生命周期钩子自动绑定`this`上下文到实例中，`this`指代 vue 实例，则可以访问数据，属性和方法。

- 不要在**选项属性**或**回调函数**上<u>使用箭头函数</u>。

  ```javascript
  new Vue({
    created: () => {
      // 选项属性使用箭头函数
      // ...
    },
    methods: {
      init() {
        vm.$watch("me", (newValue) => {
          this.method();
        }); // 回调函数使用监听函数
      },
    },
  });
  // 箭头函数是没有this的，箭头函数绑定了父级上下文。
  ```

- `mounted` **不能**保证所有的子组件也一起被挂载（组件的完全挂载，是从子到父完成的）。若希望等到视图渲染完成才执行操作，应该使用 vm.$nextTick()

- `updated` **不会**保证所有的子组件也都一起被重绘（组件的完成更新，是从子到父完成的）。希望等到整个视图都重绘完毕，同样应该使用 vm.$nextTick()

- 服务端渲染（ssr）不会调用的钩子

  `beforeMount ` `mounted` `beforeupdate` `updated` `activated` `deactivated` `beforeDestory` `destoryed`

## QA

Q：接口请求一般放在那个生命周期？

A：一般都是放在 **created** 中。注意，[服务端渲染(ssr)](https://vuejs.bootcss.com/guide/ssr.html)也放在 created 中。

---

Q：Vue 实例选项属性 data，props，methods，computed，watch 的执行顺序？

A：**props > methods > data > computed > watch**

```js
// src\core\instance\state.js
export function initState(vm: Component) {
  vm._watchers = [];
  const opts = vm.$options;
  if (opts.props) initProps(vm, opts.props); // 【1】props
  if (opts.methods) initMethods(vm, opts.methods); // 【2】 methods
  if (opts.data) {
    // 【3】data
    initData(vm);
  } else {
    observe((vm._data = {}), true /* asRootData */);
  }
  if (opts.computed) initComputed(vm, opts.computed); // 【4】computed
  if (opts.watch && opts.watch !== nativeWatch) {
    // 【5】watch
    initWatch(vm, opts.watch);
  }
}
```

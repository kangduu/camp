---
title: JavaScript 的 this
category: javascript
---

## 一句话结论

`this` 是函数执行时的上下文引用，普通函数的 `this` 由调用方式决定，箭头函数的 `this` 由定义时外层作用域决定。判断 `this` 时不要看函数写在哪里，要看函数怎么被调用。

## 为什么需要它

对象方法、事件回调、定时器、类方法和数组回调都可能涉及 `this`。一旦函数被单独传递，原来的对象调用关系就可能丢失。

- 场景：对象方法复用；事件处理；类方法作为回调；手写 `call` / `bind`。
- 不处理会怎样：访问错对象、状态更新失败、出现 `Cannot read properties of undefined`。

## 核心概念

| 调用方式 | `this` 指向 | 示例 |
| ---- | ---- | ---- |
| 默认调用 | 严格模式下是 `undefined`，非严格模式下可能是全局对象 | `fn()` |
| 隐式调用 | 点号左侧对象 | `obj.fn()` |
| 显式调用 | `call` / `apply` / `bind` 指定的对象 | `fn.call(obj)` |
| 构造调用 | 新创建的实例对象 | `new Fn()` |
| 箭头函数 | 外层词法作用域的 `this` | `() => this.value` |

## 原理

```js
const user = {
  name: "Alice",
  say() {
    return this.name;
  },
};

console.log(user.say()); // 'Alice'

const say = user.say;
console.log(say()); // 严格模式下 this 是 undefined
```

`user.say()` 的调用表达式左侧是 `user`，所以 `this` 是 `user`。`say()` 是普通函数默认调用，已经没有左侧对象，`this` 不再指向 `user`。

## 实现

### 修正回调 this

```js
class Counter {
  constructor() {
    this.count = 0;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.count += 1;
    return this.count;
  }
}

const counter = new Counter();
const click = counter.handleClick;

console.log(click()); // 1
```

### 使用箭头函数保留外层 this

```js
const timer = {
  count: 0,
  start() {
    setTimeout(() => {
      this.count += 1;
      console.log(this.count);
    }, 1000);
  },
};

timer.start();
```

箭头函数没有自己的 `this`，这里的 `this` 来自 `start()` 执行时的 `this`。

## 边界与常见坑

- **箭头函数不能被 `call` / `bind` 改 this**：它的 `this` 在定义时已经确定。
- **解构方法会丢失隐式绑定**：`const { say } = user; say()` 不等于 `user.say()`。
- **定时器回调默认不是原对象方法调用**：需要包装函数、`bind` 或箭头函数。
- **DOM 事件监听中的普通函数 this 通常是事件目标**：箭头函数则不是。
- **类方法不会自动绑定实例**：作为回调传递时要显式绑定或写成类字段箭头函数。

## 工程取舍

- 适合：对象方法和类方法中访问实例状态。
- 谨慎：在复杂回调链里依赖动态 `this`，可读性较差。
- 应换方案：工具函数优先用显式参数；需要稳定上下文的回调优先使用箭头函数或在构造阶段绑定。

## 面试 / 自测

1. 普通函数的 `this` 由什么决定？
2. 箭头函数的 `this` 和普通函数有什么不同？
3. `const fn = obj.method; fn()` 为什么会丢失 `this`？
4. `new` 调用时 `this` 指向哪里？
5. `call`、`apply`、`bind` 如何影响 `this`？

## 相关文章

- [call、apply 和 bind](./call.apply.bind.md)
- [new](./new.md)
- [原型链](./prototype.md)

## 参考

- [MDN: this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)
- [MDN: Arrow function expressions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

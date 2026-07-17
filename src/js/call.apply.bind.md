---
title: call、apply 和 bind
category: javascript
---

## 一句话结论

`call`、`apply`、`bind` 都用来显式指定函数执行时的 `this`。区别是：`call` 立即执行且参数逐个传入，`apply` 立即执行且参数用数组传入，`bind` 不立即执行，而是返回一个绑定好 `this` 和预置参数的新函数。

## 为什么需要它

JavaScript 的 `this` 由调用方式决定，而不是由函数定义位置决定。把函数作为回调、事件处理器或变量传递后，原来的对象调用关系经常丢失。

- 场景：复用对象方法；修正回调里的 `this`；借用数组方法处理类数组；实现偏函数。
- 不处理会怎样：函数内部访问到错误对象，出现 `undefined`、全局对象污染或状态更新失败。

## 核心概念

| 方法 | 是否立即执行 | 参数形式 | 返回值 |
| ---- | ---- | ---- | ---- |
| `fn.call(thisArg, a, b)` | 是 | 逐个传参 | 原函数返回值 |
| `fn.apply(thisArg, [a, b])` | 是 | 数组或类数组 | 原函数返回值 |
| `fn.bind(thisArg, a)` | 否 | 可预置部分参数 | 新函数 |

## 原理

普通函数调用时，`this` 来自调用表达式左侧对象。

```js
const user = {
  name: "Alice",
  say() {
    return this.name;
  },
};

const say = user.say;

console.log(user.say()); // 'Alice'
console.log(say()); // 浏览器非严格模式下可能是 window.name，严格模式下是 TypeError
```

`call`、`apply`、`bind` 都是 `Function.prototype` 上的方法，作用是绕过默认调用规则，显式指定本次函数执行的 `this`。

## 实现

### 最小可用版

```js
function greet(prefix, suffix) {
  return `${prefix}${this.name}${suffix}`;
}

const user = { name: "Alice" };

console.log(greet.call(user, "Hi, ", "!")); // 'Hi, Alice!'
console.log(greet.apply(user, ["Hi, ", "!"])); // 'Hi, Alice!'

const greetAlice = greet.bind(user, "Hi, ");
console.log(greetAlice("!")); // 'Hi, Alice!'
```

### 手写 bind

```js
Function.prototype.myBind = function myBind(thisArg, ...presetArgs) {
  const targetFn = this;

  if (typeof targetFn !== "function") {
    throw new TypeError("myBind must be called on a function");
  }

  function boundFn(...laterArgs) {
    const isNewCall = this instanceof boundFn;
    const finalThis = isNewCall ? this : thisArg;

    return targetFn.apply(finalThis, [...presetArgs, ...laterArgs]);
  }

  boundFn.prototype = Object.create(targetFn.prototype);
  return boundFn;
};
```

这个实现覆盖了三个关键点：保存原函数、合并预置参数和后续参数、兼容 `new` 调用。真实规范行为还包括 `length`、`name` 等细节，面试手写通常不要求完全复刻。

## 边界与常见坑

- **箭头函数不能被改 `this`**：箭头函数没有自己的 `this`，`call` / `apply` / `bind` 不能改变它的词法 `this`。
- **`bind` 返回新函数**：每次调用 `bind` 都会生成新引用，事件解绑时必须保存同一个函数引用。
- **`null` / `undefined` 的处理与严格模式有关**：非严格模式下会替换为全局对象，严格模式下保持原值。
- **`apply` 参数必须可展开**：第二个参数应是数组或类数组；现代代码也常用展开语法 `fn(...args)`。
- **绑定函数仍可被 `new` 调用**：`new` 的实例优先级高于绑定的 `thisArg`。

## 工程取舍

- 适合：修正普通函数回调的 `this`、实现方法借用、做简单参数预置。
- 谨慎：在渲染函数或循环里频繁 `bind`，会产生大量新函数。
- 应换方案：新代码中如果只需要继承外层 `this`，优先使用箭头函数；如果需要组合参数，优先考虑清晰的包装函数。

## 面试 / 自测

1. `call` 和 `apply` 的区别是什么？
2. `bind` 为什么不能直接得到原函数执行结果？
3. 箭头函数使用 `bind` 后 `this` 会变吗？
4. 手写 `bind` 为什么要处理 `new`？
5. 事件监听里直接 `element.addEventListener("click", fn.bind(obj))` 有什么解绑问题？

## 相关文章

- [this](./this.md)
- [函数柯里化](./currying.md)
- [高阶函数](./higher-order-function.md)

## 参考

- [MDN: Function.prototype.call](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN: Function.prototype.apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)
- [MDN: Function.prototype.bind](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

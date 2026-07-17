---
title: JavaScript 题集
category: javascript
---

## 一句话结论

JavaScript 题集用于检验基础概念能否串起来：作用域、`this`、原型、异步、数组、类型转换和工程模式。做题时不要只背输出，要能说出执行过程和边界。

## 为什么需要它

面试题通常把多个知识点混在一起，例如变量提升加闭包、Promise 加定时器、`this` 加回调。题集可以帮助快速发现薄弱环节。

- 场景：面试复习、团队内训、自测基础。
- 不处理会怎样：知道单个概念，但遇到组合题无法稳定推理。

## 核心概念

| 题型 | 重点 | 相关文档 |
| ---- | ---- | ---- |
| 输出顺序 | 调用栈、微任务、宏任务 | [Event Loop](./event.loop.md) |
| this 指向 | 调用方式、箭头函数、bind | [this](./this.md) |
| 原型继承 | 原型链、new、instanceof | [原型链](./prototype.md) |
| 作用域提升 | var、函数声明、暂时性死区 | [预编译原理](./precompile.md) |
| 数组处理 | 改原数组、比较语义、reduce | [数组方法](./array.md) |

## 题目

### 1. Promise 和定时器

```js
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");
```

答案：

```text
A
D
C
B
```

同步代码先执行，Promise 回调进入微任务，定时器进入后续任务。

### 2. this 丢失

```js
"use strict";

const user = {
  name: "Alice",
  getName() {
    return this.name;
  },
};

const fn = user.getName;

console.log(user.getName());
console.log(fn());
```

第一行输出 `'Alice'`；第二行严格模式下会因为 `this` 是 `undefined` 而报错。修正方式是 `fn.call(user)`、`user.getName.bind(user)` 或包装函数。

### 3. var 和 let

```js
for (var i = 0; i < 3; i += 1) {
  setTimeout(() => console.log(i), 0);
}

for (let j = 0; j < 3; j += 1) {
  setTimeout(() => console.log(j), 0);
}
```

`var` 循环会输出三次 `3`；`let` 循环输出 `0 1 2`。`let` 每轮循环会创建新的块级绑定。

### 4. 原型属性

```js
function Person(name) {
  this.name = name;
}

Person.prototype.tags = [];

const a = new Person("A");
const b = new Person("B");

a.tags.push("admin");

console.log(b.tags);
```

输出 `['admin']`。`tags` 在原型上，是所有实例共享的同一个数组。引用类型实例属性应放到构造函数中初始化。

### 5. 数组排序

```js
console.log([10, 2, 1].sort());
console.log([10, 2, 1].sort((a, b) => a - b));
```

默认排序按字符串比较，结果是 `[1, 10, 2]`；传入数字比较函数后结果是 `[1, 2, 10]`。

### 6. parseInt

```js
console.log(parseInt("12px", 10));
console.log(Number("12px"));
```

`parseInt` 得到 `12`，`Number` 得到 `NaN`。前者是前缀宽松解析，后者要求整体可转换。

### 7. bind 和 new

```js
function User(name) {
  this.name = name;
}

const BoundUser = User.bind({ name: "outer" });
const user = new BoundUser("inner");

console.log(user.name);
```

输出 `'inner'`。绑定函数被 `new` 调用时，新实例的 `this` 优先级高于 `bind` 的 `thisArg`。

### 8. 对象去重

```js
const list = [{ id: 1 }, { id: 1 }];

console.log(new Set(list).size);
```

输出 `2`。对象按引用比较，两个字面量是不同对象。对象数组去重应按业务 key，例如 `id`。

## 复习路径

1. 先做输出题，定位执行顺序和作用域问题。
2. 再做手写题，检查能否把概念落到代码。
3. 最后回到对应专题文档补齐边界。

## 面试 / 自测

1. 能否不用背答案，逐步解释每道输出题？
2. 能否说出每道题对应的语言规则？
3. 能否给出工程中更推荐的写法？
4. 能否指出题目里的历史写法或不推荐写法？

## 相关文章

- [预编译原理](./precompile.md)
- [this](./this.md)
- [Event Loop](./event.loop.md)
- [数组方法](./array.md)
- [原型链](./prototype.md)

## 参考

- [MDN: JavaScript guide](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
- [MDN: Event loop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)

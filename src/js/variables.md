---
title: 变量与作用域
category: javascript
---

## 一句话结论

JavaScript 变量声明主要使用 `let` 和 `const`，旧代码中会看到 `var`。理解声明提升、暂时性死区、块级作用域、函数作用域和全局作用域，是读懂运行结果的基础。

## 为什么需要它

- 场景：循环绑定事件、模块顶层常量、闭包缓存状态、避免全局变量污染。
- 不处理会怎样：变量提前访问、循环值错乱、意外覆盖全局属性。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `var` | 函数作用域声明 | 会声明提升，可重复声明 |
| `let` | 块级作用域声明 | 有暂时性死区 |
| `const` | 块级常量绑定 | 绑定不可改，对象内容可变 |
| hoisting | 声明提升 | 初始化不一定提升 |
| scope | 标识符可访问范围 | 全局、函数、块级、模块 |

## 原理

代码执行前，引擎会先建立词法环境并登记声明。`var` 会被初始化为 `undefined`，所以声明前访问得到 `undefined`；`let` 和 `const` 在初始化前处于暂时性死区，访问会抛出 `ReferenceError`。

```js
console.log(a); // undefined
var a = 1;

console.log(b); // ReferenceError
let b = 2;
```

## 实现

### 循环中的块级作用域

```js
const handlers = [];

for (let i = 0; i < 3; i += 1) {
  handlers.push(() => i);
}

console.log(handlers[0]()); // 0
console.log(handlers[2]()); // 2
```

### `const` 约束的是绑定

```js
const user = { name: "Alice" };
user.name = "Bob";

// user = {}; // TypeError
```

## 边界与常见坑

- **`const` 不是深度不可变**：对象属性仍可修改。
- **`var` 没有块级作用域**：`if`、`for` 块不能隔离 `var`。
- **不要依赖声明提升写代码**：声明应放在使用前。
- **模块顶层变量不是全局属性**：ESM 顶层声明不会挂到 `window`。

## 工程取舍

- 适合：默认用 `const`，需要重新赋值时用 `let`。
- 谨慎：维护旧代码时理解 `var` 行为，不必机械重写全部变量。
- 不适合或应换方案：需要不可变数据结构时，使用冻结、复制或专门库，而不是只靠 `const`。

## 面试 / 自测

1. `var`、`let`、`const` 的作用域差异是什么？
2. 什么是暂时性死区？
3. `const obj = {}` 后为什么还能改 `obj.a`？

## 相关文章

- [预编译](./precompile.md)
- [函数基础](./functions.md)
- [this](./this.md)

## 参考

- [MDN: var](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/var)
- [MDN: let](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const)

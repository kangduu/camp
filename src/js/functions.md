---
title: 函数基础
category: javascript
---

## 一句话结论

函数是 JavaScript 的一等值，可以赋值、传参、返回和闭包捕获外层变量。函数声明、函数表达式、箭头函数、默认参数、剩余参数、`arguments` 和递归各有适用边界。

## 为什么需要它

- 场景：封装业务逻辑、事件回调、异步处理、高阶函数、柯里化、函数借用。
- 不处理会怎样：`this` 丢失、参数处理混乱、闭包误用导致内存和状态问题。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 函数声明 | `function fn() {}` | 会提升 |
| 函数表达式 | `const fn = function () {}` | 按变量规则初始化 |
| 箭头函数 | `const fn = () => {}` | 没有自己的 `this` 和 `arguments` |
| 默认参数 | 参数缺省值 | 只在参数是 `undefined` 时生效 |
| 剩余参数 | 收集剩余实参 | `...args` 是数组 |
| 闭包 | 函数保留词法环境 | 常用于缓存和封装 |

## 原理

函数调用会创建执行上下文，参数、局部变量和作用域链都在该上下文中工作。箭头函数不会创建自己的 `this`，它捕获外层词法作用域的 `this`。

## 实现

### 参数处理

```js
function createUser(name, role = "user", ...tags) {
  return {
    name,
    role,
    tags,
  };
}
```

### 闭包缓存

```js
function createCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}
```

### 递归

```js
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}
```

## 边界与常见坑

- **箭头函数不能作为构造函数**：不能配合 `new`。
- **`arguments` 不是数组**：新代码优先用剩余参数。
- **默认参数只处理 `undefined`**：传 `null` 不会触发默认值。
- **递归要有退出条件**：否则栈溢出。
- **闭包保留引用**：不再需要的数据要避免被长期引用。

## 工程取舍

- 适合：普通函数封装行为，箭头函数做短回调，高阶函数组合逻辑。
- 谨慎：对象方法不要盲目用箭头函数，可能失去预期 `this`。
- 不适合或应换方案：深递归在 JS 中可能栈溢出，可改迭代或显式栈。

## 面试 / 自测

1. 函数声明和函数表达式的提升行为有什么不同？
2. 箭头函数的 `this` 来自哪里？
3. 剩余参数和 `arguments` 有什么区别？

## 相关文章

- [this](./this.md)
- [高阶函数](./higher-order-function.md)
- [函数柯里化](./currying.md)
- [惰性函数](./lazy-function.md)

## 参考

- [MDN: Functions](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Functions)
- [MDN: Arrow function expressions](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

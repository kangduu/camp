---
title: 函数柯里化
category: javascript
---

## 一句话结论

柯里化是把接收多个参数的函数，转换成可以分多次接收参数的函数。它常用于参数复用、延迟执行、函数组合和生成更具体的业务函数。

## 为什么需要它

有些函数的部分参数在一组调用中是固定的，例如校验规则、请求基础路径、日志标签。把固定参数提前保存起来，可以减少重复传参，也能让函数表达更贴近业务语义。

- 场景：生成特定校验函数；预置请求配置；封装事件处理器；实现偏函数。
- 不处理会怎样：同样参数反复传递，调用处噪声变多，复用点不清晰。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 柯里化 | 多参数函数变成连续单参数函数 | `fn(a, b)` -> `fn(a)(b)` |
| 偏函数 | 预先固定一部分参数 | 不一定每次只接收一个参数 |
| 闭包 | 保存已经传入的参数 | 柯里化的基础 |
| `fn.length` | 函数声明的形参数量 | 可用于判断是否收集完参数 |

## 原理

柯里化依赖闭包保存已经收到的参数。当参数数量达到原函数需要的数量时，再一次性调用原函数。

```js
function add(a, b, c) {
  return a + b + c;
}

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }

    return function collect(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
```

## 实现

### 参数复用

```js
function createRegexTester(regexp) {
  return function test(text) {
    return regexp.test(text);
  };
}

const hasNumber = createRegexTester(/\d/);
const hasLowercase = createRegexTester(/[a-z]/);

console.log(hasNumber("abc")); // false
console.log(hasLowercase("abc")); // true
```

### 通用 curry

```js
function curry(fn, arity = fn.length) {
  function curried(...args) {
    if (args.length >= arity) {
      return fn.apply(this, args);
    }

    return function next(...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  }

  return curried;
}
```

这个实现保留了调用时的 `this`，支持一次传多个参数，但不支持占位符和无限参数。

### 无限参数求和

```js
function add(...args) {
  function collect(...nextArgs) {
    if (nextArgs.length === 0) {
      return args.reduce((sum, item) => sum + item, 0);
    }

    args.push(...nextArgs);
    return collect;
  }

  return collect;
}

console.log(add(1)(2)(3)()); // 6
console.log(add(1, 2)(3, 4)()); // 10
```

面试中也常见通过重写 `valueOf` / `toString` 实现隐式求值，但工程代码更建议显式调用结束函数，避免可读性问题。

## 边界与常见坑

- **柯里化不是性能优化工具**：它会创建额外闭包，过度使用会增加内存和调用成本。
- **`fn.length` 不包含剩余参数和默认参数之后的参数**：复杂函数不要完全依赖它。
- **参数顺序很重要**：适合把稳定参数放前面，变化参数放后面。
- **隐式求值不利于维护**：依赖 `toString` / `valueOf` 的写法更像面试技巧。
- **箭头函数没有自己的 `this`**：需要动态 `this` 时不要随意改成箭头函数。

## 工程取舍

- 适合：参数复用、函数工厂、声明式工具函数。
- 谨慎：业务流程复杂、团队不熟悉函数式写法、调试链路过长。
- 应换方案：简单预置参数可直接写包装函数；复杂依赖注入可用配置对象或类。

## 面试 / 自测

1. 柯里化和偏函数有什么区别？
2. 为什么柯里化需要闭包？
3. 如何实现 `sum(1)(2)(3)`？
4. `fn.length` 在什么情况下不可靠？
5. 柯里化有哪些工程上的成本？

## 相关文章

- [高阶函数](./higher-order-function.md)
- [call、apply 和 bind](./call.apply.bind.md)
- [惰性函数](./lazy-function.md)

## 参考

- [MDN: Closures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Closures)
- [MDN: Function.length](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/length)

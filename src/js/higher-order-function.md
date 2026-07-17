---
title: 高阶函数
category: javascript
---

## 一句话结论

高阶函数是接收函数作为参数，或者把函数作为返回值的函数。它是回调、柯里化、装饰器、函数组合、惰性函数等模式的基础。

## 为什么需要它

JavaScript 函数是一等公民，可以像普通值一样传递、保存和返回。高阶函数让我们把「可变的行为」抽成参数，把「固定的流程」留在函数内部。

- 场景：数组方法接收回调；请求完成后执行回调；封装类型判断函数；为旧函数增加日志、缓存、权限检查等能力。
- 不处理会怎样：大量重复流程代码散落在业务里，复用点只能靠复制粘贴，横切逻辑难以统一维护。

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 函数作为参数 | 调用方传入行为，函数内部决定何时调用 | `map(callback)`、事件监听 |
| 函数作为返回值 | 外层函数预处理参数或状态，返回新函数 | 柯里化、惰性函数 |
| 闭包 | 返回的函数继续访问外层变量 | 保存预设参数、私有状态 |
| 装饰 | 在不改原函数主体的前提下增强行为 | 日志、埋点、权限检查 |

## 原理

高阶函数成立的基础是函数值和闭包。函数可以作为参数传入另一个函数，也可以作为返回值返回；返回的内部函数可以继续访问外层函数作用域里的变量。

```js
function createMultiplier(factor) {
  return function multiply(value) {
    return value * factor;
  };
}

const double = createMultiplier(2);

console.log(double(5)); // 10
```

`factor` 在 `createMultiplier` 执行结束后仍然被 `multiply` 引用，这就是闭包带来的状态保存能力。

## 实现

### 最小可用版：函数作为参数

```js
function each(items, callback) {
  for (let index = 0; index < items.length; index += 1) {
    callback(items[index], index, items);
  }
}

each(["a", "b"], (item, index) => {
  console.log(index, item);
});
```

数组的 `map()`、`filter()`、`some()`、`every()` 本质上都属于这种思路：遍历流程固定，具体判断或转换逻辑由回调决定。

### 完整版：类型判断工厂

原笔记中用 `Object.prototype.toString.call()` 做类型判断，这适合展示「函数作为返回值」。

```js
function createTypeChecker(type) {
  return function isType(value) {
    return Object.prototype.toString.call(value) === `[object ${type}]`;
  };
}

const isString = createTypeChecker("String");
const isDate = createTypeChecker("Date");
const isArray = createTypeChecker("Array");

console.log(isString("hello")); // true
console.log(isDate(new Date())); // true
console.log(isArray([])); // true
```

如果只判断数组，工程代码优先使用 `Array.isArray()`；如果需要统一判断多种内置对象，类型判断工厂更容易复用。

### 预置函数

```js
function preset(count, callback) {
  return function run() {
    if (count <= 0) {
      return callback();
    }

    count -= 1;
    return count;
  };
}

const runAfterTwoCalls = preset(2, () => "doing");

console.log(runAfterTwoCalls()); // 1
console.log(runAfterTwoCalls()); // 0
console.log(runAfterTwoCalls()); // 'doing'
```

预置函数通过闭包保存 `count`，让返回函数带着状态运行。

### 装饰函数

```js
function withLog(fn, label = fn.name || "anonymous") {
  return function wrapped(...args) {
    console.log(`${label} start`);

    try {
      return fn.apply(this, args);
    } finally {
      console.log(`${label} end`);
    }
  };
}

function sum(a, b) {
  return a + b;
}

const loggedSum = withLog(sum);

console.log(loggedSum(1, 2)); // 3
```

装饰函数应保留原函数的 `this`、参数和返回值，否则很容易改变调用方预期。

### 单例式私有状态

原笔记中的「单列模式」更准确地说是通过闭包保存私有变量。下面写法只暴露读取函数，不暴露内部对象。

```js
const getConfig = (function createConfigReader() {
  const config = {
    MAX_NUM: 1000,
    MIN_NUM: 1,
    COUNT: 10000,
  };

  return function getConfig(key) {
    return config[key];
  };
})();

console.log(getConfig("MAX_NUM")); // 1000
```

## 边界与常见坑

- **回调会改变执行时机**：异步回调不在当前调用栈立刻执行，返回值不能直接当同步结果使用。
- **装饰函数要保留 `this` 和返回值**：用 `fn.apply(this, args)` 比直接 `fn(...args)` 更稳妥。
- **闭包可能持有过多数据**：返回函数长期存在时，外层变量也会继续被引用。
- **不要把所有逻辑都抽成高阶函数**：过度嵌套会降低可读性，尤其是业务条件很多时。
- **`Object.prototype.toString.call()` 不是万能深类型系统**：它适合识别内置类型，不负责校验对象结构。

## 工程取舍

- 适合：公共流程固定、局部行为可变、需要复用横切逻辑的场景。
- 谨慎：团队对函数式抽象不熟、链路过深、调试成本明显高于收益的场景。
- 应换方案：复杂状态流程可以用状态机或类封装；跨模块能力增强可以用中间件、插件或框架生命周期。

## 面试 / 自测

1. 什么是高阶函数？请分别举出「函数作为参数」和「函数作为返回值」的例子。
2. `map()` 为什么可以看作高阶函数？
3. 类型判断工厂为什么需要闭包？
4. 装饰函数为什么要保留 `this`、参数和返回值？
5. 高阶函数和柯里化是什么关系？

## 相关文章

- [函数柯里化](./currying.md)
- [惰性函数](./lazy-function.md)
- [节流和防抖](./debounce.throttle.md)
- [数组方法](./array.md)

## 参考

- [MDN: Functions](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)
- [MDN: Closures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Closures)
- [MDN: Function.prototype.apply](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

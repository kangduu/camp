---
title: 表达式、运算符与控制流
category: javascript
---

## 一句话结论

表达式负责产生值，语句负责控制执行流程。掌握运算符优先级、短路求值、条件分支、循环、`break` / `continue` 和异常流程，才能稳定读写业务代码。

## 为什么需要它

- 场景：条件渲染、数据过滤、循环遍历、错误兜底、默认值处理。
- 不处理会怎样：逻辑分支误判、循环提前退出失败、`||` 错误覆盖合法空值。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 表达式 | 产生值的代码 | `a + b`、`foo()` |
| 语句 | 执行动作或控制流程 | `if`、`for`、`try` |
| 短路求值 | 左侧可决定结果时不执行右侧 | `&&`、`||`、`??` |
| 循环 | 重复执行代码 | `for`、`while`、`for...of` |
| 异常 | 非正常流程 | `throw`、`try/catch/finally` |

## 原理

`||` 按 truthy/falsy 判断，`??` 只在左侧是 `null` 或 `undefined` 时使用右侧。处理默认值时，`??` 通常比 `||` 更准确。

```js
const count = 0;

console.log(count || 10); // 10
console.log(count ?? 10); // 0
```

## 实现

### 遍历选择

```js
const list = ["a", "b", "c"];

for (const item of list) {
  if (item === "b") continue;
  console.log(item);
}
```

### 异常处理

```js
function parseConfig(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error("Invalid config JSON", { cause: error });
  }
}
```

## 边界与常见坑

- **`for...in` 遍历 key，不适合遍历数组值**：数组值遍历用 `for...of`。
- **`switch` 默认会穿透**：需要 `break` 或显式注释说明。
- **`finally` 中 return 会覆盖 try/catch 返回值**。
- **`||` 会把 `0`、空字符串、`false` 当作缺省值**。

## 工程取舍

- 适合：业务分支用清晰 `if`，数组值遍历用 `for...of` 或数组方法。
- 谨慎：复杂嵌套条件应拆函数或提前返回。
- 不适合或应换方案：异常不应用于普通业务分支控制。

## 面试 / 自测

1. `for...in` 和 `for...of` 的区别是什么？
2. `||` 和 `??` 处理默认值有什么区别？
3. `finally` 中 return 有什么风险？

## 相关文章

- [数组方法](./array.md)
- [异步编程](./async.md)
- [相等比较](./equality.md)

## 参考

- [MDN: Expressions and operators](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Expressions_and_operators)
- [MDN: Loops and iteration](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Loops_and_iteration)
- [MDN: Control flow and error handling](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

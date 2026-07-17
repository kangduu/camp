---
title: 严格模式
category: javascript
---

## 一句话结论

严格模式通过 `"use strict"` 或 ES Module 自动启用，让 JavaScript 在更严格的规则下执行，提前暴露隐式全局变量、错误赋值和不安全语法。

## 为什么需要它

- 场景：维护旧脚本、排查隐式全局、理解模块和函数中 `this` 的差异。
- 不处理会怎样：非严格模式下的静默失败和隐式行为会隐藏真实 bug。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `"use strict"` | 严格模式指令 | 可用于脚本或函数顶部 |
| 隐式全局 | 未声明变量被写入全局对象 | 严格模式会报错 |
| 静默失败 | 非严格模式下部分错误不抛出 | 严格模式会抛异常 |
| 模块默认严格 | ESM 自动使用严格模式 | 不必额外声明 |

## 原理

严格模式改变了一些历史兼容行为：未声明变量赋值会抛错，函数普通调用中的 `this` 不再自动指向全局对象，重复参数名等不安全写法会被禁止。

```js
"use strict";

function fn() {
  console.log(this);
}

fn(); // undefined
```

## 实现

### 脚本级严格模式

```js
"use strict";

message = "hello"; // ReferenceError
```

### 函数级严格模式

```js
function legacySafe() {
  "use strict";
  return this;
}
```

## 边界与常见坑

- **ES Module 自动严格**：模块里不需要再写 `"use strict"`。
- **严格模式不等于类型检查**：它不检查变量类型是否正确。
- **拼接脚本要谨慎**：指令必须在脚本或函数开头才生效。
- **旧代码启用严格模式可能暴露大量历史问题**。

## 工程取舍

- 适合：新代码、模块代码、需要减少历史隐式行为的脚本。
- 谨慎：一次性给大型旧文件加严格模式，可能触发很多兼容问题。
- 不适合或应换方案：需要静态类型约束时，使用 TypeScript 或 lint 规则。

## 面试 / 自测

1. 严格模式下普通函数调用的 `this` 是什么？
2. ESM 是否默认严格模式？
3. 严格模式能否替代 TypeScript？

## 相关文章

- [this](./this.md)
- [模块](./module.md)
- [变量与作用域](./variables.md)

## 参考

- [MDN: Strict mode](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Strict_mode)

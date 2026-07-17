---
title: JavaScript 模块
category: javascript
---

## 一句话结论

模块化是把代码按职责拆分成独立文件，并通过显式的导入导出管理依赖。浏览器和现代构建工具优先使用 ES Module，Node.js 历史上常见 CommonJS，两者在加载时机、导出语义和运行环境上不同。

## 为什么需要它

没有模块化时，脚本之间只能共享全局变量，依赖关系靠加载顺序维护，项目一大就容易命名冲突和初始化顺序错误。

- 场景：拆分工具函数、组件、业务模块；复用公共逻辑；控制副作用初始化。
- 不处理会怎样：全局污染、循环依赖难排查、文件顺序变成隐式约束。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| ESM | ECMAScript 标准模块系统 | `import` / `export` |
| CommonJS | Node.js 传统模块系统 | `require` / `module.exports` |
| 默认导出 | 一个模块的主输出 | `export default` |
| 命名导出 | 多个具名输出 | `export const name = ...` |
| 副作用模块 | 导入后只执行模块代码 | `import "./setup.js"` |
| 循环依赖 | 两个模块互相引用 | 需要谨慎设计边界 |

## 原理

ES Module 是静态结构，导入导出关系在代码执行前就能被分析，因此构建工具可以做 tree shaking。

```js
// math.js
export function add(a, b) {
  return a + b;
}

export const PI = 3.14159;
```

```js
// app.js
import { add, PI } from "./math.js";

console.log(add(1, 2), PI);
```

CommonJS 是运行时加载，`require()` 可以写在条件语句中，导出的是 `module.exports` 当前结果。

```js
// math.cjs
function add(a, b) {
  return a + b;
}

module.exports = { add };
```

```js
// app.cjs
const { add } = require("./math.cjs");

console.log(add(1, 2));
```

## 实现

### 推荐写法：命名导出

```js
// user-service.js
export function normalizeUser(rawUser) {
  return {
    id: String(rawUser.id),
    name: rawUser.name.trim(),
  };
}

export function isAdmin(user) {
  return user.role === "admin";
}
```

```js
import { isAdmin, normalizeUser } from "./user-service.js";

const user = normalizeUser({ id: 1, name: " Alice ", role: "admin" });

console.log(isAdmin(user));
```

命名导出适合工具函数和多个稳定能力，重构时 IDE 也更容易追踪。

### 默认导出

```js
// logger.js
export default function log(message) {
  console.log(`[app] ${message}`);
}
```

```js
import log from "./logger.js";

log("ready");
```

默认导出适合一个模块只有一个主能力的场景，例如组件、类或单一工厂函数。

## 边界与常见坑

- **ESM 导入必须在顶层静态声明**：动态加载用 `import()`。
- **命名导入必须匹配导出名**：默认导入可以由调用方命名。
- **不要滥用副作用模块**：副作用隐藏依赖关系，测试和调试成本更高。
- **循环依赖会暴露半初始化状态**：拆出公共模块或倒置依赖能降低风险。
- **Node.js 中 ESM 与 CommonJS 互操作有规则差异**：看项目的 `type`、文件扩展名和构建配置。

## 工程取舍

- 适合：所有中大型项目、组件库、工具库、需要构建优化的前端应用。
- 谨慎：一个模块职责过多、导出过多，会退化成杂物间。
- 应换方案：运行时插件发现、按需加载大模块时使用动态 `import()`；共享配置可用 JSON 或显式配置对象。

## 面试 / 自测

1. ES Module 和 CommonJS 的核心区别是什么？
2. 为什么 ESM 更适合 tree shaking？
3. 默认导出和命名导出分别适合什么场景？
4. 什么是模块副作用？
5. 循环依赖为什么容易出问题？

## 相关文章

- [异步编程](./async.md)
- [执行机制](./running.md)

## 参考

- [MDN: export](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)
- [MDN: import](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)
- [Node.js: Modules](https://nodejs.org/api/modules.html)

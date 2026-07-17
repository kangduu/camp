---
title: JavaScript 入门
category: javascript
---

## 一句话结论

JavaScript 是浏览器原生支持的脚本语言，也能运行在 Node.js、Bun、Deno 等运行时中。学习 JavaScript 时要区分语言本身、浏览器 API、Node.js API 和框架能力。

## 为什么需要它

- 场景：编写交互页面、调用接口、处理数据、实现前端工程脚本、理解框架底层行为。
- 不处理会怎样：容易把 DOM、Fetch、模块、Node.js 标准库和 ECMAScript 语法混为一谈。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| ECMAScript | JavaScript 语言标准 | 定义语法、类型、对象模型 |
| JavaScript Runtime | 执行 JS 的环境 | 浏览器、Node.js、Bun、Deno |
| Web API | 浏览器提供的能力 | DOM、Fetch、Timer、Storage |
| Engine | 执行 JS 的引擎 | V8、SpiderMonkey、JavaScriptCore |

## 原理

JavaScript 语言本身只定义变量、类型、对象、函数、模块、Promise 等能力。浏览器提供 DOM、事件、网络请求、渲染等 Web API；Node.js 提供文件系统、进程、网络服务等服务端 API。相同的语言语法在不同运行时里可用 API 不同。

## 实现

### 在浏览器中运行

```html
<button id="btn">Click</button>
<script>
  document.querySelector("#btn").addEventListener("click", () => {
    console.log("clicked");
  });
</script>
```

### 在 Node.js 中运行

```js
console.log("Hello JavaScript");
console.log(process.version);
```

```bash
node index.js
```

## 边界与常见坑

- **JavaScript 不等于 Java**：两者语法和运行模型完全不同。
- **浏览器 API 不是语言标准**：`document`、`window` 不属于 ECMAScript。
- **Node.js 没有 DOM**：服务端脚本不能直接使用页面 API。
- **版本要看运行环境**：新语法是否可用取决于浏览器或运行时版本。

## 工程取舍

- 适合：Web 交互、前端应用、脚本自动化、服务端 API、全栈开发。
- 谨慎：CPU 密集、强类型约束、大规模长期维护项目通常需要 TypeScript、WebAssembly 或后端语言配合。
- 不适合或应换方案：浏览器底层图形、音视频、密码学等场景优先使用成熟 API 或专用库。

## 面试 / 自测

1. JavaScript 语言标准和浏览器 API 有什么区别？
2. 为什么 `document` 在 Node.js 中不可用？
3. ECMAScript 版本和浏览器兼容性是什么关系？

## 相关文章

- [执行机制](./running.md)
- [模块](./module.md)
- [DOM API](./dom-api.md)

## 参考

- [MDN: JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [roadmap.sh JavaScript Roadmap](https://roadmap.sh/javascript/)

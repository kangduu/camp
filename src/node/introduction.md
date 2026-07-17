---
title: Node.js 入门
category: nodejs
---

## 一句话结论

Node.js 是运行在浏览器外的 JavaScript 运行时，适合编写服务端应用、命令行工具、构建脚本和网络程序。

## 为什么需要它

- 场景：用 JavaScript 写 HTTP 服务、CLI、文件处理脚本、前端工程化工具。
- 不处理会怎样：容易把浏览器 API、Node.js API 和 JavaScript 语言本身混为一谈。

## 运行时边界

| 环境 | 能力 | 备注 |
| ---- | ---- | ---- |
| Browser | DOM、BOM、Web API | 面向页面和用户交互 |
| Node.js | 文件、进程、网络、模块、流 | 面向服务端和系统脚本 |
| JavaScript | 语言语法和内置对象 | 两个运行时都使用 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| V8 | JavaScript 引擎 | 负责执行 JS |
| libuv | 跨平台异步 I/O 库 | 支撑事件循环和线程池 |
| 标准库 | Node 内置模块 | 如 `fs`、`path`、`http` |
| npm | 包管理生态 | 安装第三方包 |

## 原理

Node.js 把 V8、libuv 和一组 C/C++ 绑定封装成可执行程序。JavaScript 负责业务逻辑；文件、网络、定时器等异步操作交给 Node.js 和操作系统处理，完成后再通过事件循环调度回调或 Promise。

## 实现

### Hello Node.js

```js
console.log("Hello Node.js");
console.log(process.version);
console.log(process.cwd());
```

```bash
node hello.js
```

### 最小 HTTP 服务

```js
import http from "node:http";

http
  .createServer((req, res) => {
    res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
    res.end(`Hello ${req.url}`);
  })
  .listen(3000);
```

## 边界与常见坑

- **Node.js 没有 DOM**：`document`、`window` 不是 Node.js 标准 API。
- **单线程不等于不能并发**：I/O 并发依赖事件循环和操作系统。
- **适合 I/O 密集，不天然适合 CPU 密集**：CPU 计算会阻塞主线程。
- **版本差异会影响 API**：新 API 要注明 Node 版本要求。

## 工程取舍

- 适合：API 服务、BFF、CLI、构建工具、实时通信、自动化脚本。
- 谨慎：CPU 密集计算、强隔离多租户任务、超低延迟任务。
- 不适合或应换方案：大量科学计算可考虑原生扩展、Worker Threads 或其他语言。

## 面试 / 自测

1. Node.js 和浏览器 JavaScript 的主要差异是什么？
2. V8 和 libuv 分别负责什么？
3. 为什么 CPU 密集任务会影响 Node 服务响应？

## 相关文章

- [Node.js 文件执行](./execute.md)
- [异步编程](./async-programming.md)
- [模块系统](./modules.md)

## 参考

- [Node.js Docs](https://nodejs.org/api/)
- [Node.js: About](https://nodejs.org/en/about)
- [roadmap.sh Node.js Roadmap](https://roadmap.sh/nodejs/)

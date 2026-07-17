---
title: 异步编程
category: nodejs
---

## 一句话结论

Node.js 的并发能力主要来自事件循环、非阻塞 I/O、Promise、async/await 和 EventEmitter。理解异步调度顺序比背 API 更重要。

## 为什么需要它

- 场景：处理 HTTP 请求、读写文件、访问数据库、定时任务、事件订阅。
- 不处理会怎样：阻塞事件循环、错误丢失、回调顺序误判、资源无法释放。

## 运行时边界

| 能力 | 属于谁 | 备注 |
| ---- | ---- | ---- |
| Promise / async | JavaScript | 语言层能力 |
| Event Loop | Node.js / libuv | 调度异步回调 |
| EventEmitter | Node.js 标准库 | 事件发布订阅 |
| Timers | Node.js API | `setTimeout`、`setImmediate` |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| callback | 完成后调用函数 | 传统 Node 风格 |
| Promise | 异步结果容器 | 可链式处理 |
| async/await | Promise 语法糖 | 不会让 I/O 变同步 |
| `process.nextTick` | 当前阶段后立即执行 | 过度使用会饿死 I/O |
| EventEmitter | 事件机制 | `'error'` 要处理 |

## 实现

### Promise 化 I/O

```js
import { readFile } from "node:fs/promises";

export async function readJson(file) {
  const text = await readFile(file, "utf8");
  return JSON.parse(text);
}
```

### EventEmitter

```js
import { EventEmitter } from "node:events";

const bus = new EventEmitter();

bus.on("done", (value) => {
  console.log(value);
});

bus.on("error", (error) => {
  console.error(error);
});

bus.emit("done", "ok");
```

## 边界与常见坑

- **`await` 不会创建新线程**：CPU 密集循环仍会阻塞。
- **忘记处理 `'error'` 事件可能导致进程崩溃**。
- **不要混用 callback 和 Promise 错误通道**。
- **`setTimeout(fn, 0)` 不保证马上执行**。
- **`process.nextTick` 优先级高，滥用会影响 I/O 回调。**

## 工程取舍

- 适合：I/O 密集服务、网络请求、数据库访问、文件处理。
- 谨慎：长链异步要保证错误路径和取消策略。
- 不适合或应换方案：CPU 密集任务使用 Worker Threads 或子进程。

## 面试 / 自测

1. async/await 和 Promise 的关系是什么？
2. EventEmitter 的 `'error'` 事件为什么特殊？
3. `setImmediate`、`setTimeout`、`process.nextTick` 有什么差异？

## 相关文章

- [错误处理](./error-handling.md)
- [流](./streams.md)
- [线程与进程](./threads-processes.md)

## 参考

- [Node.js Docs: Events](https://nodejs.org/api/events.html)
- [Node.js Docs: Timers](https://nodejs.org/api/timers.html)
- [Node.js Docs: Event Loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

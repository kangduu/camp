---
title: Web Worker
category: javascript
---

## 一句话结论

Web Worker 允许浏览器在主线程之外运行 JavaScript，适合处理耗时计算、数据解析和不需要操作 DOM 的后台任务。它不能直接访问 DOM，只能通过消息和主线程通信。

## 为什么需要它

浏览器主线程负责执行 JavaScript、处理用户输入和渲染页面。CPU 密集型任务如果放在主线程，会阻塞交互和渲染。

- 场景：大数据计算、图片/文本处理、复杂排序、加密压缩、离线任务。
- 不处理会怎样：页面卡顿、滚动掉帧、按钮点击无响应。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| Dedicated Worker | 专用 Worker，只被创建它的脚本使用 | 最常见 |
| Shared Worker | 可被多个浏览上下文共享 | 支持情况和使用复杂度更高 |
| Service Worker | 位于网络代理层的 Worker | 常用于缓存、离线和 PWA |
| `postMessage` | 线程间发送消息 | 数据会被结构化克隆 |
| Transferable | 可转移所有权的数据 | 如 `ArrayBuffer`，避免复制成本 |

## 原理

Worker 运行在独立线程中，有自己的全局上下文。主线程和 Worker 之间通过消息队列通信，数据使用结构化克隆算法复制；对于 `ArrayBuffer` 等可转移对象，可以转移所有权来避免大对象复制。

Worker 不能直接操作 DOM，也不能访问主线程的局部变量。它可以使用部分 Web API，例如 `fetch`、`setTimeout`、`WebSocket` 等。

## 实现

### 主线程

```js
const worker = new Worker(new URL("./sum.worker.js", import.meta.url), {
  type: "module",
});

worker.postMessage({ type: "sum", payload: [1, 2, 3, 4] });

worker.onmessage = (event) => {
  console.log(event.data); // { type: 'sum:done', payload: 10 }
};

worker.onerror = (event) => {
  console.error(event.message);
};

// 不再需要时释放线程资源
worker.terminate();
```

### Worker 脚本

```js
self.onmessage = (event) => {
  const { type, payload } = event.data;

  if (type === "sum") {
    const result = payload.reduce((total, item) => total + item, 0);
    self.postMessage({ type: "sum:done", payload: result });
  }
};
```

构建工具对 Worker 路径的处理不同。Vite/Webpack 中常见写法是 `new URL("./worker.js", import.meta.url)`；原生浏览器也可以直接传脚本 URL。

## 边界与常见坑

- **Worker 不能操作 DOM**：DOM 更新必须回到主线程执行。
- **通信有成本**：小任务放进 Worker 可能得不偿失，大对象要考虑 Transferable。
- **路径受构建工具影响**：相对路径在开发、构建和部署后可能不同。
- **需要主动终止**：长期不用的 Worker 应调用 `terminate()`。
- **错误要单独监听**：Worker 内部异常不会像普通同步代码一样直接抛到主线程调用栈。

## 工程取舍

- 适合：CPU 密集型、可拆分、输入输出明确、不依赖 DOM 的任务。
- 谨慎：任务很小、频繁通信、需要共享大量可变状态。
- 应换方案：只是不想阻塞单帧渲染时可用 [分时函数](./time.chunk.md)；网络缓存和离线能力用 Service Worker；简单异步 I/O 用 Promise 即可。

## 面试 / 自测

1. Web Worker 能解决什么问题？
2. Worker 为什么不能直接操作 DOM？
3. `postMessage` 传递数据是共享还是复制？
4. Transferable 适合什么场景？
5. 分时函数和 Web Worker 如何选择？

## 相关文章

- [分时函数](./time.chunk.md)
- [Event Loop](./event.loop.md)
- [异步编程](./async.md)

## 参考

- [MDN: Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
- [MDN: Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Worker)
- [MDN: Structured clone algorithm](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)

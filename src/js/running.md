---
title: 执行机制
category: javascript
---

## 一句话结论

JavaScript 执行机制可以从执行上下文、调用栈、作用域链、任务队列和宿主 API 几个层面理解。同步代码先进调用栈，异步回调由宿主环境调度，满足条件后进入队列等待执行。

## 为什么需要它

很多问题看似是「异步顺序」，本质上是调用栈、作用域、定时器和任务队列共同作用。

- 场景：分析输出题；理解 `setTimeout` 延迟；排查页面卡顿；解释 `this` 丢失。
- 不处理会怎样：把定时器当成精准计时器，把 Promise 当成多线程，错误判断代码执行顺序。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 执行上下文 | 代码执行所需的环境 | 全局、函数、模块 |
| 调用栈 | 记录函数调用关系 | 后进先出 |
| 同步任务 | 立即进入调用栈执行 | 普通语句、函数调用 |
| 异步任务 | 交给宿主环境处理后再回调 | 定时器、事件、网络 |
| 任务队列 | 回调等待进入调用栈的队列 | 事件循环读取 |
| 宿主环境 | 浏览器或 Node.js 提供的能力 | 定时器、DOM、I/O |

## 原理

```js
setTimeout(() => {
  console.log("timer");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("sync");

// sync
// promise
// timer
```

主线程先执行同步代码，Promise 后续进入微任务队列，定时器回调进入任务队列。当前同步代码结束后，微任务先于定时器执行。

## 实现

### setTimeout 不是精准延迟

```js
setTimeout(() => {
  console.log("timer");
}, 2000);

function sleep(ms) {
  const start = Date.now();

  while (Date.now() - start < ms) {
    // busy loop
  }
}

sleep(5000);
```

定时器到点后，回调也必须等待调用栈清空。上例中回调不会在 2 秒时真正执行，而要等 `sleep` 结束。

### 方法作为回调时的 this

```js
"use strict";

const obj = {
  x: 2,
  print() {
    console.log(this.x);
  },
};

setTimeout(obj.print, 0); // TypeError 或 undefined，取决于运行环境包装
setTimeout(() => obj.print(), 0); // 2
setTimeout(obj.print.bind(obj), 0); // 2
```

定时器只保存回调函数，不会保存原来的 `obj.print()` 调用关系。

### setInterval 和递归 setTimeout

```js
function poll() {
  setTimeout(async () => {
    await fetch("/api/status");
    poll();
  }, 2000);
}

poll();
```

`setInterval` 按固定间隔调度，任务耗时过长时可能堆积。递归 `setTimeout` 可以在本次任务结束后再安排下一次，更适合轮询。

## 边界与常见坑

- **同步长任务会阻塞所有后续回调**：包括定时器、事件和渲染。
- **定时器延迟是最早可执行时间，不是保证执行时间**。
- **`setInterval` 不关心上一次是否执行完**：耗时任务建议递归 `setTimeout`。
- **字符串形式定时器类似 `eval`**：不要使用 `setTimeout("code", 1000)`。
- **浏览器和 Node.js 定时器返回值不同**：浏览器返回数字 ID，Node.js 返回对象。

## 工程取舍

- 适合：理解 JS 单线程调度、分析输出题、选择合适的异步控制方式。
- 谨慎：把定时器当精准时钟或把异步当并行计算。
- 应换方案：动画用 `requestAnimationFrame`；长任务用 [分时函数](./time.chunk.md)；CPU 密集计算用 [Web Worker](./web-worker.md)。

## 面试 / 自测

1. 调用栈为空后，事件循环会先处理什么？
2. `setTimeout(fn, 0)` 为什么仍然要等待？
3. `setInterval` 做轮询有什么风险？
4. 方法传给定时器后为什么可能丢失 `this`？
5. 宿主环境在异步任务中扮演什么角色？

## 相关文章

- [Event Loop](./event.loop.md)
- [异步编程](./async.md)
- [this](./this.md)

## 参考

- [MDN: JavaScript execution model](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)
- [MDN: setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)
- [MDN: setInterval](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval)

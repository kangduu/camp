---
title: Event Loop
category: javascript
---

## 一句话结论

Event Loop 是 JavaScript 协调同步代码、异步回调、微任务、宏任务和渲染的调度机制。判断输出顺序时，先执行当前同步代码，再清空微任务队列，然后进入下一轮任务。

## 为什么需要它

JavaScript 主线程一次只能执行一段代码，但浏览器又要处理定时器、网络、用户事件和渲染。事件循环让这些任务按规则排队执行。

- 场景：分析 Promise 和 setTimeout 输出顺序；理解页面卡顿；安排渲染后的任务。
- 不处理会怎样：误判异步执行顺序，错误使用定时器或 Promise，甚至制造微任务死循环。

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 调用栈 | 当前正在执行的同步代码 | 函数调用栈 |
| 任务 | 一次事件循环取出的宏任务 | script、setTimeout、用户事件 |
| 微任务 | 当前任务结束后立即清空的队列 | Promise.then、queueMicrotask |
| 渲染机会 | 浏览器在合适时机更新页面 | 通常发生在任务之间 |
| 阻塞 | 长同步任务占用主线程 | 死循环、大计算 |

## 原理

浏览器环境中，一轮典型事件循环可以简化为：

1. 执行一个任务中的同步代码。
2. 清空微任务队列。
3. 浏览器按需执行渲染。
4. 取下一个任务继续。

```js
console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("script end");

// script start
// script end
// promise
// setTimeout
```

`Promise.then` 是微任务，`setTimeout` 回调是任务。当前 script 任务结束后，微任务会先执行。

## 实现

### async/await 输出题

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}

async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(() => {
  console.log("setTimeout");
}, 0);

async1();

Promise.resolve().then(() => {
  console.log("promise");
});

console.log("script end");
```

输出顺序：

```text
script start
async1 start
async2
script end
async1 end
promise
setTimeout
```

`await async2()` 之前同步执行，`await` 后面的代码会作为微任务继续执行。

### 微任务饥饿

```js
function loop() {
  queueMicrotask(loop);
}

// loop(); // 不要在业务中这样写
```

如果微任务不断追加新的微任务，浏览器可能长时间没有机会进入下一轮任务和渲染。

## 边界与常见坑

- **微任务不是越多越好**：微任务会在渲染前清空，过多会阻塞渲染。
- **`setTimeout(fn, 0)` 不是立刻执行**：它要等当前任务和微任务完成后，进入后续任务。
- **Node.js 事件循环和浏览器不同**：`process.nextTick`、I/O 阶段等是 Node 特有规则。
- **长同步任务会阻塞所有异步回调**：定时器到点也只能等待调用栈清空。
- **`requestAnimationFrame` 和渲染相关**：适合在下一帧更新动画，不等同于普通定时器。

## 工程取舍

- 适合：分析执行顺序、调度 UI 更新、拆分任务。
- 谨慎：用微任务做大量递归调度，容易阻塞渲染。
- 应换方案：长任务拆分用 [分时函数](./time.chunk.md)；CPU 密集计算用 [Web Worker](./web-worker.md)；动画用 `requestAnimationFrame`。

## 面试 / 自测

1. 宏任务和微任务的执行顺序是什么？
2. `await` 后面的代码什么时候执行？
3. 为什么 `setTimeout(fn, 0)` 不是立即执行？
4. 微任务过多会造成什么问题？
5. 浏览器和 Node.js 的事件循环是否完全一致？

## 相关文章

- [执行机制](./running.md)
- [异步编程](./async.md)
- [分时函数](./time.chunk.md)

## 参考

- [MDN: Event loop](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Event_loop)
- [MDN: queueMicrotask](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/queueMicrotask)
- [MDN: requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

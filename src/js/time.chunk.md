---
title: 分时函数
category: javascript
---

## 一句话结论

分时函数是把一批耗时任务拆成多段执行的调度方式，让主线程在每段任务之间有机会处理渲染和用户交互。它适合处理大量 DOM 插入、长列表批处理、低优先级数据加工等不要求一次同步完成的任务。

## 为什么需要它

JavaScript 在浏览器主线程中执行时，会和渲染、事件响应共享同一条线程。一次性执行大量同步任务，会阻塞页面更新，用户看到的就是卡顿、点击无响应，甚至页面假死。

- 场景：一次插入几千个节点；批量处理接口返回的大列表；把大量数据转换成视图模型。
- 不处理会怎样：单次任务占用主线程太久，浏览器无法及时渲染和响应输入。

分时函数和防抖、节流都属于任务控制：防抖把多次触发收敛为最后一次，节流限制固定时间内的执行频率，分时函数则把一批任务拆成多次执行。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 任务队列 | 待处理的数据或工作单元 | 通常用数组保存 |
| 分片大小 | 每一轮最多处理多少个任务 | 越大吞吐越高，越小越不阻塞 |
| 调度间隔 | 两轮任务之间等待多久 | 可用 `setTimeout` 或 `requestIdleCallback` |
| 取消 | 停止后续任务调度 | 防止组件卸载后继续执行 |
| 主线程让步 | 每轮处理后把执行权交还给浏览器 | 分时函数的核心价值 |

## 原理

分时函数的关键不是让总任务变少，而是把长任务拆成多个短任务。每轮只处理一小批数据，处理完后通过定时器、空闲回调或下一帧调度下一轮。

浏览器只有在 JavaScript 调用栈清空后，才有机会处理渲染、输入和其他任务。因此分时函数要避免在一个循环里把所有任务做完。

```js
function appendAllAtOnce(items, container) {
  items.forEach((item) => {
    const div = document.createElement("div");
    div.textContent = item;
    container.appendChild(div);
  });
}
```

上面的写法在数据量很大时会连续占用主线程。分时处理后，单轮工作量变小，页面更容易保持可响应。

## 实现

### 最小可用版

```js
function timeChunk(dataArray, handler, count = 1, interval = 16) {
  let timer = null;

  function runChunk() {
    const size = Math.min(count, dataArray.length);

    for (let i = 0; i < size; i += 1) {
      const item = dataArray.shift();
      handler(item);
    }

    if (dataArray.length === 0) {
      clearInterval(timer);
      timer = null;
    }
  }

  return function start() {
    if (timer) return;
    timer = setInterval(runChunk, interval);
  };
}
```

这个版本保留了原笔记的核心思路：用数组表示任务队列，每轮取出一部分执行。它的限制是只能启动，不能取消；并且会直接修改传入的 `dataArray`。

### 完整版

```js
function createTimeChunk(tasks, handler, options = {}) {
  const {
    chunkSize = 10,
    interval = 16,
    copyTasks = true,
  } = options;

  if (!Array.isArray(tasks)) {
    throw new TypeError("tasks must be an array");
  }

  if (typeof handler !== "function") {
    throw new TypeError("handler must be a function");
  }

  const queue = copyTasks ? [...tasks] : tasks;
  let timer = null;
  let running = false;

  function runChunk() {
    const size = Math.min(chunkSize, queue.length);

    for (let i = 0; i < size; i += 1) {
      handler(queue.shift());
    }

    if (queue.length === 0) {
      stop();
    }
  }

  function start() {
    if (running) return;

    running = true;
    timer = setInterval(runChunk, interval);
  }

  function stop() {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }

    running = false;
  }

  return {
    start,
    stop,
    getRemainingCount: () => queue.length,
  };
}
```

使用时可以在组件卸载、页面切换或用户取消任务时调用 `stop()`，避免后续任务继续访问已经不存在的 DOM 或状态。

```js
const container = document.getElementById("time-chunk");
const scheduler = createTimeChunk(
  Array.from({ length: 1000 }, (_, index) => index),
  (index) => {
    const div = document.createElement("div");
    div.textContent = String(index);
    container.appendChild(div);
  },
  { chunkSize: 20, interval: 16 }
);

scheduler.start();
```

## 边界与常见坑

- **分片过大仍然会卡**：每轮任务仍是同步执行，`chunkSize` 太大或单个任务太重都会阻塞主线程。
- **`setInterval` 不保证精确间隔**：主线程忙时，回调会延后执行；分时函数追求可响应性，不追求精准定时。
- **不要忘记取消**：组件卸载后仍然操作 DOM 或状态，容易引发异常和内存泄漏。
- **`shift()` 对大数组有成本**：超大队列可用游标索引替代 `shift()`，避免频繁移动数组元素。
- **分时不等于并行**：任务仍在主线程执行，只是拆开了；真正 CPU 密集型计算可考虑 Web Worker。

## 工程取舍

- 适合：大量 DOM 插入、非关键数据加工、可以逐步完成的批处理。
- 谨慎：任务之间有强顺序依赖、必须同步得到完整结果、单个任务本身已经很重。
- 应换方案：长时间 CPU 计算用 [Web Worker](./web-worker.md)；高频事件触发控制用 [节流和防抖](./debounce.throttle.md)；动画更新优先考虑 `requestAnimationFrame`。

## 面试 / 自测

1. 分时函数和防抖、节流的区别是什么？
2. 为什么把 1000 个任务拆成 50 次执行能改善页面响应？
3. `setInterval` 做分时调度有什么限制？
4. 为什么工程版需要提供取消能力？
5. 什么场景下应使用 Web Worker 而不是分时函数？

## 相关文章

- [节流和防抖](./debounce.throttle.md)
- [执行机制](./running.md)
- [Event Loop](./event.loop.md)
- [Web Worker](./web-worker.md)

## 参考

- [MDN: setInterval](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setInterval)
- [MDN: requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
- [MDN: Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)

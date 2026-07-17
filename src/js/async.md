---
title: 异步编程
category: javascript
---

## 一句话结论

异步编程是把「现在不能立刻得到结果」的任务交给回调、Promise 或 `async/await` 处理，让主线程继续执行后续逻辑。现代 JavaScript 优先使用 Promise 和 `async/await`，复杂并发要显式控制顺序、错误和取消。

## 为什么需要它

网络请求、定时器、文件读取、用户事件和 Worker 通信都不会立刻得到结果。如果主线程一直等待，页面就会阻塞。

- 场景：请求接口、上传文件、并发加载资源、轮询、等待用户操作。
- 不处理会怎样：代码回调嵌套、错误分散、并发失控、请求无法取消。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 回调函数 | 任务完成后被调用的函数 | 简单但容易嵌套 |
| Promise | 表示一个未来完成或失败的结果 | 有 `pending` / `fulfilled` / `rejected` |
| `async/await` | Promise 的语法糖 | 让异步流程更像同步代码 |
| 串行 | 一个任务完成后再开始下一个 | 保证顺序，耗时更长 |
| 并行 | 多个任务同时启动 | 更快，但要控制资源 |
| 并发限制 | 限制同时运行的任务数 | 防止打爆接口或浏览器资源 |

## 原理

异步任务不会在创建时直接进入调用栈执行回调，而是在条件满足后进入任务队列，等待当前同步代码和更高优先级任务执行完成。Promise 的 `.then()` / `await` 后续逻辑会进入微任务队列。

```js
console.log("start");

Promise.resolve().then(() => {
  console.log("promise");
});

setTimeout(() => {
  console.log("timer");
}, 0);

console.log("end");

// start
// end
// promise
// timer
```

## 实现

### 回调函数

```js
function requestUser(id, callback) {
  setTimeout(() => {
    callback(null, { id, name: "Alice" });
  }, 1000);
}

requestUser(1, (error, user) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log(user);
});
```

回调简单直接，但多个任务依赖时容易形成嵌套。

### Promise

```js
function requestUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: "Alice" });
    }, 1000);
  });
}

requestUser(1)
  .then((user) => {
    console.log(user);
  })
  .catch((error) => {
    console.error(error);
  });
```

Promise 把成功和失败都纳入链式流程，适合组合多个异步任务。

### async/await

```js
async function loadUser(id) {
  try {
    const user = await requestUser(id);
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
```

`await` 只能等待 Promise 结果，不会阻塞整个主线程；它只是暂停当前 `async` 函数的后续执行。

### 串行、并行和并发限制

```js
async function runSeries(items, task) {
  const results = [];

  for (const item of items) {
    results.push(await task(item));
  }

  return results;
}
```

```js
function runParallel(items, task) {
  return Promise.all(items.map(task));
}
```

```js
async function runWithLimit(items, limit, task) {
  const results = [];
  const executing = new Set();

  for (const item of items) {
    const promise = Promise.resolve(task(item)).then((result) => {
      results.push(result);
      executing.delete(promise);
    });

    executing.add(promise);

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}
```

并发限制适合批量请求、图片处理、上传任务等场景。

## 边界与常见坑

- **`async` 函数总是返回 Promise**：即使 `return 1`，调用方拿到的也是 `Promise<number>`。
- **`forEach` 不会等待 `await`**：需要串行时用 `for...of`。
- **`Promise.all` 一个失败就整体失败**：需要收集全部结果时用 `Promise.allSettled`。
- **并行不等于无限并发**：大量请求同时发出可能触发限流或资源耗尽。
- **异步错误要在异步链里捕获**：`try/catch` 只能捕获 `await` 或同步抛错。
- **取消需要额外机制**：请求可用 `AbortController`，订阅和定时器要主动清理。

## 工程取舍

- 适合：网络请求、文件处理、用户事件、后台任务协作。
- 谨慎：多个异步任务之间有共享状态时，要明确顺序和错误恢复策略。
- 应换方案：CPU 密集型任务用 [Web Worker](./web-worker.md)；高频事件控制用 [节流和防抖](./debounce.throttle.md)；长任务拆分用 [分时函数](./time.chunk.md)。

## 面试 / 自测

1. Promise 有哪些状态？状态能否回退？
2. `async` 函数返回值是什么？
3. `Promise.all` 和 `Promise.allSettled` 有什么区别？
4. 为什么 `forEach(async () => {})` 不适合串行任务？
5. 如何限制一次最多并发 3 个异步任务？

## 相关文章

- [Event Loop](./event.loop.md)
- [执行机制](./running.md)
- [Web Worker](./web-worker.md)

## 参考

- [MDN: Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: async function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)
- [MDN: AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)

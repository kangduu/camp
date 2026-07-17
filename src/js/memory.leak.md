---
title: 内存泄漏
category: javascript
---

## 一句话结论

内存泄漏是指对象已经不再需要，却仍然被可达引用保留，导致垃圾回收器无法释放。前端最常见来源是未清理的定时器、事件监听、订阅、缓存和脱离 DOM 的引用。

## 为什么需要它

单页应用会长时间运行，页面切换不等于进程退出。如果组件卸载后仍保留回调、DOM 或大对象引用，内存会持续上涨，最终导致页面变慢甚至崩溃。

- 场景：路由切换、弹窗反复打开关闭、无限滚动、图表实例、全局事件监听。
- 不处理会怎样：堆内存持续增长、旧页面逻辑继续执行、重复请求或重复响应事件。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 可达性 | 从根对象仍能访问到某对象 | 可达对象不会被回收 |
| GC Root | 垃圾回收起点 | 全局对象、当前调用栈等 |
| 闭包引用 | 内部函数保留外层变量 | 合理使用不是泄漏，长期无用才是问题 |
| 监听清理 | 移除事件、订阅、观察器 | 要使用同一个函数引用 |
| 缓存上限 | 控制缓存容量和生命周期 | 避免无限增长 |

## 原理

现代 JavaScript 引擎主要通过可达性判断对象是否可回收。只要某个对象能从全局对象、当前调用栈、定时器回调、事件监听等路径访问到，它就会被视为仍然需要。

```js
let cache = [];

function addLargeData(data) {
  cache.push(data);
}
```

如果 `cache` 没有上限且长期存在，历史数据会一直可达，无法被回收。

## 实现

### 定时器清理

```js
function createPolling(fetchData) {
  const timer = setInterval(fetchData, 5000);

  return function stop() {
    clearInterval(timer);
  };
}

const stopPolling = createPolling(() => {
  // fetch data
});

stopPolling();
```

### 事件监听清理

```js
function mountResizeListener(handler) {
  window.addEventListener("resize", handler);

  return function unmount() {
    window.removeEventListener("resize", handler);
  };
}

const cleanup = mountResizeListener(() => {
  console.log(window.innerWidth);
});

cleanup();
```

`removeEventListener` 必须传入和注册时相同的函数引用。直接传匿名函数无法正确解绑。

### 观察器清理

```js
function observeElement(element, callback) {
  const observer = new ResizeObserver(callback);
  observer.observe(element);

  return function disconnect() {
    observer.disconnect();
  };
}
```

`IntersectionObserver`、`ResizeObserver`、`MutationObserver` 都应在不需要时调用 `disconnect()`。

### 限制缓存

```js
function createLimitedCache(limit = 100) {
  const map = new Map();

  return {
    set(key, value) {
      if (map.has(key)) {
        map.delete(key);
      }

      map.set(key, value);

      if (map.size > limit) {
        const oldestKey = map.keys().next().value;
        map.delete(oldestKey);
      }
    },
    get(key) {
      return map.get(key);
    },
  };
}
```

## 边界与常见坑

- **闭包不等于泄漏**：闭包是语言能力，只有长期持有不再需要的大对象时才会成为问题。
- **Promise 未决不一定泄漏，但可能保留回调链**：要关注长生命周期异步任务和取消能力。
- **控制台引用会影响观察结果**：DevTools 中保存的对象可能暂时不被回收。
- **全局状态会延长生命周期**：Redux/Vuex/全局单例中的数据需要主动淘汰。
- **用 `setTimeout` 递归模拟轮询也要清理**：不能只关注 `setInterval`。

## 工程取舍

- 适合：所有长生命周期应用都应建立清理意识。
- 谨慎：为了避免泄漏过度清空共享缓存，可能损害性能。
- 应换方案：大型资源用生命周期统一管理；订阅流用 `unsubscribe`；请求用 `AbortController`；对象弱引用场景可考虑 `WeakMap`。

## 面试 / 自测

1. 什么样的对象无法被垃圾回收？
2. 为什么事件监听容易造成泄漏？
3. `removeEventListener` 为什么要求同一个函数引用？
4. 闭包一定会造成内存泄漏吗？
5. 如何排查 SPA 页面切换后的内存泄漏？

## 相关文章

- [执行机制](./running.md)
- [异步编程](./async.md)
- [深拷贝和浅拷贝](./deep.clone.md)

## 参考

- [MDN: Memory management](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Memory_management)
- [MDN: AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController)
- [MDN: ResizeObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/ResizeObserver)

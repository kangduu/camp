---
title: 节流和防抖
category: javascript
---

## 一句话结论

防抖是「连续触发后只执行最后一次」，节流是「持续触发时按固定频率执行」。它们都用来控制高频事件，减少无意义计算、请求和渲染。

## 为什么需要它

滚动、输入、窗口缩放、鼠标移动等事件触发频率很高。如果每次触发都执行重逻辑，页面会卡顿，也可能发出大量重复请求。

- 场景：搜索框输入联想、窗口 resize 计算布局、滚动加载、按钮防重复提交。
- 不处理会怎样：请求风暴、重复提交、频繁布局计算、滚动掉帧。

## 核心概念

| 概念 | 含义 | 适合场景 |
| ---- | ---- | ---- |
| 防抖 debounce | 停止触发一段时间后再执行 | 输入搜索、表单自动保存 |
| 立即防抖 | 第一次触发立即执行，等待期内忽略 | 防重复点击 |
| 节流 throttle | 固定时间窗口最多执行一次 | 滚动、resize、鼠标移动 |
| leading | 是否在开始时执行 | 节流/防抖常见选项 |
| trailing | 是否在结束时补执行 | 保留最后一次状态 |
| cancel | 取消等待中的执行 | 组件卸载时清理 |

## 原理

防抖通过清理并重设计时器，把连续触发合并成一次执行。

```js
function debounce(fn, wait) {
  let timer = null;

  return function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}
```

节流通过时间戳或定时器，限制函数在一段时间内最多执行一次。

```js
function throttle(fn, wait) {
  let previous = 0;

  return function throttled(...args) {
    const now = Date.now();

    if (now - previous >= wait) {
      previous = now;
      fn.apply(this, args);
    }
  };
}
```

## 实现

### 工程版 debounce

```js
function debounce(fn, wait = 300, options = {}) {
  const { leading = false, trailing = true } = options;
  let timer = null;
  let lastArgs = null;
  let lastThis = null;

  function invoke() {
    const args = lastArgs;
    const context = lastThis;

    lastArgs = null;
    lastThis = null;
    fn.apply(context, args);
  }

  function debounced(...args) {
    lastArgs = args;
    lastThis = this;

    const shouldCallNow = leading && !timer;

    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;

      if (trailing && !shouldCallNow) {
        invoke();
      }
    }, wait);

    if (shouldCallNow) {
      invoke();
    }
  }

  debounced.cancel = function cancel() {
    clearTimeout(timer);
    timer = null;
    lastArgs = null;
    lastThis = null;
  };

  return debounced;
}
```

### 工程版 throttle

```js
function throttle(fn, wait = 300, options = {}) {
  const { leading = true, trailing = true } = options;
  let timer = null;
  let previous = 0;
  let lastArgs = null;
  let lastThis = null;

  function invoke(time) {
    previous = time;
    timer = null;
    fn.apply(lastThis, lastArgs);
    lastArgs = null;
    lastThis = null;
  }

  function throttled(...args) {
    const now = Date.now();

    if (!previous && !leading) {
      previous = now;
    }

    const remaining = wait - (now - previous);
    lastArgs = args;
    lastThis = this;

    if (remaining <= 0 || remaining > wait) {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }

      invoke(now);
    } else if (!timer && trailing) {
      timer = setTimeout(() => {
        invoke(leading ? Date.now() : 0);
      }, remaining);
    }
  }

  throttled.cancel = function cancel() {
    clearTimeout(timer);
    timer = null;
    previous = 0;
    lastArgs = null;
    lastThis = null;
  };

  return throttled;
}
```

两个工程版都保留了 `this`、参数和取消能力。返回值在 trailing 异步执行时无法同步返回，调用方不要依赖它。

## 边界与常见坑

- **防抖适合等用户停下来**：输入搜索常用防抖。
- **节流适合持续反馈**：滚动进度、拖拽位置常用节流。
- **组件卸载要 cancel**：否则等待中的回调可能访问已销毁状态。
- **返回值不稳定**：延迟执行的回调无法同步返回结果。
- **不要在 render 中重复创建包装函数**：会导致取消失效和监听解绑失败。

## 工程取舍

- 适合：高频事件、重复点击、输入联想、滚动和 resize。
- 谨慎：需要每一次事件都不能丢失的场景，例如精确轨迹记录。
- 应换方案：动画用 `requestAnimationFrame`；大量任务拆分用 [分时函数](./time.chunk.md)；成熟项目可直接使用 lodash 的实现。

## 面试 / 自测

1. 防抖和节流的区别是什么？
2. 搜索框输入联想应该用哪一个？
3. 滚动进度计算应该用哪一个？
4. 为什么防抖/节流要保留 `this` 和参数？
5. 为什么需要 `cancel`？

## 相关文章

- [分时函数](./time.chunk.md)
- [高阶函数](./higher-order-function.md)
- [执行机制](./running.md)

## 参考

- [MDN: setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)
- [Lodash: debounce](https://lodash.com/docs/#debounce)
- [Lodash: throttle](https://lodash.com/docs/#throttle)

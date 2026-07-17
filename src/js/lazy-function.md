---
title: 惰性函数
category: javascript
---

## 一句话结论

惰性函数是在第一次调用时完成环境判断或分支选择，然后把函数自身替换成更具体的实现，后续调用不再重复判断。它常用于兼容性分支、能力检测和初始化成本较高但不一定会用到的逻辑。

## 为什么需要它

有些判断在同一个运行环境中结果不会变化，例如浏览器是否支持某个 API。如果每次调用都重复判断，代码冗余，也会带来不必要的运行时开销。

- 场景：事件绑定兼容处理；按运行环境选择存储方案；首次使用时初始化昂贵资源。
- 不处理会怎样：每次调用都走同一套分支判断；如果提前初始化但最终没有使用，又会浪费启动成本。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 能力检测 | 判断当前环境是否支持某 API | 优先检测能力，不根据浏览器名称判断 |
| 函数重写 | 第一次调用后把变量指向新的函数实现 | 后续调用直接命中新实现 |
| 闭包缓存 | 把第一次计算结果保存在闭包中 | 不一定重写函数 |
| 首次调用成本 | 第一次调用会包含判断或初始化 | 后续调用更轻 |

## 原理

惰性函数利用了 JavaScript 中函数也是值这一点：变量可以先指向一个带判断逻辑的函数，第一次执行后再把变量改写成具体实现。

```js
let fn = function () {
  fn = function () {
    return "cached result";
  };

  return fn();
};

console.log(fn()); // 'cached result'
console.log(fn()); // 'cached result'
```

第一次调用执行初始化逻辑，后续调用已经不再进入原来的分支。它和立即执行函数的区别在于：立即执行函数会在模块加载时就完成判断，惰性函数会推迟到第一次真正使用时才判断。

## 实现

### 最小可用版

下面保留原笔记里的事件绑定场景。`attachEvent` 是旧 IE 的历史 API，只适合作为理解惰性函数的例子；现代浏览器应使用 `addEventListener`。

```js
let addEvent = function (element, type, handler) {
  if (element.addEventListener) {
    addEvent = function (element, type, handler) {
      element.addEventListener(type, handler, false);
    };
  } else if (element.attachEvent) {
    addEvent = function (element, type, handler) {
      element.attachEvent("on" + type, handler);
    };
  } else {
    addEvent = function (element, type, handler) {
      element["on" + type] = handler;
    };
  }

  addEvent(element, type, handler);
};
```

第一次绑定事件时执行能力检测，并重写 `addEvent`。后续绑定事件会直接调用选中的实现。

### 完整版

工程里更常见的是封装成工厂函数，避免直接重写外层变量导致测试和模块边界不清晰。

```js
function createEventBinder() {
  let bind = null;

  return function addEvent(element, type, handler, options = false) {
    if (!element) {
      throw new TypeError("element is required");
    }

    if (typeof handler !== "function") {
      throw new TypeError("handler must be a function");
    }

    if (!bind) {
      if (typeof element.addEventListener === "function") {
        bind = function bindByAddEventListener(element, type, handler, options) {
          element.addEventListener(type, handler, options);
        };
      } else {
        bind = function bindByOnEvent(element, type, handler) {
          element["on" + type] = handler;
        };
      }
    }

    bind(element, type, handler, options);
  };
}

const addEvent = createEventBinder();
```

这个版本没有使用旧 IE 的 `attachEvent`，因为它已经属于历史兼容知识。对于现代项目，优先写清楚当前支持的运行环境，而不是为不支持的浏览器保留复杂分支。

### 与立即执行函数的对比

```js
const addEventImmediately = (function createBinder() {
  if (typeof window !== "undefined" && window.addEventListener) {
    return function addEvent(element, type, handler, options = false) {
      element.addEventListener(type, handler, options);
    };
  }

  return function addEvent(element, type, handler) {
    element["on" + type] = handler;
  };
})();
```

立即执行函数适合一定会用到的基础能力；惰性函数适合可能不会用到、或者初始化成本希望延迟到首次使用的能力。

## 边界与常见坑

- **不要用浏览器名称判断能力**：优先判断 API 是否存在，例如 `typeof element.addEventListener === "function"`。
- **函数重写会影响引用**：如果其他变量提前保存了旧函数引用，它不会自动指向新函数。
- **旧 API 只当历史背景**：`attachEvent` 面向旧 IE，现代文档中应标明过时背景。
- **SSR 环境没有 `window` 和 DOM**：模块加载阶段直接访问 `window` 可能在 Node.js 中报错。
- **不要为了微小收益过度使用**：普通分支判断成本很低，惰性函数应服务于清晰的环境选择或初始化延迟。

## 工程取舍

- 适合：能力检测结果稳定、初始化昂贵、使用频率高且分支固定的函数。
- 谨慎：函数会被多处保存引用、需要热更新、需要在测试中频繁切换环境。
- 应换方案：现代项目可以通过构建目标、polyfill、特性检测工具或统一适配层处理兼容性，不必在业务代码里散落惰性分支。

## 面试 / 自测

1. 惰性函数和立即执行函数分别适合什么场景？
2. 为什么第一次调用后可以减少后续判断？
3. 函数重写会对已经保存的函数引用产生什么影响？
4. 为什么现代代码不推荐继续围绕 `attachEvent` 做兼容分支？
5. SSR 环境中写惰性函数要注意什么？

## 相关文章

- [函数柯里化](./currying.md)
- [高阶函数](./higher-order-function.md)
- [执行机制](./running.md)

## 参考

- [MDN: addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)
- [MDN: Closures](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Closures)

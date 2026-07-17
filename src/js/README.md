---
title: JavaScript
icon: fa6-brands:square-js
---

JavaScript 文档按 [roadmap.sh JavaScript Roadmap](https://roadmap.sh/javascript/) 的学习顺序补齐，并合并本站已有的手写实现、运行机制和工程模式笔记。入口页只做导航，具体概念、代码实现、边界和面试题放在各主题文档中。

阅读时先区分四层内容：ECMAScript 语言本身、浏览器 Web API、Node.js 等运行时 API、框架或工程工具能力。旧浏览器兼容 API、历史实现方式和不推荐的新项目写法，会在对应文章中标明适用范围。

## 推荐阅读路径

1. 先读 [JavaScript 入门](./introduction.md)、[变量与作用域](./variables.md)、[数据类型与数据结构](./data-types.md)、[相等比较](./equality.md)，建立语言基础。
2. 再读 [预编译](./precompile.md)、[执行机制](./running.md)、[this](./this.md)、[原型与原型链](./prototype.md)、[new](./new.md)，理解运行时模型。
3. 接着读 [函数基础](./functions.md)、[call / apply / bind](./call.apply.bind.md)、[面向对象](./oop.md)、[迭代器与生成器](./iterators-generators.md)，把函数、对象和复用方式串起来。
4. 然后读 [异步编程](./async.md)、[Event Loop](./event.loop.md)、[API 请求](./api.md)、[Web Worker](./web-worker.md)，掌握异步和浏览器任务模型。
5. 最后读工程模式与查漏补缺：模块、深拷贝、防抖节流、分时函数、内存泄漏、DOM、DevTools、数组、正则、ES6 和题集。

## 入门与基础

- [JavaScript 入门](./introduction.md)
- [变量与作用域](./variables.md)
- [数据类型与数据结构](./data-types.md)
- [相等比较](./equality.md)
- [表达式、运算符与控制流](./expressions-control-flow.md)
- [parseInt / parseFloat](./parseInt.parseFloat.md)
- [严格模式](./strict-mode.md)

## 执行模型

- [预编译](./precompile.md)
- [执行机制](./running.md)
- [this](./this.md)
- [原型与原型链](./prototype.md)
- [new](./new.md)
- [内存泄漏](./memory.leak.md)

## 函数与对象

- [函数基础](./functions.md)
- [call / apply / bind](./call.apply.bind.md)
- [面向对象](./oop.md)
- [函数柯里化](./currying.md)
- [高阶函数](./higher-order-function.md)
- [惰性函数](./lazy-function.md)
- [迭代器与生成器](./iterators-generators.md)

## 异步、浏览器与 API

- [异步编程](./async.md)
- [Event Loop](./event.loop.md)
- [API 请求](./api.md)
- [DOM API](./dom-api.md)
- [Web Worker](./web-worker.md)
- [浏览器 DevTools](./browser-devtools.md)

## 工程模式

- [Module](./module.md)
- [节流和防抖](./debounce.throttle.md)
- [分时函数](./time.chunk.md)
- [深拷贝和浅拷贝](./deep.clone.md)

## 查漏补缺

- [数组方法](./array.md)
- [数组去重](./deweight.array.md)
- [正则表达式](./reg-exp.md)
- [ES6](./es6.md)
- [题集](./questions.md)

## 外部资源

- [roadmap.sh JavaScript Roadmap](https://roadmap.sh/javascript/)
- [MDN JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)
- [ECMAScript Specification](https://tc39.es/ecma262/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools)

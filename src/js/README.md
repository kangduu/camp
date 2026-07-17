---
title: JavaScript
icon: fa6-brands:square-js
---

这里整理 JavaScript 基础、运行机制、异步并发和工程常用模式。入口页只做导航，具体概念、代码实现、边界和面试题放在各主题文档中。

## 推荐阅读路径

1. 先读语言基石：执行上下文、`this`、原型、`new`、面向对象。
2. 再读异步与并发：执行机制、Event Loop、异步编程、Web Worker。
3. 然后读工程常用模式：模块、深拷贝、防抖节流、分时函数、高阶函数、惰性函数。
4. 最后查漏补缺：数组、正则、ES6、类型转换和题集。

旧浏览器兼容 API、历史实现方式和不推荐的新项目写法，会在对应文章中标明适用范围。

## 语言基石

- [预编译](./precompile.md)
- [执行机制](./running.md)
- [this](./this.md)
- [原型与原型链](./prototype.md)
- [new](./new.md)
- [call / apply / bind](./call.apply.bind.md)
- [面向对象](./oop.md)
- [parseInt / parseFloat](./parseInt.parseFloat.md)

## 异步与并发

- [异步编程](./async.md)
- [Event Loop](./event.loop.md)
- [Web Worker](./web-worker.md)

## 工程常用模式

- [Module](./module.md)
- [函数柯里化](./currying.md)
- [高阶函数](./higher-order-function.md)
- [惰性函数](./lazy-function.md)
- [节流和防抖](./debounce.throttle.md)
- [分时函数](./time.chunk.md)
- [深拷贝和浅拷贝](./deep.clone.md)
- [内存泄漏](./memory.leak.md)

## 查漏补缺

- [数组方法](./array.md)
- [数组去重](./deweight.array.md)
- [正则表达式](./reg-exp.md)

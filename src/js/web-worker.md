---
title: Web Worker
---

## Worker 有哪些类型？

- 专用 worker，由单个脚本使用的 worker
- 共享 worker，在不同窗口、IFrame 等中运行的多个脚本使用的 worker
- Service worker，作为代理服务器 ？

\#[Worker 类型](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API#worker_%E7%B1%BB%E5%9E%8B)

## 数据传输 - 消息系统

1. `postMessage()` 发送消息

2. `onmessage` 响应消息（事件）

## 数据请求 - （fetch / XMLHttpRequest）

> 注意：消息（data 属性）是复制的，而不是共享的

1. fetch

2. XMLHttpRequest

## API 接口

### worker 中那些 API 不能被使用？

- 不能直接在 worker 线程中**操作 DOM 元素**
- 某些 window 对象中的方式或属性（[Worker 全局上下文和函数](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API#worker_%E5%85%A8%E5%B1%80%E4%B8%8A%E4%B8%8B%E6%96%87%E5%92%8C%E5%87%BD%E6%95%B0) / [支持的 Web API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API#%E6%94%AF%E6%8C%81%E7%9A%84_web_api)）

## Reference

- [Web Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)

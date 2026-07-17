---
title: 浏览器 DevTools
category: javascript
---

## 一句话结论

浏览器 DevTools 是调试 JavaScript、DOM、网络、性能和内存问题的核心工具。会用断点、Network、Performance、Memory 面板，比只依赖 `console.log` 更可靠。

## 为什么需要它

- 场景：接口失败、事件没触发、页面卡顿、内存泄漏、样式错乱、异步调用顺序异常。
- 不处理会怎样：只能凭猜测改代码，很难定位真实瓶颈或复现线上问题。

## 核心概念

| 面板 | 用途 | 典型问题 |
| ---- | ---- | ---- |
| Elements | 查看 DOM 和样式 | 布局、CSS 覆盖 |
| Console | 执行表达式和看日志 | 快速验证 |
| Sources | 断点调试 JS | 调用栈、作用域 |
| Network | 请求分析 | 状态码、耗时、缓存 |
| Performance | 性能录制 | 长任务、布局抖动 |
| Memory | 堆快照 | 内存泄漏 |

## 原理

DevTools 通过浏览器调试协议观察页面运行状态。断点暂停主线程后，可以检查作用域、调用栈和闭包变量；Performance 录制能展示脚本、样式、布局、绘制等任务耗时；Memory 快照可分析对象保留链。

## 实现

### 断点调试

```js
function calculateTotal(items) {
  debugger;
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

`debugger` 会在 DevTools 打开时触发断点。提交代码前应删除。

### 网络排查清单

```markdown
1. 看请求是否发出
2. 看状态码和响应体
3. 看请求头、响应头、content-type
4. 看是否命中缓存
5. 看 timing 中 DNS、TTFB、download 时间
```

## 边界与常见坑

- **Console 输出的是对象引用的当前状态**：必要时输出快照副本。
- **Source map 影响调试体验**：生产环境要平衡可调试性和源码暴露。
- **Performance 录制要复现场景**：空闲页面数据意义有限。
- **内存泄漏看保留链**：只看对象数量容易误判。

## 工程取舍

- 适合：本地调试、线上问题复现、性能和内存分析。
- 谨慎：生产 source map 和敏感代码暴露。
- 不适合或应换方案：真实用户性能还需要 RUM、日志和监控数据补充。

## 面试 / 自测

1. 如何定位一个接口请求失败？
2. Performance 面板能看出哪些页面性能问题？
3. 内存泄漏为什么要看对象保留链？

## 相关文章

- [内存泄漏](./memory.leak.md)
- [DOM API](./dom-api.md)
- [Event Loop](./event.loop.md)

## 参考

- [Chrome DevTools](https://developer.chrome.com/docs/devtools)
- [MDN: Debugging JavaScript](https://developer.mozilla.org/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools)

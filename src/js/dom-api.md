---
title: DOM API
category: javascript
---

## 一句话结论

DOM API 是浏览器把 HTML 文档暴露给 JavaScript 操作的接口。它不属于 ECMAScript 本身，只在浏览器或模拟 DOM 的环境中可用。

## 为什么需要它

- 场景：选择元素、修改内容、绑定事件、动态插入节点、读取表单值。
- 不处理会怎样：把 DOM 当普通 JS 对象理解，会忽略渲染、事件传播、布局和性能成本。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| Node | DOM 树节点基类 | 文本、元素、注释都是节点 |
| Element | 元素节点 | 常用选择和属性操作 |
| EventTarget | 事件目标接口 | 支持 `addEventListener` |
| DOMContentLoaded | DOM 构建完成事件 | 不等于资源全部加载 |
| Reflow / Repaint | 布局和绘制 | 频繁 DOM 读写会触发性能问题 |

## 原理

浏览器解析 HTML 生成 DOM 树，JavaScript 通过 DOM API 修改树结构或节点属性。修改 DOM 可能影响样式计算、布局和绘制；因此大量节点操作应合并或使用文档片段、模板、虚拟列表等方案。

## 实现

### 查询和更新

```js
const list = document.querySelector("#list");

const item = document.createElement("li");
item.textContent = "JavaScript";

list.append(item);
```

### 事件委托

```js
document.querySelector("#list").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");

  if (!button) return;
  console.log(button.dataset.action);
});
```

## 边界与常见坑

- **DOM API 只在浏览器环境可用**：Node.js 中没有原生 `document`。
- **`innerHTML` 有 XSS 风险**：插入用户内容优先用 `textContent`。
- **事件会冒泡和捕获**：委托时要判断真实目标。
- **频繁读写布局属性会造成性能问题**。

## 工程取舍

- 适合：轻量交互、脚本增强、理解框架底层。
- 谨慎：复杂状态和大量 UI 更新，手写 DOM 容易失控。
- 不适合或应换方案：大型应用通常交给 React、Vue 等框架管理 UI 状态。

## 面试 / 自测

1. DOM API 和 JavaScript 语言标准是什么关系？
2. 事件委托为什么能工作？
3. `innerHTML` 和 `textContent` 的安全差异是什么？

## 相关文章

- [事件循环](./event.loop.md)
- [Web Worker](./web-worker.md)
- [分时函数](./time.chunk.md)

## 参考

- [MDN: Document Object Model](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
- [MDN: EventTarget.addEventListener](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)

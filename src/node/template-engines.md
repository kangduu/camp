---
title: 模板引擎
category: nodejs
---

## 一句话结论

模板引擎把数据渲染成 HTML，常见选择包括 EJS、Pug 和 Marko。它适合服务端渲染页面或生成静态文本，但不应替代前端组件体系和 API 分层。

## 为什么需要它

- 场景：传统服务端页面、邮件模板、代码生成、静态 HTML 输出。
- 不处理会怎样：字符串拼接难维护，转义不当会产生 XSS。

## 运行时边界

| 能力 | 说明 | 备注 |
| ---- | ---- | ---- |
| EJS | 类 HTML 模板 | 学习成本低 |
| Pug | 缩进式模板 | 语法更抽象 |
| Marko | 组件化 SSR | 更偏框架 |
| Express view | 框架集成 | 需要配置 view engine |

## 实现

### Express + EJS

```js
import express from "express";

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res) => {
  res.render("index", { title: "Node.js" });
});
```

### 生成文本

```js
import ejs from "ejs";

const output = ejs.render("Hello <%= name %>", { name: "Node.js" });
console.log(output);
```

## 边界与常见坑

- **用户输入必须转义**：不要把不可信内容作为原始 HTML 输出。
- **模板不要写复杂业务逻辑**：先在 service 层准备好 view model。
- **缓存策略要明确**：生产环境通常启用模板缓存。
- **SSR 和 API 架构取舍不同**：不要混为一谈。

## 工程取舍

- 适合：管理后台、官网、邮件、轻量 SSR、生成 HTML。
- 谨慎：强交互复杂前端，模板和客户端状态可能重复。
- 不适合或应换方案：SPA/大型前端应用通常用前端框架主导渲染。

## 面试 / 自测

1. 模板引擎解决什么问题？
2. 为什么模板里输出用户输入要转义？
3. 模板渲染和前后端分离 API 的取舍是什么？

## 相关文章

- [API 开发](./api-development.md)
- [错误处理](./error-handling.md)

## 参考

- [EJS](https://ejs.co/)
- [Pug](https://pugjs.org/)
- [Marko](https://markojs.com/)

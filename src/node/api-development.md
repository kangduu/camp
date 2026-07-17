---
title: API 开发
category: nodejs
---

## 一句话结论

Node.js 可用内置 `http` 模块直接构建 API，也可以使用 Express、Fastify、NestJS、Hono 等框架提高路由、中间件、校验和工程组织能力。

## 为什么需要它

- 场景：REST API、BFF、Webhook、内部服务、调用第三方 API。
- 不处理会怎样：请求解析、错误处理、超时、鉴权和日志散落在业务代码中。

## 运行时边界

| 能力 | 选择 | 备注 |
| ---- | ---- | ---- |
| 底层 HTTP | `node:http` | 标准库，控制力强 |
| Web 框架 | Express / Fastify / Hono / NestJS | 提供路由和中间件 |
| API 调用 | `fetch` / axios / got / ky | Node 新版本内置 fetch |
| 数据格式 | JSON | 需设置 content-type |

## 实现

### 内置 http

```js
import http from "node:http";

http
  .createServer((req, res) => {
    if (req.url === "/health") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
      return;
    }

    res.writeHead(404);
    res.end();
  })
  .listen(3000);
```

### Express 路由

```js
import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.listen(3000);
```

### 调用外部 API

```js
const response = await fetch("https://api.github.com");

if (!response.ok) {
  throw new Error(`request failed: ${response.status}`);
}

const data = await response.json();
```

## 边界与常见坑

- **不要信任请求体**：必须做运行时校验。
- **超时要显式设置**：外部 API 卡住会拖垮服务。
- **错误响应不要泄露内部细节**。
- **路由层不要堆业务逻辑**：复杂逻辑拆到 service。
- **框架不是安全边界**：鉴权、限流、CORS、日志仍需设计。

## 工程取舍

- 适合：Express 快速开发，Fastify 追求性能，NestJS 做大型分层应用，Hono 做轻量跨运行时。
- 谨慎：框架越重，约定越强，迁移成本越高。
- 不适合或应换方案：简单脚本不需要引入完整 Web 框架。

## 面试 / 自测

1. 内置 `http` 和 Express 的关系是什么？
2. 为什么 API 请求体必须运行时校验？
3. 调用第三方 API 时应处理哪些失败？

## 相关文章

- [错误处理](./error-handling.md)
- [认证与 JWT](./jwt.md)
- [日志](./logging.md)

## 参考

- [Node.js Docs: HTTP](https://nodejs.org/api/http.html)
- [Express](https://expressjs.com/)
- [Fastify](https://fastify.dev/)
- [NestJS](https://docs.nestjs.com/)

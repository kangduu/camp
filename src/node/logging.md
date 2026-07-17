---
title: 日志
category: nodejs
---

## 一句话结论

日志是生产排障和观测的基础。Node.js 应区分访问日志、应用日志、错误日志和审计日志，并尽量输出结构化字段。

## 为什么需要它

- 场景：定位线上错误、分析请求耗时、追踪用户操作、对接日志平台。
- 不处理会怎样：只看到“报错了”，不知道请求、用户、参数、耗时和调用链。

## 运行时边界

| 日志类型 | 内容 | 工具 |
| ---- | ---- | ---- |
| 访问日志 | 请求方法、路径、状态、耗时 | Morgan |
| 应用日志 | 业务事件和状态 | Winston / Pino |
| 错误日志 | 栈、上下文、错误码 | Logger + 告警 |
| 审计日志 | 安全敏感操作 | 持久化保存 |

## 实现

### 结构化日志

```js
import winston from "winston";

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

logger.info("server_started", { port: 3000 });
```

### Express 访问日志

```js
import morgan from "morgan";

app.use(morgan("combined"));
```

## 边界与常见坑

- **不要记录密码、token、密钥、身份证等敏感信息**。
- **日志级别要有规范**：debug、info、warn、error 各司其职。
- **错误日志要带上下文**：请求 ID、用户 ID、接口名、耗时。
- **生产日志不要只写本地文件**：容器环境通常输出到 stdout/stderr。

## 工程取舍

- 适合：Pino 追求性能，Winston 配置灵活，Morgan 做 HTTP 访问日志。
- 谨慎：过量日志会增加成本和噪音。
- 不适合或应换方案：指标和链路追踪不要全部塞进普通文本日志。

## 面试 / 自测

1. 访问日志和应用日志有什么区别？
2. 为什么生产环境常输出到 stdout/stderr？
3. 结构化日志有什么好处？

## 相关文章

- [错误处理](./error-handling.md)
- [API 开发](./api-development.md)
- [调试与性能](./debugging-performance.md)

## 参考

- [Winston](https://github.com/winstonjs/winston)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Pino](https://getpino.io/)

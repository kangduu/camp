---
title: 错误处理
category: nodejs
---

## 一句话结论

Node.js 错误处理要按同步异常、Promise rejection、回调错误、EventEmitter `'error'`、进程级异常分开处理。不要把 `uncaughtException` 当业务兜底方案。

## 为什么需要它

- 场景：API 失败响应、文件读取失败、数据库错误、异步任务失败、进程崩溃恢复。
- 不处理会怎样：错误被吞、进程异常退出、请求挂起、日志缺上下文。

## 运行时边界

| 错误类型 | 处理方式 | 备注 |
| ---- | ---- | ---- |
| 同步异常 | `try/catch` | 调用栈内有效 |
| Promise 失败 | `await` + `try/catch` | 或 `.catch` |
| callback 错误 | error-first callback | `(err, data)` |
| EventEmitter 错误 | 监听 `'error'` | 未监听可能崩溃 |
| 进程级错误 | 记录并退出 | 不建议继续运行 |

## 实现

### API 错误封装

```js
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function errorHandler(error, req, res, next) {
  const status = error.status || 500;
  res.status(status).json({
    message: status >= 500 ? "Internal Server Error" : error.message,
  });
}
```

### 异步错误

```js
import { readFile } from "node:fs/promises";

try {
  const content = await readFile("config.json", "utf8");
  JSON.parse(content);
} catch (error) {
  console.error("read config failed", error);
}
```

## 边界与常见坑

- **异步回调里的 throw 不会被外层 try/catch 捕获**。
- **`unhandledRejection` 说明错误路径没设计好**。
- **捕获后不处理等于吞错**：至少记录上下文或转换成明确响应。
- **进程级异常后继续运行有风险**：状态可能已经不一致。
- **错误信息不要泄露密钥、SQL、内部路径。**

## 工程取舍

- 适合：业务错误用明确错误类型，系统错误记录后返回安全信息。
- 谨慎：全局兜底只做日志、告警和优雅退出。
- 不适合或应换方案：用字符串错误码替代错误对象会丢失栈信息。

## 面试 / 自测

1. 为什么异步回调里的异常不能被外层 `try/catch` 捕获？
2. Node 的 error-first callback 约定是什么？
3. `uncaughtException` 后为什么通常要退出进程？

## 相关文章

- [异步编程](./async-programming.md)
- [日志](./logging.md)
- [API 开发](./api-development.md)

## 参考

- [Node.js Docs: Errors](https://nodejs.org/api/errors.html)
- [Node.js Docs: Process events](https://nodejs.org/api/process.html#process-events)

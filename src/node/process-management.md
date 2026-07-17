---
title: 进程保活
category: nodejs
---

## 一句话结论

Node.js 服务要在生产环境长期运行，需要进程管理、重启策略、日志接入、健康检查和优雅关闭。pm2 是常见选择，但容器和平台编排也能承担这些职责。

## 为什么需要它

- 场景：API 服务上线、异常崩溃自动重启、部署滚动更新、机器重启后恢复服务。
- 不处理会怎样：进程退出后服务不可用，日志丢失，部署时中断请求。

## 运行时边界

| 能力 | 方案 | 备注 |
| ---- | ---- | ---- |
| 本地进程管理 | pm2 | 常见 Node 进程管理器 |
| 容器编排 | Docker / Kubernetes | 平台负责重启和调度 |
| 系统服务 | systemd | 服务器部署常见 |
| 优雅关闭 | 应用代码 | 处理 SIGTERM/SIGINT |

## 实现

### pm2 启动

```bash
npx pm2 start dist/index.js --name camp-api
npx pm2 logs camp-api
npx pm2 restart camp-api
```

### 优雅关闭

```js
const server = app.listen(3000);

function shutdown(signal) {
  console.log(`received ${signal}`);
  server.close(() => {
    process.exit(0);
  });

  setTimeout(() => {
    process.exit(1);
  }, 10_000).unref();
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
```

## 边界与常见坑

- **保活不是修复崩溃**：频繁重启要找根因。
- **不要忽略优雅关闭**：数据库连接、队列任务、正在处理的请求需要收尾。
- **容器里不一定需要 pm2**：平台本身可能已经负责重启和日志。
- **健康检查要反映真实依赖**：只返回进程活着不够。

## 工程取舍

- 适合：传统服务器部署可用 pm2 或 systemd。
- 谨慎：容器环境避免重复进程管理。
- 不适合或应换方案：分布式任务调度不应只靠单机 pm2。

## 面试 / 自测

1. pm2 解决什么问题？
2. 为什么要处理 SIGTERM？
3. 进程重启和故障恢复有什么区别？

## 相关文章

- [日志](./logging.md)
- [错误处理](./error-handling.md)
- [调试与性能](./debugging-performance.md)

## 参考

- [pm2](https://pm2.keymetrics.io/)
- [Node.js Docs: process signal events](https://nodejs.org/api/process.html#signal-events)

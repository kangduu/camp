---
title: 线程与进程
category: nodejs
---

## 一句话结论

Node.js 主线程适合处理 I/O 并发；CPU 密集、隔离执行、外部命令和多核利用应考虑 Worker Threads、child_process 或 cluster。

## 为什么需要它

- 场景：图片处理、加密计算、调用系统命令、并行任务、利用多核。
- 不处理会怎样：CPU 任务阻塞事件循环，整个服务响应变慢。

## 运行时边界

| 方案 | 适合场景 | 备注 |
| ---- | ---- | ---- |
| Worker Threads | CPU 密集 JS 任务 | 同进程多线程 |
| child_process | 调用外部命令或隔离进程 | 独立进程 |
| cluster | 多进程共享端口 | 常用于服务多核部署 |
| libuv thread pool | 部分异步 I/O 内部使用 | 不是直接业务线程池 |

## 实现

### Worker Threads

```js
import { Worker } from "node:worker_threads";

export function runWorker(data) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
      workerData: data,
    });

    worker.once("message", resolve);
    worker.once("error", reject);
    worker.once("exit", (code) => {
      if (code !== 0) reject(new Error(`worker exited ${code}`));
    });
  });
}
```

### child_process

```js
import { spawn } from "node:child_process";

const child = spawn("node", ["--version"], { stdio: "inherit" });

child.on("exit", (code) => {
  console.log(`exit ${code}`);
});
```

## 边界与常见坑

- **Worker 不是免费的**：创建和通信都有成本。
- **child_process 更适合隔离和外部命令**。
- **cluster 不共享内存**：状态要放外部存储。
- **不要把阻塞 CPU 任务留在请求主线程**。

## 工程取舍

- 适合：Worker 做 CPU 任务，child_process 跑外部程序，cluster 利用多核。
- 谨慎：多进程/多线程会增加部署、日志和错误处理复杂度。
- 不适合或应换方案：长期分布式任务更适合队列和独立 worker 服务。

## 面试 / 自测

1. Worker Threads 和 child_process 的区别是什么？
2. 为什么 CPU 密集任务会阻塞 Node 主线程？
3. cluster 是否共享内存？

## 相关文章

- [异步编程](./async-programming.md)
- [进程保活](./process-management.md)
- [调试与性能](./debugging-performance.md)

## 参考

- [Node.js Docs: Worker threads](https://nodejs.org/api/worker_threads.html)
- [Node.js Docs: Child process](https://nodejs.org/api/child_process.html)
- [Node.js Docs: Cluster](https://nodejs.org/api/cluster.html)

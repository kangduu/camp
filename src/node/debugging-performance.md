---
title: 调试与性能
category: nodejs
---

## 一句话结论

Node.js 调试和性能排查要从错误栈、断点、CPU profile、内存快照、GC、APM 和日志指标共同入手。先定位瓶颈类型，再决定优化方案。

## 为什么需要它

- 场景：线上内存上涨、接口变慢、CPU 飙高、偶发错误、依赖调用超时。
- 不处理会怎样：凭感觉优化，改了代码但瓶颈仍在。

## 运行时边界

| 问题 | 常用工具 | 备注 |
| ---- | ---- | ---- |
| 断点调试 | `node --inspect` | Chrome DevTools / IDE |
| CPU 高 | CPU profile | 找同步热点 |
| 内存泄漏 | heap snapshot | 找对象保留链 |
| GC 压力 | GC 日志 / APM | 看分配和回收 |
| 线上观测 | APM / logs / metrics | 需要请求上下文 |

## 实现

### 启用调试

```bash
node --inspect src/index.js
node --inspect-brk src/index.js
```

### 基础耗时日志

```js
const started = performance.now();

try {
  await runTask();
} finally {
  console.log("task_duration_ms", Math.round(performance.now() - started));
}
```

### 发现事件循环阻塞

```js
import { monitorEventLoopDelay } from "node:perf_hooks";

const histogram = monitorEventLoopDelay({ resolution: 20 });
histogram.enable();

setInterval(() => {
  console.log("event_loop_delay_p99_ms", histogram.percentile(99) / 1e6);
  histogram.reset();
}, 10_000);
```

## 边界与常见坑

- **内存上涨不一定是泄漏**：也可能是缓存、负载或 GC 延迟。
- **CPU profile 看热点，不看猜测**。
- **日志没有请求 ID 很难串联链路**。
- **本地复现和线上负载差异很大**。
- **APM 是观测工具，不替代代码级分析。**

## 工程取舍

- 适合：先用日志和指标定位范围，再用 profile/heap snapshot 深挖。
- 谨慎：线上抓快照和 profile 有性能成本。
- 不适合或应换方案：只根据单次 benchmark 做架构决策。

## 面试 / 自测

1. `node --inspect` 有什么作用？
2. 内存泄漏通常如何定位？
3. 事件循环延迟高可能意味着什么？

## 相关文章

- [日志](./logging.md)
- [线程与进程](./threads-processes.md)
- [流](./streams.md)

## 参考

- [Node.js Docs: Debugger](https://nodejs.org/api/debugger.html)
- [Node.js Docs: perf_hooks](https://nodejs.org/api/perf_hooks.html)
- [Node.js Diagnostics](https://nodejs.org/en/learn/diagnostics)

---
title: 流
category: nodejs
---

## 一句话结论

Stream 用来分块处理数据，适合文件、网络、压缩、上传下载等大数据场景。它的核心价值是降低内存占用，并通过 backpressure 控制生产和消费速度。

## 为什么需要它

- 场景：读取大文件、HTTP 下载、上传转存、日志管道、压缩和解压。
- 不处理会怎样：一次性读入内存导致内存暴涨，生产者过快压垮消费者。

## 运行时边界

| 流类型 | 作用 | 示例 |
| ---- | ---- | ---- |
| Readable | 读数据 | `fs.createReadStream` |
| Writable | 写数据 | `fs.createWriteStream` |
| Duplex | 可读可写 | TCP socket |
| Transform | 转换数据 | gzip |

## 实现

### 复制文件

```js
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("input.log"),
  createWriteStream("output.log"),
);
```

### 转换流

```js
import { createGzip } from "node:zlib";
import { createReadStream, createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("app.log"),
  createGzip(),
  createWriteStream("app.log.gz"),
);
```

## 边界与常见坑

- **不要只监听 `data` 就忘记错误处理**：优先用 `pipeline`。
- **backpressure 是核心**：不要手动无限 `write`。
- **流不是只用于文件**：HTTP request/response 也是流。
- **对象流和字节流不同**：配置 `objectMode` 后语义变化。

## 工程取舍

- 适合：大文件、网络传输、压缩、日志处理。
- 谨慎：小数据直接 `readFile` 更简单。
- 不适合或应换方案：需要随机访问的数据不适合纯流式处理。

## 面试 / 自测

1. Stream 解决什么问题？
2. 什么是 backpressure？
3. 为什么推荐 `pipeline`？

## 相关文章

- [文件系统与路径](./files-paths.md)
- [异步编程](./async-programming.md)
- [API 开发](./api-development.md)

## 参考

- [Node.js Docs: Stream](https://nodejs.org/api/stream.html)
- [Node.js Docs: stream/promises](https://nodejs.org/api/stream.html#streampromises-api)

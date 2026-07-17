---
title: 环境变量与 CLI
category: nodejs
---

## 一句话结论

Node.js CLI 程序通过 `process.argv` 接收参数，通过 `process.env` 读取环境变量，通过 `stdin`、`stdout`、`stderr` 与终端交互。

## 为什么需要它

- 场景：构建脚本、代码生成器、部署脚本、交互式命令行工具。
- 不处理会怎样：密钥写进代码、参数解析混乱、错误输出和正常输出混在一起。

## 运行时边界

| 能力 | API | 备注 |
| ---- | ---- | ---- |
| 环境变量 | `process.env` | 值都是字符串或未定义 |
| 参数 | `process.argv` | 前两项是 node 和脚本路径 |
| 标准输入 | `process.stdin` | 可读流 |
| 标准输出 | `process.stdout` | 正常结果 |
| 标准错误 | `process.stderr` | 错误和诊断 |

## 实现

### 环境变量

```js
const port = Number(process.env.PORT || 3000);

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
```

### 参数解析

```js
const [, , command, name] = process.argv;

if (command === "hello") {
  console.log(`Hello ${name || "Node.js"}`);
} else {
  console.error("Usage: node cli.js hello <name>");
  process.exitCode = 1;
}
```

### 使用 commander

```js
import { Command } from "commander";

const program = new Command();

program
  .name("camp")
  .option("-p, --port <port>", "server port", "3000")
  .action((options) => {
    console.log(options.port);
  });

program.parse();
```

## 边界与常见坑

- **`.env` 不应提交密钥**：提交 `.env.example` 说明必需变量。
- **环境变量都是字符串**：布尔值和数字要显式转换。
- **`stdout` 和 `stderr` 分开**：便于管道和日志采集。
- **退出码要准确**：非 0 表示失败，CI 依赖它判断结果。

## 工程取舍

- 适合：开发脚本、生成器、批处理、部署辅助工具。
- 谨慎：交互式 CLI 要处理取消、默认值和非 TTY 环境。
- 不适合或应换方案：复杂长期任务应做服务或队列，不应只靠 CLI。

## 面试 / 自测

1. `process.argv` 的前两项是什么？
2. 为什么环境变量需要类型转换？
3. `stdout` 和 `stderr` 为什么要分开？

## 相关文章

- [npm](./npm.md)
- [错误处理](./error-handling.md)
- [文件系统与路径](./files-paths.md)

## 参考

- [Node.js Docs: process](https://nodejs.org/api/process.html)
- [commander](https://www.npmjs.com/package/commander)
- [dotenv](https://www.npmjs.com/package/dotenv)

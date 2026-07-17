---
title: 文件系统与路径
category: nodejs
---

## 一句话结论

Node.js 通过 `fs` 访问文件系统，通过 `path` 处理跨平台路径。写文件相关代码时要优先使用异步 API，并明确路径来源、编码、权限和清理策略。

## 为什么需要它

- 场景：读取配置、生成文件、上传处理、监听目录变化、构建工具。
- 不处理会怎样：路径在 Windows/Linux 表现不同，阻塞 I/O 拖慢服务，文件句柄泄露。

## 运行时边界

| 能力 | API | 备注 |
| ---- | ---- | ---- |
| 文件读写 | `node:fs` | callback、sync、promise 三套 API |
| 路径处理 | `node:path` | 不要手拼 `/` |
| 当前目录 | `process.cwd()` | 执行命令所在目录 |
| 模块目录 | `__dirname` / `import.meta.url` | 取决于模块系统 |

## 实现

### 读取 JSON 配置

```js
import { readFile } from "node:fs/promises";
import path from "node:path";

export async function readConfig(root = process.cwd()) {
  const file = path.join(root, "config.json");
  const text = await readFile(file, "utf8");
  return JSON.parse(text);
}
```

### 写入文件并确保目录存在

```js
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function writeReport(name, content) {
  const dir = path.resolve("reports");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), content, "utf8");
}
```

## 边界与常见坑

- **不要在服务请求路径里使用同步 I/O**：`readFileSync` 会阻塞事件循环。
- **不要手动拼路径**：使用 `path.join`、`path.resolve`。
- **用户输入路径要防穿越**：限制在允许目录内。
- **监听文件变化不等于可靠消息队列**：`chokidar` 更适合工程场景。
- **大文件优先流式处理**：避免一次性读入内存。

## 工程取舍

- 适合：配置、小文件读写、构建产物、脚本处理。
- 谨慎：上传文件、临时文件和清理失败。
- 不适合或应换方案：高并发大文件服务应使用对象存储或专门文件服务。

## 面试 / 自测

1. `process.cwd()` 和 `__dirname` 有什么区别？
2. 为什么服务端请求处理中不建议同步读文件？
3. 如何避免路径穿越？

## 相关文章

- [模块系统](./modules.md)
- [JSON 与数据交换](./json.md)
- [流](./streams.md)

## 参考

- [Node.js Docs: File system](https://nodejs.org/api/fs.html)
- [Node.js Docs: Path](https://nodejs.org/api/path.html)
- [chokidar](https://www.npmjs.com/package/chokidar)

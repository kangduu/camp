---
title: 模块系统
category: nodejs
---

## 一句话结论

Node.js 同时支持 CommonJS 和 ES Module。写 Node 代码时要明确模块边界，否则 `require`、`import`、默认导出、路径和全局变量会产生大量兼容问题。

## 为什么需要它

- 场景：引用第三方包、拆分业务文件、发布 npm 包、从 CJS 迁移到 ESM。
- 不处理会怎样：同一段代码在本地、测试和构建后表现不同。

## 运行时边界

| 模块系统 | 语法 | 常见全局 |
| ---- | ---- | ---- |
| CommonJS | `require` / `module.exports` | `__dirname`、`__filename` |
| ES Module | `import` / `export` | `import.meta.url` |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `package.json` `type` | 决定 `.js` 模块格式 | `module` 或 `commonjs` |
| `.cjs` | 强制 CommonJS | 不受 `type` 影响 |
| `.mjs` | 强制 ES Module | 不受 `type` 影响 |
| `node:` 前缀 | 内置模块明确导入 | 如 `node:fs` |

## 实现

### CommonJS

```js
const path = require("node:path");

module.exports = {
  root: path.resolve(__dirname, ".."),
};
```

### ES Module

```js
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const root = path.resolve(__dirname, "..");
```

### 动态导入

```js
async function loadConfig(file) {
  return import(file);
}
```

## 边界与常见坑

- **CJS 导入 ESM 有限制**：优先使用动态 `import()`。
- **ESM 没有直接的 `__dirname`**：用 `import.meta.url` 转换。
- **默认导出互操作容易混乱**：发布库时要测试两种消费者。
- **路径扩展名规则不同**：ESM 中相对导入通常要写清扩展名。

## 工程取舍

- 适合：新项目优先 ESM，旧项目按现状逐步迁移。
- 谨慎：库包同时输出 CJS/ESM，需要明确 `exports` 字段。
- 不适合或应换方案：不要为了“统一”一次性重写大型稳定项目。

## 面试 / 自测

1. `.js` 如何判断模块类型？
2. ESM 中如何得到当前文件目录？
3. 为什么建议内置模块写 `node:` 前缀？

## 相关文章

- [Node.js 文件执行](./execute.md)
- [npm](./npm.md)

## 参考

- [Node.js Docs: CommonJS modules](https://nodejs.org/api/modules.html)
- [Node.js Docs: ECMAScript modules](https://nodejs.org/api/esm.html)

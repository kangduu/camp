---
title: Node.js 文件执行
category: nodejs
---

## 一句话结论

Node.js 执行文件时先判断模块格式，再交给对应加载器运行。`.js` 会受最近的 `package.json` `type` 字段影响，`.cjs` 永远按 CommonJS，`.mjs` 永远按 ES Module。

## 为什么需要它

- 场景：本地运行脚本、发布 CLI、迁移 ESM、执行 TypeScript 文件。
- 不处理会怎样：`import`、`require`、`__dirname`、`import.meta.url` 混用后容易出现语法错误或运行时错误。

## 运行时边界

| 文件 | Node.js 行为 | 备注 |
| ---- | ---- | ---- |
| `.js` | 跟随最近 `package.json` 的 `type` | 默认 CommonJS |
| `.cjs` | CommonJS | 不受 `type` 影响 |
| `.mjs` | ES Module | 不受 `type` 影响 |
| `.ts` | 取决于 Node 版本和运行方式 | 项目中通常用 `tsx`、`ts-node` 或先 `tsc` |

Node.js 的模块判断是运行时加载规则，不是 TypeScript 类型系统规则。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| CommonJS | `require` / `module.exports` | 历史包生态广泛使用 |
| ES Module | `import` / `export` | 标准模块系统 |
| `type` | `package.json` 的模块类型声明 | 影响 `.js` |
| 入口文件 | 传给 `node` 命令的文件 | 如 `node src/index.js` |

## 实现

### 执行 JavaScript 文件

```bash
node index.js
node index.cjs
node index.mjs
```

当项目没有 `package.json`，或最近的 `package.json` 没有 `"type": "module"` 时，`.js` 默认按 CommonJS 处理。

```json
{
  "type": "module"
}
```

设置后，同一目录树下的 `.js` 会按 ES Module 处理，除非文件扩展名是 `.cjs`。

### 执行 TypeScript 文件

生产构建更推荐先编译：

```bash
npx tsc -p tsconfig.json
node dist/index.js
```

本地脚本可用运行器：

```bash
npx tsx scripts/build.ts
```

`tsx` 适合开发和脚本执行，但默认不等同于完整类型检查。CI 仍应单独运行：

```bash
npx tsc --noEmit
```

## 边界与常见坑

- **`__dirname` 只在 CommonJS 中直接存在**：ESM 中用 `import.meta.url` 配合 `fileURLToPath`。
- **`require` 不能直接加载 ESM**：优先使用动态 `import()` 或迁移调用方。
- **`type` 只影响 `.js`**：`.cjs` 和 `.mjs` 是强制扩展名。
- **执行 TS 不等于类型检查**：运行器为了速度可能跳过类型检查。

## 工程取舍

- 适合：`.cjs` / `.mjs` 明确跨模块边界，避免歧义。
- 谨慎：在同一个包里混用两套模块系统。
- 不适合或应换方案：生产环境直接依赖临时 TS 运行器，应优先构建后运行。

## 面试 / 自测

1. `.js` 如何判断是 CJS 还是 ESM？
2. `.cjs` 和 `.mjs` 是否受 `package.json` `type` 影响？
3. 为什么 `tsx` 运行通过不代表类型检查通过？

## 相关文章

- [Node.js 入门](./introduction.md)
- [模块系统](./modules.md)
- [npm](./npm.md)

## 参考

- [Node.js Docs: Modules](https://nodejs.org/api/modules.html)
- [Node.js Docs: ECMAScript modules](https://nodejs.org/api/esm.html)
- [TypeScript Docs: tsc CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

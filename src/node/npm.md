---
title: npm
category: nodejs
---

## 一句话结论

npm 是 Node.js 生态的包管理器和脚本入口，负责安装依赖、解析版本、运行项目脚本、发布包和查询 registry 信息。

## 为什么需要它

- 场景：安装第三方包、锁定依赖版本、运行构建脚本、发布内部工具包。
- 不处理会怎样：依赖版本漂移、脚本不可复现、全局安装污染环境。

## 运行时边界

| 能力 | 属于谁 | 备注 |
| ---- | ---- | ---- |
| `node` | Node.js runtime | 执行 JS |
| `npm` | npm CLI | 管理包和脚本 |
| `npx` | npm CLI | 临时执行包命令 |
| `package.json` | 项目元数据 | 记录脚本、依赖、模块类型 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `dependencies` | 运行时依赖 | 应随应用安装 |
| `devDependencies` | 开发期依赖 | 构建、测试、类型工具 |
| `package-lock.json` | 锁定解析结果 | 保证安装可复现 |
| semver | 语义化版本 | `^`、`~` 会影响可升级范围 |
| workspaces | 多包仓库管理 | 适合 monorepo |

## 实现

### 安装依赖

```bash
npm install express
npm install -D vitest eslint
```

### 查看包信息

```bash
npm view react version
npm view react versions --json
npm view express@latest
```

### 运行脚本

```json
{
  "scripts": {
    "dev": "node --watch src/index.js",
    "test": "node --test",
    "build": "tsc -p tsconfig.json"
  }
}
```

```bash
npm run dev
npm test
```

### 临时执行命令

```bash
npx cowsay hello
npx tsx scripts/check.ts
```

## 边界与常见坑

- **不要默认全局安装工具**：项目工具应放进 `devDependencies`，通过 scripts 或 `npx` 执行。
- **不要手改 lockfile**：让包管理器维护。
- **`^` 不是锁死版本**：实际安装仍以 lockfile 为准。
- **脚本环境是项目上下文**：npm scripts 会把 `node_modules/.bin` 加入 PATH。

## 工程取舍

- 适合：单包项目、Node CLI、库发布、快速脚本管理。
- 谨慎：大型 monorepo 需要统一 workspace 约定。
- 不适合或应换方案：团队已统一 pnpm/yarn 时，不应混用多个 lockfile。

## 面试 / 自测

1. `dependencies` 和 `devDependencies` 的区别是什么？
2. `package-lock.json` 解决什么问题？
3. `npm view`、`npm install`、`npx` 分别做什么？

## 相关文章

- [nvm](./nvm.md)
- [Node.js 文件执行](./execute.md)
- [环境变量与 CLI](./environment-cli.md)

## 参考

- [npm Docs](https://docs.npmjs.com/)
- [npm CLI: npm view](https://docs.npmjs.com/cli/commands/npm-view)
- [Semantic Versioning](https://semver.org/)

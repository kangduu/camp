---
title: tsconfig 配置
category: typescript
---

## 一句话结论

`tsconfig.json` 定义一个 TypeScript 项目的根目录、参与编译的文件和编译器选项。工程里应优先开启严格检查，并根据运行环境选择 `target`、`module`、`moduleResolution` 等输出相关配置。

## 为什么需要它

- 场景：统一团队类型检查规则；配置路径别名；控制输出目录；适配浏览器、Node.js 或构建工具。
- 不处理会怎样：命令行和编辑器检查结果不一致，文件范围失控，模块解析和运行环境不匹配。

## JS 对照

| JavaScript | TypeScript | 关键差异 |
| ---- | ---- | ---- |
| 无类型编译配置 | `tsconfig.json` | TS 需要配置检查和输出规则 |
| `node src/index.js` | `tsc -p tsconfig.json` | 先按项目配置编译 |
| `jsconfig.json` | `tsconfig.json` | JS 项目可用 jsconfig，TS 项目用 tsconfig |

`tsconfig` 影响编译期检查和输出，不会在运行时自动加载。

## 核心概念

| 配置 | 含义 | 常见建议 |
| ---- | ---- | ---- |
| `target` | 输出 JS 语法版本 | 按运行环境决定 |
| `module` | 输出模块格式 | 前端构建常用 `ESNext` |
| `moduleResolution` | 模块解析策略 | bundler 项目可用 `Bundler` |
| `strict` | 开启严格类型检查集合 | 新项目建议开启 |
| `noEmit` | 不输出文件 | 只做类型检查时开启 |
| `outDir` | 输出目录 | 库或 Node 项目常用 |
| `include` | 参与编译的文件范围 | 避免扫入无关目录 |
| `paths` | 路径别名 | 需与构建工具同步 |

## 类型推导 / 类型约束

`strict` 会影响大量推导和检查行为。开启后，`null` / `undefined`、隐式 `any`、函数参数等问题更早暴露。

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`strict` 不是单一规则，而是一组严格规则的集合。可以逐步开启，但新项目建议直接开启。

## 实现

### 前端应用常见配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "noEmit": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"]
}
```

前端项目通常由 Vite/Webpack 等工具输出代码，TypeScript 只负责类型检查，因此常见 `noEmit: true`。

### Node 库常见配置

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*.ts"]
}
```

库项目通常需要输出 `.js` 和 `.d.ts`，因此会配置 `declaration`、`outDir` 和 `rootDir`。

### 查看最终配置

```bash
npx tsc --showConfig
```

这个命令能看到 `extends` 合并后的最终配置，排查配置继承问题很有用。

## 边界与常见坑

- **`paths` 只影响 TypeScript 解析**：运行时和构建工具也要配置同样别名。
- **`skipLibCheck` 会跳过声明文件检查**：能加快检查，但可能隐藏依赖类型问题。
- **`include` 范围过大影响性能**：避免把 `dist`、脚本输出、临时目录扫进去。
- **`module` 要匹配运行环境**：Node ESM/CJS 混用时尤其容易出错。
- **直接 `tsc file.ts` 可能不读取完整项目配置**：项目命令优先使用 `tsc -p`。

## 工程取舍

- 适合：所有 TS 项目都应显式维护 `tsconfig`。
- 谨慎：老项目一次性打开所有 strict 规则，可能带来巨大迁移成本。
- 不适合或应换方案：运行时校验、打包优化、代码格式化不应交给 `tsconfig` 单独解决。

## 面试 / 自测

1. `target` 和 `module` 分别控制什么？
2. 为什么前端项目常配置 `noEmit: true`？
3. `paths` 为什么还需要构建工具配合？
4. `strict` 开启后主要带来哪些变化？
5. 如何查看最终生效的 tsconfig？

## 相关文章

- [运行 TypeScript](./cmd.md)
- [类型基础](./type-basics.md)
- [泛型](./generics.md)

## 参考

- [TypeScript: What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

---
title: 运行 TypeScript
category: typescript
---

## 一句话结论

TypeScript 不能直接改变 JavaScript 的运行时，它需要先由 `tsc`、构建工具或运行器完成类型检查和转译。学习 TS 命令时要分清：类型检查、生成 JavaScript、直接执行 TS 文件是三件不同的事。

## 为什么需要它

- 场景：本地运行一个 `.ts` 脚本；在项目中检查类型错误；把 TS 编译成浏览器或 Node.js 能执行的 JS。
- 不处理会怎样：把 `ts-node` 当生产构建工具，或以为类型检查通过就等于运行时不会出错。

## JS 对照

| JavaScript | TypeScript | 关键差异 |
| ---- | ---- | ---- |
| `node hello.js` | `tsc hello.ts && node hello.js` | TS 需要先生成 JS |
| 无类型检查步骤 | `tsc --noEmit` | 只检查类型，不输出文件 |
| 直接运行 JS | `tsx hello.ts` / `ts-node hello.ts` | 运行器负责即时转译 |

TypeScript 的类型标注会被擦除，真正执行的仍然是 JavaScript。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `tsc` | TypeScript 官方编译器 | 可检查类型并输出 JS |
| `--noEmit` | 只检查类型，不生成文件 | CI 常用 |
| `--watch` | 监听文件变化并增量检查 | 开发时常用 |
| `ts-node` | Node.js 中直接运行 TS 的工具 | 更适合脚本和开发 |
| `tsx` | 现代 TS/TSX 运行器 | 常用于脚本和 Node 项目 |
| `tsconfig.json` | TypeScript 项目配置 | 控制输入文件和编译选项 |

## 类型推导 / 类型约束

命令行不会改变类型系统规则。`tsc` 会根据源文件、`tsconfig.json` 和依赖声明文件建立类型程序，然后报告类型错误。`noEmitOnError` 可以控制有类型错误时是否继续输出 JS。

## 实现

### 安装与检查

```bash
npm install --save-dev typescript
npx tsc --version
```

### 编译单文件

```bash
npx tsc hello.ts
node hello.js
```

### 只做类型检查

```bash
npx tsc --noEmit
```

### 监听变化

```bash
npx tsc --watch --noEmit
```

### 直接运行 TS 脚本

```bash
npm install --save-dev tsx
npx tsx hello.ts
```

`ts-node` 也能执行 TS 文件，但不同项目的 ESM/CommonJS 配置会影响行为。新脚本优先考虑 `tsx`，已有项目按项目约定。

## 边界与常见坑

- **全局安装不是必须**：项目内安装并用 `npx` 或 npm scripts 更稳定。
- **`ts-node` 不等于生产构建**：生产代码通常仍由 `tsc`、Vite、Webpack、tsup 等工具处理。
- **类型检查不保证运行时安全**：外部输入仍需运行时校验。
- **ESM/CommonJS 会影响执行器配置**：看 `package.json` 的 `type` 和 `tsconfig` 的 `module`。
- **`tsc file.ts` 可能绕开项目配置**：项目中优先直接运行 `tsc -p tsconfig.json` 或 `tsc --noEmit`。

## 工程取舍

- 适合：`tsc --noEmit` 做 CI 类型检查，`tsx` 做本地脚本，构建工具做应用转译。
- 谨慎：全局安装、多套运行器混用、忽略项目 `tsconfig`。
- 不适合或应换方案：需要运行时类型安全时，使用 Zod、Valibot 等 schema 校验库配合 TypeScript。

## 面试 / 自测

1. `tsc --noEmit` 和 `tsc` 的区别是什么？
2. 为什么说 TypeScript 类型会被擦除？
3. `ts-node` / `tsx` 更适合什么场景？
4. 为什么项目中不建议依赖全局 `typescript`？
5. `tsc hello.ts` 和 `tsc -p tsconfig.json` 有什么差别？

## 相关文章

- [tsconfig 配置](./tsconfig.md)
- [类型基础](./type-basics.md)

## 参考

- [TypeScript Handbook: The TypeScript CLI](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [ts-node](https://www.npmjs.com/package/ts-node)
- [tsx](https://www.npmjs.com/package/tsx)

---
title: TypeScript 模块与命名空间
category: typescript
---

## 一句话结论

现代 TypeScript 项目优先使用 ES Module；`namespace` 主要用于声明文件、全局扩展或维护旧代码。模块解决文件级依赖，命名空间解决全局作用域中的名字组织，两者不要混用成新的业务架构。

## 为什么需要它

- 场景：组织 TS 文件、导入导出类型、写声明文件、扩展全局类型、维护历史命名空间代码。
- 不处理会怎样：模块格式和运行环境不匹配，类型导入污染运行时代码，或者用 namespace 重新发明模块系统。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `import { x } from "./x.js"` | `import { x } from "./x"` | TS 可解析 `.ts` 和声明文件 |
| 无类型导入 | `import type { User } from "./types"` | 类型导入会被擦除 |
| 全局对象挂属性 | `declare global { interface Window { ... } }` | TS 可声明全局类型扩展 |
| IIFE 模拟命名空间 | `namespace App {}` | 旧式组织方式，现代项目少用 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 外部模块 | 有 `import` / `export` 的文件 | 现代项目主流 |
| 类型导入 | 只导入类型 | `import type` |
| 命名空间 | TS 的内部模块历史语法 | 编译后可能生成对象包装 |
| 声明文件 | `.d.ts` 类型描述 | 不提供实现 |
| Ambient Module | 为外部模块声明类型 | `declare module "pkg"` |
| Global Augmentation | 扩展全局类型 | `declare global` |

## 类型推导 / 类型约束

TypeScript 会根据 `module`、`moduleResolution`、`package.json` 和文件扩展名解析模块。类型导入和普通导入的区别会影响是否生成运行时代码。

```ts
import type { User } from "./types";
import { createUser } from "./user-service";

const user: User = createUser();
```

`User` 只在类型位置使用，编译后不会生成对应导入。

## 实现

### ES Module

```ts
// user.ts
export interface User {
  id: string;
  name: string;
}

export function createUser(name: string): User {
  return { id: crypto.randomUUID(), name };
}
```

```ts
// app.ts
import { createUser } from "./user";
import type { User } from "./user";

const user: User = createUser("Ada");
```

### Ambient Module

```ts
declare module "legacy-lib" {
  export function parse(input: string): unknown;
}
```

这只告诉 TS 有一个名为 `legacy-lib` 的模块，并不安装或实现它。

### Global Augmentation

```ts
export {};

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}
```

文件里加 `export {}` 是为了让它成为模块，避免全局声明写法混乱。

## 边界与常见坑

- **`import type` 不能导入运行时值**：只用于类型位置。
- **路径别名不是运行时能力**：需要构建工具和测试工具同步。
- **命名空间不适合作为现代模块替代品**：优先 ES Module。
- **声明文件不提供实现**：类型能过，运行时仍可能找不到模块。
- **全局扩展要集中管理**：散落的 `declare global` 难排查来源。

## 工程取舍

- 适合：ES Module 组织业务代码，声明文件描述外部边界。
- 谨慎：在应用代码里新增 namespace。
- 不适合或应换方案：大型业务模块划分用文件模块、包边界和路径别名，不用 namespace。

## 面试 / 自测

1. `import type` 和普通 `import` 有什么区别？
2. `.d.ts` 文件是否提供运行时实现？
3. namespace 和 ES Module 如何选择？
4. 如何扩展 `window` 类型？
5. `paths` 配置为什么不能单独解决运行时别名？

## 相关文章

- [tsconfig 配置](./tsconfig.md)
- [TypeScript 入门与 JS 互操作](./introduction.md)
- [TypeScript 接口](./interfaces.md)

## 参考

- [TypeScript Handbook: Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [TypeScript Handbook: Namespaces and Modules](https://www.typescriptlang.org/docs/handbook/namespaces-and-modules.html)
- [TypeScript Handbook: Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

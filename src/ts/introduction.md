---
title: TypeScript 入门与 JS 互操作
category: typescript
---

## 一句话结论

TypeScript 是 JavaScript 的类型化超集：合法 JavaScript 通常也是合法 TypeScript，TS 在编译期增加类型检查、编辑器提示和重构能力，最终仍输出 JavaScript 运行。

## 为什么需要它

- 场景：维护大型前端项目、给接口和组件建立契约、从 JS 项目逐步迁移到 TS。
- 不处理会怎样：类型约定只能靠文档和测试维护，重构时更容易漏改字段、参数和返回值。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `function greet(name) {}` | `function greet(name: string): string {}` | TS 增加参数和返回值约束 |
| `const user = { id: 1 }` | `const user: User = { id: 1 }` | TS 可声明对象结构 |
| `import { add } from "./math.js"` | `import { add } from "./math"` | TS 可解析 `.ts`、`.d.ts` 和路径配置 |

类型标注主要在编译期生效。除 `enum`、装饰器元数据等特殊情况外，类型本身不会留在运行时代码里。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 超集 | TypeScript 包含 JavaScript 语法 | TS 代码需要转译或由运行器处理 |
| 类型擦除 | 类型信息不进入运行时 | `interface`、`type` 编译后消失 |
| `.d.ts` | 声明文件 | 描述 JS 包或全局变量的类型 |
| 渐进迁移 | 允许 JS 与 TS 共存 | 依赖 `allowJs`、声明文件和边界收窄 |
| 互操作 | TS 调用 JS、JS 调用 TS 输出 | 要关注模块格式和运行时行为 |

## 类型推导 / 类型约束

TypeScript 不要求所有地方都写类型。局部变量通常交给推导，模块边界、函数参数、外部输入和公共 API 更适合显式标注。

```ts
const name = "Ada";
// const name: "Ada"

let count = 1;
// let count: number
```

## 实现

### 最小迁移

```json
{
  "compilerOptions": {
    "allowJs": true,
    "checkJs": false,
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

先允许 JS 文件进入项目，再逐步把关键模块改成 `.ts`。如果要检查 JS，可配合 JSDoc 和 `checkJs`。

### 为 JS 包补声明

```ts
declare module "legacy-lib" {
  export function createClient(options: { baseURL: string }): {
    get(path: string): Promise<unknown>;
  };
}
```

声明文件只描述类型，不提供运行时实现。运行时仍必须真实安装并加载 `legacy-lib`。

## 边界与常见坑

- **TS 不做运行时校验**：接口返回值、用户输入仍需 schema 或手写检查。
- **类型通过不等于代码可运行**：模块格式、路径别名、运行环境仍可能出错。
- **不要一开始铺满 `any`**：迁移期可以局部使用，但应限制在边界。
- **声明文件可能说谎**：第三方类型和真实运行时不一致时，运行时仍会崩。
- **路径别名要多处同步**：`tsconfig.paths`、Vite/Webpack、测试工具都要配置。

## 工程取舍

- 适合：中大型项目、多人协作、组件库、SDK、需要长期维护的业务系统。
- 谨慎：小脚本或原型验证中引入完整 TS 工程，可能增加启动成本。
- 不适合或应换方案：需要运行时强校验时，用 Zod、Valibot、JSON Schema 等配合 TS。

## 面试 / 自测

1. 为什么说 TypeScript 是 JavaScript 的超集？
2. 类型擦除是什么意思？
3. `.d.ts` 文件解决什么问题？
4. TS 和 JS 混合迁移有哪些关键配置？
5. 为什么 TS 类型不能替代运行时校验？

## 相关文章

- [运行 TypeScript](./cmd.md)
- [tsconfig 配置](./tsconfig.md)
- [类型基础](./type-basics.md)

## 参考

- [roadmap.sh: TypeScript Roadmap](https://roadmap.sh/typescript)
- [TypeScript Handbook: The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- [TypeScript Handbook: TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

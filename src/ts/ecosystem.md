---
title: TypeScript 生态与工程实践
category: typescript
---

## 一句话结论

TypeScript 生态不只包含语言本身，还包括格式化、Lint、构建、测试、运行时校验和框架集成。工程实践的目标是让类型检查、代码质量和运行时行为形成一致闭环。

## 为什么需要它

- 场景：前端应用、Node 服务、组件库、monorepo、CI 类型检查、接口数据校验。
- 不处理会怎样：类型能过但构建失败，路径别名不一致，外部数据无校验，团队规则靠人工维护。

## JS 对照

| JavaScript 工程 | TypeScript 工程 | 差异 |
| ---- | ---- | ---- |
| ESLint 检查 JS 语法 | typescript-eslint 检查类型相关规则 | 可启用类型感知 lint |
| Babel/Vite 转 JS | Vite/esbuild/SWC 处理 TS 转译 | 可能只转译不类型检查 |
| Jest/Vitest 跑测试 | 测试工具需理解 TS | 配置 transform 或使用原生支持 |
| 手写数据校验 | Zod/Valibot + 类型推导 | 运行时校验与静态类型协作 |

## 核心概念

| 主题 | 作用 | 常见工具 |
| ---- | ---- | ---- |
| Formatting | 统一代码格式 | Prettier |
| Linting | 发现代码和类型风格问题 | ESLint、typescript-eslint |
| Build Tools | 转译和打包 | Vite、Webpack、tsup、SWC、esbuild |
| Type Checking | 编译期类型检查 | `tsc --noEmit` |
| Runtime Validation | 外部输入校验 | Zod、Valibot、io-ts |
| Declaration Emit | 输出 `.d.ts` | `declaration: true` |
| Framework Integration | 框架 TS 约定 | React、Vue、Angular、NestJS |

## 类型推导 / 类型约束

构建工具不一定做类型检查。很多工具只擦除类型并快速输出 JS，因此 CI 中仍应保留 `tsc --noEmit` 或专门的类型检查步骤。

```bash
npx tsc --noEmit
npx eslint src --ext .ts,.tsx
```

## 实现

### package scripts

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx",
    "build": "vite build"
  }
}
```

### 运行时校验

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
});

type User = z.infer<typeof UserSchema>;

function parseUser(input: unknown): User {
  return UserSchema.parse(input);
}
```

TypeScript 负责静态类型，Zod 负责运行时验证，两者职责互补。

### 库项目输出声明

```json
{
  "compilerOptions": {
    "declaration": true,
    "emitDeclarationOnly": false,
    "outDir": "dist"
  }
}
```

组件库或工具库应输出 `.d.ts`，让调用方获得类型提示。

## 边界与常见坑

- **Vite/esbuild 转译 TS 不等于类型检查**：要单独跑 `tsc --noEmit`。
- **Lint 类型感知规则需要项目配置**：会更慢，但能发现更深层问题。
- **外部输入必须运行时校验**：类型声明不能保证接口真实返回。
- **库项目要关注声明文件质量**：只发 JS 不发 `.d.ts` 会损害使用体验。
- **路径别名要同步**：TS、构建、测试、运行时都要理解别名。

## 工程取舍

- 适合：将 `typecheck`、`lint`、`test` 放进 CI。
- 谨慎：一次性打开所有严格 lint 规则，可能造成迁移阻塞。
- 不适合或应换方案：类型系统不能替代单元测试、集成测试和运行时监控。

## 面试 / 自测

1. 为什么构建成功不一定代表类型检查通过？
2. `typescript-eslint` 相比普通 ESLint 增加了什么？
3. 为什么外部输入需要运行时 schema？
4. 库项目为什么要输出 `.d.ts`？
5. TypeScript 项目 CI 通常包含哪些步骤？

## 相关文章

- [运行 TypeScript](./cmd.md)
- [tsconfig 配置](./tsconfig.md)
- [TypeScript 入门与 JS 互操作](./introduction.md)

## 参考

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [typescript-eslint](https://typescript-eslint.io/)
- [Vite: TypeScript](https://vite.dev/guide/features.html#typescript)
- [Zod](https://zod.dev/)

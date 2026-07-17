---
title: TypeScript 进阶类型
category: typescript
---

## 一句话结论

进阶类型用映射类型、条件类型、字面量类型、模板字面量类型和递归类型，把类型系统当作编译期数据转换工具。它们适合封装公共类型能力，但不应把业务逻辑写成难以维护的类型体操。

## 为什么需要它

- 场景：从接口模型生成表单模型；根据事件名推导 payload；递归处理嵌套配置；封装库级类型工具。
- 不处理会怎样：类型变体重复维护，公共库无法给调用方提供精确提示。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `Object.keys(obj).map(...)` | 映射类型 `[K in keyof T]` | TS 在类型层遍历 key |
| `if type matches` | 条件类型 `T extends U ? X : Y` | 编译期类型分支 |
| 字符串拼接 | 模板字面量类型 `` `on${Capitalize<K>}` `` | 编译期生成字符串类型 |

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 映射类型 | 遍历 key 生成新对象类型 | `[K in keyof T]` |
| 条件类型 | 根据兼容关系选择分支 | `T extends string ? A : B` |
| 字面量类型 | 用具体值作为类型 | `"open"`、`1`、`true` |
| 模板字面量类型 | 拼接字符串字面量类型 | `` `${K}Changed` `` |
| 递归类型 | 类型别名引用自身 | JSON、树结构 |
| 分布式条件类型 | 联合类型逐项计算 | `T extends unknown ? ...` |

## 类型推导 / 类型约束

条件类型中裸类型参数遇到联合类型会分布：

```ts
type ToArray<T> = T extends unknown ? T[] : never;

type Result = ToArray<string | number>;
// type Result = string[] | number[]
```

如果不想分布，用元组包裹：

```ts
type ToArrayNonDist<T> = [T] extends [unknown] ? T[] : never;

type Result = ToArrayNonDist<string | number>;
// type Result = (string | number)[]
```

## 实现

### 映射类型

```ts
type ReadonlyForm<T> = {
  readonly [K in keyof T]: T[K];
};

type OptionalForm<T> = {
  [K in keyof T]?: T[K];
};
```

### 条件类型

```ts
type MessageOf<T> = T extends { message: infer M } ? M : never;

type A = MessageOf<{ message: string }>;
// type A = string
```

### 模板字面量类型

```ts
type EventName<T extends string> = `${T}Changed`;

type UserEvents = EventName<"name" | "email">;
// type UserEvents = "nameChanged" | "emailChanged"
```

### 递归类型

```ts
type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };
```

## 边界与常见坑

- **进阶类型会增加编译成本**：递归过深可能触发类型实例化过深错误。
- **不要把业务流程写进类型系统**：类型应服务 API 清晰度。
- **分布式条件类型容易意外分裂联合**：需要时用 `[T]` 包裹。
- **模板字面量类型只处理类型层字符串**：运行时仍需真实拼接或校验。
- **递归类型要有收敛边界**：否则错误信息和性能都会变差。

## 工程取舍

- 适合：库类型、SDK 类型、事件系统、表单/接口类型派生。
- 谨慎：业务代码中过度嵌套条件类型和递归类型。
- 不适合或应换方案：复杂运行时转换写普通函数；复杂校验用 schema。

## 面试 / 自测

1. 映射类型如何遍历对象 key？
2. 条件类型什么时候会分布？
3. 如何阻止分布式条件类型？
4. 模板字面量类型适合什么场景？
5. 递归类型有什么风险？

## 相关文章

- [泛型](./generics.md)
- [infer 推断](./infer.md)
- [工具类型](./utility-types.md)

## 参考

- [TypeScript Handbook: Creating Types from Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [TypeScript Handbook: Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Handbook: Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)

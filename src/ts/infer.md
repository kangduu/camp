---
title: infer 推断
category: typescript
---

## 一句话结论

`infer` 只能出现在条件类型的 `extends` 子句中，用来从已匹配的类型结构里声明并提取一个局部类型变量。它适合实现 `ReturnType`、`Parameters`、`Awaited` 这类类型工具。

## 为什么需要它

- 场景：从函数类型中拿返回值；从 Promise 中拿最终值；从数组中拿元素类型；从对象包装类型中提取内部类型。
- 不处理会怎样：只能手动传入额外类型参数，工具类型复用性差，也容易让调用方重复写类型。

## JS 对照

| JavaScript | TypeScript | 关键差异 |
| ---- | ---- | ---- |
| `fn()` 运行后拿返回值 | `T extends (...args: any[]) => infer R ? R : never` | TS 在编译期提取返回值类型 |
| `array[0]` 拿元素值 | `T extends readonly (infer Item)[] ? Item : never` | TS 提取数组元素类型 |
| `await promise` 拿结果值 | `T extends Promise<infer U> ? U : T` | TS 提取 Promise 包裹的类型 |

`infer` 不会生成运行时代码，它只在类型系统中工作。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 条件类型 | `T extends U ? X : Y` | 根据类型兼容关系分支 |
| `infer` | 在匹配位置声明待推断类型变量 | 只能写在 `extends` 右侧结构中 |
| 分布式条件类型 | 联合类型逐项进入条件类型 | `T extends unknown ? ...` 常见 |
| 约束 | 限制泛型可接受范围 | 如 `T extends (...args: any[]) => unknown` |

## 类型推导 / 类型约束

`infer R` 的作用域只在当前条件类型的 true 分支中。它会遮蔽外部同名类型别名。

```ts
type R = { name: string };
type PickSelf<T> = T extends infer R ? R : never;

type Result = PickSelf<{ phone: string }>;
// type Result = { phone: string }
```

这里的 `infer R` 是新的局部类型变量，不是外部的 `type R`。

## 实现

### 实现 ReturnType

```ts
type MyReturnType<T extends (...args: never[]) => unknown> =
  T extends (...args: never[]) => infer R ? R : never;

function greeting(name: string) {
  return `Hello, ${name}`;
}

type GreetingReturn = MyReturnType<typeof greeting>;
// type GreetingReturn = string
```

### 实现 Awaited 的核心思路

```ts
type MyAwaited<T> = T extends PromiseLike<infer U>
  ? MyAwaited<U>
  : T;

type A = MyAwaited<Promise<Promise<number>>>;
// type A = number
```

官方 `Awaited` 还处理了更多边界。教学时理解递归拆 Promise 即可。

### 提取函数第一个参数

```ts
type FirstArg<T extends (...args: never[]) => unknown> =
  T extends (first: infer F, ...args: never[]) => unknown ? F : never;

type A = FirstArg<(id: number, name: string) => void>;
// type A = number
```

### 提取数组元素

```ts
type ElementOf<T extends readonly unknown[]> =
  T extends readonly (infer Item)[] ? Item : never;

type A = ElementOf<string[]>;
// type A = string

type B = ElementOf<readonly [1, 2, 3]>;
// type B = 1 | 2 | 3
```

## 边界与常见坑

- **`infer` 只能写在条件类型中**：`type T = infer R` 是非法的。
- **不要默认返回 `any`**：工具类型失败时优先用 `never` 或保留原类型，避免污染类型安全。
- **函数约束不要写成 `Function`**：`Function` 过宽，不能表达参数和返回值。
- **联合类型会分布**：`T extends ...` 中的裸类型参数会对联合类型逐项运算。
- **重载函数只会按最后一个签名推断**：这是条件类型推断的常见限制。

## 工程取舍

- 适合：封装通用工具类型、从框架类型中提取参数、减少重复类型声明。
- 谨慎：类型体操过深会让错误信息难懂，影响团队维护。
- 不适合或应换方案：简单业务类型直接写清楚即可，不必强行用 `infer`。

## 面试 / 自测

1. `infer` 能写在哪里？
2. 如何实现 `ReturnType`？
3. 为什么工具类型失败时不建议返回 `any`？
4. 如何提取数组元素类型？
5. 联合类型进入条件类型时为什么会分布？

## 相关文章

- [泛型](./generics.md)
- [类型基础](./type-basics.md)
- [satisfies 和 as](./satisfies-as.md)

## 参考

- [TypeScript Handbook: Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [TypeScript Handbook: Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

---
title: TypeScript 类型收窄
category: typescript
---

## 一句话结论

类型收窄是 TypeScript 根据运行时判断，把宽泛类型缩小成更具体类型的过程。它让联合类型可安全使用，是写好业务分支、错误处理和可辨识联合的核心。

## 为什么需要它

- 场景：处理 `unknown` 输入、联合类型参数、接口返回的多种状态、DOM 查询结果。
- 不处理会怎样：只能频繁断言，隐藏真实错误；或者编译器无法确认属性和方法是否存在。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `typeof value === "string"` | 同样写法，TS 收窄为 `string` | 运行时代码相同，类型更精确 |
| `value instanceof Date` | 同样写法，TS 收窄为 `Date` | 类实例判断能影响类型 |
| `"id" in value` | 同样写法，TS 收窄对象分支 | 适合对象联合类型 |
| `switch (state.type)` | 可辨识联合穷尽检查 | TS 能检查漏分支 |

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| `typeof` 收窄 | 按 JS 基本类型判断 | `string`、`number`、`boolean` |
| `instanceof` 收窄 | 按原型链判断实例 | `value instanceof Date` |
| `in` 收窄 | 判断属性是否存在 | `"error" in result` |
| 真值收窄 | 通过 `if (value)` 排除假值 | 谨慎处理空字符串和 0 |
| 类型谓词 | 自定义类型守卫函数 | `value is User` |
| 可辨识联合 | 用公共字面量字段区分分支 | `type: "success"` |

## 类型推导 / 类型约束

TypeScript 会沿控制流分析变量类型。进入 `if` 分支后，变量类型会被缩小；离开分支后，类型会根据可能路径合并。

```ts
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return value.toFixed(2);
}
```

在 `if` 分支里 `value` 是 `string`，在剩余分支里就是 `number`。

## 实现

### 自定义类型守卫

```ts
type User = {
  id: number;
  name: string;
};

function isUser(value: unknown): value is User {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return typeof record.id === "number" && typeof record.name === "string";
}

function print(value: unknown): string {
  if (isUser(value)) {
    return value.name;
  }

  return "unknown";
}
```

类型谓词 `value is User` 告诉编译器：当函数返回 `true` 时，入参可以视为 `User`。

### 可辨识联合

```ts
type RequestState =
  | { type: "idle" }
  | { type: "loading" }
  | { type: "success"; data: string[] }
  | { type: "error"; message: string };

function render(state: RequestState): string {
  switch (state.type) {
    case "idle":
      return "未开始";
    case "loading":
      return "加载中";
    case "success":
      return state.data.join(",");
    case "error":
      return state.message;
    default:
      return assertNever(state);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unexpected state: ${JSON.stringify(value)}`);
}
```

新增联合分支但忘记处理时，`assertNever(state)` 会触发类型错误。

## 边界与常见坑

- **真值判断会误伤合法值**：`if (value)` 会排除 `""`、`0`、`false`。
- **`typeof null` 是 `"object"`**：对象判断必须排除 `null`。
- **`in` 只说明属性存在，不说明属性值类型正确**。
- **类型守卫必须真实可靠**：错误实现会欺骗编译器。
- **断言不是收窄**：`as User` 只是跳过检查，不会验证数据。

## 工程取舍

- 适合：处理联合类型、外部输入、状态机、错误对象。
- 谨慎：手写复杂类型守卫容易遗漏字段。
- 不适合或应换方案：复杂接口数据用 Zod、Valibot 等 schema 库生成运行时校验和静态类型。

## 面试 / 自测

1. TypeScript 支持哪些常见收窄方式？
2. 为什么 `typeof value === "object"` 后还要判断 `value !== null`？
3. 类型谓词 `value is User` 表示什么？
4. 可辨识联合如何做穷尽检查？
5. `if (value)` 有哪些误判风险？

## 相关文章

- [类型基础](./type-basics.md)
- [satisfies 和 as](./satisfies-as.md)
- [infer 推断](./infer.md)

## 参考

- [TypeScript Handbook: Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript Handbook: Unions and Intersection Types](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html)

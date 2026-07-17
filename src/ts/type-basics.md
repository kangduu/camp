---
title: TypeScript 类型基础
category: typescript
---

## 一句话结论

TypeScript 类型基础是在 JavaScript 值的基础上增加编译期约束，用类型标注、联合类型、接口、类型别名等语法描述数据形状。类型不会替你生成运行时检查，但能提前暴露大量调用错误。

## 为什么需要它

- 场景：函数参数约束、接口数据建模、组件 props、配置对象、公共工具函数。
- 不处理会怎样：字段写错、参数类型不匹配、遗漏空值处理等问题只能运行后才暴露。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `let count = 1` | `let count: number = 1` | TS 可显式标注，也能自动推导 |
| `function greet(name) {}` | `function greet(name: string): string {}` | 参数和返回值受编译期约束 |
| `const user = { id: 1 }` | `interface User { id: number }` | TS 可声明对象结构 |
| `value === null` | `value: string \| null` | TS 把可能为空写进类型 |

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 基础类型 | JS 基本值对应的类型 | `string`、`number`、`boolean` |
| 数组 | 一组同类型或联合类型元素 | `string[]`、`Array<number>` |
| 元组 | 长度和位置固定的数组 | `[number, string]` |
| 联合类型 | 一个值可以是多种类型之一 | `string \| number` |
| 类型别名 | 给类型表达式命名 | `type ID = string \| number` |
| 接口 | 描述对象结构 | `interface User { id: number }` |
| `unknown` | 类型安全的未知值 | 使用前必须收窄 |
| `any` | 关闭类型检查的逃生舱 | 应限制使用范围 |
| `never` | 不可能出现的类型 | 穷尽检查、抛错函数 |

## 类型推导 / 类型约束

TypeScript 会从赋值和返回语句推导类型。简单场景优先让编译器推导，公共 API、函数参数、复杂对象边界再显式标注。

```ts
const name = "Ada";
// const name: "Ada"

let count = 1;
// let count: number

function double(value: number) {
  return value * 2;
}
// function double(value: number): number
```

`const` 字面量更容易保留精确类型，`let` 会拓宽为更通用类型。

## 实现

### 对象与接口

```ts
interface User {
  id: number;
  name: string;
  email?: string;
}

function printUser(user: User): string {
  return `${user.id}: ${user.name}`;
}
```

可选属性 `email?: string` 在读取时类型是 `string | undefined`，需要处理缺失情况。

### 类型别名与联合类型

```ts
type ID = string | number;
type Status = "idle" | "loading" | "success" | "error";

function setStatus(status: Status): void {
  console.log(status);
}

setStatus("success");
```

字面量联合适合表达有限状态，避免任意字符串进入核心流程。

### unknown 优先于 any

```ts
function parseInput(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return String(value);
}
```

`unknown` 强制你先收窄再使用；`any` 会跳过检查，把风险扩散到调用链。

## 边界与常见坑

- **类型不会运行时存在**：`interface` 和 `type` 编译后会被擦除。
- **`Object`、`object`、`{}` 不等价**：日常对象结构优先写明确属性。
- **可选属性不是一定存在**：开启 `strictNullChecks` 后要处理 `undefined`。
- **`any` 会传染**：一个 `any` 可能让后续表达式都失去类型保护。
- **数组和元组语义不同**：固定位置结构用元组，不要用普通数组凑合。

## 工程取舍

- 适合：接口数据、函数边界、组件 props、共享类型模型。
- 谨慎：给所有局部变量都手写类型，反而增加噪声。
- 不适合或应换方案：外部输入需要运行时 schema 校验，类型声明只能描述你期望的数据。

## 面试 / 自测

1. `unknown` 和 `any` 的区别是什么？
2. `type` 和 `interface` 如何选择？
3. 可选属性读取时为什么要处理 `undefined`？
4. 字面量联合类型适合什么场景？
5. TypeScript 类型为什么不能替代运行时校验？

## 相关文章

- [类型收窄](./type-narrowing.md)
- [satisfies 和 as](./satisfies-as.md)
- [泛型](./generics.md)

## 参考

- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [TypeScript Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)

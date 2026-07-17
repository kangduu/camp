---
title: TypeScript 函数
category: typescript
---

## 一句话结论

TypeScript 给函数增加参数、返回值、调用签名、重载和泛型约束，让函数调用关系在编译期可检查。写函数类型的重点是表达输入输出关系，而不是给所有局部变量补标注。

## 为什么需要它

- 场景：工具函数、事件回调、接口请求封装、高阶函数、函数重载 API。
- 不处理会怎样：参数顺序、可选参数、返回值类型靠调用者猜，重构时容易破坏调用方。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `function add(a, b) {}` | `function add(a: number, b: number): number {}` | 参数和返回值受约束 |
| `function on(type, handler) {}` | `handler: (event: Event) => void` | 回调形状可描述 |
| 运行时判断参数类型 | 函数重载 + 实现签名 | 编译期暴露多种调用方式 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 参数类型 | 限制调用参数 | `name: string` |
| 返回值类型 | 限制函数返回 | `: number` |
| 可选参数 | 参数可省略 | `value?: string` |
| 默认参数 | JS 默认值 + TS 推导 | `count = 1` |
| 剩余参数 | 多个参数收集成数组 | `...args: string[]` |
| 函数类型表达式 | 描述函数变量 | `(a: number) => string` |
| 函数重载 | 一个实现，多组调用签名 | 对调用方可见 |

## 类型推导 / 类型约束

返回值通常可由 `return` 推导，但公共函数建议显式写返回值，避免实现变化意外改变 API。

```ts
function add(a: number, b: number): number {
  return a + b;
}
```

回调参数常由上下文推导。

```ts
["a", "b"].map((item) => item.toUpperCase());
// item: string
```

## 实现

### 函数类型表达式

```ts
type Predicate<T> = (value: T, index: number) => boolean;

function filter<T>(list: T[], predicate: Predicate<T>): T[] {
  return list.filter(predicate);
}
```

### 可选参数和默认参数

```ts
function createUser(name: string, role = "user", email?: string) {
  return { name, role, email };
}
```

可选参数通常放在必选参数后面。默认参数会根据默认值推导类型。

### 函数重载

```ts
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  if (typeof value === "number") {
    return value.toFixed(2);
  }

  return value.trim();
}

format(" hello ");
format(1.2);
```

重载签名给调用方看，实现签名负责兼容所有重载分支。

## 边界与常见坑

- **可选参数不是任意位置都适合**：放在中间会让调用者难以省略。
- **返回 `void` 不等于不能返回值**：回调中 `void` 更像「调用方不关心返回值」。
- **重载不要滥用**：能用联合类型表达时，优先联合类型。
- **实现签名对外不可见**：调用方只能匹配重载签名。
- **`Function` 类型过宽**：优先写具体调用签名。

## 工程取舍

- 适合：公共工具函数、事件回调、SDK API、高阶函数。
- 谨慎：复杂重载会让错误信息难读。
- 不适合或应换方案：运行时参数校验仍需手写或 schema 库。

## 面试 / 自测

1. 函数重载由哪些签名组成？
2. `void` 返回值在回调中表示什么？
3. 为什么不推荐用 `Function` 类型？
4. 可选参数和默认参数有什么区别？
5. 什么时候联合类型比重载更合适？

## 相关文章

- [泛型](./generics.md)
- [类型收窄](./type-narrowing.md)
- [infer 推断](./infer.md)

## 参考

- [TypeScript Handbook: More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)

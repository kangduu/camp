---
title: TypeScript类型断言操作符之 satisfies 和 as
index: false
---

## 开门见山

我们还是先看结论，再细说一二。

| 特性     | as                                        | satisfies                                          |
| -------- | ----------------------------------------- | -------------------------------------------------- |
| 作用     | 类型**断言**，**强制转换**类型            | 类型**验证**，确保对象**符合**指定类型的结构       |
| 类型检查 | ❌ **不会进行**类型检查，**忽略**类型错误 | ✅ **会进行**类型检查，**确保对象符合**类型要求    |
| 行为     | 可能导致**类型不匹配**的**运行时错误**    | 如果不匹配，**TypeScript 会报错**，而不是忽略      |
| 使用场景 | 当你**知道数据的确切类型**时，强制断言    | **确保对象符合特定类型**的结构，增加**类型安全性** |

## as 类型断言

`as` 是传统的类型断言操作符，允许你将一个值明确地断言为某种类型。使用 `as` 后，TypeScript 会假定你已经知道这个值的类型，而不进行任何检查。这意味着 TypeScript 会接受你给出的类型，而不验证该类型是否符合实际数据。

### 用法

```ts
let greeting: unknown = "Hello, world!";
let getLength: number = greeting.length;
```

> 运行上述代码，将会得到报错 `error TS2339: Property 'length' does not exist on type 'unknown'.`

```ts
let greeting: unknown = "Hello, world!";
let getLength: number = (greeting as string).length; // 强制断言 greeting 为 string
```

> 在这个例子中，我们告诉 TypeScript，将 greeting 视为 `string` 类型，即使它的原始类型是 `unknown` 。但如果 greeting 的值不是字符串类型，TypeScript 依然不会报错。

### 特点

1. 类型断言：`as` 强制 TypeScript 认为一个值是某个类型，忽略类型检查。
2. 不进行验证：`as` 并不验证这个类型是否符合实际数据类型。如果类型不匹配，可能会导致运行时错误。

## satisfies 类型断言

`satisfies` 是 `TypeScript 4.9` 引入的新特性，主要用于**确保一个对象符合某个特定的类型结构**，但**不会改变该对象的类型**。这意味着，使用 `satisfies` 后，TypeScript 会验证对象是否符合指定类型的约束，但它不会像 as 那样强制改变对象的类型。

### 用法

```ts
interface Food {
  name: string;
  description?: {
    price: number;
    weight: number;
    yield?: string;
  };
}

let food = {} satisfies Food;
```

> 运行上述代码，将会得到报错 `error TS1360: Type '{}' does not satisfy the expected type 'Food'. Property 'name' is missing in type '{}' but required in type 'Food'.`

> 在这个例子中，`satisfies` 用于验证 food 是否符合 `Food` 类型。如果 food 中有任何不符合 Food 类型的字段，TypeScript 会给出错误提示。

- 正确做法

```ts
let food = { name: "tomato" } satisfies Food;
```

### 特点

1. 类型验证：`satisfie`s 用于确保对象符合指定的类型，但不会改变对象的类型。
2. 避免类型改变：与 `as` 不同，`satisfies` 保证对象的实际类型不会被强制更改。如果类型不匹配，它会报告错误，而不是强制转换。

## 示例对比

### as 示例

```ts
const num: unknown = 42;
const strLength: number = (num as string).length; // 强制断言 num 为 string，但实际上它是 number，会报错
```

### satisfies 示例

```ts
interface Food {
  name: string;
  description?: {
    price: number;
    weight: number;
    yield?: string;
  };
}

let food = { name: "tomato" } satisfies Food; // 如果 food 中缺少某些字段，TypeScript 会报错
```

## 总结

- `as`：类型断言，告诉 TypeScript 忽略类型检查，直接将某个值视为指定类型。它不会验证数据是否符合该类型，使用时需要谨慎。

- `satisfies`：类型验证，确保对象符合某个类型的结构，但不会改变对象的类型。它提供更严格的类型检查，通常用于配置文件和接口类型验证。

- 在选择使用时：如果你希望确保对象符合某个类型的结构而不改变其类型，使用 `satisfies`；如果你确定类型并希望绕过类型检查，使用 `as`

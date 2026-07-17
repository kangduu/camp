---
title: TypeScript 泛型
category: typescript
---

## 一句话结论

泛型是在类型层面声明「稍后再确定的类型参数」，让函数、接口、类和工具类型在保持类型关系的同时复用。它适合表达输入和输出之间的类型关联，而不是简单地把所有类型写成 `any`。

## 为什么需要它

- 场景：封装列表工具函数、请求响应类型、组件 props、表单模型、通用缓存。
- 不处理会怎样：使用 `any` 失去类型保护；为每种类型重复写函数；输入输出关系无法被编译器理解。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `function first(list) { return list[0] }` | `function first<T>(list: T[]): T \| undefined` | 保留元素类型和返回值关系 |
| `function get(obj, key) {}` | `function get<T, K extends keyof T>(obj: T, key: K): T[K]` | key 受对象属性约束 |
| `class Box { value }` | `class Box<T> { value: T }` | 实例携带具体类型 |

泛型参数编译后会被擦除，运行时仍然是普通 JavaScript。

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 类型参数 | 泛型中的占位类型 | `<T>` |
| 泛型约束 | 限制类型参数范围 | `<T extends { id: string }>` |
| 默认类型参数 | 没传类型时使用默认值 | `<T = unknown>` |
| `keyof` | 取对象类型的键联合 | `keyof User` |
| 索引访问类型 | 按 key 取属性类型 | `T[K]` |
| 工具类型 | 基于泛型封装的类型函数 | `Partial<T>`、`Pick<T, K>` |

## 类型推导 / 类型约束

调用泛型函数时，多数情况下不需要手动传类型参数，TypeScript 会从实参推导。

```ts
function identity<T>(value: T): T {
  return value;
}

const text = identity("hello");
// const text: "hello"
```

当类型参数之间有关系时，约束能让编译器拒绝不安全调用。

```ts
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Ada" };

const name = get(user, "name");
// const name: string
```

## 实现

### 泛型函数

```ts
function first<T>(list: readonly T[]): T | undefined {
  return list[0];
}

const a = first(["a", "b"]);
// const a: string | undefined
```

返回 `T | undefined` 比直接返回 `T` 更准确，因为空数组没有第一个元素。

### 泛型接口

```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type UserResponse = ApiResponse<{
  id: number;
  name: string;
}>;
```

### 泛型类

```ts
class Store<T> {
  private value: T;

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(value: T): void {
    this.value = value;
  }
}

const store = new Store({ theme: "dark" });
```

### 常见工具类型

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

type UserPatch = Partial<User>;
type UserPreview = Pick<User, "id" | "name">;
type RequiredUser = Required<User>;
```

## 边界与常见坑

- **泛型不是越多越好**：没有类型关系时，不需要引入类型参数。
- **不要用 `<T>(value: T) => any` 破坏关系**：返回 `any` 会让泛型失去意义。
- **约束不等于具体类型**：`T extends { id: string }` 说明有 id，但 T 可能还有其他字段。
- **默认类型参数不要默认 `any`**：优先 `unknown` 或业务默认类型。
- **泛型在运行时不存在**：不能写 `if (value instanceof T)`。

## 工程取舍

- 适合：公共工具、请求封装、组件库、数据结构、类型工具。
- 谨慎：业务局部代码过度泛型化，可能让类型比业务更难读。
- 不适合或应换方案：运行时根据类型分支时，传入构造函数、tag 字段或 schema，而不是依赖泛型。

## 面试 / 自测

1. 泛型解决的核心问题是什么？
2. `T extends keyof U` 这类约束有什么作用？
3. 为什么 `first<T>(list: T[]): T` 不够准确？
4. 泛型在运行时是否存在？
5. `unknown` 默认类型参数比 `any` 更安全吗？

## 相关文章

- [类型基础](./type-basics.md)
- [infer 推断](./infer.md)
- [satisfies 和 as](./satisfies-as.md)

## 参考

- [TypeScript Handbook: Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript Handbook: Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

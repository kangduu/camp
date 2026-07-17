---
title: TypeScript 接口
category: typescript
---

## 一句话结论

`interface` 用来描述对象、函数、类实例等结构形状，适合定义可扩展的对象契约。它和 `type` 都能描述对象，但接口支持声明合并和继承扩展，更常用于公共对象模型。

## 为什么需要它

- 场景：组件 props、接口响应、类实现约束、SDK 参数、插件扩展点。
- 不处理会怎样：对象结构靠口头约定，字段缺失或拼写错误只能到运行时暴露。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `function save(user) {}` | `function save(user: User) {}` | TS 用接口约束对象结构 |
| `class Store {}` | `class Store implements Cache {}` | TS 可检查类是否实现契约 |
| 动态扩展对象 | 接口声明合并 | TS 可扩展已有类型声明 |

## 核心概念

| 概念 | 含义 | 示例 |
| ---- | ---- | ---- |
| 属性签名 | 描述对象字段 | `name: string` |
| 可选属性 | 字段可能不存在 | `age?: number` |
| 只读属性 | 赋值后不允许修改 | `readonly id: string` |
| 索引签名 | 描述动态 key | `[key: string]: unknown` |
| 调用签名 | 描述函数对象 | `(value: string): number` |
| 继承接口 | 扩展已有接口 | `interface Admin extends User` |
| 声明合并 | 同名接口自动合并 | 常用于库类型扩展 |

## 类型推导 / 类型约束

接口本身不会生成运行时代码。它只是告诉编译器：某个值应具有哪些成员。

```ts
interface User {
  readonly id: number;
  name: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: "Ada",
};
```

读取 `user.email` 时类型是 `string | undefined`，需要处理可选情况。

## 实现

### 对象接口

```ts
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

type User = {
  id: number;
  name: string;
};

const response: ApiResponse<User> = {
  code: 0,
  message: "ok",
  data: { id: 1, name: "Ada" },
};
```

### 函数接口

```ts
interface Formatter {
  (value: string): string;
}

const trim: Formatter = (value) => value.trim();
```

### 类实现接口

```ts
interface Repository<T> {
  findById(id: string): Promise<T | null>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    return { id: Number(id), name: "Ada" };
  }
}
```

`implements` 只检查实例侧成员，不检查静态成员。

## 边界与常见坑

- **接口会被擦除**：运行时不能 `instanceof Interface`。
- **`implements` 不会自动生成属性**：类里仍要自己声明和赋值。
- **索引签名会约束所有匹配属性**：`[key: string]: string` 会要求所有字符串 key 的值都是 string。
- **声明合并是双刃剑**：方便扩展库类型，也可能让全局类型来源变得不清晰。
- **接口和类型别名不是绝对替代**：联合、元组、条件类型只能用 `type` 表达更自然。

## 工程取舍

- 适合：对象模型、可扩展公共契约、类实现约束。
- 谨慎：在业务内部过度拆接口，反而增加跳转成本。
- 不适合或应换方案：复杂联合、映射类型、条件类型优先用 `type`。

## 面试 / 自测

1. `interface` 和 `type` 的主要区别是什么？
2. 可选属性读取时为什么要处理 `undefined`？
3. `implements` 检查类的哪一侧？
4. 什么是接口声明合并？
5. 接口能在运行时判断吗？

## 相关文章

- [类型基础](./type-basics.md)
- [类型推导与类型兼容](./type-inference-compatibility.md)
- [TypeScript 类](./classes.md)

## 参考

- [TypeScript Handbook: Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [TypeScript Handbook: Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)

---
title: TypeScript 工具类型
category: typescript
---

## 一句话结论

工具类型是 TypeScript 内置的一组类型函数，用来基于已有类型派生新类型。常用的 `Partial`、`Pick`、`Omit`、`Record`、`ReturnType` 等能减少重复声明，并让类型变换更可维护。

## 为什么需要它

- 场景：更新 DTO、表单草稿、接口响应映射、函数返回值提取、权限配置表。
- 不处理会怎样：同一对象的新增、编辑、预览等变体到处重复写，字段改名时容易漏改。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `Object.assign({}, user)` | `Partial<User>` | TS 表达字段可选的类型变体 |
| `const map = {}` | `Record<Role, Permission>` | TS 约束 key 和 value |
| `fn()` 后拿值 | `ReturnType<typeof fn>` | TS 提取函数返回值类型 |

工具类型只在编译期工作，不会生成运行时代码。

## 核心概念

| 工具类型 | 作用 | 示例 |
| ---- | ---- | ---- |
| `Partial<T>` | 所有属性变可选 | 更新参数 |
| `Required<T>` | 所有属性变必选 | 归一化后数据 |
| `Readonly<T>` | 所有属性只读 | 配置快照 |
| `Pick<T, K>` | 选择部分属性 | 列表预览 |
| `Omit<T, K>` | 排除部分属性 | 创建参数去掉 id |
| `Record<K, V>` | 构造 key-value 对象 | 权限表 |
| `Exclude<T, U>` | 从联合中排除成员 | 状态过滤 |
| `Extract<T, U>` | 从联合中提取成员 | 分支提取 |
| `NonNullable<T>` | 排除 `null` / `undefined` | 已校验值 |
| `Parameters<T>` | 提取函数参数元组 | 包装函数 |
| `ReturnType<T>` | 提取函数返回值 | 复用返回类型 |
| `InstanceType<T>` | 提取构造函数实例类型 | 类工厂 |
| `Awaited<T>` | 提取 Promise 最终值 | 异步结果 |

## 类型推导 / 类型约束

工具类型本质上由泛型、条件类型、映射类型和 `infer` 组合实现。例如：

```ts
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};
```

这会遍历 `T` 的每个 key，并把属性变成可选。

## 实现

### 对象变体

```ts
interface User {
  id: string;
  name: string;
  email?: string;
}

type CreateUser = Omit<User, "id">;
type UpdateUser = Partial<Omit<User, "id">>;
type UserPreview = Pick<User, "id" | "name">;
```

### 映射表

```ts
type Role = "admin" | "editor" | "viewer";
type Permission = "read" | "write" | "delete";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["read", "write", "delete"],
  editor: ["read", "write"],
  viewer: ["read"],
};
```

### 函数类型提取

```ts
async function fetchUser(id: string) {
  return { id, name: "Ada" };
}

type FetchUserArgs = Parameters<typeof fetchUser>;
type FetchUserResult = Awaited<ReturnType<typeof fetchUser>>;
```

## 边界与常见坑

- **工具类型不是运行时转换**：`Partial<User>` 不会自动删字段或改对象。
- **`Readonly<T>` 是浅只读**：嵌套对象仍需额外处理。
- **`Record<string, T>` 可能过宽**：有限 key 优先用字面量联合。
- **过度组合会降低可读性**：复杂派生类型应拆中间别名。
- **`ReturnType<any>` 会得到 `any`**：边界类型不安全会污染结果。

## 工程取舍

- 适合：从核心模型派生请求参数、视图模型、配置表。
- 谨慎：多层嵌套工具类型让错误信息难读。
- 不适合或应换方案：运行时数据转换要写函数或 schema，不靠工具类型。

## 面试 / 自测

1. `Pick` 和 `Omit` 的区别是什么？
2. `Partial<T>` 是深可选还是浅可选？
3. `Record<K, V>` 适合什么场景？
4. 如何提取异步函数最终返回值？
5. 工具类型会改变运行时对象吗？

## 相关文章

- [泛型](./generics.md)
- [infer 推断](./infer.md)
- [进阶类型](./advanced-types.md)

## 参考

- [TypeScript Handbook: Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [TypeScript Handbook: Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

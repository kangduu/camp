---
title: 类型推导与类型兼容
category: typescript
---

## 一句话结论

类型推导是 TypeScript 根据赋值、返回值和上下文自动计算类型；类型兼容是判断一个类型能否赋值给另一个类型。TS 采用结构化类型系统，关注形状而不是声明名。

## 为什么需要它

- 场景：减少冗余类型标注、理解对象可赋值关系、分析泛型报错、设计公共 API。
- 不处理会怎样：要么写太多噪声类型，要么误以为两个不同接口名不能互相赋值。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `const x = 1` | 自动推导 `x` 类型 | TS 根据初始化值推导 |
| 对象只看运行时属性 | 结构兼容：有需要的字段即可 | TS 编译期按结构比较 |
| 回调参数靠约定 | 上下文类型推导回调参数 | TS 从调用位置推导 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 最佳通用类型 | 从多个候选类型中找共同类型 | 数组字面量常见 |
| 上下文类型 | 从使用位置反向推导 | 回调、事件处理器 |
| 类型拓宽 | 字面量变成更通用类型 | `let x = "a"` -> `string` |
| 结构类型 | 按成员形状判断兼容 | 与名义类型相对 |
| 可赋值性 | 一个类型能否赋给另一个类型 | 受 `strict` 配置影响 |

## 类型推导 / 类型约束

```ts
const literal = "ready";
// const literal: "ready"

let status = "ready";
// let status: string

const list = [1, 2, null];
// const list: (number | null)[]
```

`const` 更容易保留字面量类型，`let` 会为后续重新赋值预留空间。数组会根据元素计算最佳通用类型。

## 实现

### 上下文类型

```ts
const names = ["Ada", "Grace"];

names.map((name) => name.toUpperCase());
// name 被上下文推导为 string
```

### 结构兼容

```ts
interface Point2D {
  x: number;
  y: number;
}

const point3D = { x: 1, y: 2, z: 3 };

const point: Point2D = point3D;
```

`point3D` 具备 `Point2D` 需要的 `x` 和 `y`，所以可以赋值。额外字段不会阻止变量赋值。

### 多余属性检查

```ts
interface User {
  id: number;
  name: string;
}

const user: User = {
  id: 1,
  name: "Ada",
  // age: 30, // 对象字面量直接赋值会触发多余属性检查
};
```

多余属性检查只针对对象字面量等特定场景，它不是运行时检查。

## 边界与常见坑

- **结构兼容不看接口名称**：两个接口名字不同，只要结构匹配也能赋值。
- **对象字面量更严格**：直接赋值时会触发多余属性检查。
- **函数参数有逆变/双变历史细节**：开启 `strictFunctionTypes` 更安全。
- **类型推导不是读心术**：公共 API 和复杂返回值仍建议显式标注。
- **类型拓宽可能丢失字面量信息**：需要保留精确类型时用 `as const` 或 `satisfies`。

## 工程取舍

- 适合：局部变量和简单返回值依赖推导，减少噪声。
- 谨慎：库 API、组件 props、接口响应边界过度依赖推导。
- 不适合或应换方案：需要名义隔离时，可用品牌类型模拟。

## 面试 / 自测

1. TypeScript 是结构类型还是名义类型？
2. 什么是最佳通用类型？
3. `const` 和 `let` 对字面量推导有什么影响？
4. 为什么对象字面量直接赋值更容易报多余属性错误？
5. 什么时候应显式写返回值类型？

## 相关文章

- [类型基础](./type-basics.md)
- [satisfies 和 as](./satisfies-as.md)
- [泛型](./generics.md)

## 参考

- [TypeScript Handbook: Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
- [TypeScript Handbook: Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)

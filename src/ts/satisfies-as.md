---
title: satisfies 和 as
category: typescript
---

## 一句话结论

`as` 是类型断言，用来告诉编译器「把这个值当成某类型」；`satisfies` 是类型校验，用来确认表达式符合某类型，同时保留表达式自身的精确推导。配置对象、路由表、字面量映射优先考虑 `satisfies`。

## 为什么需要它

- 场景：校验配置对象结构；保留字面量 key 和 value 的精确类型；处理来自 DOM 或第三方库的宽泛类型。
- 不处理会怎样：滥用 `as` 会隐藏类型错误，运行时仍可能因为字段缺失或类型不匹配而报错。

## JS 对照

| JavaScript | TypeScript | 关键差异 |
| ---- | ---- | ---- |
| 无类型断言 | `value as string` | 只影响编译器，不做运行时转换 |
| 无结构校验语法 | `config satisfies Config` | 编译期校验结构，保留原始推导 |
| `if (value)` | `value!.name` | 非空断言跳过检查，不做运行时保护 |

`as`、`satisfies` 和 `!` 都不会生成运行时类型检查代码。

## 核心概念

| 语法 | 作用 | 风险 |
| ---- | ---- | ---- |
| `as Type` | 类型断言 | 可能掩盖真实类型不匹配 |
| `as unknown as Type` | 双重断言 | 风险更高，只应作为边界逃生舱 |
| `satisfies Type` | 结构校验 | TypeScript 4.9+ |
| `value!` | 非空断言 | 运行时仍可能是 `null` / `undefined` |

## 类型推导 / 类型约束

```ts
type Route = {
  path: string;
  auth?: boolean;
};

const routes = {
  home: { path: "/" },
  admin: { path: "/admin", auth: true },
} satisfies Record<string, Route>;

type RouteName = keyof typeof routes;
// type RouteName = "home" | "admin"
```

`satisfies` 校验 `routes` 符合 `Record<string, Route>`，但不会把 `routes` 直接拓宽成 `Record<string, Route>`，所以仍能拿到精确 key。

## 实现

### as：确认但不校验

```ts
const value: unknown = "hello";
const length = (value as string).length;
```

当你确实知道 `value` 是字符串时可以使用 `as`。如果值来自外部输入，更稳妥的做法是先类型收窄。

```ts
function getLength(value: unknown): number {
  if (typeof value === "string") {
    return value.length;
  }

  return 0;
}
```

### satisfies：校验且保留推导

```ts
type Food = {
  name: string;
  description?: {
    price: number;
    weight: number;
  };
};

const food = {
  name: "tomato",
  description: {
    price: 5,
    weight: 100,
  },
} satisfies Food;
```

如果缺少 `name`，或 `price` 写成字符串，TypeScript 会在声明处报错。

### 对比：类型标注、as、satisfies

```ts
type Colors = "red" | "green" | "blue";
type RGB = [number, number, number];
type Palette = Record<Colors, string | RGB>;

const paletteByAnnotation: Palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
};

const paletteBySatisfies = {
  red: [255, 0, 0],
  green: "#00ff00",
  blue: [0, 0, 255],
} satisfies Palette;
```

`paletteByAnnotation.green` 会被视为 `string | RGB`；`paletteBySatisfies.green` 能保留为更精确的字符串值相关类型，使用体验通常更好。

## 边界与常见坑

- **`as` 不是类型转换**：`value as number` 不会把字符串转成数字。
- **双重断言要谨慎**：`as unknown as T` 基本是在绕过类型系统。
- **非空断言不做运行时保护**：`node!.textContent` 在 `node` 为 `null` 时仍会崩。
- **`satisfies` 需要 TypeScript 4.9+**：旧工具链可能解析失败。
- **`satisfies` 不是运行时 schema 校验**：外部 JSON 仍需运行时校验库。

## 工程取舍

- 适合：配置对象、常量映射、路由表、主题 token 等需要校验又要保留字面量推导的场景。
- 谨慎：DOM 查询、接口返回值等运行时不确定数据，不能只靠断言。
- 不适合或应换方案：外部输入校验用 Zod、Valibot、JSON Schema 等运行时方案。

## 面试 / 自测

1. `as` 和 `satisfies` 的核心区别是什么？
2. 为什么 `satisfies` 更适合配置对象？
3. `as string` 会把运行时值转成字符串吗？
4. 非空断言有什么风险？
5. `satisfies` 从哪个 TypeScript 版本开始可用？

## 相关文章

- [类型收窄](./type-narrowing.md)
- [类型基础](./type-basics.md)
- [infer 推断](./infer.md)

## 参考

- [TypeScript 4.9 Release Notes: satisfies](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html)
- [TypeScript Handbook: Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

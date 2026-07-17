# TypeScript 与 JavaScript 语法对比

Use this reference when a TypeScript article needs a `JS 对照` section or when
the user explicitly asks for TypeScript syntax compared with JavaScript syntax.

## Output Pattern

Prefer this shape in Chinese docs:

```markdown
## JS 对照

| JavaScript | TypeScript | 关键差异 |
| ---- | ---- | ---- |
| `function fn(value) {}` | `function fn(value: string): void {}` | TS 增加参数和返回值类型，运行时仍是函数 |

TypeScript 的类型信息主要在编译期生效，除 `enum`、decorator metadata
等少数语法/配置外，类型本身不会保留到运行时。
```

## Core Comparison Table

| 主题 | JavaScript | TypeScript | 输出说明 |
| ---- | ---- | ---- | ---- |
| 变量声明 | `let name = "Ada"` | `let name: string = "Ada"` | 类型标注会被擦除 |
| 函数参数 | `function greet(name) {}` | `function greet(name: string): string {}` | 增加编译期参数和返回值约束 |
| 对象形状 | 靠约定或运行时检查 | `interface User { id: number }` | `interface` 只存在于类型系统 |
| 联合类型 | 手写分支判断 | `string | number` | 表达一个值可能有多种类型 |
| 类型收窄 | `typeof value === "string"` | 同 JS 写法，TS 同时收窄类型 | 运行时代码相同，编辑器获得更精确类型 |
| 泛型 | 依靠约定复用 | `function first<T>(list: T[]): T` | 类型参数编译后消失 |
| 字面量类型 | 字面量只是值 | `"idle" | "loading" | "done"` | 把有限状态写进类型系统 |
| 类型断言 | 无编译期断言 | `value as string` | 只告诉编译器，不做运行时转换 |
| `satisfies` | 无对应语法 | `config satisfies Config` | 校验结构且保留原对象推导类型 |
| 可选属性 | 运行时可能缺失 | `{ name?: string }` | 读取时需要处理 `undefined` |
| 非空断言 | 无对应语法 | `value!.name` | 只跳过编译检查，运行时仍可能报错 |
| 枚举 | 对象或常量模拟 | `enum Direction { Up }` | 普通 `enum` 会生成运行时代码 |
| 类型导入 | 无 | `import type { User } from "./types"` | 类型导入会被擦除 |
| 配置 | 无类型编译配置 | `tsconfig.json` | 控制检查严格度和输出目标 |

## Example Blocks

### Function Types

```js
function sum(a, b) {
  return a + b;
}
```

```ts
function sum(a: number, b: number): number {
  return a + b;
}
```

Explain: TypeScript catches `sum("1", 2)` at compile time. The emitted
JavaScript remains a normal function.

### Object Shape

```js
function printUser(user) {
  console.log(user.id, user.name);
}
```

```ts
interface User {
  id: number;
  name: string;
}

function printUser(user: User): void {
  console.log(user.id, user.name);
}
```

Explain: `interface` documents and checks object shape at compile time. It is
not available at runtime.

### Union And Narrowing

```js
function format(value) {
  if (typeof value === "string") {
    return value.trim();
  }

  return String(value);
}
```

```ts
function format(value: string | number): string {
  if (typeof value === "string") {
    return value.trim();
  }

  return String(value);
}
```

Explain: The runtime branch is JavaScript. TypeScript uses the branch to narrow
`value` from `string | number` to `string`.

### Generics

```js
function first(list) {
  return list[0];
}
```

```ts
function first<T>(list: T[]): T | undefined {
  return list[0];
}
```

Explain: `T` preserves the relationship between input element type and return
type. It does not exist in emitted JavaScript.

### as vs satisfies

```ts
type RouteConfig = Record<string, { path: string }>;

const routesByAs = {
  home: { path: "/" },
} as RouteConfig;

const routesBySatisfies = {
  home: { path: "/" },
} satisfies RouteConfig;
```

Explain: `as` changes how TypeScript treats the value and can hide mistakes.
`satisfies` checks compatibility while keeping the original inferred type.

## Common Warnings

- Do not say TypeScript "converts" runtime values. Type annotations are erased.
- Do not say `as` performs runtime casting. It is a compile-time assertion.
- Do not use `any` as a default teaching solution. Prefer `unknown` plus
  narrowing.
- Call out emitted JavaScript only when it matters, such as `enum`, decorators,
  downlevel class fields, or module output.
- For newer syntax, mention version requirements when useful:
  `satisfies` requires TypeScript 4.9; `const` type parameters require
  TypeScript 5.0.

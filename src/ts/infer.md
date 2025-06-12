---
title: infer 推断
---

## Why is the infer keyword needed in Typescript?

**使用 infer ，TS 编译器可确保您已显式声明所有类型变量**，我们看看下面的例子：

```ts{1}
type MyType<T> = T extends infer R ? R : any;

function infer(value: string) {
  return value;
}

type InferType = MyType<typeof infer>;
// type InferReturnType = (value: string) => string
```

上述代码可以推断出 InferReturnType 的类型是 `(value: string) => string`，

如果没有指定 `infer`，那么 TS 将会报错:

```ts
type MyType<T> = T extends R ? R : any;
// error : Name "R" not found
```

细心的你会发现，上述代码如果指定了 R 的类型，比如 `type R = { name: string }`，
这个时候编辑器会检查 `T` 是否[可分配](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)给 `R`

```ts{2}
type R = { name: string };
type MyType<T> = T extends R ? R : never;
type Account = MyType<{ phone: string }>;
```

上述代码 `Account` 的类型是 `type Account = never`

好了，现在我们即定义 `type R = { name: string }` 又使用 `infer R`

```ts{1,2}
type R = { name: string };
type MyType<T> = T extends infer R ? R : never;
type Account = MyType<{ phone: string }>;
```

上述代码 `Account` 的类型是 `type Account = { phone: string }` ， 这说明 `infer R` 遮蔽了同名类型 `R` 声明的类型引用。

## 巩固练习

### 实现 [ReturnType](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)

```ts{1}
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
function greeting(name: string) {
  return `Hello, ${name}`;
}
type GreetingReturn = MyReturnType<typeof greeting>;
const statement: GreetingReturn = greeting("kangduu");
console.log(statement); // Hello, kangduu

// test
type T1 = MyReturnType<() => number>; // type T1 = number
type T2 = MyReturnType<(a: number) => void>; // type T2 = void
type T3 = MyReturnType<<T>() => T>; // type T3 = unknown
type T4 = MyReturnType<<T extends U, U extends number[]>() => T>; // type T4 = number[]
declare function fn(): { a: number; b: string };
type T5 = MyReturnType<typeof fn>; // type5 = { a: number; b: string }
type T6 = MyReturnType<any>; // type T6 = any
type T7 = MyReturnType<never>; // type T7 = never
type T8 = MyReturnType<string>; // type T8 = any warning: 类型“string”不满足约束“(...args: any[]) => any”
type T9 = MyReturnType<Function>; // type T9 = any warning: 类型“Function”不满足约束“(...args: any[]) => any”。 类型“Function”提供的内容与签名“(...args: any[]): any”不匹配。
```

> ==一个通用函数类型除了使用 `Function` 外，还可以向上面那样写为 `(...args: any[]) => any`==

### 实现 [Await](https://www.typescriptlang.org/docs/handbook/utility-types.html#awaitedtype)

```ts{1}
type PromiseType<T> = T extends Promise<infer K> ? PromiseType<K> : T;

type P1 = PromiseType<Promise<string>>; // type P1 = string
type P2 = PromiseType<Promise<Promise<number>>>; // type P1 = number
type P3 = PromiseType<number | PromiseType<boolean>>; // type P1 = number | boolean
```

### 返回函数的第一个参数类型

```ts{1}
type FnFirstArg<T extends (...args: any[]) => any> = T extends (first: infer F, ...args: any[]) => any ? F : any;

type F1 = FnFirstArg<() => void>; // type F1 = unknown
type F2 = FnFirstArg<(name: string) => void>; // type F2 = string
type F3 = FnFirstArg<(phone: number, addr: string) => void>; // type F3 = number
type F4 = FnFirstArg<(p: Promise<string>) => void>; // type F4 = Promise<string>
type F5 = FnFirstArg<string>; // type F5 = any warning: 类型“string”不满足约束“(...args: any[]) => any”
```

### 返回数组每一个元素的类型

```ts{1}
type ArrayElementType<T extends any[]> = T extends (infer Each)[] ? Each : any;

type A1 = ArrayElementType<[string | number]>; // type A1 = string | number
type A2 = ArrayElementType<string[]>; // type A2 = string
type A3 = ArrayElementType<string>; // type A3 = any warning: 类型“string”不满足约束“any[]”
type A4 = ArrayElementType<[]>; // type A4 = never
```

## 总结

1. ♥♥♥ `infer` 仅在[条件类型](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)的 `extends` 子句中使用。
2. `infer R` 会遮蔽了同名类型声明的类型引用。
3. 通用函数类型还可写成 `(...args: any[]) => any`

## References

- [Type Compatibility](https://www.typescriptlang.org/docs/handbook/type-compatibility.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html#handbook-content)
- [Inferring Within Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
- [stack overflow](https://stackoverflow.com/questions/60067100/why-is-the-infer-keyword-needed-in-typescript)

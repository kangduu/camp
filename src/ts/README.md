---
title: TypeScript
icon: logos:typescript-icon
---

TypeScript 文档按 [roadmap.sh TypeScript Roadmap](https://roadmap.sh/typescript/) 的学习顺序补充，并结合官方 Handbook 组织为可逐篇阅读的中文笔记。读者默认已经熟悉 JavaScript，所以每篇都会强调 TypeScript 在编译期增加了什么约束、推导和工程能力，以及这些能力和 JavaScript 运行时行为的差异。

需要先建立一个边界：TypeScript 的类型系统主要服务于开发期和编译期。除 `enum`、装饰器元数据等少数语法或配置会影响输出外，大多数类型信息都会在编译后被擦除，运行时执行的仍然是 JavaScript。

## 推荐阅读路径

1. 先读 [TypeScript 入门](./introduction.md)、[运行 TypeScript](./cmd.md) 和 [tsconfig 配置](./tsconfig.md)，理解 TypeScript 为什么存在、如何运行、编译配置如何影响项目。
2. 再读 [类型基础](./type-basics.md)、[类型推导与类型兼容](./type-inference-compatibility.md) 和 [类型收窄](./type-narrowing.md)，建立类型声明、推导、结构化兼容和控制流分析的基础。
3. 接着读 [接口](./interfaces.md)、[函数](./functions.md) 和 [类](./classes.md)，把对象、回调、构造器、继承和访问修饰符放到真实代码中理解。
4. 然后读 [泛型](./generics.md)、[infer 推断](./infer.md)、[工具类型](./utility-types.md) 和 [高级类型](./advanced-types.md)，学习类型复用、类型提取和类型编程。
5. 最后读 [satisfies 和 as](./satisfies-as.md)、[模块与命名空间](./modules-namespaces.md)、[装饰器](./decorators.md) 和 [工程生态](./ecosystem.md)，补齐项目迁移、模块边界、实验语法和工具链取舍。

## 入门与运行

- [TypeScript 入门](./introduction.md)
- [运行 TypeScript](./cmd.md)
- [tsconfig 配置](./tsconfig.md)

## 类型基础

- [类型基础](./type-basics.md)
- [类型推导与类型兼容](./type-inference-compatibility.md)
- [类型收窄](./type-narrowing.md)
- [satisfies 和 as](./satisfies-as.md)

## 对象、函数与类

- [接口](./interfaces.md)
- [函数](./functions.md)
- [类](./classes.md)

## 泛型与类型编程

- [泛型](./generics.md)
- [infer 推断](./infer.md)
- [工具类型](./utility-types.md)
- [高级类型](./advanced-types.md)

## 模块与生态

- [模块与命名空间](./modules-namespaces.md)
- [装饰器](./decorators.md)
- [工程生态](./ecosystem.md)

## 外部资源

- [roadmap.sh TypeScript Roadmap](https://roadmap.sh/typescript/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Playground](https://www.typescriptlang.org/play/)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig/)
- [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/)

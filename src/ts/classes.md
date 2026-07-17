---
title: TypeScript 类
category: typescript
---

## 一句话结论

TypeScript 类在 JavaScript `class` 的基础上增加属性声明、访问修饰符、抽象类、构造参数属性和接口实现检查。它主要增强编译期建模能力，运行时仍遵循 JavaScript 类和原型机制。

## 为什么需要它

- 场景：领域模型、SDK 客户端、服务类、依赖注入、框架中的控制器或组件类。
- 不处理会怎样：实例属性和方法约束不清，继承关系和外部调用边界只能靠约定。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| `class User { constructor(name) {} }` | `constructor(public name: string) {}` | TS 可声明参数属性 |
| `_secret` 靠约定私有 | `private secret: string` | 编译期限制访问 |
| 基类只靠文档约定 | `abstract class Repository<T>` | TS 可声明抽象成员 |
| 类实现对象契约靠人工检查 | `implements Interface` | TS 检查实例成员 |

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 属性声明 | 类字段的类型声明 | `name: string` |
| 访问修饰符 | 限制成员访问范围 | `public`、`private`、`protected` |
| 参数属性 | 构造函数参数自动变字段 | `constructor(public id: string)` |
| 抽象类 | 不能直接实例化的基类 | `abstract` |
| `implements` | 检查类实例是否满足接口 | 不影响运行时 |
| 方法重写 | 子类重写父类方法 | 可配合 `override` |

## 类型推导 / 类型约束

开启 `strictPropertyInitialization` 后，类属性必须在声明时、构造函数中或通过确定赋值断言初始化。

```ts
class User {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}
```

## 实现

### 参数属性

```ts
class User {
  constructor(
    public readonly id: string,
    public name: string
  ) {}
}

const user = new User("1", "Ada");
```

`public readonly id: string` 同时声明构造参数和实例属性。

### implements

```ts
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}
```

### 抽象类

```ts
abstract class Repository<T> {
  abstract findById(id: string): Promise<T | null>;

  async exists(id: string): Promise<boolean> {
    return (await this.findById(id)) !== null;
  }
}
```

抽象类可以包含实现，接口只描述结构。

## 边界与常见坑

- **`private` 是 TS 编译期限制**：如果目标是运行时私有，使用 JS `#private` 字段。
- **`implements` 不检查静态侧**：它检查实例成员。
- **抽象类会生成运行时代码**：接口不会。
- **继承层级不要太深**：组合通常更容易维护。
- **`readonly` 只限制赋值，不代表深度不可变**。

## 工程取舍

- 适合：稳定领域模型、框架约定、需要共享基类行为的场景。
- 谨慎：为了类型而制造复杂继承层级。
- 不适合或应换方案：纯数据转换函数、简单对象模型可用接口和普通函数。

## 面试 / 自测

1. TS `private` 和 JS `#private` 有什么区别？
2. `implements` 检查类的哪一部分？
3. 抽象类和接口如何选择？
4. 构造参数属性解决什么问题？
5. `readonly` 是否深度不可变？

## 相关文章

- [TypeScript 接口](./interfaces.md)
- [类型基础](./type-basics.md)
- [泛型](./generics.md)

## 参考

- [TypeScript Handbook: Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)

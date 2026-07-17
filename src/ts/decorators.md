---
title: TypeScript 装饰器
category: typescript
---

## 一句话结论

装饰器是一种元编程语法，用来标注或改写类及其成员。TypeScript 同时存在新版标准装饰器和历史实验装饰器生态；写文档或项目配置时必须先明确使用哪一种语义。

## 为什么需要它

- 场景：Angular、NestJS、class-validator、依赖注入、ORM 实体、元数据驱动框架。
- 不处理会怎样：把旧装饰器和新标准装饰器混为一谈，配置、类型和运行时行为都会出错。

## JS 对照

| JavaScript 写法 | TypeScript 写法 | 差异 |
| ---- | ---- | ---- |
| 手动调用包装函数 | `@sealed class User {}` | 装饰器把包装逻辑贴在声明处 |
| 手动挂元数据 | `@Controller("/users")` | 框架可读取元数据组织运行时行为 |
| 普通类字段 | `@IsString() name: string` | 依赖库在运行时读取装饰信息 |

装饰器会影响运行时代码，不像普通类型标注会完全擦除。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 类装饰器 | 应用于类声明 | 可替换或包装类 |
| 方法装饰器 | 应用于方法 | 可包装方法行为 |
| 属性装饰器 | 应用于属性 | 常用于元数据 |
| 标准装饰器 | 新 ECMAScript 装饰器语义 | TS 5+ 支持 |
| 实验装饰器 | TypeScript 历史实现 | 依赖 `experimentalDecorators` |
| 元数据 | 运行时可读取的描述信息 | 常见于 Nest/Angular 生态 |

## 类型推导 / 类型约束

装饰器的类型签名取决于语义版本。新版标准装饰器使用 `value` 和 `context` 形式；历史实验装饰器使用 target、propertyKey、descriptor 等参数。

```ts
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  return function (this: This, ...args: Args): Return {
    console.log(String(context.name));
    return target.call(this, ...args);
  };
}
```

## 实现

### 标准方法装饰器

```ts
class Service {
  @logged
  run(message: string): string {
    return message.toUpperCase();
  }
}
```

### 历史实验装饰器配置

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

`emitDecoratorMetadata` 是 TypeScript 历史生态常见配置，通常还要配合 `reflect-metadata`。它不是所有装饰器都需要，也不是标准装饰器的默认模型。

## 边界与常见坑

- **先确认装饰器版本**：新版标准装饰器和旧实验装饰器签名不同。
- **装饰器不是类型系统功能**：它会参与运行时代码。
- **`emitDecoratorMetadata` 可能增加输出和反射依赖**。
- **框架装饰器要按框架文档配置**：Angular、NestJS、class-validator 约定不同。
- **不要为普通业务逻辑滥用装饰器**：调试路径会变复杂。

## 工程取舍

- 适合：框架约定、元数据驱动、横切关注点。
- 谨慎：库作者要明确支持的 TS 版本和装饰器语义。
- 不适合或应换方案：简单函数增强用高阶函数或组合更直接。

## 面试 / 自测

1. 装饰器和普通类型标注最大的运行时区别是什么？
2. 新版标准装饰器和旧实验装饰器为什么不能混讲？
3. `experimentalDecorators` 的作用是什么？
4. `emitDecoratorMetadata` 适合什么生态？
5. 什么时候不应该使用装饰器？

## 相关文章

- [TypeScript 类](./classes.md)
- [tsconfig 配置](./tsconfig.md)
- [TypeScript 模块与命名空间](./modules-namespaces.md)

## 参考

- [TypeScript Handbook: Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [TypeScript 5.0 Release Notes: Decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html)

---
title: ES6 核心要点
category: javascript
---

## 一句话结论

ES6 是现代 JavaScript 的重要分水岭，引入了块级作用域、箭头函数、解构、模块、Promise、类、迭代器等能力。学习 ES6 的重点不是背语法清单，而是理解它们如何改善作用域、异步、模块化和对象建模。

## 为什么需要它

现代前端框架、构建工具和浏览器 API 都默认使用 ES6+ 语法。不了解 ES6，会直接影响阅读源码、写工程代码和理解编译产物。

- 场景：Vue/React 项目、模块导入导出、异步请求、数组对象处理、类和继承。
- 不处理会怎样：误用 `var`、不理解箭头函数 `this`、不会处理 Promise、看不懂构建工具输出。

## 核心概念

| 主题 | 解决的问题 | 常见语法 |
| ---- | ---- | ---- |
| 块级作用域 | 避免 `var` 的函数作用域泄漏 | `let`、`const` |
| 函数简化 | 简化回调并保留词法 `this` | 箭头函数 |
| 数据提取 | 从数组/对象中提取值 | 解构赋值 |
| 默认值与剩余参数 | 函数参数更清晰 | 默认参数、`...args` |
| 异步抽象 | 表示未来结果 | Promise |
| 模块系统 | 显式管理依赖 | `import`、`export` |
| 对象建模 | 更清晰地写构造函数和继承 | `class`、`extends` |
| 迭代协议 | 统一遍历接口 | `for...of`、Iterator、Generator |

## 原理

ES6 的很多语法是对已有能力的标准化和增强。例如 `class` 底层仍然基于原型，箭头函数不是普通函数简写，而是没有自己的 `this`、`arguments` 和 `prototype`。

```js
const user = {
  name: "Alice",
  sayLater() {
    setTimeout(() => {
      console.log(this.name);
    }, 0);
  },
};

user.sayLater(); // 'Alice'
```

箭头函数里的 `this` 来自 `sayLater` 执行时的外层 `this`。

## 实现

### let / const

```js
for (let i = 0; i < 3; i += 1) {
  setTimeout(() => {
    console.log(i);
  }, 0);
}

const config = { theme: "dark" };
config.theme = "light";
```

`const` 限制的是绑定不能重新赋值，不代表对象内容不可变。

### 解构和默认值

```js
function createUser({ id, name = "anonymous", role = "user" }) {
  return { id, name, role };
}

const user = createUser({ id: 1, name: "Alice" });
```

对象参数配合解构和默认值，适合配置较多的函数。

### Promise

```js
function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

delay(100).then(() => {
  console.log("done");
});
```

Promise 是 `async/await` 的基础。

### class

```js
class User {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    return this.name;
  }
}

const user = new User("Alice");
console.log(user.sayName());
```

`class` 方法定义在原型上，不会为每个实例重复创建一份。

### Module

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

```js
// app.js
import { add } from "./math.js";

console.log(add(1, 2));
```

## 边界与常见坑

- **`const` 不是深度不可变**：对象内部属性仍可修改。
- **箭头函数不能作为构造函数**：不能被 `new` 调用，也没有自己的 `prototype`。
- **解构默认值只在值为 `undefined` 时生效**：`null` 不会触发默认值。
- **Promise 错误要捕获**：链式调用末尾加 `catch` 或在 `async` 函数中用 `try/catch`。
- **ES Module 是静态导入**：条件加载用动态 `import()`。

## 工程取舍

- 适合：现代前端项目和 Node.js 项目中的默认语法基础。
- 谨慎：目标环境较旧时，需要 Babel 或构建工具转译；新 API 还可能需要 polyfill。
- 应换方案：不是所有 ES 新语法都必须使用，团队规范和可读性优先于炫技。

## 面试 / 自测

1. `let`、`const` 和 `var` 的核心区别是什么？
2. 箭头函数和普通函数有哪些差异？
3. `const obj = {}` 后还能修改 `obj.a` 吗？
4. Promise 和 `async/await` 是什么关系？
5. ES Module 和 CommonJS 有哪些区别？

## 相关文章

- [JavaScript 模块](./module.md)
- [异步编程](./async.md)
- [this](./this.md)
- [原型链](./prototype.md)

## 参考

- [MDN: JavaScript reference](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference)
- [MDN: let](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/let)
- [MDN: Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: Modules](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Modules)

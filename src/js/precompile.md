---
title: 预编译原理
category: javascript
---

## 一句话结论

常说的「预编译」主要是在解释变量提升、函数提升和执行上下文创建：代码执行前，引擎会建立作用域环境，为声明分配绑定，再按执行顺序赋值。准确理解它能避免把「声明提升」误解成「代码真的被搬到顶部」。

## 为什么需要它

面试和调试中经常遇到变量在声明前访问、函数声明覆盖变量、形参与函数声明同名等问题。

- 场景：分析输出题；理解 `var`、函数声明、作用域链；排查隐式全局变量。
- 不处理会怎样：把提升理解成简单文本移动，遇到形参、函数声明和块级作用域时推理错误。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 执行上下文 | 代码执行所需的环境记录 | 全局、函数、模块 |
| 变量环境 | 保存 `var` 和函数声明等绑定 | 教学中常称 GO/AO |
| 词法环境 | 保存 `let` / `const` / 块级声明 | 存在暂时性死区 |
| 变量提升 | 声明在执行前建立绑定 | `var` 初始为 `undefined` |
| 函数提升 | 函数声明在执行前可用 | 优先级高于同名 `var` |
| 隐式全局 | 未声明直接赋值 | 严格模式会报错 |

## 原理

执行一段脚本大致经历：解析、创建执行上下文、执行代码。创建上下文时，引擎会先处理声明，再进入逐行执行。

```js
console.log(a); // undefined
var a = 1;

foo(); // 'foo'
function foo() {
  console.log("foo");
}
```

这不是代码被文本移动，而是 `a` 和 `foo` 的绑定在执行前已经建立。`var a` 的值先是 `undefined`，执行到赋值语句时才变成 `1`。

## 实现

### 全局上下文推理

```js
var a = 1;
function b() {
  return "b";
}
var c = function () {
  return "c";
};
```

执行前可以近似理解为：

```js
// 教学模型，不是引擎真实对象结构
const globalEnvironment = {
  a: undefined,
  b: function b() {
    return "b";
  },
  c: undefined,
};
```

执行后：

```js
globalEnvironment.a = 1;
globalEnvironment.c = function () {
  return "c";
};
```

### 函数上下文推理

```js
function test(a) {
  console.log(a);
  var a = 2;
  function a() {}
  console.log(a);
}

test(1);
```

简化过程：

1. 创建函数执行上下文。
2. 建立形参 `a`，值为 `1`。
3. 处理 `var a`，因为已有同名绑定，不覆盖值。
4. 处理函数声明 `function a() {}`，覆盖为函数。
5. 执行第一行输出函数。
6. 执行 `a = 2`。
7. 第二次输出 `2`。

## 边界与常见坑

- **`let` / `const` 也会建立绑定，但有暂时性死区**：声明前访问会报错，不是 `undefined`。
- **函数表达式不会整体提升**：`var fn = function () {}` 只有变量 `fn` 被提升。
- **隐式全局在严格模式下会报错**：不要依赖 `b = 123` 创建全局变量。
- **模块顶层不是浏览器全局对象属性**：ES Module 顶层声明不会挂到 `window`。
- **GO/AO 是教学模型**：真实规范使用 Environment Record 等概念，不要把模型当作实际对象。

## 工程取舍

- 适合：理解输出题、旧代码中的 `var` 和函数声明行为。
- 谨慎：在业务代码中依赖提升，会降低可读性。
- 应换方案：现代代码优先使用 `const` / `let`，声明靠近使用位置，开启严格模式和 lint 规则。

## 面试 / 自测

1. `var` 声明和函数声明的提升有什么区别？
2. 为什么函数表达式不能在赋值前调用？
3. `let` / `const` 的暂时性死区是什么？
4. 未声明变量直接赋值在严格模式下会怎样？
5. GO/AO 模型和规范真实机制有什么关系？

## 相关文章

- [执行机制](./running.md)
- [Event Loop](./event.loop.md)
- [this](./this.md)

## 参考

- [MDN: Hoisting](https://developer.mozilla.org/zh-CN/docs/Glossary/Hoisting)
- [MDN: var](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var)
- [ECMAScript: Execution Contexts](https://tc39.es/ecma262/multipage/executable-code-and-execution-contexts.html)

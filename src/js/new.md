---
title: new
category: javascript
---

## 一句话结论

`new` 用来把构造函数调用变成对象创建流程：创建新对象、连接原型、绑定 `this`、执行构造函数，并在必要时返回新对象。理解 `new` 能帮助你看懂构造函数、原型链、类和手写题。

## 为什么需要它

在 ES6 `class` 出现之前，JavaScript 主要通过构造函数和原型来创建一类具有相同结构和行为的对象。`class` 本质上仍然建立在构造函数和原型机制之上。

- 场景：创建实例对象；理解 `instanceof`；手写 `new`；理解 `class` 和继承。
- 不处理会怎样：误把构造函数当普通函数调用，导致 `this` 指向错误或属性写到全局对象上。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| 构造函数 | 约定用 `new` 调用的函数 | 首字母通常大写 |
| 实例对象 | `new` 返回的对象 | 通过原型访问共享方法 |
| `prototype` | 构造函数的原型对象 | 实例的原型会指向它 |
| `this` | 构造函数执行时的新对象 | 用来初始化实例属性 |
| 返回值规则 | 构造函数显式返回对象时会替换默认实例 | 返回原始值会被忽略 |

## 原理

执行 `new Constructor(...args)` 时，大致发生四步：

1. 创建一个空对象。
2. 将空对象的原型指向 `Constructor.prototype`。
3. 用这个对象作为 `this` 执行构造函数。
4. 如果构造函数返回对象，则返回该对象；否则返回第一步创建的对象。

```js
function User(name) {
  this.name = name;
}

User.prototype.sayName = function sayName() {
  return this.name;
};

const user = new User("Alice");

console.log(user.name); // 'Alice'
console.log(user.sayName()); // 'Alice'
console.log(user instanceof User); // true
```

## 实现

### 最小可用版

```js
function objectFactory(Constructor, ...args) {
  const instance = Object.create(Constructor.prototype);
  const result = Constructor.apply(instance, args);

  return result !== null && (typeof result === "object" || typeof result === "function")
    ? result
    : instance;
}
```

### 使用示例

```js
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.introduce = function introduce() {
  return `${this.name}: ${this.age}`;
};

const p = objectFactory(Person, "Alice", 18);

console.log(p.introduce()); // 'Alice: 18'
console.log(p instanceof Person); // true
```

`objectFactory` 的输入是构造函数和参数，输出是实例对象。它会执行构造函数，因此可能触发构造函数内部的副作用。

## 边界与常见坑

- **忘记 `new`**：普通函数调用时 `this` 不会自动指向新对象；严格模式下是 `undefined`。
- **箭头函数不能作为构造函数**：箭头函数没有 `[[Construct]]`，不能被 `new` 调用。
- **构造函数返回对象会覆盖实例**：返回原始值不会覆盖，返回对象或函数会覆盖默认实例。
- **不要把实例方法写进构造函数**：每个实例都会创建一份函数，无法复用；共享方法应放在 `prototype`。
- **`class` 必须用 `new` 调用**：直接调用类会抛 `TypeError`。

## 工程取舍

- 适合：理解原型模型、维护旧代码、实现基础类库。
- 谨慎：在新业务代码里大量手写构造函数，容易遗漏 `new` 和原型细节。
- 应换方案：现代代码可优先使用 `class` 或工厂函数；只需要数据结构时用普通对象更直接。

## 面试 / 自测

1. `new` 的执行过程有哪些步骤？
2. 构造函数显式返回对象和返回数字有什么区别？
3. 为什么箭头函数不能被 `new`？
4. `Object.create(Constructor.prototype)` 的作用是什么？
5. `new` 和 `Object.create()` 的关系是什么？

## 相关文章

- [原型链](./prototype.md)
- [this](./this.md)
- [面向对象编程思想、封装、多态](./oop.md)

## 参考

- [MDN: new operator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)
- [MDN: Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)

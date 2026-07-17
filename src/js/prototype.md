---
title: 原型链
category: javascript
---

## 一句话结论

原型链是 JavaScript 对象继承和属性查找的基础：对象本身找不到属性时，会沿着它的 `[[Prototype]]` 继续向上查找，直到 `null`。构造函数、`class`、`instanceof` 都离不开这套机制。

## 为什么需要它

如果每个对象都保存一份相同方法，会浪费内存，也不利于统一修改行为。原型让多个实例共享方法，同时仍能保留各自的实例属性。

- 场景：构造函数实例共享方法；理解 `class`；判断属性来源；维护旧式继承代码。
- 不处理会怎样：分不清实例属性和原型属性，误改共享对象，或错误理解 `instanceof` 结果。

## 核心概念

| 概念 | 含义 | 备注 |
| ---- | ---- | ---- |
| `prototype` | 函数对象上的属性，默认作为实例原型 | 箭头函数没有可用于构造的 `prototype` |
| `__proto__` | 访问对象原型的历史属性 | 教学可见，工程优先用标准 API |
| `Object.getPrototypeOf()` | 获取对象原型的标准方法 | 推荐使用 |
| `constructor` | 原型对象默认指回构造函数 | 可被手动覆盖，不适合做强判断 |
| 原型链 | 多个原型对象串联形成的查找链 | 末端是 `null` |

## 原理

```js
function User(name) {
  this.name = name;
}

User.prototype.sayName = function sayName() {
  return this.name;
};

const user = new User("Alice");

console.log(user.sayName()); // 'Alice'
console.log(Object.getPrototypeOf(user) === User.prototype); // true
console.log(Object.getPrototypeOf(User.prototype) === Object.prototype); // true
```

访问 `user.sayName` 时，查找顺序是：

1. 查 `user` 自身属性。
2. 查 `User.prototype`。
3. 查 `Object.prototype`。
4. 查到 `null` 仍没有，则得到 `undefined`。

## 实现

### 最小可用版：方法共享

```js
function Counter(initialValue = 0) {
  this.value = initialValue;
}

Counter.prototype.increment = function increment() {
  this.value += 1;
  return this.value;
};

const a = new Counter();
const b = new Counter(10);

console.log(a.increment()); // 1
console.log(b.increment()); // 11
console.log(a.increment === b.increment); // true
```

### 原型式继承

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function speak() {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function speak() {
  return `${this.name} barks`;
};

const dog = new Dog("Lucky");

console.log(dog.speak()); // 'Lucky barks'
console.log(dog instanceof Dog); // true
console.log(dog instanceof Animal); // true
```

这就是 ES5 中常见的组合继承写法。ES6 `class extends` 语法更清晰，但底层仍然依赖原型链。

## 边界与常见坑

- **不要直接修改内置原型**：例如给 `Array.prototype` 加业务方法，可能污染全局并影响第三方库。
- **`constructor` 不可靠**：手动替换 `prototype` 后如果不修正，`constructor` 会指错。
- **原型上的引用类型会被共享**：把数组或对象放在原型上，所有实例会共用同一个引用。
- **`for...in` 会枚举原型属性**：判断自有属性用 `Object.hasOwn()` 或 `hasOwnProperty`。
- **`__proto__` 是历史访问器**：理解可以，工程代码优先使用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()`。

## 工程取舍

- 适合：理解语言底层、维护构造函数代码、实现轻量共享方法。
- 谨慎：动态修改对象原型会影响性能和可读性。
- 应换方案：现代业务建模优先使用 `class`、组合函数或普通对象；复杂继承层级应尽量扁平化。

## 面试 / 自测

1. `prototype` 和 `__proto__` 分别是什么？
2. 属性查找会沿着什么顺序进行？
3. 为什么实例方法通常放在构造函数的 `prototype` 上？
4. `Object.create()` 在继承中有什么作用？
5. 原型上放引用类型属性有什么风险？

## 相关文章

- [new](./new.md)
- [this](./this.md)
- [面向对象编程思想、封装、多态](./oop.md)

## 参考

- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN: Object.getPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
